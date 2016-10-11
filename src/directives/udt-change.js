angular.module('ultimateDataTableServices').
directive('udtChange', function() {
	return {
	  require: 'ngModel',
		link: function(scope, element, attr, ngModel) {
		   scope.$watch(attr.ngModel, function(newValue, oldValue){
				if(newValue !== oldValue){
					scope.$evalAsync(attr.udtChange);						
				}
			}); 
	  }
	};	    	
});