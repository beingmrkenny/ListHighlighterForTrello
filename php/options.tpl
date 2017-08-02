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

		<p>Highlight todo, doing and done lists.</p>

		<p>
		    <span class="normal"><b>To do</b> lists stay as they are.</span>
		    <span class="high"><b>Doing</b> lists are highlighted.</span>
		    <span class="done"><b>Done</b> lists are greyed out.</span>
		</p>

		<p>
		    Just name your list Todo, Doing, or Done, and styles will be applied automatically. Or name it what you like
		    and tag it <code class="tag">#todo</code>,
		    <code class="tag">#doing</code>, or <code class="tag">#done</code>.
		</p>

		<details>

		    <summary>More information</summary>

		    <h4>Priorities</h4>

		    <p>
		        List Highlighter uses four different list styles, based on priority:
		    </p>

		    <dl>
		        <div>
		            <dt class="high">High</dt>
		            <dd>lists have a highlighted background</dd>
		        </div>
		        <div>
		            <dt class="normal">Normal</dt>
		            <dd>lists have the default appearance (no change)</dd>
		        </div>
		        <div>
		            <dt class="low">Low</dt>
		            <dd>lists are dimmed a little bit</dd>
		        </div>
		        <div>
		            <dt class="ignore">Ignore</dt>
		            <dd>lists are faded and grayed out</dd>
		        </div>
		    </dl>

		    <h4>Titles</h4>

		    <p>The following titles can be used. Titles are not case sensitive.</p>

		    <table>
		        <thead>
		            <tr>
		                <th>Title</th>
		                <th>Priority applied</th>
		                <th>Other effects</th>
		            </tr>
		        </thead>
		        <tbody>
		            <tr>
		                <td><strong>Doing</strong> or <strong>Today</strong></td>
		                <td><span class="high">high</span></td>
		                <td>low priority applied to all untagged lists</td>
		            </tr>
		            <tr>
		                <td><strong>Todo</strong> or <strong>To do</strong></td>
		                <td><span class="normal">normal</span></td>
		                <td>low priority applied to all untagged lists</td>
		            </tr>
		            <tr>
		                <td><strong>Done</strong> or <strong>Trash</strong></td>
		                <td><span class="done">ignore</span></td>
		                <td><del>strikethrough</del> applied to cards on the list</td>
		            </tr>
		        </tbody>
		    </table>

		    <h4>Hashtags</h4>

		    <table>
		        <thead>
		            <tr>
		                <th>Tag</th>
		                <th>Priority applied</th>
		                <th>Other effects</th>
		            </tr>
		        </thead>
		        <tbody>
		            <tr>
		                <td><code class="tag">#high</code>, <code class="tag">#today</code>, <code class="tag">#doing</code></td>
		                <td><span class="high">high</span></td>
		                <td>low priority applied to all untagged lists</td>
		            </tr>
		            <tr>
		                <td><code class="tag">#normal</code>, <code class="tag">#todo</code>, <code class="tag">#to do</code></td>
		                <td><span class="normal">normal</span></td>
		                <td>low priority applied to all untagged lists</td>
		            </tr>
		            <tr>
		                <td><code class="tag">#low</code></td>
		                <td><span class="low">low</span></td>
		                <td><i>none</i></td>
		            </tr>
		            <tr>
		                <td><code class="tag">#ignore</code></td>
		                <td><span class="ignore">ignore</span></td>
		                <td><i>none</i></td>
		            </tr>
		            <tr>
		                <td><code class="tag">#trash</code>, <code class="tag">#done</code></td>
		                <td><span class="done">ignore</span></td>
		                <td><del>strikethrough</del> applied to cards</td>
		            </tr>
		        </tbody>
		    </table>

		    <p><strong>Examples</strong>: &ldquo;Remaining tasks #todo&rdquo;, &ldquo;Urgent tasks #high&rdquo;, &ldquo;Backlog #low&rdquo;, &ldquo;Abandoned tasks&nbsp;#ignore&rdquo;, &ldquo;Completed tasks #done&rdquo;</p>

			<h4>Notes</h4>

		    <ul>
		        <li>Hashtags override titles</li>
		        <li>Hashtags only appear when you are editing the title, although you can change this in Fine Tuning, below</li>
		        <li>The first tag is applied and others are ignored. E.g. &ldquo;Abandoned #ignore #high&rdquo; will be highlighted as an ignore list, and the title text will appear as &ldquo;Abandoned #high&rdquo;</li>
		        <li>Tags will be visible on other platforms, e.g. mobile apps and browsers without this extension installed</li>
		    </ul>

		</details>
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
							{if $tile.colorName == 'default'}
								Default
							{else}
								{$tile.colorName|ucwords}
							{/if}
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
						<pattern id="Beach" patternUnits="objectBoundingBox" width="1" height="1">
							<image xlink:href="/img/thumbnail.jpg" width="85" height="60" />
						</pattern>
						<pattern id="BeachLg" patternUnits="objectBoundingBox" width="1" height="1">
							<image xlink:href="/img/dummyBackgroundPhoto.jpg" width="680" height="393" />
						</pattern>
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
						<text x="685" y="53" id="BackgroundColorsHeader">Change Background</text>

						<rect class="trello-bg-color-selected" data-trello-bg="blue"	x="660" y="65"  width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="orange"	x="760" y="65"  width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="green"	x="660" y="140" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="red"		x="760" y="140" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="purple"	x="660" y="215" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="pink"	x="760" y="215" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="lime"	x="660" y="290" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="sky"		x="760" y="290" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="gray"	x="660" y="365" width="95" height="70" rx="7" ry="7" />
						<rect class="trello-bg-color-selected" data-trello-bg="photo"	x="760" y="365" width="95" height="70" rx="7" ry="7" />

						<rect id="BlueButton"	class="trello-bg-color-button" data-trello-bg="blue"	x="665" y="70"  width="85" height="60" rx="3" ry="3" />
						<rect id="OrangeButton"	class="trello-bg-color-button" data-trello-bg="orange"	x="765" y="70"  width="85" height="60" rx="3" ry="3" />
						<rect id="GreenButton"	class="trello-bg-color-button" data-trello-bg="green"	x="665" y="145" width="85" height="60" rx="3" ry="3" />
						<rect id="RedButton"	class="trello-bg-color-button" data-trello-bg="red"		x="765" y="145" width="85" height="60" rx="3" ry="3" />
						<rect id="PurpleButton" class="trello-bg-color-button" data-trello-bg="purple"	x="665" y="220" width="85" height="60" rx="3" ry="3" />
						<rect id="PinkButton"	class="trello-bg-color-button" data-trello-bg="pink"	x="765" y="220" width="85" height="60" rx="3" ry="3" />
						<rect id="LimeButton"	class="trello-bg-color-button" data-trello-bg="lime"	x="665" y="295" width="85" height="60" rx="3" ry="3" />
						<rect id="SkyButton"	class="trello-bg-color-button" data-trello-bg="sky"		x="765" y="295" width="85" height="60" rx="3" ry="3" />
						<rect id="GrayButton"	class="trello-bg-color-button" data-trello-bg="gray"	x="665" y="370" width="85" height="60" rx="3" ry="3" />
						<rect id="PhotoButton"	class="trello-bg-color-button" data-trello-bg="photo"	x="765" y="370" width="85" height="60" rx="3" ry="3" />
					</g>
					<rect width="865" height="10" style="fill: url(#DropShadow);"/>
				</svg>

			</div>

		</details>

	</section>

	<section>

		<h2>More features</h2>

		<h3>
			Split up long lists with sub-headers and separators
		</h3>

		<ul class="color-tile-bar standard-bar">
			<li>
				<input type="checkbox" class="options-input color-tile-input" id="EnableHeaderCards" name="EnableHeaderCards">
				<label for="EnableHeaderCards" class="color-tile-label standard-input">
					Header cards
				</label>
			</li>
			<li>
				<input type="checkbox" class="options-input color-tile-input" id="EnableSeparatorCards" name="EnableSeparatorCards">
				<label for="EnableSeparatorCards" class="color-tile-label standard-input">
					Separator cards
				</label>
			</li>
		</ul>

		<details>

			<summary>More information</summary>

			<h4>Header cards</h4>
			<p>To make a header card, start your card text with one of these patterns. Header cards look like Trello list headers and help break up long lists.</p>
			<ul>
				<li>One or more hash (pound) symbols (<code class="tag">#</code>), as in Markdown</li>
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
			<p>To make a separator card, type two or more line symbols in a row, and no other text. Line symbols are dashes (<code class="tag">--</code>), equals signs (<code class="tag">==</code>) or underscores (<code class="tag">__</code>). Separator cards turn into horizontal lines, and make a visual gap between cards.</p>
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

	<section>

		<h2>Fine tuning</h2>

		<p>Fiddly little options to tweak how List Highlighter operates</p>

		<details>

			<summary>Options</summary>

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

	<footer>
		<p>
			For more information visit the
			<a href="http://beingmrkenny.co.uk/web-extensions/list-highlighter-trello">List Highlighter for Trello</a>
			homepage
		</p>
		<p>
			Beach photo by <a href="https://unsplash.com/photos/nFSw6m01-38?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Breno Machado</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
		</p>
		<p>
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
