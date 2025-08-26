import './style.css';
import APPbuild from "./version.json";

var defColor = "#808080";
var colID = 1;
var newCol;
var lastColor = 0;
var elm;
var hasAboutBox = false;

//* Default State

var pkrState = {
  "setting": {
    "isDark": false,
    "colorPaletteSize" : 500,
    "isSmallSize": false
  },
  "slider": {
    "color": "#00ff00",
    "steps": 6,
    "deltaH": 15,
    "deltaS": 0,
    "deltaL": 0
  },
  "mixer": {
    "color1": "#F0ff00",
    "color2": "#FF00bf",
    "steps": 6
  },
  "blender": {
    "color": "#F0bf95",
    "colors": 6,
    "fixH": false,
    "fixS": false,
    "fixL": false
  },
  "boiler": {
    "color1": "#F0ff00",
    "color2": "#FF00bf"
  },
  "lorem": {
    "color1": "#BBFF00",
    "color2": "#FF0000"
  }
}

// Default state color to random
pkrState.slider.color = genRandomHexColor();
pkrState.mixer.color1 = genRandomHexColor();
pkrState.mixer.color2 = genRandomHexColor();
pkrState.blender.color = genRandomHexColor();
pkrState.lorem.color1 = genRandomHexColor();
pkrState.lorem.color2 = genRandomHexColor();
pkrState.boiler.color1 = genRandomHexColor();
pkrState.boiler.color2 = genRandomHexColor(); 

// Generate color palette with default color
for (let i = 0; i < pkrState.setting.colorPaletteSize; i++) {
  newCol = colHexCodeToHTML(`c${colID + i}`, defColor, defColor.slice(1), true, false)
  document.getElementById("colPalette").innerHTML += newCol;
};

// Set color palette
for (let i = 0; i < pkrState.setting.colorPaletteSize; i++) {
  elm = document.querySelector(`#c${colID + i} .colTitle`)
  elm.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
    document.getElementById("btCommit").style.visibility = "visible";
  });
}

var changePaletteColor = function () {
  var newCol = this.value;
  var thisID = this.parentElement.id.substring(1);
  setColorContainer(`c${thisID}`, newCol, newCol.slice(1));
  lastColor = Math.max(lastColor, thisID);
  document.getElementById("btCommit").style.visibility = "visible";
};



var colors = document.getElementById("colPalette").getElementsByClassName("inColor");

for (var i = 0; i < colors.length; i++) {
  colors[i].addEventListener("change", changePaletteColor);
}





// add event listener to all color title to call function titleFieldChange
var colorTitle = document.getElementById("colPalette").getElementsByClassName("colTitle");
for (var i = 0; i < colorTitle.length; i++) {
  colorTitle[i].addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.blur(); // Trigger blur event when Enter is pressed
    }
  });

  colorTitle[i].addEventListener("blur", function () {
    document.getElementById("btCommit").style.visibility = "visible";
    // change title of the corresponding input color
    const inputElement = this.parentElement?.querySelector("input");
    if (inputElement && this.innerText) {
      inputElement.title = this.innerText;
    }
  });
}



// add event listener to all color input
document.getElementById("btReset").addEventListener("click", resetColor);
document.getElementById("btLoad").addEventListener("click", loadColor);
document.getElementById("btCommit").addEventListener("click", commitColorPalette);
document.getElementById("btRandom").addEventListener("click", genRandomColorPalette);
document.getElementById("btFlipBG").addEventListener("click", flipDarkMode);
document.getElementById("btFlipSize").addEventListener("click", flipSize);

document.getElementById("btAbout").addEventListener("click", toggleAboutBox);
document.getElementById("aboutBox").addEventListener("click", toggleAboutBox);



document.getElementById("btDownload").addEventListener("click", showDownloadDlg);
document.getElementById("btDoDownload").addEventListener("click", doDownload);
document.getElementById("btCancelDownload").addEventListener("click", cancelDownload);
document.getElementById("chkExclude").addEventListener("change", toggleDownloadExclude);

document.getElementById("btUpload").addEventListener("click", showUploadDlg);
document.getElementById("btCancelUpload").addEventListener("click", cancelUpload);
document.getElementById("btDoUpload").addEventListener("click", doUploadColor);

document.getElementById("btMix1").addEventListener("click", function () { goTab(0) });
document.getElementById("btMix2").addEventListener("click", function () { goTab(1) });
document.getElementById("btMix3").addEventListener("click", function () { goTab(2) });
document.getElementById("btMix4").addEventListener("click", function () { goTab(3) });
document.getElementById("btTextTry").addEventListener("click", function () { goTab(4) });

// Slider event
document.getElementById("inColorHslMix").addEventListener("change", genSlider);
document.getElementById("inHSLSteps").addEventListener("change", genSlider);
document.getElementById("inH").addEventListener("change", genSlider);
document.getElementById("inS").addEventListener("change", genSlider);
document.getElementById("inL").addEventListener("change", genSlider);

// Mixer event
document.getElementById("inColorMix1").addEventListener("change", genMix2Color);
document.getElementById("inColorMix2").addEventListener("change", genMix2Color);
document.getElementById("inMix2Steps").addEventListener("change", genMix2Color);

// Blender event   
document.getElementById("inColorBln").addEventListener("change", genBlender);
document.getElementById("inBlnHFix").addEventListener("change", genBlender);
document.getElementById("inBlnSFix").addEventListener("change", genBlender);
document.getElementById("inBlnLFix").addEventListener("change", genBlender);
document.getElementById("inBlnColors").addEventListener("change", genBlender);

//Boiler event
document.getElementById("inColorBoi1").addEventListener("change", genBoiler);
document.getElementById("inColorBoi2").addEventListener("change", genBoiler);


// Lorem event
document.getElementById("inColorText1").addEventListener("change", genLoremBox);
document.getElementById("inColorText2").addEventListener("change", genLoremBox);

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

setPkrState();
setMainBGColor();

genSlider();
genMix2Color();
genBlender();
genBoiler();
genLoremBox()
setLoremContent()
goTab(1);

// Drag and drop handling

var dragTargets;
window.dragSrcEl = null;
addDragSource("input[type=color]");

dragTargets = document.querySelectorAll("#colPalette input,#inColorHslMix,#inColorMix1,#inColorMix2,#inColorText1,#inColorText2,#BlnPaletteContainer input,#inColorBln,#inColorBoi1,#inColorBoi2");
dragTargets.forEach(function (target) {
  addDropTarget(target)
});

// ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  === 

// END OF MAIN

// ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  === 

function addDropTarget(aTargetNode) {
  aTargetNode.addEventListener("dragover", handleDragOver);
  aTargetNode.addEventListener("dragenter", handleDragEnter);
  aTargetNode.addEventListener("dragleave", handleDragLeave);
  aTargetNode.addEventListener("drop", handleDrop);
}



function setPkrState() {
  // Slider
  document.getElementById("inColorHslMix").value = pkrState.slider.color
  document.getElementById("inHSLSteps").value = pkrState.slider.steps
  document.getElementById("inH").value = pkrState.slider.deltaH
  document.getElementById("inS").value = pkrState.slider.deltaS
  document.getElementById("inL").value = pkrState.slider.deltaL
  // Mixer
  document.getElementById("inColorMix1").value = pkrState.mixer.color1
  document.getElementById("inColorMix2").value = pkrState.mixer.color2
  document.getElementById("inMix2Steps").value = pkrState.mixer.steps
  // Blender
  document.getElementById("inColorBln").value = pkrState.blender.color
  document.getElementById("inBlnColors").value = pkrState.blender.colors
  document.getElementById("inBlnHFix").value = pkrState.blender.fixH
  document.getElementById("inBlnSFix").value = pkrState.blender.fixS
  document.getElementById("inBlnLFix").value = pkrState.blender.fixL
  // Boiler
  document.getElementById("inColorBoi1").value = pkrState.boiler.color1
  document.getElementById("inColorBoi2").value = pkrState.boiler.color2
  

  // Lorem
  document.getElementById("inColorText1").value = pkrState.lorem.color1
  document.getElementById("inColorText2").value = pkrState.lorem.color2
}


function toggleAboutBox() {
  if (hasAboutBox)
    document.getElementById("aboutBox").style.display = "none";
  else
    document.getElementById("aboutBox").style.display = "block";
  hasAboutBox = !hasAboutBox
}

function addDragSource(aSelector) {
  var dragSources = document.querySelectorAll(aSelector);
  dragSources.forEach(function (src) {
    src.addEventListener("dragstart", handleDragStart);
    src.addEventListener("dragend", handleDragEnd);
  });
}

function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  if (dragSrcEl !== this) {  // Do nothing if drop on self
    var srcIsPalette = (dragSrcEl.parentElement.id.charAt(0)) == "c";
    var trgIsPalette = (this.parentElement.id.charAt(0)) == "c";
    var trgIsBlender = (this.parentElement.id.charAt(0)) == "b";

    // display to console srcIsPalette and trgIsPalette
    console.log("srcIsPalette: " + srcIsPalette);
    console.log("trgIsPalette: " + trgIsPalette);
    console.log("trgIsBlender: " + trgIsBlender);

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
  this.classList.add("selectedDragSource");
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "copy";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove("selectedDragSource");
  var dragTargets = document.querySelectorAll("#colPalette input,#inColorHslMix,#inColorMix1,#inColorMix2,#inColorText1,#inColorText2");
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

function colHexCodeToHTML(aDomID, aColHex, aColTitle, hasTitle, isReadOnly) {
  var html = `<div id="${aDomID}" class="paletteColor">
  <input class="inColor" type="color" value="${aColHex}"  title="${hasTitle  ? aColTitle : aColHex}"  draggable="true" ${isReadOnly ? "disabled='true'" : "" } >
  ${hasTitle ? '<div class="colTitle"   contenteditable="true"   >' + aColTitle + '</div>' : ""} 
  <div class="hexColor">${aColHex}</div>
  <div class="rgbColor">${hexToRgb(aColHex).rgb}</div>
  <div class="hslColor100">${hexToHSL(aColHex).hsl100}</div>
  <div class="hslColor255">${hexToHSL(aColHex).hsl255}</div>
</div>`;
  return html
}

function setLoremBoxColor(id, fg, bg) {
  var e = document.getElementById(id)
  e.style.backgroundColor = bg
  e.style.color = fg
}

function setLoremContent() {
  var allText = document.querySelectorAll(".textColorBox")
  for (const aText of allText) {
    aText.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br><span>■</span>"
  }
}


function genLoremBox() {
  var c1 = document.getElementById("inColorText1").value
  var c2 = document.getElementById("inColorText2").value
  pkrState.lorem.color1 = c1
  pkrState.lorem.color2 = c2
  const cb = "black"
  const cw = "white"

  setLoremBoxColor("tb01", c2, c1)
  setLoremBoxColor("tb02", cb, c1)
  setLoremBoxColor("tb03", cw, c1)

  setLoremBoxColor("tb04", c1, c2)
  setLoremBoxColor("tb05", cb, c2)
  setLoremBoxColor("tb06", cw, c2)

  setLoremBoxColor("tb07", c1, cw)
  setLoremBoxColor("tb08", c2, cw)
  setLoremBoxColor("tb09", cb, cw)

  setLoremBoxColor("tb10", c1, cb)
  setLoremBoxColor("tb11", c2, cb)
  setLoremBoxColor("tb12", cw, cb)

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

  document.body.style.backgroundColor = pkrState.setting.isDark ? darkBG : lightBG;
  document.body.style.color = pkrState.setting.isDark  ? darkColor : lightColor;

  // Color pannel
  document.getElementById("colorPanel").style.backgroundColor = pkrState.setting.isDark  ? darkPannel : lightPannel;
  // Color pannel input
  cols = document.querySelectorAll("#colorPanel .paletteColor input")
  cols.forEach(aColor => {
    aColor.style.backgroundColor = pkrState.setting.isDark  ? darkPannel : lightPannel;
    aColor.style.borderColor = pkrState.setting.isDark  ? darkPannel : lightPannel;
  })

  // color palette input
  var cols = document.querySelectorAll("#colPalette .paletteColor input")
  cols.forEach(aColor => {
    aColor.style.backgroundColor = pkrState.setting.isDark  ? darkBG : lightBG;
    aColor.style.borderColor = pkrState.setting.isDark  ? darkBG : lightBG;
  })
  // color palette input title
  var cols = document.querySelectorAll("#colPalette .paletteColor .colTitle")
  cols.forEach(aColor => {
    aColor.style.color = pkrState.setting.isDark  ? darkTitle : lightTitle;
  })

  // Dark/Light mode Button
  document.querySelector("#btFlipBG span").title = pkrState.setting.isDark  ? "Light Mode" : "Dark Mode";
}

function resetColor() {
  var colors = document.getElementById("colPalette").getElementsByClassName("inColor");
  for (var i = 0; i < colors.length; i++) {
    setColorContainer(`c${i + 1}`, defColor, defColor.slice(1));
    lastColor = 0;
  }
  document.getElementById("btCommit").style.visibility = "hidden";
}

function flipDarkMode() {
  pkrState.setting.isDark  = !pkrState.setting.isDark ;
  setMainBGColor();
}


function flipSize() {
  pkrState.setting.isSmallSize = !pkrState.setting.isSmallSize;
  const myBt = document.getElementById("btFlipSize");
  const span = myBt.querySelector("span");
  const isSmall = pkrState.setting.isSmallSize;

  myBt.title = isSmall ? "Maximize Color Square" : "Minimize Color Square";
  span.classList.toggle("fa-minimize", !isSmall);
  span.classList.toggle("fa-maximize", isSmall);
  
  const allLabels = document.querySelectorAll(".hexColor, .rgbColor, .hslColor100, .hslColor255, .colTitle");
  allLabels.forEach(label => {
    label.style.display = isSmall ? "none" : "block";
  });   

  const allPaletteColors = document.querySelectorAll(".paletteColor input");
  allPaletteColors.forEach(paletteColor => {
    paletteColor.style.width = isSmall ? "48px" : "150px";
    paletteColor.style.height = isSmall ? "48px" : "150px";
  });

}



function setColorContainer(colorContainerID, aColorHex, aTitle) {
  var aCol = document.getElementById(colorContainerID);
  var aColorHexCode = /[a-f\d]{6}/i.exec(aColorHex)[0];
  var titleElem

  aCol.querySelector("input").value = "#" + aColorHexCode;
  aCol.querySelector("input").title = aTitle ? aTitle : "#" + aColorHexCode;



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
      setColorContainer(`c${cursor.value.id}`, cursor.value.hexColor, cursor.value.title);
      cursor.continue();
    }
  }
};

function genRandomColorPalette() {
  var newCol;
  for (var i = 0; i < pkrState.setting.colorPaletteSize; i++) {
    newCol = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setColorContainer(`c${i + 1}`, newCol);
  }
  lastColor = pkrState.setting.colorPaletteSize - 1;
  document.getElementById("btCommit").style.visibility = "visible";
}


function download(content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}


function doDownload() {
  var jsonData = []
  var colHex, colTitle, col
  var doExclude = document.getElementById("chkExclude").checked
  var excludedColor = document.getElementById("colExclude").value
  var colors = document.getElementById("colPalette").getElementsByClassName("paletteColor");
  for (var aCol of colors) {
    colTitle = aCol.querySelector(".colTitle").innerText
    colHex = aCol.querySelector(".inColor").value
    col = {
      Title: colTitle,
      Hexcolor: colHex
    }
    if ((!doExclude) || (excludedColor != colHex)) jsonData.push(col)
  }
  download(JSON.stringify(jsonData), "ColorPalette.json", "text/plain");
  document.getElementById("dlgDownload").style.display = "none";
}

function toggleDownloadExclude() {
  var excl = document.getElementById("chkExclude").checked
  document.getElementById("colExclude").disabled = !excl
}


function cancelDownload() {
  document.getElementById("dlgDownload").style.display = "none";
}

function showDownloadDlg() {
  document.getElementById("dlgDownload").style.display = "block";
}

function showUploadDlg() {
  document.getElementById("dlgUpload").style.display = "block";
}
function cancelUpload() {
  document.getElementById("dlgUpload").style.display = "none";
}

function processUpload(event) {
  let str = event.target.result;
  let json = JSON.parse(str);
  console.log(json)
  resetColor()
  for (let i = 0; i < json.length; i++) {
    let title = json[i].Title
    let hexcol = json[i].Hexcolor
    setColorContainer(`c${i + 1}`, hexcol, title);
  }
  document.getElementById("btCommit").style.visibility = "visible";
}


function doUploadColor() {
  let file = document.querySelector('#colorFile');
  if (!file.value.length) return;
  let reader = new FileReader();
  reader.onload = processUpload;
  reader.readAsText(file.files[0]);
  document.getElementById("dlgUpload").style.display = "none";

}

function commitColorPalette() {
  var colHex, colTitle, colID
  var colors = document.getElementById("colPalette").getElementsByClassName("paletteColor");
  for (var aCol of colors) {
    colTitle = aCol.querySelector(".colTitle").innerText
    colID = aCol.id.slice(1);
    colHex = aCol.querySelector(".inColor").value
    updateColorToDB(colID, colHex, colTitle)
  }
  document.getElementById("btCommit").style.visibility = "hidden";
}

function rgbToHex(r, g, b) {
  return `${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function blendColorContainer(aColorContainerNode, refColorHex, useRefH, useRefS, useRefL) {
  // TODO: Change the color using ref color and HSL control

  var aColorNode = aColorContainerNode.querySelector('input[type="color"]')
  var newColHsl = hexToHSL(aColorNode.value)
  var refColHsl = hexToHSL(refColorHex)
  newColHsl.h360 = useRefH ? refColHsl.h360 : newColHsl.h360
  newColHsl.s100 = useRefS ? refColHsl.s100 : newColHsl.s100
  newColHsl.l100 = useRefL ? refColHsl.l100 : newColHsl.l100

  var newCol = hsl360ToRGB(newColHsl.h360, newColHsl.s100, newColHsl.l100)
  var newColHex = newCol.rgbCol;
  aColorNode.value = newColHex;
  setColorLabel(aColorContainerNode.id, newColHex)


}

function genRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}


function genBlender() {
  /* React to blender control */
  /* Get control state */
  pkrState.blender.colors = parseInt(document.getElementById("inBlnColors").value);
  pkrState.blender.fixH = document.getElementById("inBlnHFix").checked;
  pkrState.blender.fixS = document.getElementById("inBlnSFix").checked;
  pkrState.blender.fixL = document.getElementById("inBlnLFix").checked;
  pkrState.blender.color = document.getElementById("inColorBln").value;

  var blnPaletteContainer = document.getElementById("BlnPaletteContainer");
  var blnPalette = blnPaletteContainer.querySelectorAll('.paletteColor');

  if (blnPalette.length > pkrState.blender.colors) {
    // Remove extra colours 
    var n = 0;
    blnPalette.forEach(aColor => {
      n++
      if (n > pkrState.blender.colors) aColor.remove();
    });

  } else if (blnPalette.length < pkrState.blender.colors) {
    // add missing colors 
    for (let i = blnPalette.length; i < pkrState.blender.colors; i++) {
      var randomHexColor = genRandomHexColor();
      var html = colHexCodeToHTML(`b${i + 1}`, randomHexColor, null, false, false)
      blnPaletteContainer.innerHTML += html;
      setColorContainer(`b${i + 1}`, randomHexColor, randomHexColor)
      addDragSource(`b${i + 1}`)
    }
  }
  // Process all colors 
  setColorContainer("blnC1", pkrState.blender.color)
  blnPaletteContainer = document.getElementById("BlnPaletteContainer");
  blnPalette = blnPaletteContainer.querySelectorAll('.paletteColor');
  blnPalette.forEach(aColorNode => {
    var aColorInputNode = aColorNode.querySelector("input[type=color]")
    addDropTarget(aColorInputNode);
    blendColorContainer(aColorNode, pkrState.blender.color, pkrState.blender.fixH, pkrState.blender.fixS, pkrState.blender.fixL)
    aColorInputNode.addEventListener("change", genBlender);
  });
  addDragSource("#BlnPaletteContainer input[type=color]");
}

function genBoiler(){
  // React to boiler control and save state
  pkrState.boiler.color1 = document.getElementById("inColorBoi1").value;
  pkrState.boiler.color2 = document.getElementById("inColorBoi2").value;
  var boilerPaletteContainer = document.getElementById("BoilerPaletteContainer");
  // Clear old palette
  const boilerPalette = boilerPaletteContainer.querySelectorAll('.paletteColor');
  boilerPalette.forEach(aColor => {
    aColor.remove();
  }); 
  // Convert boiler color to HSL
  var hsl1 = hexToHSL(pkrState.boiler.color1);
  var hsl2 = hexToHSL(pkrState.boiler.color2);
  var h1 = hsl1.h360;
  var s1 = hsl1.s100;
  var l1 = hsl1.l100;
  var h2 = hsl2.h360;
  var s2 = hsl2.s100;
  var l2 = hsl2.l100;
  // create hex code from h,s l

  var c1, c2, c3, c4, c5, c6;
  // Create 6 colors boiled palette
  c1 = hsl360ToRGB(h1, s2, l2).rgbHex
  c2 = hsl360ToRGB(h1, s1, l2).rgbHex
  c3 = hsl360ToRGB(h1, s2, l1).rgbHex
  c4 = hsl360ToRGB(h2, s1, l1).rgbHex
  c5 = hsl360ToRGB(h2, s1, l2).rgbHex
  c6 = hsl360ToRGB(h2, s2, l1).rgbHex

  const colorNames = ["𝘏1𝗦𝟮𝗟𝟮", "𝐻1𝗦𝟭𝗟𝟮", "𝐻1𝗦𝟮𝗟𝟭", "𝐻2𝗦𝟭𝗟𝟭", "𝐻2𝗦𝟭𝗟𝟮", "𝐻2𝗦𝟮𝗟𝟭"];

  // Add colors to palette
  const colors = [c1, c2, c3, c4, c5, c6];
  colors.forEach((color, index) => {
    const html = colHexCodeToHTML(`boiler${index + 1}`, `#${color}`, colorNames[index], true, true);
    boilerPaletteContainer.innerHTML += html;
  });
  addDragSource("#BoilerPaletteContainer input[type=color]");
}


// React to mixer 
function genMix2Color() {
  // Get mixer state  
  pkrState.mixer.steps = parseInt(document.getElementById("inMix2Steps").value);
  pkrState.mixer.color1 = document.getElementById("inColorMix1").value;
  pkrState.mixer.color2 = document.getElementById("inColorMix2").value;

  var mix2PaletteContainer = document.getElementById("Mix2PaletteContainer");
  // Clear old palette
  const mix2Palette = mix2PaletteContainer.querySelectorAll('.paletteColor');
  mix2Palette.forEach(aColor => {
    aColor.remove();
  });

  // get starting and ending points  
  var c1RGB = hexToRgb(pkrState.mixer.color1);
  var c2RGB = hexToRgb(pkrState.mixer.color2);
  var r1 = c1RGB.r;
  var g1 = c1RGB.g;
  var b1 = c1RGB.b;
  var r2 = c2RGB.r;
  var g2 = c2RGB.g;
  var b2 = c2RGB.b;

  // get delta value
  var dR = (r2 - r1) / (pkrState.mixer.steps - 1);
  var dG = (g2 - g1) / (pkrState.mixer.steps - 1);
  var dB = (b2 - b1) / (pkrState.mixer.steps - 1);

  var rgbcol, r, g, b, html;

  setColorLabel("mixC1", pkrState.mixer.color1);
  setColorLabel("mixC2", pkrState.mixer.color2);

  for (let i = 0; i < pkrState.mixer.steps; i++) {
    if (i == 0) { // First step
      r = r1;
      g = g1;
      b = b1;
    } else if (i == (pkrState.mixer.steps - 1)) { // Last step
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
    html = colHexCodeToHTML(`mixTwo${i + 2}`, rgbcol, null, false, true)
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

function genSlider() {
  // change state
  pkrState.slider.color = document.querySelector("#mhsl1 input").value;
  pkrState.slider.steps = Math.max(parseInt(document.getElementById("inHSLSteps").value), 2);
  pkrState.slider.deltaH = parseInt(document.getElementById("inH").value);
  pkrState.slider.deltaS = parseInt(document.getElementById("inS").value);
  pkrState.slider.deltaL = parseInt(document.getElementById("inL").value);

  var hsl = hexToHSL(pkrState.slider.color);
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

  setColorLabel("mhsl1", pkrState.slider.color);

  for (let i = 0; i < pkrState.slider.steps; i++) {
    rgb = hsl360ToRGB(h, s, l);
    html = colHexCodeToHTML(`mhsl${i + 2}`, rgb.rgbCol, null, false, true)
    hslMixPaletteContainer.innerHTML += html;
    //    h = Math.max(Math.min((h + deltaH) < 0 ? 360 + (h + deltaH) : (h + deltaH), 360), 0);
    h = (h + pkrState.slider.deltaH + 360) % 360;
    s = Math.max(Math.min(s + pkrState.slider.deltaS, 100), 0);
    l = Math.max(Math.min(l + pkrState.slider.deltaL, 100), 0);
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
