# Column configuration
> The columns configuration is an array of Json object, each object is one column. This array is in the general configuration of the datatable, his name is [columns](configuration/#columns).

```json
{
...
"columns" : [{
				"header":"myHead",
				...
			 },
			 {
				"header":"myHead2",
				...
			 },
			 ...
			],
...
}
```
#Options
##Header
> The text of the header
```json
"header" : "The name"
```
##Property
> The property you want to bind in the cells
```json
"property" : "The property" or angular expression or function(){}
```
##Position
> Position of the column
```json
"position" : 0/1/2/3...
```
##Filter
> The AngularJS filter(s) to apply to the property before the display
```json
"filter" : "filter [| filter...]"
```
##Edit
> If the column is editable set to true else set to false
```json
"edit" : boolean
```
##Convert value
> If the column need convertion
```json
"convertValue":{
	"active":false, //True if the value have to be converted when displayed to the user
	"displayMeasureValue":"",//The unit display to the user, mandatory if active=true
	"saveMeasureValue":"" //The unit in database,  mandatory if active=true
},
```												
##Hide
> If the column can be hide by the user
```json
"hide" : boolean
```
##Order
> If the column can be order by the user
```json
"order" : boolean
```
##Merge Cells
> merge cell with the same values in the column
```json
"mergeCells" : boolean
```
##Type
> The column input type
```json
"type" : "text"/"textarea"/"number"/"date"/"img"/"file"
```
##Choice in list
> When the column is in edit mode, the edition is a list of choices or not
```json
"choiceInList" : boolean
```
##List style
> If choiceInList:true, listStyle:"select" is a select input, listStyle:"radio" is a radio input
```json
"listStyle" : "select"/"radio"
```
##Possible values
> The list of possible choices to display in the list
```json
"possibleValues" : [{code: 1, name: "choice1"}, {code: 2, name: "choice2"}, ...]
```
##Format
> The format used to diplay the data
```json
"format" : "number"/"date"/"datetime"
```
#Advanced features
##Render
> To change the template of the cells in the column (override the property)
```json
"render" : "<span ng-bind='value.data'></span>" or function(value, line){ return "html"}
```
##Edit directives
> Add directive to the html input when editing, for example "editDirectives":'ng-keydown="scan($event,value.data)"'.
> udt provides the `udt-textarea-resize` directive to allow textareas to be automatically resized to their content when edited. Use it as follow: `editDirectives: ' udt-textarea-resize '`.
```json
"editDirectives" : "directive [| directive...]"
```
##Extra headers
> The headers that can be on top of the default headers of the column, level is the key, the header label the value
```json
"extraHeaders" : {"0":"Inputs", "1":"test", ...}
```
##Td class
> Function with data and property as parameter than return css class or just the css class
```json
"tdClass" : function(data, property){}
```
##Group
> If column can be used to group data
```json
"group" : boolean
```
##Group method
> mandatory if group:true, set the group method on that column
```json
"groupMethod" : "sum"/"average"/"countDistinct"/"collect"
```
##Default value
> If the value of the column is undefined or "" when the user edit, this value show up
```json
"defaultValue" : "theDefaultValue"
```
##Url
> lazy data, load the data form the server for each cell of the colum
```json
"url" : "theUrlToGetTheData"
```
##mergeCells
> if you want to merge cell with same value, experimently features
```json
"mergeCells" : boolean
```
##required
> if a cell is required during edition
```json
"required" : boolean or function that return boolean
```