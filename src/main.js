import './style.css'
import APPbuild from "./version.json";

var defColor = "#808080";
var colID = 1;
var newCol;
var lastColor = 0;
var colorPaletteSize = 250;
var isDark = false;
var elm;
var hasAboutBox=false;

for (let i = 0; i < colorPaletteSize; i++) {
  newCol = colHexCodeToHTML(`c${colID + i}`, defColor, defColor.slice(1), true,false)
  document.getElementById("colPalette").innerHTML += newCol;
};

for (let i = 0; i < colorPaletteSize; i++) {
  elm = document.querySelector(`#c${colID + i} .colTitle`)
  elm.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
    document.getElementById("btSave").style.visibility = "visible";
  });
}



var changePaletteColor = function () {
  var newCol = this.value;
  var thisID = this.parentElement.id.substring(1);
  setHexColor("c", thisID, newCol, newCol.slice(1));
  lastColor = Math.max(lastColor, thisID);
  document.getElementById("btSave").style.visibility = "visible";
};



var colors = document.getElementById("colPalette").getElementsByClassName("inColor");

for (var i = 0; i < colors.length; i++) {
  colors[i].addEventListener("change", changePaletteColor);
}

document.getElementById("btReset").addEventListener("click", resetColor);
document.getElementById("btLoad").addEventListener("click", loadColor);
document.getElementById("btSave").addEventListener("click", saveColor);
document.getElementById("btRandom").addEventListener("click", randomColor);
document.getElementById("btFlipBG").addEventListener("click", flipBG);
document.getElementById("btAbout").addEventListener("click", toggleAboutBox);
document.getElementById("aboutBox").addEventListener("click", toggleAboutBox);


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

let db;
const dbName = "ColorPkr";
const dbConnection = indexedDB.open(dbName, 1);

// If db exist
dbConnection.onsuccess = (event) => {
  db = event.target.result;
  loadColor();
};

// if db does not exist create collections
dbConnection.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore("colors", {
    keyPath: "id",
    autoIncrement: true
  });
};
document.getElementById("aboutBoxBuild").innerText = APPbuild
setMainBGColor();
genMixHSL();
genMix2Color();


// Drag and drop handling

var dragTargets;
window.dragSrcEl=null;
addDragSource("input[type=color]");

dragTargets=document.querySelectorAll("#colPalette input,#inColorHslMix,#inColorMix1,#inColorMix2");
dragTargets.forEach(function(target){
  target.addEventListener("dragover", handleDragOver);
  target.addEventListener("dragenter", handleDragEnter);
  target.addEventListener("dragleave", handleDragLeave);
  target.addEventListener("drop", handleDrop);
});



// ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  === 

function toggleAboutBox(){
  if(hasAboutBox)
     document.getElementById("aboutBox").style.display="none";
  else
     document.getElementById("aboutBox").style.display="block";
  hasAboutBox=!hasAboutBox   
}

function addDragSource(aSelector){
  var dragSources = document.querySelectorAll(aSelector);
  dragSources.forEach(function (src) {
    src.addEventListener("dragstart", handleDragStart);
    src.addEventListener("dragend", handleDragEnd);
  });
  }

function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  if (dragSrcEl !== this) {
    var srcIsPalette = (dragSrcEl.parentElement.id.charAt(0)) == "c";
    var trgIsPalette = (this.parentElement.id.charAt(0)) == "c";
    if (srcIsPalette && trgIsPalette) {
      var srcCol = dragSrcEl.value;
      var srcTitle = dragSrcEl.parentElement.querySelector(".colTitle").innerText;
      var trgCol = this.value;
      var trgTitle = this.parentElement.querySelector(".colTitle").innerText;
      dragSrcEl.value = trgCol;
      this.value = srcCol;
      const eventChange = new Event("change");
      this.dispatchEvent(eventChange);
      dragSrcEl.dispatchEvent(eventChange);
      this.parentElement.querySelector(".colTitle").innerText = srcTitle;
      dragSrcEl.parentElement.querySelector(".colTitle").innerText = trgTitle;
    }
    else if (trgIsPalette) {
      var srcCol = dragSrcEl.value;
      this.value = srcCol;
      const eventChange = new Event("change");
      this.dispatchEvent(eventChange);
    } 
    else if (srcIsPalette) {
      var srcCol = dragSrcEl.value;
      this.value = srcCol;
      const eventChange = new Event("change");
      this.dispatchEvent(eventChange);
    } 
    else {
      var srcCol = dragSrcEl.value;
      this.value = srcCol;
      const eventChange = new Event("change");
      this.dispatchEvent(eventChange);
    }
  }
  return false;
}

function handleDragStart(e) {
  this.classList.add("selectedDragSource") ;
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "copy";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove("selectedDragSource");
  var dragTargets = document.querySelectorAll("#colPalette input,#inColorHslMix,#inColorMix1,#inColorMix2");
  dragTargets.forEach(function (item) {
    item.classList.remove("dragOver");
  });
}

function handleDragOver(e) {
  e.preventDefault();
  return false;
}

function handleDragEnter(e) {
  this.classList.add("dragOver");
}

function handleDragLeave(e) {
  this.classList.remove("dragOver");
}

function colHexCodeToHTML(aDomID, aColHex, aColTitle, hasTitle,isReadOnly) {
  var html = `<div id="${aDomID}" class="paletteColor">
  <input class="inColor" type="color" value="${aColHex}" draggable="true" ${isReadOnly?"disabled='true'":""}">
  ${hasTitle ? '<div class="colTitle"   contenteditable="true"   >' + aColTitle + '</div>' : ""} 
  <div class="hexColor">${aColHex}</div>
  <div class="rgbColor">${hexToRgb(aColHex).rgb}</div>
  <div class="hslColor100">${hexToHSL(aColHex).hsl100}</div>
  <div class="hslColor255">${hexToHSL(aColHex).hsl255}</div>
</div>`;
  return html
}

function setMainBGColor() {

  var darkBG = getComputedStyle(document.documentElement).getPropertyValue('--darkBG');
  var darkColor = getComputedStyle(document.documentElement).getPropertyValue('--darkColor');
  var darkPannel = getComputedStyle(document.documentElement).getPropertyValue('--darkPannel');
  var darkTitle = getComputedStyle(document.documentElement).getPropertyValue('--darkTitle');

  var lightBG = getComputedStyle(document.documentElement).getPropertyValue('--lightBG');
  var lightColor = getComputedStyle(document.documentElement).getPropertyValue('--lightColor');
  var lightPannel = getComputedStyle(document.documentElement).getPropertyValue('--lightPannel');
  var lightTitle = getComputedStyle(document.documentElement).getPropertyValue('--lightTitle');

  document.body.style.backgroundColor = isDark ? darkBG : lightBG;
  document.body.style.color = isDark ? darkColor : lightColor;

  // Color pannel
  document.getElementById("colorPanel").style.backgroundColor = isDark ? darkPannel : lightPannel;
  // Color pannel input
  cols = document.querySelectorAll("#colorPanel .paletteColor input")
  cols.forEach(aColor => {
    aColor.style.backgroundColor = isDark ? darkPannel : lightPannel;
    aColor.style.borderColor = isDark ? darkPannel : lightPannel;
  })

  // color palette input
  var cols = document.querySelectorAll("#colPalette .paletteColor input")
  cols.forEach(aColor => {
    aColor.style.backgroundColor = isDark ? darkBG : lightBG;
    aColor.style.borderColor = isDark ? darkBG : lightBG;
  })
  // color palette input title
  var cols = document.querySelectorAll("#colPalette .paletteColor .colTitle")
  cols.forEach(aColor => {
    aColor.style.color = isDark ? darkTitle : lightTitle;
  })

  // Dark/Light mode Button
  document.querySelector("#btFlipBG span").title = isDark ? "Light Mode" : "Dark Mode";
}

function resetColor() {
  var colors = document.getElementById("colPalette").getElementsByClassName("inColor");
  for (var i = 0; i < colors.length; i++) {
    setHexColor("c", i + 1, defColor, defColor.slice(1));
    lastColor = 0;
  }
  document.getElementById("btSave").style.visibility = "hidden";
}

function flipBG() {
  isDark = !isDark;
  setMainBGColor();
}

function setHexColor(colorPrefix, colorID, aColorHex, aTitle) {
  var colID = `${colorPrefix}${colorID}`;
  var aCol = document.getElementById(colID);
  var aColorHexCode = /[a-f\d]{6}/i.exec(aColorHex)[0];
  var titleElem
  aCol.querySelector("input").value = "#" + aColorHexCode;
  aCol.querySelector(".hexColor").innerText = "#" + aColorHexCode;

  titleElem = aCol.querySelector(".colTitle")
  if (titleElem) titleElem.innerText = aTitle;

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
  i = 0;
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
  resetColor();
  var transaction = db.transaction("colors", "readonly");
  var objectStore = transaction.objectStore("colors");
  var request = objectStore.openCursor();
  request.onsuccess = function (event) {
    var cursor = event.target.result;
    if (cursor) {
      setHexColor("c", cursor.value.id, cursor.value.hexColor, cursor.value.title);
      cursor.continue();
    }
  }
};

function randomColor() {
  var newCol;
  for (var i = 0; i < colorPaletteSize; i++) {
    newCol = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setHexColor("c", i+1, newCol);
  }
  lastColor = colorPaletteSize - 1;
  document.getElementById("btSave").style.visibility = "visible";
}

function saveColor() {
  var colHex, colTitle, colID
  var colors = document.getElementById("colPalette").getElementsByClassName("paletteColor");
  for (var aCol of colors) {
    colTitle = aCol.querySelector(".colTitle").innerText
    colID = aCol.id.slice(1);
    colHex = aCol.querySelector(".inColor").value
    updateColorToDB(colID, colHex, colTitle)
  }
  document.getElementById("btSave").style.visibility = "hidden";
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
  var inMix2Steps = parseInt(document.getElementById("inMix2Steps").value);
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

  // get delta value
  var dR = (r2 - r1) / (inMix2Steps - 1);
  var dG = (g2 - g1) / (inMix2Steps - 1);
  var dB = (b2 - b1) / (inMix2Steps - 1);



  var rgbcol, r, g, b, html;

  setColorLabel("mixC1", inColorMix1);
  setColorLabel("mixC2", inColorMix2);

  for (let i = 0; i < inMix2Steps; i++) {
    if (i == 0) { // First step
      r = r1;
      g = g1;
      b = b1;
    } else if (i == (inMix2Steps - 1)) { // Last step
      r = r2;
      g = g2;
      b = b2;
    } else { // mid steps
      r = r1 + (dR * i);
      g = g1 + (dG * i);
      b = b1 + (dB * i);
    }

    r = Math.round(r)
    g = Math.round(g)
    b = Math.round(b)

    rgbcol = `#${rgbToHex(r, g, b)}`;
    html = colHexCodeToHTML(`mixTwo${i + 2}`, rgbcol, null, false,true)
    Mix2PaletteContainer.innerHTML += html;

  }
  addDragSource("#Mix2PaletteContainer input[type=color]");
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
  var steps = Math.max(parseInt(document.getElementById("inHSLSteps").value), 2);
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
    html = colHexCodeToHTML(`mhsl${i + 2}`, rgb.rgbCol, null, false,true)
    hslMixPaletteContainer.innerHTML += html;
    h = Math.max(Math.min((h + deltaH) < 0 ? 360 + (h + deltaH) : (h + deltaH), 360), 0);
    s = Math.max(Math.min(s + deltaS, 100), 0);
    l = Math.max(Math.min(l + deltaL, 100), 0);
  }
  addDragSource("#hslMixPaletteContainer input[type=color]");
}

// === Database Functions ===


function updateColorToDB(anID, anHexcode, aTitle = "") {
  const colorTable = db
    .transaction("colors", "readwrite")
    .objectStore("colors");
  const r = colorTable.put({
    hexColor: anHexcode,
    title: aTitle.trim() == "" ? anHexcode : aTitle,
    id: anID
  });
  r.onsuccess = function (e) {
    return r.result;
  };
  r.onerror = function (e) {
    return null;
  };
}


function addColorToDB(anHexcode, aTitle = "") {
  const colorTable = db
    .transaction("colors", "readwrite")
    .objectStore("colors");
  const r = colorTable.add({
    hexColor: anHexcode,
    title: aTitle.trim() == "" ? anHexcode : aTitle
  });
  r.onsuccess = function (e) {
    return r.result;
  };
  r.onerror = function (e) {
    return null;
  };
}

function getColorFromDB(id) {
  const colorTable = db.transaction("colors", "readonly").objectStore("colors");
  const request = colorTable.get(id);
  request.onsuccess = function () {
    console.log(request.result);
  };
}

function deleteColorFromDB(id) {
  const colorTable = db
    .transaction("colors", "readwrite")
    .objectStore("colors");
  colorTable.delete(id);
}
