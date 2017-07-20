'use strict';

chrome.runtime.onMessage.addListener (
	function(request, sender, sendResponse) {
		switch (request.message) {
			case 'hello':
				sendResponse({
					trello: true,
					page: TrelloPage.getDetails()
				});
				break;
			case 'highlight' :
				ListHighlighter.toggleHighlight(request.highlight);
				break;
		}
	}
);

window.addEventListener('load', function () {
	System.setup();
});
