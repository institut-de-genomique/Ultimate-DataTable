angular.module('ultimateDataTableServices').
directive("udtHtmlFilter", function($filter, udtI18n) {
				return {
					  require: 'ngModel',
					  link: function(scope, element, attrs, ngModelController) {
						  	var messagesService = udtI18n(navigator.languages || navigator.language || navigator.userLanguage);
						  
							ngModelController.$formatters.push(function(data) {
								var convertedData = data;
								  if(attrs.udtHtmlFilter === "datetime"){
									  convertedData = $filter('date')(convertedData, messagesService.Messages("datetime.format"));
							   }else if(attrs.udtHtmlFilter === "date"){
								   convertedData = $filter('date')(convertedData, messagesService.Messages("date.format"));
							   }else if(attrs.udtHtmlFilter === "number"){
								   convertedData = $filter('number')(convertedData);
								   }					    	
								  return convertedData;
							}); 
					    
					    ngModelController.$parsers.push(function(data) {
					    	var convertedData = data;
					    	   if(attrs.udtHtmlFilter === "number" && null !== convertedData && undefined !== convertedData 
					    			   && angular.isString(convertedData)){
					    		   convertedData = convertedData.replace(",",".").replace(/\u00a0/g,"");
					    		   if(!isNaN(convertedData) && convertedData !== ""){						    			   
					    			   convertedData = convertedData*1;
					    		   }else if( isNaN(convertedData) || convertedData === ""){
					    			   convertedData = null;
					    		   }
					    	   }else if(attrs.udtHtmlFilter === "date" && null !== convertedData && undefined !== convertedData 
					    			   && angular.isString(convertedData)){
					    		   if(moment && convertedData !== ""){
					    			   convertedData = moment(data, messagesService.Messages("date.format").toUpperCase()).valueOf();
					    		   }else{
					    			   convertedData = null;
					    			   console.log("mission moment library to convert string to date");
					    		   }
					    	   }
					    	   //TODO GA date and datetime quiz about timestamps
					    	  return convertedData;
					    }); 
					  }
					};
			});