<?php

$manifestFilep = 'manifest.json';

$manifesht = file_get_contents($manifestFilep);

if (strpos($manifesht, 'gecko') === false) {

    file_put_contents($manifestFilep.'.bak', $manifesht);

    $manifest = json_decode($manifesht, true);

    $manifest['applications'] = [
        "gecko" => [
            "id" => "addon@example.com",
            "strict_min_version" => "42.0"
        ]
    ];

    file_put_contents(
    	$manifestFilep,
    	json_encode($manifest, JSON_PRETTY_PRINT)
    );

}
