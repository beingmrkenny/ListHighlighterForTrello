<template id="ColorPicker">
	<color-picker hidden>
		<component-picker class="sv-picker">
			<range-display class="sv-range">
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" id="Picker">
					<defs>
						<linearGradient id="GradientBlack" x1="0%" y1="100%" x2="0%" y2="0%">
							<stop offset="0%"   stop-color="#000000" stop-opacity="1"></stop>
							<stop offset="100%" stop-color="#CC9A81" stop-opacity="0"></stop>
						</linearGradient>
						<linearGradient id="GradientWhite" x1="0%" y1="100%" x2="100%" y2="100%">
							<stop offset="0%"   stop-color="#FFFFFF" stop-opacity="1"></stop>
							<stop offset="100%" stop-color="#CC9A81" stop-opacity="0"></stop>
						</linearGradient>
					</defs>
					<rect x="0" y="0" width="100%" height="100%" fill="url(#GradientWhite)"></rect>
					<rect x="0" y="0" width="100%" height="100%" fill="url(#GradientBlack)"></rect>
				</svg>
			</range-display>
			<position-indicator class="sv-indicator" style="top: 0; left: 100%; background-color: white;"></position-indicator>
		</component-picker>
		<component-picker class="hue-picker">
			<range-display class="hue-range">
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" id="Slide">
					<defs>
						<linearGradient id="GradientHSV" x1="100%" y1="0%" x2="0%" y2="0%">
							<stop offset="0%"   stop-color="#FF0000" stop-opacity="1"></stop>
							<stop offset="13%"  stop-color="#FF00FF" stop-opacity="1"></stop>
							<stop offset="25%"  stop-color="#8000FF" stop-opacity="1"></stop>
							<stop offset="38%"  stop-color="#0040FF" stop-opacity="1"></stop>
							<stop offset="50%"  stop-color="#00FFFF" stop-opacity="1"></stop>
							<stop offset="63%"  stop-color="#00FF40" stop-opacity="1"></stop>
							<stop offset="75%"  stop-color="#0BED00" stop-opacity="1"></stop>
							<stop offset="88%"  stop-color="#FFFF00" stop-opacity="1"></stop>
							<stop offset="100%" stop-color="#FF0000" stop-opacity="1"></stop>
						</linearGradient>
					</defs>
					<rect x="0" y="0" width="100%" height="100%" fill="url(#GradientHSV)"></rect>
				</svg>
			</range-display>
			<position-indicator class="hue-indicator" style="left: 0;"></position-indicator>
		</component-picker>
		<div class="custom-color-picker-button-container">
			{foreach from=$defaultTiles item=tile}
				{if $tile.colorName != 'custom'}
					<button type="button" class="custom-color-picker-button" data-color="{$tile.color}" style="background-color: {$tile.color};"></button>
				{/if}
			{/foreach}
		</div>
		<input type="text" id="ColorHex" pattern="{literal}^#?[a-fA-F0-9]{3}(?:[a-fA-F0-9]{3})?${/literal}">
		<hr class="spacer">
		<button type="button" id="CancelColor">Cancel</button>
		<button type="button" class="mod-primary" id="SaveColor">Save</button>
	</color-picker>
</template>
