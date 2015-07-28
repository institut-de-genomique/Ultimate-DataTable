angular.module('ultimateDataTableServices').
 //Convert the date in format(view) to a timestamp date(model)
directive('udtDateTimestamp', function() {
	            return {
	                require: 'ngModel',
	                link: function(scope, ele, attr, ngModel) {
						var typedDate = "01/01/1970";//Initialisation of the date
						
	                	var convertToDate = function(date){
	                		if(date !== null && date !== undefined && date !== ""){
		                		var format = scope.udtTableFunctions.messages.Messages("date.format").toUpperCase();
		                		date = moment(date).format(format);
		                		return date;
	                		}
	                		return "";
	                	};
	                	
	                	var convertToTimestamp = function(date){
	                		if(date !== null && date !== undefined && date !== ""){
		                		var format = scope.udtTableFunctions.messages.Messages("date.format").toUpperCase();
		    					return moment(date, format).valueOf();
	                		}
	                		return "";
	    				};
						
	                	//model to view
	                	scope.$watch(
							function(){
								return ngModel.$modelValue;
							}, function(newValue, oldValue){
								//We check if the
								if(newValue !== null && newValue !== undefined && newValue !== "" && typedDate.length === 10){
									var date = convertToDate(newValue);
	    							ngModel.$setViewValue(date);
									ngModel.$render();
								}
	                    });
						
	                	//view to model
	                    ngModel.$parsers.push(function(value) {
	                    	var date = value;
							typedDate = date;//The date of the user
	                    	if(value.length === 10){//When the date is complete
	                    		date = convertToTimestamp(value);
	                    	}
							return date;
	                    });
	                }
	            }
	        });