angular.module('ultimateDataTableServices').directive('udtHighlight', function() {
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
});