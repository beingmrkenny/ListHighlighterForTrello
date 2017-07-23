'use strict';

var GLOBAL = {};

chrome.runtime.onMessage.addListener (
	function(request, sender, sendResponse) {
		switch (request.message) {
			case 'hello':
				sendResponse({
					trello: true,
					page: TrelloPage.getDetails()
				});
				break;
			case 'highlightToggle' :
				ListHighlighter.toggleHighlight(request.highlightStatus);
				break;
			case 'colorChange' :
				Options.load('colors', function (results) {
					GLOBAL.colors = results.colors;
					DoingColors.highPriColorStyles();
				});
				break;
			case 'rehighlight' :
				Options.load('options', function (results) {
					System.saveOptionsAsGlobal(results.options);
					ListHighlighter.highlight();
					ListHighlighter.toggleHideHashtags (results.options.HideHashtags);
					Card.processCards(document.querySelectorAll('.list-card'));
				});
				break;
		}
	}
);

window.addEventListener('load', function () {
	System.setup();
});
