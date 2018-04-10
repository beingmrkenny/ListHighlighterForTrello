<?php

// PHP 5 complains about this
if (!ini_get('date.timezone')) {
	date_default_timezone_set('UTC');
}

$lhDir = __DIR__ . '/..';

$settings = json_decode(file_get_contents("$lhDir/config.json"), true);
require $settings['smartyClass'];
require 'Color.php';

$smarty = new Smarty();
$smarty->setTemplateDir('./optionsPageHtml');
$smarty->setCompileDir('/tmp/templates_c');
$smarty->setCacheDir('/tmp/smarty_cache');

$colors = [
	"red"     => "#ec2f2f",
	"orange"  => "#FFAB4A",
	"yellow"  => "#F2D600",
	"green"   => "#61BD4F",
	"cyan"    => "#0ed4f3",
	"blue"    => "#00a2ff",
	"indigo"  => "#30458a",
	"violet"  => "#ba55e2",
	"pink"    => "#FF80CE",
	"black"   => "#000000",
	"custom"  => "#e2e4e6"
];

$defaultTiles = [];
$dummyTiles = [
	[
		'inputId' => 'Dummy-ColorTile-default',
		'color' => null,
		'colorName' => 'default',
		'isLight' => null
	]
];

foreach ($colors as $colorName => $color) {
	$color = strtolower($color);
	$colorName = strtolower($colorName);
	$colour = new Color($color);
	$isLight = ($colour->isLight()) ? 'mod-light-background' : '';

	$defaultTiles[] = [
		'inputId' => 'Default-ColorTile-'.$colorName,
		'color' => $color,
		'colorName' => $colorName,
		'isLight' => $isLight
	];

	$dummyTiles[] = [
		'inputId' => 'Dummy-ColorTile-'.$colorName,
		'color' => $color,
		'colorName' => $colorName,
		'isLight' => $isLight
	];
}

$smarty->assign('defaultTiles', $defaultTiles);
$smarty->assign('dummyTiles', $dummyTiles);
$smarty->assign('debug', (empty($argv[1])));

$fileContents = $smarty->fetch($lhDir.'/optionsPageHtml/options.tpl');
$file = $lhDir.'/Extension/options/index.html';

file_put_contents($file, $fileContents);
