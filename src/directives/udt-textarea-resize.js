angular.module('ultimateDataTableServices').
directive('udtTextareaResize', function(){
    		return {
    			restrict: 'A',
                require: 'ngModel',
  		    	replace: false,
  		    	template: '',
                link: function(scope, element, attr, ngModel) {
                    var rows = 3;
                    var cols = 35;
                    scope.$watch(ngModel.$modelValue, function() {
                        var value = ngModel.$modelValue;

                        if (value) {
                            var lines = value.split('\n');
                            rows = Math.max(lines.length, rows);
                            lines.forEach(function(line) {
                                cols = Math.max(cols, line.length);
                            });

                            attr.$set('cols', cols);
                            attr.$set('rows', rows);
                        }
                    });
  		    	}
    		};
    	});
