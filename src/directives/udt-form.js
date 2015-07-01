angular.module('ultimateDataTableServices').
directive('udtForm', function(){
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	transclude:true,
  		    	templateUrl:'udt-form.html',
  		    	link: function(scope, element, attr) {
  		    	}
    		};
    	});