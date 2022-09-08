import './style.css'
import APPbuild from "./version.json";

var defColor = "#777777";
var colID = 0;
var newCol;
var lastColor=0;
var colorArraySize=60;
var isDark=false;
for (let i = 0; i < colorArraySize; i++) {
  newCol = `<div id="c${colID + i}" class="paletteColor">
    <input class="inColor" type="color" value="${defColor}" >
    <div>${defColor}</div>
  </div>`;
  document.getElementById("colPalette").innerHTML += newCol;
}

var changeColor = function () {
  this.parentElement.querySelector("div").innerText = this.value;
  var thisID=parseInt(this.parentElement.id.substring(1));
  lastColor=Math.max(lastColor,thisID);  
  document.getElementById("btSave").style.display="block";
};

var colors = document.getElementsByClassName("inColor");

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
  var colors = document.getElementsByClassName("inColor");
  for (var i = 0; i < colors.length; i++) {
    colors[i].value=defColor;
    colors[i].parentElement.querySelector("div").innerText = defColor;
    lastColor=0;
  }
  document.getElementById("btSave").style.display="none";
}

function flipBG() {
  isDark=!isDark;
  setMainBGColor();
 }


function loadColor(){
  var c = getCookie("colors");
  var aCol;
  if (c==="")  c="[]";
  var colors=c.match(/#[0-9a-f]{6}/gi);
  resetColor();
  for (var i = 0; i < colors.length; i++) {
    console.log(colors[i]);
    aCol = document.getElementById(`c${i}`);
    aCol.querySelector("input").value = colors[i];
    aCol.querySelector("div").innerText = colors[i];
    lastColor=i;
  }
}

function randomColor(){
  var newCol;
  var colors = document.getElementsByClassName("inColor");
    for (var i = 0; i < colorArraySize; i++) {
       newCol=Math.floor(Math.random()*16777215).toString(16);
       colors[i].value= `#${newCol}`;     
       colors[i].parentElement.querySelector("div").innerText = `#${newCol}`;;
  }
  lastColor=colorArraySize-1;
  document.getElementById("btSave").style.display="block";  
}


function saveColor(){
  var colArray=[];
  var colors = document.getElementsByClassName("inColor");
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