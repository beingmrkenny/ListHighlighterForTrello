# README

List Highlighter for Trello is a web extension for use with Trello. For more information, including how to install the extension for your own use, see <https://beingmrkenny.co.uk/web-extensions/list-highlighter-trello>.

This readme contains information for developers who want to contribute to List Highlighter's development, and for extension reviewers looking over the source code.

Hopefully the code itself is easy enough to follow, but there is some compilation which needs to run before the dev code will work in the browser.

- CSS is compiled from Sass files
- the options page is generated from handlebars templates

There is no other compilation necessary. No JS files are compressed, obfuscated, concatenated, or otherwise processed; and no code is generated in the browser.

## Setup

Dev tools have been moved over to gulp to make things ten billion times easier and faster:

1. If you don’t have node installed, install it
2. run `npm install`

For reference, I am using Node 11 so you might need to upgrade your version of Node and rebuild if you’re having problems.

### Gulp commands

Note: when specifying options use **one** dash, not two, e.g. `-opt`, not ~~`--opt`~~.

| Command | Description |
|---------|-------------|
| `gulp` | Compiles options page HTML, all CSS and copies manifest.json into Extension/ |
| `gulp html` | Compiles options page HTML |
| `gulp css` | Compiles all the CSS from Scss |
| `gulp manifest` | Copies manifest file into the Extension directory |
| `gulp watch` | Watches all source files and compiles them as appropriate on save |
| `gulp refresh (-options, -trello, -newkey)` | **macOS and Chrome only** — Watches all sources files, compiles them, then refreshes pages specified by options. Use `-trello` to reload web extensions and Trello pages open in Chrome. Use the `-options` option to refresh the option page too. You will be asked for the extension ID in Chrome when using this option. The extension ID will be saved. To clear it pass `-newkey`. Run `osacompile -o chrome.scpt chrome.applescript` in the root of this folder if the AppleScript isn’t working. |
| `gulp release` | Compiles all source files then assembles the zip file needed for release |

#### Extra options

| Options | Works with | Description |
|---------|------------|-------------|
| `--fx` | `default`, `html`, `manifest`, `release` (not recommended) | Generates a Firefox-friendly manifest.json for development, and adds the dialog polyfill to the options page. |

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
- E.g. The popup page is at `chrome-extension://<extensionID>/popup/popup.html`
- Firefox uses the similar `moz-extension://<extensionID>/<pathToFile>`.
