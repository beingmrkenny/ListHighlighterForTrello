# Development notes

## Setup

I work on macOS, so you may have to tweak these setup instructions as appropriate.

1. Create config directory and files and setup your .gitignore file (see below)
2. Install dev dependencies, if not already installed:
	- sass (<http://sass-lang.com/>)
	- PHP and Smarty (<http://www.smarty.net/docs/en/installing.smarty.basic.tpl>)
	- (optional) fswatch (<https://github.com/emcrisostomo/fswatch>)
	- (optional) ruby with the `terminal-notifier` gem installed

## Config and `.gitignore`

### Config

The `config` directory in the root of the repo is required for developement. Please see inside the directory for more details

### `.gitignore`

Your `.gitignore` file should look like this:

	config/bash.sh
	config/options.inc
	*.css
	Extension/options/index.html

## Scss

All CSS is written in Scss which is then compiled. The compiled CSS is not checked into the repo.

## Options page HTML

The options page HTML is generated from a Smarty template. To change the HTML, update `options.tpl` in the `php` directory, then run `php -f generateOptions.php`.

## BASH

BASH scripts have been included in the `sh` directory to help with Scss compilation. To use them, include `listhighlighter.sh` in your bash profile.

You will need to create a `config.sh` file in the `sh` directory.

There are five commands:

### `lhcompile`

- the three CSS compilation commands are triggered
- the options page HTML is generated

### `lhwatch`

Sets up a file monitor on the List Highlighter repo to run `lhcompile` automatically. This requires `fswatch` to be installed on your system. See "Watch" below for more details.

### `lhcss`

Compiles the injected CSS which styles the actual Trello page.

### `lhpcss`

Compiles the CSS used on the popup.

### `lhocss`

Compiles the CSS used on the options page.

All three CSS commands can take a `watch` option, which triggers sass's watch option.

## Watch

If you run the command `lhwatch`, an [fswatch](https://github.com/emcrisostomo/fswatch) monitor is set up on the List Highlighter repo. Every time a file changes, `lhcompile` is run. This is useful during developement since you can work on the files and forget about all the compilation stuff.

If you use Google Chrome on macOS, you can also get `lhwatch` to reloads all dev mode extensions (requires the [Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) extension) and refresh any tabs containing a Trello web page. This is controlled via the `refreshOnWatch` variable in `bash.sh`.