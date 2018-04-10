chrome.runtime.onMessage.addListener(function(request) {
	if (request.toggledOff) {
		chrome.browserAction.setIcon({path: '/img/buttonIconDehighlighted.png'});
	} else {
		chrome.browserAction.setIcon({path: '/img/buttonIcon.png'});
	}
});

chrome.runtime.onInstalled.addListener (details => {
	chrome.tabs.query({}, tabs => {
		for (let tab of tabs) {
			if (/^https:\/\/trello\.com/.test(tab.url)) {
				chrome.tabs.executeScript( tab.id, { file : 'js/refresh.js' } );
			}
		}
	});
});
