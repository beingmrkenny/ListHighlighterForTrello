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

			case 'refresh':
				location.reload();
				break;

			case 'highlightToggle' :
				ListHighlighter.toggleHighlight(request.highlightStatus);
				break;

			case 'colorChange' :
				Options.load('colors', function () {
					DoingColors.highPriColorStyles();
				});
				break;

			case 'options.HideHashtags' :
			case 'options.HighlightTags' :
			case 'options.HighlightTitles' :
			case 'options.MatchTitleSubstrings' :
				Options.load('options', function (options) {
					ListHighlighter.highlight();
					HeaderTagging.toggleTags (options.HideHashtags);
				});
				break;

			case 'options.EnableHeaderCards' :
			case 'options.EnableSeparatorCards' :
			case 'options.HeaderCardsExtraSpace' :
			case 'options.SeparatorCardsVisibleLine' :
				Options.load('options', function () {
					System.headerCardsSetup();
					Card.processCards(document.querySelectorAll('.list-card'));
					ListWorkPoints.updateLists();
				});
				break;

			case 'options.EnablePointsOnCards' :
				Options.load('options', function () {
					ListWorkPoints.handlePointsOnCards();
				});
			case 'options.EnableWIP' :
			case 'options.CountAllCards' :
				Options.load('options', function (options) {
					ListWorkPoints.updateLists();
					HeaderTagging.toggleTags (options.EnableWIP);
					ListHighlighter.highlight();
				});
				break;
		}
	}
);

window.addEventListener('load', System.setup);

window.addEventListener('focus', System.toggleToolbarButton);
