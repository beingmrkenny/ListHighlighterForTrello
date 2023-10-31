const OriginalListBG = '#ebecf0';

class Color {
	// red, green and blue are stored internally as a number in the range 0 - 255
	// alpha is stored internally as a number in the range 0 - 1

	constructor(colorString) {
		if (typeof colorString == 'string') {
			switch (true) {
				case this.isHex(colorString):
					this.fromHex(colorString);
					break;
				case this.isHSL(colorString):
					this.fromHSL(colorString);
					break;
				case this.isHSV(colorString):
					this.fromHSV(colorString);
					break;
				case this.isRGB(colorString):
					this.fromRGB(colorString);
					break;
			}
		}
	}

	isHex(string) {
		return /^#?(?:[a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})$/i.test(string);
	}

	isHSL(string) {
		string = string.toLowerCase().trim();
		return string.startsWith('hsl');
	}

	isHSV(string) {
		string = string.toLowerCase().trim();
		return /^hs[bv]/i.test(string);
	}

	isRGB(string) {
		string = string.toLowerCase().trim();
		return string.startsWith('rgb');
	}

	/* All the from...() functions take inputs, and they save the RGB back to this */

	fromHex(hexString) {
		var hex;

		if (!hexString) {
			throw new Error('Must be given arguments');
		}

		// e.g. 3 code (rgb); 4 code (rgba), 6 code (rrggbb), 8 code (rrggbbaa);
		var hex = /^#?([a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})$/i.exec(
			hexString
		)[1];

		// convert this to the full version
		if (hex.length == 3 || hex.length == 4) {
			let arr = hex.split();
			hex = '';
			for (let i = 0, x = arr.length; i < x; i++) {
				hex += `${arr[i]}${arr[i]}`;
			}
		}

		let matches = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?/i.exec(
			hex
		);

		this.red = parseInt(matches[1], 16);
		this.green = parseInt(matches[2], 16);
		this.blue = parseInt(matches[3], 16);
		this.alpha = matches[4] ? parseInt(matches[4], 16) / 255 : 1;

		this.hex = `#${hex}`;

		this.toHSL();
		this.toHSV();
	}

	fromHSL() {
		// based on https://gist.github.com/mjackson/5311256

		if (!arguments) {
			throw new Error('Must be given arguments');
		}

		var h, s, l, a, r, g, b;

		[h, s, l, a] = this._getHSLFromArguments.apply(null, arguments);

		if (s == 0) {
			r = g = b = l; // achromatic
		} else if (l == 1) {
			r = g = b = 1; // white
		} else {
			function hue2rgb(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			}

			let q = l < 0.5 ? l * (1 + s) : l + s - l * s;

			let p = 2 * l - q;

			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		this.red = Math.round(r * 255);
		this.green = Math.round(g * 255);
		this.blue = Math.round(b * 255);

		this.hue = h;
		this.saturation_hsl = s;
		this.lightness = l;

		if (a <= 1 && a >= 0) {
			this.alpha = a;
		} else if (a < 0) {
			this.alpha = 0;
		} else if (a > 1) {
			this.alpha = 1;
		}

		this.toHex();
		this.toHSV();
	}

	fromHSV() {
		if (!arguments) {
			throw new Error('Must be given arguments');
		}

		var h, s, v, a, r, g, b;

		[h, s, v, a] = this._getHSVFromArguments.apply(null, arguments);

		h /= 360;
		s /= 100;
		v /= 100;

		var i, f, p, q, t;

		i = Math.floor(h * 6);
		f = h * 6 - i;
		p = v * (1 - s);
		q = v * (1 - f * s);
		t = v * (1 - (1 - f) * s);

		switch (i % 6) {
			case 0:
				(r = v), (g = t), (b = p);
				break;
			case 1:
				(r = q), (g = v), (b = p);
				break;
			case 2:
				(r = p), (g = v), (b = t);
				break;
			case 3:
				(r = p), (g = q), (b = v);
				break;
			case 4:
				(r = t), (g = p), (b = v);
				break;
			case 5:
				(r = v), (g = p), (b = q);
				break;
		}

		if (r < 0) {
			r = 0 - r;
		}
		if (g < 0) {
			g = 0 - g;
		}
		if (b < 0) {
			b = 0 - b;
		}

		this.red = Math.round(r * 255);
		this.green = Math.round(g * 255);
		this.blue = Math.round(b * 255);

		this.hue = h;
		this.saturation_hsv = s;
		this.value = v;

		if (a <= 1 && a >= 0) {
			this.alpha = a;
		} else if (a < 0) {
			this.alpha = 0;
		} else if (a > 1) {
			this.alpha = 1;
		}

		this.toHex();
		this.toHSL();
	}

	fromRGB() {
		if (!arguments) {
			throw new Error('Must be given arguments');
		}

		if (arguments.length === 1 && typeof arguments[0] == 'string') {
			let matches = arguments[0].match(
				/rgba? *\( *([\d\.]+%?),? *([\d\.]+%?),? *([\d\.]+%?)(?: *[,/]? *([\d\.]+%?))? *\)/i
			);

			this.red = matches[1].endsWith('%')
				? Math.round((parseInt(matches[1]) / 100) * 255)
				: parseInt(matches[1]);

			this.green = matches[2].endsWith('%')
				? Math.round((parseInt(matches[2]) / 100) * 255)
				: parseInt(matches[2]);

			this.blue = matches[3].endsWith('%')
				? Math.round((parseInt(matches[3]) / 100) * 255)
				: parseInt(matches[3]);

			if (matches[4]) {
				this.alpha = matches[4].endsWith('%')
					? Math.round(parseInt(matches[4]) / 100)
					: parseInt(matches[4]);
			}
		} else {
			this.red = arguments[0];
			this.green = arguments[1];
			this.blue = arguments[2];

			if (arguments[4]) {
				let a = parseInt(arguments[4]);
				this.alpha = a > 1 ? a / 100 : a;
			}
		}

		this.toHex();
		this.toHSL();
		this.toHSV();
	}

	/* All the to...() functions read from this, save to this and return an appropriate CSS string - all calculations are done from the RGB values */

	toHex() {
		var r = this._componentToHex(this.red),
			g = this._componentToHex(this.green),
			b = this._componentToHex(this.blue),
			a = '';

		if (this.alpha < 1) {
			a = this._componentToHex(this.alpha);
		}

		this.hex = `#${r}${g}${b}${a}`;

		return this.hex;
	}

	toHSL() {
		// based on https://gist.github.com/mjackson/5311256

		var r = this.red / 255,
			g = this.green / 255,
			b = this.blue / 255,
			max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			h,
			s,
			l = (max + min) / 2,
			a =
				typeof this.alpha == 'number' && this.alpha >= 0 && this.alpha <= 1
					? this.alpha
					: 1;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			let d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		this.hue = (360 * ((h * 100 + 0.5) | 0)) / 100;
		this.saturation_hsl = (s * 100 + 0.5) | 0;
		this.lightness = (l * 100 + 0.5) | 0;

		return a < 1
			? `hsla(${this.hue}, ${this.saturation_hsl}%, ${this.lightness}%, ${a})`
			: `hsl(${this.hue}, ${this.saturation_hsl}%, ${this.lightness}%)`;
	}

	toHSV() {
		// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately

		var r = this.red,
			g = this.green,
			b = this.blue,
			max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			d = max - min,
			h,
			s = max === 0 ? 0 : d / max,
			v = max / 255;

		switch (max) {
			case min:
				h = 0;
				break;
			case r:
				h = g - b + d * (g < b ? 6 : 0);
				h /= 6 * d;
				break;
			case g:
				h = b - r + d * 2;
				h /= 6 * d;
				break;
			case b:
				h = r - g + d * 4;
				h /= 6 * d;
				break;
		}

		// this.hue = (h * 360);
		this.saturation_hsv = s * 100;
		this.value = v * 100;

		let sat = parseFloat(this.saturation_hsv).toFixed(2);
		let bri = parseFloat(this.value).toFixed(2);

		return `HSV(${this.hue}º, ${sat}%, ${bri}%)`;
	}

	toRGB() {
		return this.alpha < 1
			? `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
			: `rgb(${this.red}, ${this.green}, ${this.blue})`;
	}

	/* getters mcgee */

	getHue() {
		return this.hue;
	}

	getSaturation(model = 'hsl') {
		return model == 'hsl' ? this.saturation_hsl : this.saturation_hsv;
	}

	getLightness() {
		return this.lightness;
	}

	getRed() {
		return this.red;
	}

	getBlue() {
		return this.blue;
	}

	getGreen() {
		return this.green;
	}

	getHex() {
		return this.hex;
	}

	getAlpha() {
		return this.alpha;
	}

	getLuminance() {
		var a = [this.red, this.green, this.blue].map((v) => {
			v /= 255;
			return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
		});
		return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
	}

	/* helpers */

	_getHSLFromArguments() {
		var h,
			s,
			l,
			a = 1;

		if (arguments.length === 1 && typeof arguments[0] == 'string') {
			let matches = arguments[0].match(
				/hsla? *\(([\d\.]+(?:deg|rad|grad|turn)?) *,? *([\d\.]+%) *,? *([\d\.]+%) *[,\/]? *([\d\.]+%?)?\)*/i
			);

			let hueAngle = parseInt(matches[1]);

			switch (true) {
				case matches[1].endsWith('rad'):
					h = (hueAngle * 180) / Math.PI / 360;
					break;

				case matches[1].endsWith('grad'):
					h = hueAngle / 400;
					break;

				case matches[1].endsWith('turn'):
					h = hueAngle;
					break;

				case matches[1].endsWith('deg'):
				default:
					h = hueAngle / 360;
					break;
			}

			s = parseInt(matches[2]) / 100;
			l = parseInt(matches[3]) / 100;
		} else {
			h = arguments[0] / 360;

			s = arguments[1] > 1 ? arguments[1] / 100 : arguments[1];

			l = arguments[2] > 1 ? arguments[2] / 100 : arguments[2];

			if (typeof arguments[3] == 'number') {
				a = arguments[3] > 1 ? arguments[3] / 100 : arguments[3];
			}
		}

		return [h, s, l, a];
	}

	_getHSVFromArguments() {
		var h,
			s,
			v,
			a = 1;

		if (arguments.length === 1 && typeof arguments[0] == 'string') {
			let matches = arguments[0].match(
				/hs[bv]a? *\(([\d\.]+(?:deg|rad|grad|turn)?) *,? *([\d\.]+%) *,? *([\d\.]+%) *[,\/]? *([\d\.]+%?)?\)*/i
			);

			let hueAngle = parseInt(matches[1]);

			switch (true) {
				case matches[1].endsWith('rad'):
					h = (hueAngle * 180) / Math.PI / 360;
					break;

				case matches[1].endsWith('grad'):
					h = hueAngle / 400;
					break;

				case matches[1].endsWith('turn'):
					h = hueAngle;
					break;

				case matches[1].endsWith('deg'):
				default:
					h = hueAngle; // / 360;
					break;
			}

			s = parseInt(matches[2]); // / 100;
			v = parseInt(matches[3]); // / 100;
		} else {
			h = arguments[0] / 360;

			s = arguments[1] > 1 ? arguments[1] / 100 : arguments[1];

			v = arguments[2] > 1 ? arguments[2] / 100 : arguments[2];

			if (typeof arguments[3] == 'number') {
				a = arguments[3] > 1 ? arguments[3] / 100 : arguments[3];
			}
		}

		return [h, s, v, a];
	}

	_componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? '0' + hex : hex;
	}

	isLightOld() {
		var threshold =
			1 - (0.2 * this.red + 0.5 * this.green + 0.114 * this.blue) / 255;
		return threshold < 0.5;
	}

	isLight() {
		const test = this.getLuminance();
		const white = 1;
		const dark = 0.06301001765316767;

		const ratioToWhite =
			white > test
				? (test + 0.05) / (white + 0.05)
				: (white + 0.05) / (test + 0.05);

		const ratioToDark =
			dark > test
				? (test + 0.05) / (dark + 0.05)
				: (dark + 0.05) / (test + 0.05);

		if (ratioToWhite > ratioToDark) {
			return true;
		} else if (ratioToWhite < ratioToDark) {
			return false;
		} else {
			return this.isLightOld();
		}
	}

	getRandomHSL() {
		var hue = $number.getRandomInt(0, 255);
		while (hue < window.lastHue + 10 && hue > window.lastHue - 10) {
			hue = $number.getRandomInt(0, 255);
		}
		window.lastHue = hue;
		this.fromHSL(hue, 60, 80);
	}

	static isHex(color) {
		var colour = new Color();
		return colour.isHex(color);
	}

	static isLight(color) {
		var colour = new Color(color);
		return colour.isLight();
	}

	static getOriginalListBG() {
		return OriginalListBG;
	}
}

if (typeof exports === 'object') {
	module.exports = Color;
	registeredInModuleLoader = true;
}
