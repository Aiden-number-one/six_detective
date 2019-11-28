/**
 *  本插件依赖于d3.v4，用于绘制库表关系图
 *  @param svgSelector svg选择器
 *  @param tableArray 库表数据列表
 *  @param relationArray 库表关系列表
 *  @param inputOptions 参数配置，覆盖defaultOptions
 * */
var TableRelationChart = function(svgSelectorInput, tableArrayInput, relationArrayInput, inputOptionsInput){
	var svgSelector = svgSelectorInput;
	var tableArray = tableArrayInput;
	var relationArray = relationArrayInput;
	var tableIdMap = {};// id与库表数据的map，减少遍历
	var relationEndIdMap = {};// relation.end与关系数据的map
	var hoverTimeoutEvent = null;// 用于避免鼠标在元素移动时，mouseover与mouseout频繁触发而导致提示框闪烁
	var treeMap = []; // 用于储存生成树
	var zoomObject = d3.zoom();
	var transform = null;
	var _this = this;
	// 默认配置 ======================================================================================================
    var defaultOptions = {
		x : 10, y : 10, // 开始坐标
        width : 1200,
        height : 600,
		"font-size" : 14,
		"font-family" : "微软雅黑",
        backgroundColor : "#FFFFFF",
		table : {
			width : 218,
			height : 23,
			marginTop : 7
		},
		relation : {
			type : {// 这个别动
				left : {
					content : '<circle fill="#4884EF" stroke="#5E5E5E" stroke-width="6" stroke-miterlimit="10" cx="475.8" cy="377" r="199"/>' + 
					   '<circle fill="#FFFFFF" stroke="#5E5E5E" stroke-width="6" stroke-miterlimit="10" cx="731.8" cy="377" r="199"/>' + 
					   '<path fill="#4884EF" stroke="#5E5E5E" stroke-width="6" stroke-miterlimit="10" d="M532.8,377c0,61.2,27.6,115.9,71,152.4' + 
					   'c43.4-36.5,71-91.2,71-152.4s-27.6-115.9-71-152.4C560.4,261.2,532.8,315.9,532.8,377z"/>',
					viewBox : '273.7 175 660 404'
				},
				right : {
					content : '<circle fill="#FFFFFF" stroke="#5E5E5E" stroke-width="6" stroke-miterlimit="10" cx="475.8" cy="377" r="199"/>' +
						'<circle fill="#4884EF" stroke="#5E5E5E" stroke-width="6" stroke-miterlimit="10" cx="731.8" cy="377" r="199"/>' +
						'<path fill="#4884EF" stroke="#5E5E5E" stroke-width="6" stroke-miterlimit="10" d="M532.8,377c0,61.2,27.6,115.9,71,152.4' +
						'c43.4-36.5,71-91.2,71-152.4s-27.6-115.9-71-152.4C560.4,261.2,532.8,315.9,532.8,377z"/>',
					viewBox : '273.6 174.7 660.2 404.3'
				},
				none : {
					content : '<circle fill="#E8E8E8" stroke="#CECECE" stroke-width="6" stroke-miterlimit="10" cx="202.3" cy="202.7" r="199"/>' +
					   '<circle fill="#E8E8E8" stroke="#CECECE" stroke-width="6" stroke-miterlimit="10" cx="458.3" cy="202.7" r="199"/>' +
					   '<path fill="#E8E8E8" stroke="#CECECE" stroke-width="6" stroke-miterlimit="10" d="M259.3,202.7c0,61.2,27.6,115.9,71,152.4' +
					   'c43.4-36.5,71-91.2,71-152.4s-27.6-115.9-71-152.4C286.9,86.8,259.3,141.5,259.3,202.7z"/>',
					viewBox : '0 0.7 660.3 404'
				},
				mid : {
					content : '<circle fill="#FFFFFF" stroke="#5E5E5E" stroke-width="6" stroke-miterlimit="10" cx="369.6" cy="377" r="364.1"/>' + 
					  '<circle fill="#FFFFFF" stroke="#5E5E5E" stroke-width="6" stroke-miterlimit="10" cx="838" cy="377" r="364.1"/>' + 
					  '<path fill="#4884EF" stroke="#5E5E5E" stroke-width="6" stroke-miterlimit="10" d="M473.9,377c0,112,50.5,212.1,129.9,278.8' + 
					  'C683.2,589.1,733.7,489,733.7,377S683.2,165,603.8,98.2C524.4,165,473.9,265,473.9,377z"/>',
					viewBox : '2.4 9.8 1202.7 734.3'
				},
				init : {
					content : '<g><circle fill="#FFFFFF" cx="368.6" cy="368.1" r="364.1"/><circle fill="none" stroke="#9B9B9B" stroke-width="10" stroke-miterlimit="10" stroke-dasharray="31.7748,31.7748" cx="368.6" cy="368.1" r="364.1"/></g>' +
								'<g><circle fill="#FFFFFF" cx="837" cy="368.1" r="364.1"/><circle fill="none" stroke="#9B9B9B" stroke-width="10" stroke-miterlimit="10" stroke-dasharray="31.7748,31.7748" cx="837" cy="368.1" r="364.1"/></g>' +
								'<g><path fill="#FFFFFF" d="M602.8,646.9c79.4-66.8,129.9-166.9,129.9-278.8S682.2,156,602.8,89.3"/>' +
									'<g><path fill="none" stroke="#9B9B9B" stroke-width="10" stroke-miterlimit="10" d="M602.8,646.9c4.1-3.4,8.1-7,12-10.6"/>' +
										'<path fill="none" stroke="#9B9B9B" stroke-width="10" stroke-miterlimit="10" stroke-dasharray="31.7464,31.7464" d="M637.2,613.9' +
											'c59.3-64.8,95.5-151,95.5-245.8c0-100.5-40.7-191.4-106.4-257.3"/>' +
										'<path fill="none" stroke="#9B9B9B" stroke-width="10" stroke-miterlimit="10" d="M614.8,99.8c-3.9-3.6-7.9-7.1-12-10.6"/>' +
									'</g>' +
								'</g>' +
								'<path fill-rule="evenodd" clip-rule="evenodd" fill="#FF1A2B" d="M989.5,727v-76.1h83V727H989.5z M1005.7,574.8l-16.2-203V118.1h83v251.8l-16.1,204.8H1005.7z"/>',
					viewBox : '0 0 1204.1 735.7'
				}
			},
			lineWeight : 2, // 线粗
			firstPartLength : 11, // 水平线前半离拐角的长度，也是关系圈离拐角的长度
			height : 24, // 关系圈高度
			width : 38,// 关系圈宽度
			totalWidth : 75,
			clickCallback : null,
			removeCallback:null
		},
		zoom : {
			min : 0.5,
			max : 2
		}
	}
	// 工具包 ======================================================================================================
	var tool = {
        // 实现 $.extend 方法
        extend : function(target, options) {
            var name;
            for (name in options) {
                if( typeof options[name] === "string" || typeof options[name] === "boolean" || typeof options[name] === "number" || typeof options[name] === "function"){
                    target[name] = options[name];
                }else if( options[name] instanceof Array ){
                    if( options[name].length > 0 && typeof options[name][0] === "object" ){
                        target[name] = [];
                        for( var i = 0; i < options[name].length; i++ ){
                            target[name].push( this.extend({}, options[name][i]) );
                        }
                    }else{
                        target[name] = options[name].slice(0);
                    }
                }else if( typeof options[name] === "object" ){
                    if(!target[name]){
                        target[name] = {};
                    }
                    this.extend(target[name], options[name]);
                }

            }
            return target;
        }
        // 是否是数字
        ,isNumber : function(value){
            return !isNaN(value) && value !== null && value !== "" && value !== true && value !== false ;
        }
        // 是否为空
        ,isNull : function(value){
            return value || value === 0 || value === false ;
        }
        // 以下为绘图专用 ==================================
		/** 增加元素
		 * @param container 要增加元素的融
		 * @param element 要增加的元素
		 * @param attrObject 元素属性
		 * */
        ,addElement : function(container, element, attrObject){
            var selector = element;
			attrObject = attrObject || {};
            for(var name in attrObject){
                selector += "[" + name + "=" + attrObject[name] + "]";
            }
            var target = container.select(selector);
            if( target.size() === 0 ){
                target = container.append(element);
                for(var name in attrObject){
                    target.attr(name, attrObject[name]);
                }
            }
            return target;
        }
		// 文字超长则显示...  
		// text - 显示字符 | maxWidth -  显示宽度 | fontSize - 字体大小
		,wordEllipsis : function(text, maxWidth, fontSize){
			var curLen = 0, i;
			var ellipsis = false;// 是否需要省略
			for(i = 0; i < text.length; i++){
				var code = text.charCodeAt(i);
				curLen += (code > 255 ? fontSize : fontSize * 8 / 11);
				if(curLen > maxWidth){
					ellipsis = true;
					break;
				}
			}
			if(ellipsis){
				text = text.substring(0, i - 1) + "...";
			}
			return text;
		}
    }
	var options = tool.extend({}, defaultOptions);
	options = tool.extend(options, inputOptionsInput);
	var tableOptions = options.table, relationOptions = options.relation;
	var zoomOptions = options.zoom;
	var svg = d3.select(svgSelector);
	if( svg.size() === 0 ){
		console.error(svgSelector + "没有匹配的svg元素");
		return;
	}else{
		svg.on("click", function(){
			svg.select("[data-type=functions]").style("display", "none");
		}).call( 
			zoomObject.scaleExtent([zoomOptions.min, zoomOptions.max]).on("zoom", function(){
				// _this.zoomed();
				transform = d3.event.transform;
				svg.selectAll("g[data-type]").attr("transform", transform);
			}) 
		).html("");
	}
	// 增加滤镜
	var addDefs = function(){
		var defs = tool.addElement(svg, "defs");
		var filter = tool.addElement(defs, "filter")
			.attr("id", "svgShadowFilter")
			.attr("x", 0).attr("y", 0);
		// 阴影效果，设置偏移
		tool.addElement(filter, "feOffset")
			.attr("result", "offOut")
			// SourceGraphic 原色 | SourceAlpha 黑色
			.attr("in", "SourceAlpha")
			.attr("dx", 2).attr("dy", 2);
		// 使偏移图像可以变的模糊
		tool.addElement(filter, "feGaussianBlur")
			.attr("result", "blurOut").attr("in", "offOut")
			// 模糊量
			.attr("stdDeviation", 2);
		tool.addElement(filter, "feBlend")
			.attr("in2", "blurOut").attr("in", "SourceGraphic")
			.attr("mode", "normal");
	};
	// 复制库表元素
	var copyTable = function(tableData){
		var index = 0, id = tableData.id + "-copy";
		while(svg.select("#" + id + index ).size() !== 0){
			++index;
		};
		id = id + index;
		_this.add({
			id : id,
			text : tableData.text,
			start : relationEndIdMap[tableData.id].start,
			type : "mid"
		});
	};
	// 移除库表元素
	var removeTable = function(tableData){
		for(var i = 0; i < tableData.children.length; i++){
			removeTable(tableData.children[i]);
		}
		delete tableIdMap[tableData.id];
		tableArray.splice(tableArray.indexOf(tableData), 1);
		var relationData = relationEndIdMap[tableData.id];
		relationArray.splice(relationArray.indexOf(relationData), 1);
		delete relationEndIdMap[tableData.id];
		svg.select("#" + tableData.id).remove();
		svg.select("g[data-type=relation][end='"+tableData.id+"']").remove();
	};
	// 画库表元素 ======================================================================================================
	var drawTableElement = function(tableData){
		var startX = tableData.x, startY = tableData.y, textValue = tableData.text;
		var rectWidth = tableOptions.width;
		var rectHeight = tableOptions.height;
		//var g = svg.select("#" + tableData.id);
		var g = tool.addElement(svg, "g", {id : tableData.id, "data-type" : "table"})
					.attr("transform", transform);
        // 画左侧橙色背景 ==========================
        var leftBackgroundWidth = 3;
		var rect = tool.addElement(g, "rect", {"data-type" : "left-background"});
        rect.attr("x", startX).attr("y", startY)
			.attr("width", leftBackgroundWidth)
			.attr("height", rectHeight)
			.style("fill", "rgb(250,170,104)");
        // 画右侧灰色背景 ==========================
		rect = tool.addElement(g, "rect", {"data-type" : "right-background"});
        startX += leftBackgroundWidth;
		var rightWidth = rectWidth - leftBackgroundWidth;
		rect.attr("x", startX).attr("y", startY)
			.attr("width", rightWidth)
			.attr("height", rectHeight)
			.style("fill", "rgb(235,235,235)");
		// 画文字 ==================================
		var marginRight = 15;
		var fontSize = options["font-size"];
        var text = tool.addElement(g, "text", {"data-type" : "discription"});
        text.attr('x', startX + marginRight).attr('y', startY + rectHeight/2 + fontSize/2 - 2 )
            .style('fill', 'black').style('font-size', fontSize + 'px').style('font-family', options["font-family"])//.style('font-weight', 'bold')
            // 超长则省略 tool.wordEllipsis
			.text(tool.wordEllipsis(textValue, rightWidth - marginRight * 2, fontSize));
		g.attr("title", textValue);
        //rect.style("stroke", color).style("stroke-width", 1);
		//if( tableData.hoverStatus ){
		if( true ){	
			// 画向下箭头 
			var arrowWidth = 9, arrowHeight = 4, arrowColor = 'rgb(102,115,129)'
				arrowMarginRight = 10;
			startX = tableData.x + rectWidth - arrowMarginRight - arrowWidth;
			startY += (rectHeight - arrowHeight)/2;
			var path = tool.addElement(g, "path", {"data-type" : "arrow"});
			path.attr("d", " M " + startX + " " + startY +
				" l " + arrowWidth + " " + 0 + 
				" l " + (-arrowWidth/2) + " " + arrowHeight + 
				" Z "
			).style("stroke", "none").style("fill", arrowColor).style("cursor", "pointer")
			.on("click", function(){
				// 阻止冒泡，防止再隐藏弹框（事件绑在svg上）
				d3.event.stopPropagation();
				// 画功能弹框
				var space = 4;
				var _startX = startX - space;
				var _startY = tableData.y + rectHeight - space;
				var buttonWidth = 84, buttonHeight = 25;
				var functionWindow = tool.addElement(svg, "g", {"data-type" : "functions"})
										.attr("filter", "url(#svgShadowFilter)")
										.style("display", "block")
										.attr("transform", transform);
				// 画移除按钮
				var button = tool.addElement(functionWindow, "g", {"function-type" : "copy"})
								.style("cursor", "pointer")
								.on("click", function(){
									removeTable(tableData);
									reDraw();
									relationOptions.removeCallback && relationOptions.removeCallback();
								});
				tool.addElement(button, "rect", {"data-type" : "copy"})
					.attr("x", _startX).attr("y", _startY)
					.attr("width", buttonWidth).attr("height", buttonHeight)
					.style("fill", "rgb(241,241,241)").style("stroke", "rgb(229,229,229)");
				var textStartX = _startX + buttonWidth / 2 - fontSize;
				var textStartY = _startY + buttonHeight/2 + fontSize/2 - 2;
				tool.addElement(button, "text", {"data-type" : "copy"})
					.attr("x", textStartX).attr("y", textStartY)
					.style('fill', 'black').style('font-size', fontSize + 'px').style('font-family', options["font-family"])//.style('font-weight', 'bold')
					.text("移除");
				return;
				// 画移除按钮
				_startY += buttonHeight;
				textStartY += buttonHeight;
				button = tool.addElement(functionWindow, "g", {"function-type" : "remove"})
							.style("cursor", "pointer")
							.on("click", function(){
								removeTable(tableData);
								reDraw();
							});
				tool.addElement(button, "rect", {"data-type" : "remove"})
					.attr("x", _startX).attr("y", _startY)
					.attr("width", buttonWidth).attr("height", buttonHeight)
					.style("fill", "rgb(241,241,241)").style("stroke", "rgb(229,229,229)");
				tool.addElement(button, "text", {"data-type" : "remove"})
					.attr("x", textStartX).attr("y", textStartY)
					.style('fill', 'black').style('font-size', fontSize + 'px').style('font-family', options["font-family"])//.style('font-weight', 'bold')
					.text("移除");
				
			});
			
		}
	};
	// 画库表关系 ======================================================================================================
	var drawRelation = function(relationData){
		var lineWeight = relationOptions.lineWeight, // 线粗
			firstPartLength = relationOptions.firstPartLength, // 水平线前半离拐角的长度，也是关系圈离拐角的长度
			relationHeight = relationOptions.height, // 关系圈高度
			relationWidth = relationOptions.width;// 关系圈宽度
		// 对应的库表数据
		var startTableData = tableIdMap[relationData.start], 
		    endTableData = tableIdMap[relationData.end];
		var g = tool.addElement(svg, "g", {start : relationData.start, end : relationData.end, "data-type" : "relation"})
					.attr("transform", transform);
		// 画线
		var path = tool.addElement(g, "path");
		path.attr("d", " M " + (startTableData.x + tableOptions.width) + " " + (startTableData.y + tableOptions.height/2) +
			" h " + firstPartLength +
			" v " + (endTableData.y - startTableData.y) + 
			" H " + endTableData.x
		).style("stroke", "RGB(191,191,191)").style("fill", "none").style("stroke-width", lineWeight);
		// 画图
        var relationSvg = tool.addElement(g, "svg")
            .attr("viewBox", relationOptions.type[relationData.type].viewBox)
			.attr("width", relationWidth).attr("height", relationHeight)
			.attr("x", startTableData.x + tableOptions.width + 2 * firstPartLength)
			.attr("y", endTableData.y + tableOptions.height/2 - relationHeight/2)
            .html(relationOptions.type[relationData.type].content)
			.on("click", function(){
				relationOptions.clickCallback && relationOptions.clickCallback(relationData);
			});
	};
	// 计算子节点坐标并绘图 ============================================================================================
	var calculatePosition = function(array, x, y) {
		x = x || options.x;
		y = y || options.y;
		var i, data, nextX = x + tableOptions.width + relationOptions.totalWidth;
				
		var yChildren;
		for(i = 0; i < array.length; ){
			data = array[i];
			data.x = x;
			data.y = y;
			// 绘图
			drawTableElement(data);
			relationEndIdMap[data.id] && drawRelation(relationEndIdMap[data.id]);
			yChildren = calculatePosition(data.children, nextX, y);
			y = yChildren;
			if( ++i !== array.length){
				y += tableOptions.marginTop + tableOptions.height;
			}
		}
		return y;
	};
	// 重绘
	var reDraw = function(){
		var i, data;
		// 清空children
		for(i = 0; i < tableArray.length; i++){
			tableArray[i].children = [];
		}
		// 生成treeMap
		treeMap = tableArray.slice(0);
		for(i = 0; i < relationArray.length; i++){
			data = relationArray[i];
			tableIdMap[data.start].children.push(tableIdMap[data.end]);
			treeMap.splice(treeMap.indexOf(tableIdMap[data.end]), 1);
			// relation.end 与 relation 的对应关系 
			relationEndIdMap[data.end] = data;
		}
		// 库表元素
		svg.selectAll("g[data-type=table]")
            .data(tableArray)
            .enter().append("g")
            .attr("data-type", "table")
            .attr("id", function(d) {
				return d.id; 
			})
		
		// 库表关系
		svg.selectAll("g[data-type=relation]")
            .data(relationArray)
            .enter().append("g")
			.attr("data-type", "relation")
            .attr("start", function(d) { return d.start; })
            .attr("end", function(d) { return d.end; })
		// 计算子节点坐标并绘图
		calculatePosition(treeMap);
	}
	// 初始化函数 ======================================================================================================
	var init = function(){
		// 增加滤镜
		addDefs();
		// 先生成tableIdMap
		var i, data;
		for(i = 0; i < tableArray.length; i++){
			data = tableArray[i];
			data.children = data.children || [];
			if(tableIdMap[data.id]){
				console.error("库表数据有相同id--" + data.id + "--的数据")
			}else{
				tableIdMap[data.id] = data;
			}
		}
		reDraw();
	};
	
	// 增加数据
	this.add = function(inputParams){
		var newId = inputParams.id;
		if( tableIdMap[newId] ){
			console.error("库表数据有相同id--" + newId + "--的数据");
			return;
		}
		var tableData = {
			id : newId,
			text : inputParams.text,
			children : []
		};
		tableArray.push(tableData);
		tableIdMap[newId] = tableData;
		var startId = inputParams.start, relationData = null;
		if(startId){
			relationData = {
				type : inputParams.type || "init",
				start : startId,
				end : newId
			}
			relationArray.push(relationData);
			tableIdMap[startId].children.push(tableData);
			relationEndIdMap[newId] = relationData;
		}else{
			treeMap.push(tableData);
		}
		// 重新计算子节点坐标并绘图
		calculatePosition(treeMap);
		// 触发点击事件
		!inputParams.type && relationData && relationOptions.clickCallback && relationOptions.clickCallback(relationData);
	}
	// 重绘
	this.reDraw = function(){
		reDraw();
	}
	init();
};