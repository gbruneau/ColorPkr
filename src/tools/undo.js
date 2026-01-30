import { Tool } from '../classes/tool.js';
class UndoTool extends Tool {
    constructor( ) {
        super(() => this.undo());
        this.paletteDIV = null;
    }
    undo() {
        if (this.paletteDIV) {
            /**  */
        }
    }   
    bindToPalette(paletteDIV) {
        this.paletteDIV = paletteDIV;
        };     

}

export { UndoTool };
export default { UndoTool };    