class Color {

	// REVIEW these non-static methods
	// why do they take string as an argument, should be using this.string, or be static

	constructor (string) {
		if (typeof string == 'string') {
			this.fromString(string);
		}
	}

	fromString(string) {
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

	static isRGB(string) {
		// return /rgb/i.test(string);
		string = string.toLowerCase().trim();
		return string.startsWith('rgb');
	}

	static isHSL(string) {
		string = string.toLowerCase().trim();
		return string.startsWith('hsl');
		// return /hsl\((\d+), *(\d+)%? *, (\d+)%?\)$/i.test(string);
	}

	static isHex(string) {
		return /^#?([a-f\d]{3})([a-f\d]{3})?$/i.test(string);
	}

	fromRGB() {

		if (arguments.length === 1) {

			let matches = arguments[0].match(/rgba? *\( *(\d+), *(\d+), *(\d+)(?: *, *0?\.\d+)? *\)/i);

			this.red   = parseInt(matches[1]);
			this.green = parseInt(matches[2]);
			this.blue  = parseInt(matches[3]);

			if (matches[4]) {
				this.alpha = parseInt(matches[4]);
			}

		} else {

			this.red   = arguments[0];
			this.green = arguments[1];
			this.blue  = arguments[2];

			if (matches[4]) {
				this.alpha = parseInt(matches[4]);
			}

		}

	}

	fromHSL() {

		var h, s, l,
			r, g, b, m, c, x;

		if (arguments.length === 1) {

			let matches = arguments[0].match(/hsl\((\d+), *(\d+)%? *, (\d+)%?\)$/i);

			h = parseInt(matches[1]);
			s = parseInt(matches[2]);
			l = parseInt(matches[3]);

		} else {

			h = arguments[0];
			s = arguments[1];
			l = arguments[2];

		}

		if (!isFinite(h)) h = 0;
		if (!isFinite(s)) s = 0;
		if (!isFinite(l)) l = 0;

		h /= 60;
		if (h < 0) h = 6 - (-h % 6);
		h %= 6;

		s = Math.max(0, Math.min(1, s / 100));
		l = Math.max(0, Math.min(1, l / 100));

		c = (1 - Math.abs((2 * l) - 1)) * s;
		x = c * (1 - Math.abs((h % 2) - 1));

		if (h < 1) {
			r = c;
			g = x;
			b = 0;
		} else if (h < 2) {
			r = x;
			g = c;
			b = 0;
		} else if (h < 3) {
			r = 0;
			g = c;
			b = x;
		} else if (h < 4) {
			r = 0;
			g = x;
			b = c;
		} else if (h < 5) {
			r = x;
			g = 0;
			b = c;
		} else {
			r = c;
			g = 0;
			b = x;
		}

		m = l - c / 2;

		this.red   = Math.round( (r + m) * 255 );
		this.green = Math.round( (g + m) * 255 );
		this.blue  = Math.round( (b + m) * 255 );

	}

	fromHex(string) {

		var result = /^#?([a-f\d]{3})([a-f\d]{3})?$/i.exec(string);

		if (result) {

			let matches;

			if (string.length == 6 || string.length == 7) {
				matches = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(string);
			} else if (string.length == 3 || string.length == 4) {
				matches = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(string);
			}

			this.red   = parseInt(matches[1], 16);
			this.green = parseInt(matches[2], 16);
			this.blue  = parseInt(matches[3], 16);
		}

	}

	toRGB() {
		return `rgb(${this.red}, ${this.green}, ${this.blue})`;
	}

	toRGBA(alpha) {
		alpha = (typeof alpha == 'number' && (alpha >= 0 && alpha <= 1)) ? alpha : 1;
		return `rgba(${this.red}, ${this.green}, ${this.blue}, ${alpha})`;
	}

	toHSL() {

		var r = this.red / 255,
			g = this.green / 255,
			b = this.blue / 255,
			max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			h, s, l = (max + min) / 2;

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
			b = this.componentToHex(this.blue);
		return `#${r}${g}${b}`;
	}

	componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	isLight() {
		var a = 1 - (
				(0.2 * this.red) + (0.5 * this.green) + (0.114 * this.blue)
			) / 255;
		return a < 0.5;
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
		var colour = new Color();
		colour.fromString(color);
		return colour.isLight();
	}

}
