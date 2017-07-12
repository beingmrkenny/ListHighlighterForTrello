function setupColorPicker (colorTileLabel) {

    var input = colorTileLabel.parentNode.querySelector('input'),
        boundingRect = colorTileLabel.getBoundingClientRect(),
        top = boundingRect.top + window.scrollY,
        left = boundingRect.left + window.scrollX + colorTileLabel.offsetWidth + 10;

    var existing = $('color-picker'),
        isDefaultBoard = j(input.dataset.default),
        previousColor = input.value,
        colorPicker = getTemplate('ColorPicker'),
        colorTilebar = input.closest('.color-tile-bar');

    if (existing) {
        existing.remove();
    }

    colorPicker.hidden = false;
    colorTilebar.appendChild(colorPicker);

    var cp = ColorPicker(
        document.querySelector('.hue-range'),
        document.querySelector('.sv-range'),
        function(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {
            var hue = document.querySelector('.hue-indicator'),
                sv = document.querySelector('.sv-indicator');
            ColorPicker.positionIndicators(hue, sv, sliderCoordinate, pickerCoordinate);
            sv.style.backgroundColor = hex;
            document.getElementById('ColorHex').textContent = hex;
            changeAllTheColors (hex, isDefaultBoard)
        }
    );

    cp.setHex(input.dataset.value);

    $id('CancelColor').addEventListener('click', function () {
        changeAllTheColors (previousColor, isDefaultBoard)
        $('color-picker').remove();
    });

    $id('SaveColor').addEventListener('click', function () {
        var trelloBg = (isDefaultBoard) ? 'default' : $id('DummyBoard').dataset.trelloBg;
        saveCustomColor(trelloBg, input.dataset.value);
        $('color-picker').remove();
    });

}

function changeAllTheColors (hex, isDefaultBoard) {
    if (isDefaultBoard) {
        DefaultColorBar.setCustomColorHex(hex);
        Dummy.setDefaultTileColorHex (hex);
        if ($id('DummyBoard').dataset.listColorName == 'default') {
            Dummy.setDoingListColorHex (hex);
        }
    } else {
        Dummy.setCustomTileColorHex(hex);
    }
}
