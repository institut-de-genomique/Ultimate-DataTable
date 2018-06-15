angular.module('ultimateDataTableServices').
directive("udtCell", function(){
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	templateUrl:'udt-cell.html',
	    		link: function(scope, element, attr) {
				}
    		};
}).directive("udtEditableCell", function(){
	return {
		restrict: 'A',
		replace:true,
		templateUrl:'udt-editableCell.html',
		link: function(scope, element, attr) {
		}
	};
}).directive("udtCellHeader", function(){
	return {
		restrict: 'A',
		replace:true,
		templateUrl:'udt-cellHeader.html',
		link: function(scope, element, attr) {
		}
	};
})
.directive("udtCellFilter", function(){
	return {
		restrict: 'A',
		replace:true,
		templateUrl:'udt-cellFilter.html',
		link: function(scope, element, attr) {
		}
	};
})
.directive("udtCellEdit", function(){
	return {
		restrict: 'A',
		replace:true,
		templateUrl:'udt-cellEdit.html',
		link: function(scope, element, attr) {
		}

	};
}).directive("udtCellRead", ["$parse", function($parse){
	return {
		restrict: 'A',
		replace:true,
		templateUrl:'udt-cellRead.html' ,
		link: function(scope, element, attr) {
 			var getDisplayValue = function(column, value, currentScope){
				if(column.watch === true && !value.line.group && (column.url === undefined || column.url === null)){
					var filter  = currentScope.udtTable.getFilter(column);
					var formatter = currentScope.udtTable.getFormatter(column);
					
					scope.$watch("value.data."+column.property+filter+formatter, function(newValue, oldValue) {
							if ( newValue !== oldValue ) {
								scope.cellValue = newValue;
							 }
						});                           
				}else if(column.url != undefined || column.url != null){
					var url = $parse(column.url)(value.data);
					var watchValue = "udtTable.urlCache['"+url+"']."+column.property+filter+formatter;
					scope.$watch("udtTable.urlCache['"+url+"']", function(newValue, oldValue) {
						if ( newValue !== oldValue ) {
							scope.cellValue = currentScope.udtTable.getFinalValue(column, value);
						 }
					});                           
				}
				return currentScope.udtTable.getFinalValue(column, value);			    		
			};
			
			var getDisplayFunction = function(col){
				if(angular.isFunction(col.property)){
					return col.property(scope.value.data);
				}else{
					return getDisplayValue(col, scope.value, scope);
				}
			};

			
			scope.cellValue = getDisplayFunction(scope.col);
			
		}
	};
}]);