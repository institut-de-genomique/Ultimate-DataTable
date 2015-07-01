angular.module('ultimateDataTableServices').
//This directive convert the ngModel value to a view value and then the view value to the ngModel unit value
//The value passed to the directive must be an object with displayMeasureValue and saveMeasureValue
directive('udtConvertvalue',['udtConvertValueServices', function(udtConvertValueServices) {
	return {
		require: 'ngModel',
		link: function(scope, ele, attr, ngModel) {
			//init service
			var convertValues = udtConvertValueServices();
			var property = undefined;
			
			scope.$watch(attr.convertValue, function(value){
				if(value.saveMeasureValue != undefined && value.displayMeasureValue != undefined){
					property = value;
				}
			});
			
			//model to view
			scope.$watch(
				function(){
					return ngModel.$modelValue;
				}, function(newValue, oldValue){
					if(property != undefined){
						ngModel.$setViewValue(convertValues.convertValue(newValue, property.saveMeasureValue, property.displayMeasureValue));
						ngModel.$render();
					}
			});
			
			//view to model
			ngModel.$parsers.push(function(value) {
				if(property != undefined){
					value = convertValues.convertValue(value, property.displayMeasureValue, property.saveMeasureValue);
				}
				return value;
			});
		}
	};
}]);