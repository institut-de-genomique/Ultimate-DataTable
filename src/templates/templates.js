"use strict";

angular.module('ultimateDataTableServices').
run(function($templateCache) {
  $templateCache.put('ultimate-datatable.html', '<div name="datatable" class="datatable">'
  		    		+'<div ng-transclude/>'
  		    		+'<div udt-toolbar ng-if="udtTable.isShowToolbar()"/>'  		    		
  		    		+'<div udt-messages ng-if="udtTable.config.messages.active"/>'
  		    		+'<div udt-table/>'
  		    		+'</div>');
})
.run(function($templateCache) {
  $templateCache.put('udt-table.html', '<div name="udt-table" class="row"><div class="col-md-12 col-lg-12">'
  		    		+'<div class="inProgress" ng-if="udtTable.config.spinner.start"><button class="btn btn-primary btn-lg"><i class="fa fa-spinner fa-spin fa-5x"></i></button></div>'
  		    		+'<form class="form-inline">'
  		    		+'<table class="table table-condensed table-hover table-bordered">'
  		    		+'<thead>'
  		    		+'<tr ng-repeat="(key,headers) in udtTable.getExtraHeaderConfig()">'
  		    		+	'<th colspan="{{header.colspan}}" ng-repeat="header in headers"><span ng-bind="udtTableFunctions.messagesDatatable(header.label)"/></th>'
  		    		+'</tr>'
  		    		+'<tr>'
  		    		+	'<th id="{{column.id}}" ng-repeat="column in udtTable.getColumnsConfig()" ng-model="column" draggable ng-if="!udtTable.isHide(column.id)">'
  		    		+	'<span ng-model="udtTable" droppable drop-fn="udtTable.onDrop" drop-item="column" ng-bind="udtTableFunctions.messagesDatatable(column.header)"/>'
  		    		+	'<div class="btn-group pull-right">'
  		    		+	'<button class="btn btn-xs" ng-click="udtTableFunctions.setEdit(column)"        ng-if="udtTable.isShowButton(\'edit\', column)"  ng-disabled="!udtTable.canEdit()" data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.edit\')}}"><i class="fa fa-edit"></i></button>'
  		    		+	'<button class="btn btn-xs" ng-click="udtTableFunctions.setOrderColumn(column)" ng-if="udtTable.isShowButton(\'order\', column)" ng-disabled="!udtTable.canOrder()" data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.sort\')}}"><i ng-class="udtTable.getOrderColumnClass(column.id)"></i></button>'
  		    		+	'<button class="btn btn-xs" ng-click="udtTableFunctions.setGroupColumn(column)" ng-if="udtTable.isShowButton(\'group\', column)" ng-disabled="udtTable.isEmpty()"  data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.group\')}}"><i ng-class="udtTable.getGroupColumnClass(column.id)"></i></button>'  		    		  		    		
  		    		+	'<button class="btn btn-xs" ng-click="udtTableFunctions.setHideColumn(column)"  ng-if="udtTable.isShowButton(\'hide\', column)"  data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.hide\')}}"><i class="fa fa-eye-slash"></i></button>'
  		    		+	'</div>'
  		    		+	'</th>'
  		    		+'</tr>'
  		    		+'</thead>'
  		    		+'<tbody>'
  		    		+	'<tr ng-if="udtTable.isEdit()">'
  		    		+		'<td ng-repeat="col in udtTable.config.columns" ng-if="!udtTable.isHide(col.id)">'
  		    		+			'<div udt-cell-header/>'
  		    		+		'</td>'
  		    		+	'</tr>'
  		    		+	'<tr ng-repeat="value in udtTable.displayResult|filter:udtTable.searchTerm:false" ng-click="udtTableFunctions.select(value.line)" ng-class="udtTableFunctions.getTrClass(value.data, value.line, this)">'
  		    		+		'<td ng-repeat="col in udtTable.config.columns" ng-if="!udtTable.isHide(col.id)" ng-class="udtTableFunctions.getTdClass(value.data, col, this)">'
  		    		+		'<div udt-cell/>'
  		    		+		'</td>'
  		    		+	'</tr>'
  		    		+'</tbody>'
  		    		+'</table>'
  		    		+'</form>'
  		    		+'</div></div>');
})
.run(function($templateCache) {
  $templateCache.put('udt-cell.html', '<div>'
	  		    		+'<div ng-if="col.edit" udt-editable-cell></div>'
	  		    		+'<div ng-if="!col.edit" udt-cell-read></div>'		    		
  		    		+'</div>');
})
.run(function($templateCache) {
  $templateCache.put('udt-editableCell.html', '<div ng-switch on="udtTable.isEdit(col.id, value.line)">'
	  		    		+'<div ng-switch-when="true" >'
	  		    		+	'<div udt-cell-edit></div>'  		    		
	  		    		+'</div>'
	  		    		+'<div ng-switch-default udt-cell-read></div>'
  		    		+'</div>');
})
.run(function($templateCache) {
  $templateCache.put('udt-cellRead.html', '<div udt-compile="udtTableFunctions.getDisplayElement(col)"></div>');
})
.run(function($templateCache) {
  $templateCache.put('udt-cellEdit.html', '<div udt-compile="udtTableFunctions.getEditElement(col)"></div>');
})
.run(function($templateCache) {
  $templateCache.put('udt-cellHeader.html', '<div ng-if="col.edit" ng-switch on="udtTable.isEdit(col.id)">'  		    			
  		    		+	'<div ng-switch-when="true" udt-compile="udtTableFunctions.getEditElement(col, true)"></div><div ng-switch-default></div>'
  		    		+'</div>');
})
.run(function($templateCache) {
  $templateCache.put('udt-messages.html', '<div name="udt-messages" class="row"><div class="col-md-12 col-lg-12">'
  		    		+'<div ng-class="udtTable.config.messages.clazz" ng-if="udtTable.config.messages.text !== undefined"><strong>{{udtTable.config.messages.text}}</strong>'
  		    		+'</div>'
  		    		+'</div></div>');
})
.run(function($templateCache) {
  $templateCache.put('udt-form.html', '<div name="udt-form"  class="row"><div class="col-md-12 col-lg-12" ng-transclude/></div>');
})
.run(function($templateCache) {
  $templateCache.put('udt-toolbar.html', '<div name="udt-toolbar" class="row margin-bottom-3"><div class="col-md-12 col-lg-12">'
  		    		+'<div class="btn-toolbar pull-left" name="udt-toolbar-buttons" ng-if="udtTable.isShowToolbarButtons()">'
  		    		+'<div class="btn-group"  ng-switch on="udtTable.config.select.isSelectAll">'
  		    		+	'<button class="btn btn-default" ng-disabled="udtTable.isEmpty()" ng-click="udtTable.selectAll(true)" ng-show="udtTable.isShowButton(\'select\')" ng-switch-when="false" data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.selectall\')}}">'
  		    		+		'<i class="fa fa-check-square"></i>'
  		    		+		'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.selectall\')}}</span>'
  		    		+	'</button>'
  		    		+	'<button class="btn btn-default" ng-disabled="udtTable.isEmpty()" ng-click="udtTable.selectAll(false)" ng-show="udtTable.isShowButton(\'select\')" ng-switch-when="true" data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.unselectall\')}}">'
  		    		+		'<i class="fa fa-square"></i>'
    				+		'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.unselectall\')}}</span>'
  		    		+	'</button>'
  		    		+	'<button class="btn btn-default" ng-click="udtTableFunctions.cancel()"  ng-if="udtTable.isShowButton(\'cancel\')" data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.cancel\')}}">'
  		    		+		'<i class="fa fa-undo"></i>'
  		    		+		'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.cancel\')}}</span>'
  		    		+	'</button>'
  		    		+	'<button class="btn btn-default" ng-click="udtTable.show()" ng-disabled="!udtTable.isSelect()" ng-if="udtTable.isShowButton(\'show\')" data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.show\')}}">'
  		    		+		'<i class="fa fa-thumb-tack"></i>'
  		    		+		'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.show\')}}</span>'
  		    		+	'</button>'
  		    		+'</div>'
  		    		
  		    		+'<div class="btn-group" ng-if="udtTable.isShowCRUDButtons()">'
  		    		+	'<button class="btn btn-default" ng-click="udtTableFunctions.setEdit()" ng-disabled="!udtTable.canEdit()"  ng-if="udtTable.isShowButton(\'edit\')" data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.edit\')}}">'
  		    		+		'<i class="fa fa-edit"></i>'
  		    		+		'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.edit\')}}</span>'
  		    		+	'</button>'	
  		    		+	'<button class="btn btn-default" ng-click="udtTable.save()" ng-disabled="!udtTable.canSave()" ng-if="udtTable.isShowButton(\'save\')"  data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.save\')}}" >'
  		    		+		'<i class="fa fa-save"></i>'
  		    		+		'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.save\')}}</span>'
  		    		+	'</button>'	
  		    		+	'<button class="btn btn-default" ng-click="udtTable.remove()" ng-disabled="!udtTable.canRemove()" ng-if="udtTable.isShowButton(\'remove\')"  data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.remove\')}}">'
  		    		+		'<i class="fa fa-trash-o"></i>'
  		    		+		'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.remove\')}}</span>'
  		    		+	'</button>'  					
  		    		+'</div>'
					+ '<div class="btn-group" ng-if="udtTable.config.add.active && udtTable.config.add.showButton">'
  		    		+	'<button class="btn btn-default" ng-click="udtTable.addBlankLine()" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.add\')}}">'
  		    		+		'<i class="fa fa-plus"></i>'
  		    		+		'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.add\')}}</span>'
  		    		+	'</button>'	
					+ '</div>'
  		     		+'<div class="btn-group" ng-if="udtTable.isShowExportCSVButton()" ng-switch on="udtTable.config.group.active">'
  		     		+'<button ng-switch-when="false" class="btn btn-default" ng-click="udtTableFunctions.exportCSV(\'all\')" ng-disabled="!udtTable.canExportCSV()" data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.exportCSV\')}}">'
  		    		+	'<i class="fa fa-file-text-o"></i>'
  		    		+	'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.basicExportCSV\')}}</span>'
  		    		+'</button>'	
  		    		
  		    		+'<button ng-switch-when="true" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-disabled="!udtTable.canExportCSV()"  title="{{udtTableFunctions.messagesDatatable(\'datatable.button.exportCSV\')}}">'
  		    		+	'<i class="fa fa-file-text-o"></i> '
  		    		+	'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.exportCSV\')}}</span>'
  		    		+	'<span class="caret"/>'
  		    		+'</button>'
  		    		+'<ul class="dropdown-menu">'
  		    		/* Basic Export */
  		    		+	'<li><a href="" ng-click="udtTableFunctions.exportCSV(\'all\')"><i class="fa fa-file-text-o"></i> {{udtTableFunctions.messagesDatatable(\'datatable.button.basicExportCSV\')}}</a></li>'
  		    		/* Grouped Export */
  		    		+	'<li><a href="" ng-click="udtTableFunctions.exportCSV(\'groupsOnly\')"><i class="fa fa-file-text-o"></i> {{udtTableFunctions.messagesDatatable(\'datatable.button.groupedExportCSV\')}}</a></li>'
  		    		+'</ul>'
  		    		
  		    		+'</div>'
  		    		
  		    		+'<div class="btn-group" ng-if="udtTable.isShowButton(\'group\')">'
  		    		+	'<button data-toggle="dropdown" class="btn btn-default dropdown-toggle" ng-disabled="udtTable.isEmpty()" data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.group\')}}">'
  		    		+		'<i class="fa fa-bars"></i> '
  		    		+		'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.group\')}} </span>'
  		    		+		'<span class="caret" />'
  		    		+	'</button>'
  		    		+	'<ul class="dropdown-menu">'
  		    		+		'<li ng-repeat="column in udtTable.getGroupColumns()">'
  		    		+			'<a href="" ng-click="udtTableFunctions.setGroupColumn(column)" ng-switch on="!udtTable.isGroup(column.id)"><i class="fa fa-bars" ng-switch-when="true"></i><i class="fa fa-outdent" ng-switch-when="false"></i> <span ng-bind="udtTableFunctions.messagesDatatable(column.header)"/></a>' 
  		    		+		'</li>'	
  		    		+		'<li class="divider"></li>'
  		    		+		'<li>'
  		    		+			'<a href="" ng-click="udtTable.setGroupColumn(\'all\')" ng-switch on="!udtTable.isGroup(\'all\')"><i class="fa fa-bars" ng-switch-when="true"></i><i class="fa fa-outdent" ng-switch-when="false"></i> <span ng-bind="udtTableFunctions.messagesDatatable(\'datatable.button.generalGroup\')"/></a>'
  		    		+		'</li>'
  		    		+		'<li class="dropdown-header" style="font-size:12px;color:#333">'
  		    		+			'<div class="checkbox"><label><input type="checkbox" ng-model="udtTable.config.group.showOnlyGroups" ng-click="udtTableFunctions.updateShowOnlyGroups()"/>{{udtTableFunctions.messagesDatatable(\'datatable.button.showOnlyGroups\')}}</label></div>'
  		    		+		'</li>'  		    		
  		    		+	'</ul>'
  		    		+'</div>'
		    		
  		    		+'<div class="btn-group" ng-if="udtTable.isShowHideButtons()">' //todo bt-select
  		    		+	'<button data-toggle="dropdown" class="btn btn-default dropdown-toggle" data-toggle="tooltip" title="{{udtTableFunctions.messagesDatatable(\'datatable.button.hide\')}}">'
  		    		+		'<i class="fa fa-eye-slash"></i> '
  		    		+		'<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messagesDatatable(\'datatable.button.hide\')}} </span>'
  		    		+		'<span class="caret"></span>'  		    		
  		    		+	'</button>'
  		    		+	'<ul class="dropdown-menu">'
  		    		+		'<li ng-repeat="column in udtTable.getHideColumns()">'
  		    		+		'<a href="" ng-click="udtTableFunctions.setHideColumn(column)" ng-switch on="udtTable.isHide(column.id)"><i class="fa fa-eye" ng-switch-when="true"></i><i class="fa fa-eye-slash" ng-switch-when="false"></i> <span ng-bind="udtTableFunctions.messagesDatatable(column.header)"/></a>'
  		    		+		'</li>'
  		    		+	'</ul>'
  		    		+'</div>'
  		    		+'<div class="btn-group" ng-if="udtTable.isShowOtherButtons()" udt-compile="udtTable.config.otherButtons.template"></div>'
  		    		+'</div>'
              + '<div class="form-group col-md-2" ng-if="udtTable.config.search.showLocalSearch === true">'
<<<<<<< HEAD
              +   '<input class="form-control" type="text" ng-model="searchTerms.$" ng-change="udtTable.searchLocal(searchTerms)">'
=======
              +   '<input class="form-control" type="text" ng-model="udtTable.searchTerm.data.$">'
>>>>>>> 4478b20a8302220d8985e6e4c1ba043c477e08b3
              + '</div>'
  		    		+'<div class="btn-toolbar pull-right" name="udt-toolbar-results"  ng-if="udtTable.isShowToolbarResults()">'
  		    		+	'<button class="btn btn-info" disabled="disabled" ng-if="udtTable.config.showTotalNumberRecords">{{udtTableFunctions.messagesDatatable(\'datatable.totalNumberRecords\', udtTableFunctions.getTotalNumberRecords())}}</button>'
  		    		+'</div>'
  		    		+'<div class="btn-toolbar pull-right" name="udt-toolbar-pagination"  ng-if="udtTable.isShowToolbarPagination()">'
  		    		+	'<div class="btn-group" ng-if="udtTable.isShowPagination()">'
  		    		+		'<ul class="pagination"><li ng-repeat="page in udtTable.config.pagination.pageList" ng-class="page.clazz"><a href="" ng-click="udtTableFunctions.setPageNumber(page);" ng-bind="page.label"></a></li></ul>'
  		    		+	'</div>'
  		    		+	'<div class="btn-group">'
  		    		+		'<button data-toggle="dropdown" class="btn btn-default dropdown-toggle">'
  		    		+		'{{udtTableFunctions.messagesDatatable(\'datatable.button.length\', udtTable.config.pagination.numberRecordsPerPage)}} <span class="caret"></span>'
  		    		+		'</button>'
  		    		+		'<ul class="dropdown-menu">'
  		    		+			'<li ng-repeat="elt in udtTable.config.pagination.numberRecordsPerPageList" class={{elt.clazz}}>'
  		    		+				'<a href="" ng-click="udtTableFunctions.setNumberRecordsPerPage(elt)">{{elt.number}}</a>' 
  		    		+			'</li>'
  		    		+		'</ul>'
  		    		+	'</div>'
  		    		+'</div>'  		    		  		    	
  		    		+'</div></div>');
});