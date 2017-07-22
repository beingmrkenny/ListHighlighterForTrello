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

	let color = new Color(page.backgroundColor);

	if (color.isLight()) {
		section.classList.remove('dark');
	} else {
		section.classList.add('dark');
	}

	section.style.display = 'block';

	var highlightOn = document.getElementById('HighlightOn');

	toggleHighlightButton(page.highlighted);

	highlightOn.addEventListener('click', function () {
		if (this.classList.contains('on')) {
			highlight(false);
		} else {
			highlight(true);
		}
	});

	if (page && page.isBoard) {
		boardSpecific.style.display = 'block';
	}

}

function toggleHighlightButton(highlight) {
	var highlightOn = document.getElementById('HighlightOn');
	var offBlurb = document.querySelector('.off-blurb');

	if (highlight) {
		highlightOn.classList.add('on');
		highlightOn.querySelector('.text').textContent = 'On';
		offBlurb.hidden = true;
	} else {
		highlightOn.classList.remove('on');
		highlightOn.querySelector('.text').textContent = 'Off';
		offBlurb.hidden = false;
	}
}

function highlight(highlight) {

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				message: 'highlight',
				highlight: highlight
			}
		);
	});

	toggleHighlightButton(highlight)
}
