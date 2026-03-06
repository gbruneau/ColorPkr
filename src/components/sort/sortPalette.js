import { Tool } from '../tool.js';
import sortIcon from './sortPalette.png'
import './sortPalette.css';
import { Color,ColorCard, ColorContext } from '../colorCard/colorCard.js';


const colorAttributes = ["r", "g", "b", "h", "s", "l", "name"];

const excludedColor = Color.DEFAULT_COLOR;
const sortOrder =  Object.freeze({
    asc: "↑",
    desc: "↓"
})

class SortPalette extends Tool {
    constructor() {
        super(() => this.showTool());
        this.toolDiv.innerHTML = `
    <div id="sortPalette">
        <h2>Sort Palette</h2>
        <div id="sortInput">
            <div>
                <label for="sortAttr1">Sort by</label>
                <select id="sortAttr1"></select>
                <select id="sortAttr1Asc"></select>
            </div>
            <div>
                <label for="sortAttr2">then by</label>
                <select id="sortAttr2"></select>
                <select id="sortAttr2Asc"></select>
            </div>
            <div>
                <label for="sortAttr3">then by</label>
                <select id="sortAttr3"></select>
                <select id="sortAttr3Asc"></select>
            </div>
            <div id="sortExcludedColor">
                <input type="checkbox" id="inSortHasExcludedAColor"  />
                <label for="inSortExcludedColor">Excluded Color</label>
                <input type="color" id="inSortExcludedColor" name="insortExcludedColor" value="${excludedColor}" />
            </div>

        </div>
        <div id="sortButtonsContainer">
            <input type="button" id="btDoSortReset" value="Reset" />
            <input type="button" id="btDoSortPalette" value="Sort" />
        </div>
    </div>
`
        this.toolDiv.classList.add('sortPaletteContainer');

        const sortAttr1=this.toolDiv.querySelector("#sortAttr1")
        const sortAttr2=this.toolDiv.querySelector("#sortAttr2")
        const sortAttr3=this.toolDiv.querySelector("#sortAttr3")

        /** add  option for all  colorAttributes */
        colorAttributes.forEach(attr => {
            const newOption1   =document.createElement("option")
            const newOption2   =document.createElement("option")
            const newOption3   =document.createElement("option")
            newOption1.value=attr
            newOption1.innerText=attr.charAt(0).toUpperCase() + attr.slice(1)
            sortAttr1.appendChild(newOption1)
            newOption2.value=attr
            newOption2.innerText=attr.charAt(0).toUpperCase() + attr.slice(1)
            sortAttr2.appendChild(newOption2)
            newOption3.value=attr
            newOption3.innerText=attr.charAt(0).toUpperCase() + attr.slice(1)
            sortAttr3.appendChild(newOption3)
        }); 

        const sortAttr1Asc=this.toolDiv.querySelector("#sortAttr1Asc")
        const sortAttr2Asc=this.toolDiv.querySelector("#sortAttr2Asc")
        const sortAttr3Asc=this.toolDiv.querySelector("#sortAttr3Asc")
        
        // Add options for sort order
        const ascOption = document.createElement("option");
        ascOption.value = "asc";
        ascOption.innerText = sortOrder.asc;
        sortAttr1Asc.appendChild(ascOption);
        sortAttr2Asc.appendChild(ascOption.cloneNode(true));
        sortAttr3Asc.appendChild(ascOption.cloneNode(true));
        
        const descOption = document.createElement("option");
        descOption.value = "desc";
        descOption.innerText = sortOrder.desc;
        sortAttr1Asc.appendChild(descOption);
        sortAttr2Asc.appendChild(descOption.cloneNode(true));
        sortAttr3Asc.appendChild(descOption.cloneNode(true));

        this.resetSort();
        this.addEventListeners();

    }

    addEventListeners() {
        const btDoSortReset = this.toolDiv.querySelector("#btDoSortReset");
        btDoSortReset.addEventListener("click", () => {
            this.resetSort();
        });
        /** handle sort */
        const btDoSortPalette = this.toolDiv.querySelector("#btDoSortPalette");
        btDoSortPalette.addEventListener("click", () => {
            this.doSort();
        });
    }

    resetSort() {
        // Reset to default values
        const sortAttr1 = this.toolDiv.querySelector("#sortAttr1");
        const sortAttr2 = this.toolDiv.querySelector("#sortAttr2");
        const sortAttr3 = this.toolDiv.querySelector("#sortAttr3");
        const sortAttr1Asc = this.toolDiv.querySelector("#sortAttr1Asc");
        const sortAttr2Asc = this.toolDiv.querySelector("#sortAttr2Asc");
        const sortAttr3Asc = this.toolDiv.querySelector("#sortAttr3Asc");
        const hasExcludedColor = this.toolDiv.querySelector("#inSortHasExcludedAColor");
        const sortExcludedColor = this.toolDiv.querySelector("#inSortExcludedColor");
        
        sortAttr1.value = 'h';
        sortAttr2.value = 's';
        sortAttr3.value = 'l';
        sortAttr1Asc.value = 'asc';
        sortAttr2Asc.value = 'asc';
        sortAttr3Asc.value = 'asc';
        hasExcludedColor.checked = true;
        sortExcludedColor.value = Color.DEFAULT_COLOR;
    }

    addButton(aToolBar) {
        const img = document.createElement('img');
        img.src = sortIcon;
        super.addButton(aToolBar, 'Sort Palette', img);
    }
    
    doSort() {
        // Get the selected sort attributes and order
        const sortAttr1 = this.toolDiv.querySelector("#sortAttr1").value;
        const sortAttr2 = this.toolDiv.querySelector("#sortAttr2").value;
        const sortAttr3 = this.toolDiv.querySelector("#sortAttr3").value;
        const sortAttr1Asc = this.toolDiv.querySelector("#sortAttr1Asc").value;
        const sortAttr2Asc = this.toolDiv.querySelector("#sortAttr2Asc").value;
        const sortAttr3Asc = this.toolDiv.querySelector("#sortAttr3Asc").value;
        const hasExcludedColor = this.toolDiv.querySelector("#inSortHasExcludedAColor").checked;
        const sortExcludedColor = this.toolDiv.querySelector("#inSortExcludedColor").value;
        

        this.palette.ColorPalette.sortPalette(sortAttr1,    
            sortAttr1Asc === 'asc',
            sortAttr2,
            sortAttr2Asc === 'asc',
            sortAttr3,
            sortAttr3Asc === 'asc'
        );

        this.palette.innerHTML = '';
        this.palette.ColorPalette.paletteColors.forEach(color => {
            /** skip has exclude color and color match excluded color */
            if (hasExcludedColor && color.hex === sortExcludedColor) {
                return;
            }
            const aColorCard = new ColorCard(color, ColorContext.Palette);
            this.palette.appendChild(aColorCard);
        });
        this.palette.isCommited = false;
        this.palette.dispatchEvent(new CustomEvent('colorPaletteChange'));
    }
    bindToPalette(aPalette) {
        this.palette = aPalette;
    }   
}


export { SortPalette };
export default { SortPalette };

