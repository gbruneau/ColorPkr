//** Class to support a color hex code and the name of the color */

import Color from '../../utils/color.js';
import '../colorCard/colorCard.css';


/**
 * Enumeration for Color Contexts
 */
const ColorContext = Object.freeze({
    Palette: 1,
    ToolInput: 2,
    ToolOutput: 3
})

const COPIED_TOCP_FEEDBACK = '<span class="emoji">&#128203;</span>'; // clipboard emoji
const COPIED_TOCP_DURTION = 1000 // in ms

class ColorCard extends HTMLElement {
    /**
     * 
     * @param {Color} aColor  A Color instance
     * @param {ColorContext} aColorContext  The context in which the color is used
     */
    constructor(aColor, aColorContext) {
        super();
        this._color = aColor;
        this._isCommited = true;
        this.#setColorCardContext(aColorContext);

        this.classList.add('color-card');
        this.innerHTML = `
            <div class="colorBloc"></div>
            <div class="colorName"></div>
            <div class="colorHex"></div>
            <div class="colorRGB"></div>
            <div class="colorHSL"></div>
        `;
        if (!this._showLabels) {
            this.querySelectorAll('div:not(.colorBloc)').forEach(div => {
                div.style.display = 'none';
            });
        }


        if (!this._showName) {
            this.querySelector('.colorName').style.display = 'none';
        }
        this.refreshColorCard();
        this.dragAndDropSetup();
    }
    /** if showLabels and nameEditable, make the first child div editable and reflect the change in aColor.name */
    /** called when added to the DOM */
    connectedCallback() {
        if (this._nameEditable) {
            const nameDiv = this.querySelector('.colorName');
            nameDiv.contentEditable = 'true';
            nameDiv.addEventListener('input', (e) => {
                /** if name changed then  commited = false */
                if (this._color.name !== e.target.innerText) {
                    this.unCommitColorCard();
                }
                this._color.name = e.target.innerText;
                //** support also when enter key is pressed in edition */ 
                nameDiv.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        nameDiv.blur();
                        if (this._color.name !== e.target.innerText) {
                            this.unCommitColorCard();
                        }
                    }
                });
            });
        } else {
            const nameDiv = this.querySelector('.colorName');
            nameDiv.contentEditable = 'false';
        }

        if (this._isEditable === true) {
            const hexDiv = this.querySelector('.colorBloc')
            hexDiv.addEventListener('click', () => {
                /** create a color picker */
                var newDIV = document.createElement('input');
                newDIV.type = 'color';
                newDIV.value = this._color.hex;
                /** on clict change, change div background color */
                newDIV.addEventListener('input', (event) => {
                    if (this._color.hex != event.target.value)
                    {
                        this._color.hex = event.target.value;
                        this.unCommitColorCard();
                        this.refreshColorCard();
                    }
                });
                /* position in the middle of the screeen */
                newDIV.style.position = 'fixed';
                newDIV.style.top = '50%';
                newDIV.style.left = '50%';
                newDIV.style.transform = 'translate(-50%, -50%)';
                newDIV.style.zIndex = '1000';
                newDIV.style.width = '100px';
                newDIV.style.height = '100px';
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

        /** clic on colorHex copy the innertext to clipboard */
        const hexDiv = this.querySelector('.colorHex')
        hexDiv.addEventListener('click', () => {
            navigator.clipboard.writeText(this._color.hex);
            /** add some feedback */
            hexDiv.innerHTML = COPIED_TOCP_FEEDBACK
            setTimeout(() => {
                this.refreshColorCard();
            }, COPIED_TOCP_DURTION);
        });
        const rgbDiv = this.querySelector('.colorRGB')
        rgbDiv.addEventListener('click', () => {
            navigator.clipboard.writeText(this._color.rgb);
            /** add some feedback */
            rgbDiv.innerHTML = COPIED_TOCP_FEEDBACK
            setTimeout(() => {
                this.refreshColorCard();
            }, COPIED_TOCP_DURTION);
        });
        const hslDiv = this.querySelector('.colorHSL')
        hslDiv.addEventListener('click', () => {
            navigator.clipboard.writeText(this._color.hsl);
            /** add some feedback */
            hslDiv.innerHTML = COPIED_TOCP_FEEDBACK
            setTimeout(() => {
                this.refreshColorCard();
            }, 1000);
        });
    }

    #setColorCardContext(aColorContext) {
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
    refreshColorCard() {
        // update the inner text of all inner html div
        this.querySelector('.colorBloc').style.backgroundColor = this._color.hex;
        this.querySelector('.colorName').innerText = this._color.name;
        this.querySelector('.colorHex').innerText = this._color.hex;
        this.querySelector('.colorRGB').innerText = this._color.rgb;
        this.querySelector('.colorHSL').innerText = this._color.hsl;
    }

    /** handle drag and drop */
    dragAndDropSetup() {
        if (this._dragSource) {
            this.draggable = true;
            this.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(this));
                
            });
        }
        if (this._dropTarget) {
            this.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.style.borderWidth = '5px';
                setTimeout(() => {
                    this.style.borderWidth = '1px';
                }, 100);



            });
            this.addEventListener('drop', (e) => {
                e.preventDefault();
                const srcColorData = e.dataTransfer.getData('text/plain');
                const srcColorObj = JSON.parse(srcColorData);
                const srcColorHex = srcColorObj._color._hex;
                const srcColorName = srcColorObj._color._name;
                const srcColorID = srcColorObj._color._colorID;
                const srcColorContext = srcColorObj._colorContext;
                const targetContext = this._colorContext;
                const targetColorName = this._color.name;
                const targetColorHex = this._color.hex;

                // If both context are color pallet, swap colors
                if (srcColorContext === ColorContext.Palette && targetContext === ColorContext.Palette) {
                    this._color.hex = srcColorHex;
                    this._color.name = srcColorName;

                    // Find the source element and update its color
                    const sourceElements = document.querySelectorAll('color-card');
                    sourceElements.forEach(elem => {
                        if (elem._color._colorID === srcColorID && elem !== this) {
                            elem._color.hex = targetColorHex;
                            elem._color.name = targetColorName;
                            elem.unCommitColorCard();
                            elem.refreshColorCard();
                        }
                    });

                    this.unCommitColorCard();
                    this.refreshColorCard();

                    return; // Exit after swapping
                }
                else
                /** Replace target color */ {
                    this._color.hex = srcColorHex;
                    this._color.name = srcColorHex;
                    this.refreshColorCard();
                    this.#setColorCardContext(targetContext);
                    this.unCommitColorCard();
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
        
        /** on click for name hex, rgf and hsl, copy to clipborad and display a message  */
        var idList=["fullName","fullHex","fullRGB","fullHSL"   ]
        /** for each in idlist , listen for click and copy to clipborad */ 
        idList.forEach(lableID => {
            const label = fullScreenDiv.querySelector(`#${lableID}`); 
            label.addEventListener('click', () => {
                navigator.clipboard.writeText(label.innerText);
                const oldText = label.innerText;
                label.innerHTML = COPIED_TOCP_FEEDBACK;
                setTimeout(() => {
                    label.innerHTML = oldText;
                }, COPIED_TOCP_DURTION);
            });
        });    



        // Add a div button at the bottom to close the full screen
        const closeButton = document.createElement('div');
        closeButton.classList.add('full-close-button');
        closeButton.style.backgroundColor = this._color.contrastedColor;
        closeButton.style.color = this._color.hex;
        closeButton.innerText = 'OK';

        closeButton.addEventListener('click', () => {
            document.body.removeChild(fullScreenDiv);
        });
        fullScreenDiv.appendChild(closeButton);
    }

    get color() {
        return this._color;
    }
    get isCommited() {
        return this._isCommited;
    }
    resetColorCard() {
        this._color.hex = Color.getDefaultColor();
        this.unCommitColorCard();
        this.refreshColorCard();
    }
    commitColorCard() {
        if (this._colorContext === ColorContext.Palette) {
            this._isCommited = true;
            this.style.borderColor = 'black';
        }
    }
    unCommitColorCard() {
        if (this._colorContext === ColorContext.Palette) {
            this._isCommited = false;
            this.parentElement.isCommited = false;
            this.style.borderColor = 'red';
            this.parentElement.dispatchEvent(new CustomEvent('colorPaletteChange', { detail: this._isCommited }));
        }
        this.dispatchEvent(new CustomEvent('colorCardChange', { detail: this._color , bubbles: true }));

    }
    hideLabel() {
        this.querySelector('.color-card-label').style.display = 'none';
    }

}


export { Color, ColorCard, ColorContext };
export default Color;
