class ColorDialog {

	static setup (color, normalListColor = false) {
		let hex = ColorDialog.getListColor(color);
		ColorDialog.selectColorTile((color) ? hex : null);
		listen(qq('[name="ColorTile"]'), 'change', ColorDialog.colorTileChangeListener);
		listen(q('.color-tile-edit-color'), 'click', ColorDialog.editCustomColor);
		ColorDialog.updateDemoListColor(hex, qid('ColorTile-normal').disabled);
		Dialogue.setupCheckForChanges();
		ColorDialog.toggleColorInput('colortiles');
		listen(qid('LightnessSlider'), 'input', ColorDialog.greyscaleSliderChangeListener);
		listen(qid('ColorInputToggle'), 'click', () => ColorDialog.toggleColorInput());
		if (normalListColor) {
			ColorDialog.normalListColorSetup(color);
		}
	}

	static normalListColorSetup (color) {
		if (/^\d+(?:\.\d+)?$/.test(color) || color == OriginalListBG) {
			ColorDialog.toggleColorInput('lightness');
			qid('LightnessSlider').value = (color == OriginalListBG) ? '89.4' : color;
		} else {
			ColorDialog.toggleColorInput('colortiles');
		}
		let input = qid('ColorTile-normal');
		input.disabled = true;
		input.parentNode.style.display = 'none';
		q('.opacity-input-label').remove();
		q('.highlight-color-exception-section').remove();
		q('#ListHighlightColorDialog h2').textContent = 'Normal list colour';
		q('.dummy-board_body .dummy-board_list:nth-child(2) .dummy-board_list-header').textContent = 'Another list';
		q('.dummy-board_body .dummy-board_list:nth-child(3) .dummy-board_list-header').textContent = 'Yet another list';
	}

	static toggleColorInput (newMode = null) {
		let dialog = qid('ListHighlightColorDialog'),
			button = qid('ColorInputToggle');
		if (newMode === null) {
			newMode = (dialog.classList.contains('mod-lightness')) ? 'colortiles' : 'lightness';
		}
		qid('ColorInputMode').value = newMode;
		if (newMode == 'lightness') {
			dialog.classList.add('mod-lightness');
			dialog.classList.remove('mod-colortiles');
			button.textContent = 'Choose Colour';
		} else if (newMode == 'colortiles') {
			dialog.classList.add('mod-colortiles');
			dialog.classList.remove('mod-lightness');
			button.textContent = 'Choose Greyscale';
		}
	}

	static getListColor (color) {
		if (/^\d+(?:\.\d+)?$/.test(color)) {
			let newColor = new Color(`hsl(208.2, 6.7%, ${color}%)`);
			color = newColor.toHex();
		}
		return color || document.body.dataset.normalListColor || Color.getOriginalListBG();
	}

	static greyscaleSliderChangeListener () {
		if (this.value) {
			this.dataset.lastValidColor = this.value;
		}
		ColorDialog.updateDemoListColor(ColorDialog.getListColor(this.value), qid('ColorTile-normal').disabled);
	}

	static colorTileChangeListener () {
		if (this.value) {
			this.closest('.color-tile-bar').dataset.lastValidColor = this.value;
		}
		ColorDialog.updateDemoListColor(ColorDialog.getListColor(this.value), qid('ColorTile-normal').disabled);
		if (this.id == 'ColorTile-custom' && this.value == '') {
			ColorDialog.editCustomColor.call(q('.color-tile-edit-color'));
		}
	}

	static selectColorTile (color) {
		let input = (color)
			? q(`[value="${color}"]:not(#ColorTile-custom)`)
			: qid('ColorTile-normal');
		color = color || ColorDialog.getListColor();
		if (!input) {
			input = qid('ColorTile-custom');
			input.value = color;
		}
		if (input.id == 'ColorTile-custom') {
			setBackgroundColor(q(`[for="${input.id}"]`), color);
		}
		q('.color-tile-bar').dataset.lastValidColor = color;
		input.checked = true;
	}

	static updateDemoListColor (hex, allLists = false) {
		let demoLists = (allLists)
			? qq('.dummy-board_list')
			: qq('.dummy-board_demo-list');
		for (let demoList of demoLists) {
			setBackgroundColor(demoList, hex);
		}
	}

	static editCustomColor () {
		this.dataset.colorOnOpen = qid('ColorTile-custom').value;

		new ColorPickerWrapper({
			opener : this,
			initialColor : ColorDialog.getListColor(qid('ColorTile-custom').value),
			place: function (dialog) {
				let parent = q('[for="ColorTile-custom"]'),
					right = parent.offsetWidth + 10;
				parent.appendChild(dialog);
				dialog.classList.add('position-left');
				dialog.style.right = `${right}px`;
			},
			colorUpdateHandler : function (hex) {
				let customLabel = q('[for="ColorTile-custom"]');
				ColorDialog.updateDemoListColor(hex, qid('ColorTile-normal').disabled);
				setBackgroundColor(customLabel, hex);
				qid('ColorTile-custom').value = hex;
			},
			save : () => {
				q('.color-tile-bar').dataset.lastValidColor = qid('ColorTile-custom').value
			},
			cancel : () => {
				let lastValidColor = this.closest('.color-tile-bar').dataset.lastValidColor;
				qid('ColorTile-custom').value = this.dataset.colorOnOpen;
				setBackgroundColor(
					q('[for="ColorTile-custom"]'),
					(this.dataset.colorOnOpen == '') ? null : ColorDialog.getListColor(this.dataset.colorOnOpen)
				);
				ColorDialog.updateDemoListColor(lastValidColor, qid('ColorTile-normal').disabled);
				ColorDialog.selectColorTile(lastValidColor);
			}
		});
	}

}
