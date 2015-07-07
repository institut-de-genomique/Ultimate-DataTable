angular.module('ultimateDataTableServices').directive('highlight', function() {
	var component = function(scope, element, attrs) {
		
		if (!attrs.highlightClass) {
			attrs.highlightClass = 'angular-highlight';
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
			//console.log("scope.keywords",scope.keywords);
			if (!newValue || newValue == '') {
				element.html(scope.highlight.toString());
				return false;
			}
			
			
			var tokenized = tokenize(newValue);
			var regex = new RegExp(tokenized.join('|'), 'gmi');
			
			// Find the words
			var html = scope.highlight.toString().replace(regex, replacer);
			
			element.html(html);
		}, true);
	}
	return {
		link: 			component,
		replace:		false,
		scope:			{
			highlight:	'=',
			keywords:	'='
		}
	};
});