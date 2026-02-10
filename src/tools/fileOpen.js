import { Tool } from '../classes/tool.js';
import { Color, ColorCard, ColorContext  } from '../classes/color.js';

class OpenTool extends Tool {
    constructor() {
        super(() => this.showDialog());
        this.toolDiv.innerHTML = `
    <div class="dialogTool" id="openTool">
        <h2>Open Palette</h2>
        <form action="" id="formOpen">
            <div>
                <input type="file" id="inFile" name="inFile" accept=".json" />
            </div>
            <div>
                <input type="button" id="btCancelOpen" value="Cancel" />
                <input type="button" id="btSubmitOpen" value="Open" />
            </div>
        </form>
    </div>
  `
        const btCancel = this.toolDiv.querySelector('#btCancelOpen');
        btCancel.addEventListener('click', () => {
            this.hideDialog();
        });
        const btSubmit = this.toolDiv.querySelector('#btSubmitOpen');
        btSubmit.addEventListener('click', () => {
            const inFile = this.toolDiv.querySelector('#inFile');
            const file = inFile.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const json = JSON.parse(e.target.result);
                this.paletteDIV.innerHTML = '';
                this.paletteDIV.appState.clearPalette();
                json.forEach(color => {
                    //** check if fiels are present */
                    if (color.name || color.hex) {
                        const aColor = new Color(color.hex, color.name);
                        const aColorCard = new ColorCard(aColor, ColorContext.Palette);
                        this.paletteDIV.appendChild(aColorCard);
                        this.paletteDIV.appState.addColorToPalette(aColor);

                    }
                    /** check for fiels Title , Hexcolor for backward compatibility */
                    if (color.Title && color.Hexcolor) {
                        const aColor = new Color(color.Hexcolor,color.Title );
                        const aColorCard = new ColorCard(aColor, ColorContext.Palette);
                        this.paletteDIV.appendChild(aColorCard);
                        this.paletteDIV.appState.addColorToPalette(aColor);
                    }
                });
                this.paletteDIV.dispatchEvent(new Event('colorChange'));

            };
            reader.readAsText(file);
            this.hideDialog();
        });
    }
    bindToPalette(paletteDIV) {
        this.paletteDIV = paletteDIV;
    }   
}


export { OpenTool };
export default { OpenTool };
