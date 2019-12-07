//元素的拖拽实现

var params =  {
left:0, 
top:0, 
currentX:0, 
currentY:0, 
flag:false, 
workspace:0
}; 
//获取相关CSS属性
var getCss = function(o, key) {
return o.currentStyle?o.currentStyle[key]:document.defaultView.getComputedStyle(o, false)[key]; 
}; 

//拖拽的实现
var startDrag = function(bar, target, leftSide, rightSideExcel, callback) {
if (getCss(target, "left") !== "auto") {
params.left = getCss(target, "left"); 
params.workspace = $(rightSideExcel).width(); 
}
// if (getCss(target, "top") !== "auto") {
//   params.top = getCss(target, "top");
// }
//o是移动对象
bar.onmousedown = function(event) {
params.flag = true; 
if ( ! event) {
event = window.event; 
//防止IE文字选中
bar.onselectstart = function() {
return false; 
}
}
var e = event; 
params.currentX = e.clientX; 
params.currentY = e.clientY; 
params.workspace = $(rightSideExcel).width(); 
}; 
document.onmouseup = function() {
params.flag = false; 
if (getCss(target, "left") !== "auto") {
params.left = getCss(target, "left"); 
}
if (getCss(bar, "top") !== "auto") {
  params.top = getCss(bar, "top");
}
}; 
document.onmousemove = function(event) {
var e = event?event:window.event; 
if (params.flag) {
var nowX = e.clientX, 
nowY = e.clientY; 
var disX = nowX - params.currentX, 
disY = nowY - params.currentY; 
if (parseInt(params.left) + disX >= 200 && parseInt(params.left) + disX <= 600) {
target.style.left = parseInt(params.left) + disX + "px"; 
$(leftSide).width(parseInt(params.left) + disX); 
$(rightSideExcel).width(parseInt(params.workspace) - disX); 
}
// hotInstance.updateSettings({
//   width: $(rightSideExcel).width()
// });
$(".slide-toggle1").css("left",$(leftSide).width()-20);
$(".J-tab-content").width($(rightSideExcel).width()); 
$(".tabbar-tool").width($(rightSideExcel).width()); 

// target.style.top = parseInt(params.top) + disY + "px";
if (event.preventDefault) {
event.preventDefault(); 
}
return false; 
}

if (typeof callback == "function") {
callback(parseInt(params.left) + disX, parseInt(params.top) + disY); 
}
}
}; 

