angular.module('ultimateDataTableServices').
//Write in an input or select in a list element the value passed to the directive when the list or the input ngModel is undefined or empty
//EXAMPLE: <input type="text" default-value="test" ng-model="x">
directive('udtDefaultValue',['$parse', function($parse) {
	    		return {
	    			require: 'ngModel',
	    			link: function(scope, element, attrs, ngModel) {
	    				var defaultValue = null;
	    				scope.$watch(attrs.udtDefaultValue, function(defaultValues){
	    					if(defaultValues != undefined){
	    						defaultValue = defaultValues;
	    					}
	    				});
	    				
						scope.$watch(ngModel, function(value){
				                if(defaultValue!= null && (ngModel.$modelValue == undefined || ngModel.$modelValue == "")){
									ngModel.$setViewValue(defaultValue);
									ngModel.$render();
								}
					    });
	    			}
	    		};	    	
	    	}]);