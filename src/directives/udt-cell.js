angular.module('ultimateDataTableServices').
directive("udtCell", function(){
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	templateUrl:'udt-cell.html',
	    		link: function(scope, element, attr) {
	    			if(!scope.udtTableFunctions){scope.udtTableFunctions = {};}
	    			
	    			scope.udtTableFunctions.getEditElement = function(col, header, filter){
	    				var editElement = '';
	    				var ngChange = '"';
	    				var defaultValueDirective = "";
    			    	if(header){
    			    		ngChange = '" ng-change="udtTable.updateColumn(col.property, col.id)"';
						}else if(filter){
							ngChange = '" udt-change="udtTable.searchLocal(udtTable.searchTerms)"';
    			    	}else{
    			    		defaultValueDirective = 'udt-default-value="col.defaultValues"';
    			    	}
						
						var userDirectives = "";
						if(col.editDirectives !== undefined){
							userDirectives = col.editDirectives;
							if(angular.isFunction(userDirectives)){
								userDirectives = userDirectives();
							}
						}
	    						    				
	    				if(col.type === "boolean"){
	    					editElement = '<input class="form-control"' +defaultValueDirective+' udt-html-filter="{{col.type}}" '+userDirectives+' type="checkbox" class="input-small" ng-model="'+this.getEditProperty(col, header, filter)+ngChange+'/>';
	    				}else if(!col.choiceInList){
							//TODO: type='text' because html5 autoformat return a string before that we can format the number ourself
	    					editElement = '<input class="form-control" '+defaultValueDirective+' '+this.getConvertDirective(col, header)+' udt-html-filter="{{col.type}}" '+userDirectives+' type="text" class="input-small" ng-model="'+this.getEditProperty(col,header,filter)+ngChange+this.getDateTimestamp(col.type)+'/>';
	    				}else if(col.choiceInList){
	    					switch (col.listStyle) { 
	    						case "radio":
	    							editElement = '<label ng-repeat="opt in col.possibleValues" '+defaultValueDirective+'  for="radio{{col.id}}"><input id="radio{{col.id}}" udt-html-filter="{{col.type}}" '+userDirectives+' type="radio" ng-model="'+this.getEditProperty(col,hearder,filter)+ngChange+' value="{{opt.name}}">{{opt.name}}<br></label>';
	    							break;		    						
	    						case "multiselect":
	    							editElement = '<select class="form-control" multiple="true" '+defaultValueDirective+' ng-options="opt.code as opt.name '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+userDirectives+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+'></select>';
		    						break;
	    						case "bt-select":
	    							editElement = '<div class="form-control" udt-btselect '+defaultValueDirective+' placeholder="" bt-dropdown-class="dropdown-menu-right" bt-options="opt.code as opt.name  '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+userDirectives+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+'></div>';			        		  	    	
	    							break;
								case "bt-select-filter":
	    							editElement = '<div class="form-control" filter="true" udt-btselect '+defaultValueDirective+' placeholder="" bt-dropdown-class="dropdown-menu-right" bt-options="opt.code as opt.name  '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+userDirectives+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+'></div>';			        		  	    	
	    							break;
	    						case "bt-select-multiple":
	    							editElement = '<div class="form-control" '+defaultValueDirective+' udt-btselect multiple="true" bt-dropdown-class="dropdown-menu-right" placeholder="" bt-options="opt.code as opt.name  '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+userDirectives+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+'></div>';			        		  	    	
	    							break;
	    						default:
	    							editElement = '<select class="form-control" '+defaultValueDirective+' ng-options="opt.code as opt.name '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+userDirectives+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+'></select>';
		    						break;
		  	    			}		    					
	    				}else{
	    					editElement = "Edit Not Defined for col.type !";
	    				}		    						    				
	    				return '<div class="form-group"  ng-class="{\'has-error\': value.line.errors[\''+col.property+'\'] !== undefined}">'+editElement+'<span class="help-block" ng-if="value.line.errors[\''+col.property+'\'] !== undefined">{{value.line.errors["'+col.property+'"]}}<br></span></div>';
	    			};
	    			
	    			
	    			scope.udtTableFunctions.getEditProperty = function(col, header, filter){
	    				if(header){
    			    		return  "udtTable.config.edit.columns."+col.id+".value";
    			    	} else if(filter){
							return "udtTable.searchTerms."+col.property;
						} else if(angular.isString(col.property)){
    			    		return "value.data."+col.property;        			    		
    			    	} else {
    			    		throw "Error property is not editable !";
    			    	}		    				
			    	};
			    	
			    	scope.udtTableFunctions.getConvertDirective = function(col, header){
			    		if(col.convertValue != undefined && col.convertValue.active == true && col.convertValue.saveMeasureValue != col.convertValue.displayMeasureValue){
			    			return 'udt-convertvalue="col.convertValue"';
			    		}
			    		return "";
			    	}
			    	
			    	scope.udtTableFunctions.getInputType = function(col){
	    				if(col.type === "date" || col.type === "datetime" || col.type === "datetime-local"){
    			    		return "text";
	    				}
	    				return col.type
			    	};
	    			
			    	scope.udtTableFunctions.getFormatter = scope.udtTable.getFormatter;
	    			
	    			scope.udtTableFunctions.getFilter = scope.udtTable.getFilter;
	    			
	    			scope.udtTableFunctions.getOptions = function(col){
	    				if(angular.isString(col.possibleValues)){
	    					return col.possibleValues;
	    				}else{ //function
	    					return 'col.possibleValues';
	    				}
	    			};
	    			
	    			scope.udtTableFunctions.getGroupBy = function(col){
	    				if(angular.isString(col.groupBy)){
	    					return 'group by opt.'+col.groupBy;
	    				}else{
	    					return '';
	    				}
	    					
	    			};
	    			
	    			scope.udtTableFunctions.getDateTimestamp = function(colType){
	    				if(colType==="date"){
	    					return 'udt-date-timestamp';
	    				}
	    				
	    				return '';
	    			};
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
    	}).directive("udtCellRead", function($http){
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	templateUrl:'udt-cellRead.html' ,
  		    	link: function(scope, element, attr) {
  		    		if(!scope.udtTableFunctions){scope.udtTableFunctions = {};}
  		    		
  		    		scope.udtTableFunctions.getDisplayElement = function(col){
	    				if(angular.isDefined(col.render) && col.render !== null){
    						if(angular.isFunction(col.render)){
    							return '<span udt-compile="udtTable.config.columns[$index].render(value.data, value.line)"></span>';
    						}else if(angular.isString(col.render)){
    							return '<span udt-compile="udtTable.config.columns[$index].render"></span>';
    						}
	    				}else{
	    					if(col.type === "boolean"){
	    						return '<div ng-switch on="cellValue"><i ng-switch-when="true" class="fa fa-check-square-o"></i><i ng-switch-default class="fa fa-square-o"></i></div>';	    						
	    					}else if(col.type === "img" || col.type === "image"){
	    						if(!col.format)console.log("missing format for img !!");
	    						return '<img ng-src="data:image/'+col.format+';base64,{{cellValue}}" style="max-width:{{col.width}}"/>';		    					    
	    					} else{
	    						return '<span udt-highlight="cellValue" keywords="udtTable.searchTerms.$" active="udtTable.config.filter.highlight"></span>';
								//return '<span ng-bind="cellValue"></span>'
	    					}
	    				}	  
	    			};
	    			
	    			var getDisplayFunction = function(col, onlyProperty){
	    				if(angular.isFunction(col.property)){
    			    		return col.property(scope.value.data);
    			    	}else{
    			    		return getDisplayValue(col, scope.value, onlyProperty, scope);        			    		
    			    	}		    				
			    	};
	    			
			    	var getDisplayValue = function(column, value, onlyProperty, currentScope){
			    		if(onlyProperty){
			    			return currentScope.$eval(column.property, value.data);
			    		}else{
			    			if(!value.line.group && (column.url === undefined || column.url === null)){
			    				return currentScope.$eval(column.property+currentScope.udtTableFunctions.getFilter(column)+currentScope.udtTableFunctions.getFormatter(column), value.data);
			    			}else if(value.line.group){
			    				var v = currentScope.$eval("group."+column.id, value.data);
			    				//if error in group function
			    				if(angular.isDefined(v) && angular.isString(v) &&v.charAt(0) === "#"){
			    					return v;
			    				}else if(angular.isDefined(v) ){
			    					//not filtered properties because used during the compute
			    					return currentScope.$eval("group."+column.id+currentScope.udtTableFunctions.getFormatter(column), value.data);
			    				}else{
			    					return undefined;
			    				}			    							    				
			    			}else if(!value.line.group && column.url !== undefined && column.url !== null){
			    				var url = currentScope.$eval(column.url, value.data);
			    				return currentScope.$eval(column.property+currentScope.udtTableFunctions.getFilter(column)+currentScope.udtTableFunctions.getFormatter(column), scope.udtTable.urlCache[url]);			    				
			    			}
			    		}	    				
	    			};
	    			
	    			if(scope.col.type === "img" || scope.col.type === "image"){
	    				scope.cellValue = getDisplayFunction(scope.col, true);
	    			}else{
	    				scope.cellValue = getDisplayFunction(scope.col, false);
	    			}	    					    		
  		    	}
    		};
    	});