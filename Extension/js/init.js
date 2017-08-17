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
				Options.load('colors', function (colors) {
					GLOBAL.colors = colors;
					DoingColors.highPriColorStyles();
				});
				break;
			case 'rehighlight' :
				Options.load('options', function (options) {
					System.saveOptionsAsGlobal(options);
					ListHighlighter.highlight();
					ListHighlighter.toggleHideHashtags (options.HideHashtags);
					Card.processCards(document.querySelectorAll('.list-card'));
					setTimeout(function () {
						System.headerCardsSetup();
						System.cardLabelText();
					}, 0)
				});
				break;
		}
	}
);

window.addEventListener('load', System.setup);

window.addEventListener('focus', System.toggleToolbarButton);
