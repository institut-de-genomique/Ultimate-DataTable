angular.module('ultimateDataTableServices').
directive('udtMessages', function(){
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	templateUrl:'udt-messages.html',
  		    	link: function(scope, element, attr) {
  		    	}
    		};
});