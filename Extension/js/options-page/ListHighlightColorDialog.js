class ListHighlightColorDialog extends ColorDialog {
	static setup() {
		var rule = Global.getItem(this.fields.id),
			editCustomColorLink = q('.color-tile-edit-color');
		ListHighlightColorDialog.updateDemoListColor(
			ListHighlightColorDialog.getListColor(rule.highlighting.color)
		);
		ListHighlightColorDialog.setOpacityValue(rule.highlighting.opacity, true);
		listen(qid('Opacity'), 'input', function () {
			ListHighlightColorDialog.setOpacityValue(this.value);
		});
		ColorDialog.setup(rule.highlighting.color);
	}

	static setOpacityValue(value, updateInput = false) {
		if (updateInput) {
			qid('Opacity').value = value;
		}
		q('[name="opacity-value"]').textContent = Math.round(value * 100) + '%';
		q('.dummy-board_demo-list').style.opacity = value;
	}
}
