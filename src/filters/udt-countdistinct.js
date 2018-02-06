angular.module('ultimateDataTableServices').
filter('udtCount', ['$parse',function($parse) {
    	    return function(array, key, distinct, context) {
    	    	if (!array || array.length === 0)return undefined;
    	    	if (!angular.isArray(array) && (angular.isObject(array) || angular.isNumber(array) || angular.isString(array) || angular.isDate(array))) array = [array];
    	    	else if(!angular.isArray(array)) throw "input is not an array, object, number or string !";
    	    	
    	    	if(key && !angular.isString(key))throw "key is not valid, only string is authorized";
    	    	
    	    	var possibleValues = [];
    	    	angular.forEach(array, function(element){
    	    		if (angular.isObject(element)) {
    	    			var currentValue = $parse(key)(element, context);
    	    			if(angular.isArray(currentValue) && currentValue.length === 1)currentValue = currentValue[0];
    	    			if(distinct && undefined !== currentValue && null !== currentValue && possibleValues.indexOf(currentValue) === -1){
       	    				possibleValues.push(currentValue);
    	    			}else if(!distinct && undefined !== currentValue && null !== currentValue){
    	    				possibleValues.push(currentValue);
    	    			}    	    			
    	    		}else if (!key && angular.isObject(value)){
    	    			throw "missing key !";
    	    		}
    	    		
    	    	});
    	    	return possibleValues.length;    	    	
    	    };
}]);