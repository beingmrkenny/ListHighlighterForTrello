exports.compileHTML = () => {
	const Color = require('../Extension/js/classes/Color.js');
	const Handlebars = require('handlebars');
	const fs = require('fs-extra');

	const OriginalListBG = Color.getOriginalListBG();

	const trelloHexes = {
		blank: null,
		red: '#b04632',
		orange: '#d29034',
		lime: '#4bbf6b',
		green: '#519839',
		sky: '#00aecc',
		blue: '#0779bf',
		purple: '#89609e',
		pink: '#cd5a91',
		gray: '#838c91',
		photo: '#838c91',
	};

	const hexes = {
		blank: null,
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
		normal: OriginalListBG,
		custom: '',
	};

	var trelloColors = [];
	for (let name in trelloHexes) {
		let isLight;
		if (Color.isHex(trelloHexes[name])) {
			isLight = Color.isLight(trelloHexes[name]);
		}
		trelloColors.push({
			name: name,
			hex: trelloHexes[name],
			blank: name == 'blank',
			photo: name == 'photo',
			lightClassName: name == 'blank' || isLight ? 'mod-light-background' : '',
		});
	}

	var colors = [];
	for (let name in hexes) {
		let isLight;
		if (Color.isHex(hexes[name])) {
			isLight = Color.isLight(hexes[name]);
		}
		colors.push({
			name: name,
			hex: hexes[name],
			newRuleDialogColor: name != 'custom' && name != 'blank',
			normal: name == 'normal',
			notNormal: name != 'normal',
			notBlank: name != 'blank',
			blank: name == 'blank',
			custom: name == 'custom',
			photo: name == 'photo',
			lightClassName:
				(name == 'blank' || isLight) && name != 'normal'
					? 'mod-light-background'
					: '',
		});
	}

	var smallerTrelloButtons = [
		{ color: hexes.red, title: 'Red' },
		{ color: hexes.orange, title: 'Orange' },
		{ color: hexes.yellow, title: 'Yellow' },
		{ color: hexes.green, title: 'Green' },
		{ color: hexes.cyan, title: 'Cyan' },
		{ color: hexes.blue, title: 'Blue' },
		{ color: hexes.indigo, title: 'Indigo' },
		{ color: hexes.violet, title: 'Violet' },
		{ color: hexes.pink, title: 'Pink' },
		{ color: hexes.black, title: 'Black' },
		{ color: trelloHexes.red, title: 'Trello red' },
		{ color: trelloHexes.orange, title: 'Trello orange' },
		{ color: hexes.normal, title: 'Trello normal list color' },
		{ color: trelloHexes.lime, title: 'Trello lime' },
		{ color: trelloHexes.green, title: 'Trello green' },
		{ color: trelloHexes.sky, title: 'Trello sky' },
		{ color: trelloHexes.blue, title: 'Trello blue' },
		{ color: trelloHexes.purple, title: 'Trello purple' },
		{ color: trelloHexes.pink, title: 'Trello pink' },
		{ color: trelloHexes.gray, title: 'Trello gray' },
	];

	[
		'options-page-html/includes/templateTags.template.hbs',
		'options-page-html/includes/listHighlightColor.template.hbs',
		'options-page-html/includes/colorPicker.template.hbs',
	].forEach((path) => {
		Handlebars.registerPartial(
			path.replace('options-page-html/includes/', '').replace('.hbs', ''),
			fs.readFileSync(path, 'utf8')
		);
	});
	try {
		fs.emptyDirSync('Extension/options-page/');
	} catch (e) {}
	const template = Handlebars.compile(
		fs.readFileSync('options-page-html/Options.hbs', 'utf8')
	);
	fs.writeFileSync(
		'Extension/options-page/index.html',
		template({
			originalListBG: hexes.normal,
			colors: colors,
			trelloColors: trelloColors,
			smallerTrelloButtons: smallerTrelloButtons,
		})
	);
};

exports.compileHTML();
