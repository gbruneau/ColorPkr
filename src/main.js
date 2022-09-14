import './style.css'
import APPbuild from "./version.json";

var defColor = "#808080";
var colID = 0;
var newCol;
var lastColor = 0;
var colorArraySize = 120;
var isDark = false;

document.getElementById("toolbar").title=`build ${APPbuild}`;

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
document.getElementById("inColorHslMix").addEventListener("change",genMixHSL);
document.getElementById("inHSLSteps").addEventListener("change",genMixHSL);
document.getElementById("inH").addEventListener("change",genMixHSL);
document.getElementById("inS").addEventListener("change",genMixHSL);
document.getElementById("inL").addEventListener("change",genMixHSL);
setMainBGColor();
loadColor();
setHexColor("mhsl", 1, "#808080")
genMixHSL();


// ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  === 

function setMainBGColor() {
  var darkColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--darkColor');
  var lightColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--lightColor');

  document.body.style.backgroundColor = isDark ? darkColor : lightColor;
  document.body.style.color = isDark ? lightColor : darkColor;

  var cols = document.querySelectorAll(".paletteColor input");
  for (i = 0; i < cols.length; i++) {
    cols[i].style.backgroundColor = isDark ? darkColor : lightColor;
    cols[i].style.borderColor = isDark ? darkColor : lightColor;
  }

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
  var s255 = parseInt(s * 255);
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
    "hsl100": `hsl(${ Math.round( h * 10)/10  },${  Math.round( s1 * 10)/10   }%,${Math.round( l1 * 10)/10 }%)`,
    "hsl255": `hsl(${Math.round(h / 360 * 255)},${Math.round(s / 100 * 255)},${Math.round(l / 100 * 255)})`,
  }
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
  var colors = c.match(/#[0-9a-f]{6}/gi);
  resetColor();
  for (var i = 0; i < colors.length; i++) {
    setHexColor("c", i, colors[i]);
    lastColor = i;
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

function genMixHSL() {
  var baseColor = document.querySelector("#mhsl1 input").value;
  var steps = parseInt(document.getElementById("inHSLSteps").value);
  var deltaH = parseInt(document.getElementById("inH").value) ;
  var deltaS = parseInt(document.getElementById("inS").value) ;
  var deltaL = parseInt(document.getElementById("inL").value) ;

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

  for (let i = 0; i < steps; i++) {
    rgb = hsl360ToRGB(h, s, l);

    html = `<div id="mhsl${i + 2}" class="paletteColor">
    <input class="inColor" type="color" value="${rgb.rgbCol}" disabled">
    <div class="hexColor">${rgb.rgbCol}</div>
    <div class="rgbColor">rgb(${rgb.r},${rgb.g},${rgb.b})</div>
    <div class="hslColor100">${rgb.hsl100}</div>
    <div class="hslColor255">${rgb.hsl255}</div>
  </div>`;

    console.log(`i=${i}`);
    hslMixPaletteContainer.innerHTML += html;

    h = Math.max(Math.min((h + deltaH)<0 ? 360 + (h + deltaH) : (h + deltaH)    , 360), 0);
    s = Math.max(Math.min(s + deltaS, 100), 0);
    l = Math.max(Math.min(l + deltaL, 100), 0);

  }
}