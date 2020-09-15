class ColorDialog {

	static setup (color) {
		let hex = ColorDialog.getListColor(color);
		ColorDialog.selectColorTile((color) ? hex : null);
		listen(qq('[name="ColorTile"]'), 'change', ColorDialog.colorTileChangeListener);
		listen(q('.color-tile-edit-color'), 'click', ColorDialog.editCustomColor);
		ColorDialog.updateDemoListColor(hex, qid('ColorTile-normal').disabled);
		Dialogue.setupCheckForChanges();
	}

	static getListColor (color) {
		if (/^\d+(?:\.\d+)?$/.test(color)) {
			let newColor = new Color(`hsl(208.2, 6.7%, ${color}%)`);
			color = newColor.toHex();
		}
		return color || Color.getOriginalListBG();
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
