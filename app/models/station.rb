class Station < ActiveRecord::Base
  	attr_accessible :apr, :aug, :dec, :feb, :jan, :jul, :jun, :latlon, :mar, :may, :name, :nov, :oct, :place_name, :sep
	set_rgeo_factory_for_column(:latlon,
    	RGeo::Geographic.spherical_factory(:srid => 4326))
	
end
