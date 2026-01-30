import './style/style.css';

import { Color, ColorCard, ColorContext } from './classes/color.js';
import { AboutTool } from './tools/about.js';
import { CommitTool } from './tools/commit.js';
import { UndoTool } from './tools/undo.js';
import { Tool } from './classes/tool.js';

customElements.define('color-card', ColorCard);

var toolbar = document.getElementById('toolbar');
var tools = document.getElementById('tools');

/** === Initialize Tools  === */


const aboutTool = new AboutTool()

/** mode switcher */
const modeSwitchTool = new Tool(() => {
  document.body.classList.toggle('dark-mode');
  /** for all color-card elements */
  const colorCards = document.querySelectorAll('.color-card');
  colorCards.forEach(card => {
    card.classList.toggle('dark-mode');
  });
});

/** clear palette tool */
const clearPaletteTool = new Tool(() => {
  const pDIV = document.getElementById('palette');

  const colorCards = pDIV.querySelectorAll('.color-card');
  colorCards.forEach(card => {
    card.resetColorCard();
  });
});



/** ================================= */

class AppState {
  constructor() {
    this.paletteColors = [];
  }
  /**
   * Add a color to the palette
   * @param {Color} color 
   */
  addColorToPalette(color = this.defaultColor) {
    this.paletteColors.push(color);
  }
  get paletteSize() {
    return this.paletteColors.length;
  }
}


const appState = new AppState();

// Populate palette with some random colors for demonstration


const paletteDIV = document.getElementById('palette');
paletteDIV.isCommited = true;



for (let i = 1; i <= 250; i++) {
  const defaultColor = new Color();
  appState.addColorToPalette(defaultColor);
  const aColorCard = new ColorCard(defaultColor, ColorContext.Palette);
  paletteDIV.appendChild(aColorCard);
}

const commitTool = new CommitTool();
commitTool.bindToPalette(paletteDIV);

const undoTool = new UndoTool();
undoTool.bindToPalette(paletteDIV);


/* Show palette status */


/* Build the toolbar */
commitTool.addButton(toolbar, "✔️", "Commit Palette Colors");
undoTool.addButton(toolbar, "↩️", "Undo Last Change"); 
clearPaletteTool.addButton(toolbar, "🧹", "Clear Palette");
modeSwitchTool.addButton(toolbar, '🌗', "Dark Mode Swiitcher");;
aboutTool.addTool(toolbar, "?", tools, "About ColorPkr");


/* Show default tool */
aboutTool.showTool();

