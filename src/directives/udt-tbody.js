angular.module('ultimateDataTableServices').
directive("udtTbody", function(){
	return {
		restrict: 'A',    	
    	link: function(scope, element, attr) {	    		
    		var getEditProperty = function(col, header, filter){
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

	    	var getConvertDirective = function(col, header){
	    		if(col.convertValue !== undefined && col.convertValue !== null && col.convertValue.active === true && col.convertValue.saveMeasureValue !== col.convertValue.displayMeasureValue){
	    			return 'udt-convertvalue="col.convertValue"';
	    		}
	    		return "";
	    	}

	    	
	    	var getOptions = function(col){
				if(angular.isString(col.possibleValues)){
					return col.possibleValues;
				}else{ //function
					return 'col.possibleValues';
				}
			};

			var getGroupBy = function(col){
				if(angular.isString(col.groupBy)){
					return 'group by opt.'+col.groupBy;
				}else{
					return '';
				}

			};
			
    		var udtTbodyHelpers = {
    				getEditElement : function(col, header, filter){
						var editElement = '';
	    				var ngChange = '"';
	    				var defaultValueDirective = "";
    			    	if(header){
    			    		//we need used udt-change when we used typehead directive
    			    		ngChange = '" udt-change="udtTable.updateColumn(col.property, col.id)"';
						}else if(filter){
							ngChange = '" udt-change="udtTable.searchLocal(udtTable.searchTerms)"';
    			    	}else if(col.defaultValues){
    			    		defaultValueDirective = 'udt-default-value="col"';
    			    	}else if(col.choiceInList){
    			    		defaultValueDirective= " udt-auto-select";
    			    	}
    			    	
						var userDirectives = "";
						if(col.editDirectives !== undefined){
							userDirectives = col.editDirectives;
							if(angular.isFunction(userDirectives)){
								userDirectives = userDirectives();
							}
						}
						var requiredDirective = "";
						if(col.required != undefined && col.required != null && !header){
							if(angular.isFunction(col.required) && col.required() || col.required === true){
								requiredDirective = 'name="'+col.id+'" ng-required=true';
							}else if(angular.isString(col.required)){
								requiredDirective = 'name="'+col.id+'" ng-required="'+col.required+'"';
							}
						}else{
							requiredDirective = "name='"+col.id+"' ";
						}
						
						if(col.editTemplate){
							editElement = col.editTemplate.replace(/#ng-model/g, 'ng-model="'+getEditProperty(col, header, filter)+ngChange+' '+requiredDirective);														
						}else if(col.type === "boolean"){
	    					editElement = '<input class="form-control"' +defaultValueDirective+'type="checkbox" class="input-small" ng-model="'+getEditProperty(col, header, filter)+ngChange+'/>';	    					
	    				}else if (col.type === "textarea") {
                            editElement = '<textarea class="form-control"' + defaultValueDirective + userDirectives + 'ng-model="' + getEditProperty(col, header, filter) + ngChange + '></textarea>';
	    				}else if(col.type === "img"){
	    					editElement=
	    						'<input type="file" class="form-control" udt-base64-img ng-model="'+getEditProperty(col, header, filter)+'" id="{{\''+col.id+'_\'+value.line.id}}" '+requiredDirective+' ng-if="'+getEditProperty(col, header, filter)+' === undefined" />'
	    						+'<div  ng-click="udtTableHelpers.setImage('+getEditProperty(col, header, filter)+'.value,'
	                        	+getEditProperty(col, header, filter)+'.fullname,'
	                        	+getEditProperty(col, header, filter)+'.width,'
	                        	+getEditProperty(col, header, filter)+'.height)" '
	                        	+'  class="thumbnail" ng-if="'+getEditProperty(col, header, filter)+' !== undefined" >'
	                            +'  <div data-target="#udtModalImage" role="button" data-toggle="modal" >'
	                            +'     <a href="#">'
	                            +'    <img  ng-src="data:image/{{'+getEditProperty(col, header, filter)+'.extension}};base64,{{'+getEditProperty(col, header, filter)+'.value}}" width="{{'+getEditProperty(col, header, filter)+'.width*0.1}}" height="{{'+getEditProperty(col, header, filter)+'.height*0.1}}" />'
	                            +'     </a>'
	                            +' </div>'
	                            +' </div>'
	    						+' <button ng-if="'+getEditProperty(col, header, filter)+' !== undefined" class="btn btn-default btn-xs" ng-click="'+getEditProperty(col, header, filter)+' = undefined" >'
	    						+' <i class="fa fa-trash-o"></i>'
                                +' </button>';

	    					if(header){
	    						editElement = '';
	    					}
	    				}
	    				else if(col.type === "file"){
	    					editElement=
	    						'<input ng-if="'+getEditProperty(col, header, filter)+' === undefined"  type="file" class="form-control" udt-base64-file ng-model="'+getEditProperty(col, header, filter)+'" id="{{\''+col.id+'_\'+value.line.id}} '+requiredDirective+' />'
	    						+'<div ng-if="'+getEditProperty(col, header, filter)+' !== undefined" >'
                                +'<a target="_blank" ng-href="data:application/{{'+getEditProperty(col, header, filter)+'.extension}};base64,{{'+getEditProperty(col, header, filter)+'.value}}">'
                                +'{{'+getEditProperty(col, header, filter)+'.fullname}}'
                                +'</a>'
                                +' </div>'
	    						
	    						+' <button ng-if="'+getEditProperty(col, header, filter)+' !== undefined" class="btn btn-default btn-xs" ng-click="'+getEditProperty(col, header, filter)+' = undefined" ><i class="fa fa-trash-o"></i>'
                                +' </button>';
	    					if(header){
	    						editElement = '';
	    					}
	    				}else if(!col.choiceInList){
							//TODO: type='text' because html5 autoformat return a string before that we can format the number ourself
	    					editElement = '<input class="form-control" '+requiredDirective+' '+defaultValueDirective+' '+getConvertDirective(col, header)+' udt-html-filter="{{col.type}}" type="text" class="input-small" ng-model="'+getEditProperty(col,header,filter)+ngChange+userDirectives+'/>';
	    				}else if(col.choiceInList){
	    					switch (col.listStyle) {
	    						case "radio":
	    							editElement = '<label class="radio-inline" ng-repeat="opt in '+getOptions(col)+' track by $index" '+userDirectives+'>'
	    										   +'<input udt-html-filter="{{col.type}}" type="radio" ng-model="'+getEditProperty(col,header,filter)+ngChange+' ng-value="{{opt.code}}"> {{opt.name}}'
	    										   +'</label>';
									break;
	    						case "multiselect":
	    							editElement = '<select class="form-control" multiple="true" '+requiredDirective+' '+defaultValueDirective+' ng-options="opt.code '+scope.udtTable.getFormatter(col)+' as opt.name '+getGroupBy(col)+' for opt in '+getOptions(col)+'" '+' ng-model="'+getEditProperty(col,header,filter)+ngChange+userDirectives+'></select>';
		    						break;
	    						case "bt-select":
	    							editElement = '<div udt-html-filter="{{col.type}}" class="form-control" udt-btselect '+requiredDirective+' '+defaultValueDirective+' placeholder="" bt-dropdown-class="dropdown-menu-right" bt-options="opt.code as opt.name  '+getGroupBy(col)+' for opt in '+getOptions(col)+'" '+' ng-model="'+getEditProperty(col,header,filter)+ngChange+userDirectives+'></div>';
	    							break;
								case "bt-select-filter":
	    							editElement = '<div udt-html-filter="{{col.type}}" class="form-control" filter="true" udt-btselect '+requiredDirective+' '+defaultValueDirective+' placeholder="" bt-dropdown-class="dropdown-menu-right" bt-options="opt.code as opt.name  '+getGroupBy(col)+' for opt in '+getOptions(col)+'" '+' ng-model="'+getEditProperty(col,header,filter)+ngChange+userDirectives+'></div>';
	    							break;
	    						case "bt-select-multiple":
	    							editElement = '<div class="form-control" '+requiredDirective+' '+defaultValueDirective+' udt-btselect multiple="true" bt-dropdown-class="dropdown-menu-right" placeholder="" bt-options="opt.code as opt.name  '+getGroupBy(col)+' for opt in '+getOptions(col)+'" '+' ng-model="'+getEditProperty(col,header,filter)+ngChange+userDirectives+'></div>';
	    							break;
	    						default:
	    							editElement = '<select udt-html-filter="{{col.type}}" class="form-control" '+requiredDirective+' '+defaultValueDirective+' ng-options="opt.code '+scope.udtTable.getFormatter(col)+' as opt.name '+getGroupBy(col)+' for opt in '+getOptions(col)+'" '+' ng-model="'+getEditProperty(col,header,filter)+ngChange+userDirectives+'>'
	    										  + '<option></option>'
	    										  + '</select>';
		    						break;
		  	    			}
	    				}else{
	    					editElement = "Edit Not Defined for col.type !";
	    				}
	    				//return '<div class="form-group"  ng-class="{\'has-error\': value.line.errors[\''+col.property+'\'] !== undefined}">'+editElement+'<span class="help-block" ng-if="value.line.errors[\''+col.property+'\'] !== undefined">{{value.line.errors["'+col.property+'"]}}<br></span></div>';
	    				return '<div class="form-group"  ng-class="udtTbodyHelpers.getValidationClass(\'subForm\'+value.line.id, col)">'+editElement+'<span class="help-block" ng-if="value.line.errors[\''+col.property+'\'] !== undefined">{{value.line.errors["'+col.property+'"]}}<br></span></div>';
		    			
	    			},
	    			getValidationClass : function(formName, col){
	    				
	    				if(scope.udtTable.config.save.enableValidation
	    					&& scope.datatableForm[formName] 
	    					&& scope.datatableForm[formName][col.id] 
	    					&& scope.datatableForm[formName][col.id].$invalid){
	    					return 'has-error';
	    				}else{
	    					return undefined;
	    				}
	    				    				
	    			},
	    			getDisplayElement : function(col){
	    				if(angular.isDefined(col.render) && col.render !== null){
    						if(angular.isFunction(col.render)){
    							return '<span udt-compile="udtTable.config.columns[$index].render(value.data, value.line)"></span>';
    						}else if(angular.isString(col.render)){
    							return '<span udt-compile="udtTable.config.columns[$index].render"></span>';
    						}
	    				}else{
	    					if(col.type !== "boolean" && col.type !== "img" && col.type !=="file"){
	    						//return '<span udt-highlight="cellValue" keywords="udtTable.searchTerms.$" active="udtTable.config.filter.highlight"></span>';
								return '<span ng-bind="cellValue"></span>'
	    					}else if(col.type === "boolean"){
	    						return '<div ng-switch on="cellValue"><i ng-switch-when="true" class="fa fa-check-square-o"></i><i ng-switch-default class="fa fa-square-o"></i></div>';
	    					}else if(col.type==="img"){	    						
	    						return '<div  ng-click="udtTableHelpers.setImage(cellValue.value,cellValue.fullname,cellValue.width,cellValue.height)" class="thumbnail" ng-if="cellValue !== undefined" >' 
	    						+'<div data-target="#udtModalImage" role="button" data-toggle="modal" ><a href="#"><img ng-src="data:image/{{cellValue.extension}};base64,{{cellValue.value}}" width="{{cellValue.width*0.1}}" height="{{cellValue.height*0.1}}"/></a></div></div>';		    					    
	    					}else if(col.type==="file"){
	    						return  '<a ng-href="data:application/{{cellValue.extension}};base64,{{cellValue.value}}" download="{{cellValue.fullname}}">'
                                +'{{cellValue.fullname}}'
                                +'</a>';
	    					} else{
	    						return ''
	    					}
	    				}
	    			}
    		};
    		
    		scope.udtTbodyHelpers = udtTbodyHelpers;
    	}

	};
});