<?php

$manifest = json_decode(file_get_contents('/tmp/ListHighlighterFirefox/manifest.json'), true);

foreach ($manifest['content_scripts'][0]['js'] as $key => $value) {
	if ($value == 'js/debug.js') {
		unset($manifest['content_scripts'][0]['js'][$key]);
	}
}

$manifest['content_scripts'][0]['js'] = array_values($manifest['content_scripts'][0]['js']);

file_put_contents(
	'/tmp/ListHighlighter/manifest.json',
	json_encode($manifest, JSON_PRETTY_PRINT)
);

$manifestFirefox = json_decode(file_get_contents('/tmp/ListHighlighterFirefox/firefoxApplications.json'), true);

$newManifest = (array) array_merge(
	(array) $manifest,
	(array) $manifestFirefox
);

file_put_contents(
	'/tmp/ListHighlighterFirefox/manifest.json',
	json_encode($newManifest, JSON_PRETTY_PRINT)
);
