import { Tool } from '../tool.js';
import { Color, ColorCard, ColorContext } from '../colorCard/colorCard.js';
import undoIcon from './undo.png';

class UndoTool extends Tool {
    constructor(defaultPaletteSize) {
        super(() => this.undo());
        this.paletteDIV = null;
        this.defaultPaletteSize = defaultPaletteSize;
    }
    /** Undo the last commit by loading colors from IndexedDB */
    /** on success call the function in argument */
    undo() {
        if (this.paletteDIV) {
            /** remove all paletteDIV child cards first */
            this.paletteDIV.innerHTML = '';
            this.paletteDIV.isCommited = false;
            this.paletteDIV.ColorPalette.clearPalette();
            /** clear paletteDIV a dn load color from indexedDB */
            const dbName = "ColorPkr";
            const storeName = "colors";

            const request = indexedDB.open(dbName, 1);

            /** Create the DB if not exist */
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const objectStore=db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                }
        

            request.onsuccess = (event) => {
                const db = event.target.result;

                try {
                    var transaction = db.transaction([storeName], 'readonly');
                } catch (error) {
                    console.error("Error creating transaction:");
                    return;
                }



                const objectStore = transaction.objectStore(storeName);
                const getAllRequest = objectStore.getAll();
                getAllRequest.onsuccess = () => {
                    const colors = getAllRequest.result;
                    colors.forEach(colorData => {
                        const color = new Color(colorData.hexColor, colorData.title);
                        const colorCard = new ColorCard(color, ColorContext.Palette);
                        this.paletteDIV.appendChild(colorCard);
                        this.paletteDIV.ColorPalette.addColorToPalette(color);
                    });
                    this.paletteDIV.isCommited = true;

                    this.paletteDIV.dispatchEvent(new CustomEvent('colorPaletteChange', { detail: true }));

                   // if (fSucccess) {
                        this.postUndo();
                    //}
                };
            };
            /* Handle errors */
            request.onerror = (event) => {
                console.error("Error opening IndexedDB:", event.target.error);
            };
        }
    }
    bindToPalette(paletteDIV) {
        this.paletteDIV = paletteDIV;
    };
    addButton(aToolBar) {
        const img = document.createElement('img');
        img.src = undoIcon;
        super.addButton(aToolBar, 'Undo Last Change', img);
    }
    postUndo() {
        if(this.paletteDIV.ColorPalette.paletteSize === 0) {
            this.paletteDIV.ColorPalette.resisePalette(this.defaultPaletteSize);    
            /** create default color cards */
            for (let i = 0; i < this.defaultPaletteSize; i++) {
                const colorCard = new ColorCard(new Color(), ColorContext.Palette);
                this.paletteDIV.appendChild(colorCard);
            }

        }
        this.paletteDIV.isCommited = true;
    }


    /** 
     * 
     */
    
}

export { UndoTool };
export default { UndoTool };    