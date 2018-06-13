<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<title>List Highlighter for Trello Settings</title>
	<link rel="stylesheet" href="/css/options.css">
	<link rel="icon" href="/img/buttonIcon.png">
	<meta name="google" content="notranslate">
</head>

<body class="preload">

	<header id="MainHeader">
		<div>
			<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" id="Icon">
				<rect x="32" y="32" width="192" height="192" rx="14.982" ry="14.982" style="fill: rgb(0, 121, 191);" />
				<rect id="TodoList" x="89.713" y="66.511" width="73.76" height="47.896" rx="8.773" ry="8.773" />
				<path d="M 32 66.511 H 70.276 A 8.733 8.733 0 0 1 79.009 75.244 V 143.051 A 8.733 8.733 0 0 1 70.276 151.784 L 32 151.784 Z"
					fill="rgb(226, 228, 230)" />
				<path d="M 183.035 66.511 L 224 66.511 L 224 191.41 H 183.035 A 8.773 8.773 0 0 1 174.262 182.637 V 75.284 A 8.773 8.773 0 0 1 183.035 66.511 Z"
					style="fill: rgb(226, 228, 230); fill-opacity: 0.7;" />
			</svg>
			<h1>Settings</h1>
			<p>Highlight <span class="normal">todo</span>, <span class="high">doing</span> and <span class="done">done</span> lists.</p>
			<p>
				Name your list <b>Todo</b>, <b>Doing</b>, or <b>Done</b>, and styles will be applied automatically. Or name it what you like and tag it <kbd class="tag">#todo</kbd>, <kbd class="tag">#doing</kbd>, or <kbd class="tag">#done</kbd>.
			</p>

			<nav>
				<ul>
					<li><a href="#Highlighting">Highlighting</a></li>
					<li><a href="#Dimming">Dimming</a></li>
					<li><a href="#CardCounting">Card counting</a></li>
					<li><a href="#Organising">Organising</a></li>
				</ul>
			</nav>
		</div>
	</header>

	<main>
		{include file="./includes/highlighting.section.tpl"}
		{include file="./includes/dimming.section.tpl"}
		{include file="./includes/cardCounting.section.tpl"}
		{include file="./includes/organising.section.tpl"}
	</main>

	<footer>
		For more information visit the
		<a href="http://beingmrkenny.co.uk/web-extensions/list-highlighter-trello">List Highlighter for Trello</a>
		homepage<br>
		Beach photo by <a href="https://unsplash.com/photos/nFSw6m01-38?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Breno Machado</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a>
		&middot;
		Color Picker based on <a href="https://github.com/DavidDurman/FlexiColorPicker">FlexiColorPicker by David Durman</a>
	</footer>

	<template id="ColorTile">
		<li>
			<input type="radio" name="color" class="color-tile-input">
			<label class="color-tile-label"></label>
		</li>
	</template>

	<template id="CustomColorPickerButton">
		<button type="button" class="custom-color-picker-button recent-color-button" data-color="" style=""></button>
	</template>

	{include file="./includes/colorPicker.template.tpl" defaultTiles=$defaultTiles}

	<script type="text/javascript" src="/js/functions.js"></script>
	<script type="text/javascript" src="/options-page/js/third/colorpicker.js"></script>
	<script type="text/javascript" src="/js/classes/Color.js"></script>
	<script type="text/javascript" src="/js/classes/Options.js"></script>
	<script type="text/javascript" src="/options-page/js/classes/Tile.js"></script>
	<script type="text/javascript" src="/options-page/js/classes/Dummy.js"></script>
	<script type="text/javascript" src="/options-page/js/classes/DoingColors.js"></script>

	{if $debug}
		<script type="text/javascript" src="/js/debug.js"></script>
	{/if}

	<script type="text/javascript" src="/options-page/js/colorPickerSetup.js"></script>
	<script type="text/javascript" src="/options-page/js/data.js"></script>
	<script type="text/javascript" src="/options-page/js/setupDummy.js"></script>
	<script type="text/javascript" src="/options-page/js/optionsPage.js"></script>

</body>
</html>
