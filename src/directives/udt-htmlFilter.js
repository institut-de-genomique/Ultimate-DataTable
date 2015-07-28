angular.module('ultimateDataTableServices').
directive("udtHtmlFilter", function($filter) {
				return {
					  require: 'ngModel',
					  link: function(scope, element, attrs, ngModelController) {
					    ngModelController.$formatters.push(function(data) {
					    	var convertedData = data;
					    	  if(attrs.udtHtmlFilter == "datetime"){
					    			convertedData = $filter('date')(convertedData, scope.udtTableFunctions.messages.Messages("datetime.format"));
					    	   }else if(attrs.udtHtmlFilter == "date"){
					    		   	convertedData = $filter('date')(convertedData, scope.udtTableFunctions.messages.Messages("date.format"));
					    	   }else if(attrs.udtHtmlFilter == "number"){
					    		   	convertedData = $filter('number')(convertedData);
					    	   }
					    	
					    	  return convertedData;
					    });   
					  }
					};
			});