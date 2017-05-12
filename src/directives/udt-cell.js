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
    			    		//we need used udt-change when we used typehead directive
    			    		ngChange = '" udt-change="udtTable.updateColumn(col.property, col.id)"';
						}else if(filter){
							ngChange = '" udt-change="udtTable.searchLocal(udtTable.searchTerms)"';
    			    	}else{
    			    		defaultValueDirective = 'udt-default-value="col"';
    			    	}

						var userDirectives = "";
						if(col.editDirectives !== undefined){
							userDirectives = col.editDirectives;
							if(angular.isFunction(userDirectives)){
								userDirectives = userDirectives();
							}
						}
						var requiredDirective = "";
						if(col.required != undefined && !header && ((angular.isFunction(col.required) && col.required()) 
	    						|| (!angular.isFunction(col.required) && col.required))){
							requiredDirective = "name='"+col.id+"' ng-required=true";
						}else{
							requiredDirective = "name='"+col.id+"' ";
						}
						
						if(col.editTemplate){
							editElement = col.editTemplate.replace(/#ng-model/g, 'ng-model="'+this.getEditProperty(col, header, filter)+ngChange+' '+requiredDirective);														
						}else if(col.type === "boolean"){
	    					editElement = '<input class="form-control"' +defaultValueDirective+'type="checkbox" class="input-small" ng-model="'+this.getEditProperty(col, header, filter)+ngChange+'/>';	    					
	    				}else if (col.type === "textarea") {
                            editElement = '<textarea class="form-control"' + defaultValueDirective + userDirectives + 'ng-model="' + this.getEditProperty(col, header, filter) + ngChange + '></textarea>';
	    				}else if(col.type === "img"){
	    					editElement=
	    						'<input type="file" class="form-control" udt-base64-img ng-model="'+this.getEditProperty(col, header, filter)+'" id="{{\''+col.id+'_\'+value.line.id}}" '+requiredDirective+' ng-if="'+this.getEditProperty(col, header, filter)+' === undefined" />'
	    						+'<div  ng-click="udtTableFunctions.setImage('+this.getEditProperty(col, header, filter)+'.value,'
	                        	+this.getEditProperty(col, header, filter)+'.fullname,'
	                        	+this.getEditProperty(col, header, filter)+'.width,'
	                        	+this.getEditProperty(col, header, filter)+'.height)" '
	                        	+'  class="thumbnail" ng-if="'+this.getEditProperty(col, header, filter)+' !== undefined" >'
	                            +'  <div data-target="#udtModalImage" role="button" data-toggle="modal" >'
	                            +'     <a href="#">'
	                            +'    <img  ng-src="data:image/{{'+this.getEditProperty(col, header, filter)+'.extension}};base64,{{'+this.getEditProperty(col, header, filter)+'.value}}" width="{{'+this.getEditProperty(col, header, filter)+'.width*0.1}}" height="{{'+this.getEditProperty(col, header, filter)+'.height*0.1}}" />'
	                            +'     </a>'
	                            +' </div>'
	                            +' </div>'
	    						+' <button ng-if="'+this.getEditProperty(col, header, filter)+' !== undefined" class="btn btn-default btn-xs" ng-click="'+this.getEditProperty(col, header, filter)+' = undefined" >'
	    						+' <i class="fa fa-trash-o"></i>'
                                +' </button>';

	    					if(header){
	    						editElement = '';
	    					}
	    				}
	    				else if(col.type === "file"){
	    					editElement=
	    						'<input ng-if="'+this.getEditProperty(col, header, filter)+' === undefined"  type="file" class="form-control" udt-base64-file ng-model="'+this.getEditProperty(col, header, filter)+'" id="{{\''+col.id+'_\'+value.line.id}} '+requiredDirective+' />'
	    						+'<div ng-if="'+this.getEditProperty(col, header, filter)+' !== undefined" >'
                                +'<a target="_blank" ng-href="data:application/{{'+this.getEditProperty(col, header, filter)+'.extension}};base64,{{'+this.getEditProperty(col, header, filter)+'.value}}">'
                                +'{{'+this.getEditProperty(col, header, filter)+'.fullname}}'
                                +'</a>'
                                +' </div>'
	    						
	    						+' <button ng-if="'+this.getEditProperty(col, header, filter)+' !== undefined" class="btn btn-default btn-xs" ng-click="'+this.getEditProperty(col, header, filter)+' = undefined" ><i class="fa fa-trash-o"></i>'
                                +' </button>';
	    					if(header){
	    						editElement = '';
	    					}
	    				}else if(!col.choiceInList){
							//TODO: type='text' because html5 autoformat return a string before that we can format the number ourself
	    					editElement = '<input class="form-control" '+requiredDirective+' '+defaultValueDirective+' '+this.getConvertDirective(col, header)+' udt-html-filter="{{col.type}}" type="text" class="input-small" ng-model="'+this.getEditProperty(col,header,filter)+ngChange+userDirectives+this.getDateTimestamp(col.type)+'/>';
	    				}else if(col.choiceInList){
	    					switch (col.listStyle) {
	    						case "radio":
	    							editElement = '<label class="radio-inline" ng-repeat="opt in '+this.getOptions(col)+' track by $index" '+userDirectives+'>'
	    										   +'<input udt-html-filter="{{col.type}}" type="radio" ng-model="'+this.getEditProperty(col,header,filter)+ngChange+' ng-value="{{opt.code}}"> {{opt.name}}'
	    										   +'</label>';
									break;
	    						case "multiselect":
	    							editElement = '<select class="form-control" multiple="true" '+requiredDirective+' '+defaultValueDirective+' ng-options="opt.code '+this.getFormatter(col)+' as opt.name '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+userDirectives+'></select>';
		    						break;
	    						case "bt-select":
	    							editElement = '<div udt-html-filter="{{col.type}}" class="form-control" udt-btselect '+requiredDirective+' '+defaultValueDirective+' placeholder="" bt-dropdown-class="dropdown-menu-right" bt-options="opt.code as opt.name  '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+userDirectives+'></div>';
	    							break;
								case "bt-select-filter":
	    							editElement = '<div udt-html-filter="{{col.type}}" class="form-control" filter="true" udt-btselect '+requiredDirective+' '+defaultValueDirective+' placeholder="" bt-dropdown-class="dropdown-menu-right" bt-options="opt.code as opt.name  '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+userDirectives+'></div>';
	    							break;
	    						case "bt-select-multiple":
	    							editElement = '<div class="form-control" '+requiredDirective+' '+defaultValueDirective+' udt-btselect multiple="true" bt-dropdown-class="dropdown-menu-right" placeholder="" bt-options="opt.code as opt.name  '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+userDirectives+'></div>';
	    							break;
	    						default:
	    							editElement = '<select udt-html-filter="{{col.type}}" class="form-control" '+requiredDirective+' '+defaultValueDirective+' ng-options="opt.code '+this.getFormatter(col)+' as opt.name '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+userDirectives+'>'
	    										  + '<option></option>'
	    										  + '</select>';
		    						break;
		  	    			}
	    				}else{
	    					editElement = "Edit Not Defined for col.type !";
	    				}
	    				//return '<div class="form-group"  ng-class="{\'has-error\': value.line.errors[\''+col.property+'\'] !== undefined}">'+editElement+'<span class="help-block" ng-if="value.line.errors[\''+col.property+'\'] !== undefined">{{value.line.errors["'+col.property+'"]}}<br></span></div>';
	    				return '<div class="form-group"  ng-class="udtTableFunctions.getValidationClass(\'subForm\'+value.line.id, col)">'+editElement+'<span class="help-block" ng-if="value.line.errors[\''+col.property+'\'] !== undefined">{{value.line.errors["'+col.property+'"]}}<br></span></div>';
		    			
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
			    		if(col.convertValue !== undefined && col.convertValue !== null && col.convertValue.active === true && col.convertValue.saveMeasureValue !== col.convertValue.displayMeasureValue){
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
					
					scope.udtTableFunctions.getValidationClass = function(formName, col){
	    				
	    				if(scope.udtTable.config.save.enableValidation
	    					&& scope.datatableForm[formName] 
	    					&& scope.datatableForm[formName][col.id] 
	    					&& scope.datatableForm[formName][col.id].$invalid){
	    					return 'has-error';
	    				}else{
	    					return undefined;
	    				}
	    				    				
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
    	}).directive("udtCellRead", function(){
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
	    					}else if(col.type==="img"){	    						
	    						return '<div  ng-click="udtTableFunctions.setImage(cellValue.value,cellValue.fullname,cellValue.width,cellValue.height)" class="thumbnail" ng-if="cellValue !== undefined" >' 
	    						+'<div data-target="#udtModalImage" role="button" data-toggle="modal" ><a href="#"><img ng-src="data:image/{{cellValue.extension}};base64,{{cellValue.value}}" width="{{cellValue.width*0.1}}" height="{{cellValue.height*0.1}}"/></a></div></div>';		    					    
	    					}else if(col.type==="file"){
	    						return  '<a ng-href="data:application/{{cellValue.extension}};base64,{{cellValue.value}}" download="{{cellValue.fullname}}">'
                                +'{{cellValue.fullname}}'
                                +'</a>';
	    					} else{
	    						//return '<span udt-highlight="cellValue" keywords="udtTable.searchTerms.$" active="udtTable.config.filter.highlight"></span>';
								return '<span ng-bind="cellValue"></span>'
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
							if(column.watch === true){
                                scope.$watch("value.data."+column.property, function(newValue, oldValue) {
                                    if ( newValue !== oldValue ) {
                                        scope.cellValue = getDisplayFunction(column, false);
                                     }
                                });
                            }
			    			return currentScope.$eval(column.property, value.data);
			    		}else{
			    			if(!value.line.group && (column.url === undefined || column.url === null)){
			    				if(column.watch === true){
                                    scope.$watch("value.data."+column.property, function(newValue, oldValue) {
                                        if ( newValue !== oldValue ) {
                                            scope.cellValue = getDisplayFunction(column, false);
                                         }
                                    });
                                }
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