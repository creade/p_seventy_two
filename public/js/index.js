var p_72 = p_72 || {};
p_72.controllers = p_72.controllers || {};

p_72.controllers.index = function () {
    var initialize = function () {
        var viewModel = {
            temp: ko.observable(72),
            
            width:null, 
            height:null,
            projection:null,
            zoom:null,
            path:null,
            svg:null,
            g:null,

            initD3 : function() {
                 this.width = window.outerWidth;
                 this.height = 500;

                 this.projection = d3.geo.mercator()
                 .translate([0, 0])
                 .scale(this.width / 2 / Math.PI);

                 this.zoom = d3.behavior.zoom()
                 .scaleExtent([1, 8])
                 .on("zoom", this.move);

                 this.path = d3.geo.path()
                 .projection(this.projection);

                 this.svg = d3.select("body").append("svg")
                 .attr("width", this.width)
                 .attr("height", this.height)
                 .append("g")
                 .attr("id", "container")
                 .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")")
                 .call(this.zoom);

                 this.g = this.svg.append("g");

                this.svg.append("rect")
                    .attr("class", "overlay")
                    .attr("x", -this.width / 2)
                    .attr("y", -this.height / 2)
                    .attr("width", this.width)
                    .attr("height", this.height);

                d3.json("json/world-50m.json", function (error, world) {
                    viewModel.g.append("path")
                        .datum(topojson.feature(world, world.objects.countries))
                        .attr("class", "land")
                        .attr("d", viewModel.path);

                    viewModel.g.append("path")
                        .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
                            return a !== b;
                        }))
                        .attr("class", "boundary")
                        .attr("d", viewModel.path);
                });
            },

            addPath: function() {

                this.svg.selectAll("#streams").data([]).exit().remove()


                d3.json('path/'+ parseFloat(this.temp()).toFixed(1), function (collection) {
                    var arcs = viewModel.g.append("g").attr("id", "streams");
                    var neighbors = viewModel.chunk(collection.results, 2);
                    var links = _.map(neighbors, function (pair) {
                        return {
                            source: [pair[0].station[0].lon, pair[0].station[0].lat],
                            target: [pair[1].station[0].lon, pair[1].station[0].lat],
                        }
                    })
                    arcs.selectAll("path")
                        .data(links)
                        .enter().append("path")
                        .attr("fill", "none")
                        .attr("stroke", "blue")
                        .attr("stroke-width", "1.5px")
                        .attr("d", function (d) {
                            var source = viewModel.projection(d.source);
                            var target = viewModel.projection(d.target);
                            var dx = target[0] - source[0],
                                dy = target[1] - source[1],
                                dr = Math.sqrt(dx * dx + dy * dy);
                            return "M" + source[0] + "," + source[1] + "A" + dr + "," + dr + " 0 0,1 " + target[0] + "," + target[1];
                        })

                    var bounds = viewModel.svg.select("#streams")[0][0].getBBox();

                    var lowerLeft = [bounds.x , bounds.y ];
                    var upperRight = [bounds.x + bounds.width, bounds.y + bounds.height];

                    var b = [lowerLeft, upperRight];

                    // viewModel.g.append("rect")
                    //     .attr("x", upperRight[0])
                    //     .attr("y", upperRight[1])
                    //     .attr("width", upperRight[0] - lowerLeft[0])
                    //     .attr("height", upperRight[1] - lowerLeft[1])
                    //     .attr("fill", "green");



                    viewModel.g.transition().duration(750).attr("transform",
                        "translate(" + viewModel.projection.translate() + ")"
                        + "scale(" + .95 / Math.max((b[1][0] - b[0][0]) / viewModel.width, (b[1][1] - b[0][1]) / viewModel.height) + ")"
                        + "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");
                });
            },

            chunk:function(array, chunkSize) {
                var retArr = [];
                for (var i = 0; i < array.length - (chunkSize - 1); i++) {
                    retArr.push(array.slice(i, i + chunkSize));
                }
                return retArr;
            },

             move:function() {
                var t = d3.event.translate,
                    s = d3.event.scale;
                t[0] = Math.min(viewModel.width / 2 * (s - 1), Math.max(viewModel.width / 2 * (1 - s), t[0]));
                t[1] = Math.min(viewModel.height / 2 * (s - 1) + 230 * s, Math.max(viewModel.height / 2 * (1 - s) - 230 * s, t[1]));
                viewModel.zoom.translate(t);
                viewModel.g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
            }
        }

        viewModel.throttledTemp = ko.computed(function(){
                return viewModel.temp();
            }).extend({ throttle: 200 })

        viewModel.throttledTemp.subscribe(function(){
            viewModel.addPath();
        });

         var gg1 = new JustGage({
            id: "gg1",
            value : 72,
            min: -50,
            max: 120,
            gaugeWidthScale: 0.6,
            counter: true,
            decimals: 1,
            levelColors: ["#0000FF", "#FFFF00","#ff0000"],
            title: "Perpetual Temperature"
        });

        viewModel.temp.subscribe(function(newValue){
            gg1.refresh(newValue);
        });

        viewModel.initD3();
        viewModel.addPath();

       


        ko.applyBindings(viewModel);

    }


    return {
        initialize: initialize
    };
};