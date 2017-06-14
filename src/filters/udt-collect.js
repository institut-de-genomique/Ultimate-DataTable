angular.module('ultimateDataTableServices').
filter('udtCollect', ['$parse','$filter',function($parse,$filter) {
    	    return function(array, key, unique) {
    	    	if (!array || array.length === 0)return undefined;
    	    	if (!angular.isArray(array) && (angular.isObject(array) || angular.isNumber(array) || angular.isString(array) || angular.isDate(array))) array = [array];
    	    	else if(!angular.isArray(array)) throw "input is not an array, object, number or string !";
    	    	
    	    	if(key && !angular.isString(key))throw "key is not valid, only string is authorized";
    	    	
    	    	var possibleValues = [];
    	    	angular.forEach(array, function(element){
    	    		if (angular.isObject(element)) {
    	    			var currentValue = $parse(key)(element);
    	    			if(undefined !== currentValue && null !== currentValue){
    	    				//Array.prototype.push.apply take only arrays
    	    				if(angular.isArray(currentValue)){
    	    					possibleValues = possibleValues.concat(currentValue);
    	    				}else{
    	    					possibleValues.push(currentValue);
    	    				}
    	    			}
    	    			
    	    			
    	    		}else if (!params.key && angular.isObject(value)){
    	    			throw "missing key !";
    	    		}
						
    	    	});
    	    	if(unique){
					possibleValues = $filter('udtUnique')(possibleValues);
				}
    	    	return possibleValues;    	    	
    	    };
    	}]);