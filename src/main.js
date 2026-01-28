import './style/style.css';
import './style/color.css';

import APPbuild from "./version.json";

import { Color, colorDIV , ColorContext} from './classes/color.js';



customElements.define('color-div', colorDIV);

/*
const p1 = new Color(Color.genRandomColor(), 'P1');
const p2 = new Color(Color.genRandomColor(), 'P2');
const p3 = new Color(Color.genRandomColor(), 'P3');
const p4 = new Color(Color.genRandomColor(), 'P4'); 

const in1 = new Color(Color.genRandomColor(), 'Random Color 1');
const in2 = new Color(Color.genRandomColor(), 'Random Color 1');

const out1 = new Color(Color.genRandomColor(), 'Out 1');
const out2 = new Color(Color.genRandomColor(), 'Out 2');
const out3 = new Color(Color.genRandomColor(), 'Out 3');

const color1Div = new colorDIV(p1, ColorContext.Palette);
const color2Div = new colorDIV(p2, ColorContext.Palette);
const color3Div = new colorDIV(p3, ColorContext.Palette);
const color4Div = new colorDIV(p4, ColorContext.Palette);   




document.body.appendChild(color1Div);
document.body.appendChild(color2Div);
document.body.appendChild(color3Div);
document.body.appendChild(color4Div);

document.body.appendChild(document.createElement('hr'));

const input1Div = new colorDIV(in1,ColorContext.ToolInput);
const input2Div = new colorDIV(in2,ColorContext.ToolInput);

document.body.appendChild(input1Div);
document.body.appendChild(input2Div);

document.body.appendChild(document.createElement('hr'));

const output1Div = new colorDIV(out1, ColorContext.ToolOutput);
const output2Div = new colorDIV(out2, ColorContext.ToolOutput);
const output3Div = new colorDIV(out3, ColorContext.ToolOutput);

document.body.appendChild(output1Div);
document.body.appendChild(output2Div);
document.body.appendChild(output3Div);

document.body.appendChild(document.createElement('hr'));




let footer = document.createElement('footer');
footer.innerText = `ColorPkr App - Version ${APPbuild} `;
document.body.appendChild(footer);


*/

/** add 5 div to toolbar */
const toolbar = document.getElementById('toolbar');
for (let i = 1; i <= 15; i++) {
  const navItem = document.createElement('div');
  navItem.innerText = `Nav ${i}`;
  toolbar.appendChild(navItem);
}

/** add 20 div to palette */
const palette = document.getElementById('palette');
for (let i = 1; i <= 250; i++) {
  const colorItem = document.createElement('div');
  colorItem.innerText = `Color ${i}`;
  palette.appendChild(colorItem);
}

/** add 2 div to tool input */
const toolInput = document.getElementById('toolInput');
for (let i = 1; i <= 2; i++) {
  const inputItem = document.createElement('div');
  inputItem.innerText = `In${i}`;
  toolInput.appendChild(inputItem);
}

const toolOutput = document.getElementById('toolOutput');
for (let i = 1; i <= 50; i++) {
  const outputItem = document.createElement('div');
  outputItem.innerText = `Out${i}`;
  toolOutput.appendChild(outputItem);
}   


