// v1 is the first major format of options; v2 was the next upgrade; v3 was skipped to match this v4

class DoingColors {
	constructor(colors) {
		this.currentDoingColors = colors.current;
		this.customDoingColors = colors.custom;
	}

	getDefaultHex() {
		var hex,
			colorName = this.currentDoingColors['default']; // the name of a predefined color, like red, blue, green etc.

		if (colorName == 'custom') {
			hex = this.getCustomHexForTrelloBg('default');
		} else {
			hex = this.getHexFromName(colorName);
		}

		return hex;
	}

	getCustomHexForTrelloBg(trelloBg) {
		var hex = null;

		if (Color.isHex(this.customDoingColors[trelloBg])) {
			hex = this.customDoingColors[trelloBg];
		} else {
			hex = this.getHexFromName('gray');
		}

		return hex;
	}

	getHexFromName(colorName) {
		var hex,
			colors = {
				red: '#ec2f2f',
				orange: '#ffab4a',
				yellow: '#f2d600',
				green: '#61bd4f',
				cyan: '#0ed4f3',
				blue: '#00a2ff',
				indigo: '#30458a',
				violet: '#ba55e2',
				pink: '#ff80ce',
				black: '#000000',
				gray: OriginalListBG,
			};

		if (colorName == 'default') {
			hex = this.getDefaultHex();
		} else {
			hex = colors.hasOwnProperty(colorName) ? colors[colorName] : null;
		}

		return hex;
	}
}

class StorageLegacy {
	static updateIfNecessary(results) {
		results = StorageLegacy.removeObsolete(results);

		// results.version is a de facto check for v4
		if (results.version) {
			return results;
		}

		var resave = false;

		// "v1" colors format to "v2" colors format
		if (results.colors) {
			for (let bg in results.colors.current) {
				results[`colors.current.${bg}`] = results.colors.current[bg];
			}
			for (let bg in results.colors.custom) {
				results[`colors.custom.${bg}`] = results.colors.custom[bg];
			}
			delete results.colors;
			resave = true;
		}

		// "v1" options format to "v2" options format
		if (results.options) {
			for (let opt in results.options) {
				results[`options.${opt}`] = results.options[opt];
			}
			delete results.options;
			resave = true;
		}

		// results.version is a de facto check for v4
		if (!results.version) {
			let rulesExist = false;
			for (let propName in results) {
				if (propName.startsWith('rule-')) {
					rulesExist = true;
					break;
				}
			}

			if (rulesExist === false) {
				let rules = StorageLegacy.makeRulesFromV2Options(results);
				for (let ruleId in rules) {
					results[ruleId] = rules[ruleId];
					resave = true;
				}
			}

			var v4Options = StorageLegacy.mapV2OptionsToV4Options(results);
			for (let key in v4Options) {
				results[key] = v4Options[key];
				resave = true;
			}

			results.version = 4;
		}

		if (resave === true) {
			chrome.storage.sync.set(results);
		}

		results = StorageLegacy.removeObsolete(results);

		return results;
	}

	static removeObsolete(results) {
		let namesToRemove = [];
		for (let propName in results) {
			if (DataStorage.isKeyNameAllowed(propName) === false) {
				delete results[propName];
				namesToRemove.push(propName);
			}
		}
		if (namesToRemove.length) {
			chrome.storage.sync.remove(namesToRemove);
		}
		return results;
	}

	static processColors(results) {
		var colors = { current: {}, custom: {} };
		for (let propName in results) {
			if (propName.startsWith('colors.custom.')) {
				colors.custom[propName.replace('colors.custom.', '')] =
					results[propName];
			}
			if (propName.startsWith('colors.current.')) {
				colors.current[propName.replace('colors.current.', '')] =
					results[propName];
			}
		}
		return colors;
	}

	static oldDefaults(prefix = false, version) {
		var oldDefaults = {
			v2: {
				'colors.current.default': 'red',
				'colors.current.blue': null,
				'colors.current.orange': null,
				'colors.current.green': null,
				'colors.current.red': null,
				'colors.current.purple': null,
				'colors.current.pink': null,
				'colors.current.lime': null,
				'colors.current.sky': null,
				'colors.current.gray': null,
				'colors.current.photo': null,

				'colors.custom.default': null,
				'colors.custom.blue': null,
				'colors.custom.orange': null,
				'colors.custom.green': null,
				'colors.custom.red': null,
				'colors.custom.purple': null,
				'colors.custom.pink': null,
				'colors.custom.lime': null,
				'colors.custom.sky': null,
				'colors.custom.gray': null,
				'colors.custom.photo': null,

				'options.HighlightTags': true,
				'options.HideHashtags': true,
				'options.HighlightTitles': true,
				'options.MatchTitleSubstrings': false,

				'options.UndimOnHover': true,
				'options.DimUntaggedHigh': false,
				'options.DimUntaggedNormal': true,
				'options.DimmingLow': '0.45',
				'options.DimmingDone': '0.25',

				'options.EnableWIP': false,
				'options.CountAllCards': false,
				'options.EnablePointsOnCards': false,
				'options.HideManualCardPoints': false,

				'options.EnableHeaderCards': false,
				'options.HeaderCardsExtraSpace': false,
				'options.EnableSeparatorCards': false,
				'options.SeparatorCardsVisibleLine': false,

				recentColors: [],
				colorBlindFriendlyMode: null,
			},
		};

		if (prefix) {
			for (let key of Object.keys(oldDefaults[version])) {
				if (!key.startsWith(prefix)) {
					delete oldDefaults[version][key];
				}
			}
		}

		return oldDefaults[version];
	}

	static fillBlanksWithDefaults(results) {
		var defaults = StorageLegacy.oldDefaults('options', 'v2');
		for (let key of Object.keys(defaults)) {
			if (results.hasOwnProperty(key) === false) {
				results[key] = defaults[key];
				chrome.storage.sync.set({ [key]: defaults[key] });
			}
		}
		return results;
	}

	static mapV2OptionsToV4Options(v2Options) {
		var v4Options = {},
			v2toV4 = {
				'options.HighlightTags': null,
				'options.HighlightTitles': null,
				'options.MatchTitleSubstrings': null,
				'options.DimUntaggedHigh': null,
				'options.DimUntaggedNormal': null,
				'options.DimmingLow': null,
				'options.DimmingDone': null,
				'options.HideHashtags': 'options-HighlightHideHashtags',
				'options.UndimOnHover': 'options-HighlightUndimOnHover',
				'options.EnableWIP': 'options-CountEnableWIP',
				'options.CountAllCards': 'options-CountAllCards',
				'options.EnablePointsOnCards': 'options-CountEnablePointsOnCards',
				'options.HideManualCardPoints': 'options-CountHideManualCardPoints',
				'options.EnableHeaderCards': 'options-OrganisingEnableHeaderCards',
				'options.HeaderCardsExtraSpace':
					'options-OrganisingHeaderCardsExtraSpace',
				'options.EnableSeparatorCards':
					'options-OrganisingEnableSeparatorCards',
				'options.SeparatorCardsVisibleLine':
					'options-OrganisingSeparatorCardsVisibleLine',
			};

		for (let v2Key in v2Options) {
			let v4Key = v2toV4[v2Key];
			if (v4Key) {
				v4Options[v4Key] = v2Options[v2Key];
			}
		}

		return v4Options;
	}

	static processV2Options(results) {
		var options = {};
		results = StorageLegacy.fillBlanksWithDefaults(results, 'v2');
		for (let propName in results) {
			// NOTE: If we ever change the format again, the dot syntax may need to be updated
			if (propName.startsWith('options.')) {
				options[propName.replace('options.', '')] = results[propName];
			}
		}
		return options;
	}

	static makeRulesFromV2Options(results) {
		// NOTE This updates from "v2" to "v4" — expects results to be in a v2 format

		var defaultHighlightColour,
			exceptions = {},
			colors = StorageLegacy.processColors(results),
			doingColors = new DoingColors(colors);

		for (let trelloBG in colors.current) {
			let hex,
				value = colors.current[trelloBG];

			if (Color.isHex(value)) {
				hex = value;
			} else if (value == 'custom') {
				hex = doingColors.getCustomHexForTrelloBg(trelloBG);
			} else {
				hex = doingColors.getHexFromName(value);
			}

			if (hex) {
				if (trelloBG == 'default') {
					defaultHighlightColour = hex;
				} else {
					exceptions[trelloBG] = hex;
				}
			}
		}

		var options = StorageLegacy.processV2Options(results);

		var highlightTags =
				options.hasOwnProperty('HighlightTags') &&
				options.HighlightTags == true,
			highlightTitles =
				options.hasOwnProperty('HighlightTitles') &&
				options.HighlightTitles == true,
			matchTitleSubstrings =
				options.hasOwnProperty('MatchTitleSubstrings') &&
				options.MatchTitleSubstrings == true,
			dimUntaggedNormal =
				options.hasOwnProperty('DimUntaggedNormal') &&
				options.DimUntaggedNormal == true,
			dimUntaggedHigh =
				options.hasOwnProperty('DimUntaggedHigh') &&
				options.DimUntaggedHigh == true,
			dimmingLow = options.hasOwnProperty('DimmingLow')
				? options.DimmingLow
				: 1,
			dimmingDone = options.hasOwnProperty('DimmingDone')
				? options.DimmingDone
				: 1;

		var highContains = [],
			normalContains = [],
			trashContains = [];

		if (highlightTags) {
			highContains.push('#high');
			highContains.push('#doing');
			highContains.push('#today');
			normalContains.push('#normal');
			normalContains.push('#todo');
			normalContains.push('#to do');
			trashContains.push('#trash');
			trashContains.push('#done');
		}

		if (highlightTitles && matchTitleSubstrings) {
			highContains.push('doing');
			highContains.push('today');
			normalContains.push('todo');
			normalContains.push('to do');
			trashContains.push('trash');
			trashContains.push('done');
		}

		var rules = {
			'rule-todo': {
				name: 'Todo',
				sort: 0,
				is: highlightTitles && !matchTitleSubstrings ? ['Todo', 'To do'] : [],
				contains: normalContains,
				highlighting: {
					color: null,
					opacity: 1,
					exceptions: {},
				},
				options: dimUntaggedNormal ? { unmatchedLists: 'rule-low' } : {},
				enabled: highlightTitles || highlightTags,
			},

			'rule-doing': {
				name: 'Doing',
				sort: 1,
				is: highlightTitles && !matchTitleSubstrings ? ['Doing', 'Today'] : [],
				contains: highContains,
				highlighting: {
					color: defaultHighlightColour,
					opacity: 1,
					exceptions: exceptions,
				},
				options: dimUntaggedHigh ? { unmatchedLists: 'rule-low' } : {},
				enabled: highlightTitles || highlightTags,
			},

			'rule-done': {
				name: 'Done',
				sort: 2,
				is: highlightTitles && !matchTitleSubstrings ? ['Done', 'Trash'] : [],
				contains: trashContains,
				highlighting: {
					color: null,
					opacity: dimmingDone,
					exceptions: {},
				},
				options: { strikethrough: true, grayscale: true },
				enabled: highlightTitles || highlightTags,
			},

			'rule-low': {
				name: 'Low Priority',
				sort: 3,
				is: [],
				contains: ['#low'],
				highlighting: {
					color: null,
					opacity: dimmingLow,
					exceptions: {},
				},
				options: {},
				enabled: highlightTags,
			},

			'rule-ignore': {
				name: 'Ignore',
				sort: 4,
				is: [],
				contains: ['#ignore'],
				highlighting: {
					color: null,
					opacity: dimmingDone,
					exceptions: {},
				},
				options: { grayscale: true },
				enabled: highlightTags,
			},
		};

		return rules;
	}
}
