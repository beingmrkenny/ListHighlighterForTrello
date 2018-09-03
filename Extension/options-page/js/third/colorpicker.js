/**
 * ColorPicker - pure JavaScript color picker without using images, external CSS or 1px divs.
 * Copyright © 2011 David Durman, All rights reserved.
 */
function ColorPickerInitialise () {

	var picker = qid('Picker'), slide = qid('Slide'), hueOffset = 15;

	// Credits to http://www.raphaeljs.com
	function hsv2rgb(hsv) {
		var R, G, B, X, C;
		var h = (hsv.h % 360) / 60;

		C = hsv.v * hsv.s;
		X = C * (1 - Math.abs(h % 2 - 1));
		R = G = B = hsv.v - C;

		h = ~~h;
		R += [C, X, 0, 0, X, C][h];
		G += [X, C, C, X, 0, 0][h];
		B += [0, 0, X, C, C, X][h];

		var r = Math.floor(R * 255);
		var g = Math.floor(G * 255);
		var b = Math.floor(B * 255);
		return { r: r, g: g, b: b, hex: "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1) };
	}

	// Credits to http://www.raphaeljs.com
	function rgb2hsv(rgb) {

		var r = rgb.r;
		var g = rgb.g;
		var b = rgb.b;

		if (rgb.r > 1 || rgb.g > 1 || rgb.b > 1) {
			r /= 255;
			g /= 255;
			b /= 255;
		}

		var H, S, V, C;
		V = Math.max(r, g, b);
		C = V - Math.min(r, g, b);
		H = (C == 0 ? null :
			V == r ? (g - b) / C + (g < b ? 6 : 0) :
			V == g ? (b - r) / C + 2 :
					(r - g) / C + 4);
		H = (H % 6) * 60;
		S = C == 0 ? 0 : C / V;
		return { h: H, s: S, v: V };
	}

	function slideListener(event) {

		var mouse = getCoords(event, box);

		ctx.h = (box.height > box.width)
			? mouse.y / box.height * 360 + hueOffset
			: mouse.x / box.width * 360;
		var pickerColor = hsv2rgb({ h: ctx.h, s: 1, v: 1 });
		var c = hsv2rgb({ h: ctx.h, s: ctx.s, v: ctx.v });
		ctx.pickerElement.style.backgroundColor = pickerColor.hex;
		ctx.callback && ctx.callback (
			c.hex,
			{ h: ctx.h - hueOffset, s: ctx.s, v: ctx.v },
			{ r: c.r, g: c.g, b: c.b },
			undefined,
			mouse
		);
	};

	function pickerListener(event) {

		var mouse = getCoords(event, box);

		ctx.s = mouse.x / box.width;
		ctx.v = (box.height - mouse.y) / box.height;
		var c = hsv2rgb(ctx);
		ctx.callback && ctx.callback(
			c.hex,
			{ h: ctx.h - hueOffset, s: ctx.s, v: ctx.v },
			{ r: c.r, g: c.g, b: c.b },
			mouse
		);
	};

	function ColorPicker(slideElement, pickerElement, callback) {

		if (!(this instanceof ColorPicker)) return new ColorPicker(slideElement, pickerElement, callback);

		this.h = 0;
		this.s = 1;
		this.v = 1;

		this.callback = callback;
		this.pickerElement = pickerElement;
		this.slideElement = slideElement;

		// REVIEW refactor to avoid global variables
		// namely ctx and box
		// Here to end of the function

		window.ctx = this;

		this.pickerElement.addEventListener('click', function (event) {
			pickerListener(event, this.getBoundingClientRect())
		});

		this.slideElement.addEventListener('click', function (event) {
			slideListener(event, this.getBoundingClientRect());
		});

		this.pickerElement.addEventListener('mousedown', function () {
			document.body.style.userSelect = 'none';
			window.box = this.getBoundingClientRect();
			window.addEventListener('mousemove', pickerListener);
		});

		this.slideElement.addEventListener('mousedown', function () {
			document.body.style.userSelect = 'none';
			window.box = this.getBoundingClientRect();
			window.addEventListener('mousemove', slideListener);
		});

		window.addEventListener('mouseup', function () {
			document.body.style.userSelect = null;
			window.removeEventListener('mousemove', pickerListener);
			window.removeEventListener('mousemove', slideListener);
		});

	};

	function getCoords (event, box) {
		var x = event.clientX - box.left,
			y = event.clientY - box.top;
		x = (x > box.width) ? box.width : (x < 0) ? 0 : x;
		y = (y > box.height) ? box.height : (y < 0) ? 0 : y;
		return { x:x, y:y };
	}

	ColorPicker.hsv2rgb = function(hsv) {
		var rgbHex = hsv2rgb(hsv);
		delete rgbHex.hex;
		return rgbHex;
	};

	ColorPicker.hsv2hex = function(hsv) {
		return hsv2rgb(hsv).hex;
	};

	ColorPicker.rgb2hsv = rgb2hsv;

	ColorPicker.rgb2hex = function(rgb) {
		return hsv2rgb(rgb2hsv(rgb)).hex;
	};

	ColorPicker.hex2hsv = function(hex) {
		return rgb2hsv(ColorPicker.hex2rgb(hex));
	};

	ColorPicker.hex2rgb = function(hex) {
		return { r: parseInt(hex.substr(1, 2), 16), g: parseInt(hex.substr(3, 2), 16), b: parseInt(hex.substr(5, 2), 16) };
	};

	// ctx - ColorPicker instance
	function setColor(ctx, hsv, rgb, hex) {
		ctx.h = hsv.h % 360;
		ctx.s = hsv.s;
		ctx.v = hsv.v;

		var c = hsv2rgb(ctx);

		var slideCoords = {
				x: (ctx.h * ctx.slideElement.offsetWidth) / 360,
				y: 0,
			};

		var pickerHeight = ctx.pickerElement.offsetHeight;

		var pickerCoords = {
			x: ctx.s * ctx.pickerElement.offsetWidth,
			y: pickerHeight - ctx.v * pickerHeight
		};

		ctx.pickerElement.style.backgroundColor = hsv2rgb({ h: ctx.h, s: 1, v: 1 }).hex;
		ctx.callback && ctx.callback(hex || c.hex, { h: ctx.h, s: ctx.s, v: ctx.v }, rgb || { r: c.r, g: c.g, b: c.b }, pickerCoords, slideCoords);

		return ctx;
	};

	ColorPicker.prototype.setHsv = function(hsv) {
		return setColor(this, hsv);
	};

	ColorPicker.prototype.setRgb = function(rgb) {
		return setColor(this, rgb2hsv(rgb), rgb);
	};

	ColorPicker.prototype.setHex = function(hex) {
		return setColor(this, ColorPicker.hex2hsv(hex), undefined, hex);
	};

	ColorPicker.positionIndicators = function(slideIndicator, pickerIndicator, slideCoords, pickerCoords) {

		if (slideCoords) {
			slideIndicator.style.left = (slideCoords.x - slideIndicator.offsetWidth/2) + 'px';
		}
		if (pickerCoords) {
			pickerIndicator.style.top = (pickerCoords.y - pickerIndicator.offsetHeight/2) + 'px';
			pickerIndicator.style.left = (pickerCoords.x - pickerIndicator.offsetWidth/2) + 'px';
		}
	};

	window.ColorPicker = ColorPicker;

}
