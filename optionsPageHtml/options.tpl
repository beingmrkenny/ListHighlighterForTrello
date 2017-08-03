<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<title>List Highlighter for Trello Settings</title>
	<link rel="stylesheet" href="/css/options.css">
</head>

<body class="preload">

	<header id="MainHeader">

		<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" id="Icon">

			<rect x="32" y="32" width="192" height="192" rx="14.982" ry="14.982" style="fill: rgb(0, 121, 191);" />

			<rect id="TodoList" x="89.713" y="66.511" width="73.76" height="47.896" rx="8.773" ry="8.773" />

			<path d="
				M 32 66.511
				H 70.276
				A 8.733 8.733 0 0 1 79.009 75.244
				V 143.051
				A 8.733 8.733 0 0 1 70.276 151.784
				L 32 151.784
				Z"
				fill="rgb(226, 228, 230)" />

			<path d="
				M 183.035 66.511
				L 224 66.511
				L 224 191.41
				H 183.035
				A 8.773 8.773 0 0 1 174.262 182.637
				V 75.284
				A 8.773 8.773 0 0 1 183.035 66.511 Z"
				style="fill: rgb(226, 228, 230); fill-opacity: 0.7;" />

		</svg>

		<h1>Settings</h1>

		<p>Highlight todo, doing and done lists.</p>

		{include file="./mainHowTo.tpl"}

	</header>

	<section>

		<h2>Highlight Colour</h2>

		<ul class="color-tile-bar" id="DefaultColorBar" data-default="true">
			{foreach from=$defaultTiles item=tile}
			<li>
				<input
					type="radio"
					id="{$tile.inputId}" class="color-tile-input {$tile.colorName}"
					name="DefaultColor" value="{$tile.colorName}"
					data-value="{$tile.color}" data-default="true" data-color-name="{$tile.colorName}">
				<label
					class="color-tile-label {$tile.colorName} {$tile.isLight}"
					for="{$tile.inputId}"
					data-value="{$tile.color}" data-default="true">
					{if $tile.colorName == 'custom'}
						<a href="#" class="edit-link" data-default="true">Edit</a>
					{/if}
					{$tile.colorName|ucwords}
				</label>
			</li>
			{/foreach}
		</ul>

		<details id="HighPriDetails">

			<summary>More colour options</summary>

			<p>
				On some backgrounds the high priority colour might be jarring (e.g. red lists on a blue background) or it might not stand out (e.g. red lists on a red background). You can use this tool to choose a separate high priority colour for each different background.
			</p>

			{include file="./dummyBoard.tpl"}

		</details>

	</section>

	<section>

		<h2>More features</h2>

		<h3>
			Header and separator cards
		</h3>

		<ul class="standard-options">
			<li class="standard-option-widget">
				<input type="checkbox" class="options-input" id="EnableHeaderCards" name="EnableHeaderCards">
				<label for="EnableHeaderCards">
					Header cards
				</label>
			</li>
			<li class="standard-option-widget">
				<input type="checkbox" class="options-input" id="EnableSeparatorCards" name="EnableSeparatorCards">
				<label for="EnableSeparatorCards">
					Separator cards
				</label>
			</li>
		</ul>

		<details>

			<summary>Header and separator cards</summary>

			<h4>Header cards</h4>
			<p>Header cards look like Trello list headers and help break up long lists. To make a header card, start your card text with one of these patterns. </p>
			<ul>
				<li>One or more hash (pound) symbols (<code class="tag">#</code>), as in Markdown (make sure you leave a space after the hash)</li>
				<li>Single line comment syntax from various programming languages: (<code class="tag">--</code>, <code class="tag">//</code>, or <code class="tag">#</code>)</li>
				<li>Two or more line symbols: dashes (<code class="tag">--</code>), equals signs, (<code class="tag">==</code>) or underscore characters (<code class="tag">__</code>)</li>
			</ul>
			<h5>E.g.</h5>
			<ul>
				<li># Small tasks</li>
				<li>#### Small tasks</li>
				<li>-- Ready for QA</li>
				<li>// Ready for code review</li>
				<li>== 😃</li>
				<li>---------- Website items ----------</li>
			</ul>

			<h4>Separator cards</h4>
			<p>Separator cards create a gap between cards. Badges are hidden on separator cards, but you can still use stickers. To make a separator card, type two or more line symbols in a row, and no other text. Line symbols are dashes (<code class="tag">--</code>), equals signs (<code class="tag">==</code>) or underscores (<code class="tag">__</code>).</p>
			<h5>E.g.</h5>
			<ul>
				<li>--</li>
				<li>-=-=-=-=-=</li>
				<li>___________________________________________</li>
			</ul>

		</details>

		{* <h3>Work in progress</h3>

		<ul class="color-tile-bar standard-bar">
			<li>
				<input type="checkbox" class="options-input color-tile-input" id="EnableWIP" name="EnableWIP">
				<label for="EnableWIP" class="color-tile-label standard-input">
					Enable WIP
				</label>
			</li>
		</ul>

		<details>

			<summary>More information</summary>

		</details> *}

	</section>

	<footer>
		<p>
			For more information visit the
			<a href="http://beingmrkenny.co.uk/web-extensions/list-highlighter-trello">List Highlighter for Trello</a>
			homepage
		</p>
		<p>
			Beach photo by <a href="https://unsplash.com/photos/nFSw6m01-38?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Breno Machado</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
			<br>
			Color Picker based on <a href="https://github.com/DavidDurman/FlexiColorPicker">FlexiColorPicker by David Durman</a>
		</p>
	</footer>

	<template id="ColorTile">
		<li>
			<input type="radio" name="color" class="color-tile-input">
			<label class="color-tile-label"></label>
		</li>
	</template>

	<template id="ColorPicker">
		<color-picker hidden>
			<component-picker class="sv-picker">
				<range-display class="sv-range"></range-display>
				<position-indicator class="sv-indicator"></position-indicator>
			</component-picker>
			<component-picker class="hue-picker">
				<range-display class="hue-range"></range-display>
				<position-indicator class="hue-indicator"></position-indicator>
			</component-picker>
			{* <span id="ColorHex" data-pattern="#?[a-fA-F0-9]{6}"></span> *}
			<hr class="spacer">
			<button type="button" id="CancelColor">Cancel</button>
			<button type="button" class="mod-primary" id="SaveColor">Save</button>
		</color-picker>
	</template>

	<script type="text/javascript" src="/options/js/third/colorpicker.js"></script>
	<script type="text/javascript" src="/js/classes/Color.js"></script>
	<script type="text/javascript" src="/js/classes/Options.js"></script>
	<script type="text/javascript" src="/options/js/classes/Tile.js"></script>
	<script type="text/javascript" src="/options/js/classes/Dummy.js"></script>
	<script type="text/javascript" src="/options/js/classes/DefaultColorBar.js"></script>
	<script type="text/javascript" src="/options/js/classes/DoingColors.js"></script>
	<script type="text/javascript" src="/js/functions.js"></script>

	<script type="text/javascript" src="/options/js/colorPickerSetup.js"></script>
	<script type="text/javascript" src="/options/js/options.js"></script>

</body>
</html>
