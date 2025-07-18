chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	chrome.tabs.sendMessage(
		tabs[0].id,
		{ message: 'hello' },
		function (response) {
			if (response && response.trello === true) {
				toggleBoardPopup(response.page);
			} else {
				toggleBoardPopup(false);
			}
		}
	);
});

function toggleBoardPopup(page) {
	var boardSpecifics = document.querySelectorAll('.board-specific'),
		button = document.getElementById('HighlightToggle'),
		trelloBoard = page && page.isBoard;

	document.body.classList.toggle('trello-page', trelloBoard);
	for (let boardSpecific of boardSpecifics) {
		boardSpecific.hidden = !trelloBoard;
	}

	if (trelloBoard) {
		toggleHighlightButton(page.highlighted);
	}

	button.addEventListener('click', function () {
		if (this.classList.contains('on')) {
			toggleHighlight(false);
		} else {
			toggleHighlight(true);
		}
	});
}

function toggleHighlightButton(highlightingOn) {
	var button = document.getElementById('HighlightToggle'),
		indicator = document.getElementById('HighlightIndicator'),
		offBlurb = document.querySelector('.off-blurb');

	if (highlightingOn) {
		button.classList.add('on');
		button.textContent = 'Switch Off';
		indicator.classList.add('on');
		indicator.textContent = 'On';
		offBlurb.hidden = true;
	} else {
		button.classList.remove('on');
		button.textContent = 'Switch On';
		indicator.classList.remove('on');
		indicator.textContent = 'Off';
		offBlurb.hidden = false;
	}
}

function toggleHighlight(highlightStatus) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			message: 'highlightToggle',
			highlightStatus: highlightStatus,
		});
	});

	const manifestVersion = chrome.runtime.getManifest()?.manifest_version || 2;
	const action = manifestVersion == 3 ? chrome.action : chrome.browserAction;

	if (highlightStatus) {
		action.setIcon({ path: '/img/buttonIcon.png' });
	} else {
		action.setIcon({ path: '/img/buttonIconOff.png' });
	}

	toggleHighlightButton(highlightStatus);
}
