angular.module('ultimateDataTableServices').
//Write in an input or select in a list element the value passed to the directive when the list or the input ngModel is undefined or empty
//EXAMPLE: <input type="text" default-value="test" ng-model="x">
directive('udtDefaultValue',['$parse', function($parse) {
	    		return {
	    			require: 'ngModel',
	    			link: function(scope, element, attrs, ngModel) {
	    				var _col = null;
	    				scope.$watch(attrs.udtDefaultValue, function(col){
	    					if(col !== null && col !== undefined && col.defaultValues !== undefined && col.defaultValues !== null ){
	    						_col = col;
	    					}
	    				});
	    				//TODO GA ?? better way with formatter
						scope.$watch(ngModel, function(value){
				                if(_col != null && (ngModel.$modelValue === undefined || ngModel.$modelValue === "")){
									if(_col.type === "boolean"){
										if(_col.defaultValues === "true" || _col.defaultValues === true){
											ngModel.$setViewValue(true);
											ngModel.$render();
										}else if(_col.defaultValues === "false" || _col.defaultValues === false){
											ngModel.$setViewValue(false);
											ngModel.$render();
										}											
									}else{
										ngModel.$setViewValue(_col.defaultValues);
										ngModel.$render();
									}
				                	
								}
					    });
	    			}
	    		};	    	
	    	}]);