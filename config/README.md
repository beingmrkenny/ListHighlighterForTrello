This config directory should contain two files (contents below):

- bash.sh
- options.inc

# `bash.sh`

	listHighlighterDir='/Path/to/ListHighlighterForTrello';
	refreshOnWatch=false;
	openOptionsOnRefresh=false;

- The `listHighlighterDir` variable should be the full path to where you have the List Highlighter repo checked out

- The `refreshOnWatch` variable is boolean (determines whether to refresh Chrome on every update).

# `options.inc`

	<?php
	$smartyClass = '/Path/to/Smarty.class.php';

- `$smartyClass` is the full path to your Smarty installation