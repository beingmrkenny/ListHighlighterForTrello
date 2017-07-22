Options.resetIfEmpty();

Options.load('colorBlindFriendlyMode', function (result) {
	document.body.classList.toggle(
		'color-blind-friendly-mode',
		(typeof result.colorBlindFriendlyMode !== 'undefined' && result.colorBlindFriendlyMode === true)
	);
});

Options.load('colors', function (result) {

	if (result.colors) {

		DoingColors.init(result.colors);

		let fallbackDefaultCustom = DoingColors.getHexFromName('grey'),
			defaultColorName      = DoingColors.getDefaultColorName(),
			defaultCustomHex      = DoingColors.getCustomHexForTrelloBg('default') || fallbackDefaultCustom,
			doingColorForBlue     = DoingColors.getColorNameForTrelloBg('blue'),
			blueCustomHex         = DoingColors.getCustomHexForTrelloBg('blue') || fallbackDefaultCustom;

		DefaultColorBar.setCustomTileColorByHex (defaultCustomHex);
		Dummy.setCustomTileColorByHex (blueCustomHex);

		if (defaultColorName == 'custom') {
			Dummy.setDefaultTileColorByHex (defaultCustomHex);
		} else {
			Dummy.setDefaultTileColorByName (defaultColorName);
		}

		DefaultColorBar.selectByColorName (defaultColorName);

		Dummy.selectTile (doingColorForBlue);
		Dummy.setListColorName (doingColorForBlue);
		if (doingColorForBlue == 'custom') {
			Dummy.setDoingListColorByHex (blueCustomHex);
		} else {
			Dummy.setDoingListColorByName (doingColorForBlue);
		}

		let tiles = document.querySelectorAll('.color-tile-label');
		for (let i = tiles.length-1; i>-1; i--) {
			tiles[i].addEventListener('click', function () {

				var tile = this,
					input = $id(tile.getAttribute('for')),
					colorName = input.value,
					tileIsDefault = j(tile.dataset.default),
					tileIsCustom = tile.classList.contains('custom'),
					listColorName = $id('DummyBoard').dataset.listColorName,
					trelloBg = (tileIsDefault) ? 'default' : $id('DummyBoard').dataset.trelloBg,
					customHex;

				if (tileIsCustom) {
					customHex = input.dataset.value;
				}

				if (tileIsDefault == true) {
					if (tileIsCustom || colorName == 'custom') {
						Dummy.setDefaultTileColorByHex (customHex);
					} else {
						Dummy.setDefaultTileColorByName (colorName);
					}
				}

				if ( (tileIsDefault == true && listColorName == 'default') || tileIsDefault == false ) {
					let listColor = (tileIsDefault) ? 'default' : colorName;
					Dummy.setListColorName (listColor);
					if (tileIsCustom || colorName == 'custom') {
						Dummy.setDoingListColorByHex (customHex);
					} else {
						Dummy.setDoingListColorByName (colorName);
					}
				}

				saveColor(trelloBg, colorName);

			});
		}

		let trelloBackgroundColorButtons = document.querySelectorAll('.trello-bg-color-button');
		for (let i=trelloBackgroundColorButtons.length-1; i>-1; i--) {
			trelloBackgroundColorButtons[i].addEventListener('click', function () {
				var trelloBg = this.dataset.trelloBg;
				Dummy.changeBackgroundColor(trelloBg);
				Dummy.setCustomTileColorByHex(DoingColors.getCustomHexForTrelloBg(trelloBg));
			});
		}

		let editCustomColorLinks = document.querySelectorAll('.edit-link');
		for (let i=editCustomColorLinks.length-1; i>-1; i--) {
			let link = editCustomColorLinks[i];
			link.addEventListener('click', function (event) {
				event.preventDefault();
				setupColorPicker(this.closest('.color-tile-label'));
			});
		}

		let expandHighPriDetails = false;
		for (let key in result.colors.current) {
			if (key != 'default') {
				let value = result.colors.current[key];
				if (value && value != 'default') {
					expandHighPriDetails = true;
					break;
				}
			}
		}

		if (expandHighPriDetails) {
			$id('HighPriDetails').open = true;
		}
	}

	setTimeout(function () {
		document.body.classList.remove('preload');
	}, 0);

});

Options.load('options', function (result) {

	let options = result.options;
	for (let name in options) {
		let value = options[name];
		if (typeof value == 'boolean') {
			$id(name).checked = value;
		} else {
			$id(name+value).checked = true;
		}
	}

	var textSwitchersSingle = document.querySelectorAll('text-switcher[data-trigger]');
	for (let i = textSwitchersSingle.length-1; i>-1; i--) {
		let textSwitcher = textSwitchersSingle[i],
			trigger = $id(textSwitcher.dataset.trigger);
		processTextSwitcherTrigger.call(trigger);
		trigger.addEventListener('change', processTextSwitcherTrigger);
	}

	var textSwitcherMasters = document.querySelectorAll('input[data-slave]');
	for (let i = textSwitcherMasters.length-1; i>-1; i--) {
		let master = textSwitcherMasters[i];
		processTextSwitcherTriggers.call(master);
		master.addEventListener('change', processTextSwitcherTriggers);
	}

	var subSettings = document.querySelectorAll('.sub-setting');
	for (let i = subSettings.length-1; i>-1; i--) {
		let master = $id(subSettings[i].dataset.master);
		processSubSettings.call(master);
		master.addEventListener('change', processSubSettings);
	}

	var optionInputs = document.querySelectorAll('.options-input');
	for (let i = optionInputs.length-1; i>-1; i--) {
		optionInputs[i].addEventListener('change', function () {
			let input = this,
				name = input.name,
				value = (input.type == 'radio')
					? document.querySelector(`input[name="${input.name}"]:checked`).value
					: input.checked;
			Options.save(`options.${name}`, value);
			sendMessage('rehighlight');
		});
	}

});

function processTextSwitcherTrigger () {
	var trigger = this,
		triggers
		switchers = document.querySelectorAll(`[data-trigger='${trigger.id}']`);
	for (let i = switchers.length-1; i>-1; i--) {
		let switcher = switchers[i];
		if (trigger.checked) {
			switcher.textContent = switcher.dataset.on;
		} else {
			switcher.textContent = switcher.dataset.off
		}
	}
}

function processTextSwitcherTriggers () {

	var master = this,
		slaveId = master.dataset.slave,
		slave = $id(slaveId),
		masters = document.querySelectorAll(`input[data-slave="${slaveId}"]`),
		allChecked = true;

	for (let i = masters.length-1; i>-1; i--) {
		let master = masters[i];
		if (!master.checked) {
			allChecked = false;
		}
	}

	slave.textContent = (allChecked) ? slave.dataset.on : slave.dataset.off;

}

function processSubSettings () {
	let master = this,
		isDisabled = (!master.checked),
		settingContainer = document.querySelector(`[data-master="${master.id}"]`),
		inputs = settingContainer.querySelectorAll('input');
	for (let i = inputs.length-1; i>-1; i--) {
		inputs[i].disabled = isDisabled;
	}
	settingContainer.classList.toggle('disabled', isDisabled);
}

function saveColor (trelloBg, colorName) {
	customDoingColors[ trelloBg ] = colorName;
	Options.save(`colors.current.${trelloBg}`, colorName);
	sendMessage('colorChange');
}

function saveCustomColor (trelloBg, hex) {
	customDoingColors[ trelloBg ] = hex;
	Options.save(`colors.custom.${trelloBg}`, hex);
	sendMessage('colorChange');
}


function sendMessage (message) {
	chrome.tabs.query({}, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{message: message},
			function (response) {}
		);
	});
}
