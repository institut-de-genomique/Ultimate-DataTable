angular.module('ultimateDataTableServices').
//This directive convert the ngModel value to a view value and then the view value to the ngModel unit value
//The value passed to the directive must be an object with displayMeasureValue and saveMeasureValue
directive('udtConvertvalue',['udtConvertValueServices','$filter', '$parse', function(udtConvertValueServices, $filter, $parse) {
	return {
				priority:1100,
		 		require: 'ngModel',
                link: function(scope, element, attrs, ngModelController) {
                	//init service
                	var convertValues = udtConvertValueServices();
                	var property = undefined;
                	
                	if(attrs.udtConvertvalue){
                		property = $parse(attrs.udtConvertvalue)(scope);    					
    				}
                	
                	ngModelController.$formatters.push(function(value) {
                		var convertedValue = convertValues.convertValue(value, property.saveMeasureValue, property.displayMeasureValue);
        			    return convertedValue;
        			}); 
                	
                	//view to model
                	ngModelController.$parsers.push(function(value) {
                    	value = convertValues.parse(value);
                    	if(property != undefined){
	                    	value = convertValues.convertValue(value, property.displayMeasureValue, property.saveMeasureValue);
                    	}
                    	return value;
                    });                   
                }
            };
}]);