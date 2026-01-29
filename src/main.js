import './style/style.css';

import { Color, ColorCard , ColorContext} from './classes/color.js';
import { AboutTool} from './tools/about.js';
import   {Tool} from './classes/tool.js';

customElements.define('color-card', ColorCard);

var toolbar = document.getElementById('toolbar');
var tools = document.getElementById('tools');

/** === Initialize Tools  === */


const aboutTool = new AboutTool()
const dummyTool = new Tool(() => dummyTool.showTool());
dummyTool.toolDiv.innerHTML = `<h2>Dummy Test Tool</h2><p>This is a test tool.</p>`;

/** mode switcher */
const modeSwitchTool = new Tool(() => {
  document.body.classList.toggle('dark-mode');
});

/* Build the toolbar */
dummyTool.addTool(toolbar,"dummy",tools);
modeSwitchTool.addButton(toolbar,'🌗',"Dark Mode Swiitcher");  ;
aboutTool.addTool(toolbar,"A",tools,"About ColorPkr");  

/* Show default tool */
aboutTool.showTool();

/** ================================= */

class AppState {
  constructor() {
    this.paletteColors = [];
  }
  addColorToPalette(color=this.defaultColor) {
    this.paletteColors.push(color);
  }
  get paletteSize() {
    return this.paletteColors.length;
  } 
}


const appState = new AppState();

// Populate palette with some random colors for demonstration



const palette = document.getElementById('palette');
for (let i = 1; i <= 250; i++) {
  const defaultColor = new Color();
  appState.addColorToPalette(defaultColor);
  const aColorCard = new ColorCard(defaultColor, ColorContext.Palette);
  palette.appendChild(aColorCard);
}   
