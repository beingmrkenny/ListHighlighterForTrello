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

/*
| `gulp refresh (-options, -trello, -newkey)` | **macOS and Chrome only** — Watches all sources files, compiles them, then refreshes pages specified by options. Use `-trello` to reload web extensions and Trello pages open in Chrome. Use the `-options` option to refresh the option page too. You will be asked for the extension ID in Chrome when using this option. The extension ID will be saved. To clear it pass `-newkey`. Run `osacompile -o chrome.scpt chrome.applescript` in the build directory if the AppleScript isn’t working. |
*/