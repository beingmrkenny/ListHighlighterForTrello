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
		boardSpecific = document.getElementById('BoardSpecific'),
		button = document.getElementById('HighlightToggle'),
		isCustomBackground = page.isCustomBackground,
		color = new Color(page.backgroundColor);

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

	section.style.display = 'block';

	toggleHighlightButton(page.highlighted);

	button.addEventListener('click', function () {
		if (this.classList.contains('on')) {
			toggleHighlight(false);
		} else {
			toggleHighlight(true);
		}
	});

	if (page && page.isBoard) {
		boardSpecific.style.display = 'block';
	}

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
