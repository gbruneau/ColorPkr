import { Tool } from '../classes/tool.js';

class SaveTool extends Tool {
    constructor() {
        super(() => this.showDialog());
        this.toolDiv.innerHTML = `
    <div class="dialogTool" id="saveTool">
        <h2>Save Palette</h2>
        <form action="" id="formSave">
            <div>
                <label for="inExclColor">Exclude color</label>
                <input type="checkbox" id="inExclColor" name="inExclColor" checked />
            </div>
            <div id="divExcludedColor">
                <label for="inExcludedColor">Excluded Color</label>
                <input type="color" id="inExcludedColor" name="inExcludedColor" value="#808080" />
            </div>
            <div>
                <input type="button" id="btCancelSave" value="Cancel" />
                <input type="button" id="btSubmitSave" value="Save" />
            </div>
        </form>
    </div>
  `
        const btCancel = this.toolDiv.querySelector('#btCancelSave');
        btCancel.addEventListener('click', () => {
            this.hideDialog();
        });
        const btSubmit = this.toolDiv.querySelector('#btSubmitSave');
        btSubmit.addEventListener('click', () => {
            const inExclColorChecked = this.toolDiv.querySelector('#inExclColor').checked;
            const inExcludedColorHex = this.toolDiv.querySelector('#inExcludedColor').value;
            const excludeColor = inExclColor.checked ? inExcludedColor.value : null;
            /** Download all the colors on a json file  */
            const colorsToSave = this.paletteDIV.querySelectorAll('.color-card');
            const jsonData = [];
            colorsToSave.forEach(card => {
                const colorObj = {
                    name: card._color._name,
                    hex: card._color._hex
                };
                if ((!inExclColorChecked) || (inExcludedColorHex != card._color._hex)) jsonData.push(colorObj)
            });

            this.#download(JSON.stringify(jsonData), "ColorPalette.json", "text/plain");

            this.hideDialog();
        });

        const inExclColor = this.toolDiv.querySelector('#inExclColor');
        const divExcludedColor = this.toolDiv.querySelector('#divExcludedColor');
        inExclColor.addEventListener('change', () => {
            if (inExclColor.checked) {
                divExcludedColor.style.visibility = 'visible';

            } else {
                divExcludedColor.style.visibility = 'hidden';
            }
        });


    }
    /** add click event to handle cancel */

    bindToPalette(paletteDIV) {
        this.paletteDIV = paletteDIV;
    }

    #download(content, fileName, contentType) {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

}


export { SaveTool };
export default { SaveTool };

