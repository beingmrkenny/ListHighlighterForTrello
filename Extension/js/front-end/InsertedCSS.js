class InsertedCSS {
	static backgroundColor(rule, className) {
		let cssRule = '';

		const selector =
			className == 'bmko_unmatched-list'
				? `.bmko_other_list_rules_applied .${className}[data-testid="list"]`
				: `.${className}.bmko_list_changed_background_color[data-testid="list"]`;
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
				buttonColorString = '',
				textShadow = 'none';

			if (changeTextColor) {
				const isLight = Color.isLight(rule.highlighting.color),
					color = isLight ? '#292929' : '#ffffff';
				colorString = `
					h2[data-testid="list-name"] button,
					[data-testid="list-footer"] button {
						color: ${color};
					}
				`;
				buttonColorString = `${selector} [data-testid="list-edit-menu-button"] { color: ${color}; }`;
				textShadow = isLight ? 'none' : '0 0 2px black';
			}

			cssRule = `${selector} {
				--list-background: ${rule.highlighting.color};
				--tr-background-list: ${rule.highlighting.color};
				--ds-shadow-raised: ${borderColor.toHex()};
				${colorString}
			}
			${buttonColorString}\n`;
		}

		return cssRule;
	}

	static opacity(rule, className) {
		let cssRule = '';
		const selector =
			className == 'bmko_unmatched-list'
				? `.${className}[data-testid="list"]`
				: `.${className}[data-testid="list"].bmko_list_opacity_applied`;
		if (rule.highlighting.opacity < 1) {
			cssRule = `${selector} {
				--opacity: ${rule.highlighting.opacity};
			}\n`;
		}
		return cssRule;
	}

	static strikethrough(rule) {
		let cssRule = '';
		if (rule.options.strikethrough) {
			cssRule = `[data-testid="list"].bmko_unmatched-list [data-testid="card-name"] {
				text-decoration: line-through;
			}\n`;
		}
		return cssRule;
	}

	static grayscale(rule) {
		let cssRule = '';
		if (rule.options.grayscale) {
			cssRule = `[data-testid="list"].bmko_unmatched-list {
				filter: grayscale(100%);
			}\n`;
		}
		return cssRule;
	}

	static generateRules() {
		const rules = Global.getAllRules();
		let unmatchedListCSSRules = '',
			cssRules = '';
		for (const id in rules) {
			const uid = rules[id].options.unmatchedLists;
			let className = 'bmko_' + id;
			cssRules += InsertedCSS.backgroundColor(rules[id], className);
			cssRules += InsertedCSS.opacity(rules[id], className);
			if (unmatchedListCSSRules == '' && rules?.[uid]?.enabled === true) {
				className = 'bmko_unmatched-list';
				unmatchedListCSSRules += InsertedCSS.backgroundColor(
					rules[uid],
					className
				);
				unmatchedListCSSRules += InsertedCSS.opacity(rules[uid], className);
				unmatchedListCSSRules += InsertedCSS.strikethrough(rules[uid]);
				unmatchedListCSSRules += InsertedCSS.grayscale(rules[uid]);
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

	static removeRules() {
		const style = qid('BMKO_RuleCSS');
		if (style) {
			style.remove();
		}
	}
}
