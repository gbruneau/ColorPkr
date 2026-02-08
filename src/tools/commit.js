import { Tool } from '../classes/tool.js';

class CommitTool extends Tool {
    constructor( ) {
        super(() => this.commit());
        this.paletteDIV=null;
    }
    commit() {
        this.paletteDIV.isCommited = true;
        /** clear the DB first */
        const dbName = "ColorPkr";
        const storeName = "colors";
        const deleteRequest = indexedDB.deleteDatabase(dbName);
        deleteRequest.onsuccess = function() {
            console.log("IndexedDB deleted successfully");
        };
        deleteRequest.onerror = function() {
            console.error("Error deleting IndexedDB");
        };
        /** commit all color cards in the palette */



        this.paletteDIV.querySelectorAll('.color-card').forEach(card => {
            card.commitColorCard();
            /** save the colors to an indexedDB for al the color cards */
            const dbName = "ColorPkr";
            const storeName = "colors";
            const request = indexedDB.open(dbName, 1);
            request.onupgradeneeded = function(event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                }
            };
            request.onsuccess = function(event) {
                const db = event.target.result;
                const transaction = db.transaction([storeName], 'readwrite');
                const objectStore = transaction.objectStore(storeName);
                /** Structure backward compatible */
                const colorData = {
                    hexColor: card._color.hex,
                    title: card._color.name
                };
                const addRequest = objectStore.add(colorData);
                addRequest.onsuccess = function() {
                    console.log('Color saved to IndexedDB:', colorData);
                };
                addRequest.onerror = function() {
                    console.error('Error saving color to IndexedDB');
                };
            }
        });
        this.paletteDIV.dispatchEvent(new Event('colorChange'));
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
