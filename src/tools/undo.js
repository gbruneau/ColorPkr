import { Tool } from '../classes/tool.js';
import { Color, ColorCard, ColorContext } from '../classes/color.js';

class UndoTool extends Tool {
    constructor( ) {
        super(() => this.undo());
        this.paletteDIV = null;
    }
    /** Undo the last commit by loading colors from IndexedDB */
    /** on success call the function in argument */
    undo(fSucccess=null) {
        if (this.paletteDIV) {
            /** remove all paletteDIV child cards first */
            this.paletteDIV.innerHTML = '';
            this.paletteDIV.isCommited = false;
            /** clear paletteDIV a dn load color from indexedDB */
            const dbName = "ColorPkr";
            const storeName = "colors";
            const request = indexedDB.open(dbName, 1);  
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction([storeName], 'readonly');
                const objectStore = transaction.objectStore(storeName);
                const getAllRequest = objectStore.getAll();
                getAllRequest.onsuccess = () => {
                    const colors = getAllRequest.result;
                    colors.forEach(colorData => {
                        const color = new Color(colorData.hexColor, colorData.title);
                        const colorCard = new ColorCard(color, ColorContext.Palette);
                        this.paletteDIV.appendChild(colorCard);
                        this.paletteDIV.appState.addColorToPalette(color);
                    });         
                    if (fSucccess) {
                        fSucccess();
                    }   
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

}

export { UndoTool };
export default { UndoTool };    