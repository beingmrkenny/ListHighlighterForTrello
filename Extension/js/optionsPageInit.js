OptionsPage.showPanel();
OptionsPage.setupDialogs();
listen(window, 'hashchange', OptionsPage.showPanel);
listen(qq('.standard-options div'), 'click', OptionsPage.checkInputOnClick);
listen(qid('NewRuleButton'), 'click', OptionsPage.openNewRuleForm);
listen(qid('ResetNormalListColor'), 'click', (event) => {
	event.stopPropagation();
	chrome.storage.sync.set( { 'options-HighlightNormalListColor': null } );
	OptionsPage.insertNormalListColorsInDom(Color.getOriginalListBG());
});

DataStorage.initialise(function (results) {
	document.body.classList.toggle('color-blind-friendly-mode', (results.colorBlindFriendlyMode));
	OptionsPage.setupDefaultListBGColor(results);
	OptionsPage.setValuesOnInputs(results);
	RulesTable.build(results);
	OptionsPage.setupSaveOptionsOnChange();
	OptionsPage.processAllControllingInputs();
	chrome.storage.onChanged.addListener( (changes, namespace) => {
		for (let key in changes) {
			var storageChange = changes[key];
			if (key.startsWith('rule-')) {
				if (!storageChange.newValue) {
					RulesTable.deleteRow(key);
				} else {
					if (q(`tr[data-rule="${key}"]`)) {
						if (storageChange.newValue.enabled === ovalue(storageChange, 'oldValue', 'enabled')) {
							RulesTable.updateRow(key)
						}
					} else {
						let rulesTableTR = new RulesTableTR(storageChange.newValue);
						q('.highlighting-table tbody').appendChild(rulesTableTR.getTR(true));
					}
				}
			}
		}
	});
	setTimeout(function () {
		document.body.classList.remove('preload');
	}, 0);
});
