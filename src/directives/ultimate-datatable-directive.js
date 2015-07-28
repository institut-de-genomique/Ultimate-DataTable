"use strict";

angular.module('ultimateDataTableServices').
directive('ultimateDatatable', ['$parse', '$q', '$timeout','$templateCache', function($parse, $q, $timeout, $templateCache){
    		return {
  		    	restrict: 'A',
  		    	replace:true,
  		    	scope:true,
  		    	transclude:true,
  		    	templateUrl:'ultimate-datatable.html',
  		    	link: function(scope, element, attr) {
  		    		if(!attr.ultimateDatatable) return;
  		    		
  		    		scope.$watch(attr.ultimateDatatable, function(newValue, oldValue) {
  		    			if(newValue && (newValue !== oldValue || !scope.udtTable)){
  		    				scope.udtTable = $parse(attr.ultimateDatatable)(scope);
  		    			}
		            });
  		    		
  		    		scope.udtTable = $parse(attr.ultimateDatatable)(scope);
  		    		
  		    		if(!scope.udtTableFunctions){scope.udtTableFunctions = {};}
  		    		
  		    		scope.udtTableFunctions.messages = {};
  		    		scope.udtTableFunctions.messages.Messages = function(message,arg){	
						if(angular.isFunction(message)){
			    				message = message();
			    		}
						
						if(arg==null || arg==undefined){
			    			return scope.udtTable.messages.Messages(message);
						}else{
							return scope.udtTable.messages.Messages(message, arg);
						}
			    	};
			    	
			    	scope.udtTableFunctions.cancel = function(){
		    			scope.udtTable.setSpinner(true);
		    			$timeout(function(){scope.udtTable.cancel()}).then(function(){
		    				scope.udtTable.computeDisplayResultTimeOut.then(function(){
								scope.udtTable.setSpinner(false); 
							});	   		    				
		    			});
		    			
		    					    			
		    		};
			    	
		    		scope.udtTableFunctions.setNumberRecordsPerPage = function(elt){
		    			scope.udtTable.setSpinner(true);
		    			$timeout(function(){scope.udtTable.setNumberRecordsPerPage(elt)}).then(function(){
		    				if(!scope.udtTable.isRemoteMode(scope.udtTable.config.pagination.mode)){
		    					scope.udtTable.computeDisplayResultTimeOut.then(function(){
									scope.udtTable.setSpinner(false); 
								});	    				
		    				}
		    			});
		    			
		    				    			
		    		};
		    		
		    		scope.udtTableFunctions.setPageNumber = function(page){
		    			scope.udtTable.setSpinner(true);
		    			$timeout(function(){scope.udtTable.setPageNumber(page)}).then(function(){
		    				if(!scope.udtTable.isRemoteMode(scope.udtTable.config.pagination.mode)){
								scope.udtTable.computeDisplayResultTimeOut.then(function(){
									scope.udtTable.setSpinner(false); 
								});									
		    				}	    				
		    			});		    			
		    		};
		    		
		    		scope.udtTableFunctions.setEdit = function(column){
		    			scope.udtTable.setSpinner(true);
		    			$timeout(function(){scope.udtTable.setEdit(column)}).then(function(){
		    				scope.udtTable.setSpinner(false);  		    				
		    			});		    			
		    		};
		    		
		    		scope.udtTableFunctions.setOrderColumn = function(column){
		    			scope.udtTable.setSpinner(true);
		    			$timeout(function(){scope.udtTable.setOrderColumn(column)}).then(function(){
		    				if(!scope.udtTable.isRemoteMode(scope.udtTable.config.order.mode)){
								scope.udtTable.computeDisplayResultTimeOut.then(function(){
									scope.udtTable.setSpinner(false);  		    			
								});								
		    				} 		    				
		    			});	
		    			
		    		};
		    		
		    		scope.udtTableFunctions.setHideColumn = function(column){
		    			scope.udtTable.setSpinner(true);
		    			$timeout(function(){scope.udtTable.setHideColumn(column)}).then(function(){
		    				scope.udtTable.setSpinner(false);  		    				
		    			});
		    		};
		    		
		    		scope.udtTableFunctions.setGroupColumn = function(column){
		    			scope.udtTable.setSpinner(true);
		    			$timeout(function(){scope.udtTable.setGroupColumn(column)}).then(function(){
							scope.udtTable.computeDisplayResultTimeOut.then(function(){
								scope.udtTable.setSpinner(false);
							});  		    				
		    			});
		    		};			
		    		
		    		
		    		scope.udtTableFunctions.exportCSV = function(exportType){
		    			scope.udtTable.setSpinner(true);
		    			$timeout(function(){scope.udtTable.exportCSV(exportType)}).then(function(){
		    				scope.udtTable.setSpinner(false);  		    				
		    			});
		    		};
		    		
		    		scope.udtTableFunctions.updateShowOnlyGroups = function(){
		    			scope.udtTable.setSpinner(true);
		    			$timeout(function(){scope.udtTable.updateShowOnlyGroups()}).then(function(){
							scope.udtTable.computeDisplayResultTimeOut.then(function(){
								scope.udtTable.setSpinner(false); 
							});									
		    			});
		    		};
		    		
		    		scope.udtTableFunctions.getTotalNumberRecords = function(){
		    			if(scope.udtTable.config.group.active && scope.udtTable.config.group.start && !scope.udtTable.config.group.showOnlyGroups){
		    				return scope.udtTable.totalNumberRecords + " - "+scope.udtTable.allGroupResult.length;
		    			}else if(scope.udtTable.config.group.active && scope.udtTable.config.group.start && scope.udtTable.config.group.showOnlyGroups){
		    				return scope.udtTable.allGroupResult.length
		    			}else{
		    				return scope.udtTable.totalNumberRecords;
		    			}
		    			
		    			
		    		};
       		    } 		    		
    		};
}]);