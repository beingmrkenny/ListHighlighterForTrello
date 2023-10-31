'use strict';

const UP = 'up';
const DOWN = 'down';

chrome.storage.onChanged.addListener((changes, namespace) => {
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
			case 'options-HighlightUndimOnHover':
				TrelloPage.toggleUndimOnHover();
				System.keydownUndimSetup();
				break;

			case 'options-HighlightChangeTextColor':
				InsertedCSS.generateRules();
				break;
		}
	}
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.message == 'hello') {
		sendResponse({ trello: true, page: TrelloPage.getDetails() });
	}
	if (request.message == 'highlightToggle') {
		TrelloPage.toggleListHighlighting(request.highlightStatus);
	}
});

window.addEventListener('load', System.setup);

window.addEventListener('focus', System.toggleToolbarButton);
