class CreateStations < ActiveRecord::Migration
  def change
    create_table :stations do |t|
      t.string :name
      t.point :latlon, :geographic => true
      t.decimal :jan
      t.decimal :feb
      t.decimal :mar
      t.decimal :apr
      t.decimal :may
      t.decimal :jun
      t.decimal :jul
      t.decimal :aug
      t.decimal :sep
      t.decimal :oct
      t.decimal :nov
      t.decimal :dec
      t.string :place_name

      t.timestamps
    end
  end
end
