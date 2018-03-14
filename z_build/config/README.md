This config directory should contain two files in addition to this README (contents below):

- bash.sh
- options.inc

# `bash.sh`

	listHighlighterDir='/Path/to/ListHighlighterForTrello';
	refreshOnWatch=false;
	openOptionsOnRefresh=false;
	extensionKey=abcdefghijklmnopqrstuvwxyzabcdef;

- The `listHighlighterDir` variable (string) should be the full path to where you have the List Highlighter repo checked out

- The `refreshOnWatch` variable (boolean) determines whether to refresh Chrome on every file change.

- The `openOptionsOnRefresh` variable (boolean) determines whether to open the options page on every file change.

- The `extensionKey` variable (string) is the ID Chrome assigns to the extension. It is 32 characters long and is displayed on the extensions page if you have developer mode enabled.

# `options.inc`

	<?php
	$smartyClass = '/Path/to/Smarty.class.php';

- `$smartyClass` is the full path to your Smarty installation
