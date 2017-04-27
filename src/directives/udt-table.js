angular.module('ultimateDataTableServices').
directive('udtTable', function(){
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	templateUrl:'udt-table.html',
  		    	link: function(scope, element, attr) {
  		    		if(!scope.udtTableFunctions){scope.udtTableFunctions = {};}
  		    		
					if(scope.udtTable && scope["datatableForm"]){
  		    			scope.udtTable.formController = scope["datatableForm"];
  		    		}
					
					scope.$watch("udtTable", function(newValue, oldValue) {
  		    			if(newValue && newValue !== oldValue && scope["datatableForm"]){
  		    				scope.udtTable.formController = scope["datatableForm"];
  		    			}
		            });
					
  		    		scope.udtTableFunctions.setImage = function(imageData, imageName, imageFullSizeWidth, imageFullSizeHeight) {
  		    			scope.udtModalImage = {};
  		    			scope.udtModalImage.modalImage = imageData;
  		    			scope.udtModalImage.modalTitle = imageName;

  		    			var margin = 25;		
  		    			var zoom = Math.min((document.body.clientWidth - margin) / imageFullSizeWidth, 1);

  		    			scope.udtModalImage.modalWidth = imageFullSizeWidth * zoom;
  		    			scope.udtModalImage.modalHeight = imageFullSizeHeight * zoom; // in order to
  		    			scope.udtModalImage.modalLeft = (document.body.clientWidth - scope.udtModalImage.modalWidth)/2;
  		    			scope.udtModalImage.modalTop = (window.innerHeight - scope.udtModalImage.modalHeight)/2;
  		    			scope.udtModalImage.modalTop = scope.udtModalImage.modalTop - 50; // height of header and footer
  		    		};
					
  		    		scope.udtTableFunctions.getTrClass = function(data, line, currentScope){
  		    			var udtTable = scope.udtTable;
	    				if(line.trClass){
	    					return line.trClass; 
	    				} else if(angular.isFunction(udtTable.config.lines.trClass)){
	    					return udtTable.config.lines.trClass(data, line);
	    				} else if(angular.isString(udtTable.config.lines.trClass)){
	    					return currentScope.$eval(udtTable.config.lines.trClass) || udtTable.config.lines.trClass;
	    				} else if(line.group && !udtTable.config.group.showOnlyGroups){
	    					return "active";
	    				} else{
	    					return '';
	    				}		    				
	    			};
	    			scope.udtTableFunctions.getTdClass = function(data, col, currentScope){
	    				if(angular.isFunction(col.tdClass)){
	    					return col.tdClass(data);
	    				} else if(angular.isString(col.tdClass)){
	    					return currentScope.$eval(col.tdClass) || col.tdClass;
	    				}else{
	    					return '';
	    				}
	    			};
					scope.udtTableFunctions.getThClass = function(col, currentScope){
	    				var clazz = '';
	    				if(col && angular.isFunction(col.thClass)){
	    					clazz = col.thClass(col);
	    				} else if(col && angular.isString(col.thClass)){
	    					//we try to evaluation the string against the scope
	    					clazz =  currentScope.$eval(col.thClass) || col.thClass;
	    				}
	    				if((col && col.required != undefined && (angular.isFunction(col.required) && col.required()))
	    						|| (col && !angular.isFunction(col.required) && col.required)){
	    					clazz = clazz +' required';
	    				}
	    				return clazz;	    				
	    			};
	    			/**
					 * Select all the table line or just one
					 */
					scope.udtTableFunctions.select = function(data, line){
						var udtTable = scope.udtTable;
                        if(line){
                            if(udtTable.config.select.active){
		    					//separation of line type group and normal to simplify backward compatibility and avoid bugs
		    					//selected is used with edit, remove, save and show button
		    					if(!line.group){
			    					if(!line.selected){
			    						line.selected=true;
			    						line.trClass="info";
			    					} else{
										line.selected=false;
			    						line.trClass=undefined;
									}
		    					}else if(line.group && udtTable.config.group.enableLineSelection){
		    						if(!line.groupSelected){
			    						line.groupSelected=true;
			    						line.trClass="info";
			    					} else{
										line.groupSelected=false;
			    						line.trClass=undefined;
									}
		    					}
		    				}
                            if (udtTable.config.select.active && angular.isFunction(udtTable.config.select.callback)) {
                                console.warning('select.callback is deprecated. Use mouseevents.clickCallback instead.');
                                udtTable.config.select.callback(line, data);
                            } else if (udtTable.config.mouseevents.active && angular.isFunction(udtTable.config.mouseevents.clickCallback)) {
                                udtTable.config.mouseevents.clickCallback(line, data);
                            }
						}
	    			};

					scope.udtTableFunctions.mouseover = function(data, line){
						var udtTable = scope.udtTable;
						if (udtTable.config.mouseevents.active) {
							var cb = udtTable.config.mouseevents.overCallback;
							if (angular.isFunction(cb)) {
								cb(line, data);
							}
						}
					};

					scope.udtTableFunctions.mouseleave = function(data, line){
						var udtTable = scope.udtTable;
						if (udtTable.config.mouseevents.active) {
							var cb = udtTable.config.mouseevents.leaveCallback;
							if (angular.isFunction(cb)) {
								cb(line, data);
							}
						}
					};
					
					scope.udtTableFunctions.getRowSpanValue = function(i,j){
						var udtTable = scope.udtTable;
						if(udtTable.config.mergeCells.active && udtTable.config.mergeCells.rowspans !== undefined){
							return udtTable.config.mergeCells.rowspans[i][j];
						}else{
							return 1;
						}
					};
					
					scope.udtTableFunctions.isShowCell = function(col, i, j){
						var udtTable = scope.udtTable;
						var value = !udtTable.isHide(col.id);
						if(udtTable.config.mergeCells.active && value && udtTable.config.mergeCells.rowspans !== undefined){
							value = (udtTable.config.mergeCells.rowspans[i][j] !== 0)
						}						
						return value;
					};
  		    	}
    		};
    	});