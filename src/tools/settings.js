import { Tool } from '../classes/tool.js';
import { Color, ColorCard, ColorContext } from '../classes/color.js';

class SettingsTool extends Tool {
    constructor() {
        super(() => this.showDialog());
        this.paletteDIV = null;
        this.toolDiv.innerHTML = `
    <div ID="divSettings" class="dialogTool" display="block">
        <form id="formsettings">
            <div>
                <label for="inPaletteSize">Palette size</label>
                <input type="number" id="inPaletteSize" name="inPaletteSize" min="1" />
            </div>
            <div>
                <input type="button" id="btCancelSettings" value="Cancel" />
                <input type="button" id="btSubmitSettings" value="Save" />
            </div>
        </form>
    </div>
    `;
    /** on cancel, hide dialog */    
    const btCancel = this.toolDiv.querySelector('#btCancelSettings');
    btCancel.addEventListener('click', () => {
        this.hideDialog();
    });
    /** on submit, hide dialog */    
    const btSubmit = this.toolDiv.querySelector('#btSubmitSettings');
    btSubmit.addEventListener('click', () => {
        /** update the palette size */
        const oldPaletteSize = this.paletteDIV.appState.paletteSize;
        /** get newPaletteSize from input as integer */
        const newPaletteSize = parseInt(this.toolDiv.querySelector('#inPaletteSize').value) ;
        if (oldPaletteSize != newPaletteSize) {
            /** remove the colors from the palette */
            this.paletteDIV.appState.resisePalette(newPaletteSize);
            /** remove all color cards from the palette */
            this.paletteDIV.querySelectorAll('.color-card').forEach(color => {
                this.paletteDIV.removeChild(color);
            });
            /** add the color cards to the palette */
            this.paletteDIV.appState.paletteColors.forEach(color => {
                const aColorCard = new ColorCard(color, ColorContext.Palette);
                this.paletteDIV.appendChild(aColorCard);
            });


        }


        this.hideDialog();
    });


    }
    bindToPalette(paletteDIV) {
        this.paletteDIV = paletteDIV;
    }
    showDialog() {
        /** show dialog as defined in tool class */ 
        super.showDialog();
        /** set the value of the palette size input to the current palette size     */ 
        const inPaletteSize = this.toolDiv.querySelector('#inPaletteSize');
        inPaletteSize.value = this.paletteDIV.appState.paletteSize;
    }   



}

export { SettingsTool };
export default { SettingsTool };    