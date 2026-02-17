const DEFAULT_COLOR = '#808080';

class Color {
    /**
     * Create a Color instance.
     * @param {string} hex - The hex code of the color (e.g., '#FFFFFF').
     * @param {string} name - The name of the color (e.g., 'White').
     */

    constructor(hex = DEFAULT_COLOR, name = '') {
        this._hex = hex;
        this._name = name === '' ? hex : name;
        this._colorID = crypto.randomUUID();
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
        return Color.fromHEXtoHSL(this._hex);
    }

    set hsl(hslString) {
        this._hex = Color.fromHSLtoHEX(hslString);
    }
    /** get/set H, S and L  */
    get h() {
        return parseInt(this.hsl.match(/hsl\((\d+),/)[1]);
    }
    set h(value) {
        this.hsl = Color.HSLfromValues(value, this.s, this.l);
    }
    get s() {
        return parseInt(this.hsl.match(/,\s*(\d+)%/)[1]);
    }
    set s(value) {
        this.hsl = Color.HSLfromValues(this.h, value, this.l);
    }
    get l() {
        return parseInt(this.hsl.match(/,\s*(\d+)%\)/)[1]);
    }
    set l(value) {
        this.hsl = Color.HSLfromValues(this.h, this.s, value);
    }

    get contrastedColor() {
        // Calculate the brightness of the color
        const brightness = (this.r * 299 + this.g * 587 + this.b * 114) / 1000;
        // Return black for light colors and white for dark colors
        return brightness > 125 ? '#000000' : '#FFFFFF';
    }

    static fromHEXtoHSL(hexString) {
        const hex = String(hexString).replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        const newHSL = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`.replace(/ /g, '');
        return newHSL;
    }

    static HSLfromValues(h, s, l) {
        return `hsl(${h},${s}%,${l}%)`.replace(/ /g, '');
    }

    static fromHSLtoHEX(hslString) {
        const hslMatch = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (!hslMatch) throw new Error('Invalid HSL format');
        let h = parseInt(hslMatch[1]) / 360;
        let s = parseInt(hslMatch[2]) / 100;
        let l = parseInt(hslMatch[3]) / 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        }
        else {
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

        const toHex = (x) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }


    /** static method to generate a random hex color */

    static genRandomColor() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        return `#${randomColor}`;
    }

    static getDefaultColor() {
        return DEFAULT_COLOR;
    }
    static genGradient(fromHex, toHex, steps) {
        // TODO: Implement gradient generation
        // gradient from fromHex to toHex with steps steps using HSL interpolation 
        var grad = [];
        for (let i = 0; i < steps; i++) {
            grad.push(Color.interpolateHSL(fromHex, toHex, i / (steps)));
        }
        return grad;
    }
    static interpolateHSL(fromHex, toHex, ratio) {
        //console.log(`fromHex:  ${fromHex}, toHex: ${toHex}, ratio: ${ratio}`);
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
        const newH = Math.round(fromColor.h + (toColor.h - fromColor.h) * ratio);
        const newS = Math.round(fromColor.s + (toColor.s - fromColor.s) * ratio);
        const newL = Math.round(fromColor.l + (toColor.l - fromColor.l) * ratio);
        toColor.hsl = `hsl(${newH},${newS}%,${newL}%)`;
        return toColor.hex;
    }
    /** generate a slider of colors from a color and HSL deltas 
     *  @param {Color} aColor - A color object.
     *  @param {number} steps - The number of steps in the slider.
     *  @param {number} deltaH - The delta of H in the slider.
     *  @param {number} deltaS - The delta of S in the slider.
     *  @param {number} deltaL - The delta of L in the slider.
     *  @returns {Array} An array of hex color .
    */
    static genSlider(aColor, steps, deltaH, deltaS, deltaL) {
        var slider = [];

        for (let i = 0; i < steps; i++) {
            /** for H muste wrap aroud to reflect Hue weel and take into account that delta can be negative , h must alwat be in the 0-360 range     */
            var newH = Math.round(aColor.h + deltaH * i) % 360;
            if (newH < 0) newH += 360;
            if (newH > 360) newH -= 360;
            var newS = Math.round(aColor.s + deltaS * i);
            if (newS < 0) newS = 0;
            if (newS > 100) newS = 100;
            var newL = Math.round(aColor.l + deltaL * i);
            if (newL < 0) newL = 0;
            if (newL > 100) newL = 100;
            console.log(`i: ${i}, newH: ${newH}, newS: ${newS}, newL: ${newL}`);
            const newColor = new Color(aColor.hex);
            newColor.h = newH;
            newColor.s = newS;
            newColor.l = newL;
            slider.push(newColor.hex);
        }
        return slider;
    }
    /** return array of foreground to background combinaitions of color including black and white */
    static genColorTest(hexColor1, hexColor2) {
        const White = "#FFFFFF";
        const Black = "#000000";
        const hexColors = [[hexColor2, hexColor1], [Black, hexColor1], [White, hexColor1]]  // color 1 BG
        hexColors.push([hexColor2, White], [Black, White], [hexColor1, White])  // White BG
        hexColors.push([hexColor2, Black], [White, Black], [hexColor1, Black]) // Black BG
        hexColors.push([White, hexColor2], [Black, hexColor2], [hexColor1, hexColor2]) // color 2 BG
        return hexColors
    }

}

export default Color;
export { DEFAULT_COLOR as defaultColor, Color };

