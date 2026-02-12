import './asset/style.css';

import appIcon from './asset/ColorPkrIcon.png';

import { Color, ColorCard, ColorContext } from './components/colorCard/colorCard.js';
import { AboutTool } from './components/about/about.js';
import { CommitTool } from './components/db/commit.js';
import { UndoTool } from './components/db/undo.js';
import { SaveTool } from './components/file/fileSave.js';
import { OpenTool } from './components/file/fileOpen.js';
import { SettingsTool } from './components/settings/settings.js';
import { ModesTool } from './components/settings/modes.js';
import { ClearTool } from './components/db/clear.js';
import { GradientTool } from './components/colorTools/gradient.js';

/** add app icon to document head */
const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/png';
link.href = appIcon;
document.head.appendChild(link);  



const defaultPaletteSize = 50;

customElements.define('color-card', ColorCard);

var toolbar = document.getElementById('toolbar');
var tools = document.getElementById('tools');

/** === Initialize Tools  === */


const aboutTool = new AboutTool()

/** mode switcher */
const modeSwitchTool = new ModesTool();


/** clear palette tool */
const clearPaletteTool = new ClearTool();


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

const gradientTool = new GradientTool();

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


fileSaveTool.addTool(tools,toolbar );
fileOpenTool.addTool(tools,toolbar );


commitTool.addButton(toolbar);

undoTool.addButton(toolbar);

clearPaletteTool.addButton(toolbar);
modeSwitchTool.addButton(toolbar);

gradientTool.addTool(tools, toolbar);

settingsTool.addTool(tools,toolbar);
aboutTool.addTool(tools,toolbar);


aboutTool.showTool();

