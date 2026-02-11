import './style/style.css';

import { Color, ColorCard, ColorContext } from './classes/color.js';
import { AboutTool } from './tools/about.js';
import { CommitTool } from './tools/commit.js';
import { UndoTool } from './tools/undo.js';
import { Tool } from './classes/tool.js';
import { SaveTool } from './tools/fileSave.js';
import { OpenTool } from './tools/fileOpen.js';
import { SettingsTool } from './tools/settings.js';

const defaultPaletteSize = 50;

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

const dummyTool = new Tool(() => {
  alert("This is a dummy tool. It does nothing.");
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
  clearPalette() {
    this.paletteColors = [];
  }
  /** resize the palette, if the new size is greater, add default color */
  resisePalette(newSize) {
    if (newSize > this.paletteColors.length) {
      for (let i = this.paletteColors.length; i < newSize; i++) {
        this.paletteColors.push(new Color());
      }
    } else {
      this.paletteColors = this.paletteColors.slice(0, newSize);
    }
  }
}


const appState = new AppState();

// Populate palette with some random colors for demonstration


const paletteDIV = document.getElementById('palette');
paletteDIV.isCommited = true;
paletteDIV.appState = appState;


const fileSaveTool = new SaveTool();
fileSaveTool.bindToPalette(paletteDIV);

const fileOpenTool = new OpenTool();
fileOpenTool.bindToPalette(paletteDIV);

const commitTool = new CommitTool();
commitTool.bindToPalette(paletteDIV);

const undoTool = new UndoTool();
undoTool.bindToPalette(paletteDIV);

const settingsTool = new SettingsTool();
settingsTool.bindToPalette(paletteDIV);


/* Show palette status */

/** catch custom event colorChange for paletteDIV */
paletteDIV.addEventListener('colorChange', (event) => {
  /** if is commited false, show commit button */
  if (!paletteDIV.isCommited) {
    commitTool.showButton();
  } else {
    commitTool.invisibleButton();
  }
});




undoTool.undo(() => {
  /** if palette is empty, fill with default colors */
  if (appState.paletteSize === 0) {
    for (let i = 1; i <= defaultPaletteSize; i++) {
      const defaultColor = new Color();
      appState.addColorToPalette(defaultColor);
      const aColorCard = new ColorCard(defaultColor, ColorContext.Palette);
      paletteDIV.appendChild(aColorCard);
    }
  }
  paletteDIV.isCommited = true;
});






/* Build the toolbar */


fileSaveTool.addTool(toolbar, '<img src="save.png">', tools, "Save Palette to File");
fileOpenTool.addTool(toolbar, '<img src="open.png">', tools, "Open Palette from File");
commitTool.addButton(toolbar, '<img src="commit.png">', "Commit Palette Colors");
undoTool.addButton(toolbar, '<img src="undo.png">', "Undo Last Change");
clearPaletteTool.addButton(toolbar, '<img src="clear.png">', "Clear Palette");
modeSwitchTool.addButton(toolbar, '<img src="darkmode.png">', "Dark Mode Swiitcher");
settingsTool.addTool(toolbar, '<img src="settings.png">', tools, "Settings");
aboutTool.addTool(toolbar, '<img src="about.png">', tools, "About ColorPkr");

// dummyTool.addTool(toolbar, '<img src="commit.png">', tools, "This is a dummy tool. It does nothing.");


/* Show default tool */
aboutTool.showTool();

