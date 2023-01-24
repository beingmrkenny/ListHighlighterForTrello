class InsertedCSS {

	static backgroundColor (rule, className) {

		let cssRule = '';

		const selector = (className == 'bmko_unmatched-list')
				? `.bmko_other_list_rules_applied .${className}.list`
				: `.${className}.bmko_list_changed_background_color.list`;
		const changeTextColor = Global.getItem('options-HighlightChangeTextColor');

		if (rule.highlighting.color) {

			const backgroundColor = new Color(rule.highlighting.color),
				borderColor = new Color();

			borderColor.fromHSL(
				backgroundColor.getHue(),
				backgroundColor.getSaturation() * 0.7,
				49
			);

			let colorString = '',
				textShadow = 'none';

			if (changeTextColor) {
				const isLight = Color.isLight(rule.highlighting.color),
					color = (isLight ? '#292929' : '#ffffff');
				colorString = `--color: ${color};`
				textShadow = (isLight)
					? 'none'
					: '0 0 2px black';
			}

			cssRule = `${selector} {
				--background-color: ${rule.highlighting.color};
				${colorString}
				--border-color: ${borderColor.toHex()};
			}\n`;

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

		let cssRule = '';
		const selector = (className == 'bmko_unmatched-list')
				? `.${className}.list`
				: `.${className}.bmko_list_changed_background_color`;

		if (rule.highlighting.exceptions) {

			for (const trelloBg in rule.highlighting.exceptions) {

				const backgroundColor = new Color(rule.highlighting.exceptions[trelloBg]),
					borderColor = new Color(),
					changeTextColor = Global.getItem('options-HighlightChangeTextColor');

				borderColor.fromHSL(
					backgroundColor.getHue(),
					backgroundColor.getSaturation() * 0.7,
					49
				);

				let colorString = '',
					textShadow = 'none';

				if (changeTextColor) {
					const isLight = Color.isLight(rule.highlighting.color),
						color = (isLight ? '#292929' : '#ffffff');
					colorString = `--color: ${color};`
					textShadow = (isLight)
						? 'none'
						: '0 0 2px black';
				}

				cssRule += `.bmko_trello-background-type_${trelloBg} ${selector} {
					--background-color: ${rule.highlighting.exceptions[trelloBg]};
					${colorString}
					--border-color: ${borderColor.toHex()};
				}\n`;

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
		let cssRule = '';
		const selector = (className == 'bmko_unmatched-list')
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
		const rules = Global.getAllRules();
		let unmatchedListCSSRules = '',
			cssRules = '';
		for (const id in rules) {
			const uid = rules[id].options.unmatchedLists;
			let className = 'bmko_'+id;
			cssRules += InsertedCSS.backgroundColor(rules[id], className);
			cssRules += InsertedCSS.exceptionBackgroundColor(rules[id], className);
			cssRules += InsertedCSS.opacity(rules[id], className);
			if (unmatchedListCSSRules == '' && rules?.[uid]?.enabled === true) {
				className = 'bmko_unmatched-list';
				unmatchedListCSSRules += InsertedCSS.backgroundColor(rules[uid], className);
				unmatchedListCSSRules += InsertedCSS.exceptionBackgroundColor(rules[uid], className);
				unmatchedListCSSRules += InsertedCSS.opacity(rules[uid], className);
			}
		}
		let style = qid('BMKO_RuleCSS');
		if (!style) {
			style = document.createElement('style');
			style.id = 'BMKO_RuleCSS';
			document.head.appendChild(style);
		}
		style.textContent = cssRules + unmatchedListCSSRules;
	}

	static removeRules () {
		const style = qid('BMKO_RuleCSS');
		if (style) {
			style.remove();
		}
	}

}
