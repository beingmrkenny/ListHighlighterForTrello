# README

Some compilation needs to run before the dev code will work in the browser. CSS is compiled from Sass; and the options page is generated from the smarty template

## Setup

### 1. Install the following software

- sass (<http://sass-lang.com/>)
- PHP with Smarty (<http://www.smarty.net/docs/en/installing.smarty.basic.tpl>)
- jq (<https://stedolan.github.io/jq/download/>)
- (optional) fswatch (<https://github.com/emcrisostomo/fswatch>)
- (optional) ruby with the `terminal-notifier` gem installed

### 2. Setup your .gitignore file

Your `.gitignore` file should look like this:

	chrome.scpt
	\*.css
	Extension/options-page/index.html
	.gitconfig
	/Images

### 3. Setup config

The root directory of this repo needs a config file (config.json) with the following contents:

	{
		"listHighlighterDir" : "/Path/to/ListHighlighterForTrello",
		"smartyClass" : "/Path/to/Smarty.class.php",
		"refreshOnWatch" : false,
		"openOptionsOnRefresh" : false,
		"extensionKey" : "abcdefghijklmnopqrstuvwxyzabcdef",
		"scssCompressionStyle" : "compressed"
	}

- The `listHighlighterDir` variable (string) should be the full path to where you have the List Highlighter repo checked out

- The `smartyClass` variable (string) is the full path to the Smarty PHP class

- The `refreshOnWatch` variable (boolean) determines whether to refresh Chrome on every file change.

- The `openOptionsOnRefresh` variable (boolean) determines whether to open the options page on every file change.

- The `extensionKey` variable (string) is the ID Chrome assigns to the extension. It is 32 characters long and is displayed on the extensions page if you have developer mode enabled.

- The `scssCompressionStyle` variable (string) is how much to compress the CSS files: 'compressed' is the default for production, 'expanded' is more useful for debugging.

## Development notes

### How the JavaScript works (brief intro)

The first script the browser hits is js/init.js. This sets up the messenger between contexts and triggers the mutation observers that watch the page for changes. js/classes/System.js is basically a container for the methods which set up the mutation observers.

### Compile commands

BASH scripts have been written in the sh directory to help with compilation. To use them, include listhighlighter.sh in your bash profile.

- `lhcompile` — compiles all the CSS and generates the options page
- `lhwatch` — runs `lhcompile` automatically every time you change a file. Requires fswatch to be installed on your system. See "Watch" below for more details.

### git branching

- `master` is a standard master branch. A single commit should represent one complete feature or bug fix
- During development of a new version, a working branch named VersionX.X.X is created — branch off that to create a new feature or bug fix
- Before merging a feature branch back into the version branch, all commits should be squashed into one
- Make commit messages as descriptive yet concise as possible


## Watch

The command `lhwatch`, an [fswatch](https://github.com/emcrisostomo/fswatch) monitor is set up on the List Highlighter repo. Every time a file changes, `lhcompile` is run. This is useful during developement since you can work on the files and forget about all the compilation stuff.

If you use Google Chrome on macOS, you can also get `lhwatch` to reload all dev mode extensions (requires the [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) extension) and refresh any tabs containing a Trello web page. This is controlled via the `refreshOnWatch` variable in `bash.sh`.

Please note you may need to run `chmod +x watchhandler.sh` to get this to work.
