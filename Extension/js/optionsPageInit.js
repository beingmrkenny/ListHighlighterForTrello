OptionsPage.setupDialogs();
listen(qq('.standard-options div'), 'click', OptionsPage.checkInputOnClick);
listen(qid('NewRuleButton'), 'click', OptionsPage.openNewRuleForm);

DataStorage.initialise(function (results) {
	document.body.classList.toggle(
		'color-blind-friendly-mode',
		results.colorBlindFriendlyMode
	);
	OptionsPage.setValuesOnInputs(results);
	RulesTable.build(results);
	OptionsPage.setupSaveOptionsOnChange();
	OptionsPage.processAllControllingInputs();
	chrome.storage.onChanged.addListener((changes, namespace) => {
		for (let key in changes) {
			var storageChange = changes[key];
			if (key.startsWith('rule-')) {
				if (!storageChange.newValue) {
					RulesTable.deleteRow(key);
				} else {
					if (q(`tr[data-rule="${key}"]`)) {
						if (
							storageChange.newValue.enabled ===
							storageChange?.oldValue?.enabled
						) {
							RulesTable.updateRow(key);
						}
					} else {
						let rulesTableTR = new RulesTableTR(storageChange.newValue);
						q('.highlighting-table tbody').appendChild(
							rulesTableTR.getTR(true)
						);
					}
				}
			}
		}
	});
	setTimeout(function () {
		document.body.classList.remove('preload');
	}, 0);
});
