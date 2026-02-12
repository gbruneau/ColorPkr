const defaultColor = '#808080';

class Color {
    /**
     * Create a Color instance.
     * @param {string} hex - The hex code of the color (e.g., '#FFFFFF').
     * @param {string} name - The name of the color (e.g., 'White').
     */

    constructor(hex = defaultColor, name = '') {
        this.hex = hex;
        this.name = name === '' ? hex : name;
        this.colorID = crypto.randomUUID();
    }

    /** when set hex , default name to hex value */
    set hex(value) {
        this._hex = value;
        this._name = value;
    }

    /** get hex code */
    get hex() {
        return this._hex;
    }

    /** set name of color */
    set name(value) {
        this._name = value;
    }

    /** get name of color */
    get name() {
        return this._name;
    }

    //** r,g, and b as decimal properties reflected in the hex   */
    get r() {
        return parseInt(this._hex.slice(1, 3), 16);
    }

    get g() {
        return parseInt(this._hex.slice(3, 5), 16);
    }

    get b() {
        return parseInt(this._hex.slice(5, 7), 16);
    }

    //** set r,g, and b as decimal properties reflected in the hex   */
    set r(value) {
        this._hex = `#${value.toString(16).padStart(2, '0')}${this._hex.slice(3)}`;
    }

    set g(value) {
        this._hex = `#${this._hex.slice(1, 3)}${value.toString(16).padStart(2, '0')}${this._hex.slice(5)}`;
    }
    set b(value) {
        this._hex = `#${this._hex.slice(1, 5)}${value.toString(16).padStart(2, '0')}`;
    }
    /** get rgb as formated string */
    get rgb() {
        return `rgb(${this.r},${this.g},${this.b})`;
    }
    /** get and set HSL  */
    get hsl() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return `hsl(${Math.round(h * 360)},${Math.round(s * 100)}%,${Math.round(l * 100)}%)`;
    }

    set hsl(hslString) {
        const hslMatch = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (!hslMatch) throw new Error('Invalid HSL format');
        let h = parseInt(hslMatch[1]) / 360;
        let s = parseInt(hslMatch[2]) / 100;
        let l = parseInt(hslMatch[3]) / 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        this.r = Math.round(r * 255);
        this.g = Math.round(g * 255);
        this.b = Math.round(b * 255);
    }
    /** get/set H, S and L  */
    get H() {
        return parseInt(this.hsl.match(/hsl\((\d+),/)[1]);
    }
    set H(value) {
        this.hsl = `hsl(${value},${this.S}%,${this.L}%)`;
    }
    get S() {
        return parseInt(this.hsl.match(/,\s*(\d+)%/)[1]);
    }
    set S(value) {
        this.hsl = `hsl(${this.H},${value}%,${this.L}%)`;
    }
    get L() {
        return parseInt(this.hsl.match(/,\s*(\d+)%\)/)[1]);
    }
    set L(value) {
        this.hsl = `hsl(${this.H},${this.S}%,${value}%)`;
    }

    get contrastedColor() {
        // Calculate the brightness of the color
        const brightness = (this.r * 299 + this.g * 587 + this.b * 114) / 1000;
        // Return black for light colors and white for dark colors
        return brightness > 125 ? '#000000' : '#FFFFFF';
    }


    /** static method to generate a random hex color */

    static genRandomColor() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        return `#${randomColor}`;
    }

    static getDefaultColor() {
        return defaultColor;
    }
    static gradient(fromHex, toHex, steps) {
        // TODO: Implement gradient generation
        // gradient from fromHex to toHex with steps steps using HSL interpolation 
        var grad = [];  
        for (let i = 0; i < steps; i++) {
            grad.push(Color.interpolateHSL(fromHex, toHex, i / steps));
        }
        return grad;
    }
    static interpolateHSL(fromHex, toHex, ratio) {
        // TODO: Implement HSL interpolation
        if (ratio < 0 || ratio > 1) {
            throw new Error('Ratio must be between 0 and 1');
        }   
        if (ratio === 0) {
            return fromHex;
        }
        if (ratio === 1) {
            return toHex;
        }   
        const fromColor = new Color(fromHex);
        const toColor = new Color(toHex);
        const newH = fromColor.H + (toColor.H - fromColor.H) * ratio;
        const newS = fromColor.S + (toColor.S - fromColor.S) * ratio;
        const newL = fromColor.L + (toColor.L - fromColor.L) * ratio;
        toColor.H = newH;
        toColor.S = newS;
        toColor.L = newL;
        return toColor.hex;
    }   
}

export default Color;
export { defaultColor };