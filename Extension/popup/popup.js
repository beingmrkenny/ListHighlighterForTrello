chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

	chrome.tabs.sendMessage(

		tabs[0].id,
		{message: 'hello'},
		function (response) {
			if (response && response.trello === true) {
				toggleBoardPopup(response.page);
			} else {
				toggleBoardPopup(false);
			}
		}

	);

});

function toggleBoardPopup (page) {

	var section = document.getElementById('ListHighlighter'),
		boardSpecifics = document.querySelectorAll('.board-specific'),
		button = document.getElementById('HighlightToggle'),
		isCustomBackground = page.isCustomBackground,
		color = new Color(page.backgroundColor),
		trelloBoard = (page && page.isBoard);

	document.body.classList.toggle('trello-page', trelloBoard);
	for (let boardSpecific of boardSpecifics) {
		boardSpecific.hidden = !trelloBoard;
	}

	section.style.backgroundColor = page.backgroundColor;

	if (isCustomBackground
		|| color.isLight()
		|| !page
		|| (page && !page.isBoard)
	) {
		section.classList.remove('dark-background');
	} else {
		section.classList.add('dark-background');
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

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				message: 'highlightToggle',
				highlightStatus: highlightStatus
			}
		);
	});

	if (highlightStatus) {
		chrome.browserAction.setIcon({path: '/img/buttonIcon.png'});
	} else {
		chrome.browserAction.setIcon({path: '/img/buttonIconDehighlighted.png'});
	}

	toggleHighlightButton(highlightStatus);
}
