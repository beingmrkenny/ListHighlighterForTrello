class InsertedCSS {

	static backgroundColor (rule, className) {
		let cssRule = '',
			selector = (className == 'bmko_unmatched-list')
				? `.${className}.list`
				: `.${className}.bmko_list_changed_background_color.list`;
		if (rule.highlighting.color) {
			let isLight = Color.isLight(rule.highlighting.color),
				color = (isLight ? '#292929' : '#ffffff'),
				backgroundColor = new Color(rule.highlighting.color),
				borderColor = new Color();

			borderColor.fromHSL(
				backgroundColor.getHue(),
				backgroundColor.getSaturation() * 0.7,
				49
			);

			cssRule = `${selector} {
				--background-color: ${rule.highlighting.color};
				--color: ${color};
				--border-color: ${borderColor.toHex()};
			}\n`;

			let textShadow = (isLight)
				? 'none'
				: '0 0 2px black';

			cssRule += `
				#trello-root.body-color-blind-mode-enabled ${selector} .list-header-name:not(.is-editing),
				#trello-root.body-color-blind-mode-enabled ${selector} .list-header-extras,
				#trello-root.body-color-blind-mode-enabled ${selector} .bmko_list-limit-notice,
				#trello-root.body-color-blind-mode-enabled ${selector} .open-card-composer,
				#trello-root.body-color-blind-mode-enabled ${selector} .card-templates-button-container a,
				#trello-root.body-color-blind-mode-enabled ${selector} .bmko_header-card h3,
				#trello-root.body-color-blind-mode-enabled ${selector} .placeholder {
					text-shadow: ${textShadow};
				}\n`;
		}
		return cssRule;
	}

	static exceptionBackgroundColor (rule, className) {
		let cssRule = '',
			selector = (className == 'bmko_unmatched-list')
				? `.${className}.list`
				: `.${className}.bmko_list_changed_background_color`;
		if (rule.highlighting.exceptions) {
			for (let trelloBg in rule.highlighting.exceptions) {
				let isLight = Color.isLight(rule.highlighting.exceptions[trelloBg]),
					color = isLight ? '#292929' : '#ffffff',
					backgroundColor = new Color(rule.highlighting.exceptions[trelloBg]),
					borderColor = new Color();
				borderColor.fromHSL(
					backgroundColor.getHue(),
					backgroundColor.getSaturation() * 0.7,
					49
				);
				cssRule += `.bmko_trello-background-type_${trelloBg} ${selector} {
					--background-color: ${rule.highlighting.exceptions[trelloBg]};
					--color: ${color};
					--border-color: ${borderColor.toHex()};
				}\n`;

				let textShadow = (isLight)
					? 'none'
					: '0 0 2px black';

				cssRule += `
					#trello-root.body-color-blind-mode-enabled.bmko_trello-background-type_${trelloBg} ${selector} .list-header-name,
					#trello-root.body-color-blind-mode-enabled.bmko_trello-background-type_${trelloBg} ${selector} .list-header-extras,
					#trello-root.body-color-blind-mode-enabled.bmko_trello-background-type_${trelloBg} ${selector} .bmko_list-limit-notice,
					#trello-root.body-color-blind-mode-enabled.bmko_trello-background-type_${trelloBg} ${selector} .card-templates-button-container a,
					#trello-root.body-color-blind-mode-enabled.bmko_trello-background-type_${trelloBg} ${selector} .bmko_header-card h3,
					#trello-root.body-color-blind-mode-enabled.bmko_trello-background-type_${trelloBg} ${selector} .placeholder {
						text-shadow: ${textShadow};
				  	}\n`;
			}
		}
		return cssRule;
	}

	static opacity (rule, className) {
		let cssRule = '',
			selector = (className == 'bmko_unmatched-list')
				? `.${className}.list`
				: `.${className}.list.bmko_list_opacity_applied`;
		if (rule.highlighting.opacity < 1) {
			cssRule = `${selector} {
				--opacity: ${rule.highlighting.opacity};
			}\n`;
		}
		return cssRule;
	}

	static generateRules () {
		var rules = Global.getAllRules(),
			unmatchedListCSSRules = '',
			cssRules = '';
		for (let id in rules) {
			let uid = rules[id].options.unmatchedLists,
				className = 'bmko_'+id;
			cssRules += InsertedCSS.backgroundColor(rules[id], className);
			cssRules += InsertedCSS.exceptionBackgroundColor(rules[id], className);
			cssRules += InsertedCSS.opacity(rules[id], className);
			if (unmatchedListCSSRules == '' && rules[uid]) {
				className = 'bmko_unmatched-list';
				unmatchedListCSSRules += InsertedCSS.backgroundColor(rules[uid], className);
				unmatchedListCSSRules += InsertedCSS.exceptionBackgroundColor(rules[uid], className);
				unmatchedListCSSRules += InsertedCSS.opacity(rules[uid], className);
			}
		}
		var style = qid('BMKO_RuleCSS');
		if (!style) {
			style = document.createElement('style');
			style.id = 'BMKO_RuleCSS';
			document.head.appendChild(style);
		}
		style.textContent = cssRules + unmatchedListCSSRules;
	}

	static removeRules () {
		var style = qid('BMKO_RuleCSS');
		if (style) {
			style.remove();
		}
	}

}
