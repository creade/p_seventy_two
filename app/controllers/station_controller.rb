class StationController < ApplicationController
	include ActionController::MimeResponds
	respond_to :json 

	def show
    
    	@station = Station.find(params[:id])
  	end

  	def path
      
  		goal_tmp = params[:temp].to_f
  		months =[:jan, :feb, :mar, :apr, :may, :jun, :jul, :aug, :sep, :oct, :nov, :dec]
      ids =[-1]

      @temps = months.map{
        |month_name| 
        month = {}
        result = Station.where('id NOT IN (?)', ids).order("ABS(#{month_name.to_s} - #{goal_tmp}) ASC").limit(3).sample(1).first
        month[month_name] = result
        ids << result.id
        month
      }

      respond_with @temps

      
  	end
end
