import { Tool } from '../tool.js';
import sortIcon from './sortPalette.png'

const colorAttributes=["r","g","b","h","s","l","name"];

class SortPalette extends Tool {
    constructor() {
        super(() => this.showDialog());



    }
    addButton(aToolBar) {
        const img = document.createElement('img');
        img.src = sortIcon;
        super.addButton(aToolBar, 'Sort Palette', img);
    }
}


export { SortPalette };
export default { SortPalette };

