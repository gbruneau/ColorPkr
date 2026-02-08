
import '../style/about.css';
import { Tool } from '../classes/tool.js';

class SaveTool extends Tool {
    constructor() {
        super(() => this.showTool());
        this.toolDiv.innerHTML = `
    <form action="" id="formSave">
        <div>
            <label for="inExclColor">Exclude color</label>
            <input type="checkbox" id="inExclColor" name="inExclColor" checked />
        </div>
        <div>
            <label for="inExcludedColor">Color</label>
            <input type="color" id="inExcludedColor" name="inExcludedColor" value="#808080" />
        </div>
            <input type="button" id="btCancelSave" value="Cancel" />
            <input type="button" id="btSubmitSave" value="Save" />
        </div>
    </form>
  `
    }
    bindToPalette(paletteDIV) {
        this.paletteDIV = paletteDIV;
    }
}


export { SaveTool };
export default { SaveTool };

