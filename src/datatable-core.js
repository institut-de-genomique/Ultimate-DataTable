"use strict";

angular.module('ultimateDataTableServices', []).
factory('datatable', ['$http', '$filter', '$parse', '$window', '$q', 'udtI18n', '$timeout', '$anchorScroll', '$location',
		function($http, $filter, $parse, $window, $q, udtI18n, $timeout, $anchorScroll, $location) { //service to manage datatable
    var constructor = function(iConfig) {
        var datatable = {
            configDefault: {
                name: "datatable",
                extraHeaders: {
                    number: 0, // Number of extra headers
                    list: {}, //if dynamic=false
                    dynamic: true //if dynamic=true, the headers will be auto generated
                }, //ex: extraHeaders:{number:2,dynamic:false,list:{0:[{"label":"test","colspan":"1"},{"label":"a","colspan":"1"}],1:[{"label":"test2","colspan":"5"}]}}
                columns: [],
                /*ex :
                       {
                       "header":"Code Container", //the title //used by default Messages
                       "property":"code", //the property to bind or function used to extract the value
                       "filter":"", angular filter to filter the value only used in read mode
                       "render" : function() //render the column used to add style around value
                       "editDirectives":""//Add directives to the edit element
                       "id":'', //the column id
                       "edit":false, //can be edited or not
                       "convertValue":{
                       active:false, //True if the value have to be converted when displayed to the user
                       displayMeasureValue:"",//The unit display to the user, mandatory if active=true
                       saveMeasureValue:"" //The unit in database,  mandatory if active=true
                     },
                     "hide":true, //can be hidden or not
                     "order":true, //can be ordered or not
                     "type":"text"/"number"/"month"/"week"/"time"/"datetime"/"range"/"color"/"mail"/"tel"/"date", //the column type
                     "choiceInList":false, //when the column is in edit mode, the edition is a list of choices or not
                     "listStyle":"select"/"radio", //if choiceInList=true, listStyle="select" is a select input, listStyle="radio" is a radio input
                     "possibleValues":null, //The list of possible choices
                     "format" : null, //number format or date format or datetime format
                     "extraHeaders":{"0":"Inputs"}, //the extraHeaders list
                     "tdClass" : function with data and property as parameter than return css class or just the css class",
					 "thClass" : function with data and property as parameter than return css class or just the css class",                     
                     "position": position of the column,
                     "group": false //if column can be used to group data
                     "groupMethod": sum, average, countDistinct, collect
                     "defaultValues":"" //If the value of the column is undefined or "" when the user edit, this value show up
                     "url"://to lazy data
                     "mergeCells":false //to enable merge cell on this column
					 "required":true/false //to add * on column header if required                     
                     "
                   }*/
                columnsUrl: undefined, //Load columns config
                lines: {
                    trClass: undefined // function with data than return css class or just the css class
                },
                search: {
                    active: true,
                    mode: 'remote',
                    url: undefined
                },
                filter: {
                    active: false,
                    highlight: false,
                    columnMode: false,
                    showButton: false
                },
                pagination: {
                    active: true,
                    mode: 'remote',
                    pageNumber: 0,
                    numberPageListMax: 3,
                    pageList: [],
                    numberRecordsPerPage: 10,
                    numberRecordsPerPageList: undefined,
                    bottom:true,
                    numberRecordsPerPageForBottomdisplay:50
                },
                order: {
                    active: true,
                    showButton: true,
                    mode: 'remote', //or local
                    by: undefined,
                    reverse: false,
                    callback: undefined, //used to have a callback after order all element. the datatable is pass to callback method and number of error
                    columns: {} //key is the column index
                },
                add: {
                    active: false,
                    showButton: true,
                    init: function() {
                        return {};
                    },
                    after: true
                },
                show: {
                    active: false,
                    showButton: true,
                    add: function(line) {
                        console.log("show : add function is not defined in the controller !!!");
                    }
                },
                hide: {
                    active: false,
                    showButton: true,
                    byDefault:undefined, //Array with column property
                    columns: {} //columnIndex : true / false
                },
                edit: {
                    active: false,
                    withoutSelect: false, //edit all line without selected it
                    showButton: true,
                    showLineButton: false, // Show the edit button left of each line
                    columnMode: false,
                    byDefault: false, //put in edit mode when the datatable is build
                    start: false,
                    all: false,
                    columns: {}, //columnIndex : {edit : true/false, value:undefined}
                    lineMode: undefined //function used to define if line is editable.
                },
                save: {
                    active: false,
                    withoutEdit: false, //usable only for active/inactive save button by default !!!
                    keepEdit: false, //keep in edit mode after safe
                    showButton: true,
                    changeClass: true, //change class to success or error
                    mode: 'remote', //or local
                    url: undefined,
                    batch: false, //for batch mode one url with all data
                    method: 'post',
                    value: undefined, //used to transform the value send to the server
                    callback: undefined, //used to have a callback after save all element. the datatable is pass to callback method and number of error
                    start: false, //if save started
                    number: 0, //number of element in progress
                    error: 0,
                    newData: [],
                    enableValidation:false
                },
                remove: {
                    active: false,
                    withEdit: false, //to authorize to remove a line in edition mode
                    showButton: true,
                    mode: 'remote', //or local
                    url: undefined, //function with object in parameter !!!
                    callback: undefined, //used to have a callback after remove all element. the datatable is pass to callback method and number of error
                    start: false,
                    counter: 0,
                    number: 0, //number of element in progress
                    error: 0,
                    ids: {
                        errors: [],
                        success: []
                    }
                },
                select: {
                    active: true,
                    showButton: true,
                    isSelectAll: false,
                    callback: undefined // DEPRECATED in favor of mouseevents.clickCallback.
                },
                mouseevents: {
                    active: false,
                    overCallback: undefined,  // used to have a callback when the user passes the mouse over a row.
                    leaveCallback: undefined,  // used to have a callback when the mouse of the user leaves a row.
                    clickCallback: undefined  // used to have a callback when the user clicks on a row.
                },
                cancel: {
                    active: true,
                    showButton: true
                },
                exportCSV: {
                    active: false,
                    showButton: true,
                    delimiter: ";",
                    start: false
                },
                otherButtons: {
                    active: false,
					complex : false, //used to inject several buttons in toolbars.
                    template: undefined
                },
                messages: {
                    active: false,
                    errorClass: 'alert alert-danger',
                    successClass: 'alert alert-success',
                    errorKey: {
                        save: 'datatable.msg.error.save',
                        remove: 'datatable.msg.error.remove'
                    },
                    successKey: {
                        save: 'datatable.msg.success.save',
                        remove: 'datatable.msg.success.remove'
                    },
                    text: undefined,
                    clazz: undefined,
                    messagesService: udtI18n(navigator.languages || navigator.language || navigator.userLanguage),
                    transformKey: function(key, args) {
                        return this.messagesService.Messages(key, args);
                    }
                },
                group: {
                    active: false, //group add group=true in each line of type group
                    callback: undefined,
                    by: undefined,
                    showButton: true,
                    after: true, //to position group line before or after lines
                    showOnlyGroups: false, //to display only group line in datatable
                    start: false,
                    enableLineSelection: false, //used to authorized selection on group line
                    columns: {}
                },
                mergeCells: {
                    active: false,
                    rowspans: undefined
                },
                showTotalNumberRecords: true,
                spinner: {
                    start: false
                },
				callbackEndDisplayResult : function(){},                
                compact: true //mode compact pour le nom des bouttons

            },
            config: undefined,
            configMaster: undefined,
            allResult: undefined,
            allGroupResult: undefined,
            displayResult: undefined,
            totalNumberRecords: 0,
            computeDisplayResultTimeOut: undefined,
            urlCache: {}, //used to cache data load from column with url attribut
            lastSearchParams: undefined, //used with pagination when length or page change
            inc: 0, //used for unique column ids
            configColumnDefault: {
                edit: false, //can be edited or not
                hide: true, //can be hidden or not
                order: true, //can be ordered or not
                type: "text", //the column type
                choiceInList: false, //when the column is in edit mode, the edition is a list of choices or not
                extraHeaders: {},
                convertValue: {
                    active: false
                }
            },
            messages: udtI18n(navigator.languages || navigator.language || navigator.userLanguage), //i18n intern service instance
            //errors functions
            /**
             * Reset all the errors for a line
             */
            resetErrors: function(index) {
                this.displayResult[index].line.errors = {};
            },
            /**
             * Add error data in the line index for the field key
             */
            addErrorsForKey: function(index, data, key) {
                if (this.displayResult[index].line.errors === undefined) {
                    this.displayResult[index].line.errors = {};
                }
                this.displayResult[index].line.errors[key] = "";
                for (var i = 0; i < data[key].length; i++) {
                    this.displayResult[index].line.errors[key] += data[key][i] + " ";
                }
            },
            /**
             * Add errors data in the line index in the key of the data key error
             */
            addErrors: function(index, data) {
                for (var key in data) {
                    this.addErrorsForKey(index, data, key);
                }
            },
            /**
             * External search reinit pageNumber to 0
             */
            search: function(params) {
                this.config.edit = angular.copy(this.configMaster.edit);
                this.config.remove = angular.copy(this.configMaster.remove);
                this.config.select = angular.copy(this.configMaster.select);
                this.config.messages = angular.copy(this.configMaster.messages);
                this.config.pagination.pageNumber = 0;
                this._search(angular.copy(params));
            },
            /**
             * local search
             */
            searchLocal: function(searchTerms) {
                if (this.config.filter.active === true) {
                    //Set the properties "" or null to undefined because we don't want to filter this
                    this.setSpinner(true);
                    for (var p in searchTerms) {
                        if (searchTerms[p] != undefined && (searchTerms[p] === undefined || searchTerms[p] === null || searchTerms[p] === "")) {
                            searchTerms[p] = undefined;
                        }
                    }

                    var _allResult = angular.copy(this.allResult);
                    _allResult = $filter('filter')(this.allResult, searchTerms, false);

                    this._getAllResult = function() {
                        return _allResult;
                    };

                    this.totalNumberRecords = _allResult.length;
                    //this.sortAllResult();
                    this.computePaginationList();
                    this.computeDisplayResult();
                    var that = this;
                    this.computeDisplayResultTimeOut.then(function() {
                        that.setSpinner(false);
                    });
                }
            },
            _getAllResult: function() {
                return this.allResult;
            },
            //search functions
            /**
             * Internal Search function to populate the datatable
             */
            _search: function(params) {
                if (this.config.search.active && this.isRemoteMode(this.config.search.mode)) {
                    this.lastSearchParams = params;
                    var url = this.getUrlFunction(this.config.search.url);
                    if (url) {
                        this.setSpinner(true);
                        var that = this;
                        $http.get(url(), {
                            params: this.getParams(params),
                            datatable: this
                        }).then(function(resp) {
                            resp.config.datatable._setData(resp.data.data, resp.data.recordsNumber);
                            that.computeDisplayResultTimeOut.then(function() {
                                that.setSpinner(false);
                            });
                        });
                    } else {
                        throw 'no url define for search ! ';
                    }
                } else {
                    //console.log("search is not active !!")
                }
            },
            /**
             * Search with the last parameters
             */
            searchWithLastParams: function() {
                this._search(this.lastSearchParams);
            },

            /**
             * Set all data used by search method or directly when local data
             */
            setData: function(data, recordsNumber) {
            	this.config.edit = angular.copy(this.configMaster.edit);
                this.config.remove = angular.copy(this.configMaster.remove);
                this.config.select = angular.copy(this.configMaster.select);
                this.config.messages = angular.copy(this.configMaster.messages);
                this.config.pagination.pageNumber = 0;
                this._setData(data, recordsNumber);
            },
            
            _setData: function(data, recordsNumber) {
                var configPagination = this.config.pagination;
                if (configPagination.active && !this.isRemoteMode(configPagination.mode)) {
                    this.config.pagination.pageNumber = 0;
                }
                if (recordsNumber === undefined) recordsNumber = data.length;
                this.allResult = data;
                this.totalNumberRecords = recordsNumber;
                this.loadUrlColumnProperty();
                this.computeGroup();
                this.sortAllResult();
                this.computePaginationList();
                this.computeDisplayResult();
                this._getAllResult = function() {
                    return this.allResult;
                };
            },
            /**
             * Return all the data
             */
            getData: function() {
                return this.allResult;
            },
            /**
             * Add data
             */
            addData: function(data) {
                if (!angular.isUndefined(data) && (angular.isArray(data) && data.length > 0)) {
                    var configPagination = this.config.pagination;
                    if (configPagination.active && !this.isRemoteMode(configPagination.mode)) {
                        this.config.pagination.pageNumber = 0;
                    }
                    for (var i = 0; i < data.length; i++) {
                        this.allResult.push(data[i]);
                    }
                    this.totalNumberRecords = this.allResult.length;
                    this.loadUrlColumnProperty();
                    this.computeGroup();
                    this.sortAllResult();
                    this.computePaginationList();
                    this.computeDisplayResult();
                    this._getAllResult = function() {
                        return this.allResult;
                    };
                }
            },
            /**
             * Add new line in edit mode
             */
            addBlankLine: function() {
                if (this.config.add.active === true) {
                    //call inti method for the new data
                    var newData = this.config.add.init(this);
                    var line = {
                        "edit": true,
                        "selected": false,
                        "trClass": undefined,
                        "group": false,
                        "new": true
                    };

                    if (this.config.add.after) {
                        this.displayResult.push({
                            data: newData,
                            line: line
                        });
                    } else {
                        this.displayResult.unshift({
                            data: newData,
                            line: line
                        });
                    }
                    this.config.edit.all = true;
					this.config.edit.start = true;
                }
            },
            /**
             * compute the group
             */
            computeGroup: function() {
                if (this.config.group.active && this.config.group.by) {
                    var propertyGroupGetter = this.config.group.by.property;
                    propertyGroupGetter += this.getFilter(this.config.group.by);
                    if(this.config.group.by=="all"){
                    	propertyGroupGetter="all";
                    }					
					var groupGetter = $parse(propertyGroupGetter);
                   
                    var groupValues = this.allResult.reduce(function(array, value) {
                        var groupValue = "all";
                    	if(propertyGroupGetter !== "all"){
                    		groupValue = groupGetter(value).toString();
                    	}
                        if (!array[groupValue]) {
                            array[groupValue] = [];
                        }
                        array[groupValue].push(value);
                        return array;
                    }, {});
                    var groups = {};
                    this.allGroupResult = [];
                    for (var key in groupValues) {
                        var group = {};
                        var groupData = groupValues[key];
                        $parse("group." + this.config.group.by.id).assign(group, key);
                        var groupMethodColumns = this.getColumnsConfig().filter(function(column) {
                            return (column.groupMethod !== undefined && column.groupMethod !== null && column.property != propertyGroupGetter);
                        });
                        var that = this;
                        //compute for each number column the sum
                        groupMethodColumns.forEach(function(column) {
							if(column.id != that.config.group.by.id){ 
								var propertyGetter = column.property;
								propertyGetter += that.getFilter(column);
								var columnGetter = $parse(propertyGetter);
								var columnSetter = $parse("group." + column.id);

								if ('sum' === column.groupMethod || 'average' === column.groupMethod) {
									var result = groupData.reduce(function(value, element) {
										return value += columnGetter(element);
									}, 0);

									if ('average' === column.groupMethod) result = result / groupData.length;

									if (isNaN(result)) {
										result = "#ERROR";
									}

									try {
										columnSetter.assign(group, result);
									} catch (e) {
										console.log("computeGroup Error : " + e);
									}
								} else if ('unique' === column.groupMethod) {
									var result = $filter('udtUnique')(groupData, column.property);
									if (result.length > 1) {
										result = '#MULTI';
									} else if (result.length === 1) {
										result = columnGetter(result[0]);
									} else {
										result = undefined;
									}
									columnSetter.assign(group, result);
								} else if ('countDistinct' === column.groupMethod) {
									var result = $filter('udtCountdistinct')(groupData, propertyGetter);
									columnSetter.assign(group, result);
								} else if ('collect' === column.groupMethod) {
									var result = $filter('udtCollect')(groupData, propertyGetter);
									columnSetter.assign(group, result);
								} else {
									console.error("groupMethod is not managed " + column.groupMethod);
								}
							}
                        });

                        groups[key] = group;
                        this.allGroupResult.push(group);
                    }
                    this.config.group.data = groups;
                } else {
                    this.config.group.data = undefined;
                    this.allGroupResult = undefined;
                }

            },

            getGroupColumnValue: function(groupValue, columnProperty) {
                for (var i = 0; i < this.config.columns.length; i++) {
                    if (this.config.columns[i].property === columnProperty) {
                        var column = this.config.columns[i];
                        var columnGetter = $parse("group." + column.id);
                        return columnGetter(groupValue);
                    }
                }
                console.log("column not found for property :" + columnProperty);
                return undefined;
            },

            isGroupActive: function() {
                return (this.config.group.active && this.config.group.start);
            },

            /**
             * set the order column name
             * @param orderColumnName : column name
             */
            setGroupColumn: function(column) {
                if (this.config.group.active) {
                    var columnId;
                    column === 'all' ? columnId = 'all' : columnId = column.id;
 		    		if(this.config.group.by === undefined || this.config.group.by.property !== column.property){
						this.config.group.start = true;
                        if (columnId === "all") {
                            this.config.group.by = columnId;
                            this.config.group.columns['all'] = true;
                        } else {
                            this.config.group.by = column;
                            this.config.order.groupReverse = false;
                            this.config.group.columns[columnId] = true;
                            if (this.config.group.columns["all"]) this.config.group.columns["all"] = false;
                        }

                        for (var i = 0; i < this.config.columns.length; i++) {
                            if (this.config.columns[i].id === columnId) {
                                this.config.group.columns[this.config.columns[i].id] = true;
                            } else {
                                this.config.group.columns[this.config.columns[i].id] = false;
                            }
                        }
                    } else { //degroupe
                        this.config.group.columns[columnId] = !this.config.group.columns[columnId];
                        if (!this.config.group.columns[columnId] || this.config.group.columns["all"]) {
                            this.config.group.by = undefined;
                            this.config.group.columns["all"] = false;
                        }
                        this.config.group.start = false;
                    }

                    if (this.config.edit.active && this.config.edit.start) {
                        //TODO add a warning popup
                        console.log("edit is active, you lost all modification !!");
                        this.config.edit = angular.copy(this.configMaster.edit); //reinit edit
                    }

                    this.computeGroup();
                    this.sortAllResult(); //sort all the result
                    this.computePaginationList(); //redefined pagination
                    this.computeDisplayResult(); //redefined the result must be displayed
                    var that = this;
                    this.computeDisplayResultTimeOut.then(function() {
                        if (angular.isFunction(that.config.group.callback)) {
                            that.config.group.callback(this);
                        }
                    });
                } else {
                    //console.log("order is not active !!!");
                }
            },
            updateShowOnlyGroups: function() {
                this.sortAllResult(); //sort all the result
                this.computePaginationList(); //redefined pagination
                this.computeDisplayResult(); //redefined the result must be displayed
            },
            getGroupColumnClass: function(columnId) {
                if (this.config.group.active) {
                    if (!this.config.group.columns[columnId]) {
                        return 'fa fa-bars';
                    } else {
                        return 'fa fa-outdent';
                    }
                } else {
                    //console.log("order is not active !!!");
                }
            },
            addGroup: function(displayResultTmp) {
                var displayResult = [];
                var propertyGroupGetter = this.config.group.by.property;
                propertyGroupGetter += this.getFilter(this.config.group.by);
				if(this.config.group.by=="all"){
                	propertyGroupGetter = "all";
                }
                var groupGetter = $parse(propertyGroupGetter);
                var groupConfig = this.config.group;
                displayResultTmp.forEach(function(element, index, array) {
                    /* previous mode */
                    if (!groupConfig.after && (index === 0 || 
                    		(propertyGroupGetter!=="all" && groupGetter(element.data).toString() !== groupGetter(array[index - 1].data).toString()))) {
                         var line = {
                            edit: undefined,
                            selected: undefined,
                            trClass: undefined,
                            group: true,
                            "new": false
                        };
                        this.push({
                            data: propertyGroupGetter!=="all" ? groupConfig.data[groupGetter(element.data).toString()]:groupConfig.data["all"],
                            line: line
                        });
                    }
                    this.push(element);

                    /* after mode */
                    if (groupConfig.after && (index === (array.length - 1) || 
                    		(propertyGroupGetter!=="all" && groupGetter(element.data).toString() !== groupGetter(array[index + 1].data).toString()))) {
                        var line = {
                            "edit": undefined,
                            "selected": undefined,
                            "trClass": undefined,
                            "group": true,
                            "new": false
                        };
                        this.push({
                            data: propertyGroupGetter!=="all" ? groupConfig.data[groupGetter(element.data).toString()]:groupConfig.data["all"],
                            line: line
                        });
                    };

                }, displayResult);
                return displayResult;
            },

            getColumnValue: function(result, column) {
                var colValue = undefined;
                if (!result.line.group && (column.url === undefined || column.url === null)) {
                    var property = column.property;
                    var isFunction = false;
                    if (angular.isFunction(property)) {
                        property = property();
                        isFunction = true;
                    }
                    property += this.getFilter(column);
                    property += this.getFormatter(column);
                    colValue = $parse(property)(result.data);
					if(colValue === null)colValue = undefined;
                    if (colValue === undefined && isFunction === true) { //Because the property here is not $parsable
                        //The function have to return a $scope value
                        colValue = property;
                    }
                    if (colValue !== undefined && colValue !== null && column.type === "number") {
                        colValue = colValue.replace(/\u00a0/g, "");
                    }
                    if (colValue === undefined && column.type === "boolean") {
                        colValue = this.messages.Messages('datatable.export.no');
                    } else if (colValue !== undefined && column.type === "boolean") {
                        if (colValue) {
                            colValue = this.messages.Messages('datatable.export.yes');
                        } else {
                            colValue = this.messages.Messages('datatable.export.no');
                        }
                    }

                } else if (result.line.group) {

                    var v = $parse("group." + column.id)(result.data);
                    //if error in group function
                    if (angular.isDefined(v) && angular.isString(v) && v.charAt(0) === "#") {
                        colValue = v;
                    } else if (angular.isDefined(v)) {
                        //not filtered properties because used during the compute
                        colValue = $parse("group." + column.id + this.getFormatter(column))(result.data);
                    } else {
                        colValue = undefined;
                    }
					if(colValue === null)colValue = undefined;
                    if (colValue !== undefined && column.type === "number") {
                        colValue = colValue.replace(/\u00a0/g, "");
                    }

                } else if (!result.line.group && column.url !== undefined && column.url !== null) {
                    var url = $parse(column.url)(result.data);
                    colValue = $parse(column.property + this.getFilter(column) + this.getFormatter(column))(this.urlCache[url]);
					if(colValue === null)colValue = undefined;
                    if (colValue !== undefined && column.type === "number") {
                        colValue = colValue.replace(/\u00a0/g, "");
                    }

                }
                return colValue;
            },


            /**
             * compute for each <td> the row span if user whant to merge cell
             */
            computeRowSpans: function() {
                if (this.config.mergeCells.active === true) {
                    this.config.mergeCells.rowspans = undefined;
                    //init rowspans values
                    var rowspans = undefined;
                    rowspans = new Array(this.displayResult.length);
                    for (var i = 0; i < this.displayResult.length; i++) {
                        rowspans[i] = new Array(this.config.columns.length);
                    }

                    var currentDisplayResult = this.displayResult;
                    var currentColumns = this.config.columns;

                    var previousResult = undefined;
                    var nbRowEquals = new Array(this.config.columns.length);
                    for (var j = 0; j < nbRowEquals.length; j++) {
                        nbRowEquals[j] = 0;
                    }
                    currentDisplayResult.forEach(function(result, i) {
                        currentColumns.forEach(function(column, j) {
                            if (i > 0 && column.mergeCells) {
                                var currentColValue = this.getColumnValue(result, column);
                                var previousColValue = this.getColumnValue(previousResult, column);
                                if (currentColValue === previousColValue) {
                                    rowspans[i][j] = 0;
                                    nbRowEquals[j]++;
                                    //last element
                                    if (i === (currentDisplayResult.length - 1)) {
                                        rowspans[i - (nbRowEquals[j])][j] = nbRowEquals[j] + 1;
                                    }

                                } else {
                                    rowspans[i][j] = 1;
                                    rowspans[i - (nbRowEquals[j] + 1)][j] = nbRowEquals[j] + 1;
                                    nbRowEquals[j] = 0;
                                }
                            } else if (i === 0) {
                                rowspans[i][j] = 1;
                            }

                        }, this);
                        previousResult = result;
                    }, this);

                    this.config.mergeCells.rowspans = rowspans;
                }
            },

            /**
             * Selected only the records will be displayed.
             * Based on pagination configuration
             */
            computeDisplayResult: function() {
                var time = 100;
                if (this.computeDisplayResultTimeOut !== undefined) {
                    $timeout.cancel(this.computeDisplayResultTimeOut);
                } else {
                    time = 0;
                }

                var that = this;
                this.computeDisplayResultTimeOut = $timeout(function() {
                    //to manage local pagination
                    var configPagination = that.config.pagination;

                    var _displayResult = [];
                    if (that.config.group.start && that.config.group.showOnlyGroups) {
                        _displayResult = that.allGroupResult.slice((configPagination.pageNumber * configPagination.numberRecordsPerPage), (configPagination.pageNumber * configPagination.numberRecordsPerPage + configPagination.numberRecordsPerPage));
                        var displayResultTmp = [];
                        angular.forEach(_displayResult, function(value, key) {
                            var line = {
                                "edit": (that.config.edit.start)?true:undefined,                                
                                "selected": undefined,
                                "trClass": undefined,
                                "group": true,
                                "new": false
                            };
                            this.push({
                                data: value,
                                line: line
                            });
                        }, displayResultTmp);
                        that.displayResult = displayResultTmp;
                    } else {
                        if(configPagination.active && !that.isRemoteMode(configPagination.mode)){
							_displayResult = $.extend(true,[],that._getAllResult().slice((configPagination.pageNumber*configPagination.numberRecordsPerPage),
								(configPagination.pageNumber*configPagination.numberRecordsPerPage+configPagination.numberRecordsPerPage)));
						}else{ //to manage all records or server pagination
							_displayResult = $.extend(true,[],that._getAllResult());
						}
                        var displayResultTmp = [];
						var id = 0;
                        angular.forEach(_displayResult, function(value, key) {
                            var line = {
                                "edit": (that.config.edit.start)?true:undefined,
                                "selected": undefined,
                                "trClass": undefined,
                                "group": false,
                                "new": false,
                                "id":id++
                            };
                            this.push({
                                data: value,
                                line: line
                            });
                        }, displayResultTmp);

                        //group function
                        that.config.mergeCells.rowspans = undefined;
                        if (that.isGroupActive()) {
                            that.displayResult = that.addGroup(displayResultTmp);
                        } else {
                            that.displayResult = displayResultTmp;
                            that.computeRowSpans();
                        }

                        if (that.config.edit.byDefault) {
                            that.setEdit();
                        }
						
						if(angular.isFunction(that.config.callbackEndDisplayResult)){
							that.config.callbackEndDisplayResult();
						}
                    }
                }, time);
            },
            /**
             * Load all data for url column type
             */
            loadUrlColumnProperty: function() {

                var urlColumns = this.getColumnsConfig().filter(function(column) {
                    return (column.url !== undefined && column.url !== null);
                });

                var displayResult = this.allResult;
                var urlQueries = [];
                var urlCache = this.urlCache = {};

                urlColumns.forEach(function(column) {
                    displayResult.forEach(function(value) {
                        var url = $parse(column.url)(value);
                        if (!angular.isDefined(urlCache[url])) {
                            urlCache[url] = "in waiting data ...";
                            urlQueries.push($http.get(url, {
                                url: url
                            }));
                        }
                    });
                });

                $q.all(urlQueries).then(function(results) {
                    angular.forEach(results, function(result, key) {
                        if (result.status !== 200) {
                            console.log("Error for load column property : " + result.config.url);
                        } else {
                            urlCache[result.config.url] = result.data;
                        }
                    });
                });

            },

            //pagination functions
            /**
             * compute the pagination item list
             */
            computePaginationList: function() {
                var configPagination = this.config.pagination;
                if (configPagination.active) {
                    configPagination.pageList = [];
                    var currentPageNumber = configPagination.pageNumber;

                    var nbPages = Math.ceil(this.totalNumberRecords / configPagination.numberRecordsPerPage);
                    if (this.config.group.active && this.config.group.start && this.config.group.showOnlyGroups) {
                        nbPages = Math.ceil(this.allGroupResult.length / configPagination.numberRecordsPerPage);
                    }

                    if (currentPageNumber > nbPages - 1) {
                        configPagination.pageNumber = 0;
                        currentPageNumber = 0;
                    }

                    if (nbPages > 1 && nbPages <= configPagination.numberPageListMax) {
                        for (var i = 0; i < nbPages; i++) {
                            configPagination.pageList.push({
                                number: i,
                                label: i + 1,
                                clazz: (i != currentPageNumber) ? '' : 'active'
                            });
                        }
                    } else if (nbPages > configPagination.numberPageListMax) {
                        var min = currentPageNumber - ((configPagination.numberPageListMax - 1) / 2);
                        var max = currentPageNumber + ((configPagination.numberPageListMax - 1) / 2) + 1;
                        if (min < 0) {
                            min = 0;
                        } else if (min > nbPages - configPagination.numberPageListMax) {
                            min = nbPages - configPagination.numberPageListMax;
                        }

                        if (max < configPagination.numberPageListMax) {
                            max = configPagination.numberPageListMax;
                        } else if (max > nbPages) {
                            max = nbPages;
                        }

                        configPagination.pageList.push({
                            number: 0,
                            label: '<<',
                            clazz: (currentPageNumber != min) ? '' : 'disabled'
                        });
                        configPagination.pageList.push({
                            number: currentPageNumber - 1,
                            label: '<',
                            clazz: (currentPageNumber != min) ? '' : 'disabled'
                        });

                        for (; min < max; min++) {
                            configPagination.pageList.push({
                                number: min,
                                label: min + 1,
                                clazz: (min != currentPageNumber) ? '' : 'active'
                            });
                        }

                        configPagination.pageList.push({
                            number: currentPageNumber + 1,
                            label: '>',
                            clazz: (currentPageNumber != max - 1) ? '' : 'disabled'
                        });
                        configPagination.pageList.push({
                            number: nbPages - 1,
                            label: '>>',
                            clazz: (currentPageNumber != max - 1) ? '' : 'disabled'
                        });
                    }
                } else {
                    //console.log("pagination is not active !!!");
                }
            },

            setSpinner: function(value) {
                this.config.spinner.start = value;
            },
            /**
             * Set the number of records by page
             */
            setNumberRecordsPerPage: function(numberRecordsPerPageElement) {
                if (this.config.pagination.active) {
                    if (angular.isObject(numberRecordsPerPageElement)) {
                        this.config.pagination.numberRecordsPerPage = numberRecordsPerPageElement.number;
                        numberRecordsPerPageElement.clazz = 'active';
                        for (var i = 0; i < this.config.pagination.numberRecordsPerPageList.length; i++) {
                            if (this.config.pagination.numberRecordsPerPageList[i].number != numberRecordsPerPageElement.number) {
                                this.config.pagination.numberRecordsPerPageList[i].clazz = '';
                            }
                        }
                        if (this.config.edit.active && this.config.edit.start) {
                            //TODO add a warning popup
                            console.log("edit is active, you lost all modification !!");
                            this.config.edit = angular.copy(this.configMaster.edit); //reinit edit
                        }
                        //reinit to first page
                        this.config.pagination.pageNumber = 0;
                        if (this.isRemoteMode(this.config.pagination.mode)) {
                            this.searchWithLastParams();
                        } else {
                            this.computePaginationList();
                            this.computeDisplayResult();
                        }
                    }
                } else {
                    //console.log("pagination is not active !!!");
                }
            },
            /**
             * Change the page result
             */
            setPageNumber: function(page) {
                if (this.config.pagination.active) {
                    if (angular.isObject(page) && page.clazz === '') {
                        if (this.config.edit.active && this.config.edit.start) {
                            //TODO add a warning popup
                            console.log("edit is active, you lost all modification !!");
                            this.config.edit = angular.copy(this.configMaster.edit); //reinit edit
                        }

                        this.config.pagination.pageNumber = page.number;
                        if (this.isRemoteMode(this.config.pagination.mode)) {
                            this.searchWithLastParams();
                        } else {
                            this.computePaginationList();
                            this.computeDisplayResult();
                        }
                    }
                } else {
                    //console.log("pagination is not active !!!");
                }
            },

            //order functions
            /**
             * Sort all result
             */
            sortAllResult: function() {
                if (this.config.order.active && !this.isRemoteMode(this.config.order.mode)) {
                    var orderBy = [];

                    if (this.config.group.active && this.config.group.start && this.config.group.by !== "all") {
                        if (!this.config.group.showOnlyGroups) {
                            var orderGroupSense = (this.config.order.groupReverse) ? '-' : '+';
                            orderBy.push(orderGroupSense + this.config.group.by.property);
                            if (angular.isDefined(this.config.order.by)) {
                                var orderProperty = this.config.order.by.property;
                                orderProperty += (this.config.order.by.filter) ? '|' + this.config.order.by.filter : '';
                                var orderSense = (this.config.order.reverse) ? '-' : '+';
                                orderBy.push(orderSense + orderProperty);
                            }
                            this.allResult = $filter('orderBy')(this.allResult, orderBy);
                        } else {
                            if (angular.isDefined(this.config.order.by)) {
                                var orderProperty = "group." + this.config.order.by.id;
                                var orderSense = (this.config.order.reverse) ? '-' : '+';
                                orderBy.push(orderSense + orderProperty);
                            }
                            this.allGroupResult = $filter('orderBy')(this.allGroupResult, orderBy);
                        }
                    } else if (angular.isDefined(this.config.order.by)) {

                        if (angular.isDefined(this.config.order.by)) {
                            var orderProperty = this.config.order.by.property;
                            orderProperty += (this.config.order.by.filter) ? '|' + this.config.order.by.filter : '';
                            var orderSense = (this.config.order.reverse) ? '-' : '+';
                            orderBy.push(orderSense + orderProperty);
                        }
                        this.allResult = $filter('orderBy')(this.allResult, orderBy);
                    }
                }
            },
            /**
             * set the order column name
             * @param orderColumnName : column name
             */
            setOrderColumn: function(column) {
                if (this.config.order.active) {
                    var columnId = column.id;

                    if (angular.isDefined(this.config.group.by) && this.config.group.by.id === columnId && !this.config.group.showOnlyGroups) {
                        this.config.order.groupReverse = !this.config.order.groupReverse;
                    } else {
                        if (!angular.isDefined(this.config.order.by) || this.config.order.by.id !== columnId) {
                            this.config.order.by = column;
                            this.config.order.reverse = false;
                        } else {
                            this.config.order.reverse = !this.config.order.reverse;
                        }

                        for (var i = 0; i < this.config.columns.length; i++) {
                            if (this.config.columns[i].id === columnId) {
                                this.config.order.columns[this.config.columns[i].id] = true;
                            } else {
                                this.config.order.columns[this.config.columns[i].id] = false;
                            }
                        }
                        if (this.config.edit.active && this.config.edit.start) {
                            //TODO add a warning popup
                            console.log("edit is active, you lost all modification !!");
                            this.config.edit = angular.copy(this.configMaster.edit); //reinit edit
                        }
                    }

                    if (!this.isRemoteMode(this.config.order.mode)) {
                        this.sortAllResult(); //sort all the result
                        this.computeDisplayResult(); //redefined the result must be displayed
                    } else if (this.config.order.active) {
                        this.searchWithLastParams();
                    }
                    var that = this;
                    this.computeDisplayResultTimeOut.then(function() {
                        if (angular.isFunction(that.config.order.callback)) {
                            that.config.order.callback(this);
                        }
                    });
                } else {
                    //console.log("order is not active !!!");
                }
            },
            getOrderColumnClass: function(columnId) {
                if (this.config.order.active) {
                    if (angular.isDefined(this.config.group.by) && this.config.group.by.id === columnId && !this.config.group.showOnlyGroups) {
                        if (!this.config.order.groupReverse) {
                            return 'fa fa-sort-up';
                        } else {
                            return 'fa fa-sort-down';
                        }
                    } else {
                        if (!this.config.order.columns[columnId]) {
                            return 'fa fa-sort';
                        } else if (this.config.order.columns[columnId] && !this.config.order.reverse) {
                            return 'fa fa-sort-up';
                        } else if (this.config.order.columns[columnId] && this.config.order.reverse) {
                            return 'fa fa-sort-down';
                        }
                    }

                } else {
                    //console.log("order is not active !!!");
                }
            },
            /**
             * indicate if we can order the table
             */
            canOrder: function() {
                return (this.config.edit.active ? !this.config.edit.start : (this.config.order.active && !this.isEmpty()));
            },
            //show
            /**
             * show one element
             * work only with tab on the left
             */
            show: function() {
                if (this.config.show.active && angular.isFunction(this.config.show.add)) {
                    angular.forEach(this.displayResult, function(value, key) {
                        if (value.line.selected) {
                            this.config.show.add(value.data);
                        }
                    }, this);

                } else {
                    //console.log("show is not active !");
                }
            },
            //Hide a column
            /**
             * set the hide column
             * @param hideColumnName : column name
             */
            setHideColumn: function(column) {
                if (this.config.hide.active) {
                    var columnId = column.id;
                    if (!this.config.hide.columns[columnId]) {
                        this.config.hide.columns[columnId] = true;
                    } else {
                        this.config.hide.columns[columnId] = false;
                    }
                    this.newExtraHeaderConfig();
                } else {
                    //console.log("hide is not active !");
                }

            },

            /**
             * Test if a column must be grouped
             * @param columnId : column id
             */
            isGroup: function(columnId) {
                if (this.config.group.active && this.config.group.columns[columnId]) {
                    return this.config.group.columns[columnId];
                } else {
                    return false;
                }
            },

            /**
             * Test if a column must be hide
             * @param columnId : column id
             */
            isHide: function(columnId) {
                if (this.config.hide.active && this.config.hide.columns[columnId]) {
                    return this.config.hide.columns[columnId];
                } else {
                    //console.log("hide is not active !");
                    return false;
                }
            },
            //edit

            /**
             * set Edit all column or just one
             * @param editColumnName : column name
             */
            setEdit: function(column) {
                if (this.config.edit.active) {
                    var that = this;
                    this.computeDisplayResultTimeOut.then(function() {
                        that._getAllResult = function() {
                            return that.allResult;
                        };
                        that.config.edit.columns = {};
                        var find = false;
                        for (var i = 0; i < that.displayResult.length; i++) {

                            if (that.displayResult[i].line.selected || that.config.edit.withoutSelect || that.config.edit.byDefault) {
                                if (angular.isUndefined(that.config.edit.lineMode) || (angular.isFunction(that.config.edit.lineMode) && that.config.edit.lineMode(that.displayResult[i].data))) {
                                    that.displayResult[i].line.edit = true;
                                    find = true;
                                } else
                                    that.displayResult[i].line.edit = false;

                            } else {
                                that.displayResult[i].line.edit = false;
                            }
                        }
                        that.selectAll(false);
                        if (find) {
                            that.config.edit.start = true;
                            if (column) {
                                that.config.edit.all = false;
                                var columnId = column.id;
                                if (angular.isUndefined(that.config.edit.columns[columnId])) {
                                    that.config.edit.columns[columnId] = {};
                                }
                                that.config.edit.columns[columnId].edit = true;
                            } else that.config.edit.all = true;
                        }
                    });
                } else {
                    //console.log("edit is not active !");
                }
            },
            /**
             * Test if a column must be in edition mode
             * @param editColumnName : column name
             * @param line : the line in the table
             */
            isEdit: function(columnId, line) {
                var isEdit = false;
                if (this.config.edit.active) {
                    if (columnId && line) {
                        if (angular.isUndefined(this.config.edit.columns[columnId])) {
                            this.config.edit.columns[columnId] = {};
                        }
                        var columnEdit = this.config.edit.columns[columnId].edit;
                        isEdit = (line.edit && columnEdit) || (line.edit && this.config.edit.all);
                    } else if (columnId) {
                        if (angular.isUndefined(this.config.edit.columns[columnId])) {
                            this.config.edit.columns[columnId] = {};
                        }
                        var columnEdit = this.config.edit.columns[columnId].edit;
                        isEdit = (columnEdit || this.config.edit.all);
                    } else if (line) {
                        isEdit = line.edit && this.config.edit.all;
                    } else {
                    	var nbEditableColumns = $filter('filter')(this.config.columns, {"edit":true}).length;                     	
                        isEdit = (this.config.edit.columnMode && this.config.edit.start && nbEditableColumns > 0);
                    }
                }
                return isEdit;
            },
            /**
             * indicate if at least one line is selected
             */
            canEdit: function() {
                return (this.config.edit.withoutSelect ? true : this.isSelect());
            },
            /**
             * Update all line with the same value
             * @param updateColumnName : column name
             */
            updateColumn: function(columnPropertyName, columnId) {
                if (this.config.edit.active && this.config.edit.columns[columnId].value !== undefined) {
                    var getter = $parse(columnPropertyName);
                    for (var i = 0; i < this.displayResult.length; i++) {
                        if (this.displayResult[i].line.edit) {
                            getter.assign(this.displayResult[i].data, this.config.edit.columns[columnId].value);
                        }
                    }
                } else {
                    //console.log("edit is not active !");
                }
            },
            //save
            /**
             * Save the selected table line
             */
            save: function() {
                if (this.config.save.active && this.displayResult) {
                	if(this.formController.$invalid){
                		this.config.save.enableValidation = true;            		
            		}else{
						this.config.save.number = 0;
						this.config.save.error = 0;
						this.config.save.start = true;
						this.setSpinner(true);
						this.config.messages.text = undefined;
						this.config.messages.clazz = undefined;
						var data = [];

						var valueFunction = this.getValueFunction(this.config.save.value);
						for (var i = 0; i < this.displayResult.length; i++) {
							if (this.displayResult[i].line.edit || this.config.save.withoutEdit) {
								//remove datatable properties to avoid this data are retrieve in the json
								this.config.save.number++;
								this.displayResult[i].line.trClass = undefined;
								this.displayResult[i].line.selected = undefined;
								this.resetErrors(i);
								if (this.isRemoteMode(this.config.save.mode) && !this.config.save.batch) {
									//add the url in table to used $q
									data.push(this.getSaveRemoteRequest(this.displayResult[i].data, i));
								} else if (this.isRemoteMode(this.config.save.mode) && this.config.save.batch) {
									//add the data in table to send in once all the result
									data.push({
										index: i,
										data: valueFunction(this.displayResult[i].data)
									});
								} else {
									this.saveLocal(valueFunction(this.displayResult[i].data), i);
								}
							}
						}
						if (!this.isRemoteMode(this.config.save.mode) || data.length === 0) {
							this.saveFinish();
						} else if (this.isRemoteMode(this.config.save.mode) && !this.config.save.batch) {
							this.saveRemote(data);
						} else if (this.isRemoteMode(this.config.save.mode) && this.config.save.batch) {
							this.saveBatchRemote(data);
						}
					}
                } else {
                    //console.log("save is not active !");
                }
            },

            saveBatchRemote: function(values) {
                var nbElementByBatch = Math.ceil(values.length / 6); //6 because 6 request max in parrallel with firefox and chrome
                var queries = [];
                for (var i = 0; i < 6 && values.length > 0; i++) {
                    queries.push(this.getSaveRemoteRequest(values.splice(0, nbElementByBatch)));
                }
                $q.all(queries).then(function(results) {
                    angular.forEach(results, function(result, key) {
                        if (result.status !== 200) {
                            console.log("Error for batch save");
                        } else {
                            angular.forEach(result.data, function(value, key) {
                                this.datatable.saveRemoteOneElement(value.status, value.data, value.index);
                            }, result.config);
                        }

                    });
                });
            },

            saveRemote: function(queries) {
                $q.all(queries).then(function(results) {
                    angular.forEach(results, function(value, key) {
                        value.config.datatable.saveRemoteOneElement(value.status, value.data, value.config.index);
                    });
                });
            },

            saveRemoteOneElement: function(status, value, index) {
                if (status !== 200) {
                    if (this.config.save.changeClass) {
                        this.displayResult[index].line.trClass = "danger";
                    }
                    this.displayResult[index].line.edit = true;
                    this.addErrors(index, value);
                    this.config.save.error++;
                    this.config.save.number--;
                    this.saveFinish();
                } else {
                    this.resetErrors(index);
                    this.saveLocal(value, index);
                    this.saveFinish();
                }
            },

            getSaveRemoteRequest: function(value, i) {
                var urlFunction = this.getUrlFunction(this.config.save.url);
                var method = this.config.save.method;
                if (angular.isFunction(method)) {
                    method = method(value);
                }
                var httpConfig = {
                    datatable: this
                };
                if (angular.isObject(this.config.save.httpConfig)) {
                    angular.merge(httpConfig, this.config.save.httpConfig);
                }
                if (urlFunction) {
                    if (this.config.save.batch) {
                        return $http[method](urlFunction(value), value, httpConfig);
                    } else {
                        var valueFunction = this.getValueFunction(this.config.save.value);
                        httpConfig.index = i;
                        return $http[method](urlFunction(value), valueFunction(value), httpConfig).
                        then(function(resp) {
                            resp.config.datatable.saveRemoteOneElement(resp.status, resp.data, resp.config.index);
                            return resp;
                        }, function(resp) {
                            resp.config.datatable.saveRemoteOneElement(resp.status, resp.data, resp.config.index);
                            return resp;
                        });

                    }
                } else {
                    throw 'no url define for save !';
                }
            },

            /**
             * Call after save to update the records property
             */
            saveLocal: function(data, i) {
                if (this.config.save.active) {
                    if (data) {
                        this.displayResult[i].data = data;
                    }

                    //update in the all result table
                    if (!this.displayResult[i].line["new"]) {
                        var j = i;
                        if (this.config.pagination.active && !this.isRemoteMode(this.config.pagination.mode)) {
                            j = i + (this.config.pagination.pageNumber * this.config.pagination.numberRecordsPerPage);
                        }
						this.allResult[j] = $.extend(true,{},this.displayResult[i].data);


                    } else {
                        this.config.save.newData.push(data);
                    }

                    if (!this.config.save.keepEdit) {
                        this.displayResult[i].line.edit = undefined;
                    } else {
                        this.displayResult[i].line.edit = true;
                    }

                    if (this.config.save.changeClass) {
                        this.displayResult[i].line.trClass = "success";
                    }
                    this.config.save.number--;
                } else {
                    //console.log("save is not active !");
                }
            },
            /**
             * Call when a save local or remote is finish
             */
            saveFinish: function() {
                if (this.config.save.number === 0) {
                    if (this.config.save.error > 0) {
                        this.config.messages.clazz = this.config.messages.errorClass;
                        this.config.messages.text = this.config.messages.transformKey(this.config.messages.errorKey.save, this.config.save.error);
                    } else {
                        this.config.messages.clazz = this.config.messages.successClass;
                        this.config.messages.text = this.config.messages.transformKey(this.config.messages.successKey.save);
                    }

                    if (angular.isFunction(this.config.save.callback)) {
                        this.config.save.callback(this, this.config.save.error);
                    }
                    if (!this.config.save.keepEdit && this.config.save.error === 0) {
                        this.config.edit.start = false;
                    }
                    this.config.save.error = 0;
                    this.config.save.start = false;
                    //insert new data create by addBlank in result
                    if (this.config.save.newData.length > 0) {
                        this.addData(this.config.save.newData);
                    }
                    this.config.save.newData = [];
					this.config.save.enableValidation = false;                    
                    this.setSpinner(false);
                }

            },
            /**
             * Test if save mode can be enable
             */
            canSave: function() {
                if (this.config.edit.active && !this.config.save.withoutEdit && !this.config.save.start) {
                    return this.config.edit.start;
                } else if (this.config.edit.active && this.config.save.withoutEdit && !this.config.save.start) {
                    return true;
                } else {
                    return false;
                }
            },
            //remove
            /**
             *  Remove the selected table lines
             */
            remove: function() {
                if (this.config.remove.active && !this.config.remove.start) {
                    var r = $window.confirm(this.messages.Messages("datatable.remove.confirm"));
                    if (r) {
                        this.setSpinner(true);
                        this.config.messages.text = undefined;
                        this.config.messages.clazz = undefined;

                        this.config.remove.counter = 0;
                        this.config.remove.start = true;
                        this.config.remove.number = 0;
                        this.config.remove.error = 0;
                        this.config.remove.ids = {
                            errors: [],
                            success: []
                        };

                        for (var i = 0; i < this.displayResult.length; i++) {
                            if (this.displayResult[i].line.selected && (!this.displayResult[i].line.edit || this.config.remove.withEdit)) {
                                if (this.isRemoteMode(this.config.remove.mode)) {
                                    this.config.remove.number++;
                                    this.removeRemote(this.displayResult[i].data, i);
                                } else {
                                    this.config.remove.ids.success.push(i);
                                }
                            }
                        }
                        if (!this.isRemoteMode(this.config.remove.mode)) {
                            this.removeFinish();
                        }
                    }
                } else {
                    //console.log("remove is not active !");
                }
            },

            /**
             * Call after save to update the records property
             */
            removeLocal: function(i) {
                if (this.config.remove.active && this.config.remove.start) {
                    //update in the all result table
                    var j;
                    if (this.config.pagination.active && !this.isRemoteMode(this.config.pagination.mode)) {
                        j = (i + (this.config.pagination.pageNumber * this.config.pagination.numberRecordsPerPage)) - this.config.remove.counter;
                    } else {
                        j = i - this.config.remove.counter;
                    }
                    this.allResult.splice(j, 1);
                    this.config.remove.counter++;
                    this.totalNumberRecords--;
                } else {
                    //console.log("remove is not active !");
                }
            },

            removeRemote: function(value, i) {
                var url = this.getUrlFunction(this.config.remove.url);
                if (url) {
                    return $http['delete'](url(value), {
                            datatable: this,
                            index: i,
                            value: value
                        })
                        .then(function(resp) {
                            resp.config.datatable.config.remove.ids.success.push(resp.config.index);
                            resp.config.datatable.config.remove.number--;
                            resp.config.datatable.removeFinish();
                            return resp;
                        }, function(resp) {
                            resp.config.datatable.config.remove.ids.errors.push(resp.config.value);
                            resp.config.datatable.config.remove.error++;
                            resp.config.datatable.config.remove.number--;
                            resp.config.datatable.removeFinish();
                            return resp;
                        });
                } else {
                    throw 'no url define for save !';
                }
            },


            /**
             * Call when a remove is done
             */
            removeFinish: function() {
                if (this.config.remove.number === 0) {

                    this.config.remove.ids.success.sort(function(a, b) {
                        return a - b;
                    }).forEach(function(i) {
                        this.removeLocal(i);
                    }, this);


                    if (this.config.remove.error > 0) {
                        this.config.messages.clazz = this.config.messages.errorClass;
                        this.config.messages.text = this.config.messages.transformKey(this.config.messages.errorKey.remove, this.config.remove.error);
                    } else {
                        this.config.messages.clazz = this.config.messages.successClass;
                        this.config.messages.text = this.config.messages.transformKey(this.config.messages.successKey.remove);
                    }

                    if (angular.isFunction(this.config.remove.callback)) {
                        this.config.remove.callback(this, this.config.remove.error);
                    }

                    this.computePaginationList();
                    this.computeDisplayResult();
                    var that = this;
                    this.computeDisplayResultTimeOut.then(function() {
                        if (that.config.remove.ids.errors.length > 0) {
                            that.displayResult.every(function(value, index) {
                                var errors = that.config.remove.ids.errors;
                                for (var i = 0; i < errors.length; i++) {
                                    if (angular.equals(value.data, errors[i])) {
                                        value.line.trClass = "danger";
                                        errors.splice(i, 1);
                                        break;
                                    }
                                }
                                if (errors.length === 0) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }, that);
                        }


                        that.config.select.isSelectAll = false;
                        that.config.remove.error = 0;
                        that.config.remove.start = false;
                        that.config.remove.counter = 0;
                        that.config.remove.ids = {
                            error: [],
                            success: []
                        };
                        that.setSpinner(false);
                    });
                };
            },

            /**
             * indicate if at least one line is selected and not in edit mode
             */
            canRemove: function() {
                if (this.config.remove.active && !this.config.remove.start) {
                    for (var i = 0; this.displayResult && i < this.displayResult.length; i++) {
                        if (this.displayResult[i].line.selected && (!this.displayResult[i].line.edit || this.config.remove.withEdit)) return true;
                    }
                } else {
                    //console.log("remove is not active !");
                    return false;
                }
            },
            //select
            /**
             * Select or unselect all line
             * value = true or false
             */
            selectAll: function(value) {
                if (this.config.select.active && this.displayResult) {
                    this.config.select.isSelectAll = value;
                    for (var i = 0; i < this.displayResult.length; i++) {
                        if (value) {
                            if (!this.displayResult[i].line.group) {
                                this.displayResult[i].line.selected = true;
                                this.displayResult[i].line.trClass = "info";
                            } else if (this.displayResult[i].line.group && this.config.group.enableLineSelection) {
                                this.displayResult[i].line.groupSelected = true;
                                this.displayResult[i].line.trClass = "info";
                            }


                        } else {
                            if (!this.displayResult[i].line.group) {
                                this.displayResult[i].line.selected = false;
                                this.displayResult[i].line.trClass = undefined;
                            } else if (this.displayResult[i].line.group && this.config.group.enableLineSelection) {
                                this.displayResult[i].line.groupSelected = false;
                                this.displayResult[i].line.trClass = undefined;
                            }
                        }
                        if (angular.isFunction(this.config.select.callback)) {
                        	this.config.select.callback(this.displayResult[i].line, this.displayResult[i].data);
                        }
                    }
                } else {
                    //console.log("select is not active");
                }
            },

            /**
             * Return all selected element and unselect the data
             */
            getSelection: function(unselect) {
                var selection = [];
                for (var i = 0; i < this.displayResult.length; i++) {
                    if (this.displayResult[i].line.selected) {
                        //unselect selection
                        if (unselect) {
                            this.displayResult[i].line.selected = false;
                            this.displayResult[i].line.trClass = undefined;
                        }
                        selection.push($.extend(true,{},this.displayResult[i].data));
                    } else if (this.displayResult[i].line.groupSelected) {
                        //unselect selection
                        if (unselect) {
                            this.displayResult[i].line.groupSelected = false;
                            this.displayResult[i].line.trClass = undefined;
                        }
                        selection.push($.extend(true,{},this.displayResult[i].data));
                    }
                }
                if (unselect) {
                    this.config.select.isSelectAll = false;
                }
                return selection;
            },
            /**
             * indicate if at least one line is selected
             */
            isSelect: function() {
                for (var i = 0; this.displayResult && i < this.displayResult.length; i++) {
                    if (this.displayResult[i].line.selected) return true;
                }
                return false;
            },
            isSelectGroup: function() {
                for (var i = 0; this.displayResult && i < this.displayResult.length; i++) {
                    if (this.displayResult[i].line.groupSelected) return true;
                }
                return false;
            },
            /**
             * cancel edit, hide and selected lines only
             */
            cancel: function() {
                if (this.config.cancel.active) {
                    /*cancel only edit and hide mode */
                    this.config.edit = angular.copy(this.configMaster.edit);
                    this.config.hide = angular.copy(this.configMaster.hide);
                    this.config.remove = angular.copy(this.configMaster.remove);
                    this.config.select = angular.copy(this.configMaster.select);
                    this.config.messages = angular.copy(this.configMaster.messages);
                    this.totalNumberRecords = this.allResult.length;
                    this.setHideColumnByDefault();
                    this.newExtraHeaderConfig();
                    this.computePaginationList();
                    this.computeDisplayResult();

                }
            },

            //template helper functions
            isShowToolbar: function() {
                return (this.isShowToolbarButtons() || this.isShowToolbarPagination() || this.isShowToolbarResults());
            },
			isShowToolbarBottom: function() {
                return (this.isShowToolbarPagination() && this.config.pagination.bottom && this.config.pagination.numberRecordsPerPage >= this.config.pagination.numberRecordsPerPageForBottomdisplay);
            },
            isShowToolbarButtons: function() {
                return (this.isShowCRUDButtons() || this.isShowHideButtons() || this.isShowAddButtons() || this.isShowShowButtons() || this.isShowExportCSVButton() || this.isShowOtherButtons());
            },			
            isShowCRUDButtons: function() {
                return ((this.config.edit.active && this.config.edit.showButton) || (this.config.save.active && this.config.save.showButton) || (this.config.remove.active && this.config.remove.showButton));
            },
            isShowAddButtons: function() {
                return (this.config.add.active && this.config.add.showButton);
            },
            isShowShowButtons: function() {
                return  (this.config.show.active && this.config.show.showButton);
            },
            isShowHideButtons: function() {
                return (this.config.hide.active && this.config.hide.showButton && this.getHideColumns().length > 0);
            },
            isShowOtherButtons: function() {
                return (this.config.otherButtons.active && this.config.otherButtons.template !== undefined);
            },
            isShowToolbarPagination: function() {
                return this.config.pagination.active;
            },
            isShowPagination: function() {
                return (this.config.pagination.active && this.config.pagination.pageList.length > 0);
            },
            isShowToolbarResults: function() {
                return this.config.showTotalNumberRecords;
            },

            isCompactMode: function() {
                return this.config.compact;
            },

            isEmpty: function() {
                return (this.allResult === undefined || this.allResult === null || this.allResult.length === 0);
            },
			
			goToAnchor : function(hash){
            	$anchorScroll.yOffset = 50;
            	if ($location.hash() !== hash) {
                    // set the $location.hash to `newHash` and
                    // $anchorScroll will automatically scroll to it
                    $location.hash(hash);
                  } else {
                    // call $anchorScroll() explicitly,
                    // since $location.hash hasn't changed
                    $anchorScroll();
                  }
            },
            /**
             * Function to show (or not) the "CSV Export" button
             */
            isShowExportCSVButton: function() {
                return (this.config.exportCSV.active && this.config.exportCSV.showButton);
            },

            isShowButton: function(configParam, column) {
                if (column) {
                    return (this.config[configParam].active && ((this.config[configParam].showButtonColumn !== undefined && this.config[configParam].showButtonColumn) || this.config[configParam].showButton) && column[configParam]);
                } else {
                    return (this.config[configParam].active && this.config[configParam].showButton);
                }
            },

            isShowLineEditButton: function() {
                return this.config.edit.active && this.config.edit.showLineButton;
            },

            setShowButton: function(configParam, value) {
                if (this.config[configParam].active) {
                    this.config[configParam].showButton = value;
                }
            },

            /**
             * Add pagination parameters if needed
             */
            getParams: function(params) {
                if (angular.isUndefined(params)) {
                    params = {};
                }
                params.datatable = true;
                if (this.config.pagination.active) {
                    params.paginationMode = this.config.pagination.mode;
                    if (this.isRemoteMode(this.config.pagination.mode)) {
                        params.pageNumber = this.config.pagination.pageNumber;
                        params.numberRecordsPerPage = this.config.pagination.numberRecordsPerPage;
                    }
                }

                if (this.config.order.active && this.isRemoteMode(this.config.order.mode) && angular.isDefined(this.config.order.by)) {
                    params.orderBy = this.config.order.by.property;
                    params.orderSense = (this.config.order.reverse) ? "-1" : "1";
                }
                return params;
            },
            /**
             * Return an url from play js object or string
             */
            getUrlFunction: function(url) {
                if (angular.isObject(url)) {
                    if (angular.isDefined(url.url)) {
                        return function(value) {
                            return url.url;
                        };
                    }
                } else if (angular.isString(url)) {
                    return function(value) {
                        return url;
                    };
                } else if (angular.isFunction(url)) {
                    return url;
                }
                return undefined;
            },
            /**
             * Return a function to transform value if exist or the default mode
             */
            getValueFunction: function(valueFunction) {
                if (angular.isFunction(valueFunction)) {
                    return valueFunction;
                }
                return function(value) {
                    return value;
                };
            },
            /**
             * test is remote mode
             */
            isRemoteMode: function(mode) {
                if (mode && mode === 'remote') {
                    return true;
                } else {
                    return false;
                }
            },
            setHideColumnByDefault: function(){
            	if(this.config.hide.active && angular.isDefined(this.config.hide.byDefault)){
                    if(!angular.isArray(this.config.hide.byDefault))this.config.hide.byDefault = [this.config.hide.byDefault];
                    angular.forEach(this.config.columns, function(column, key){
                    	angular.forEach(this.config.hide.byDefault,function(value, key){
                    		if(value === column.property){
                    			this.setHideColumn(column);
                    		}
                    	},this);
                    }, this);
                }
            },
            /**
             * Set columns configuration
             */
            setColumnsConfig: function(columns) {
                if (angular.isDefined(columns)) {
                    var initPosition = 1000000;
                    for (var i = 0; i < columns.length; i++) {

                        if (!columns[i].type || columns[i].type.toLowerCase() === "string") {
                            columns[i].type = "text";
                        } else {
                            columns[i].type = columns[i].type.toLowerCase();
                        }

                        if (columns[i].type === "img" || columns[i].type === "image") {
                            if (!columns[i].format) console.log("missing format for " + columns[i].property);
                            if (!columns[i].width) columns[i].width = '100%';
                        }


                        columns[i].id = this.generateColumnId();
                        /*
				          if(columns[i].hide && !this.config.hide.active){
				          columns[i].hide = false;
				        }
				        if(columns[i].order && !this.config.order.active){
				        columns[i].order = false;
				      }
				      if(columns[i].edit && !this.config.edit.active){
				      columns[i].edit = false;
				    }
				    if(columns[i].mergeCells && !this.config.mergeCells.active){
				    columns[i].mergeCells = false;
				  }
                         */
                        //TODO: else{Error here ?}

                        if (columns[i].choiceInList && !angular.isDefined(columns[i].listStyle)) {
                            columns[i].listStyle = "select";
                        }

                        if (columns[i].choiceInList && !angular.isDefined(columns[i].possibleValues)) {
                            columns[i].possibleValues = [];
                        }

                        if (this.config.group.active && angular.isDefined(this.config.group.by) && (columns[i].property === this.config.group.by || columns[i].property === this.config.group.by.property)) {
                            this.config.group.by = columns[i];
                            this.config.group.start=true;
							this.config.group.columns[columns[i].id] = true;
                            columns[i].group = true;
                        } else {
                            this.config.group.columns[columns[i].id] = false;
                        }
                        if (this.config.order.active && angular.isDefined(this.config.order.by) && (columns[i].property === this.config.order.by || columns[i].property === this.config.order.by.property)) {
                            this.config.order.by = columns[i];
                            this.config.order.columns[columns[i].id] = true;
                            columns[i].order = true;
                        } else {
                            this.config.order.columns[columns[i].id] = false;
                        }

                        //ack to keep the default order in chrome
                        if (null === columns[i].position || undefined === columns[i].position) {
                            columns[i].position = initPosition++;
                        }

                        if (columns[i].convertValue !== undefined && columns[i].convertValue !== null && columns[i].convertValue.active === true && (columns[i].convertValue.displayMeasureValue === undefined || columns[i].convertValue.saveMeasureValue === undefined)) {
                            throw "Columns config error: " + columns[i].property + " convertValue=active but convertValue.displayMeasureValue or convertValue.saveMeasureValue is missing";
                        }

                        if(null === columns[i].showFilter || undefined === columns[i].showFilter){
                            columns[i].showFilter = false;
                        }
						
						if(null === columns[i].edit || undefined === columns[i].edit){
                            columns[i].edit = false;
                        }
                    }


                    var settings = $.extend(true, [], this.configColumnDefault, columns);
                    settings = $filter('orderBy')(settings, 'position');

                    this.config.columns = angular.copy(settings);
                    this.configMaster.columns = angular.copy(settings);
                    this.setHideColumnByDefault();
                    this.newExtraHeaderConfig();
					if(this.allResult){
						this.computeGroup();
						this.sortAllResult();
						this.computePaginationList();
						this.computeDisplayResult();
					}
                }
            },
            setColumnsConfigWithUrl: function() {
                $http.get(this.config.columnsUrl, {
                    datatable: this
                }).then(function(resp) {
                    resp.config.datatable.setColumnsConfig(resp.data);
                    return resp;
                });
            },
            getColumnsConfig: function() {
                return this.config.columns;
            },

            getConfig: function() {
                return this.config;
            },
            setConfig: function(config) {
                var settings = $.extend(true, {}, this.configDefault, config);
                this.config = angular.copy(settings);

                if(!this.config.pagination.numberRecordsPerPageList){
                	this.config.pagination.numberRecordsPerPageList = [{
                        number: 10,
                        clazz: ''
                    }, {
                        number: 25,
                        clazz: ''
                    }, {
                        number: 50,
                        clazz: ''
                    }, {
                        number: 100,
                        clazz: ''
                    }];

                }

                this.configMaster = angular.copy(settings);
                if (this.config.columnsUrl) {
                    this.setColumnsConfigWithUrl();
                } else {
                    this.setColumnsConfig(this.config.columns);
                }



                if (this.displayResult && this.displayResult.length > 0) {
                    this.computePaginationList();
                    this.computeDisplayResult();
                }
            },

            /**
             * Return column with hide
             */
            getHideColumns: function() {
                var c = [];
                for (var i = 0; i < this.config.columns.length; i++) {
                    if (this.config.columns[i].hide) {
                        c.push(this.config.columns[i]);
                    }
                }
                return c;
            },

            /**
             * Return column with group
             */
            getGroupColumns: function() {
                var c = [];
                for (var i = 0; i < this.config.columns.length; i++) {
                    if (this.config.columns[i].group) {
                        c.push(this.config.columns[i]);
                    }
                }
                return c;
            },

            /**
             * Return column with edit
             */
            getEditColumns: function() {
                var c = [];
                for (var i = 0; i < this.config.columns.length; i++) {
                    if (this.config.columns[i].edit) c.push(this.config.columns[i]);
                }
                return c;
            },
            generateColumnId: function() {
                this.inc++;
                return "p" + this.inc;
            },
            newColumn: function(header, property, edit, hide, order, type, choiceInList, possibleValues, extraHeaders) {
                var column = {};
                column.id = this.generateColumnId();
                column.header = header;
                column.property = property;
                column.edit = edit;
                column.hide = hide;
                column.order = order;
                column.type = type;
                column.choiceInList = choiceInList;
                if (possibleValues != undefined) {
                    column.possibleValues = possibleValues;
                }

                if (extraHeaders != undefined) {
                    column.extraHeaders = extraHeaders;
                }

                return column;
            },
            /**
             * Add a new column to the table with the <th>title</th>
             * at position
             */
            addColumn: function(position, column) {
                if (position >= 0) {
                    column.position = position;
                }

                this.config.columns.push(column);
                this.setColumnsConfig(this.config.columns);
                this.newExtraHeaderConfig();
            },
            /**
             * Remove a column at position
             */
            deleteColumn: function(position) {
                this.config.columns.splice(position, 1);
                this.newExtraHeaderConfig();
            },
            addToExtraHeaderConfig: function(pos, header) {
                if (!angular.isDefined(this.config.extraHeaders.list[pos])) {
                    this.config.extraHeaders.list[pos] = [];
                }
                this.config.extraHeaders.list[pos].push(header);
            },
            getExtraHeaderConfig: function() {
                return this.config.extraHeaders.list;
            },
            newExtraHeaderConfig: function() {
                if (this.config.extraHeaders.dynamic === true) {
                    this.config.extraHeaders.list = {};
                    var lineUsed = false; // If we don't have label in a line, we don't want to show the line
                    var count = 0; //Number of undefined extraHeader column beetween two defined ones
                    //Every level of header
                    for (var i = 0; i < this.config.extraHeaders.number; i++) {
                        lineUsed = false; //re-init because new line
                        var header = undefined;
                        //Every column
                        for (var j = 0; j < this.config.columns.length; j++) {
                            if (!this.isHide(this.config.columns[j].id)) {
                                //if the column have a extra header for this level
                                if (this.config.columns[j].extraHeaders !== undefined && this.config.columns[j].extraHeaders[i] !== undefined) {
                                    lineUsed = true;
                                    if (count > 0) {
                                        //adding the empty header of undefined extraHeader columns
                                        this.addToExtraHeaderConfig(i, {
                                            "label": "",
                                            "colspan": count
                                        });
                                        count = 0; //Reset the count to 0
                                    }
                                    //The first time the header will be undefined
                                    if (header === undefined) {
                                        //create the new header with colspan 0 (the current column will be counted)
                                        header = {
                                            "label": this.config.columns[j].extraHeaders[i],
                                            "colspan": 0
                                        };
                                    }

                                    //if two near columns have the same header
                                    if (this.config.columns[j].extraHeaders[i] === header.label) {
                                        header.colspan += 1;
                                    } else {
                                        //We have a new header
                                        //adding the current one
                                        this.addToExtraHeaderConfig(i, header);
                                        //and create the new one with colspan 1
                                        //colspan = 1 because we're already on the first column who have this header
                                        header = {
                                            "label": this.config.columns[j].extraHeaders[i],
                                            "colspan": 1
                                        };
                                    }

                                } else if (header !== undefined) {
                                    lineUsed = true;
                                    //If we find a undefined column, we add the old header
                                    this.addToExtraHeaderConfig(i, header);
                                    //and increment the count var
                                    count++;
                                    //The old header is added
                                    header = undefined;
                                } else {
                                    //No header to add, the previous one was a undefined column
                                    //increment the count var
                                    count++;
                                }
                            }
                        }

                        //At the end of the level loop
                        //If we have undefined column left
                        //And the line have at least one item
                        if (count > 0 && (lineUsed === true || header !== undefined)) {
                            this.addToExtraHeaderConfig(i, {
                                "label": "",
                                "colspan": count
                            });
                            count = 0;
                        }

                        //If we have defined column left
                        if (header !== undefined) {
                            this.addToExtraHeaderConfig(i, header);
                        }
                    }
                }
            },


            /**
             * Function to export data in a CSV file
             */
            exportCSV: function(exportType) {
                if (this.config.exportCSV.active) {
                    this.config.exportCSV.start = true;
                    var delimiter = this.config.exportCSV.delimiter,
                        lineValue = "",
                        colValue, that = this;

                    //calcule results ( code extracted from method computeDisplayResult() )
                    var displayResultTmp = [];
					if (this.isGroupActive()) {
                    	this.allResult = $filter('orderBy')(this.allResult, this.config.group.by.property);
                    }
                    angular.forEach(this.allResult, function(value, key) {
                        var line = {
                            "edit": undefined,
                            "selected": undefined,
                            "trClass": undefined,
                            "group": false,
                            "new": false
                        };
                        this.push({
                            data: value,
                            line: line
                        });
                    }, displayResultTmp);
                    if (this.isGroupActive()) {
                        displayResultTmp = this.addGroup(displayResultTmp);
                    }
                    //manage results
                    if (displayResultTmp) {

                        var columnsToPrint = this.config.columns;
                        //header
                        columnsToPrint.forEach(function(column) {
                            if (!that.config.hide.columns[column.id]) {

                                var header = column.header;
                                if (angular.isFunction(header)) {
                                    header = header();
                                }else{
                                	header = that.config.messages.transformKey(header);
                                }

                                if (that.isGroupActive()) {
                                    if (column.groupMethod === "sum") {
                                        header = header + this.messages.Messages('datatable.export.sum');
                                    } else if (column.groupMethod === "average") {
                                        header = header + this.messages.Messages('datatable.export.average');
                                    } else if (column.groupMethod === "unique") {
                                        header = header + this.messages.Messages('datatable.export.unique');
                                    } else if (column.groupMethod === "countDistinct") {
                                        header = header + this.messages.Messages('datatable.export.countDistinct');
                                    }
                                }
                                lineValue = lineValue + header + delimiter;
                            }
                        }, this);
                        lineValue = lineValue.substr(0, lineValue.length - 1) + "\n";
                        //data
                        displayResultTmp.forEach(function(result) {

                            columnsToPrint.forEach(function(column) {
                                if (!that.config.hide.columns[column.id]) {
                                    //algo to set colValue (value of the column)
                                    if (!result.line.group && (column.url === undefined || column.url === null) && exportType !== 'groupsOnly') {
                                        var property = column.property;
                                        var isFunction = false;
                                        if (angular.isFunction(property)) {
                                            property = property();
                                            isFunction = true;
                                        }
                                        property += that.getFilter(column);
                                        property += that.getFormatter(column);
                                        colValue = $parse(property)(result.data);
										if(colValue === null)colValue = undefined;
                                        if (colValue === undefined && isFunction === true) { //Because the property here is not $parsable
                                            //The function have to return a $scope value
                                            colValue = property;
                                        }
                                        if (colValue !== undefined && column.type === "number") {
                                            colValue = colValue.replace(/\u00a0/g, "");
                                        }
                                        if (colValue === undefined && column.type === "boolean") {
                                            colValue = this.messages.Messages('datatable.export.no');
                                        } else if (colValue !== undefined && column.type === "boolean") {
                                            if (colValue) {
                                                colValue = this.messages.Messages('datatable.export.yes');
                                            } else {
                                                colValue = this.messages.Messages('datatable.export.no');
                                            }
                                        }
										
										if((column.type === "string" || column.type === "text"  || column.type === "textarea") && colValue){
                                        	if(Array.isArray(colValue) && colValue.length === 1  && colValue[0].search
                                        			&& colValue[0].search(new RegExp("\r|\n|"+delimiter)) !== -1){
                                        		colValue = '"'+colValue[0]+'"';
                                        	}else if(!Array.isArray(colValue) && colValue.search
                                        			&& colValue.search(new RegExp("\r|\n|"+delimiter)) !== -1){
                                        		colValue = '"'+colValue+'"';
                                        	} else if(!Array.isArray(colValue) || (Array.isArray(colValue) && colValue.length === 1)){
                                        		colValue = '"'+colValue+'"';
                                        	}                                          	
                                        }
										
										
                                        lineValue = lineValue + ((colValue !== null) && (colValue) ? colValue : "") + delimiter;
                                    } else if (result.line.group) {

                                        var v = $parse("group." + column.id)(result.data);
                                        //if error in group function
                                        if (angular.isDefined(v) && angular.isString(v) && v.charAt(0) === "#") {
                                            colValue = v;
                                        } else if (angular.isDefined(v)) {
                                            //not filtered properties because used during the compute
                                            colValue = $parse("group." + column.id + that.getFormatter(column))(result.data);
                                        } else {
                                            colValue = undefined;
                                        }
										if(colValue === null)colValue = undefined;
                                        if (colValue !== undefined && column.type === "number") {
                                            colValue = colValue.replace(/\u00a0/g, "");
                                        }
                                        lineValue = lineValue + ((colValue !== null) && (colValue) ? colValue : "") + delimiter;
                                    } else if (!result.line.group && column.url !== undefined && column.url !== null && exportType !== 'groupsOnly') {
                                        var url = $parse(column.url)(result.data);
                                        colValue = $parse(column.property + that.getFilter(column) + that.getFormatter(column))(that.urlCache[url]);
										if(colValue === null)colValue = undefined;
                                        if (colValue !== undefined && column.type === "number") {
                                            colValue = colValue.replace(/\u00a0/g, "");
                                        }
                                        lineValue = lineValue + ((colValue !== null) && (colValue) ? colValue : "") + delimiter;
                                    }
                                }
                            }, this);
                            if ((exportType === 'all') || ((exportType === 'groupsOnly') && result.line.group)) {
                                lineValue = lineValue.substr(0, lineValue.length - 1) + "\n";
                            }
                        }, this);
                        displayResultTmp = undefined;

                        //fix for the accents in Excel : add BOM (byte-order-mark)
                        var fixedstring = "\ufeff" + lineValue;

                        //save
                        var blob = new Blob([fixedstring], {
                            type: "text/plain;charset=utf-8"
                        });
                        var currdatetime = $filter('date')(new Date(), 'yyyyMMdd_HHmmss');
                        var text_filename = (this.config.name || this.configDefault.name) + "_" + currdatetime;
                        saveAs(blob, text_filename + ".csv");
                    } else {
                        alert("No data to print. Select the data you need");
                    }
                    this.config.exportCSV.start = false;
                }
            },

            /**
             * Sub-function use by (not only) exportCSV()
             */
            getFormatter: function(col) {
                var format = "";
                if (col && col.type)
                    if (col.type === "date") {
                        format += " | date:'" + (col.format ? col.format : this.messages.Messages("date.format")) + "'";
                    } else if (col.type === "datetime") {
                    format += " | date:'" + (col.format ? col.format : this.messages.Messages("datetime.format")) + "'";
                } else if (col.type === "number") {
                    format += " | number" + (col.format ? ':' + col.format : '');
                }
                return format;
            },

            getFilter: function(col) {
                var filter = '';
                if (col.convertValue !== undefined && col.convertValue !== null && col.convertValue.active === true && col.convertValue.saveMeasureValue != col.convertValue.displayMeasureValue) {
                    filter += '|udtConvert:' + JSON.stringify(col.convertValue);

                }
                if (col.filter) {
                    return filter + '|' + col.filter;
                }
                return filter;
            },

            /**
             * Function to enable/disable the "CSV Export" button
             */
            canExportCSV: function() {
                if (this.config.exportCSV.active && !this.config.exportCSV.start && !this.isEmpty()) {
                    if (this.config.edit.active && this.config.edit.start) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            },
            onDrop: function(e, draggedCol, droppedCol, datatable, alReadyInTheModel) {
                var posDrop = droppedCol.position;
                var posDrag = draggedCol.position;
                for (var i = 0; i < datatable.config.columns.length; i++) {
                    if (posDrag < posDrop && datatable.config.columns[i].position > posDrag && datatable.config.columns[i].position < posDrop && datatable.config.columns[i].id !== draggedCol.id) {
                        datatable.config.columns[i].position--;
                    }

                    if (posDrag > posDrop && datatable.config.columns[i].position > posDrop && datatable.config.columns[i].position < posDrag && datatable.config.columns[i].id !== draggedCol.id) {
                        datatable.config.columns[i].position++;
                    }

                    if (datatable.config.columns[i].id === draggedCol.id) {
                        datatable.config.columns[i].position = posDrop - 1;
                    }
                }
                datatable.setColumnsConfig(datatable.config.columns);
            }

        };

        if (arguments.length === 2) {
            iConfig = arguments[1];
            console.log("used bad constructor for datatable, only one argument is required the config");
        }

        datatable.setConfig(iConfig);

        return datatable;
    };
    return constructor;
}]);
