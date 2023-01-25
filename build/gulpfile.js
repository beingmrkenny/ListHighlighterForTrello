const EXTENSION_NAME = 'ListHighlighter';

const lastItem = process.argv[process.argv.length-1];
var forFirefox = (lastItem.includes('fx') || lastItem.includes('firefox'));

function compileAppleScript () {
	const shell = require('gulp-shell');
	console.log('If this fails, try opening Chrome. AppleScript is finicky and crap like that.');
	return src('.', {read: false})
		.pipe(shell([`osacompile -o ${__dirname}/chrome.scpt ${__dirname}/chrome.applescript`]));
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

exports.default = series(compileOptionPage, compileAllCSS, copyAndProcessManifestIfNecessary, done);
exports.watch = series(compileOptionPage, compileAllCSS, copyAndProcessManifestIfNecessary, lhwatch);

exports.refresh = refresh;

exports.release = series(
	parallel(compileOptionPage, compileAllCSS),
	(cb) => { forFirefox = true; cb(); },
	copyManifest,
	releaseZip,
	(cb) => { forFirefox = false; cb(); },
	copyManifest,
	releaseZip
);
