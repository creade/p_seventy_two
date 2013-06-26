# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'csv'

csv_text = File.read('db/noaa_data.csv')
csv = CSV.parse(csv_text, :headers => true)
csv.each do |row|
  Station.create!(
  	:name => row["name"],
  	:jan => row["jan"],
  	:feb => row["feb"],
  	:mar => row["mar"],
  	:apr => row["apr"],
  	:may => row["may"],
  	:jun => row["jun"],
  	:jul => row["jul"],
  	:aug => row["aug"],
  	:sep => row["sep"],
  	:oct => row["oct"],
  	:nov => row["nov"],
  	:dec => row["dec"],
  	:latlon => "POINT(#{row['long']} #{row['lat']})",
  	:place_name => row["place_name"],
  	)
end