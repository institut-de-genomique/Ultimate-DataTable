angular.module('ultimateDataTableServices').
//Write in an input or select in a list element the value passed to the directive when the list or the input ngModel is undefined or empty
//EXAMPLE: <input type="text" default-value="test" ng-model="x">
directive('udtDefaultValue',['$parse', function($parse) {
	    		return {
	    			priority:1200,					 
	    			require: 'ngModel',
	    			link: function(scope, element, attrs, ngModelController) {
	    				
	    				
	    				var _col = $parse(attrs.udtDefaultValue)(scope);
	    				
	    				var currentValue = $parse(attrs.ngModel)(scope);
	    				//inspire by ngModel.NgModelController.$isEmpty.
	    				//not used directly this function because not work in case of inputCheckBox 
	    				//see ngModel.NgModelController.$isEmpty documentation
	    				var isEmpty = function(value) {
	    				   return (angular.isUndefined(value) || value === '' || value === null);
	    				};
	    				
	    				var setDefaultValue = function(){
	    					if(_col != null && isEmpty(currentValue)){
								if(_col.type === "boolean"){
									if(_col.defaultValues === "true" || _col.defaultValues === true){
										ngModelController.$setViewValue(true);
										ngModelController.$render();
									}else if(_col.defaultValues === "false" || _col.defaultValues === false){
										ngModelController.$setViewValue(true); // hack to insert false value 
										ngModelController.$setViewValue(false);
										ngModelController.$render();
									}											
								}else if(!angular.isFunction(_col.defaultValues)){
									ngModelController.$setViewValue(_col.defaultValues);
									ngModelController.$render();
								}else{
									var defaultValue = _col.defaultValues(scope.value.data, _col);
									ngModelController.$setViewValue(defaultValue);
									ngModelController.$render();
								}
			                	
							}
	    				}
	    				
	    				if(_col){
	    					setDefaultValue();	    					
	    					if(angular.isFunction(_col.defaultValues)){ //only watch when function to limit watching
    							scope.$watch(attrs.udtDefaultValue+".defaultValues(value.data,col)", function(newValue, oldValue){
    								if(newValue !== oldValue){
    									setDefaultValue();
    								}
	    						});
    						}    						
	    				}	    			
	    			}
	    		};
	    	}]);