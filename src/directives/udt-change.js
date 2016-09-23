angular.module('ultimateDataTableServices').
directive('udtChange', ['$interval', function($interval) {
	return {
		require: 'ngModel',
		link: function(scope, element, attr, ngModel) {
			scope.$watch(attr.ngModel, function(newValue, oldValue){
				if(newValue !== oldValue){
					scope.$eval(attr.udtChange);
				}
			}); 
		}
	};	    	
}]);