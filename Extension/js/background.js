chrome.runtime.onMessage.addListener(function(request) {
	const manifestVersion = chrome.runtime.getManifest()?.manifest_version || 2;
	const action = (manifestVersion == 3)
		? chrome.action
		: chrome.browserAction;
	if (request.toggledOff) {
		action.setIcon({path: '/img/buttonIconOff.png'});
	} else {
		action.setIcon({path: '/img/buttonIcon.png'});
	}
});
