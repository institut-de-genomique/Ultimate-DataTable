angular.module('ultimateDataTableServices').
//If the select or multiple choices contain 1 element, this directive select it automaticaly
//EXAMPLE: <select ng-model="x" ng-option="x as x for x in x" udtAutoselect>...</select>
directive('udtAutoselect',['$parse', function($parse) {
    		var OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;
    		return {
    			require: 'ngModel',
    			link: function(scope, element, attrs, ngModel) {
    				var valOption = undefined;
					if(attrs.ngOptions){	
						valOption = attrs.ngOptions;
					}else if(attrs.btOptions){
						valOption = attrs.btOptions;
					}
					
					if(valOption !== undefined){
						var match = valOption.match(OPTIONS_REGEXP);
						var model = $parse(match[7]);
						scope.$watch(model, function(value){
							if(value){
				                if(value.length === 1 && (ngModel.$modelValue === undefined || ngModel.$modelValue === "")){
									ngModel.$setViewValue(value[0].code);
									ngModel.$render();
								}
							}
				        });
					}else{
						console.log("ng-options or bt-options required");
					}
    			}
    		};
    	}]);