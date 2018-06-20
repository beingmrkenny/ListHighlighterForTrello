chrome.runtime.onMessage.addListener(function(request) {
	if (request.toggledOff) {
		chrome.browserAction.setIcon({path: '/img/buttonIconOff.png'});
	} else {
		chrome.browserAction.setIcon({path: '/img/buttonIcon.png'});
	}
});
