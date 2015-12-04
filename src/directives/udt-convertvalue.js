angular.module('ultimateDataTableServices').
//This directive convert the ngModel value to a view value and then the view value to the ngModel unit value
//The value passed to the directive must be an object with displayMeasureValue and saveMeasureValue
directive('udtConvertvalue',['udtConvertValueServices','$filter', function(udtConvertValueServices, $filter) {
	return {
                require: 'ngModel',
                link: function(scope, element, attr, ngModel) {
                	//init service
                	var convertValues = udtConvertValueServices();
                	var property = undefined;
                	
					var watchModelValue = function(){
						return scope.$watch(
									function(){
										return ngModel.$modelValue;
									}, function(newValue, oldValue){
										if(property != undefined){
											var convertedValue = convertValues.convertValue(newValue, property.saveMeasureValue, property.displayMeasureValue);
											ngModel.$setViewValue($filter('number')(convertedValue));
											ngModel.$render();
										}
								});
					};
					
                	scope.$watch(attr.udtConvertvalue, function(value){
    					if(value.saveMeasureValue != undefined && value.displayMeasureValue != undefined){
    						property = value;
    					}
    				});
                	
                	//model to view when the user go out of the input
                	element.bind('blur', function () {
                		var convertedValue = convertValues.convertValue(ngModel.$modelValue, property.saveMeasureValue, property.displayMeasureValue);
                		ngModel.$setViewValue($filter('number')(convertedValue));
						ngModel.$render();
						//We restart the watcher when the user is out of the inputs
						scope.currentWatcher = watchModelValue();
                	});
                	
					//when the user go into the input
					element.bind('focus', function () {
						//We need to disable the watcher when the user is typing
						scope.currentWatcher();
                	});
					
                	//model to view whatcher
                	scope.currentWatcher = watchModelValue();
                	
                    //view to model
                    ngModel.$parsers.push(function(value) {
                    	value = convertValues.parse(value);
                    	if(property != undefined){
	                    	value = convertValues.convertValue(value, property.displayMeasureValue, property.saveMeasureValue);
                    	}
                    	return value;
                    });
                }
            };
}]);