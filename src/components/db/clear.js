import { Tool } from '../tool.js';
import clearIcon from './clear.png';

class ClearTool extends Tool {
    constructor() {
        super(() => this.clearPalette());
    }

    addButton(aToolBar) {
        const img = document.createElement('img');
        img.src = clearIcon;
        super.addButton(aToolBar, 'Clear Palette', img);
    }

    clearPalette() {
        const pDIV = document.getElementById('palette');
        const colorCards = pDIV.querySelectorAll('.color-card');
        colorCards.forEach(card => {
            card.resetColorCard();
        });
    }
}

export { ClearTool };
export default { ClearTool };