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
				Options.loadColors(function (colors) {
					DoingColors.highPriColorStyles();
				});
				break;

			case 'options.HideHashtags' :
			case 'options.HighlightTags' :
			case 'options.HighlightTitles' :
			case 'options.MatchTitleSubstrings' :
			case 'options.DimUntaggedHigh' :
			case 'options.DimUntaggedNormal' :
				Options.loadOptions(function (options) {
					ListHighlighter.highlight();
					HeaderTagging.toggleTags (options.HideHashtags);
				});
				break;

			case 'options.EnableHeaderCards' :
			case 'options.EnableSeparatorCards' :
			case 'options.HeaderCardsExtraSpace' :
			case 'options.SeparatorCardsVisibleLine' :
				Options.loadOptions(function () {
					System.headerCardsSetup();
					Card.processCards(document.querySelectorAll('.list-card'));
					ListWorkPoints.updateLists();
				});
				break;

			case 'options.EnableWIP' :
			case 'options.CountAllCards' :
			case 'options.EnablePointsOnCards' :
			case 'options.HideManualCardPoints' :
				Options.loadOptions(function (options) {
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
