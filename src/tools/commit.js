import { Tool } from '../classes/tool.js';

class CommitTool extends Tool {
    constructor( ) {
        super(() => this.commit());
        this.paletteDIV=null;
    }
    commit() {
        this.paletteDIV.isCommited = true;
        this.paletteDIV.querySelectorAll('.color-card').forEach(card => {
            card.commitColorCard();
        });
    }   
    bindToPalette(paletteDIV) {
        this.paletteDIV = paletteDIV;
        this.paletteDIV.addEventListener('colorPaletteChange', () => {
            if (this.paletteDIV.isCommited) {
                this.invisibleButton();
            } else {
                this.showButton();
            }
        });
        /** set initial button state */
        if (this.paletteDIV.isCommited) {
            this.invisibleButton();
        } else {
            this.showButton();
        }       

    }   
}

export { CommitTool };
export default { CommitTool };
