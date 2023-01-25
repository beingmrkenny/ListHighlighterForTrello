# README

List Highlighter for Trello is a web extension for use with Trello. For more information, including how to install the extension for your own use, see <https://beingmrkenny.co.uk/web-extensions/list-highlighter-trello>.

This readme contains information for developers who want to contribute to List Highlighter's development, and for extension reviewers looking over the source code.

Hopefully the code itself is easy enough to follow, but there is some compilation which needs to run before the dev code will work in the browser.

- CSS is compiled from Sass files
- the options page is generated from handlebars templates

There is no other compilation necessary. No JS files are compressed, obfuscated, concatenated, or otherwise processed; and no code is generated in the browser.

## Setup

Dev tools now run on native node, not gulp. You'll need to delete node_modules and run `npm i again`.

You'll need sass if you don't have it, which you can install with either `brew install sass/sass/sass` or `npm i -g sass`.

If you want to use the Applescript to refresh Chrome, you'll need to run `osacompile -o chrome.scpt chrome.applescript` in the build directory first.

### Dev commands

| Command | Description |
|---------|-------------|
| `npm run html` | Compiles options page HTML |
| `npm run css` | Compiles all the CSS from Scss |
| `npm run manifest` | Copies and formats manifest file into the Extension directory for blink-based browsers, suitable for dev or release |
| `npm run manifest firefox dev` | Copies and formats manifest file into the Extension directory for Firefox, with necessary additional development entries |
| `npm run manifest firefox release` | Copies and formats manifest file into the Extension directory for Firefox, without additional development entries |

| `gulp watch` | Watches all source files and compiles them as appropriate on save |
| `gulp refresh (-options, -trello, -newkey)` | **macOS and Chrome only** — Watches all sources files, compiles them, then refreshes pages specified by options. Use `-trello` to reload web extensions and Trello pages open in Chrome. Use the `-options` option to refresh the option page too. You will be asked for the extension ID in Chrome when using this option. The extension ID will be saved. To clear it pass `-newkey`. Run `osacompile -o chrome.scpt chrome.applescript` in the build directory if the AppleScript isn’t working. |
| `gulp release` | Compiles all source files then assembles the zip file needed for release |

## Development notes

### Directory structure

- The files in the root directory are to assist with development. The canonical manifest file exists here and is copied into the Extension file by gulp (see above).
- `Extension` contains all the files necessary for the extension to function. The files in this directory are the only files executed in the browser. This directory is the one which is released.
- `options-page-html` contains the templates used to generate the options page at `Extension/options-page/index.html`.
- `scss` contains all Scss files used in this extension. These are compiled into `Extension/css`, and results in three CSS files: `options.css`, the stylesheet for the options page; `popup.css`, the stylesheet for the popup; and `style.css`, which is injected into the Trello page.

### How the JavaScript works (brief intro)

The first script the browser hits is `js/init.js`. This sets up the messenger between contexts and triggers the mutation observers that watch the page for changes. `js/classes/System.js` is basically a container for the methods which set up the mutation observers.

### git branching

- As far as possible, a single commit should represent one complete feature or bug fix.
- `master` is the standard master branch.
- During development of a new version, a working branch named vX.X.X is branched from master
- Before merging a branch back into master, commits should be squashed into as few commits as possible/sensible.
- Make commit messages as descriptive yet concise as possible

## Oddments

- Extension files in Chrome are accessible via URLs like `chrome-extension://<extensionID>/<pathToFile>`.
- Firefox uses the similar `moz-extension://<extensionID>/<pathToFile>`.
- E.g. The popup page is at `chrome-extension://<extensionID>/popup.html`

chrome-extension://extensionID/popup.html
moz-extension://extensionID/popup.html
