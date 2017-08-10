<?php

$manifest        = json_decode(file_get_contents('/tmp/ListHighlighterFirefox/manifest.json'));
$manifestFirefox = json_decode(file_get_contents('/tmp/ListHighlighterFirefox/firefoxApplications.json'));

$newManifest = (array) array_merge(
    (array) $manifest,
    (array) $manifestFirefox
);

file_put_contents(
    '/tmp/ListHighlighterFirefox/manifest.json',
    json_encode($newManifest, JSON_PRETTY_PRINT)
);
