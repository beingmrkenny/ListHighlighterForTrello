class Color {

    // red, green and blue are stored internally as a number in the range 0 - 255
    // alpha is stored internally as a number in the range 0 - 1

	constructor (string) {
		if (typeof string == 'string') {
			switch(true) {
				case Color.isRGB(string) :
					this.fromRGB(string);
					break;
				case Color.isHSL(string) :
					this.fromHSL(string);
					break;
				case Color.isHex(string) :
					this.fromHex(string);
					break;
			}
		}
	}

	static isRGB(string) {
		string = string.toLowerCase().trim();
		return string.startsWith('rgb');
	}

	static isHSL(string) {
		string = string.toLowerCase().trim();
		return string.startsWith('hsl');
	}

	static isHex(string) {
		return /^#?(?:[a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})$/i.test(string);
	}

	fromRGB() {

		if (arguments.length === 1 && typeof arguments[1] == 'string') {

			let matches = arguments[0].match(/rgba? *\( *([\d\.]+%?),? *([\d\.]+%?),? *([\d\.]+%?)(?: *[,/]? *([\d\.]+%?))? *\)/i);

			this.red = (matches[1].endsWith('%'))
				? Math.round((parseInt(matches[1]) / 100) * 255)
				: parseInt(matches[1]);

			this.green = (matches[2].endsWith('%'))
				? Math.round((parseInt(matches[2]) / 100) * 255)
				: parseInt(matches[2]);

			this.blue = (matches[3].endsWith('%'))
				? Math.round((parseInt(matches[3]) / 100) * 255)
				: parseInt(matches[3]);

			if (matches[4]) {

				this.alpha = (matches[4].endsWith('%'))
					? Math.round((parseInt(matches[4]) / 100))
					: parseInt(matches[4]);
			}

		} else {

			this.red   = arguments[0];
			this.green = arguments[1];
			this.blue  = arguments[2];

			if (arguments[4]) {
				let a = parseInt(arguments[4]);
				this.alpha = (a > 1) ? a / 100 : a;
			}

		}

	}

	getHSLFromArguments () {

		var h, s, l, a = 1;

		if (arguments.length === 1 && typeof arguments[0] == 'string') {

			let matches = arguments[0].match(/hsla? *\(([\d\.]+(?:deg|rad|grad|turn)?) *,? *([\d\.]+%) *,? *([\d\.]+%) *[,\/]? *([\d\.]+%?)?\)*/i);

			let hueAngle = parseInt(matches[1]);

			switch (true) {

				case matches[1].endsWith('rad'):
					h = (hueAngle * 180 / Math.PI) / 360;
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

			s = (arguments[1] > 1)
				? arguments[1] / 100
				: arguments[1];

			l = (arguments[2] > 1)
				? arguments[2] / 100
				: arguments[2];

			if (typeof arguments[3] == 'number') {
				a = (arguments[3] > 1)
					? arguments[3] / 100
					: arguments[3];
			}

		}

		return [h, s, l, a];

	}

	// based on https://gist.github.com/mjackson/5311256
	fromHSL() {

		var h, s, l, a, r, g, b;

		[h, s, l, a] = this.getHSLFromArguments.apply(null, arguments);

		if (s == 0) {

			r = g = b = l; // achromatic

		} else if (l == 1) {

			r = g = b = 1; // white

		} else {

			function hue2rgb(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1/6) return p + (q - p) * 6 * t;
				if (t < 1/2) return q;
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			let q = (l < 0.5)
				? l * (1 + s)
				: l + s - l * s;

			let p = 2 * l - q;

			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		this.red   = Math.round( r * 255 );
		this.green = Math.round( g * 255 );
		this.blue  = Math.round( b * 255 );

		if (a < 1) {
			this.alpha = a;
		}

	}

	fromHex(string) {

		var hex = /#?([a-f\d]*)/i.exec(string)[1],
			len = hex.length || 0;

		if (len == 3 || len == 4) {
			let arr = hex.split();
			hex = '';
			for (let i = 0, x = arr.length; i<x; i++) {
				hex += `${arr[i]}${arr[i]}`;
			}
		}

		let matches = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?/i.exec(hex);

		if (matches) {
			this.red   = parseInt(matches[1], 16);
			this.green = parseInt(matches[2], 16);
			this.blue  = parseInt(matches[3], 16);
			if (matches[4]) {
				this.alpha = parseInt(matches[4], 16) / 255;
			}
		}

	}

	toRGB() {
		var a = (typeof this.alpha == 'number' && (this.alpha >= 0 && this.alpha <= 1)) ? this.alpha : 1;
		if (a < 1) {
			return `rgba(${this.red}, ${this.green}, ${this.blue}, ${a})`;
		}
		return `rgb(${this.red}, ${this.green}, ${this.blue})`;
	}

    // based on https://gist.github.com/mjackson/5311256
	toHSL() {

		var r = this.red / 255,
			g = this.green / 255,
			b = this.blue / 255,
			max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			h, s, l = (max + min) / 2,
			a = (typeof this.alpha == 'number' && (this.alpha >= 0 && this.alpha <= 1)) ? this.alpha : 1;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			let d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		this.hue = 360 * ((h*100+0.5)|0)/100;
		this.saturation = ((s*100+0.5)|0);
		this.lightness = ((l*100+0.5)|0);

		if (a < 1) {
			return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${a})`;
		}

		return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
	}

	getHue() {
		return this.hue;
	}

	getSaturation() {
		return this.saturation;
	}

	getLightness() {
		return this.lightness;
	}

	toHex() {

		var r = this.componentToHex(this.red),
			g = this.componentToHex(this.green),
			b = this.componentToHex(this.blue),
			a = '';

		if (typeof this.alpha == 'string') {
			a = this.componentToHex(this.alpha);
		}

		return `#${r}${g}${b}${a}`;
	}

	componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	isLight() {
		var threshold = 1 - (
				(0.2 * this.red) + (0.5 * this.green) + (0.114 * this.blue)
			) / 255;
		return threshold < 0.5;
	}

	getRandomHSL() {
		var hue = $number.getRandomInt(0, 255);
		while (hue < window.lastHue + 10 && hue > window.lastHue - 10) {
			hue = $number.getRandomInt(0, 255);
		}
		window.lastHue = hue;
		this.fromHSL(hue, 60, 80)
	}

	static isLight (color) {
		var colour = new Color(color);
		return colour.isLight();
	}

}
