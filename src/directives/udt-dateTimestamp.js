angular.module('ultimateDataTableServices').
 //Convert the date in format(view) to a timestamp date(model)
directive('udtDateTimestamp', ['$filter', function($filter) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
			
			ngModelController.$formatters.push(function(data) {
				var convertedData = data;
				convertedData = $filter('date')(convertedData, Messages("date.format"));
			    return convertedData;
			}); 
	    
		    ngModelController.$parsers.push(function(data) {
		    	var convertedData = data;
	    	    if(moment && convertedData !== ""){
	    			   convertedData = moment(data, Messages("date.format").toUpperCase()).valueOf();
	    		   }else{
	    			   convertedData = null;
	    			   console.log("mission moment library to convert string to date");
	    		   }
		    	   
		    	  return convertedData;
		    }); 
			
        }
    }
}]);