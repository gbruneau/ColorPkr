//** Class to support a color hex code and the name of the color */

/**
 * Enumeration for Color Contexts
 */
const ColorContext = Object.freeze({
    Palette: 1,
    ToolInput: 2,
    ToolOutput: 3
})


class Color {
    /**
     * Create a Color instance.
     * @param {string} hex - The hex code of the color (e.g., '#FFFFFF').
     * @param {string} name - The name of the color (e.g., 'White').
     */
    constructor(hex, name = '') {
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

}


class colorDIV extends HTMLElement {
    /**
     * 
     * @param {Color} aColor  A Color instance
     * @param {ColorContext} aColorContext  The context in which the color is used
     */
    constructor(aColor, aColorContext) {
        super();
        this._color = aColor;
        this.setColorContext(aColorContext);

        this.style.backgroundColor = aColor.hex;
        this.style.color = aColor.contrastedColor;
        this.classList.add('color-div');
        this.innerHTML = `
            <div class="colorName"></div>
            <div class="colorHex"></div>
            <div class="colorRGB"></div>
            <div class="colorHSL"></div>
        `;
        if (!this._showLabels) {
            this.querySelectorAll('div').forEach(div => {
                div.style.display = 'none';
            });
        }
        else
            this.redisplayColor();


        if (!this._showName) {
            this.querySelector('.colorName').style.display = 'none';
        }
        this.dragAndDropSetup();
    }
    /** if showLabels and nameEditable, make the first child div editable and reflect the change in aColor.name */
    connectedCallback() {
        if (this._nameEditable) {
            const nameDiv = this.querySelector('.colorName');
            nameDiv.contentEditable = 'true';
            nameDiv.addEventListener('input', (e) => {
                this._color.name = e.target.innerText;
                //** support also when enter key is pressed in edition */ 
                nameDiv.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        nameDiv.blur();
                    }
                });
            });
        } else {
            const nameDiv = this.querySelector('.colorName');
            nameDiv.contentEditable = 'false';
        }

        if (this._isEditable === true) {
            /** create an event listener when user click, display hello */
            const hexDiv = this.querySelectorAll('div')[1]

            hexDiv.addEventListener('click', () => {
                var newDIV = document.createElement('input');
                newDIV.type = 'color';
                newDIV.value = this._color;
                //* on clict change, change div background color */
                newDIV.addEventListener('input', (event) => {
                    this._color.hex = event.target.value;
                    this.redisplayColor();
                }, false);
                newDIV.click()
                newDIV = null
            });
        }
        this.addEventListener('contextmenu', function (event) {
            // Prevent the default browser context menu from appearing
            event.preventDefault();

            // Show the color in full screen
            this.showColorFullSreen()
        });




    }

    setColorContext(aColorContext) {
        this._colorContext = aColorContext;
        if (aColorContext === ColorContext.Palette) {
            this._isEditable = true;
            this._showLabels = true;
            this._nameEditable = true;
            this._showName = true;
            this._dragSource = true;
            this._dropTarget = true;
        }
        else if (aColorContext === ColorContext.ToolInput) {
            this._isEditable = true;
            this._showLabels = false;
            this._nameEditable = false;
            this._showName = false;
            this._dragSource = true;
            this._dropTarget = true;
        }
        else if (aColorContext === ColorContext.ToolOutput) {
            this._isEditable = false;
            this._showLabels = false;
            this._nameEditable = false;
            this._showName = false;
            this._dragSource = true;
            this._dropTarget = false;
        }
    }

    /** method updateInnerHTML */
    redisplayColor() {
        //* update the innet text of all inner html dives

        const bgColor = this._color.hex;
        const fgColor = this._color.contrastedColor


        this.querySelector('.colorName').innerText = this._color.name;
        this.querySelectorAll('div')[1].innerText = this._color.hex;
        this.querySelectorAll('div')[2].innerText = this._color.rgb;
        this.querySelectorAll('div')[3].innerText = this._color.hsl;
        this.style.backgroundColor = bgColor
        this.style.color = fgColor
        if (this._showLabels) {
            const hexDIV = this.querySelectorAll('div')[1]
            hexDIV.style.color = bgColor
            hexDIV.style.backgroundColor = fgColor
        }
    }

    /** handle drag and drop */
    dragAndDropSetup() {
        if (this._dragSource) {
            this.draggable = true;
            this.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(this));
                //                e.dataTransfer.setData('text/plain', this._color.hex);
            });
        }
        if (this._dropTarget) {
            this.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            this.addEventListener('drop', (e) => {
                e.preventDefault();
                //                const colorHex = e.dataTransfer.getData('text/plain');
                const srcColorData = e.dataTransfer.getData('text/plain');
                const srcColorObj = JSON.parse(srcColorData);
                const srcColorHex = srcColorObj._color._hex;
                const srcColorName = srcColorObj._color._name;
                const srcColorID = srcColorObj._color.colorID;
                const srcColorContext = srcColorObj._colorContext;
                const targetContext = this._colorContext;
                const targetColorName = this._color.name;
                const targetColorHex = this._color.hex;

                // If both context are color pallet, swap colors
                if (srcColorContext === ColorContext.Palette && targetContext === ColorContext.Palette) {
                    this._color.hex = srcColorHex;
                    this._color.name = srcColorName;
                    this.redisplayColor();

                    // Find the source element and update its color
                    const sourceElements = document.querySelectorAll('color-div');
                    sourceElements.forEach(elem => {
                        if (elem._color.colorID === srcColorID && elem !== this) {
                            elem._color.hex = targetColorHex;
                            elem._color.name = targetColorName;
                            elem.redisplayColor();
                        }
                    });
                    return; // Exit after swapping
                }
                else
                /** Replace target color */ {
                    this._color.hex = srcColorHex;
                    this._color.name = srcColorHex;
                    this.redisplayColor();
                    this.setColorContext(targetContext);
                }
            });
        }
    }
    showColorFullSreen = function () {
        const fullScreenDiv = document.createElement('div');
        fullScreenDiv.classList.add('full-screen-color');
        fullScreenDiv.style.backgroundColor = this._color.hex;
        fullScreenDiv.style.color = this._color.contrastedColor;

        fullScreenDiv.innerHTML = `
        <div id="fullName">${this._color.name}</div>
        <div id="fullHex">${this._color.hex}</div>
        <div id="fullRGB">${this._color.rgb}</div>
        <div id="fullHSL">${this._color.hsl}</div>
    `;
        document.body.appendChild(fullScreenDiv);
        // hide name if not in the context of a palette
        if (!this._showName) {          
            fullScreenDiv.querySelector('#fullName').style.display = 'none';
        }   


        // Add a div button at the bottom to close the full screen
        const closeButton = document.createElement('div');
        closeButton.classList.add('full-close-button');
        closeButton.style.backgroundColor = this._color.contrastedColor;
        closeButton.style.color = this._color.hex;

        closeButton.addEventListener('click', () => {
            document.body.removeChild(fullScreenDiv);
        });
        fullScreenDiv.appendChild(closeButton); 
    }
}


export { Color, colorDIV, ColorContext };
export default Color;
