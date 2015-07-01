angular.module('ultimateDataTableServices').
directive("udtHtmlFilter", function($filter) {
				return {
					  require: 'ngModel',
					  link: function(scope, element, attrs, ngModelController) {
					    ngModelController.$formatters.push(function(data) {
					    	var convertedData = data;
					    	  if(attrs.dtHtmlFilter == "datetime"){
					    			convertedData = $filter('date')(convertedData, Messages("datetime.format"));
					    	   }else if(attrs.dtHtmlFilter == "date"){
					    		   	convertedData = $filter('date')(convertedData, Messages("date.format"));
					    	   }else if(attrs.dtHtmlFilter == "number"){
					    		   	convertedData = $filter('number')(convertedData);
					    	   }
					    	
					    	  return convertedData;
					    });   
					  }
					};
			});