angular.module('ultimateDataTableServices').
filter('udtConvert', ['udtConvertValueServices', function(udtConvertValueServices){
    		return function(input, property){
				var convertValues = udtConvertValueServices();
				if(property != undefined){
					input = convertValues.convertValue(input, property.saveMeasureValue, property.displayMeasureValue);
				}
    			return input;
    		}
}]);