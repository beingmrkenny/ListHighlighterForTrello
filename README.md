# README

List Highlighter for Trello is a web extension for use with Trello. For more information, including how to install the extension for your own use, see <https://beingmrkenny.co.uk/web-extensions/list-highlighter-trello>.

This readme contains information for developers who want to contribute to List Highlighter's development, and for extension reviewers looking over the source code.

Hopefully the code itself is easy enough to follow, but there is some compilation which needs to run before the dev code will work in the browser.

- CSS is compiled from Sass files
- the options page is generated from a smarty template

There is no other compilation necessary. No JS files are compressed, obfuscated, concatenated, or otherwise processed.

## Setup (extension reviewers)

The included source .zip has all the extension code, plus the scripts required to assemble the extension for release. Files unnecessary to creating the compiled code have not been included, though these can be seen in the [git repo](https://github.com/beingmrkenny/ListHighlighterForTrello).

You will need to follow steps 1 and 3 below, omitting the optional elements. You can then generate the .zip file using `lhrelease` from the command line, which should appear at `~/Desktop/ListHighlighterForTrello.zip`.

## Setup (developers)

### 1. Install the following software

#### Required

- sass (<http://sass-lang.com/>)
- PHP with Smarty (<http://www.smarty.net/docs/en/installing.smarty.basic.tpl>)
- jq (<https://stedolan.github.io/jq/download/>) — needed so that the bash scripts can read options from config.json (see below)

#### Optional

- fswatch (<https://github.com/emcrisostomo/fswatch>)
- ruby with the `terminal-notifier` gem installed

### 2. Setup your .gitignore file

Your `.gitignore` file should look like the example below. **Note:** The CSS line should appear without the escaping backslash: `*.css`.

	chrome.scpt
	\*.css
	Extension/options-page/index.html
	.gitconfig

### 3. Setup config

The root directory of this repo needs a config file (`config.json`) with the following contents:

	{
		"listHighlighterDir" : "/Path/to/ListHighlighterForTrello",
		"smartyClass" : "/Path/to/Smarty.class.php",
		"refreshOnWatch" : false,
		"openOptionsOnRefresh" : false,
		"extensionKey" : "abcdefghijklmnopqrstuvwxyzabcdef"
	}

#### Required

- The `listHighlighterDir` variable (string) should be the full path to where you have the List Highlighter repo checked out

- The `smartyClass` variable (string) is the full path to the Smarty PHP class

#### Optional

These options control how the `lhwatch` command works, and are for use during development with Google Chrome. They can be left as they are if you are not using Chrome.

- The `refreshOnWatch` variable (boolean) determines whether to refresh Chrome on every file change.

- The `openOptionsOnRefresh` variable (boolean) determines whether to open the options page on every file change.

- The `extensionKey` variable (string) is the ID Chrome assigns to the extension. It is 32 characters long and is displayed on the extensions page if you have developer mode enabled. This can be left as it is if you do not need to refresh the options page during development.

## Development notes

### Firefox addon ID

Reference: <https://bugzil.la/1323228>

During development, to make the web extension between-page messaging system work in Firefox (e.g. to communicate changes in options to the Trello boards), you must add a temporary, fictional addon ID to `manifest.json`. Below is an example, which is fine to copy and paste. This goes in the top level of the manifest JSON object. This must only be used during development, and may cause issues in other browsers.

	"applications": {
		"gecko": {
			"id": "addon@example.com",
			"strict_min_version": "42.0"
		}
	},

### Directory structure

- The files in the root directory are to assist with development. The manifest file is symlinked here purely for convenience.
- `Extension` contains all the files necessary for the extension to function. The files in this directory are the only files executed in the browser. This directory is the one which is released.
- `options-page-html` contains the templates used to generate the options page, as well as the PHP used to generate the options page. This is generated at `Extension/options-page/index.html`.
- `scss` contains all Scss files used in this extension. These are compiled into `Extension/css`, and results in three CSS files: `options.css`, the stylesheet for the options page; `popup.css`, the stylesheet for the popup; and `style.css`, which is injected into the Trello page.

### How the JavaScript works (brief intro)

The first script the browser hits is `js/init.js`. This sets up the messenger between contexts and triggers the mutation observers that watch the page for changes. `js/classes/System.js` is basically a container for the methods which set up the mutation observers.

### Compile commands

BASH scripts have been written in the root directory to help with compilation. To use them, include listhighlighter.sh in your bash profile.

- `lhcompile` — compiles all the CSS and generates the options page
- `lhwatch` — runs `lhcompile` automatically every time you change a file. Requires fswatch to be installed on your system. See "Watch" below for more details.
- `lhrelease` — runs `lhcompile` and prepares the .zip for uploading to the various browser developer admin areas

### git branching

- As far as possible, a single commit should represent one complete feature or bug fix.
- `master` is the standard master branch.
- During development of a new version, a working branch named vX.X.X is branched from master
- Before merging a branch back into master, commits should be squashed into as few commits as possible/sensible.
- Make commit messages as descriptive yet concise as possible

## Watch

The command `lhwatch`, an [fswatch](https://github.com/emcrisostomo/fswatch) monitor is set up on the List Highlighter repo. Every time a file changes, `lhcompile` is run. This is useful during developement since you can work on the files and forget about all the compilation stuff.

If you use Google Chrome on macOS, you can also get `lhwatch` to reload all dev mode extensions (requires the [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) extension) and refresh any tabs containing a Trello web page. This is controlled via the `refreshOnWatch` variable in `listhighlighter.sh`.

Please note you may need to run `chmod +x watchhandler.sh` to get this to work.

## Oddments

- Extension files in Chrome are accessible via URLs like `chrome-extension://<extensionID>/<pathToFile>`.
- E.g. The popup page is at `chrome-extension://<extensionID>/popup/popup.html`
