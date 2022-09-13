import './style.css'
import APPbuild from "./version.json";

var defColor = "#808080";
var colID = 0;
var newCol;
var lastColor=0;
var colorArraySize=120;
var isDark=false;
for (let i = 0; i < colorArraySize; i++) {
  newCol = `<div id="c${colID + i}" class="paletteColor">
      <input class="inColor" type="color" value="${defColor}" >
      <div class="hexColor">${defColor}</div>
      <div class="rgbColor">${ hexToRgb(defColor)}</div>
      <div class="hslColor100">${hexToHSL100(defColor)}</div>
      <div class="hslColor255">${hexToHSL255(defColor)}</div>
  </div>`;
  document.getElementById("colPalette").innerHTML += newCol;
}

var changeColor = function () {
  var newCol = this.value;
  var thisID = this.parentElement.id.substring(1);
  setColor("c",thisID,newCol);
  lastColor=Math.max(lastColor,thisID);  
  document.getElementById("btSave").style.visibility="visible";
};



var colors = document.getElementById("colPalette").getElementsByClassName("inColor");

for (var i = 0; i < colors.length; i++) {
  colors[i].addEventListener("change", changeColor);
}

document.getElementById("btReset").addEventListener("click",resetColor);
document.getElementById("btLoad").addEventListener("click",loadColor);
document.getElementById("btSave").addEventListener("click",saveColor);
document.getElementById("btRandom").addEventListener("click",randomColor);
document.getElementById("btFlipBG").addEventListener("click",flipBG);
setMainBGColor();
loadColor();
console.log("toto");
setColor("mhsl",1,"#808080")


// ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  ===  === 

function setMainBGColor(){
  var darkColor=getComputedStyle(document.documentElement)
    .getPropertyValue('--darkColor');
  var lightColor=getComputedStyle(document.documentElement)
    .getPropertyValue('--lightColor');
    
  document.body.style.backgroundColor = isDark ? darkColor : lightColor;
  document.body.style.color = isDark ? lightColor : darkColor;
  
  var cols = document.querySelectorAll(".paletteColor input");
  for(i = 0; i < cols.length; i++) {
    cols[i].style.backgroundColor = isDark ? darkColor : lightColor;
    cols[i].style.borderColor = isDark ? darkColor : lightColor;
  }
  
}

function resetColor(){
  var colors =  document.getElementById("colPalette").getElementsByClassName("inColor");
  for (var i = 0; i < colors.length; i++) {
    setColor("c",i,defColor);
    lastColor=0;
  }
  document.getElementById("btSave").style.visibility="hidden";
}

function flipBG() {
  isDark=!isDark;
  setMainBGColor();
 }


 function setColor(colorPrefix,colorID,aColorHex)
 {
  var colID=`${colorPrefix}${colorID}`;
  var aCol = document.getElementById(colID);
  
  if (colorPrefix!="c") {
    console.log(aColorHex);
  }

  var aColorHexCode= /[a-f\d]{6}/i.exec(aColorHex)[0];

  aCol.querySelector("input").value = "#" + aColorHexCode;
  aCol.querySelector(".hexColor").innerText = "#" +aColorHexCode;
  aCol.querySelector(".rgbColor").innerText = hexToRgb(aColorHexCode);
  aCol.querySelector(".hslColor100").innerText = hexToHSL100(aColorHexCode);
  aCol.querySelector(".hslColor255").innerText = hexToHSL255(aColorHexCode);
 }

 function hexToHSL100(hex) {
  var result = /#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  h=parseInt(h*360);
  s=parseInt(s*100);
  l=parseInt(l*100);
  return `hsl(${h},${s}%,${l}%)`;
}

function hexToHSL255(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  h=parseInt(h*255);
  s=parseInt(s*255);
  l=parseInt(l*255);
  return `hsl(${h},${s},${l})`;
}



 function hexToRgb(hex) {
  var result = /#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
  var r=parseInt(result[1],16);
  var g=parseInt(result[2],16);
  var b=parseInt(result[3],16);
  return `rgb(${r},${g},${b})`;
}



function loadColor(){
  var c = getCookie("colors");
  var aCol;
  if (c==="")  c="[]";
  var colors=c.match(/#[0-9a-f]{6}/gi);
  resetColor();
  for (var i = 0; i < colors.length; i++) {
    setColor("c",i,colors[i]);
    lastColor=i;
  }
}

function randomColor(){
  var newCol;
  for (var i = 0; i < colorArraySize; i++) {
       newCol=Math.floor(Math.random()*16777215).toString(16).padStart(6,"0");
       setColor("c",i,newCol);
  }
  lastColor=colorArraySize-1;
  document.getElementById("btSave").style.visibility="visible";  
}


function saveColor(){
  var colArray=[];
  var colors =  document.getElementById("colPalette").getElementsByClassName("inColor");
  for (var i = 0; i <= lastColor; i++) {
    colArray.push(colors[i].value);
  }
  var c=JSON.stringify(colArray);
  setCookie("colors",c,100);
}



/* cookies functions */

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires ;
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
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