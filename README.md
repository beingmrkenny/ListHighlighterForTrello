# README

Some compilation needs to run before the dev code will work in the browser. CSS is compiled from Sass; and the options page is generated from the smarty template

## Setup

### 1. Install the following software

- sass (<http://sass-lang.com/>)
- PHP with Smarty (<http://www.smarty.net/docs/en/installing.smarty.basic.tpl>)
- (optional) fswatch (<https://github.com/emcrisostomo/fswatch>)
- (optional) ruby with the `terminal-notifier` gem installed

### 2. Setup your .gitignore file

Your `.gitignore` file should look like this:

	config/bash.sh
	config/options.inc
	*.css
	Extension/options/index.html

### 3. Setup config

The config directory should contain two files (contents below):

- bash.sh
- options.inc

#### `bash.sh`

	listHighlighterDir='/Path/to/ListHighlighterForTrello';
	refreshOnWatch=false;
	openOptionsOnRefresh=false;

- The `listHighlighterDir` variable should be the full path to where you have the List Highlighter repo checked out

- The `refreshOnWatch` variable is boolean (determines whether to refresh Chrome on every update).

#### `options.inc`

	<?php
	$smartyClass = '/Path/to/Smarty.class.php';

- `$smartyClass` is the full path to your Smarty installation


## Development notes


### How the JavaScript works (brief intro)

The first script the browser hits is js/init.js. This sets up the messenger between contexts and triggers the mutation observers that watch the page for changes. js/classes/System.js is basically a container for the methods which set up the mutation observers.

### Compile commands

BASH scripts have been written in the sh directory to help with compilation. To use them, include listhighlighter.sh in your bash profile.

- `lhcompile` — compiles all the CSS and generates the options page
- `lhwatch` — runs `lhcompile` automatically every time you change a file. Requires fswatch to be installed on your system. See "Watch" below for more details.


## Watch

The command `lhwatch`, an [fswatch](https://github.com/emcrisostomo/fswatch) monitor is set up on the List Highlighter repo. Every time a file changes, `lhcompile` is run. This is useful during developement since you can work on the files and forget about all the compilation stuff.

If you use Google Chrome on macOS, you can also get `lhwatch` to reload all dev mode extensions (requires the [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) extension) and refresh any tabs containing a Trello web page. This is controlled via the `refreshOnWatch` variable in `bash.sh`.

Please note you may need to run `chmod +x watchhandler.sh` to get this to work.
