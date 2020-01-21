const { src, dest, series, parallel, watch } = require('gulp');
const rename = require('gulp-rename');

function compileOptionPage () {

	const Color = require(__dirname + '/Extension/js/classes/Color.js');
	const hbsAll = require('gulp-handlebars-all');

	const trelloHexes = {
		"blank"  : null,
		"red"    : "#b04632",
		"orange" : "#d29034",
		"lime"   : "#4bbf6b",
		"green"  : "#519839",
		"sky"    : "#00aecc",
		"blue"   : "#0779bf",
		"purple" : "#89609e",
		"pink"   : "#cd5a91",
		"gray"   : "#838c91",
		"photo"  : "#838c91"
	};

	const hexes = {
		"blank"   : null,
		"red"     : "#ec2f2f",
		"orange"  : "#ffab4a",
		"yellow"  : "#f2d600",
		"green"   : "#61bd4f",
		"cyan"    : "#0ed4f3",
		"blue"    : "#00a2ff",
		"indigo"  : "#30458a",
		"violet"  : "#ba55e2",
		"pink"    : "#ff80ce",
		"black"   : "#000000",
		"normal"  : "#e2e4e6",
		"custom"  : ""
	};

	const partials = [
		'options-page-html/includes/highlighting.section.hbs',
		'options-page-html/includes/dimming.section.hbs',
		'options-page-html/includes/cardCounting.section.hbs',
		'options-page-html/includes/organising.section.hbs',
		'options-page-html/includes/templateTags.template.hbs',
		'options-page-html/includes/listHighlightColor.template.hbs',
		'options-page-html/includes/colorPicker.template.hbs'
	];

	var trelloColors = [];
	for (let name in trelloHexes) {
		let color = new Color(trelloHexes[name]);
		trelloColors.push({
			name: name,
			hex: trelloHexes[name],
			blank: (name == 'blank'),
			photo: (name == 'photo'),
			lightClassName: (color.isLight() || name == 'blank') ? 'mod-light-background' : ''
		});
	}

	var colors = [];
	for (let name in hexes) {
		let color = new Color(hexes[name]);
		colors.push({
			name: name,
			hex: hexes[name],
			newRuleDialogColor: (name != 'custom' && name != 'blank'),
			normal: (name == 'normal'),
			notBlank: (name != 'blank'),
			blank: (name == 'blank'),
			custom: (name == 'custom'),
			photo: (name == 'photo'),
			lightClassName: (color.isLight() || name == 'blank') ? 'mod-light-background' : ''
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
		{ color: trelloHexes.gray, title: 'Trello gray' }
	];

	var templateData = {
		colors: colors,
		trelloColors: trelloColors,
		smallerTrelloButtons: smallerTrelloButtons
	}

	if (process.argv[process.argv.length-1].includes('fx')) {
		console.log('Including dialog polyfill for Firefox');
		templateData.dialogPolyfill = true;
	}

	return src('options-page-html/Options.hbs')
		.pipe(hbsAll('html', {
			context: templateData,
			partials: partials
		}))
		.pipe(rename('index.html'))
		.pipe(dest('Extension/options-page'));

}

function compileAllCSS (cb) {

	compileCSS ({
	   loadPath: 'scss/injected',
	   input: 'scss/injected/init.scss',
	   output: 'style.css'
	});

	compileCSS ({
		input: 'scss/popup.scss',
		output: 'popup.css'
	});

	compileCSS ({
		input: 'scss/options.scss',
		output: 'options.css',
		loadPath: 'scss'
	});

	if (typeof cb == 'function') {
		cb();
	}

}

function compileCSS (parameters) {
	const sass = require('gulp-sass');
	sass.compiler = require('node-sass');

	var options = {
		// sourcemap : true,
		outputStyle : 'expanded',
		loadPath : parameters.loadPath,
		cache : '/tmp/sass-cache'
	};
	if (parameters.loadPath) {
		options.loadPath = parameters.loadPath;
	}
	return src(parameters.input)
	  .pipe(sass(options).on('error', sass.logError))
	  .pipe(rename(parameters.output))
	  .pipe(dest('Extension/css'));
}

function compileAppleScript () {
	const shell = require('gulp-shell');
	console.log('If this fails, try opening Chrome. AppleScript is finicky and crap like that.');
	return src('.', {read: false})
		.pipe(shell([`osacompile -o ${__dirname}/chrome.scpt ${__dirname}/chrome.applescript`]));
}

function copyManifest () {
	return src('manifest.json')
		.pipe(dest('Extension'));
}

function copyAndProcessManifestIfNecessary () {

	if (process.argv[process.argv.length-1].includes('fx')) {

		console.log('Including Firefox applications entry');

		const jeditor = require("gulp-json-editor");

		return src('manifest.json')
			.pipe(jeditor({
				"applications": {
					"gecko": {
						"id": "ListHighlighter@example.com",
						"strict_min_version": "42.0"
					}
				}
			}))
			.pipe(dest('Extension'));
	} else {
		return src('manifest.json')
			.pipe(dest('Extension'));
	}
}

function lhwatch () {
	watch(['manifest.json'], function() {
		copyManifest();
	});
	watch(['scss/**/*.scss'], function(cb) {
		compileAllCSS(cb);
	});
	watch(['options-page-html/**/*.hbs'], function(cb) {
		compileOptionPage();
		cb();
	});
}

async function refresh () {

	const prompt = require('gulp-prompt');
	const fs = require('fs-extra');

	var options = {
			refreshOptions : false,
			refreshTrello : false,
			chromeKey : ''
		},
		refreshChromeKey = false;

	for (let arg of process.argv) {
		if (arg == '-options') {
			options.refreshOptions = true;
		}
		if (arg == '-trello') {
			options.refreshTrello = true;
		}
		if (arg == '-newkey') {
			refreshChromeKey = true;
		}
	}

	if (!options.refreshOptions && !options.refreshTrello) {
		console.log('Please specify -trello, -options or both');
		return;
	}

	if (refreshChromeKey) {
		try { fs.unlinkSync('/tmp/chromeKey'); } catch (err) { }
	}

	try { options.chromeKey = fs.readFileSync('/tmp/chromeKey'); } catch (err) { }

	if (!options.chromeKey && options.refreshOptions) {
		src('manifest.json')
			.pipe(prompt.prompt({
				type: 'input',
				name: 'chromeKey',
				message: 'Enter the extension key for Chrome'
			}, result => {
				fs.writeFileSync('/tmp/chromeKey', result.chromeKey);
				options.chromeKey = result.chromeKey;
				watchCommand(options);
			}));
	} else {
		watchCommand(options);
	}

}

function watchCommand (options) {
	const notify = require('node-notify');
	const shell = require('gulp-shell');
	watch(['scss/**/*.scss', 'options-page-html/**/*.hbs', 'Extension/js/**/*.js', 'manifest.json'], function() {
		compileAllCSS();
		compileOptionPage();
		copyManifest();
		notify('Done');
		return src('*.js', {read: false})
			.pipe(shell([`osascript ${__dirname}/chrome.scpt ${(options.refreshTrello)} ${(options.refreshOptions)} ${options.chromeKey};`]));
	});
}

function releaseZip () {

	const glob = require('glob');
	const fs = require('fs-extra');
	const zip = require('gulp-zip');

	// remove dot files - could make this remove .DS_Store
	glob('Extension/**/.*', {}, function (er, files) {
		for (let file of files) {
			console.log(`Removing: ${file}`);
			fs.unlinkSync(file);
		}
	});

	try { fs.removeSync('/tmp/ListHighlighter') } catch (err) { console.log(err); }
	fs.copySync('Extension', '/tmp/ListHighlighter');
	try { fs.removeSync(process.env.HOME+'/Desktop/ListHighlighter.zip') } catch (err) { console.log(err); }

	console.log('Run these commands to check your zip for lice');
	console.log('zip -d ~/Desktop/ListHighlighter.zip __MACOSX/\*');
	console.log('unzip -vl ~/Desktop/ListHighlighter.zip');

	return src('/tmp/ListHighlighter/**/*')
		.pipe(zip('ListHighlighter.zip'))
		.pipe(dest(process.env.HOME+'/Desktop'));
}

exports.html = compileOptionPage;
exports.css = compileAllCSS;
exports.applescript = compileAppleScript;
exports.manifest = copyAndProcessManifestIfNecessary;

exports.default = series(compileOptionPage, compileAllCSS, copyAndProcessManifestIfNecessary);
exports.watch = series(compileOptionPage, compileAllCSS, copyAndProcessManifestIfNecessary, lhwatch);

exports.refresh = refresh;

exports.release = series(parallel(compileOptionPage, compileAllCSS, copyManifest), releaseZip);