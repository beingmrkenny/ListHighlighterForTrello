

function saveColor (trelloBg, colorName) {
	currentDoingColors[ trelloBg ] = colorName;
	Options.save(
		{
			[`colors.current.${trelloBg}`] : colorName
		},
		function () {
			sendMessage('colorChange');
		}
	);

}

function saveCustomColor (trelloBg, hex) {
	if (hex == 'custom') {
		throw new Error('Provided color is not a hex code');
	}
	customDoingColors[ trelloBg ] = hex;
	Options.save(
		{
			[`colors.custom.${trelloBg}`] : hex
		},
		function () {
			sendMessage('colorChange');
			saveRecentColor(hex);
		}
	);
}

function sendMessage (message) {
	chrome.tabs.query({}, function (tabs) {
		for (let tab of tabs) {
			chrome.tabs.sendMessage(
				tab.id,
				{message: message},
				function (response) {}
			);
		}
	});
}
