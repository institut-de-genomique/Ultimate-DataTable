angular.module('ultimateDataTableServices').
directive('udtToolbar', function(){ 
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	templateUrl:'udt-toolbar.html'		    		
  		    		,
  		    	link: function(scope, element, attr) {
  		    	}
    		};
    	})
.directive('udtToolbarBottom', function(){ 
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	templateUrl:'udt-toolbar-bottom.html'		    		
  		    		,
  		    	link: function(scope, element, attr) {
  		    	}
    		};
		});