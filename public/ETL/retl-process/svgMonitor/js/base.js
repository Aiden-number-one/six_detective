/*
 * @Description: 
 * @Author: lan
 * @Date: 2019-12-30 16:32:12
 * @LastEditTime: 2020-01-07 15:31:48
 * @LastEditors: lan
 */
var graphic;

$(document).ready(function () {

	var headerH = 0; //头部标签高度
	var bottomH = 40;
	var leftW = 45; //左侧宽度 + nodelist

	//初始化非流程图部分：1、svgbox的高度  2、左侧slider
	// $('#svgbox').height($(window).height()-headerH-bottomH);
	$('#lefttoggle').click(function () {
		$('body').toggleClass('lefthide');
	});
	//菜单
	$('#nav>li>a').click(function (event) {
		event.preventDefault();
		var _this = $(this);
		_this.toggleClass('slide');
		_this.next('.subnav').slideToggle();
	});

	//初始化的东西


	//图表区域初始化、xml解析
	var svg = d3.select('#svgbox').append('svg').attr('class', 's-svg');
	var edges = [],
	    nodes = [];
	var xmlDoc;

	graphic = new Graphic(svg, xmlDoc);
	//graphic.jobNo = jobNo;
	graphic.update();
});

/*
 * 获取应用根路径 @return {TypeName}
 */
function getContextPath() {
	var pathname = location.pathname;
	return pathname.substr(0, pathname.indexOf('/', 1));
}

//----------------- 导入功能- end-------------------
function getXmlDoc(text) {
	var xmlDoc;
	// try //Internet Explorer
	//   {
	//   	xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	//   	xmlDoc.async="false";
	// 	xmlDoc.loadXML(text);
	//   }
	// catch(e)
	//   {
	try //Firefox, Mozilla, Opera, etc.
	{
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(text, "text/xml");
	} catch (e) {
		alert(e.message);
	}
	//   }
	return xmlDoc;
}

function getajaxHttp() {
	var xmlHttp = null;
	try {
		xmlHttp = new XMLHttpRequest();
	} catch (e) {
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				alert("您的浏览器不支持AJAX！");
				return false;
			}
		}
	}
	return xmlHttp;
}

//string方法扩展、用于组装html片段
String.prototype.temp = function (obj) {
	return this.replace(/\$\w+\$/gi, function (matchs) {
		var returns = obj[matchs.replace(/\$/g, "")];
		return returns + "" == "undefined" ? "" : returns;
	});
};