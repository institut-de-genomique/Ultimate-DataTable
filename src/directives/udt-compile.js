angular.module('ultimateDataTableServices').
directive('udtCompile', ['$compile', function($compile) {
			// directive factory creates a link function
			return {
				restrict: 'A',
  		    	link: function(scope, element, attrs) {  				    
  		    		var value = scope.$eval(attrs.udtCompile);
  		    		element.html(value);
  		    		$compile(element.contents())(scope);  		    		
  				}
			};
						
		}]);