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

		<h1>Settings</h1>
	</header>

	<section>
		<p>
			Here you can tweak how List Highlighter works. Please note that for your settings to be saved reliably, you
			need to be logged into Chrome.
		</p>
		<!-- TODO description of how this works for reference -->
	</section>

	<section>

		<h2>Highlighting</h2>

		<h3>Colour</h3>

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

			<summary>
				<h3>More colour options</h3>
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

		<details>

			<summary><h3>Fiddly little options</h3></summary>

			<label for="HighlightTags">
				<input type="checkbox" class="option-control options-input" id="HighlightTags" name="HighlightTags">
				Highlight lists based on hashtags<br>
				<small>(e.g. highlight list if title is tagged <strong>#todo</strong>, <strong>#doing</strong>, <strong>#done</strong>, etc)</small>
			</label>
			<label for="HideHashtags" class="sub-setting">
				<input type="checkbox" class="option-control options-input" id="HideHashtags" name="HideHashtags">
				Hide hashtags in list headers<br>
				<small>
					If this box and the one above are checked, hashtags in list headers will be hidden.<br>
					Currently, "<strong>Thursday tasks #todo</strong>" will appear as "<strong>Thursday tasks<text-switcher id="HideHashtagsSwitcher" data-on="" data-off=" #todo"></text-switcher></strong>"
				</small>
			</label>

			<label for="HighlightTitles">
				<input type="checkbox" class="option-control options-input" id="HighlightTitles" name="HighlightTitles">
				Highlight lists based on title text<br>
				<small>(e.g. highlight list if title <text-switcher id="HighlightTitlesSwitcher" data-on="contains the text" data-off="is exactly">is exactly</text-switcher> "<strong>Todo</strong>", "<strong>Doing</strong>", "<strong>Done</strong>", etc)</small>
			</label>
			<label for="MatchTitleSubstrings" class="sub-setting">
				<input type="checkbox" class="option-control options-input" id="MatchTitleSubstrings" name="MatchTitleSubstrings">
				Match partial title text<br>
				<small>
					Currently:<br>
					"<strong>To do</strong>" will be matched<br>
					"<strong>Things to do</strong>" <text-switcher id="MatchTitleSubstringsSwitcher" data-off="will not" data-on="will">will not</text-switcher> be matched
				</small>
			</label>

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

		<!-- TODO Cards count as 1 unless they have a number in [brackets] -->

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
				<h3>More info</h3>
			</summary>

			<h4>Header cards</h4>
			<p>To make a header card, start your card text with one of these patterns.</p>
			<ul>
				<li>One or more hash symbol (<code>#</code>), as in Markdown</li>
				<li>Single line comment syntax from various programming languages: (<code>--</code>, <code>//</code>, or <code>#</code>)</li>
				<li>Two or more equals signs (<code>==</code>) or underscore characters (<code>__</code>)</li>
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
			<p>To make a separator card, type two (or more) line symbols in a row, and no other text. Line symbols are dashes (--), equals signs (==) or underscores (__).</p>
			<h5>E.g.</h5>
			<ul>
				<li>--</li>
				<li>-=-=-=-=-=</li>
				<li>___________________________________________</li>
			</ul>

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
