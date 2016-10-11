/*! ultimate-datatable version 3.3.0 2016-10-11 
 Ultimate DataTable is distributed open-source under CeCILL FREE SOFTWARE LICENSE. Check out http://www.cecill.info/ for more information about the contents of this license.
*/
"use strict";

angular.module('ultimateDataTableServices', []).
factory('datatable', ['$http', '$filter', '$parse', '$window', '$q', 'udtI18n', '$timeout', function($http, $filter, $parse, $window, $q, udtI18n, $timeout) { //service to manage datatable
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
                    numberRecordsPerPageList: undefined
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
                    newData: []
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
            messages: udtI18n(navigator.language || navigator.userLanguage), //i18n intern service instance
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
             * External search réinit pageNumber to 0
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
                        }).success(function(data, status, headers, config) {
                            config.datatable._setData(data.data, data.recordsNumber);
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
                        "selected": true,
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
                }
            },
            /**
             * compute the group
             */
            computeGroup: function() {
                if (this.config.group.active && this.config.group.by) {
                    var propertyGroupGetter = this.config.group.by.property;
                    var groupGetter = $parse(propertyGroupGetter);
                    var groupValues = this.allResult.reduce(function(array, value) {
                        var groupValue = groupGetter(value);
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
                var groupGetter = $parse(this.config.group.by.property);
                var groupConfig = this.config.group;
                displayResultTmp.forEach(function(element, index, array) {
                    /* previous mode */
                    if (!groupConfig.after && (index === 0 || groupGetter(element.data) !== groupGetter(array[index - 1].data))) {
                        var line = {
                            edit: undefined,
                            selected: undefined,
                            trClass: undefined,
                            group: true,
                            "new": false
                        };
                        this.push({
                            data: groupConfig.data[groupGetter(element.data)],
                            line: line
                        });
                    }
                    this.push(element);

                    /* after mode */
                    if (groupConfig.after && (index === (array.length - 1) || groupGetter(element.data) !== groupGetter(array[index + 1].data))) {
                        var line = {
                            "edit": undefined,
                            "selected": undefined,
                            "trClass": undefined,
                            "group": true,
                            "new": false
                        };
                        this.push({
                            data: groupConfig.data[groupGetter(element.data)],
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
                        angular.forEach(_displayResult, function(value, key) {
                            var line = {
                                "edit": (that.config.edit.start)?true:undefined,
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
                        isEdit = (this.config.edit.columnMode && this.config.edit.start);
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
                if (this.config.edit.active) {
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
                if (this.config.save.active) {
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
                        success(function(data, status, headers, config) {
                            config.datatable.saveRemoteOneElement(status, data, config.index);
                        }).
                        error(function(data, status, headers, config) {
                            config.datatable.saveRemoteOneElement(status, data, config.index);
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
                        .success(function(data, status, headers, config) {
                            config.datatable.config.remove.ids.success.push(config.index);
                            config.datatable.config.remove.number--;
                            config.datatable.removeFinish();
                        })
                        .error(function(data, status, headers, config) {
                            config.datatable.config.remove.ids.errors.push(config.value);
                            config.datatable.config.remove.error++;
                            config.datatable.config.remove.number--;
                            config.datatable.removeFinish();
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
                if (this.config.select.active) {
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

            isShowToolbarButtons: function() {
                return (this.isShowCRUDButtons() || this.isShowHideButtons() || (this.config.show.active && this.config.show.showButton) || this.isShowExportCSVButton() || this.isShowOtherButtons());
            },
            isShowCRUDButtons: function() {
                return ((this.config.edit.active && this.config.edit.showButton) || (this.config.save.active && this.config.save.showButton) || (this.config.remove.active && this.config.remove.showButton));
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
                }).success(function(data, status, headers, config) {
                    config.datatable.setColumnsConfig(data);
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
;angular.module('ultimateDataTableServices').
//If the select or multiple choices contain 1 element, this directive select it automaticaly
//EXAMPLE: <select ng-model="x" ng-option="x as x for x in x" udtAutoselect>...</select>
directive('udtAutoselect',['$parse', function($parse) {
    		var OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w\d]*)|(?:\(\s*([\$\w][\$\w\d]*)\s*,\s*([\$\w][\$\w\d]*)\s*\)))\s+in\s+(.*)$/;
    		return {
    			require: 'ngModel',
    			link: function(scope, element, attrs, ngModel) {
    				var valOption = undefined;
					if(attrs.ngOptions){	
						valOption = attrs.ngOptions;
					}else if(attrs.btOptions){
						valOption = attrs.btOptions;
					}
					
					if(valOption !== undefined){
						var match = valOption.match(OPTIONS_REGEXP);
						var model = $parse(match[7]);
						scope.$watch(model, function(value){
							if(value){
				                if(value.length === 1 && (ngModel.$modelValue === undefined || ngModel.$modelValue === "")){
									ngModel.$setViewValue(value[0].code);
									ngModel.$render();
								}
							}
				        });
					}else{
						console.log("ng-options or bt-options required");
					}
    			}
    		};
    	}]);;angular.module('ultimateDataTableServices').
directive('udtBtselect',  ['$parse', '$document', '$window', '$filter', function($parse,$document, $window, $filter)  {
			//0000111110000000000022220000000000000000000000333300000000000000444444444444444000000000555555555555555000000066666666666666600000000000000007777000000000000000000088888
    		var BT_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*))\s+in\s+([\s\S]+?)$/;                        
    		// jshint maxlen: 100
  		    return {
  		    	restrict: 'A',
  		    	replace:false,
  		    	scope:true,
  		    	template:'<div ng-switch on="isEdit()">'
  		    			+'<div ng-switch-when="false">'
  		    			+'<ul class="list-unstyled">'
		    	  		+'<li ng-repeat-start="item in getItems()" ng-if="groupBy(item, $index)" ng-bind="itemGroupByLabel(item)" style="font-weight:bold"></li>'
		    	  		+'<li ng-repeat-end  ng-if="item.selected" ng-bind="itemLabel(item)" style="padding-left: 15px;"></li>'
			    	  	+'</ul>'
  		    			+'</div>'
  		    			+'<div class="dropdown" ng-switch-when="true">'
  				        
  		    			+'<div class="input-group">'
  		    			+'<input type="text" style="background:white" ng-class="inputClass" ng-model="selectedLabels" placeholder="{{placeholder}}" title="{{placeholder}}" readonly/>'
  		    			+'<div class="input-group-btn">'
  		    			+'<button tabindex="-1" data-toggle="dropdown" class="btn btn-default btn-sm dropdown-toggle" type="button" ng-disabled="isDisabled()" ng-click="open()">'
  		    			+'<span class="caret"></span>'
  		    			+'</button>'
  				        +'<ul class="dropdown-menu dropdown-menu-right"  role="menu">'
  				        +'<li ng-if="filter"><input ng-class="inputClass" type="text" ng-click="inputClick($event)" ng-model="filterValue" ng-change="setFilterValue(filterValue)"/></li>'
  				        +'<li ng-repeat-start="item in getItems()" ng-if="groupBy(item, $index)" class="divider"></li>'
  				        +'<li class="dropdown-header" ng-if="groupBy(item, $index)" ng-bind="itemGroupByLabel(item)"></li>'
		    	  		+'<li ng-repeat-end ng-click="selectItem(item, $event)">'
			    	  	+'<a href="#">'
		    	  		+'<i class="fa fa-check pull-right" ng-show="item.selected"></i>'
		    	  		+'<span class="text" ng-bind="itemLabel(item)" style="margin-right:30px;"></span>'		    	  		
		    	  		+'</a></li>'
		    	  		+'</ul>'
		    	  		
		    	  		+'</div>'
		    	  		+'</div>'
		    	  		+'</div>'
		    	  		+'</div>'
		    	  		,
	    	  		require: ['?ngModel'],
	       		    link: function(scope, element, attr, ctrls) {
					  //if ngModel is not defined, we don't need to do anything
	      		      if (!ctrls[0]) return;
	      		      scope.inputClass = element.attr("class");
	      		      scope.placeholder = attr.placeholder;
    		          
	      		      element.attr("class",''); //remove custom class
	      		     
	      		      var ngModelCtrl = ctrls[0],
	      		          multiple = attr.multiple || false,
	      		          btOptions = attr.btOptions,
	      		          editMode = (attr.ngEdit)?$parse(attr.ngEdit):undefined,
	      		          filter = attr.filter || false;

	      		      var optionsConfig = parseBtsOptions(btOptions);
	      		      var items = [];
	      		      var groupByLabels = {};
	      		      var filterValue;
	      		      var ngFocus = attr.ngFocus;
	      		      function parseBtsOptions(input){
	      		    	  var match = input.match(BT_OPTIONS_REGEXP);
		      		      if (!match) {
		      		        throw new Error(
		      		          "Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_'" +
		      		            " but got '" + input + "'.");
		      		      }
	
		      		    return {
		      		        itemName:match[4],
		      		        sourceKey:match[5],
		      		        source:$parse(match[5]),
		      		        viewMapper:match[2] || match[1],
		      		        modelMapper:match[1],
		      		        groupBy:match[3],
		      		        groupByGetter:match[3]?$parse(match[3].replace(match[4]+'.','')):undefined
		      		      };
		      		      
	      		      };
	      		   
	      		     scope.filter = filter; 
	      		     scope.setFilterValue = function(value){
	      		    	filterValue = value
	      		     };
	      		     
	      		     scope.open = function(){
	      		    	 if(ngFocus){
	      		    		$parse(ngFocus)(scope);  
	      		    	 }
	      		     };
	      		     
	      		     scope.isDisabled = function(){
	      		    	return (attr.ngDisabled)?scope.$parent.$eval(attr.ngDisabled):false;
	      		     };
	      		     
	      		     scope.isEdit = function(){
	      		    	 return (editMode)?editMode(scope):true;
	      		     };
	      		      
	      		     scope.getItems = function(){
	      		    	 if(scope.isEdit() && scope.filter){
	      		    		var filter = {};
	      		    		var getter = $parse(optionsConfig.viewMapper.replace(optionsConfig.itemName+'.',''));
	      		    		getter.assign(filter, filterValue);
	      		    		return $filter('limitTo')($filter('filter')(items, filter), 20);
	      		    	 }else{
	      		    		return items;
	      		    	 }
	      		     };
	      		    
	      		    scope.groupBy = function(item, index){
	      		    	if(index === 0){ //when several call
	      		    		groupByLabels = {};
	      		    	}
	      		    	
	      		    	if(optionsConfig.groupByGetter && scope.isEdit()){
	      		    		if(index === 0 || (index > 0 && optionsConfig.groupByGetter(items[index-1]) !== optionsConfig.groupByGetter(item))){
	      		    			return true;
	      		    		}	      		    		
	      		    	}else if(optionsConfig.groupByGetter && !scope.isEdit()){
	      		    		if(item.selected && !groupByLabels[optionsConfig.groupByGetter(item)]){
	      		    			groupByLabels[optionsConfig.groupByGetter(item)] = true;
	      		    			return true;
	      		    		}	      		    		
	      		    	}
	      		    	return false;	      		    	
	      		    }; 
	      		  
      		      scope.itemGroupByLabel = function(item){
      		    	 return optionsConfig.groupByGetter(item);
      		      }
      		      
      		      scope.itemLabel = function(item){	      		    	
      		    	return $parse(optionsConfig.viewMapper.replace(optionsConfig.itemName+'.',''))(item);
      		      };
      		      
      		      scope.itemValue = function(item){
      		    	 return $parse(optionsConfig.modelMapper.replace(optionsConfig.itemName+'.',''))(item);
      		      };
      		      
      		      scope.selectItem = function(item, $event){
      		    	  if(multiple){
      		    			var selectedValues = ngModelCtrl.$viewValue || [];
      		    		    var newSelectedValues = [];
      		    			var itemValue = scope.itemValue(item);
      		    			var find = false;
      		    			for(var i = 0; i < selectedValues.length; i ++){
      		    				if(selectedValues[i] !== itemValue){
      		    					newSelectedValues.push(selectedValues[i]);
      		    				}else{
      		    					find = true;
      		    				}
      		    			}
      		    			if(!find){
      		    				newSelectedValues.push(itemValue);
      		    			}
      		    			selectedValues = newSelectedValues;
      		    			
      		    			ngModelCtrl.$setViewValue(selectedValues);
      		    			ngModelCtrl.$render();
      		    			$event.preventDefault();
      		    			$event.stopPropagation();
      		    	  	}else{
      		    	  		if(scope.itemValue(item) !== ngModelCtrl.$viewValue){
      		    	  			ngModelCtrl.$setViewValue(scope.itemValue(item));
      		    	  		}else{
      		    	  			ngModelCtrl.$setViewValue(null);
      		    	  		}
      		    	  		ngModelCtrl.$render();
      		    	  		
      		    	  	}
      		      };
      		      scope.inputClick = function($event){
      		    	$event.preventDefault();
	    			$event.stopPropagation();
      		      };
	      		      
      		      
      		      scope.$watch(optionsConfig.sourceKey, function(newValue, oldValue){
      		    	  if(newValue && newValue.length > 0){
      		    		items = angular.copy(newValue);  
      		    		render();      		    		
      		    	  }
      		      });
	      		      
	      		   ngModelCtrl.$render = render;
	      		   
	      		    function render() {
	      		    	var selectedLabels = [];
	      		    		      		    	
		      	    	var modelValues = ngModelCtrl.$modelValue || [];
		      	    	if(!angular.isArray(modelValues)){
		      	    		modelValues = [modelValues];
		      	    	}		      	    	
		      	    	if(items.length > 0){
			      	    	for(var i = 0; i < items.length; i++){
			      	    		var item = items[i];
			      	    		item.selected = false;
			      	    		for(var j = 0; j < modelValues.length; j++){
			      	    			var modelValue = modelValues[j];
			      	    			if(scope.itemValue(item) === modelValue){
			      	    				item.selected = true;
				      		    		selectedLabels.push(scope.itemLabel(item));
				      	    		}
			      	    		}	      	    		
			      	    	}
		      	    	}
		      	    	scope.selectedLabels = selectedLabels;
	      	        };
	      	        
	      		  }
	      		  
  		    };
    	}]);;angular.module('ultimateDataTableServices').
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
						if(col.editTemplate){
							editElement = col.editTemplate.replace("#ng-model", 'ng-model="'+this.getEditProperty(col, header, filter)+ngChange);														
						}else if(col.type === "boolean"){
	    					editElement = '<input class="form-control"' +defaultValueDirective+'type="checkbox" class="input-small" ng-model="'+this.getEditProperty(col, header, filter)+ngChange+'/>';	    					
	    				}else if (col.type === "textarea") {
                            editElement = '<textarea class="form-control"' + defaultValueDirective + userDirectives + 'ng-model="' + this.getEditProperty(col, header, filter) + ngChange + '></textarea>';
                        }else if(col.type === "img"){
	    					
	    					var value=this.getEditProperty(col, header, filter);
	    					editElement=
                            '<input ng-if="'+this.getEditProperty(col, header, filter)+' === undefined" type="file" base64-img="'+this.getEditProperty(col, header, filter)+'" />'
    						+'<div  ng-click="setImage('+this.getEditProperty(col, header, filter)+'.value,'
                        	+this.getEditProperty(col, header, filter)+'.fullname,'
                        	+this.getEditProperty(col, header, filter)+'.width,'
                        	+this.getEditProperty(col, header, filter)+'.height)" '
                        	+'  class="thumbnail" ng-if="'+this.getEditProperty(col, header, filter)+' !== undefined" >'
                            +'  <div data-target="#modalImage" role="button" data-toggle="modal" >'
                            +'     <a href="#">'
                            +'    <img  ng-src="data:image/{{'+this.getEditProperty(col, header, filter)+'.extension}};base64,{{'+this.getEditProperty(col, header, filter)+'.value}}" width="{{'+this.getEditProperty(col, header, filter)+'.width*0.1}}" height="{{'+this.getEditProperty(col, header, filter)+'.height*0.1}}" />'
                            +'     </a>'
                            +' </div>'
                            +' </div>'
                            +' <button  class="btn btn-default btn-xs"  ng-show="'+this.getEditProperty(col, header, filter)+' !== undefined"'
                            +' ng-click="'+this.getEditProperty(col, header, filter)+' = undefined" ><i class="fa fa-trash-o"></i>'
                            +'</button> ';

	    					if(header){
	    						editElement = '';
	    					}
	    				}
	    				else if(col.type === "file"){
	    					editElement=
	    						'<input ng-if="'+this.getEditProperty(col, header, filter)+' === undefined" type="file" base64-file="'+this.getEditProperty(col, header, filter)+'" />'
	    						+'<div ng-if="'+this.getEditProperty(col, header, filter)+' !== undefined" >'
                                +'<a target="_blank" ng-href="data:application/{{'+this.getEditProperty(col, header, filter)+'.extension}};base64,{{'+this.getEditProperty(col, header, filter)+'.value}}">'
                                +'{{'+this.getEditProperty(col, header, filter)+'.fullname}}'
                                +'</a>'
                                +' </div>'
                                +' <button  class="btn btn-default btn-xs"  ng-show="'+this.getEditProperty(col, header, filter)+' !== undefined"'
                                +' ng-click="'+this.getEditProperty(col, header, filter)+' = undefined" ><i class="fa fa-trash-o"></i>'
                                +'</button> ';
	    					if(header){
	    						editElement = '';
	    					}
	    					
	    				}else if(!col.choiceInList){
							//TODO: type='text' because html5 autoformat return a string before that we can format the number ourself
	    					editElement = '<input class="form-control" '+defaultValueDirective+' '+this.getConvertDirective(col, header)+' udt-html-filter="{{col.type}}" type="text" class="input-small" ng-model="'+this.getEditProperty(col,header,filter)+ngChange+userDirectives+this.getDateTimestamp(col.type)+'/>';
	    				}else if(col.choiceInList){
	    					switch (col.listStyle) {
	    						case "radio":
	    							editElement = '<label class="radio-inline" ng-repeat="opt in '+this.getOptions(col)+' track by $index" '+userDirectives+'>'
	    										   +'<input udt-html-filter="{{col.type}}" type="radio" ng-model="'+this.getEditProperty(col,header,filter)+ngChange+' ng-value="{{opt.code}}"> {{opt.name}}'
	    										   +'</label>';
									break;
	    						case "multiselect":
	    							editElement = '<select class="form-control" multiple="true" '+defaultValueDirective+' ng-options="opt.code '+this.getFormatter(col)+' as opt.name '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+userDirectives+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+'></select>';
		    						break;
	    						case "bt-select":
	    							editElement = '<div udt-html-filter="{{col.type}}" class="form-control" udt-btselect '+defaultValueDirective+' placeholder="" bt-dropdown-class="dropdown-menu-right" bt-options="opt.code as opt.name  '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+userDirectives+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+'></div>';
	    							break;
								case "bt-select-filter":
	    							editElement = '<div udt-html-filter="{{col.type}}" class="form-control" filter="true" udt-btselect '+defaultValueDirective+' placeholder="" bt-dropdown-class="dropdown-menu-right" bt-options="opt.code as opt.name  '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+userDirectives+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+'></div>';
	    							break;
	    						case "bt-select-multiple":
	    							editElement = '<div class="form-control" '+defaultValueDirective+' udt-btselect multiple="true" bt-dropdown-class="dropdown-menu-right" placeholder="" bt-options="opt.code as opt.name  '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+userDirectives+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+'></div>';
	    							break;
	    						default:
	    							editElement = '<select udt-html-filter="{{col.type}}" class="form-control" '+defaultValueDirective+' ng-options="opt.code '+this.getFormatter(col)+' as opt.name '+this.getGroupBy(col)+' for opt in '+this.getOptions(col)+'" '+userDirectives+' ng-model="'+this.getEditProperty(col,header,filter)+ngChange+'>'
	    										  + '<option></option>'
	    										  + '</select>';
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
	    						return '<div  ng-click="setImage(cellValue.value,cellValue.fullname,cellValue.width,cellValue.height)"  class="thumbnail" ng-if="cellValue !== undefined" > <div data-target="#modalImage" role="button" data-toggle="modal" ><a href="#"><img ng-src="data:image/{{cellValue.extension}};base64,{{cellValue.value}}" width="{{cellValue.width*0.1}}" height="{{cellValue.height*0.1}}"/></a></div></div>';		    					    
	    					}else if(col.type==="file"){
	    						return  '<a target="_blank" ng-href="data:application/{{cellValue.extension}};base64,{{cellValue.value}}">'
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
    	});;angular.module('ultimateDataTableServices').
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
}]);;angular.module('ultimateDataTableServices').
directive('udtCompile', ['$compile', function($compile) {
			// directive factory creates a link function
			return {
				restrict: 'A',
  		    	link: function(scope, element, attrs) {
  				    scope.$watch(
  				        function(scope) {
  				             // watch the 'compile' expression for changes
  				            return scope.$eval(attrs.udtCompile);
  				        },
  				        function(value) {
  				            // when the 'compile' expression changes
  				            // assign it into the current DOM
  				            element.html(value);

  				            // compile the new DOM and link it to the current
  				            // scope.
  				            // NOTE: we only compile .childNodes so that
  				            // we don't get into infinite loop compiling ourselves
  				            $compile(element.contents())(scope);
  				        }
  				    );
  				}
			};
						
		}]);;angular.module('ultimateDataTableServices').
//This directive convert the ngModel value to a view value and then the view value to the ngModel unit value
//The value passed to the directive must be an object with displayMeasureValue and saveMeasureValue
directive('udtConvertvalue',['udtConvertValueServices','$filter', function(udtConvertValueServices, $filter) {
	return {
                require: 'ngModel',
                link: function(scope, element, attr, ngModel) {
                	//init service
                	var convertValues = udtConvertValueServices();
                	var property = undefined;
                	
					var watchModelValue = function(){
						return scope.$watch(
									function(){
										return ngModel.$modelValue;
									}, function(newValue, oldValue){
										if(property != undefined){
											var convertedValue = convertValues.convertValue(newValue, property.saveMeasureValue, property.displayMeasureValue);
											ngModel.$setViewValue($filter('number')(convertedValue));
											ngModel.$render();
										}
								});
					};
					
                	scope.$watch(attr.udtConvertvalue, function(value){
    					if(value.saveMeasureValue != undefined && value.displayMeasureValue != undefined){
    						property = value;
    					}
    				});
                	
                	//model to view when the user go out of the input
                	element.bind('blur', function () {
                		var convertedValue = convertValues.convertValue(ngModel.$modelValue, property.saveMeasureValue, property.displayMeasureValue);
                		ngModel.$setViewValue($filter('number')(convertedValue));
						ngModel.$render();
						//We restart the watcher when the user is out of the inputs
						scope.currentWatcher = watchModelValue();
                	});
                	
					//when the user go into the input
					element.bind('focus', function () {
						//We need to disable the watcher when the user is typing
						scope.currentWatcher();
                	});
					
                	//model to view whatcher
                	scope.currentWatcher = watchModelValue();
                	
                    //view to model
                    ngModel.$parsers.push(function(value) {
                    	value = convertValues.parse(value);
                    	if(property != undefined){
	                    	value = convertValues.convertValue(value, property.displayMeasureValue, property.saveMeasureValue);
                    	}
                    	return value;
                    });
                }
            };
}]);;angular.module('ultimateDataTableServices').
 //Convert the date in format(view) to a timestamp date(model)
directive('udtDateTimestamp', function() {
	            return {
	                require: 'ngModel',
	                link: function(scope, ele, attr, ngModel) {
						var typedDate = "01/01/1970";//Initialisation of the date
						
	                	var convertToDate = function(date){
	                		if(date !== null && date !== undefined && date !== ""){
		                		var format = scope.udtTableFunctions.messages.Messages("date.format").toUpperCase();
		                		date = moment(date).format(format);
		                		return date;
	                		}
	                		return "";
	                	};
	                	
	                	var convertToTimestamp = function(date){
	                		if(date !== null && date !== undefined && date !== ""){
		                		var format = scope.udtTableFunctions.messages.Messages("date.format").toUpperCase();
		    					return moment(date, format).valueOf();
	                		}
	                		return "";
	    				};
						
	                	//model to view
	                	scope.$watch(
							function(){
								return ngModel.$modelValue;
							}, function(newValue, oldValue){
								//We check if the
								if(newValue !== null && newValue !== undefined && newValue !== "" && typedDate.length === 10){
									var date = convertToDate(newValue);
	    							ngModel.$setViewValue(date);
									ngModel.$render();
								}
	                    });
						
	                	//view to model
	                    ngModel.$parsers.push(function(value) {
	                    	var date = value;
							typedDate = date;//The date of the user
	                    	if(value.length === 10){//When the date is complete
	                    		date = convertToTimestamp(value);
	                    	}
							return date;
	                    });
	                }
	            }
	        });;angular.module('ultimateDataTableServices').
//Write in an input or select in a list element the value passed to the directive when the list or the input ngModel is undefined or empty
//EXAMPLE: <input type="text" default-value="test" ng-model="x">
directive('udtDefaultValue',['$parse', function($parse) {
	    		return {
	    			require: 'ngModel',
	    			link: function(scope, element, attrs, ngModel) {
	    				var _col = null;
	    				scope.$watch(attrs.udtDefaultValue, function(col){
	    					if(col !== null && col !== undefined && col.defaultValues !== undefined && col.defaultValues !== null ){
	    						_col = col;
	    					}
	    				});
	    				//TODO GA ?? better way with formatter
						scope.$watch(ngModel, function(value){
				                if(_col != null && (ngModel.$modelValue === undefined || ngModel.$modelValue === "")){
									if(_col.type === "boolean"){
										if(_col.defaultValues === "true" || _col.defaultValues === true){
											ngModel.$setViewValue(true);
											ngModel.$render();
										}else if(_col.defaultValues === "false" || _col.defaultValues === false){
											ngModel.$setViewValue(false);
											ngModel.$render();
										}											
									}else{
										ngModel.$setViewValue(_col.defaultValues);
										ngModel.$render();
									}
				                	
								}
					    });
	    			}
	    		};	    	
	    	}]);;angular.module('ultimateDataTableServices').
directive('udtForm', function(){
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	transclude:true,
  		    	templateUrl:'udt-form.html',
  		    	link: function(scope, element, attr) {
  		    	}
    		};
    	});;angular.module('ultimateDataTableServices').directive('udtHighlight', function() {
	var component = function(scope, element, attrs) {
		
		if (!attrs.highlightClass) {
			attrs.highlightClass = 'udt-highlight';
		}
		
		if (!attrs.active) {
			scope.active = true;
		}
		
		var replacer = function(match, item) {
			return '<span class="'+attrs.highlightClass+'">'+match+'</span>';
		}
		
		var tokenize = function(keywords) {
			keywords = keywords.replace(new RegExp(',$','g'), '').split(',');
			var i;
			var l = keywords.length;
			for (i=0;i<l;i++) {
				keywords[i] = keywords[i].replace(new RegExp('^ | $','g'), '');
			}
			return keywords;
		}
		
		scope.$watch('keywords', function(newValue, oldValue) {
			if (!newValue || newValue === '' || !scope.active) {
				if(scope.udtHighlight !== undefined && scope.udtHighlight !== null)
					element.html(scope.udtHighlight.replace(/\n/g, '<br />').toString());
				return false;
			}
			
			
			var tokenized = tokenize(newValue);
			var regex = new RegExp(tokenized.join('|'), 'gmi');
			
			// Find the words
			var html = scope.udtHighlight.replace(/\n/g, '<br />').toString().replace(regex, replacer);
			
			element.html(html);
		}, true);
	}
	return {
		link: 			component,
		replace:		false,
		scope:			{
			active:		'=',
			udtHighlight:	'=',
			keywords:	'='
		}
	};
});;angular.module('ultimateDataTableServices').
directive("udtHtmlFilter", function($filter) {
				return {
					  require: 'ngModel',
					  link: function(scope, element, attrs, ngModelController) {
					    ngModelController.$formatters.push(function(data) {
					    	var convertedData = data;
					    	  if(attrs.udtHtmlFilter === "datetime"){
					    			convertedData = $filter('date')(convertedData, scope.udtTableFunctions.messages.Messages("datetime.format"));
					    	   }else if(attrs.udtHtmlFilter === "date"){
					    		   	convertedData = $filter('date')(convertedData, scope.udtTableFunctions.messages.Messages("date.format"));
					    	   }else if(attrs.udtHtmlFilter === "number"){
					    		   	convertedData = $filter('number')(convertedData);
					    	   }					    	
					    	  return convertedData;
					    }); 

						ngModelController.$parsers.push(function(data) {
					    	var convertedData = data;
					    	   if(attrs.udtHtmlFilter === "number" && null !== convertedData && undefined !== convertedData 
					    			   && angular.isString(convertedData)){
					    		   convertedData = convertedData.replace(",",".");
					    		   if(!isNaN(convertedData) && convertedData !== ""){						    			   
					    			   convertedData = convertedData*1;
					    		   }else if( isNaN(convertedData) || convertedData === ""){
					    			   convertedData = undefined;
					    		   }
					    	   }					
					    	   //TODO GA date and datetime quiz about timestamps
					    	  return convertedData;
					    }); 
					  }
					};
			});;angular.module('ultimateDataTableServices').
directive('udtMessages', function(){
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	templateUrl:'udt-messages.html',
  		    	link: function(scope, element, attr) {
  		    	}
    		};
});;angular.module('ultimateDataTableServices').
directive('udtTable', function(){
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	templateUrl:'udt-table.html',
  		    	link: function(scope, element, attr) {
  		    		if(!scope.udtTableFunctions){scope.udtTableFunctions = {};}
  		    		
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
	    					//we try to evaluation the string against the scope
	    					return currentScope.$eval(col.tdClass) || col.tdClass;
	    				}else{
	    					return '';
	    				}
	    			};
					scope.udtTableFunctions.getThClass = function(col, currentScope){
	    				if(angular.isFunction(col.thClass)){
	    					return col.thClass(col);
	    				} else if(angular.isString(col.thClass)){
	    					//we try to evaluation the string against the scope
	    					return currentScope.$eval(col.thClass) || col.thClass;
	    				}else{
	    					return '';
	    				}
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
    	});;angular.module('ultimateDataTableServices').
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
;angular.module('ultimateDataTableServices').
directive('udtToolbar', function(){ 
    		return {
    			restrict: 'A',
  		    	replace:true,
  		    	templateUrl:'udt-toolbar.html'		    		
  		    		,
  		    	link: function(scope, element, attr) {
  		    	}
    		};
    	});;"use strict";

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
			    			return scope.udtTable.config.messages.transformKey(message);
						}else{
							return scope.udtTable.config.messages.transformKey(message, arg);
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
		    				return (scope.udtTable.allGroupResult)?scope.udtTable.allGroupResult.length:0;
		    			}else{
		    				return scope.udtTable.totalNumberRecords;
		    			}
		    			
		    			
		    		};
       		    } 		    		
    		};
}]);;angular.module('ultimateDataTableServices').
filter('udtCollect', ['$parse',function($parse) {
    	    return function(array, key) {
    	    	if (!array || array.length === 0)return undefined;
    	    	if (!angular.isArray(array) && (angular.isObject(array) || angular.isNumber(array) || angular.isString(array) || angular.isDate(array))) array = [array];
    	    	else if(!angular.isArray(array)) throw "input is not an array, object, number or string !";
    	    	
    	    	if(key && !angular.isString(key))throw "key is not valid, only string is authorized";
    	    	
    	    	var possibleValues = [];
    	    	angular.forEach(array, function(element){
    	    		if (angular.isObject(element)) {
    	    			var currentValue = $parse(key)(element);
    	    			if(undefined !== currentValue && null !== currentValue){
    	    				//Array.prototype.push.apply take only arrays
    	    				if(angular.isArray(currentValue)){
    	    					Array.prototype.push.apply(possibleValues, currentValue);
    	    				}else{
    	    					possibleValues.push(currentValue);
    	    				}
    	    			}
    	    			
    	    			
    	    		}else if (!params.key && angular.isObject(value)){
    	    			throw "missing key !";
    	    		}
    	    		
    	    	});
    	    	return possibleValues;    	    	
    	    };
    	}]);;angular.module('ultimateDataTableServices').
filter('udtConvert', ['udtConvertValueServices', function(udtConvertValueServices){
    		return function(input, property){
				var convertValues = udtConvertValueServices();
				if(property != undefined){
					input = convertValues.convertValue(input, property.saveMeasureValue, property.displayMeasureValue);
				}
    			return input;
    		}
}]);;angular.module('ultimateDataTableServices').
filter('udtCountdistinct', ['$parse',function($parse) {
    	    return function(array, key) {
    	    	if (!array || array.length === 0)return undefined;
    	    	if (!angular.isArray(array) && (angular.isObject(array) || angular.isNumber(array) || angular.isString(array) || angular.isDate(array))) array = [array];
    	    	else if(!angular.isArray(array)) throw "input is not an array, object, number or string !";
    	    	
    	    	if(key && !angular.isString(key))throw "key is not valid, only string is authorized";
    	    	
    	    	var possibleValues = [];
    	    	angular.forEach(array, function(element){
    	    		if (angular.isObject(element)) {
    	    			var currentValue = $parse(key)(element);
    	    			if(undefined !== currentValue && null !== currentValue && possibleValues.indexOf(currentValue) === -1){
       	    				possibleValues.push(currentValue);
    	    			}
    	    			
    	    			
    	    		}else if (!params.key && angular.isObject(value)){
    	    			throw "missing key !";
    	    		}
    	    		
    	    	});
    	    	return possibleValues.length;    	    	
    	    };
}]);;angular.module('ultimateDataTableServices').
filter('udtUnique', ['$parse', function($parse) {
    		return function (collection, property) {
    			var isDefined = angular.isDefined,
    		    isUndefined = angular.isUndefined,
    		    isFunction = angular.isFunction,
    		    isString = angular.isString,
    		    isNumber = angular.isNumber,
    		    isObject = angular.isObject,
    		    isArray = angular.isArray,
    		    forEach = angular.forEach,
    		    extend = angular.extend,
    		    copy = angular.copy,
    		    equals = angular.equals;
				
				if(!isArray(collection) && !isObject(collection)){
					return collection;
				}
	
	    		/**
	    		* get an object and return array of values
	    		* @param object
	    		* @returns {Array}
	    		*/
	    		function toArray(object) {
	    		    var i = -1,
	    		        props = Object.keys(object),
	    		        result = new Array(props.length);
	
	    		    while(++i < props.length) {
	    		        result[i] = object[props[i]];
	    		    }
	    		    return result;
	    		}
    			
    		      collection = (angular.isObject(collection)) ? toArray(collection) : collection;

    		      if (isUndefined(property)) {
    		        return collection.filter(function (elm, pos, self) {
    		          return self.indexOf(elm) === pos;
    		        })
    		      }
    		      //store all unique members
    		      var uniqueItems = [],
    		          get = $parse(property);

    		      return collection.filter(function (elm) {
    		        var prop = get(elm);
    		        if(some(uniqueItems, prop)) {
    		          return false;
    		        }
    		        uniqueItems.push(prop);
    		        return true;
    		      });

    		      //checked if the unique identifier is already exist
    		      function some(array, member) {
					/*
    		        if(isUndefined(member)) {
    		          return false;
    		        }
					*/
    		        return array.some(function(el) {
    		          return equals(el, member);
    		        });
    		      }
    		    }
    	}]);;angular.module('ultimateDataTableServices').
factory('udtConvertValueServices', [function() {
    		var constructor = function($scope){
				var udtConvertValueServices = {
				    //Convert the value in inputUnit to outputUnit if the units are different
					convertValue : function(value, inputUnit, outputUnit, precision){
							if(inputUnit !== outputUnit && !isNaN(value) && null !== value){
								var convert = this.getConversion(inputUnit,outputUnit);
								if(convert != undefined && !angular.isFunction(convert)){
									value = value * convert;
									if(precision !== undefined){
										value = value.toPrecision(precision);
									}
								}else if(convert === undefined || convert === null){
									throw "Error: Unknown Conversion "+inputUnit+" to "+outputUnit;
									return undefined;
								}
							}
							
							return value;
					},
					//Get the multiplier to convert the value
					getConversion : function(inputUnit, outputUnit){
						if((inputUnit === '�g' && outputUnit === 'ng') || (inputUnit === 'ml' && outputUnit === '�l') || (inputUnit === 'pM' && outputUnit === 'nM')){
							return (1/1000);
						}else if((inputUnit === 'ng' && outputUnit === '�g') || (inputUnit === '�l' && outputUnit === 'ml') || (inputUnit === 'nM' && outputUnit === 'pM')){
							return 1000;
						}else if ((inputUnit === 'mM' && outputUnit === 'nM')){
							return 1000000;
						}else if ((inputUnit === 'nM' && outputUnit === 'mM')){
							return 1/1000000;
						}
						return undefined;
					},
					parse : function(value){
						var valueToConvert = value;
						if(!angular.isNumber(valueToConvert)){
							var valueConverted = value.replace(/\s+/g,"").replace(',','.');
							valueConverted = parseFloat(valueConverted);
							
							return valueConverted;
						}
						
						return value;
					}
				};
				return udtConvertValueServices;
			};
    		return constructor;
}]);;angular.module('ultimateDataTableServices').
/* A I18n service, that manage internal translation in udtI18n
* follow the http://tools.ietf.org/html/rfc4646#section-2.2.4 spec
* preferedLanguageVar can be a string or an array of string
* https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage
*/
factory('udtI18n', [function() {
    	var constructor = function(preferedLanguageVar) {
				var udtI18n = {
          init: function() {
            this.preferedLanguage = 'en';
            // If preferedLanguageVar is undefined we keep the defaultLanguage
            if(!preferedLanguageVar) {
              return false;
            }

            var preferedLanguage = [];
            if(!Array.isArray(preferedLanguageVar)) {
              preferedLanguage.push(preferedLanguageVar);
            } else {
              preferedLanguage = preferedLanguageVar.slice();
            }

            preferedLanguage.some(function(language) {
              // We first try to find the entire language string
              // Primary Language Subtag with Extended Language Subtags
              if(this.translationExist(language)) {
                this.preferedLanguage = language;
                return true;
              }

              // Then we try with only Primary Language Subtag
              var splitedLanguages = language.split('-');
              if(splitedLanguages.length > 1) {
                var primaryLanguageSubtag = splitedLanguages[0];
                if(this.translationExist(primaryLanguageSubtag)) {
                  this.preferedLanguage = primaryLanguageSubtag;
                  return true;
                }
              }
            }, this);
          },
          translationExist: function(language) {
            return this.translateTable[language] !== undefined;
          },
				  translateTable : {
						"fr": {
							"result":"Résultats",
							"date.format":"dd/MM/yyyy",
							"datetime.format":"dd/MM/yyyy HH:mm:ss",
							"datatable.button.selectall":"Tout Sélectionner",
							"datatable.button.unselectall" :"Tout Délectionner",
							"datatable.button.cancel":"Annuler",
							"datatable.button.hide":"Cacher",
							"datatable.button.show":"Afficher Détails",
							"datatable.button.edit":"Editer",
							"datatable.button.sort":"Trier",
							"datatable.button.save":"Sauvegarder",
							"datatable.button.add":"Ajouter",
							"datatable.button.remove":"Supprimer",
							"datatable.button.searchLocal":"Rechercher",
							"datatable.button.resetSearchLocal":"Annuler",
							"datatable.button.length" : "Taille ({0})",
							"datatable.totalNumberRecords" : "{0} Résultat(s)",
							"datatable.button.exportCSV" : "Export CSV",
							"datatable.msg.success.save" : "Toutes les sauvegardes ont réussi.",
							"datatable.msg.error.save" : "Il y a {0} sauvegarde(s) en erreur.",
							"datatable.msg.success.remove" : "Toutes les suppressions ont réussi.",
							"datatable.msg.error.remove":" Il y a {0} suppression(s) en erreur.",
							"datatable.remove.confirm" : "Pouvez-vous confirmer la suppression ?",
							"datatable.export.sum" : "(Somme)",
							"datatable.export.average" : "(Moyenne)",
							"datatable.export.unique" :"(Valeur uniq.)",
							"datatable.export.countDistinct" :"(Nb. distinct d'occurence)",
							"datatable.export.yes" : "Oui",
							"datatable.export.no" : "Non",
							"datatable.button.group" : "Grouper / Dégrouper",
							"datatable.button.generalGroup" : "Grouper toute la sélection",
							"datatable.button.basicExportCSV" : "Exporter toutes les lignes",
							"datatable.button.groupedExportCSV" : "Exporter les lignes groupées",
							"datatable.button.showOnlyGroups" : "Voir uniquement les groupes"
						},
						"en": {
							"result":"Results",
							"date.format":"MM/dd/yyyy",
							"datetime.format":"MM/dd/yyyy HH:mm:ss",
							"datatable.button.selectall":"Select all",
							"datatable.button.unselectall" :"Deselect all",
							"datatable.button.cancel":"Cancel",
							"datatable.button.hide":"Hide",
							"datatable.button.show":"Show Details",
							"datatable.button.edit":"Edit",
							"datatable.button.sort":"Order",
							"datatable.button.save":"Save",
							"datatable.button.add":"Add",
							"datatable.button.remove":"Remove",
							"datatable.button.searchLocal":"Search",
							"datatable.button.resetSearchLocal":"Cancel",
							"datatable.button.length" : "Size ({0})",
							"datatable.totalNumberRecords" : "{0} Result(s)",
							"datatable.button.exportCSV" : "CSV Export",
							"datatable.msg.success.save" : "All backups are successful.",
							"datatable.msg.error.save" : "There are {0} backup(s) in error.",
							"datatable.msg.success.remove" : "All the deletions are successful.",
							"datatable.msg.error.remove":" There are {0} deletion(s) in error.",
							"datatable.remove.confirm" : "Can you confirm the delete ?",
							"datatable.export.sum" : "(Sum)",
							"datatable.export.average" : "(Average)",
							"datatable.export.unique" :"(Single value)",
							"datatable.export.countDistinct" :"(Num. of distinct occurrence)",
							"datatable.export.yes" : "Yes",
							"datatable.export.no" : "No",
							"datatable.button.group" : "Group / Ungroup",
							"datatable.button.generalGroup" : "Group All selected lines",
							"datatable.button.basicExportCSV" : "Export all lines",
							"datatable.button.groupedExportCSV" : "Export only grouped lines",
							"datatable.button.showOnlyGroups" : "See only group"
						},
						"nl": {
							"result": "Resultaten",
							"date.format": "dd/MM/yyyy",
							"datetime.format": "dd/MM/yyyy HH:mm:ss",
							"datatable.button.selectall": "Selecteer alles",
							"datatable.button.unselectall": "Deselecteer alles",
							"datatable.button.cancel": "Annuleren",
							"datatable.button.hide": "Verberg",
							"datatable.button.show": "Toon details",
							"datatable.button.edit": "Bewerk",
							"datatable.button.sort": "Sorteer",
							"datatable.button.save": "Opslaan",
							"datatable.button.add": "Toevoegen",
							"datatable.button.remove": "Verwijderen",
							"datatable.button.searchLocal": "Zoek",
							"datatable.button.resetSearchLocal": "Annuleer",
							"datatable.button.length": "Grote ({0})",
							"datatable.totalNumberRecords": "{0} Resultaten",
							"datatable.button.exportCSV": "CSV Export",
							"datatable.msg.success.save": "Opslag is succesvol",
							"datatable.msg.error.save": "Er zijn {0} backup(s) met een fout.",
							"datatable.msg.success.remove": "Alles is succesvol verwijderd.",
							"datatable.msg.error.remove": " Er zijn {0} verwijderingen met een fout.",
							"datatable.remove.confirm": "Bevestigd u de verwijdering?",
							"datatable.export.sum": "(Som)",
							"datatable.export.average": "(Gemiddeld)",
							"datatable.export.unique":"(Enkele waarde)",
							"datatable.export.countDistinct": "(Aantal unieke waarden)",
							"datatable.export.yes": "Ja",
							"datatable.export.no": "Nee",
							"datatable.button.group": "Groeperen / Degroeperen",
							"datatable.button.generalGroup": "Groepeer alle geselecteerde regels",
							"datatable.button.basicExportCSV": "Exporteer alle regels",
							"datatable.button.groupedExportCSV": "Exporteer alleen de gegroepeerde regels",
							"datatable.button.showOnlyGroups": "Toon alleen de groep"
						}
					},

					//Translate the key with the correct language
					Messages : function(key) {
						  var translatedString = this.translateTable[this.preferedLanguage][key];
						  if(translatedString === undefined) {
							  return key;
						  }
						  for (var i = 1; i < arguments.length; i++) {
								translatedString = translatedString.replace("{"+(i-1)+"}", arguments[i]);
						  }
						  return translatedString;
					}
				};

        udtI18n.init();
				return udtI18n;
			};
    	return constructor;
}]);
;"use strict";

angular.module('ultimateDataTableServices').
run(['$templateCache', function($templateCache) {
  $templateCache.put('ultimate-datatable.html',
    '<div name="datatable" class="datatable">'
   +    '<div ng-transclude/>'
   +    '<div udt-toolbar ng-if="udtTable.isShowToolbar()"/>'
   +    '<div udt-messages ng-if="udtTable.config.messages.active"/>'
   +    '<div udt-table/>'
   +'</div>');
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('udt-table.html',
    '<div name="udt-table" class="row">'
   +    '<div class="col-md-12 col-lg-12">'
   +        '<div class="inProgress" ng-if="udtTable.config.spinner.start">'
   +            '<button class="btn btn-primary btn-lg">'
   +                '<i class="fa fa-spinner fa-spin fa-5x"></i>'
   +            '</button>'
   +        '</div>'
   +        '<form class="form-inline">'
   +            '<table class="table table-condensed table-hover table-bordered">'
   +                '<thead>'
   +                    '<tr ng-repeat="(key,headers) in udtTable.getExtraHeaderConfig()">'
   +                        '<th colspan="{{header.colspan}}" ng-repeat="header in headers" class="xheader">'
   +                            '<span ng-bind="udtTableFunctions.messages.Messages(header.label)"/>'
   +                        '</th>'
   +                    '</tr>'
   +                    '<tr>'
   +						'<th ng-if="udtTable.isShowLineEditButton()" ng-class="udtTableFunctions.getThClass(column, this)"><!-- Edit button column --></th>'
   +						'<th id="{{column.id}}" ng-repeat="column in udtTable.getColumnsConfig()" ng-model="column" ng-if="!udtTable.isHide(column.id)" ng-class="udtTableFunctions.getThClass(column, this)">'
   +                            '<span ng-model="udtTable" ng-bind="udtTableFunctions.messages.Messages(column.header)"/>'
   +                            '<div class="btn-group pull-right">'
   +                                '<button class="btn btn-xs" ng-click="udtTableFunctions.setEdit(column)"        ng-if="udtTable.isShowButton(\'edit\', column)"  ng-disabled="!udtTable.canEdit()" data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.edit\')}}"><i class="fa fa-edit"></i></button>'
   +                                '<button class="btn btn-xs" ng-click="udtTableFunctions.setOrderColumn(column)" ng-if="udtTable.isShowButton(\'order\', column)" ng-disabled="!udtTable.canOrder()" data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.sort\')}}"><i ng-class="udtTable.getOrderColumnClass(column.id)"></i></button>'
   +                                '<button class="btn btn-xs" ng-click="udtTableFunctions.setGroupColumn(column)" ng-if="udtTable.isShowButton(\'group\', column)" ng-disabled="udtTable.isEmpty()"  data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.group\')}}"><i ng-class="udtTable.getGroupColumnClass(column.id)"></i></button>'      
   +                                '<button class="btn btn-xs" ng-click="udtTableFunctions.setHideColumn(column)"  ng-if="udtTable.isShowButton(\'hide\', column)"  data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.hide\')}}"><i class="fa fa-eye-slash"></i></button>'
   +                            '</div>'
   +                        '</th>'
   +                    '</tr>'
   +                '</thead>'
   +                '<tbody>'
   +                    '<tr ng-if="udtTable.config.filter.columnMode && !udtTable.config.edit.start" class="filter">'
   +                        '<td ng-repeat="col in udtTable.config.columns" ng-if="!udtTable.isHide(col.id)">'
   +                            '<div ng-if="col.showFilter" udt-cell-filter/>'
   +                        '</td>'
   +                    '</tr>'
   +                    '<tr ng-if="udtTable.isEdit()" class="editParent">'
   +                        '<td ng-repeat="col in udtTable.config.columns" ng-if="!udtTable.isHide(col.id)">'
   +                            '<div udt-cell-header/>'
   +                        '</td>'
   +                    '</tr>'
   +                    '<tr ng-repeat="value in udtTable.displayResult" ng-click="udtTableFunctions.select(value.data, value.line)" ng-mouseover="udtTableFunctions.mouseover(value.data, value.line)" ng-mouseleave="udtTableFunctions.mouseleave(value.data, value.line)" ng-class="udtTableFunctions.getTrClass(value.data, value.line, this)">'
   +                        '<td ng-if="udtTable.isShowLineEditButton()">'
   +                            '<button class="btn btn-default ng-scope" ng-click="udtTable.setEdit()" ng-show="!udtTable.isEdit(null, value.line)" ng-disabled="!udtTable.canEdit()" data-toggle="tooltip" title="Edit"><i class="fa fa-edit"></i></button>'
   +                            '<button class="btn btn-default ng-scope" ng-click="udtTable.save()" ng-show="udtTable.isEdit(null, value.line)" ng-disabled="!udtTable.canSave()" data-toggle="tooltip" title="Save"><i class="fa fa-save"></i></button>'
   +                        '</td>'
   +                        '<td ng-repeat="col in udtTable.config.columns" ng-if="udtTableFunctions.isShowCell(col, $parent.$index, $index)" ng-class="udtTableFunctions.getTdClass(value.data, col, this)" rowspan="{{udtTableFunctions.getRowSpanValue($parent.$parent.$index, $parent.$index)}}">'
   +                            '<div udt-cell/>'
   +                        '</td>'
   +                    '</tr>'
   +                '</tbody>'
   +            '</table>'
   +        '</form>'
   +    '</div>'
   +'</div>');
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('udt-cell.html',
    '<div>'
   +    '<div ng-if="col.edit" udt-editable-cell></div>'
   +    '<div ng-if="!col.edit" udt-cell-read></div>'
   +'</div>');
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('udt-editableCell.html',
    '<div ng-switch on="udtTable.isEdit(col.id, value.line)">'
   +    '<div ng-switch-when="true" >'
   +        '<div udt-cell-edit></div>'
   +    '</div>'
   +    '<div ng-switch-default udt-cell-read></div>'
   +'</div>');
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('udt-cellRead.html',
    '<div udt-compile="udtTableFunctions.getDisplayElement(col)"></div>');
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('udt-cellEdit.html',
    '<div udt-compile="udtTableFunctions.getEditElement(col)"></div>');
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('udt-cellFilter.html',
    '<div udt-compile="udtTableFunctions.getEditElement(col, false, true)"></div>');
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('udt-cellHeader.html',
    '<div ng-if="col.edit" ng-switch on="udtTable.isEdit(col.id)">'
   +    '<div ng-switch-when="true" udt-compile="udtTableFunctions.getEditElement(col, true)"></div>'
   +    '<div ng-switch-default></div>'
   +'</div>');
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('udt-messages.html',
    '<div name="udt-messages" class="row">'
   +    '<div class="col-md-12 col-lg-12">'
   +        '<div ng-class="udtTable.config.messages.clazz" ng-if="udtTable.config.messages.text !== undefined">'
   +            '<strong>{{udtTable.config.messages.text}}</strong>'
   +        '</div>'
   +    '</div>'
   +'</div>');
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('udt-form.html',
    '<div name="udt-form"  class="row"><div class="col-md-12 col-lg-12" ng-transclude/></div>');
}])
.run(['$templateCache', function($templateCache) {
  $templateCache.put('udt-toolbar.html',
    '<div name="udt-toolbar" class="row margin-bottom-3">'
   +    '<div class="col-md-12 col-lg-12">'
   +        '<div class="btn-toolbar pull-left" name="udt-toolbar-buttons" ng-if="udtTable.isShowToolbarButtons()">'
   +            '<div class="btn-group" ng-switch on="udtTable.config.select.isSelectAll">'
   +                '<button class="btn btn-default" ng-disabled="udtTable.isEmpty()" ng-click="udtTable.selectAll(true)" ng-show="udtTable.isShowButton(\'select\')" ng-switch-when="false" data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.selectall\')}}">'
   +                    '<i class="fa fa-check-square"></i>'
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.selectall\')}}</span>'
   +                '</button>'
   +                '<button class="btn btn-default" ng-disabled="udtTable.isEmpty()" ng-click="udtTable.selectAll(false)" ng-show="udtTable.isShowButton(\'select\')" ng-switch-when="true" data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.unselectall\')}}">'
   +                    '<i class="fa fa-square"></i>'
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.unselectall\')}}</span>'
   +                '</button>'
   +                '<button class="btn btn-default" ng-click="udtTableFunctions.cancel()"  ng-if="udtTable.isShowButton(\'cancel\')" data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.cancel\')}}">'
   +                    '<i class="fa fa-undo"></i>'
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.cancel\')}}</span>'
   +                '</button>'
   +                '<button class="btn btn-default" ng-click="udtTable.show()" ng-disabled="!udtTable.isSelect()" ng-if="udtTable.isShowButton(\'show\')" data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.show\')}}">'
   +                    '<i class="fa fa-thumb-tack"></i>'
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.show\')}}</span>'
   +                '</button>'
   +            '</div>'
   +            '<div class="btn-group" ng-if="udtTable.isShowCRUDButtons()">'
   +                '<button class="btn btn-default" ng-click="udtTableFunctions.setEdit()" ng-disabled="!udtTable.canEdit()"  ng-if="udtTable.isShowButton(\'edit\')" data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.edit\')}}">'
   +                    '<i class="fa fa-edit"></i>'
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.edit\')}}</span>'
   +                '</button>'
   +                '<button class="btn btn-default" ng-click="udtTable.save()" ng-disabled="!udtTable.canSave()" ng-if="udtTable.isShowButton(\'save\')"  data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.save\')}}" >'
   +                    '<i class="fa fa-save"></i>'
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.save\')}}</span>'
   +                '</button>'
   +                '<button class="btn btn-default" ng-click="udtTable.remove()" ng-disabled="!udtTable.canRemove()" ng-if="udtTable.isShowButton(\'remove\')"  data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.remove\')}}">'
   +                    '<i class="fa fa-trash-o"></i>'
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.remove\')}}</span>'
   +                '</button>'
   +            '</div>'
   +            '<div class="btn-group" ng-if="udtTable.config.add.active && udtTable.config.add.showButton">'
   +                '<button class="btn btn-default" ng-click="udtTable.addBlankLine()" title="{{udtTableFunctions.messages.Messages(\'datatable.button.add\')}}">'
   +                    '<i class="fa fa-plus"></i>'
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.add\')}}</span>'
   +                '</button>'
   +            '</div>'
   +            '<div class="btn-group" ng-if="udtTable.isShowExportCSVButton()" ng-switch on="udtTable.config.group.active">'
   +                '<button ng-switch-when="false" class="btn btn-default" ng-click="udtTableFunctions.exportCSV(\'all\')" ng-disabled="!udtTable.canExportCSV()" data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.exportCSV\')}}">'
   +                    '<i class="fa fa-file-text-o"></i>'
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.basicExportCSV\')}}</span>'
   +                '</button>'
   +                '<button ng-switch-when="true" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-disabled="!udtTable.canExportCSV()"  title="{{udtTableFunctions.messages.Messages(\'datatable.button.exportCSV\')}}">'
   +                    '<i class="fa fa-file-text-o"></i> '
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.exportCSV\')}}</span>'
   +                    '<span class="caret"/>'
   +                '</button>'
   +                '<ul class="dropdown-menu">'
   +                    '<li>'
   +                        '<a href="" ng-click="udtTableFunctions.exportCSV(\'all\')">'
   +                            '<i class="fa fa-file-text-o"></i> {{udtTableFunctions.messages.Messages(\'datatable.button.basicExportCSV\')}}'
   +                        '</a>'
   +                    '</li>'
   +                    '<li>'
   +                        '<a href="" ng-click="udtTableFunctions.exportCSV(\'groupsOnly\')">'
   +                            '<i class="fa fa-file-text-o"></i> {{udtTableFunctions.messages.Messages(\'datatable.button.groupedExportCSV\')}}'
   +                        '</a>'
   +                    '</li>'
   +                '</ul>'
   +            '</div>'
   +            '<div class="btn-group" ng-if="udtTable.isShowButton(\'group\')">'
   +                '<button data-toggle="dropdown" class="btn btn-default dropdown-toggle" ng-disabled="udtTable.isEmpty()" data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.group\')}}">'
   +                    '<i class="fa fa-bars"></i> '
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.group\')}} </span>'
   +                    '<span class="caret" />'
   +                '</button>'
   +                '<ul class="dropdown-menu">'
   +                    '<li ng-repeat="column in udtTable.getGroupColumns()">'
   +                        '<a href="" ng-click="udtTableFunctions.setGroupColumn(column)" ng-switch on="!udtTable.isGroup(column.id)">'
   +                            '<i class="fa fa-bars" ng-switch-when="true"></i>'
   +                            '<i class="fa fa-outdent" ng-switch-when="false"></i> '
   +                            '<span ng-bind="udtTableFunctions.messages.Messages(column.header)"/>'
   +                        '</a>' 
   +                    '</li>'
   +                    '<li class="divider"></li>'
   +                    '<li>'
   +                        '<a href="" ng-click="udtTable.setGroupColumn(\'all\')" ng-switch on="!udtTable.isGroup(\'all\')">'
   +                            '<i class="fa fa-bars" ng-switch-when="true"></i>'
   +                            '<i class="fa fa-outdent" ng-switch-when="false"></i> '
   +                            '<span ng-bind="udtTableFunctions.messages.Messages(\'datatable.button.generalGroup\')"/>'
   +                        '</a>'
   +                    '</li>'
   +                    '<li class="dropdown-header" style="font-size:12px;color:#333">'
   +                        '<div class="checkbox">'
   +                            '<label>'
   +                                '<input type="checkbox" ng-model="udtTable.config.group.showOnlyGroups" ng-click="udtTableFunctions.updateShowOnlyGroups()"/>{{udtTableFunctions.messages.Messages(\'datatable.button.showOnlyGroups\')}}'
   +                            '</label>'
   +                        '</div>'
   +                    '</li>'
   +                '</ul>'
   +            '</div>'
   +            '<div class="btn-group" ng-if="udtTable.isShowHideButtons()">'
   +                '<button data-toggle="dropdown" class="btn btn-default dropdown-toggle" data-toggle="tooltip" title="{{udtTableFunctions.messages.Messages(\'datatable.button.hide\')}}">'
   +                    '<i class="fa fa-eye-slash"></i> '
   +                    '<span ng-if="!udtTable.isCompactMode()"> {{udtTableFunctions.messages.Messages(\'datatable.button.hide\')}} </span>'
   +                    '<span class="caret"></span>'
   +                '</button>'
   +                '<ul class="dropdown-menu">'
   +                    '<li ng-repeat="column in udtTable.getHideColumns()">'
   +                        '<a href="" ng-click="udtTableFunctions.setHideColumn(column)" ng-switch on="udtTable.isHide(column.id)">'
   +                            '<i class="fa fa-eye" ng-switch-when="true"></i>'
   +                            '<i class="fa fa-eye-slash" ng-switch-when="false"></i> '
   +                            '<span ng-bind="udtTableFunctions.messages.Messages(column.header)"/>'
   +                        '</a>'
   +                    '</li>'
   +                '</ul>'
   +            '</div>'
   +            '<div class="btn-group" ng-if="udtTable.isShowOtherButtons()" udt-compile="udtTable.config.otherButtons.template"></div>'
   +        '</div>'
   +        '<div class="col-xs-2 .col-sm-3 col-md-3 col-lg-3" name="udt-toolbar-filter" ng-if="udtTable.config.filter.active === true">'
   +            '<div class="col-xs-12 .col-sm-6 col-md-7 col-lg-8 input-group" ng-if="udtTable.isCompactMode()">'
   +                '<input class="form-control input-compact" udt-change="udtTable.searchLocal(udtTable.searchTerms)" type="text" ng-model="udtTable.searchTerms.$" ng-keydown="$event.keyCode==13 ? udtTable.searchLocal(udtTable.searchTerms) : \'\'">'
   +                '<span class="input-group-btn">'
   +                    '<button ng-if="udtTable.config.filter.active === true" class="btn btn-default search-button" ng-click="udtTable.searchLocal(udtTable.searchTerms)" title="{{udtTableFunctions.messages.Messages(\'datatable.button.searchLocal\')}}">'
   +                        '<i class="fa fa-search"></i>'
   +                    '</button>'
   +                    '<button ng-if="udtTable.config.filter.active === true" class="btn btn-default search-button" ng-click="udtTable.searchTerms={};udtTable.searchLocal()" title="{{udtTableFunctions.messages.Messages(\'datatable.button.resetSearchLocal\')}}">'
   +                        '<i class="fa fa-times"></i>'
   +                    '</button>'
   +                '</span>'
   +            '</div>'
   +            '<div class="col-xs-12 .col-sm-12 col-md-12 col-lg-12 input-group" ng-if="!udtTable.isCompactMode()">'
   +                '<input class="form-control" utd-change="udtTable.searchLocal(udtTable.searchTerms)" type="text" ng-model="udtTable.searchTerms.$">'
   +                '<span class="input-group-btn">'
   +                    '<button ng-if="udtTable.config.filter.active === true" class="btn btn-default search-button" ng-click="udtTable.searchLocal(udtTable.searchTerms)" title="{{udtTableFunctions.messages.Messages(\'datatable.button.searchLocal\')}}">'
   +                        '<i class="fa fa-search"></i>'
   +                        '<span> {{udtTableFunctions.messages.Messages(\'datatable.button.searchLocal\')}} </span>'
   +                    '</button>'
   +                    '<button ng-if="udtTable.config.filter.active === true" class="btn btn-default search-button" ng-click="udtTable.searchTerms={};udtTable.searchLocal()" title="{{udtTableFunctions.messages.Messages(\'datatable.button.resetSearchLocal\')}}">'
   +                        '<i class="fa fa-times"></i>'
   +                        '<span> {{udtTableFunctions.messages.Messages(\'datatable.button.resetSearchLocal\')}} </span>'
   +                    '</button>'
   +                '</span>'
   +            '</div>'
   +        '</div>'
   +        '<div class="btn-toolbar pull-right" name="udt-toolbar-results" ng-if="udtTable.isShowToolbarResults()">'
   +            '<button class="btn btn-info" disabled="disabled" ng-if="udtTable.config.showTotalNumberRecords">{{udtTableFunctions.messages.Messages(\'datatable.totalNumberRecords\', udtTableFunctions.getTotalNumberRecords())}}</button>'
   +        '</div>'
   +        '<div class="btn-toolbar pull-right" name="udt-toolbar-pagination" ng-if="udtTable.isShowToolbarPagination()">'
   +            '<div class="btn-group" ng-if="udtTable.isShowPagination()">'
   +                '<ul class="pagination">'
   +                    '<li ng-repeat="page in udtTable.config.pagination.pageList" ng-class="page.clazz">'
   +                        '<a href="" ng-click="udtTableFunctions.setPageNumber(page);" ng-bind="page.label"></a>'
   +                    '</li>'
   +                '</ul>'
   +            '</div>'
   +            '<div class="btn-group">'
   +                '<button data-toggle="dropdown" class="btn btn-default dropdown-toggle">'
   +                    '{{udtTableFunctions.messages.Messages(\'datatable.button.length\', udtTable.config.pagination.numberRecordsPerPage)}} <span class="caret"></span>'
   +                '</button>'
   +                '<ul class="dropdown-menu">'
   +                    '<li ng-repeat="elt in udtTable.config.pagination.numberRecordsPerPageList" class={{elt.clazz}}>'
   +                        '<a href="" ng-click="udtTableFunctions.setNumberRecordsPerPage(elt)">{{elt.number}}</a>'
   +                    '</li>'
   +                '</ul>'
   +            '</div>'
   +        '</div>'
   +    '</div>'
   +'</div>');
}]);