'use strict';

chrome.storage.onChanged.addListener( (changes, namespace) => {

	for (let key in changes) {

		Global.setItem(key, changes[key].newValue);

		// if (window.location.pathname.startsWith('/c/')) { }
		// if (window.location.pathname.startsWith('/b/')) { }
		// let value = changes[key].newValue;

		if (key.startsWith('rule-')) {
			InsertedCSS.generateRules();
			RulesMatcher.applyCorrectRuleToLists();
		}

		switch (key) {

			case 'options-HighlightUndimOnHover' :
				TrelloPage.toggleUndimOnHover();
				System.keydownUndimSetup();
				break;

			case 'options-HighlightHideHashtags' :
				HeaderTagging.toggleTags();
				break;

			case 'options-HighlightChangeTextColor' :
				InsertedCSS.generateRules();
				break;

			case 'options-OrganisingEnableHeaderCards' :
			case 'options-OrganisingEnableSeparatorCards' :
			case 'options-OrganisingHeaderCardsExtraSpace' :
			case 'options-OrganisingSeparatorCardsVisibleLine' :
				System.headerCardsSetup();
				HeaderSeparatorCard.processCards(document.querySelectorAll('.list-card'));
				ListWorkPoints.updateLists();
				break;

			case 'options-CountEnableWIP' :
			case 'options-CountAllCards' :
			case 'options-CountEnablePointsOnCards' :
			case 'options-CountHideManualCardPoints' :
				ListWorkPoints.updateLists();
				HeaderTagging.toggleTags();
				break;
		}

	}

});

chrome.runtime.onMessage.addListener (
	function(request, sender, sendResponse) {
		if (request.message == 'hello') {
			sendResponse({ trello: true, page: TrelloPage.getDetails() });
		}
		if (request.message == 'highlightToggle') {
			TrelloPage.toggleListHighlighting(request.highlightStatus);
		}
	}
);

window.addEventListener('load', System.setup);

window.addEventListener('focus', System.toggleToolbarButton);
