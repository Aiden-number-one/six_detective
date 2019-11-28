/**
 *  本插件依赖于d3.v4，用于绘制流程图
 * */
var flowChart = {
    // 初始化         svg的选择器   流程数据     连线数据     配置参数
    init : function(svgSelector, processArray, lineArray, inputOptions){
        this.svgSelector = svgSelector;
        this.processArray = processArray;
        this.lineArray = lineArray;
        var _this = this;
        var options = this.tool.extend({}, _this.defaultOptions);
        options = this.tool.extend(options, inputOptions || {});
        this.options = options;
        var zoomOptions = options.zoom;
        var svg = d3.select(svgSelector);
        if( svg.size() >= 0 ){
            var zoomObject = d3.zoom();
            this.zoomObject = zoomObject;
            svg.attr("width", options.width).attr("height", options.height)
                .call( zoomObject.scaleExtent([zoomOptions.min, zoomOptions.max]).on("zoom", function(){
                    _this.zoomed();
                }) );
        }else{
            return
        }
        this.svg = svg;
        this.addShadowFilter();
        // 先创建一个path容器，以使所有的连线位于最底部
        var pathContainer = svg.select("[data-type=pathContainer]");
        if( pathContainer.size() === 0 ){
            pathContainer = svg.append("g").attr("data-type", "pathContainer");
        }
        var timeoutEvent;
        this.pathContainer = pathContainer;
        // 初始化画流程元素
        svg.selectAll("g[data-type=process]")
            .data(processArray)
            .enter().append("g")
            .attr("data-type", "process")
            .attr("id", function(d) { return d.id; })
            .style("cursor", "pointer")
            .call(d3.drag().on("drag", _this.dragged))
            .call(function(gArray){
                gArray.each(function(processData){
                    _this.drawProcess(processData);
                });
            }).on("mouseover", function(processData){
                if( timeoutEvent ){
                    clearTimeout(timeoutEvent);
                }
                processData.hoverStatus = true;
                _this.drawProcess(processData);
            }).on("mouseout", function(processData){
                // 为了避免鼠标在元素移动时，mouseover与mouseout频繁触发而导致提示框闪烁
                timeoutEvent = setTimeout(function(){
                    processData.hoverStatus = false;
                    _this.drawProcess(processData);
                }, 0)
            }).on("click", function(processData){
				d3.event.stopPropagation();
                _this.drawButton(processData);
            });
        // 初始化画线
        pathContainer.selectAll("path")
            .data(lineArray)
            .enter().append("path")
            .attr("start", function(d) { return d.start; })
            .attr("end", function(d) { return d.end; })
            .call(function(pathArray){
                pathArray.each(function(lineData){
                    flowChart.drawLine(lineData.start, lineData.end);
                });
            });
        _this.bindEvent();
    },
    // 添加阴影用的滤镜
    addShadowFilter : function(){
        var options = this.options;
        var shadowFilterOptions = options.filter.shadow;
        var svg = this.svg;
        if( !shadowFilterOptions.display ){
            return;
        }
        var defs = svg.select("defs");
        if( defs.size() === 0 ){
            defs = svg.append('defs');
        }
        var shadowFilterId = shadowFilterOptions.id;
        var shadowFilter = defs.select("filter#" + shadowFilterId);
        if( shadowFilter.size() === 0 ){
            shadowFilter = defs.append('filter').attr("id", shadowFilterId)
                .attr("x", 0).attr("y", 0);
        }
        var feOffset = shadowFilter.select("feOffset");
        if( feOffset.size() === 0 ){
            feOffset = shadowFilter.append('feOffset')
                .attr("result", "offOut").attr("in", "SourceAlpha")
                .attr("dx", 5).attr("dy", 5);
        }
        var feGaussianBlur = shadowFilter.select("feGaussianBlur");
        if( feGaussianBlur.size() === 0 ){
            feGaussianBlur = shadowFilter.append('feGaussianBlur')
                .attr("result", "blurOut").attr("in", "offOut")
                .attr("stdDeviation", 4);
        }
        var feBlend = shadowFilter.select("feBlend");
        if( feBlend.size() === 0 ){
            feBlend = shadowFilter.append('feBlend')
                .attr("in2", "blurOut").attr("in", "SourceGraphic")
                .attr("mode", "normal");
        }
    },
    // 拖拽回调
    dragged : function(processData){
        processData.x = d3.event.x;
        processData.y = d3.event.y;
        // 重绘流程元素
        flowChart.drawProcess(processData);
        // 重绘线
        flowChart.drawLine(processData.id);
        flowChart.drawLine(null, processData.id);
    },
    // 缩放、平移回调
    zoomed : function(){
        var svg = this.svg;
        var options = this.options;
        var t = d3.event.transform;
        svg.selectAll("g").attr("transform", t);
        if( typeof options.callback.transform === "function" ){
            options.callback.transform( t );
        }
    },
    // 画流程元素的方法
    drawProcess : function(processData){
        var options = this.options;
        var shadowFilterOptions = options.filter.shadow;
        var backgroundColor = options.backgroundColor;
        var lineArray = this.lineArray;
        var svg = this.svg;
        var tool = this.tool;
        var startX = processData.x, startY = processData.y, textValue = processData.text, topNode = 1;
        var bottomNode = 0;
        var i, _this = this;
        for(i = 0; i < lineArray.length; i++){
            if( lineArray[i].start === processData.id ){
                bottomNode++;
            }
        }
        var rectWidth = processData.width;
        if( !tool.isNumber(rectWidth) ){
            rectWidth = options.process.width;
        }
        var rectHeight = 38;
        var midX = startX + rectWidth / 2;
        var midY = startY + rectHeight/2;
        var endX = startX + rectWidth;
        var endY = startY + rectHeight;
        var statusOptions = options.process.status;
        var activeStatusOptions = statusOptions[processData.status];
        var color = activeStatusOptions.color;
        var g = svg.select(" #" + processData.id);
        // 画圆角矩形 =================================================================================================
        var rect = tool.addElement(g, "rect", {"data-type" : "border"});
        rect.attr("x", startX).attr("y", startY).attr("width", rectWidth).attr("height", rectHeight).attr("rx", rectHeight/2).attr("ry", rectHeight/2);
        if( processData.hoverStatus ){
            rect.attr("fill", color.replace("1)", "0.2)") );
        }else{
            rect.attr("fill", "#ffffff");
        }
        rect.style("stroke", color).style("stroke-width", 1);
        // 左边背景圆 =================================================================================================
        var ellipse = tool.addElement(g, "ellipse", {"data-type" : "leftIcon-background"});
        var radius = 16;// 半径
        var space = 3;// 间距
        var ellipseX = startX + radius + space;
        ellipse.attr("cx", ellipseX).attr("cy", midY).attr("rx", radius).attr("ry", radius);
        ellipse.style("fill", color);
        // 左边icon
        var iconSvg = tool.addElement(g, "svg", {"data-type" : "leftIcon"})
            .attr("viewBox", "0 0 1024 1024").attr("width", 20).attr("height", 20);
        var activeIcon = options.icon[processData.icon];
        iconSvg.attr("x", startX + 9).attr("y", startY + 9)
            .selectAll("path").data(activeIcon).enter().append("path")
            .attr("d", function(d){
                return d;
            }).attr("fill", backgroundColor);
        // 文字
        var fontSize = options["font-size"];
        var text = tool.addElement(g, "text", {"data-type" : "discription"});
        text.attr('x', startX + 2 * radius + 3 * space).attr('y', midY + fontSize / 2 - 2 )
            .style('fill', 'black').style('font-size', fontSize + 'px').style('font-family', options["font-family"])//.style('font-weight', 'bold')
            .text(textValue);
        // 右边状态 ===================================================================================================
        var smallerRadius = radius - 3;
        g.selectAll('[data-type=right]').style("display", "none");
        if( processData.icon === "collect" && typeof processData.more === "function" ){// 先判断是否特殊的采集-更多
            text = tool.addElement(g, "text", {"data-type" : "right"});
            text.attr('x', endX - smallerRadius - 2 * fontSize ).attr('y', midY + fontSize/2 - 2 )
                .style('fill', 'rgb(51,152,220)').style('font-size', fontSize + 'px').style("display", "block").style('font-family', options["font-family"])//.style('font-weight', 'bold')
                .text("更多")
				.on("click", function(data){
					d3.event.stopPropagation();
					processData.more(data);
					// 隐藏按钮
					_this.tool.addElement(svg, "g", {"data-type" : "button"})
						.style("display", "none");
				});
        }else if( activeStatusOptions.icon === "hook" ){
            // 右边圆
            ellipse = tool.addElement(g, "ellipse", {"data-type" : "right"});
            ellipse.attr("cx", endX - radius - space).attr("cy", startY + radius + space).attr("rx", smallerRadius).attr("ry", smallerRadius);
            ellipse.style("fill", "#FFFFFF").style("stroke", color).style("stroke-width", 1).style("display", "block");
            // 钩
            var polyline = tool.addElement(g, "polyline", {"data-type" : "right"});
            var polylineX1 = endX - radius - space - 8;
            var polylineX2 = endX - radius - space - 2;
            var polylineX3 = endX - radius - space + 8;
            var polylineY1 = midY + 2;
            var polylineY2 = midY + 8;
            var polylineY3 = midY - 5;
            polyline.attr("points", polylineX1 + "," + polylineY1 + " " + polylineX2 + "," + polylineY2 + " " + polylineX3 + "," + polylineY3 + " " + polylineX2 + "," + (polylineY2-1) + " " + polylineX1 + "," + polylineY1);
            polyline.style("fill", "none").style("stroke", color).style("stroke-width", 1).style("display", "block");
        }else if( activeStatusOptions.icon === "error" ){
            // 右边圆
            ellipse = tool.addElement(g, "ellipse", {"data-type" : "right"});
            ellipse.attr("cx", endX - radius - space).attr("cy", startY + radius + space).attr("rx", smallerRadius).attr("ry", smallerRadius);
            ellipse.style("fill", "#FFFFFF").style("stroke", color).style("stroke-width", 1).style("display", "block");
            // 感叹号
            fontSize = 24;
            text = tool.addElement(g, "text", {"data-type" : "right"});
            text.attr('x', endX - radius - space - fontSize / 4 ).attr('y', midY + fontSize/2 - 3 )
                .style('fill', color).style('font-size', fontSize + 'px').style("display", "block").style('font-weight', 'bold')
                .text("!");
        }else if( activeStatusOptions.text ){
            text = tool.addElement(g, "text", {"data-type" : "right"});
            text.attr('x', endX - smallerRadius - activeStatusOptions.text.length * fontSize ).attr('y', midY + fontSize/2 - 2 )
                .style('fill', color).style('font-size', fontSize + 'px').style("display", "block").style('font-family', options["font-family"])//.style('font-weight', 'bold')
                .text(activeStatusOptions.text);
        }
        // 连接点 =====================================================================================================
        // 顶部节点
        if( topNode === 1 ){
            // 画三角形
            polyline = tool.addElement(g, "polyline", {"data-type" : "top"});
            polyline.attr("points", (midX - 5) + "," + (startY+1) + " " + (midX + 5) + "," + (startY+1) + " " + midX + "," + (startY+7) );
            polyline.style("fill", "rgb(205,205,205)").style("stroke", "none");
            // 画圈
            ellipse = tool.addElement(g, "ellipse", {"data-type" : "top"});
            radius = 6;
            ellipse.attr("cx", midX).attr("cy", startY).attr("rx", radius).attr("ry", radius);
            ellipse.style("fill", "#FFFFFF").style("stroke", "black").style("stroke-width", 1);
        }
        // 底部节点
        var nodeSpace = 26;
        var nodeStartX = midX - (bottomNode - 1)/2 * nodeSpace;
        g.selectAll('ellipse[data-type^=bottom]').style("display", "none");
        for(i = 0; i < bottomNode; i++){
            ellipse = g.select('ellipse[data-type=bottom' + i + ']');
            if( ellipse.size() === 0 ){
                ellipse = g.append('ellipse').attr("data-type", "bottom" + i);
            }
            ellipse.attr("cx", nodeStartX + nodeSpace * i).attr("cy", endY).attr("rx", radius).attr("ry", radius);
            ellipse.style("fill", "#FFFFFF").style("stroke", "black").style("stroke-width", 1).style("display", "block");
        }
        // 提示信息 ==================================================================================================-
        var tips = processData.hoverTips;
        var height = 7;
        fontSize = 14;
        space = 12;
        var tipsStartX = startX + 5;
        // 先创建框，使框在文字下面
        polyline = tool.addElement(g, "polyline", {"data-type" : "tips"});
        if( shadowFilterOptions.display ){// 是否显示阴影
            polyline.attr("filter", "url(#" + options.filter.shadow.id + ")")
        }else{
            polyline.attr("filter", "")
        }
        text = tool.addElement(g, "text", {"data-type" : "tips"});
        text.attr('x', tipsStartX + space).attr('y', endY + space + fontSize + height )
            .style('font-size', fontSize + 'px').style('font-family', options["font-family"])//.style('font-weight', 'bold')
            .text(tips);
        if( processData.hoverStatus ){
            text.style("display", "block").transition()
                .duration(100)
                .style("fill", activeStatusOptions.tipsTextColor);
        }else{
            text.style("fill", activeStatusOptions.tipsTextColor.replace("1)", "0)") ).style("display", "none");
        }
        // 画提示框
        var tipsStartY = endY + height;
        var tipsEndY = tipsStartY + fontSize + space * 2;
        var tipsWidth = Math.max(text._groups[0][0].clientWidth + 2 * space, 80);
        polyline.attr("points", tipsStartX + "," + tipsStartY + " " + (tipsStartX+33) + "," + tipsStartY + " " + (tipsStartX+40) + "," + endY + " " +
            (tipsStartX+47) + "," + tipsStartY + " " + (tipsStartX+tipsWidth) + "," + tipsStartY + " " +
            (tipsStartX+tipsWidth) + "," + tipsEndY + " " + tipsStartX + "," + tipsEndY + " " + tipsStartX + "," + tipsStartY
        );
        if( processData.hoverStatus ){
            polyline.style("display", "block").transition()
                .duration(100)
                .style("fill", "rgba(255,255,255, 1)")
                .style("stroke", "rgba(222,222,222, 1)");
        }else{
            polyline.style("fill", "rgba(255,255,255,0)").style("stroke", "rgba(222,222,222,0)").style("display", "none");
        }

        // smallerRadius

    },
    // 画连线的方法
    drawLine : function(startId, endId){
        var pathContainer = this.pathContainer;
        var lineArray = this.lineArray;
        var svg = this.svg;
        var i, path, lines = [], line;
        for(i = 0; i < lineArray.length; i++){
            line = lineArray[i];
            if(!( startId && startId != line.start )||( endId && endId != line.end ) ){
                lines.push(line);
            }
        }
        var startX, startY, startNode, endNode, endX, endY;
        var temp = {};// 用于记录起始元素已经引出的连线数
        for(i = 0; i < lines.length; i++){
            line = lines[i];
            startId = line.start;
            endId = line.end;
            if( temp[startId] >= 0 ){
                temp[startId]++;
            }else{
                temp[startId] = 0;
            }
            path = svg.select("path[start=" + startId + "][end=" + endId + "]");
            if( path.size() == 0 ){
                path = pathContainer.append("path").attr("start", startId).attr("end", endId);
            }
            startNode = svg.select(" #" + startId + " [data-type=bottom" + temp[startId] + "]");
            endNode = svg.select(" #" + endId + " ellipse[data-type=top]");
            startX = parseFloat(startNode.attr("cx"));
            startY = parseFloat(startNode.attr("cy"));
            endX = parseFloat(endNode.attr("cx"));
            endY = parseFloat(endNode.attr("cy"));
            path.attr("d", " M " + startX + " " + startY +
                " Q " + startX + " " + (startY + endY)/2 + " " + (startX + endX)/2 + " " + (startY + endY)/2 +
                " T " + endX + " " + endY
            ).style("stroke", "black").style("fill", "none").style("stroke-width", 1);
            endNode.style("visibility", "hidden");
        }
    },
    // 画按钮弹框
    drawButton : function(processData){
        var options = this.options;
        var tool = this.tool;
        var svg = this.svg;

        var fontSize = options["font-size"];
        var rectWidth = processData.width;
        if( !tool.isNumber(rectWidth) ){
            rectWidth = options.process.width;
        }
        var rectHeight = fontSize * 19 / 8;
        var midY = processData.y + rectHeight/2;

        var restartCallback = function(){// 重启
            if( typeof processData.restart === "function" ){
                processData.restart(processData);
            }
        };
        var logCallback = function(){// 日志
            if( typeof processData.log === "function" ){
                processData.log(processData);
            }
        };
		var timeCallback = function(){// 耗时
            if( typeof processData.time === "function" ){
                processData.time(processData);
            }
        };

        var g = tool.addElement(svg, "g", {"data-type" : "button"})
            .style("display", "block");
        // 先创建框，使框在文字下面
        var polyline = tool.addElement(g, "polyline", {"data-type" : "container"})
            .style("fill", options.backgroundColor).style("stroke", "rgba(222,222,222, 1)");
        var buttonContainerWidth = 124;
        var buttonContainerHeight = 117;
		var buttonWidth = 96;
        var buttonHeight = (fontSize - 2)*2;
		if( processData.status !== 0 ){// 任务为未开始时，隐藏耗时详情按钮
			buttonContainerHeight += (11 + buttonHeight);
		}
        var buttonContainerStartX = processData.x + 14 + rectWidth;
        var buttonContainerEndX = buttonContainerStartX + buttonContainerWidth;
        var buttonContainerStartY = midY - buttonContainerHeight / 2;
        var buttonEndY = buttonContainerStartY + buttonContainerHeight;
        var buttonMidX = buttonContainerStartX + buttonContainerWidth / 2;
        polyline.attr("points", buttonContainerStartX + "," + buttonContainerStartY + " " + buttonContainerStartX + "," + (midY - 6) + " " +
            (buttonContainerStartX - 7) + "," + midY + " " + buttonContainerStartX + "," + (midY + 6) + " " +
            buttonContainerStartX + "," + buttonEndY + " " + buttonContainerEndX + "," + buttonEndY + " " +
            buttonContainerEndX + "," + buttonContainerStartY + " " + buttonContainerStartX + "," + buttonContainerStartY + " ");
        
        // 重启按钮
        var rect = tool.addElement(g, "rect", {"data-type" : "restart"});
        var buttonStartX = buttonMidX - buttonWidth / 2;
        var y = buttonContainerStartY + 14;
        rect.attr("x", buttonStartX).attr("y", y)
            .attr("width", buttonWidth).attr("height", buttonHeight)
            .attr("rx", fontSize).attr("ry", fontSize)
            .style("fill", "rgb(53,152,220)")
            .style("cursor", "pointer")
            .on("click", function(){
				d3.event.stopPropagation();
                restartCallback();
            });
        var buttonTextStartX = buttonMidX - fontSize * 2;
        var text = tool.addElement(g, "text", {"data-type" : "restart"});
        text.attr('x', buttonTextStartX).attr('y', y + (buttonHeight + fontSize) / 2 - 1.5 )
            .style('font-size', fontSize + 'px').style('font-family', options["font-family"])//.style('font-weight', 'bold')
            .style("fill", "rgb(255,255,255)")
            .style("cursor", "pointer")
            .text("重启任务")
            .on("click", function(){
				d3.event.stopPropagation();
                restartCallback();
            });
        // 日志按钮
        y += buttonHeight + 11;
        rect = tool.addElement(g, "rect", {"data-type" : "log"});
        rect.attr("x", buttonStartX).attr("y", y)
            .attr("width", buttonWidth).attr("height", buttonHeight)
            .attr("rx", fontSize).attr("ry", fontSize)
            .style("fill", "rgb(0,199,194)")
            .style("cursor", "pointer")
            .on("click", function(){
				d3.event.stopPropagation();
                logCallback();
            });
        text = tool.addElement(g, "text", {"data-type" : "log"});
        text.attr('x', buttonTextStartX).attr('y', y + (buttonHeight + fontSize) / 2 - 1.5 )
            .style('font-size', fontSize + 'px').style('font-family', options["font-family"])//.style('font-weight', 'bold')
            .style("fill", "rgb(255,255,255)")
            .style("cursor", "pointer")
            .text("任务日志")
            .on("click", function(){
				d3.event.stopPropagation();
                logCallback();
            });
		// 耗时详情按钮 -- 任务为未开始时，隐藏
		if( processData.status !== 0 ){
			y += buttonHeight + 11;
			rect = tool.addElement(g, "rect", {"data-type" : "time"});
			rect.attr("x", buttonStartX).attr("y", y)
				.attr("width", buttonWidth).attr("height", buttonHeight)
				.attr("rx", fontSize).attr("ry", fontSize)
				.style("fill", "rgb(142,118,229)")
				.style("cursor", "pointer")
				.style("display", "block")
				.on("click", function(){
					d3.event.stopPropagation();
					timeCallback();
				});
			text = tool.addElement(g, "text", {"data-type" : "time"});
			text.attr('x', buttonTextStartX).attr('y', y + (buttonHeight + fontSize) / 2 - 1.5 )
				.style('font-size', fontSize + 'px').style('font-family', options["font-family"])//.style('font-weight', 'bold')
				.style("fill", "rgb(255,255,255)")
				.style("cursor", "pointer")
				.style("display", "block")
				.text("耗时详情")
				.on("click", function(){
					d3.event.stopPropagation();
					timeCallback();
				});
		}else{
			rect = tool.addElement(g, "rect", {"data-type" : "time"}).style("display", "none");;
			text = tool.addElement(g, "text", {"data-type" : "time"}).style("display", "none");;
		}
        // 关闭
        y += buttonHeight + 11;
        text = tool.addElement(g, "text", {"data-type" : "close"});
        text.attr('x', buttonTextStartX + fontSize).attr('y', y + fontSize - 3 )
            .style('font-size', fontSize + 'px').style('font-family', options["font-family"])//.style('font-weight', 'bold')
            .style("fill", "rgb(51,152,220)")
            .style("cursor", "pointer")
            .text("关闭")
            .on("click", function(){
                g.style("display", "none");
            });
    },
    // 这个用于自动调节宽度，会在processArray中生成对应的宽度，如processArray[0].width，调用后，可根据生成的宽度，再计算坐标
    // 如果不需要自动调节，使用配置的默认宽度，则不调用该方法
    getTextLength : function(svgSelector, processData, inputOptions){
        var svg = d3.select(svgSelector);
        var tool = this.tool;
        var text = tool.addElement(svg, "text", {"data-type" : "test"});
        var options = tool.extend({}, this.defaultOptions);
        tool.extend(options, inputOptions || {});
        for(var i = 0; i < processData.length; i++){
            var data = processData[i];
            text.text(data.text)
                .style('font-size', options["font-size"] + 'px').style('font-family', options["font-family"])
                .style("fill", "black")
                .style("visibility", function(){
                    data.width = this.getComputedTextLength() + options["font-size"] * 8;
                    //console.log(this.getComputedTextLength());
                    return "hidden";
                })
        }
        text.remove();
    },
    // 事件绑定
    bindEvent : function(){
		var _this = this;
        var svg = this.svg;
        //var svgSelector = this.svgSelector;
        var options = this.options;
        var zoomOptions = options.zoom;
        var zoomObject = this.zoomObject;
        // 放大按钮
        if( zoomOptions.zoomIn ){
            d3.select(zoomOptions.zoomIn).on("click", function(){
                // d3.zoom().scaleBy(svg, 1 + zoomOptions.step);
                zoomObject.scaleBy(svg, 1 + zoomOptions.step);
            })
        }
        // 缩小按钮
        if( zoomOptions.zoomOut ){
            d3.select(zoomOptions.zoomOut).on("click", function(){
                zoomObject.scaleBy(svg, 1 - zoomOptions.step);
            })
        }
		// 点击其他地方，取消按钮框
		svg.on("click", function(){
			_this.tool.addElement(svg, "g", {"data-type" : "button"})
				.style("display", "none");
		})
    },
    // 设置放大缩小倍数，供外部调用
    scaleTo : function(scaleSize){
        var options = this.options;
        var tool = this.tool;
        var zoomObject = this.zoomObject;
        var svt = this.svg;
        if( tool.isNumber(scaleSize) ){
            zoomObject.scaleTo(svt, scaleSize);
        }else{
            console.error("scaleTo()入参不是数字 -- " + scaleSize);
        }
    },
    // 默认配置
    defaultOptions : {
        width : 1200,
        height : 600,
		"font-size" : 16,
		"font-family" : "微软雅黑",
        backgroundColor : "#FFFFFF",
        zoom : {
            max : 2,// 最大放大倍数
            min : 0.5,// 最小缩小倍数
            zoomIn : null,// 放大按钮id
            zoomOut : null,// 缩小按钮id
            step : 0.1// 默认放大增长倍数 放大：1->1 x 1.1-> 1 x 1.1 x 1.1     缩小 1-> 1 x 0.9 -> 1 x 0.9 x 0.9
        },
        process : {
            width : 238,
            status : [
                {
                    text : "未开始",
                    color : "rgba(116,134,147,1)",
                    tipsTextColor : "rgba(144,144,144,1)"
                },{
                    text : "进行中",
                    color : "rgba(38,159,232,1)",
                    tipsTextColor : "rgba(144,144,144,1)"
                },{
                    icon : "hook",
                    color : "rgba(104, 243, 144,1)",
                    tipsTextColor : "rgba(144,144,144,1)"
                },{
                    icon : "error",
                    color : "rgba(255,32,0,1)",
                    tipsTextColor : "rgba(255,32,0,1)"
                }
            ]
        },
        icon : {
            // 初始化-init  采集-collect  生成数据-data  勾稽-check  生成txt-txt  打包压缩-zip
            init : [// 200 200
                "M816.67072 280.576c-0.342016 1.39264-0.729088 2.777088-1.140736 4.159488-0.124928 0.4096-0.251904 0.817152-0.380928 1.226752-0.311296 1.001472-0.64512 2.002944-0.99328 3.00032-0.145408 0.41984-0.288768 0.83968-0.44032 1.257472-0.135168 0.366592-0.288768 0.731136-0.428032 1.097728-0.356352 0.944128-0.710656 1.890304-1.099776 2.830336-0.135168 0.32768-0.28672 0.653312-0.425984 0.980992-0.299008 0.698368-0.616448 1.394688-0.93184 2.08896-0.137216 0.299008-0.264192 0.602112-0.403456 0.90112-0.256 0.550912-0.520192 1.097728-0.78848 1.646592-0.116736 0.239616-0.241664 0.475136-0.360448 0.714752-0.284672 0.569344-0.565248 1.138688-0.862208 1.705984-0.282624 0.54272-0.555008 1.08544-0.847872 1.624064-0.135168 0.253952-0.288768 0.503808-0.425984 0.75776-0.50176 0.91136-1.005568 1.820672-1.538048 2.727936-0.376832 0.641024-0.772096 1.277952-1.163264 1.91488-0.380928 0.618496-0.761856 1.236992-1.153024 1.851392-0.458752 0.7168-0.923648 1.431552-1.400832 2.144256-0.335872 0.50176-0.681984 1.001472-1.026048 1.501184-0.903168 1.312768-1.839104 2.617344-2.803712 3.915776-0.008192 0.01024-0.016384 0.022528-0.024576 0.032768-0.966656 1.298432-1.961984 2.59072-2.99008 3.874816-0.094208 0.116736-0.186368 0.231424-0.280576 0.346112-0.190464 0.237568-0.380928 0.473088-0.571392 0.710656-0.688128 0.841728-1.380352 1.67936-2.093056 2.516992-0.053248 0.063488-0.110592 0.126976-0.165888 0.190464-0.137216 0.159744-0.278528 0.319488-0.417792 0.48128-1.583104 1.835008-3.2256 3.659776-4.933632 5.464064-0.008192 0.008192-0.016384 0.016384-0.024576 0.026624-3.301376 3.487744-6.834176 6.918144-10.590208 10.2912-0.012288 0.008192-0.022528 0.018432-0.032768 0.026624-1.792 1.609728-3.641344 3.20512-5.535744 4.786176l-0.497664 0.413696c-5.830656 4.84352-12.130304 9.555968-18.870272 14.125056-0.249856 0.169984-0.503808 0.33792-0.755712 0.507904-1.957888 1.318912-3.954688 2.62144-5.984256 3.915776-0.364544 0.231424-0.724992 0.464896-1.091584 0.694272-2.217984 1.400832-4.472832 2.78528-6.774784 4.155392-0.059392 0.036864-0.118784 0.07168-0.178176 0.108544-2.469888 1.468416-4.990976 2.9184-7.555072 4.352-0.151552 0.086016-0.3072 0.167936-0.4608 0.251904-2.2528 1.253376-4.544512 2.490368-6.866944 3.715072-0.606208 0.319488-1.21856 0.638976-1.828864 0.956416-0.231424 0.120832-0.473088 0.239616-0.708608 0.360448L786.432 380.928c13.406208 0 25.290752 6.5024 32.768 16.488448L819.2 280.576 816.67072 280.576z",
                "M620.544 977.64352c-0.96256-0.38912-1.921024-0.784384-2.87744-1.183744l-29.335552 29.10208c11.020288-2.408448 21.772288-5.02784 32.212992-7.856128L620.544 977.64352z",
                "M620.544 468.824064 620.544 421.888c0-1.302528 0.075776-2.588672 0.196608-3.86048-3.104768 0.841728-6.199296 1.6896-9.355264 2.496512-0.454656 0.116736-0.91136 0.227328-1.368064 0.344064-9.355264 2.36544-18.935808 4.571136-28.725248 6.608896-0.466944 0.098304-0.925696 0.198656-1.39264 0.292864-2.248704 0.464896-4.542464 0.886784-6.811648 1.3312 4.29056 1.988608 8.265728 4.691968 11.71456 8.126464l32.907264 32.768C618.651648 469.598208 619.595776 469.209088 620.544 468.824064z",
                "M0.212992 409.131008c0.067584 0.985088 0.14336 1.968128 0.243712 2.94912 0.053248 0.518144 0.116736 1.036288 0.178176 1.552384 0.114688 0.940032 0.243712 1.880064 0.38912 2.816 0.077824 0.497664 0.1536 0.99328 0.239616 1.490944 0.180224 1.042432 0.385024 2.082816 0.60416 3.121152 0.077824 0.366592 0.145408 0.735232 0.227328 1.101824 0.643072 2.869248 1.435648 5.718016 2.367488 8.548352 0.090112 0.272384 0.188416 0.540672 0.280576 0.811008 0.397312 1.169408 0.817152 2.33472 1.263616 3.495936 0.108544 0.282624 0.219136 0.5632 0.329728 0.843776 0.485376 1.232896 0.997376 2.459648 1.536 3.682304 0.067584 0.1536 0.13312 0.3072 0.202752 0.4608 29.61408 66.234368 138.115072 119.62368 279.52128 139.452416l0 0c0.016384 0.002048 0.034816 0.004096 0.049152 0.006144 4.292608 0.602112 8.624128 1.161216 12.976128 1.701888 1.05472 0.129024 2.10944 0.258048 3.166208 0.385024 4.308992 0.518144 8.634368 1.01376 12.998656 1.470464 0.063488 0.006144 0.124928 0.014336 0.188416 0.02048 4.421632 0.4608 8.87808 0.876544 13.355008 1.271808 1.089536 0.096256 2.179072 0.190464 3.270656 0.282624 4.440064 0.374784 8.894464 0.72704 13.38368 1.038336 0.053248 0.004096 0.106496 0.008192 0.161792 0.012288 4.528128 0.311296 9.091072 0.577536 13.668352 0.821248 1.128448 0.06144 2.258944 0.120832 3.38944 0.176128 0.065536 0.004096 0.129024 0.006144 0.19456 0.008192 10.385408 0.548864 20.883456 0.925696 31.488 1.124352l0.004096 0c4.5568 0 9.121792 0.114688 13.713408 0.114688s9.158656-0.114688 13.713408-0.114688l0.004096 0c6.234112 0 12.43136-0.069632 18.593792-0.2048l-3.846144-3.883008c-15.826944-15.98464-15.753216-41.914368 0.159744-57.808896l88.727552-88.612864c0.108544-0.108544 0.229376-0.200704 0.339968-0.3072-3.495936 0.64512-7.010304 1.312768-10.539008 1.312768l-0.036864 0c-0.774144 0-1.54624 0.07168-2.320384 0.16384-4.947968 0.587776-9.930752 1.077248-14.948352 1.581056-0.376832 0.038912-0.753664 0.043008-1.132544 0.08192-0.473088 0.045056-0.946176 0.077824-1.419264 0.124928-2.131968 0.208896-4.284416 0.380928-6.434816 0.567296-3.016704 0.274432-6.02112 0.5632-9.066496 0.806912-0.147456 0.01024-0.29696 0.02048-0.444416 0.03072-0.24576 0.018432-0.489472 0.034816-0.733184 0.053248-1.398784 0.108544-2.818048 0.188416-4.220928 0.290816-3.704832 0.270336-7.407616 0.544768-11.143168 0.770048-0.57344 0.036864-1.14688 0.075776-1.72032 0.108544-0.057344 0.004096-0.116736 0.008192-0.17408 0.01024-1.724416 0.100352-3.467264 0.17408-5.203968 0.256-3.465216 0.180224-6.92224 0.36864-10.409984 0.512-0.864256 0.034816-1.732608 0.069632-2.60096 0.104448-0.118784 0.004096-0.237568 0.01024-0.3584 0.014336-0.116736 0.004096-0.23552 0.008192-0.352256 0.01024-5.070848 0.190464-10.160128 0.344064-15.280128 0.45056-0.864256 0.02048-1.732608 0.03072-2.596864 0.045056C420.661248 444.352512 415.148032 444.416 409.6 444.416s-11.061248-0.063488-16.556032-0.161792c-0.864256-0.016384-1.732608-0.026624-2.596864-0.045056-5.240832-0.108544-10.448896-0.264192-15.634432-0.4608-0.247808-0.01024-0.493568-0.02048-0.739328-0.03072-0.739328-0.028672-1.480704-0.057344-2.217984-0.088064-3.923968-0.161792-7.817216-0.36864-11.710464-0.577536-1.296384-0.069632-2.607104-0.116736-3.90144-0.192512-0.126976-0.006144-0.253952-0.016384-0.380928-0.024576-0.505856-0.03072-1.007616-0.063488-1.513472-0.096256-1.718272-0.104448-3.411968-0.241664-5.124096-0.354304-3.42016-0.22528-6.848512-0.442368-10.24-0.708608-0.288768-0.022528-0.575488-0.043008-0.86016-0.063488-0.106496-0.008192-0.212992-0.016384-0.319488-0.024576-2.99008-0.237568-5.941248-0.524288-8.904704-0.794624-2.203648-0.190464-4.411392-0.374784-6.59456-0.589824-0.292864-0.028672-0.585728-0.057344-0.878592-0.086016-0.557056-0.053248-1.11616-0.108544-1.671168-0.16384-5.019648-0.503808-10.002432-1.052672-14.948352-1.640448-0.37888-0.043008-0.75776-0.09216-1.134592-0.137216-0.4096-0.049152-0.8192-0.100352-1.2288-0.149504-5.10976-0.620544-10.190848-1.275904-15.218688-1.984512-0.057344-0.006144-0.11264-0.016384-0.169984-0.024576-0.100352-0.014336-0.198656-0.028672-0.299008-0.043008-2.363392-0.333824-4.685824-0.710656-7.030784-1.06496-1.214464-0.188416-2.441216-0.364544-3.65568-0.555008-1.458176-0.227328-2.942976-0.432128-4.395008-0.6656-0.489472-0.079872-0.985088-0.1536-1.476608-0.233472-1.486848-0.241664-2.940928-0.514048-4.417536-0.763904-3.381248-0.57344-6.770688-1.140736-10.110976-1.75104-0.354304-0.065536-0.70656-0.129024-1.060864-0.19456s-0.708608-0.129024-1.060864-0.196608c-4.794368-0.888832-9.547776-1.814528-14.249984-2.783232-0.464896-0.094208-0.925696-0.19456-1.390592-0.292864-4.896768-1.017856-9.73824-2.07872-14.526464-3.180544-4.788224-1.101824-9.521152-2.246656-14.200832-3.428352-0.456704-0.114688-0.913408-0.227328-1.368064-0.344064-4.53632-1.15712-9.015296-2.3552-13.441024-3.588096-0.509952-0.141312-1.017856-0.284672-1.52576-0.428032-4.503552-1.267712-8.955904-2.564096-13.340672-3.907584-0.11264-0.034816-0.223232-0.07168-0.33792-0.106496-4.564992-1.400832-9.068544-2.840576-13.500416-4.32128-0.0512-0.016384-0.1024-0.032768-0.151552-0.049152-4.286464-1.4336-8.497152-2.910208-12.654592-4.415488-0.23552-0.086016-0.48128-0.16384-0.7168-0.249856l0.026624 0c-2.945024-1.071104-5.844992-2.168832-8.722432-3.2768-0.882688-0.339968-1.75104-0.684032-2.625536-1.028096-2.033664-0.796672-4.050944-1.601536-6.049792-2.414592-0.933888-0.380928-1.86368-0.761856-2.789376-1.14688-2.07872-0.862208-4.132864-1.736704-6.170624-2.617344-0.710656-0.3072-1.431552-0.612352-2.136064-0.9216-2.752512-1.20832-5.474304-2.430976-8.148992-3.672064-0.196608-0.090112-0.387072-0.18432-0.58368-0.27648-2.463744-1.148928-4.890624-2.312192-7.286784-3.489792-0.67584-0.331776-1.34144-0.667648-2.011136-1.001472-1.972224-0.98304-3.923968-1.974272-5.84704-2.975744-0.653312-0.339968-1.306624-0.677888-1.953792-1.019904-2.213888-1.169408-4.397056-2.349056-6.547456-3.540992-0.253952-0.141312-0.512-0.278528-0.765952-0.41984-2.537472-1.417216-5.029888-2.850816-7.4752-4.302848-0.069632-0.043008-0.137216-0.083968-0.208896-0.126976-2.279424-1.355776-4.513792-2.727936-6.711296-4.112384-0.403456-0.253952-0.800768-0.509952-1.200128-0.763904-1.959936-1.247232-3.887104-2.506752-5.779456-3.77856-0.321536-0.21504-0.64512-0.428032-0.964608-0.64512-6.684672-4.530176-12.935168-9.201664-18.72896-14.002176-0.202752-0.167936-0.403456-0.335872-0.60416-0.503808-1.814528-1.51552-3.586048-3.04128-5.306368-4.581376-0.088064-0.079872-0.178176-0.157696-0.26624-0.23552-3.729408-3.346432-7.241728-6.750208-10.522624-10.20928-1.789952-1.886208-3.506176-3.792896-5.158912-5.711872-0.090112-0.104448-0.182272-0.208896-0.272384-0.313344-0.067584-0.077824-0.135168-0.155648-0.202752-0.233472-0.731136-0.856064-1.445888-1.718272-2.1504-2.582528-0.059392-0.073728-0.118784-0.145408-0.176128-0.219136-0.206848-0.256-0.413696-0.512-0.618496-0.768-1.036288-1.294336-2.039808-2.594816-3.012608-3.90144-0.01024-0.014336-0.02048-0.028672-0.03072-0.043008-0.9728-1.308672-1.91488-2.623488-2.824192-3.944448-0.335872-0.487424-0.673792-0.974848-0.999424-1.462272-0.479232-0.7168-0.948224-1.4336-1.406976-2.154496-0.387072-0.606208-0.763904-1.214464-1.13664-1.824768-0.401408-0.653312-0.806912-1.304576-1.191936-1.959936-0.534528-0.909312-1.040384-1.824768-1.544192-2.738176-0.13312-0.241664-0.27648-0.48128-0.407552-0.724992-0.303104-0.561152-0.589824-1.1264-0.882688-1.6896-0.110592-0.212992-0.212992-0.425984-0.323584-0.641024-0.294912-0.577536-0.59392-1.155072-0.876544-1.736704-0.262144-0.540672-0.52224-1.081344-0.776192-1.622016-0.083968-0.178176-0.159744-0.360448-0.241664-0.540672-0.362496-0.790528-0.720896-1.579008-1.060864-2.373632-0.151552-0.352256-0.315392-0.704512-0.462848-1.058816-0.391168-0.940032-0.743424-1.886208-1.099776-2.830336-0.139264-0.366592-0.292864-0.731136-0.425984-1.097728-0.1536-0.417792-0.294912-0.837632-0.44032-1.257472-0.34816-0.997376-0.681984-1.998848-0.99328-3.00032-0.131072-0.417792-0.262144-0.835584-0.387072-1.253376-0.407552-1.37216-0.792576-2.750464-1.132544-4.132864L0 280.573952l0 122.88c0 1.441792 0.045056 2.87744 0.118784 4.308992C0.141312 408.221696 0.182272 408.676352 0.212992 409.131008z",
                "M0.452608 193.067008c8.679424 83.585024 141.070336 152.614912 316.643328 170.852352 18.579456 1.929216 37.64224 3.291136 57.094144 4.040704C385.859584 368.410624 397.6704 368.64 409.6 368.64c3.975168 0 7.940096-0.026624 11.88864-0.075776 27.645952-0.354304 54.603776-1.941504 80.615424-4.644864 32.413696-3.366912 63.34464-8.472576 92.307456-15.07328 2.476032-0.565248 4.93568-1.140736 7.38304-1.726464 18.866176-4.519936 36.855808-9.682944 53.819392-15.427584 3.293184-1.114112 6.549504-2.250752 9.764864-3.40992 6.928384-2.494464 13.678592-5.085184 20.226048-7.774208 4.665344-1.916928 9.222144-3.885056 13.688832-5.894144 4.425728-1.992704 8.747008-4.032512 12.969984-6.11328 1.912832-0.944128 3.803136-1.896448 5.675008-2.859008 6.25664-3.21536 12.283904-6.526976 18.038784-9.934848 0.067584-0.04096 0.135168-0.083968 0.206848-0.124928 8.2944-4.921344 16.05632-10.037248 23.238656-15.32928 1.742848-1.284096 3.44064-2.582528 5.113856-3.887104 6.674432-5.199872 12.812288-10.55744 18.354176-16.062464 1.415168-1.406976 2.781184-2.82624 4.120576-4.251648 5.218304-5.552128 9.86112-11.241472 13.869056-17.055744 1.939456-2.811904 3.713024-5.656576 5.357568-8.525824 1.806336-3.15392 3.438592-6.336512 4.878336-9.55392 0.804864-1.794048 1.544192-3.600384 2.23232-5.414912 2.777088-7.340032 4.610048-14.825472 5.400576-22.433792 0.137216-1.327104 0.243712-2.656256 0.319488-3.991552C819.156992 187.496448 819.2 185.909248 819.2 184.32c0-101.797888-183.384064-184.32-409.6-184.32S0 82.522112 0 184.32c0 1.589248 0.045056 3.176448 0.13312 4.757504C0.208896 190.410752 0.315392 191.741952 0.452608 193.067008z",
                "M0.212992 627.249152c0.065536 0.980992 0.14336 1.959936 0.243712 2.93888 0.053248 0.526336 0.116736 1.050624 0.180224 1.574912 0.11264 0.927744 0.239616 1.85344 0.382976 2.779136 0.079872 0.514048 0.157696 1.028096 0.247808 1.540096 0.172032 0.997376 0.370688 1.994752 0.577536 2.985984 0.086016 0.41984 0.165888 0.83968 0.258048 1.257472 0.315392 1.406976 0.659456 2.80576 1.046528 4.202496 0.038912 0.139264 0.086016 0.278528 0.124928 0.417792 0.352256 1.253376 0.733184 2.504704 1.142784 3.751936 0.147456 0.452608 0.311296 0.90112 0.466944 1.35168 0.325632 0.94208 0.661504 1.88416 1.017856 2.820096 0.190464 0.499712 0.385024 0.995328 0.585728 1.492992 0.364544 0.91136 0.743424 1.820672 1.13664 2.725888 0.206848 0.475136 0.411648 0.954368 0.62464 1.427456 0.456704 1.007616 0.935936 2.013184 1.429504 3.016704 0.17408 0.352256 0.33792 0.708608 0.514048 1.060864 0.68608 1.357824 1.40288 2.709504 2.154496 4.057088 0.11264 0.200704 0.23552 0.39936 0.34816 0.600064 0.64512 1.140736 1.312768 2.275328 2.004992 3.407872 0.258048 0.41984 0.528384 0.837632 0.792576 1.257472 0.579584 0.917504 1.169408 1.835008 1.777664 2.748416 0.303104 0.454656 0.612352 0.907264 0.923648 1.36192 0.620544 0.905216 1.25952 1.806336 1.910784 2.705408 0.303104 0.417792 0.602112 0.837632 0.913408 1.253376 0.77824 1.050624 1.583104 2.095104 2.402304 3.137536 0.19456 0.24576 0.380928 0.495616 0.575488 0.741376 1.046528 1.312768 2.123776 2.615296 3.233792 3.91168 0.165888 0.19456 0.339968 0.385024 0.505856 0.575488 0.937984 1.083392 1.8944 2.164736 2.873344 3.237888 0.33792 0.36864 0.684032 0.735232 1.026048 1.103872 0.845824 0.909312 1.705984 1.814528 2.582528 2.715648 0.37888 0.38912 0.761856 0.780288 1.14688 1.16736 0.907264 0.915456 1.835008 1.826816 2.772992 2.73408 0.34816 0.335872 0.690176 0.671744 1.042432 1.007616 1.196032 1.13664 2.41664 2.267136 3.661824 3.391488 0.098304 0.088064 0.190464 0.178176 0.288768 0.26624 1.40288 1.257472 2.83648 2.510848 4.298752 3.751936 0.192512 0.16384 0.393216 0.325632 0.585728 0.489472 1.234944 1.040384 2.490368 2.076672 3.76832 3.106816 0.37888 0.303104 0.761856 0.606208 1.144832 0.909312 1.13664 0.903168 2.289664 1.80224 3.459072 2.695168 0.4096 0.313344 0.817152 0.626688 1.230848 0.935936 1.23904 0.935936 2.49856 1.86368 3.772416 2.787328 0.325632 0.23552 0.64512 0.47104 0.9728 0.708608 3.29728 2.36544 6.709248 4.696064 10.235904 6.987776 0.159744 0.104448 0.321536 0.206848 0.48128 0.3072 1.574912 1.019904 3.172352 2.029568 4.79232 3.033088 0.364544 0.227328 0.733184 0.452608 1.101824 0.677888 1.468416 0.90112 2.955264 1.800192 4.460544 2.689024 0.37888 0.221184 0.755712 0.446464 1.134592 0.669696 1.6384 0.960512 3.29728 1.912832 4.97664 2.85696 0.212992 0.120832 0.423936 0.241664 0.638976 0.362496 3.946496 2.209792 8.003584 4.378624 12.167168 6.5024 0.094208 0.045056 0.188416 0.094208 0.282624 0.141312 1.929216 0.980992 3.883008 1.953792 5.859328 2.916352 0.311296 0.151552 0.622592 0.301056 0.935936 0.454656 1.83296 0.888832 3.684352 1.767424 5.556224 2.639872 0.294912 0.135168 0.587776 0.274432 0.884736 0.411648 8.740864 4.046848 17.887232 7.909376 27.416576 11.583488 0.210944 0.079872 0.421888 0.161792 0.632832 0.241664 2.240512 0.86016 4.499456 1.71008 6.782976 2.547712 0.141312 0.0512 0.284672 0.106496 0.425984 0.157696 9.873408 3.618816 20.129792 7.032832 30.734336 10.231808l0.243712 0.07168c32.229376 9.705472 67.67616 17.414144 105.488384 22.716416l0 0c0.016384 0.002048 0.034816 0.004096 0.049152 0.006144 1.251328 0.176128 2.525184 0.32768 3.782656 0.495616 2.482176 0.335872 4.970496 0.663552 7.471104 0.980992 0.577536 0.07168 1.144832 0.1536 1.722368 0.22528 1.05472 0.129024 2.10944 0.258048 3.166208 0.385024 0.28672 0.034816 0.575488 0.063488 0.862208 0.098304 3.147776 0.374784 6.311936 0.731136 9.488384 1.071104 0.886784 0.096256 1.759232 0.208896 2.648064 0.299008 0.063488 0.006144 0.124928 0.014336 0.188416 0.02048 1.34144 0.139264 2.70336 0.253952 4.050944 0.385024 2.414592 0.239616 4.835328 0.47104 7.264256 0.692224 0.681984 0.06144 1.355776 0.13312 2.03776 0.19456 1.089536 0.096256 2.179072 0.190464 3.270656 0.282624 0.256 0.022528 0.516096 0.038912 0.772096 0.059392 3.65568 0.305152 7.325696 0.591872 11.014144 0.854016 0.534528 0.038912 1.062912 0.086016 1.59744 0.124928 0.053248 0.004096 0.106496 0.008192 0.161792 0.012288 1.339392 0.09216 2.697216 0.157696 4.042752 0.243712 2.48832 0.157696 4.982784 0.309248 7.483392 0.45056 0.7168 0.038912 1.425408 0.090112 2.142208 0.129024 1.128448 0.06144 2.258944 0.120832 3.38944 0.176128 0.172032 0.008192 0.344064 0.014336 0.516096 0.022528 3.74784 0.18432 7.510016 0.344064 11.286528 0.48128 0.651264 0.024576 1.292288 0.06144 1.9456 0.083968 0.032768 0.002048 0.065536 0.004096 0.098304 0.004096 1.31072 0.045056 2.635776 0.063488 3.948544 0.1024 1.2288 0.036864 2.463744 0.063488 3.694592 0.094208C382.660608 799.834112 380.928 793.33376 380.928 786.432l0-124.391424c-2.035712-0.063488-4.087808-0.104448-6.115328-0.180224-0.987136-0.038912-1.972224-0.077824-2.957312-0.118784-5.23264-0.21504-10.440704-0.466944-15.613952-0.770048-0.632832-0.036864-1.261568-0.079872-1.892352-0.120832-5.154816-0.311296-10.28096-0.663552-15.372288-1.062912-0.38912-0.03072-0.782336-0.057344-1.173504-0.088064-5.206016-0.413696-10.369024-0.882688-15.505408-1.384448-0.84992-0.08192-1.69984-0.16384-2.545664-0.249856-5.019648-0.503808-10.002432-1.052672-14.948352-1.640448-0.786432-0.09216-1.570816-0.190464-2.3552-0.28672-5.113856-0.622592-10.196992-1.277952-15.228928-1.98656-0.155648-0.02048-0.309248-0.043008-0.464896-0.067584-5.074944-0.7168-10.100736-1.482752-15.087616-2.28352-0.487424-0.079872-0.976896-0.1536-1.462272-0.231424-4.890624-0.796672-9.730048-1.640448-14.532608-2.516992-0.708608-0.129024-1.415168-0.260096-2.11968-0.391168-4.794368-0.888832-9.547776-1.814528-14.249984-2.783232-0.464896-0.094208-0.925696-0.19456-1.390592-0.292864-9.791488-2.035712-19.369984-4.241408-28.725248-6.608896-0.456704-0.116736-0.913408-0.227328-1.368064-0.344064-4.53632-1.159168-9.015296-2.3552-13.441024-3.588096-0.509952-0.14336-1.017856-0.28672-1.52576-0.428032-4.503552-1.267712-8.955904-2.566144-13.340672-3.907584-0.11264-0.036864-0.223232-0.07168-0.33792-0.106496-4.564992-1.40288-9.068544-2.842624-13.500416-4.32128-0.0512-0.016384-0.1024-0.032768-0.151552-0.049152-4.286464-1.4336-8.497152-2.398208-12.654592-3.903488-0.059392-0.022528-0.118784-0.016384-0.178176 0.004096-0.002048 0.002048-0.006144 0.004096-0.01024 0.006144-0.165888 0.059392-0.335872 0.22528-0.499712 0.243712-0.004096 0-0.008192 0.004096-0.012288 0.004096-4.872192-1.83296-9.64608-3.710976-14.329856-5.627904-0.223232-0.09216-0.452608-0.180224-0.67584-0.272384-4.64896-1.910784-9.19552-3.866624-13.64992-5.859328-0.241664-0.108544-0.489472-0.212992-0.729088-0.319488-4.468736-2.009088-8.830976-4.061184-13.09696-6.152192-0.2048-0.1024-0.417792-0.200704-0.622592-0.299008-4.446208-2.187264-8.779776-4.419584-12.99456-6.692864-0.012288-0.006144-0.026624-0.014336-0.038912-0.02048-3.96288-2.136064-7.809024-4.313088-11.56096-6.524928-0.251904-0.147456-0.512-0.292864-0.763904-0.442368-7.964672-4.72064-15.437824-9.601024-22.38464-14.635008-0.006144-0.004096-0.012288-0.008192-0.018432-0.014336-27.623424-20.011008-46.934016-42.389504-55.791616-66.383872-1.175552-3.18464-2.179072-6.395904-2.981888-9.63584L0 499.705856l0 121.856c0 1.439744 0.045056 2.875392 0.118784 4.308992C0.141312 626.335744 0.182272 626.792448 0.212992 627.249152z",
                "M526.710784 1009.242112l-88.608768-88.537088c-7.747584-7.745536-12.01152-18.040832-12.007424-28.991488 0-3.866624 0.561152-7.641088 1.593344-11.261952-0.509952 0.01024-1.021952 0.018432-1.529856 0.028672C420.661248 880.576512 415.148032 880.64 409.6 880.64s-11.061248-0.063488-16.556032-0.161792c-0.864256-0.016384-1.732608-0.026624-2.596864-0.045056-5.238784-0.108544-10.448896-0.264192-15.634432-0.4608-0.987136-0.038912-1.972224-0.077824-2.957312-0.118784-5.23264-0.21504-10.440704-0.466944-15.613952-0.770048-0.632832-0.036864-1.261568-0.079872-1.892352-0.120832-5.154816-0.311296-10.28096-0.663552-15.372288-1.062912-0.38912-0.03072-0.782336-0.057344-1.173504-0.088064-5.206016-0.413696-10.369024-0.882688-15.505408-1.384448-0.84992-0.08192-1.69984-0.16384-2.545664-0.249856-5.019648-0.503808-10.002432-1.052672-14.948352-1.640448-0.786432-0.09216-1.570816-0.190464-2.3552-0.28672-5.113856-0.622592-10.196992-1.277952-15.228928-1.98656-0.155648-0.02048-0.309248-0.043008-0.464896-0.067584-5.074944-0.7168-10.100736-1.482752-15.087616-2.28352-0.487424-0.079872-0.976896-0.1536-1.462272-0.231424-4.890624-0.796672-9.730048-1.640448-14.532608-2.516992-0.708608-0.129024-1.415168-0.260096-2.11968-0.391168-4.794368-0.888832-9.547776-1.814528-14.249984-2.783232-0.464896-0.094208-0.925696-0.19456-1.390592-0.292864-9.791488-2.035712-19.369984-4.241408-28.725248-6.608896-0.456704-0.116736-0.913408-0.227328-1.368064-0.344064-4.53632-1.159168-9.015296-2.3552-13.441024-3.588096-0.509952-0.14336-1.017856-0.28672-1.52576-0.428032-4.503552-1.267712-8.955904-2.566144-13.340672-3.907584-0.11264-0.036864-0.223232-0.07168-0.33792-0.106496-4.564992-1.40288-9.068544-2.842624-13.500416-4.32128-0.0512-0.016384-0.1024-0.032768-0.151552-0.049152-4.286464-1.4336-8.497152-2.910208-12.654592-4.415488-0.23552-0.086016-0.48128-0.16384-0.7168-0.249856l0.026624 0c-81.7152-29.751296-137.476096-73.355264-149.643264-122.88L0 716.797952l0 122.88c0 82.675712 120.963072 152.63744 287.592448 176.003072l0 0c0.016384 0.002048 0.034816 0.004096 0.049152 0.006144 4.292608 0.602112 8.624128 1.161216 12.976128 1.701888 1.05472 0.129024 2.10944 0.258048 3.166208 0.385024 4.308992 0.518144 8.634368 1.01376 12.998656 1.470464 0.063488 0.006144 0.124928 0.014336 0.188416 0.02048 4.421632 0.4608 8.87808 0.876544 13.355008 1.271808 1.089536 0.096256 2.179072 0.190464 3.270656 0.282624 4.440064 0.374784 8.894464 0.72704 13.38368 1.038336 0.053248 0.004096 0.106496 0.008192 0.161792 0.012288 4.528128 0.311296 9.091072 0.577536 13.668352 0.821248 1.128448 0.06144 2.258944 0.120832 3.38944 0.176128 4.562944 0.22528 9.140224 0.43008 13.748224 0.587776 0.032768 0.002048 0.065536 0.004096 0.098304 0.004096 4.624384 0.159744 9.27744 0.270336 13.942784 0.360448 1.169408 0.022528 2.340864 0.043008 3.51232 0.059392 4.683776 0.069632 9.377792 0.120832 14.098432 0.120832s9.416704-0.049152 14.098432-0.120832c1.171456-0.018432 2.342912-0.038912 3.51232-0.059392 4.665344-0.090112 9.3184-0.200704 13.942784-0.360448 0.032768 0 0.065536-0.002048 0.098304-0.004096 4.608-0.157696 9.18528-0.362496 13.750272-0.587776 1.130496-0.055296 2.260992-0.114688 3.387392-0.176128 4.57728-0.243712 9.140224-0.509952 13.672448-0.821248 0.049152-0.004096 0.098304-0.008192 0.149504-0.012288 4.493312-0.309248 8.953856-0.663552 13.398016-1.038336 1.089536-0.09216 2.177024-0.186368 3.262464-0.282624 4.478976-0.395264 8.937472-0.811008 13.361152-1.271808 0.055296-0.006144 0.114688-0.012288 0.172032-0.018432 4.368384-0.456704 8.699904-0.954368 13.012992-1.472512 1.05472-0.126976 2.107392-0.253952 3.160064-0.385024 4.352-0.540672 8.685568-1.099776 12.980224-1.701888 0.016384-0.002048 0.034816-0.004096 0.049152-0.006144 0.95232-0.13312 1.8944-0.27648 2.844672-0.411648C531.677184 1013.583872 529.063936 1011.595264 526.710784 1009.242112z",
                "M1024 786.432l0-124.928-74.5984 0c-5.128192-18.432-12.464128-36.513792-21.714944-52.856832l53.315584-53.551104-88.612864-88.731648-53.051392 53.26848c-16.576512-9.385984-34.476032-16.859136-52.908032-21.99552L786.429952 421.888l-124.928 0 0 76.19584c-18.432 5.115904-35.95264 12.36992-52.056064 21.489664l-53.551104-53.325824-88.727552 88.614912 53.264384 53.784576C511.1808 624.990208 503.78752 643.072 498.655232 661.504L421.888 661.504l0 124.928 76.775424 0c5.126144 18.432 12.457984 35.76832 21.710848 52.107264l-53.321728 53.188608 88.610816 88.541184 53.784576-53.352448c16.10752 9.115648 33.624064 16.336896 52.056064 21.4528L661.504 1024l124.928 0 0-75.18208c18.432-5.136384 36.33152-12.552192 52.908032-21.93408l53.18656 53.31968 88.543232-88.610816-53.354496-53.05344c9.248768-16.340992 16.549888-33.675264 21.67808-52.107264L1024 786.432zM724.02944 851.048448c-70.596608 0-127.821824-57.219072-127.821824-127.821824 0-70.592512 57.225216-127.821824 127.821824-127.821824 70.598656 0 127.821824 57.229312 127.821824 127.821824C851.851264 793.827328 794.628096 851.048448 724.02944 851.048448z"
            ],
            collect : [// 164.8 164.8
                "M512 90.125c-233.007 0-421.875 59.036-421.875 131.836v105.469c0 72.8 188.868 131.836 421.875 131.836s421.875-59.036 421.875-131.836v-105.469c0-72.8-188.868-131.836-421.875-131.836z",
                "M512 538.367c-233.007 0-421.875-59.036-421.875-131.836v158.203c0 72.8 188.868 131.836 421.875 131.836s421.875-59.036 421.875-131.836v-158.203c0 72.8-188.868 131.836-421.875 131.836z",
                "M512 775.672c-233.007 0-421.875-59.036-421.875-131.836v158.203c0 72.8 188.868 131.836 421.875 131.836s421.875-59.036 421.875-131.836v-158.203c0 72.8-188.868 131.836-421.875 131.836z"
            ],
            data : [// 174.83 174.83
                "M932.48 903.389h-28.196V567.893c0-31.611-25.287-56.114-56.45-56.114H737.01c-31.723 0-56.504 25.121-56.504 56.114v335.496h-55.944V120.557c0-31.212-25.287-56.334-56.446-56.334H457.23c-31.66 0-56.446 25.229-56.446 56.334v782.832H344.84V343.721c0-30.823-25.287-55.721-56.45-55.721H177.512c-31.665 0-56.45 24.951-56.45 55.721v559.668H92.866c-15.105 0-27.748 12.532-27.748 27.972 0 14.993 12.42 27.972 27.748 27.972h839.56c15.159 0 27.802-12.532 27.802-27.972 0-14.993-12.42-27.972-27.748-27.972"
            ],
            check : [// 185.71 185.71
                "M506.821486 365.714286c-68.072229 0-124.785371 46.714514-141.1072 109.714286L36.571429 475.428571l0 73.142857 329.142857 0c16.321829 62.999771 73.034971 109.714286 141.1072 109.714286s124.785371-46.714514 141.1072-109.714286L987.428571 548.571429l0-73.142857L647.928686 475.428571C631.606857 412.4288 574.893714 365.714286 506.821486 365.714286zM506.821486 585.142857c-40.321829 0-73.142857-32.821029-73.142857-73.142857s32.821029-73.142857 73.142857-73.142857 73.142857 32.821029 73.142857 73.142857S547.143314 585.142857 506.821486 585.142857zM334.321371 694.857143c-68.072229 0-124.785371 46.714514-141.1072 109.714286L36.571429 804.571429l0 73.142857 156.642743 0c16.321829 62.999771 73.034971 109.714286 141.1072 109.714286s124.785371-46.714514 141.1072-109.714286l512 0 0-73.142857L475.428571 804.571429C459.106743 741.571657 402.3936 694.857143 334.321371 694.857143zM334.321371 914.285714c-40.321829 0-73.142857-32.821029-73.142857-73.142857s32.821029-73.142857 73.142857-73.142857 73.142857 32.821029 73.142857 73.142857S374.6432 914.285714 334.321371 914.285714zM475.428571 146.285714c-16.321829-62.999771-73.034971-109.714286-141.1072-109.714286s-124.785371 46.714514-141.1072 109.714286L36.571429 146.285714l0 73.142857 156.642743 0c16.321829 62.999771 73.034971 109.714286 141.1072 109.714286s124.785371-46.714514 141.1072-109.714286l512 0L987.428571 146.285714 475.428571 146.285714zM334.321371 256c-40.321829 0-73.142857-32.821029-73.142857-73.142857s32.821029-73.142857 73.142857-73.142857 73.142857 32.821029 73.142857 73.142857S374.6432 256 334.321371 256z"
            ],
            txt : [// 175 200
                "M903.340032 199.501824 760.496128 56.630272C729.529344 25.491456 667.998208 0 623.971328 0L144.038912 0c-44.04224 0-80.036864 35.981312-80.036864 80.007168l0 863.925248c0 44.0576 35.994624 80.067584 80.036864 80.067584l735.9232 0c44.041216 0 80.03584-36.009984 80.03584-80.067584L959.997952 335.985664C959.997952 291.991552 934.463488 230.547456 903.340032 199.501824L903.340032 199.501824zM703.993856 92.611584c4.342784 3.013632 8.101888 6.052864 11.342848 9.18528L858.243072 244.67456c3.15392 3.196928 6.10304 6.95808 9.222144 11.300864l-163.47136 0L703.993856 92.611584 703.993856 92.611584zM895.996928 943.932416c0 8.695808-7.402496 16.052224-16.034816 16.052224L144.038912 959.98464c-8.630272 0-16.036864-7.356416-16.036864-16.052224L128.002048 80.006144c0-8.628224 7.405568-16.02048 16.036864-16.02048l479.93344 0c4.871168 0 10.273792 0.61952 16.034816 1.709056l0 254.303232 254.239744 0c1.065984 5.73952 1.750016 11.236352 1.750016 15.986688L895.996928 943.932416 895.996928 943.932416zM292.506624 550.981632l154.013696 0 0 300.060672 130.944 0L577.46432 550.981632l154.036224 0 0-100.00384L292.506624 450.977792 292.506624 550.981632z"
            ],
            zip : [// 199.8 200
                "M904.311688 179.532468c-6.649351-6.137862-13.81019-12.787213-21.994006-20.459541-23.016983-20.971029-45.522478-41.942058-67.516483-61.89011-2.557443-2.045954-2.557443-2.045954-5.114885-4.603396-29.154845-26.085914-53.194805-47.568432-71.096903-62.913087-10.22977-8.695305-18.925075-15.344655-24.551449-19.948052-4.091908-3.068931-7.160839-5.114885-10.741259-6.649351-4.091908-2.045954-7.672328-3.068931-13.298701-3.068931-14.321678 0.511489-25.574426 11.764236-25.574426 26.085914v230.16983h230.169831l-25.574426-25.574425V998.425574l25.574426-25.574425h-664.935065c-42.453546 0-76.723277-34.26973-76.723277-76.723277V27.108891l-25.574426 25.574426h460.339661c14.321678 0 25.574426-11.252747 25.574425-25.574426s-11.252747-25.574426-25.574425-25.574425h-485.914086V896.127872c0 70.585415 57.286713 127.872128 127.872128 127.872128h690.50949V206.12987h-230.16983l25.574426 25.574426v-204.595405c0 13.81019-11.252747 24.551449-24.551449 25.062937-4.603397 0-7.160839-0.511489-9.718282-2.045954-0.511489 0 1.022977 0.511489 2.557443 1.534466 4.603397 3.58042 12.275724 9.206793 21.482517 17.390609 17.390609 14.833167 40.919081 35.804196 69.562438 61.378621 2.557443 2.045954 2.557443 2.045954 5.114885 4.603397 21.482517 19.436563 44.4995 40.407592 67.004995 61.378621 8.183816 7.160839 15.344655 14.321678 21.994006 20.459541 4.091908 3.58042 6.649351 6.137862 8.183816 7.672328 10.22977 9.718282 26.597403 9.206793 36.315685-1.022977 9.718282-10.22977 9.206793-26.597403-1.022978-36.315685-1.534466-1.022977-4.091908-3.58042-8.183816-7.672327zM102.297702 461.874126h-102.297702v434.765235h1022.977023v-434.765235h-869.53047v-0.511489h-51.148851v0.511489z m179.532468 317.122877h155.492507v40.407592h-216.35964v-32.735264l150.377622-217.382618h-149.354645v-40.919081h210.733267v31.712288l-150.889111 218.917083z m252.163836 40.407592h-50.125874v-291.036963h50.125874V819.404595z m112.527473-107.924076V819.404595h-50.637363v-291.036963h111.504495c32.735265 0 58.30969 8.695305 77.234766 25.574426s28.643357 39.384615 28.643356 67.004995c0 28.643357-9.206793 50.637363-28.131868 66.493506-18.925075 15.856144-45.010989 23.528472-78.769231 23.528472h-59.844155z m0-40.91908h60.867132c17.902098 0 31.712288-4.091908 40.919081-12.787213 9.206793-8.695305 14.321678-20.45954 14.321679-36.827173 0-15.856144-4.603397-28.131868-14.321679-37.85015-9.718282-9.206793-23.016983-14.321678-39.384615-14.321678h-61.89011v101.786214z"
            ]
        },
        filter : {
            shadow : {
                display : false,
                id : "svgShadowFilter"
            }
        },
		mouseEvent : {
			drag : true // 拖拽开启与关闭
		},
        callback : {
            // 缩放、平移后的回调函数，返回平移距离x、y和缩放比例k
            transform : function(info){
                // console.log(info.x + " " + info.y + " " + info.k)
            }
        }
    },
    tool : {
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
        // 绘图专用 ===================================================================================================
        ,addElement : function(container, element, attrObject){
            var selector = element;
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
    }
};