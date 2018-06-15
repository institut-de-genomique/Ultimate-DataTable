angular.module('ultimateDataTableServices').
directive('udtCompile', ['$compile', function($compile) {
			// directive factory creates a link function
			return {
				restrict: 'A',
  		    	link: function(scope, element, attrs) {
  				    /*
  		    		 * Normaly no need to watch because the attribute udtCompile not change during the life of UDT
  		    		scope.$watch(
  				        function(scope) {
  				             // watch the 'compile' expression for changes
  				            return scope.$eval(attrs.udtCompile);
  				        },
  				        function(newValue, oldValue) {
  				        	//if(newValue !== oldValue){
  				        		console.log("watch udtCompile");
  	  				            // when the 'compile' expression changes
  	  				            // assign it into the current DOM
  	  				            element.html(newValue);

  	  				            // compile the new DOM and link it to the current
  	  				            // scope.
  	  				            // NOTE: we only compile .childNodes so that
  	  				            // we don't get into infinite loop compiling ourselves
  	  				            $compile(element.contents())(scope);
  				        	//}
  				        	
  				        }
  				    );
  		    		*/
  		    		var value = scope.$eval(attrs.udtCompile);
  		    		element.html(value);
  		    		$compile(element.contents())(scope);
  		    		
  				}
			};
						
		}]);