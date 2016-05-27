angular.module('ultimateDataTableServices').
filter('udtUnique', ['$parse', function($parse) {
    		return function (collection, property) {
    			var isDefined = angular.isDefined,
    		    isUndefined = angular.isUndefined,
    		    isFunction = angular.isFunction,
    		    isString = angular.isString,
    		    isNumber = angular.isNumber,
    		    isObject = angular.isObject,
    		    isArray = angular.isArray,
    		    forEach = angular.forEach,
    		    extend = angular.extend,
    		    copy = angular.copy,
    		    equals = angular.equals;
				
				if(!isArray(collection) && !isObject(collection)){
					return collection;
				}
	
	    		/**
	    		* get an object and return array of values
	    		* @param object
	    		* @returns {Array}
	    		*/
	    		function toArray(object) {
	    		    var i = -1,
	    		        props = Object.keys(object),
	    		        result = new Array(props.length);
	
	    		    while(++i < props.length) {
	    		        result[i] = object[props[i]];
	    		    }
	    		    return result;
	    		}
    			
    		      collection = (angular.isObject(collection)) ? toArray(collection) : collection;

    		      if (isUndefined(property)) {
    		        return collection.filter(function (elm, pos, self) {
    		          return self.indexOf(elm) === pos;
    		        })
    		      }
    		      //store all unique members
    		      var uniqueItems = [],
    		          get = $parse(property);

    		      return collection.filter(function (elm) {
    		        var prop = get(elm);
    		        if(some(uniqueItems, prop)) {
    		          return false;
    		        }
    		        uniqueItems.push(prop);
    		        return true;
    		      });

    		      //checked if the unique identifier is already exist
    		      function some(array, member) {
					/*
    		        if(isUndefined(member)) {
    		          return false;
    		        }
					*/
    		        return array.some(function(el) {
    		          return equals(el, member);
    		        });
    		      }
    		    }
    	}]);