#Configuration
> The directive have a default configuration that you can overide by passing it to the constructor of the datatable object or calling setConfig on the datatable object with the new configutation.

```javascript
//set the configuration at the instanciation
 $scope.datatable = datatable(datatableConfig);
 
 //or set it after the init
 $scope.datatable.setConfig(datatableConfig);
```

> The configuration is a Json object :
```json
{
	name:"simple_datatable",
	columns:[
		 {
			 "header":"test",
			 "property":"test",
			 "order":true,
			 "type":"text",
			 "edit":true
		 },
		 {
			 "header":"test2",
			 "property":"test2",
			 "order":true,
			 "type":"text"
		 }],
		 edit:{
			 active:true,
			 columnMode:true
		 },
		 pagination:{
			mode:'local'
		 },
		 order:{
			mode:'local'
		 },
		 remove:{
			active:true,
			mode:'local'
		 }
}
```
#Options
## Name
> This option is used to override the default name of the datatable object
## Save
> This option handle the save function, you can use the local mode or the remote mode to tell your server the resources need to be saved or updated
```json
"save":{
	"active":boolean,//Active or not
	"withoutEdit":boolean, //If you want to be able to safe without editing lines
	"keepEdit":boolean, //Keep in edit mode after save
	"showButton":boolean,//Show the save button in the toolbar
	"changeClass":boolean, //Change class to success or error on the lines
	"mode":'remote' or 'local', //Save mode
	"url":"theUrl" or function(value){return "url"},//Required if mode is remote
	"batch":boolean, //for batch mode one url with all data
	"method":'post' or function(line){ return 'method'},//The HTTP verb
	"value":function(value){ return value;}, //used to transform the value send to the server
    "httpConfig": { headers: { "Authorization": "ixxx" } }, // Pass these options to the $http service.
	"callback":function(datatable, errorsNumber){} //used to have a callback after save all elements.
}
```
## Search
> This option handle the search function, to search you have to call datatableObject.search(form).
```json
"search": {
	active:boolean,
	url:"theUrl",//Required if mode is remote
}
```
The server have to respond with data in JSON: 
```json
{
"data": [...]
"recordsNumber":numberOfRecords
}
```
## Filter
> If active, add a input field to search locally on all data, the highlight option highlight the search term in the datatable if active, the columnMode option if active add filter for all columns
```json
"filter": {
	active:boolean,//Active or not
	highlight:boolean,
	columnMode:boolean,
	showButton:boolean //Show the filter and reset buttons if true
}
```
## Edit
> This option handle the edit function
```json
"edit" : {
	"active":boolean,//Active or not
	"withoutSelect":boolean, //edit all line without selected it								
	"showButton":boolean,//Show the edit button in the toolbar
        "showLineButton": false, // Show the edit buttons left of each line
	"columnMode":boolean,//Edit column
	"byDefault":boolean, //Set in edit mode when the datatable is build
	"lineMode":funtion(line){ return boolean;} //function used to define if line is editable
}
```
## Remove
> This option handle the remove function for you, you can use the local mode or the remote mode to tell your server that the resources need to be deleted
```json
"remove":{
	"active":boolean,//Active or not
	"withEdit":boolean, //Allow to remove a line in edition mode
	"showButton" : boolean,//Show the remove button in the toolbar
	"mode":'remote' or 'local', //Remove mode
	//Required if mode is remote, can be a function with the current object in parameter
	"url":"theUrl" or function(value){return "url"},
	"callback ": function(datatable, errorsNumber){}, //Callback after remove all element. 
}
```
## Columns
> This option is the [columns configuration](columns-configuration)
```json
"colmuns" : [{
	"header":"test"
	...
	},
	...
]
```
## Columns url
> If you want to load the column configuration from your server
```json
"colmunsUrl" : "theUrl"
```
## Pagination
> As a table, the Ultimate DataTable handle the pagination, you can use the javascript function with the local mode or let your server do it with the remote mode.
```json
"pagination":{
	"active":boolean,//Active or not
	"mode":'remote' or 'local',//remote will call the server to do the pagination things
	"numberPageListMax":3,
	"numberRecordsPerPage":10,//Number of item in a page
	//The list of the possible option given to the user
	"numberRecordsPerPageList": [{number:10, clazz:''},{number:25, clazz:''},...],
    "bottom":true, //Display pagination toolbar on udt bottom
    "numberRecordsPerPageForBottomdisplay":50 //Number of elements that bottom toolbar is displaying
}
```
## Order
> As a table, the Ultimate DataTable handle the order, you can use the javascript function with the local mode or let your server do it with the remote mode.
```json
"order" : {
	"active":boolean,//Active or not
	"showButton" : boolean,//Show the order button in the toolbar
	"mode":'remote' or 'local', //remote will call the server to do the order things
	"by" : string,//order by ...
	"reverse" : boolean,//reverse the order
	"callback":function(datatable, errorsNumber){},//used to have a callback after order all element.
}
```
## Add
> Add a new line in edit mode when the user click the button
```json
"add" : {
	"active":boolean,
	"showButton":boolean
}
```
## Compact
> compact mode hide buttons labels
```json
compact:boolean/boolean
```
## Hide
> If the user want to hide some column(s)
```json
"hide":{
	"active":boolean,//Active or not
	"byDefault":undefined, //set default column in hide mode
	"showButton":boolean//Show the hide button in the toolbar
}
```
## Merge Cells
> If the user want to merge same cells in some column(s)
```json
"mergeCells":{
	"active":boolean//Active or not
}
```
## Select
> The way the user will select the lines
```json
"select":{
	"active":boolean,//Active or not
	"showButton":boolean,//Show the select all button in the toolbar,
    "callback": function(line, data){}, // DEPRECATED, use mouseevents.clickCallback instead. Callback executed when the user clicks on a row. This has priority over mouseevents.clickCallback.
}
```
## Mouseevents
> Allow a custom function to be executed when the user a the mouse over a row
```json
"mouseevents":{
        "active":boolean,//Active or not
        "overCallback": function(line, data){}, // Callback called when the mouse enter over a row.
        "leaveCallback":function(line, data){}, // Callback called when the mouse leave a row.
        "clickCallback": function(line, data){}, //The action to execute when a user select a row. Check line.selected to know whether the user selected or unselected a row.
}
```
## Cancel
> Cancel and revers all the modification of the user and disable edit
```json
"cancel" : {
	"active":boolean,//Active or not
	"showButton":boolean//Show the cancel button in the toolbar
}
```
## CSV export
> If you want to make an export of all the data, you need to import the dependencies/fileSaver/fileSaver.min.js file to use this feature
```json
"exportCSV":{
	active:boolean,//Active or not
	showButton:boolean,//Show the export button in the toolbar
	delimiter:";"/Set the delimiter
}
```
## Show total number records
> If true show the number of total records on the left corner
```json
"showTotalNumberRecords":boolean
```
#Advanced features
## Show
> Sometimes you will want to extend the way that the user can view data, so with this option you are free to redirect him with his select line, for exemple in a detailled view
```json
"show" : {
	"active":boolean,
	"showButton":boolean,
	"add":function(line){
		//open a new page or add new tab to show detail...
	}
}
```
## Other buttons
> Sometimes you will need to add custom button to the toolbar, this is why we add the option
```json
"otherButtons":{
	"active":boolean,//Active or not
	"complex":boolean // true if you want manage btn-group in your template
	"template":string //Html element to insert one button a the end of toolbar
}
```
## Messages
> If you want to follow i18n, you can use the build in service or override the transformKey function with your i18n function.<br>
Click [here](errors) to see how the Ultimate DataTable handle errors
```json
"messages":{
	"active":boolean,//Active or not
	"errorClass":'alert alert-danger',//Set the class when their is errors
	"successClass": 'alert alert-success',//Set the class when their is success
	//Set the error key to be i18n
	"errorKey":{save:'datatable.msg.error.save',remove:'datatable.msg.error.remove'},
	//Set the success key to be i18n
	"successKey":{save:'datatable.msg.success.save',remove:'datatable.msg.success.remove'},
	//Current text
	"text":string,
	//current class
	"clazz":string,
	"transformKey" : function(key, args){}//the function that transform the key
}
```
## Group
> You can group data by a colmun, this will apply groupMethod for each cell of the datatable and show it in one line before or after de grouped lines
```json
"group":{
	"active":boolean, ///Active or not, group add group:boolean in each line of type group
	"callback":function(datatable){},//Call after the group function
	"by":string,//group by...
	"showButton":boolean,//Show the group button in the toolbar
	"after":boolean, //To position group line before or after lines
	"showOnlyGroups":boolean, //To display only group line in datatable
	"enableLineSelection":boolean //Authorized or not selection on group line
}
```
## Extra Headers		
```json
extraHeaders:{
	number:0,//Number of extra headers
	list:{},//If dynamic:false
	dynamic:boolean //If dynamic:true, the headers will be auto generated
}
```

## Callback display function		
```json
callbackEndDisplayResult: function(){} // function call after compute display data
```
