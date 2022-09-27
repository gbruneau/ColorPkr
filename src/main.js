import './style.css'
import APPbuild from "./version.json";

var defColor = "#808080";
var colID = 0;
var newCol;
var lastColor = 0;
var colorArraySize = 120;
var isDark = false;

document.getElementById("colPalette").title = `build ${APPbuild}`;

for (let i = 0; i < colorArraySize; i++) {
  newCol = `<div id="c${colID + i}" class="paletteColor">
      <input class="inColor" type="color" value="${defColor}" >
      <div class="hexColor">${defColor}</div>
      <div class="rgbColor">${hexToRgb(defColor).rgb}</div>
      <div class="hslColor100">${hexToHSL(defColor).hsl100}</div>
      <div class="hslColor255">${hexToHSL(defColor).hsl255}</div>
  </div>`;
  document.getElementById("colPalette").innerHTML += newCol;
}

var changeColor = function () {
  var newCol = this.value;
  var thisID = this.parentElement.id.substring(1);
  setHexColor("c", thisID, newCol);
  lastColor = Math.max(lastColor, thisID);
  document.getElementById("btSave").style.visibility = "visible";
};



var colors = document.getElementById("colPalette").getElementsByClassName("inColor");

for (var i = 0; i < colors.length; i++) {
  colors[i].addEventListener("change", changeColor);
}

document.getElementById("btReset").addEventListener("click", resetColor);
document.getElementById("btLoad").addEventListener("click", loadColor);
document.getElementById("btSave").addEventListener("click", saveColor);
document.getElementById("btRandom").addEventListener("click", randomColor);
document.getElementById("btFlipBG").addEventListener("click", flipBG);

document.getElementById("btMix1").addEventListener("click", function () { goTab(0) });
document.getElementById("btMix2").addEventListener("click", function () { goTab(1) });

document.getElementById("inColorHslMix").addEventListener("change", genMixHSL);
document.getElementById("inHSLSteps").addEventListener("change", genMixHSL);
document.getElementById("inH").addEventListener("change", genMixHSL);
document.getElementById("inS").addEventListener("change", genMixHSL);
document.getElementById("inL").addEventListener("change", genMixHSL);

document.getElementById("inColorMix1").addEventListener("change", genMix2Color);
document.getElementById("inColorMix2").addEventListener("change", genMix2Color);
document.getElementById("inMix2Steps").addEventListener("change", genMix2Color);
document.getElementById("inMix2Mode").addEventListener("change", genMix2Color);

setMainBGColor();
loadColor();
//setHexColor("mhsl", 1, "#808080")
genMixHSL();
genMix2Color();

// ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  === 

function setMainBGColor() {
  var darkColor = getComputedStyle(document.documentElement).getPropertyValue('--darkColor');
  var lightColor = getComputedStyle(document.documentElement).getPropertyValue('--lightColor');
  var darkPannel = getComputedStyle(document.documentElement).getPropertyValue('--darkPannel');
  var lightPannel = getComputedStyle(document.documentElement).getPropertyValue('--lightPannel');


  document.body.style.backgroundColor = isDark ? darkColor : lightColor;
  document.body.style.color = isDark ? lightColor : darkColor;

  var cols = document.querySelectorAll("#colPalette .paletteColor input");
  for (i = 0; i < cols.length; i++) {
    cols[i].style.backgroundColor = isDark ? darkColor : lightColor;
    cols[i].style.borderColor = isDark ? darkColor : lightColor;
  }
  cols = document.querySelectorAll("#colorPanel .paletteColor input");
  for (i = 0; i < cols.length; i++) {
    cols[i].style.backgroundColor = isDark ? darkPannel : lightPannel;
    cols[i].style.borderColor = isDark ? darkPannel : lightPannel;
  }

  document.querySelector("#btFlipBG span").title = isDark ? "Light Mode" : "Dark Mode";

  document.getElementById("colorPanel").style.backgroundColor = isDark ? darkPannel : lightPannel;

}

function resetColor() {
  var colors = document.getElementById("colPalette").getElementsByClassName("inColor");
  for (var i = 0; i < colors.length; i++) {
    setHexColor("c", i, defColor);
    lastColor = 0;
  }
  document.getElementById("btSave").style.visibility = "hidden";
}

function flipBG() {
  isDark = !isDark;
  setMainBGColor();
}


function setHexColor(colorPrefix, colorID, aColorHex) {
  var colID = `${colorPrefix}${colorID}`;
  var aCol = document.getElementById(colID);
  /*
    if (colorPrefix != "c") {
      console.log(aColorHex);
    }
  */
  var aColorHexCode = /[a-f\d]{6}/i.exec(aColorHex)[0];
  aCol.querySelector("input").value = "#" + aColorHexCode;
  aCol.querySelector(".hexColor").innerText = "#" + aColorHexCode;
  aCol.querySelector(".rgbColor").innerText = hexToRgb(aColorHexCode).rgb;
  aCol.querySelector(".hslColor100").innerText = hexToHSL(aColorHexCode).hsl100;
  aCol.querySelector(".hslColor255").innerText = hexToHSL(aColorHexCode).hsl255;
}



function hexToHSL(hex) {
  var result = /#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  var h360 = parseInt(h * 3600) / 10;
  var s100 = parseInt(s * 1000) / 10;
  var l100 = parseInt(l * 1000) / 10;

  var h255 = parseInt(h * 255);
  var s255 = parseInt(s100 / 100 * 255);
  var l255 = parseInt(l * 255);

  return {
    "h360": h360,
    "s100": s100,
    "l100": l100,
    "hsl100": `hsl(${h360},${s100}%,${l100}%)`,
    "hsl255": `hsl(${h255},${s255},${l255})`
  }

}





function hsl360ToRGB(h, s1, l1) {
  // h = 0..360 s1 = 0..100 l1 = 0..100
  // Must be fractions of 1
  var s = s1 / 100;
  var l = l1 / 100;
  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs((h / 60) % 2 - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  var rgbHex = `${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return {
    "r": r,
    "g": g,
    "b": b,
    "rgbHex": rgbHex,
    "rgbCol": `#${rgbHex}`,
    "hsl100": `hsl(${Math.round(h * 10) / 10},${Math.round(s1 * 10) / 10}%,${Math.round(l1 * 10) / 10}%)`,
    "hsl255": `hsl(${Math.round(h / 360 * 255)},${Math.round(s * 255)},${Math.round(l1 / 100 * 255)})`,
  }
}

function goTab(aTabIndex) {
  const allTabs = document.querySelectorAll('.aTab');
  var i = 0;
  allTabs.forEach(aTab => {
    if (i == aTabIndex)
      aTab.style.display = 'flex';
    else
      aTab.style.display = 'none';
    i++;
  });
  const allTabsBt = document.querySelectorAll('.btTab');
  i=0;
  allTabsBt.forEach(aTabBt => {
    if (i == aTabIndex)
      aTabBt.classList.add("btTabOn");
    else
      aTabBt.classList.remove("btTabOn");
    i++;
  });
}

function hexToRgb(hex) {
  var result = /#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  return {
    "r": r,
    "g": g,
    "b": b,
    "rgb": `rgb(${r},${g},${b})`
  };
}

function loadColor() {
  var c = getCookie("colors");
  var aCol;
  if (c === "") c = "[]";
  var colors = c.match(/#?[0-9a-f]{6}/gi);
  resetColor();
  if (colors != null) {
    for (var i = 0; i < colors.length; i++) {
      setHexColor("c", i, colors[i]);
      lastColor = i;
    }
  }
}

function randomColor() {
  var newCol;
  for (var i = 0; i < colorArraySize; i++) {
    newCol = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setHexColor("c", i, newCol);
  }
  lastColor = colorArraySize - 1;
  document.getElementById("btSave").style.visibility = "visible";
}


function saveColor() {
  var colArray = [];
  var colors = document.getElementById("colPalette").getElementsByClassName("inColor");
  for (var i = 0; i <= lastColor; i++) {
    colArray.push(colors[i].value);
  }
  var c = JSON.stringify(colArray);
  setCookie("colors", c, 100);
}



/* cookies functions */

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires;
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function rgbToHex(r, g, b) {
  return `${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}


function genMix2Color() {
  // Mix 2 input colors acording to mode
  var inMix2Steps = parseInt(document.getElementById("inMix2Steps").value);
  var inMix2Mode = parseInt(document.getElementById("inMix2Mode").value);
  var inColorMix1 = document.getElementById("inColorMix1").value;
  var inColorMix2 = document.getElementById("inColorMix2").value;
  var mix2PaletteContainer = document.getElementById("Mix2PaletteContainer");
  // Clear old palette
  const mix2Palette = mix2PaletteContainer.querySelectorAll('.paletteColor');
  mix2Palette.forEach(aColor => {
    aColor.remove();
  });

  // get starting and ending points  
  var c1RGB = hexToRgb(inColorMix1);
  var c2RGB = hexToRgb(inColorMix2);
  var r1 = c1RGB.r;
  var g1 = c1RGB.g;
  var b1 = c1RGB.b;
  var r2 = c2RGB.r;
  var g2 = c2RGB.g;
  var b2 = c2RGB.b;

  var c1HSL = hexToHSL(inColorMix1);
  var c2HSL = hexToHSL(inColorMix2);
  var h1 = c1HSL.h360;
  var s1 = c1HSL.s100;
  var l1 = c1HSL.l100;
  var h2 = c2HSL.h360;
  var s2 = c2HSL.s100;
  var l2 = c2HSL.l100;
  // get delta value
  var dR = (r2 - r1) / (inMix2Steps - 1);
  var dG = (g2 - g1) / (inMix2Steps - 1);
  var dB = (b2 - b1) / (inMix2Steps - 1);

  var dH = (h2 - h1) / (inMix2Steps - 1);
  var dS = (s2 - s1) / (inMix2Steps - 1);
  var dL = (l2 - l1) / (inMix2Steps - 1);

  var rgbcol, r, g, b, h, s, l, nr, ng, nb, rgb, hsl100, hsl255, html;

  setColorLabel("mixC1", inColorMix1);
  setColorLabel("mixC2", inColorMix2);

  for (let i = 0; i < inMix2Steps; i++) {
    if (i == 0) { // First step
      r = r1;
      g = g1;
      b = b1;
      h = h1;
      s = s1;
      l = l1;
    } else if (i == (inMix2Steps - 1)) { // Last step
      r = r2;
      g = g2;
      b = b2;
      h = h2;
      s = s2;
      l = l2;
    } else { // mid steps
      r = r1 + (dR * i);
      g = g1 + (dG * i);
      b = b1 + (dB * i);
      h = h1 + (dH * i);
      s = s1 + (dS * i);
      l = l1 + (dL * i);
    }

    if (inMix2Mode == "RGB") {  // RGB delta base
      rgbcol = `#${rgbToHex(r, g, b)}`;
      nr = r;
      ng = g;
      nb = b;
      hsl100 = hexToHSL(rgbcol).hsl100;
      hsl255 = hexToHSL(rgbcol).hsl255;
    }
    else { // HSL delat base
      rgb = hsl360ToRGB(h, s, l);
      rgbcol = rgb.rgbCol;
      nr = rgb.r;
      ng = rgb.g;
      nb = rgb.b;
      hsl100 = rgb.hsl100;
      hsl255 = rgb.hsl255;
    }

    html = `<div id="mixTwo${i + 2}" class="paletteColor">
    <input class="inColor" type="color" value="${rgbcol}" disabled">
    <div class="hexColor">${rgbcol}</div>
    <div class="rgbColor">rgb(${nr},${ng},${nb})</div>
    <div class="hslColor100">${hsl100}</div>
    <div class="hslColor255">${hsl255}</div>
  </div>`;

    Mix2PaletteContainer.innerHTML += html;

  }

}

function setColorLabel(nodeID, hexColor) {
  document.querySelector(`#${nodeID} .hexColor`).innerText = `${hexColor}`;
  var rgb = hexToRgb(hexColor);
  document.querySelector(`#${nodeID} .rgbColor`).innerText = `${rgb.rgb}`;
  var hsl = hexToHSL(hexColor);
  document.querySelector(`#${nodeID} .hslColor100`).innerText = `${hsl.hsl100}`;
  document.querySelector(`#${nodeID} .hslColor255`).innerText = `${hsl.hsl255}`;
}



function genMixHSL() {
  var baseColor = document.querySelector("#mhsl1 input").value;
  var steps = parseInt(document.getElementById("inHSLSteps").value);
  var deltaH = parseInt(document.getElementById("inH").value);
  var deltaS = parseInt(document.getElementById("inS").value);
  var deltaL = parseInt(document.getElementById("inL").value);

  var hsl = hexToHSL(baseColor);
  var h = hsl.h360;
  var s = hsl.s100;
  var l = hsl.l100;
  var rgb;

  var html;
  var hslMixPaletteContainer = document.getElementById("hslMixPaletteContainer");

  const hslMixPalette = hslMixPaletteContainer.querySelectorAll('.paletteColor');

  hslMixPalette.forEach(aColor => {
    aColor.remove();
  });

  setColorLabel("mhsl1", baseColor);

  for (let i = 0; i < steps; i++) {
    rgb = hsl360ToRGB(h, s, l);

    html = `<div id="mhsl${i + 2}" class="paletteColor">
    <input class="inColor" type="color" value="${rgb.rgbCol}" disabled">
    <div class="hexColor">${rgb.rgbCol}</div>
    <div class="rgbColor">rgb(${rgb.r},${rgb.g},${rgb.b})</div>
    <div class="hslColor100">${rgb.hsl100}</div>
    <div class="hslColor255">${rgb.hsl255}</div>
  </div>`;

    hslMixPaletteContainer.innerHTML += html;

    h = Math.max(Math.min((h + deltaH) < 0 ? 360 + (h + deltaH) : (h + deltaH), 360), 0);
    s = Math.max(Math.min(s + deltaS, 100), 0);
    l = Math.max(Math.min(l + deltaL, 100), 0);

  }
}