const EXTENSION_NAME = 'ListHighlighter';

const { src, dest, series, parallel, watch } = require('gulp');
const rename = require('gulp-rename');

const lastItem = process.argv[process.argv.length-1];
const forFirefox = (lastItem.includes('fx') || lastItem.includes('firefox'));

function done (cb) {
	const notify = require('node-notify');
	notify('Done');
	if (typeof cb == 'function') {
		cb();
	}
}

function compileOptionPage () {

	const Color = require(__dirname + '/Extension/js/classes/Color.js');
	const hbsAll = require('gulp-handlebars-all');
	const fs = require('fs-extra');

	const OriginalListBG = Color.getOriginalListBG();

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
		"normal"  : OriginalListBG,
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
		let isLight;
		if (Color.isHex(trelloHexes[name])) {
			isLight = Color.isLight(trelloHexes[name]);
		}
		trelloColors.push({
			name: name,
			hex: trelloHexes[name],
			blank: (name == 'blank'),
			photo: (name == 'photo'),
			lightClassName: (name == 'blank' || isLight)
				? 'mod-light-background'
				: ''
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
			newRuleDialogColor: (name != 'custom' && name != 'blank'),
			normal: (name == 'normal'),
			notNormal: (name != 'normal'),
			notBlank: (name != 'blank'),
			blank: (name == 'blank'),
			custom: (name == 'custom'),
			photo: (name == 'photo'),
			lightClassName: ((name == 'blank' || isLight) && name != 'normal')
				? 'mod-light-background'
				: ''
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
		originalListBG: hexes.normal,
		colors: colors,
		trelloColors: trelloColors,
		smallerTrelloButtons: smallerTrelloButtons
	}

	try { fs.unlinkSync('Extension/options-page/index.html'); } catch (e) {}

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

	const cmd = process.argv[2];
	const sass = require('gulp-sass')(require('node-sass'));
	const sourcemaps = require('gulp-sourcemaps');

	var options = {
		sourcemap : true,
		outputStyle : 'expanded',
		loadPath : parameters.loadPath,
		cache : '/tmp/sass-cache'
	};
	if (parameters.loadPath) {
		options.loadPath = parameters.loadPath;
	}

	if (cmd == 'release') {
		return src(parameters.input)
			.pipe(sass(options).on('error', sass.logError))
			.pipe(rename(parameters.output))
			.pipe(dest('Extension/css'));
	} else {
		return src(parameters.input)
			.pipe(sourcemaps.init())
			.pipe(sass(options).on('error', sass.logError))
			.pipe(rename(parameters.output))
			.pipe(sourcemaps.write('.'))
			.pipe(dest('Extension/css'));
	}
}

function compileAppleScript () {
	const shell = require('gulp-shell');
	console.log('If this fails, try opening Chrome. AppleScript is finicky and crap like that.');
	return src('.', {read: false})
		.pipe(shell([`osacompile -o ${__dirname}/chrome.scpt ${__dirname}/chrome.applescript`]));
}

function copyManifest () {
	const path = forFirefox ? 'manifest.v2.json' : 'manifest.v3.json';
	return src(path)
		.pipe(rename('manifest.json'))
		.pipe(dest('Extension'));
}

function copyAndProcessManifestIfNecessary () {
	if (forFirefox) {
		console.log('Including Firefox applications entry');
		const jeditor = require("gulp-json-editor");
		return src('manifest.v2.json')
			.pipe(jeditor({
				"applications": {
					"gecko": {
						"id": "ListHighlighter@example.com",
						"strict_min_version": "42.0"
					}
				}
			}))
			.pipe(rename('manifest.json'))
			.pipe(dest('Extension'));
	} else {
		return src('manifest.v3.json')
			.pipe(rename('manifest.json'))
			.pipe(dest('Extension'));
	}
}

function lhwatch () {
	watch(['manifest.v2.json', 'manifest.v3.json'], function() {
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
		src('manifest.v3.json')
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
	const shell = require('gulp-shell');
	watch(['scss/**/*.scss', 'options-page-html/**/*.hbs', 'Extension/js/**/*.js', 'manifest.json'], function() {
		compileAllCSS();
		compileOptionPage();
		copyManifest();
		done();
		return src('*.js', {read: false})
			.pipe(shell([`osascript ${__dirname}/chrome.scpt ${(options.refreshTrello)} ${(options.refreshOptions)} ${options.chromeKey};`]));
	});
}

function releaseZip () {

	const glob = require('glob');
	const fs = require('fs-extra');
	const zip = require('gulp-zip');

	const zipFileName = (forFirefox)
		? `${EXTENSION_NAME}-Firefox.zip`
		: `${EXTENSION_NAME}.zip`;

	glob('Extension/**/.*', {}, function (er, files) {
		for (let file of files) {
			console.log(`Removing: ${file}`);
			fs.unlinkSync(file);
		}
	});

	try { fs.emptyDirSync(`/tmp/${EXTENSION_NAME}`); } catch (err) { console.log(err); }
	try { fs.copySync('Extension', `/tmp/${EXTENSION_NAME}`); } catch (err) { console.log(err); }
	try { fs.removeSync(process.env.HOME+`/Desktop/${zipFileName}`) } catch (err) { console.log(err); }

	glob(`/tmp/${EXTENSION_NAME}/css/*.map`, {}, function (er, files) {
		for (let file of files) {
			console.log(`Removing: ${file}`);
			fs.unlinkSync(file);
		}
	});

	console.log('Run these commands to check your zip for lice');
	console.log(`zip -d ~/Desktop/${zipFileName} __MACOSX/\*`);
	console.log(`unzip -vl ~/Desktop/${zipFileName}`);

	return src(`/tmp/${EXTENSION_NAME}/**/*`)
		.pipe(zip(zipFileName))
		.pipe(dest(process.env.HOME+'/Desktop'));
}

exports.html = compileOptionPage;
exports.css = compileAllCSS;
exports.applescript = compileAppleScript;
exports.manifest = copyAndProcessManifestIfNecessary;

exports.default = series(compileOptionPage, compileAllCSS, copyAndProcessManifestIfNecessary, done);
exports.watch = series(compileOptionPage, compileAllCSS, copyAndProcessManifestIfNecessary, lhwatch);

exports.refresh = refresh;

exports.release = series(parallel(compileOptionPage, compileAllCSS, copyManifest), releaseZip);
