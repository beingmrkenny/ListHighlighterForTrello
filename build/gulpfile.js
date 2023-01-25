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

exports.default = series(compileOptionPage, compileAllCSS, copyAndProcessManifestIfNecessary, done);
exports.watch = series(compileOptionPage, compileAllCSS, copyAndProcessManifestIfNecessary, lhwatch);

exports.refresh = refresh;
