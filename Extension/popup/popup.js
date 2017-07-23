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
		boardSpecific = document.getElementById('BoardSpecific');

	section.style.backgroundColor = page.backgroundColor;

	let	isCustomBackground = page.isCustomBackground,
		color = new Color(page.backgroundColor);

	if (isCustomBackground || color.isLight()) {
		section.classList.remove('dark-background');
	} else {
		section.classList.add('dark-background');
	}

	section.style.display = 'block';

	var highlightOn = document.getElementById('HighlightOn');

	toggleHighlightButton(page.highlighted);

	highlightOn.addEventListener('click', function () {
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

function toggleHighlightButton(showButton) {
	var highlightOn = document.getElementById('HighlightOn');
	var offBlurb = document.querySelector('.off-blurb');

	if (showButton) {
		highlightOn.classList.add('on');
		highlightOn.querySelector('.text').textContent = 'On';
		offBlurb.hidden = true;
	} else {
		highlightOn.classList.remove('on');
		highlightOn.querySelector('.text').textContent = 'Off';
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
