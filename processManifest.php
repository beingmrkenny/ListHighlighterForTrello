<?php

$manifest = json_decode(file_get_contents('/tmp/ListHighlighter/manifest.json'), true);

foreach ($manifest['content_scripts'][0]['js'] as $key => $value) {
	if ($value == 'js/debug.js') {
		unset($manifest['content_scripts'][0]['js'][$key]);
	}
}

$manifest['content_scripts'][0]['js'] = array_values($manifest['content_scripts'][0]['js']);

if ($manifest['applications']) {
	unset($manifest['applications']);
}

file_put_contents(
	'/tmp/ListHighlighter/manifest.json',
	json_encode($manifest, JSON_PRETTY_PRINT)
);
