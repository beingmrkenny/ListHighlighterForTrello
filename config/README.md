This config directory should contain two files:

- bash.sh
- options.inc

# `bash.sh`

	listHighlighterDir='/Path/to/ListHighlighterForTrello';
	refreshOnWatch=false;

`listHighlighterDir` should be the full path to where you have the List Highlighter repo checked out

`refreshOnWatch` boolean variable (see "Watch" in main config).

# `options.inc`

	<?php
	$smartyClass = '/Path/to/Smarty.class.php';

`$smartyClass` is the full path to your Smarty installation
