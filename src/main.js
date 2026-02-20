import './asset/style.css';

import appIcon from './asset/ColorPkrIcon.svg';

import { Tool } from './components/tool.js';    
import {  ColorCard } from './components/colorCard/colorCard.js';
import { ColorPalette } from './utils/colorPalette.js';
import { AboutTool } from './components/about/about.js';
import { CommitTool } from './components/db/commit.js';
import { UndoTool } from './components/db/undo.js';
import { SaveTool } from './components/file/fileSave.js';
import { OpenTool } from './components/file/fileOpen.js';
import { SettingsTool } from './components/settings/settings.js';
import { ModesTool } from './components/settings/modes.js';
import { ClearTool } from './components/db/clear.js';
import { GradientTool } from './components/colorTools/gradient.js';
import { SliderTool } from './components/colorTools/slider.js';
import { LoremTool } from './components/colorTools/lorem.js';
import { LockTool } from './components/colorTools/lock.js';

const DEFAULT_PALETTE_SIZE = 20;

/** add app icon to document head */
const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/png';
link.href = appIcon;
document.head.appendChild(link);  

customElements.define('color-card', ColorCard);

var toolbar = document.getElementById('toolbar');
var tools = document.getElementById('tools');




const colorPalette = new ColorPalette();

/** === Initialize Tools  === */


const aboutTool = new AboutTool()
const modeSwitchTool = new ModesTool();
const clearPaletteTool = new ClearTool();


const paletteDIV = document.getElementById('palette');
paletteDIV.isCommited = true;
paletteDIV.ColorPalette = colorPalette;


const fileSaveTool = new SaveTool();
fileSaveTool.bindToPalette(paletteDIV);

const fileOpenTool = new OpenTool();
fileOpenTool.bindToPalette(paletteDIV);

const commitTool = new CommitTool();
commitTool.bindToPalette(paletteDIV);

const undoTool = new UndoTool(DEFAULT_PALETTE_SIZE);
undoTool.bindToPalette(paletteDIV);

const settingsTool = new SettingsTool();
settingsTool.bindToPalette(paletteDIV);

const gradientTool = new GradientTool();
const sliderTool = new SliderTool();

const loremTool = new LoremTool();

const lockTool = new LockTool();

/* Show palette status */

/** catch custom event colorCardChange for paletteDIV */
paletteDIV.addEventListener('colorPaletteChange', (event) => {
  /** if is commited false, show commit button */
  if (!paletteDIV.isCommited) {
    commitTool.showButton();
  } else {
    commitTool.invisibleButton();
  }
});

undoTool.undo()

/* Build the toolbar */

fileOpenTool.addTool(tools,toolbar );
fileSaveTool.addTool(tools,toolbar );
Tool.createSeparator(toolbar);

clearPaletteTool.addButton(toolbar);
undoTool.addButton(toolbar);
commitTool.addButton(toolbar);
Tool.createSeparator(toolbar);

gradientTool.addTool(tools, toolbar);
sliderTool.addTool(tools, toolbar);
lockTool.addTool(tools, toolbar);
loremTool.addTool(tools, toolbar);

Tool.createSeparator(toolbar);

modeSwitchTool.addButton(toolbar);
settingsTool.addTool(tools,toolbar);
aboutTool.addTool(tools,toolbar);


/** Default tool to gradient */
// gradientTool.showTool();
gradientTool.showTool();
modeSwitchTool.initMode();


