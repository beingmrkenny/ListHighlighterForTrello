<!DOCTYPE html>
<html>

<head>
	<title>List Highlighter for Trello Settings</title>
	<link rel="stylesheet" href="/css/options.css">
</head>

<body class="preload">

	<header id="MainHeader">

		<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" id="Icon">

			<rect
				x="32" y="32"
				width="192" height="192"
				rx="14.982" ry="14.982"
				style="fill: rgb(0, 121, 191);" />

			<rect
				id="TodoList"
				x="89.713" y="66.511"
				width="73.76" height="47.896"
				rx="8.773" ry="8.773" />

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

		<h1>List Highlighter for Trello Settings</h1>
	</header>

	<section>
		<p>
			Here you can tweak how List Highlighter works. Please note that for your settings to be saved reliably, you
			need to be logged into Chrome.
		</p>
		<!-- TODO description of how this works for reference -->
	</section>

	<section>

		<h2>High priority colour</h2>

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

		<details open>

			<summary>
				<h3>More options</h3>
			</summary>

			<p>
				On some backgrounds the default high priority colour might look jarring (e.g. red lists on
				a blue background) or they might not stand out (e.g. red lists on a red background). You can use
				this tool to choose a separate highlight colour for each different background colour.
			</p>

			<p>
				Change the background using the rectangles on the right-hand side, then choose the highlight colour
				using the squares at the top. If no highlight colour is selected, the default will be used.
			</p>

			<div id="DummyBoard" data-trello-bg="blue" data-list-color-name="default">

				<div class="color-tile-bar-container"><ul class="color-tile-bar" data-default="false">
					{foreach from=$dummyTiles item=tile}
					<li {if $tile.inputId == 'Dummy-ColorTile-default'}id="DefaultDummyTile"{/if}>
						<input
							type="radio"
							id="{$tile.inputId}" class="color-tile-input {$tile.colorName}"
							name="DummyColor" value="{$tile.colorName}"
							data-value="{$tile.color}" data-default="false" data-color-name="{$tile.colorName}">
						<label
							class="color-tile-label {$tile.colorName} {$tile.isLight}"
							for="{$tile.inputId}"
							data-value="{$tile.color}" data-default="false" data-color-name="{$tile.colorName}">
							{if $tile.colorName == 'custom'}
								<a href="#" class="edit-link" data-default="false">Edit</a>
							{/if}
							{$tile.colorName|ucwords}
						</label>
					</li>
					{if $tile.inputId == 'Dummy-ColorTile-default'}<hr>{/if}
					{/foreach}
				</ul></div>

				<svg id="DummyBoardSVG" viewBox="0 0 865 500" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<linearGradient id="DropShadow" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0"  stop-color="rgba(0, 0, 0, 0.3)"/>
							<stop offset="100%" stop-color="transparent"/>
						</linearGradient>
						<linearGradient id="ColorBlindFriendlyMode" x1="0" y1="0" x2="0" y2="12%" spreadMethod="repeat" gradientTransform="rotate(-37)">
							<stop offset="25%" stop-color= "rgba(255,255,255,.5)" />
							<stop offset="25%" stop-color= "transparent" />
							<stop offset="50%" stop-color= "transparent" />
							<stop offset="50%" stop-color= "rgba(255,255,255,.5)" />
							<stop offset="75%" stop-color= "rgba(255,255,255,.5)" />
							<stop offset="75%" stop-color= "transparent" />
							<stop offset="100%" stop-color= "transparent" />
						</linearGradient>
					</defs>
					<g class="normal-list">
						<rect x="-35" y="60" width="180" height="285" rx="2.5" ry="2.5" class="list"/>
						<rect x="-30" y="80" width="170" height="40" rx="2.5" ry="2.5" class="card"/>
						<rect x="-30" y="125" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
						<rect x="-30" y="180" width="170" height="30" rx="2.5" ry="2.5" class="card"/>
						<rect x="-30" y="215" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
						<rect x="-30" y="270" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
					</g>
					<g class="todo-list">
						<rect x="155" y="60" width="180" height="175" rx="2.5" ry="2.5" class="list"/>
						<rect x="160" y="80" width="170" height="20" rx="2.5" ry="2.5" class="card"/>
						<rect x="160" y="105" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
						<rect x="160" y="160" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
					</g>
					<g class="doing-list">
						<rect x="345" y="60" width="180" height="240" rx="2.5" ry="2.5" class="list"/>
						<rect x="345" y="60" width="180" height="240" rx="2.5" ry="2.5" class="color-blind-friendly-mask" fill="url(#ColorBlindFriendlyMode)" />
						<rect x="350" y="80" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
						<rect x="350" y="135" width="170" height="30" rx="2.5" ry="2.5" class="card"/>
						<rect x="350" y="170" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
						<rect x="350" y="225" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
					</g>
					<g class="done-list">
						<rect x="535" y="60" width="180" height="410" rx="2.5" ry="2.5" class="list"/>
						<rect x="540" y="80" width="170" height="30" rx="2.5" ry="2.5" class="card"/>
						<rect x="540" y="115" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
						<rect x="540" y="170" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
						<rect x="540" y="225" width="170" height="20" rx="2.5" ry="2.5" class="card"/>
						<rect x="540" y="250" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
						<rect x="540" y="305" width="170" height="30" rx="2.5" ry="2.5" class="card"/>
						<rect x="540" y="340" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
						<rect x="540" y="395" width="170" height="50" rx="2.5" ry="2.5" class="card"/>
					</g>
					<g>
						<rect x="650" y="0" width="215" height="500" style="fill: rgb(216, 216, 216);"/>
						<text x="685" y="53" id="BackgroundColorsHeader">Background Colors</text>

						<rect class="trello-bg-color-selected" data-trello-bg="blue"	x="660" y="65"  width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="orange"	x="760" y="65"  width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="green"	x="660" y="140" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="red"		x="760" y="140" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="purple"	x="660" y="215" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="pink"	x="760" y="215" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="lime"	x="660" y="290" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="sky"		x="760" y="290" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="grey"	x="660" y="365" width="95" height="70" rx="7" ry="7" />

						<rect id="BlueButton"	class="trello-bg-color-button" data-trello-bg="blue"	x="665" y="70"  width="85" height="60" rx="3" ry="3" />
						<rect id="OrangeButton"	class="trello-bg-color-button" data-trello-bg="orange"	x="765" y="70"  width="85" height="60" rx="3" ry="3" />
						<rect id="GreenButton"	class="trello-bg-color-button" data-trello-bg="green"	x="665" y="145" width="85" height="60" rx="3" ry="3" />
						<rect id="RedButton"	class="trello-bg-color-button" data-trello-bg="red"		x="765" y="145" width="85" height="60" rx="3" ry="3" />
						<rect id="PurpleButton" class="trello-bg-color-button" data-trello-bg="purple"	x="665" y="220" width="85" height="60" rx="3" ry="3" />
						<rect id="PinkButton"	class="trello-bg-color-button" data-trello-bg="pink"	x="765" y="220" width="85" height="60" rx="3" ry="3" />
						<rect id="LimeButton"	class="trello-bg-color-button" data-trello-bg="lime"	x="665" y="295" width="85" height="60" rx="3" ry="3" />
						<rect id="SkyButton"	class="trello-bg-color-button" data-trello-bg="sky"		x="765" y="295" width="85" height="60" rx="3" ry="3" />
						<rect id="GreyButton"	class="trello-bg-color-button" data-trello-bg="grey"	x="665" y="370" width="85" height="60" rx="3" ry="3" />
					</g>
					<rect width="865" height="10" style="fill: url(#DropShadow);"/>
				</svg>

			</div>

		</details>

	</section>

	<section>

		<h2>Work in progress</h2>

		<!-- TODO Describe what this is -->

		<p>
			<label for="EnableWIP">
				<input type="checkbox" class="options-input" id="EnableWIP" name="EnableWIP">
				Enable WIP
			</label>
		</p>

		<!-- TODO This should be disabled if WIP is not enabled -->
		<p class="sub-setting" data-master="EnableWIP">
			Count:<br>
			<label for="CountCards">
				<input type="radio" class="options-input" id="CountCards" name="Count" value="Cards">
				Number of cards
			</label>
			<label for="CountPoints">
				<input type="radio" class="options-input" id="CountPoints" name="Count" value="Points">
				Number of points
			</label>
		</p>

	</section>

	<section>

		<h2>Header and separator cards</h2>

		<p>
			Split up long lists with sub-headers and separators
		</p>

		<p>
			<label for="EnableHeaderCards">
				<input type="checkbox" class="options-input" id="EnableHeaderCards" name="EnableHeaderCards">
				Enable header cards
			</label>
			<label for="EnableSeparatorCards">
				<input type="checkbox" class="options-input" id="EnableSeparatorCards" name="EnableSeparatorCards">
				Enable separator cards
			</label>
		</p>

		<details>

			<summary>
				<h3>What's this?</h3>
			</summary>

			<p>Sometimes lists can get very long, yet you don't necessarily want to split it up into separate lists.</p>
			<p>This feature lets you break up long lists by turning cards into sub-headings and separators (horizontal lines). Header cards have a native look and feel, matching Trello's list headings and separator lines.</p>
			<p>To create a header card, start your card text with three or more dash symbols (<code>---</code>) or one or more hash symbols (<code>#</code>), similar to Markdown's heading syntax.</p>
			<p>Header and separator cards can be dragged, just like normal cards, and clicking on them opens them for editing as usual. To turn them back into normal cards, just change the text.</p>

			<h4>Header cards</h4>
			<p>Header cards are fully fledged Trello cards, meaning, you can use stickers, checklists, labels and all the other Trello features if you like.</p>
			<ul>
				<li>To make a header card, start your card text with one or more hash (#) symbols.</li>
				<li>If you don't like the hash symbol, you can also use three or more line symbols:<br> dashes (---), equals signs (===) or underscores (___).</li>
				<li>Dash characters get stripped from the end of header cards too, so you can put them on both sides of the header text if you want cards to look like headers in the Trello app (see last example below).</li>
			</ul>
			<h5>Examples</h5>
			<ul>
				<li># Small tasks</li>
				<li>#### Other tasks</li>
				<li>--- Ready for QA</li>
				<li>-=-=-=-=-= Ready for QA</li>
				<li>--- 😃</li>
				<li>---------- Website items ----------</li>
			</ul>
			<h4>Separator cards</h4>
			<p>Unlike header cards, all of content on a separator cards is hidden — the entire card is replaced by a horizontal line.</p>
			<p>To make a separator card, type three (or more) line symbols in a row and no other text. Line symbols are dashes (---), equals signs (===) or underscores (___). You can mix them up if you like.</p>
			<h5>Examples</h5>
			<ul>
				<li>---</li>
				<li>-=-=-=-=-=</li>
				<li>___________________________________________</li>
			</ul>

		</details>

	</section>

	<section>

		<h2>Fiddly little options</h2>

		<p>Fine detail controls for how this extension operates.</p>

		<details>
			<summary>
				<h3>Options</h3>
			</summary>

			<p>
				<label for="HideHashtags">
					<input type="checkbox" class="options-input" id="HideHashtags" name="HideHashtags">
					Hide hashtags in list headers<br>
					<small>
						By default, hashtags in list headers will not be shown. If this box is unchecked, hashtags will be visible.<br>
						Currently, "<strong>Thursday tasks #todo</strong>" will appear as "<strong>Thursday tasks<text-switcher data-trigger="HideHashtags" data-on="" data-off=" #todo"></text-switcher></strong>"
					</small>
				</label>
			</p>

			<p>
				Highlight lists based on:<br>
				<label for="HighlightTags">
					<input type="checkbox" class="options-input" id="HighlightTags" name="HighlightTags">
					Tags<br>
					<small>(e.g. highlight list if title is tagged <strong>#todo</strong>, <strong>#doing</strong>, <strong>#done</strong>, etc)</small>
				</label>
				<label for="HighlightTitles">
					<input type="checkbox" class="options-input" id="HighlightTitles" name="HighlightTitles">
					Title text<br>
					<small>(e.g. highlight list if title <text-switcher data-trigger="MatchTitleSubstrings" data-on="contains the text" data-off="is exactly">is exactly</text-switcher> "<strong>Todo</strong>", "<strong>Doing</strong>", "<strong>Done</strong>", etc)</small>
				</label>
				<label for="MatchTitleSubstrings" class="sub-setting" data-master="HighlightTitles">
					<input type="checkbox" class="options-input" id="MatchTitleSubstrings" name="MatchTitleSubstrings">
					Match partial title text<br>
					<small>
						Currently:<br>
						"<strong>To do</strong>" will be matched<br>
						"<strong>Things to do</strong>" <text-switcher data-trigger="MatchTitleSubstrings" data-off="will not" data-on="will">will not</text-switcher> be matched
					</small>
				</label>
			</p>

		</details>

	</section>

	<footer>
		<p>
			For more information visit the
			<a href="http://beingmrkenny.co.uk/web-extensions/list-highlighter-trello">List Highlighter for Trello</a>
			homepage.
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
			<span id="ColorHex" data-pattern="#?[a-fA-F0-9]{6}"></span>
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
