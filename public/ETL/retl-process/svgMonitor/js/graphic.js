var delay = 0;
function Graphic(svg, xmlDoc) {
	var thisGraph = this;
	thisGraph.rectW = 32;
	thisGraph.rectH = 32;
	thisGraph.name = ''; //job name
	thisGraph.description = '';
	thisGraph.item_id = ''; //job item_id  如果是新建的话  前端生成uuid
	thisGraph.jobNo = ''; //作业编号

	thisGraph.svg = svg;
	thisGraph.nodes = [];
	thisGraph.edges = [];

	thisGraph.canvas = { //画布大小管理
		_h: thisGraph.svg.attr('height') || $('#svgbox').height(),
		_w: thisGraph.svg.attr('width') || $('#svgbox').width()

		//悬浮工具按钮
	};thisGraph.tool_pointer = d3.select('#t-pointer');
	thisGraph.tool_liner = d3.select('#t-line');
	thisGraph.tool_save = d3.select('#t-save');
	//thisGraph.tool_import = d3.select('#t-import');  放在base中，防止代码污染。
	thisGraph.tool_zoom = d3.select('#t-zoom'); //缩放
	thisGraph.tool_zoomed = d3.select('#t-zoomed');

	//编辑节点弹窗的命名规则
	thisGraph.formbox = '#nodeformbox';
	thisGraph.forms = '#node_edit';

	//基本变量初始化完成，xmlDoc开始reappear
	if (xmlDoc && xmlDoc != '') {
		thisGraph.xmlDoc = xmlDoc;
		thisGraph.reappearXmlDoc();
		thisGraph.initCanvas();
	} else {
		thisGraph.xmlDoc = thisGraph.createXmlDoc();
	}

	//辅助状态变量
	thisGraph.state = {
		nodeFlag: false, //添加node
		lineFlag: false, //连线
		pointer: false, //指针释放、可进行拖拽node
		selectedEdge: null, //被选中的连线
		sNode: null, //连线源node
		tNode: null, //连线目标node

		selectedNodes: [], //1、框选实现多选所需属性  2、 被选中的node
		selectedMore: false,
		sel_startxy: [0, 0], //款选鼠标开始相对于svg的坐标

		nodesDragFlag: false, //节点是否被拖动

		copyNodes: []

		//mouseDownSvgFlag: true,    //辅助实现缩放：目的是去掉鼠标拖拽时（框选）的对zoom的影响,因为mousemove会触发zoom事件
	};

	//撤销恢复功能

	//绑定键盘事件
	d3.select(window).on('keydown', function () {
		thisGraph.keyDownSvg.call(thisGraph);
	});

	var defs = thisGraph.svg.append('defs');
	defs.append('marker') // green   markerUnits="strokeWidth"
	.attr('id', 'end-arrow-S').attr('refX', '29').attr('refY', '6').attr('markerWidth', '12').attr('markerHeight', '12').attr('orient', 'auto').attr('markerUnits', 'userSpaceOnUse').append('path').attr('fill', '#00a65a').attr('d', 'M 0 0 L 12 6 L 0 12 z');
	defs.append('marker') //  false
	.attr('id', 'end-arrow-F').attr('refX', '29').attr('refY', '6').attr('markerWidth', '12').attr('markerHeight', '12').attr('orient', 'auto').attr('markerUnits', 'userSpaceOnUse').append('path').attr('fill', '#dd4b39').attr('d', 'M 0 0 L 12 6 L 0 12 z');
	defs.append('marker') // blue
	.attr('id', 'end-arrow-N').attr('refX', '29').attr('refY', '6').attr('markerWidth', '12').attr('markerHeight', '12').attr('orient', 'auto').attr('markerUnits', 'userSpaceOnUse').append('path').attr('fill', '#0073b7').attr('d', 'M 0 0 L 12 6 L 0 12 z');
	defs.append('marker') //拖拽过程中的黑色箭头
	.attr('id', 'dragline-end-arrow').attr('viewBox', '0 0 10 10').attr('refX', '5').attr('refY', '5').attr('markerWidth', '5').attr('markerHeight', '5').attr('orient', 'auto').append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');
	defs.append('marker') // 灰色
	.attr('id', 'end-arrow-disabled').attr('refX', '29').attr('refY', '6').attr('markerWidth', '12').attr('markerHeight', '12').attr('orient', 'auto').attr('markerUnits', 'userSpaceOnUse').append('path').attr('fill', '#cccccc').attr('d', 'M 0 0 L 12 6 L 0 12 z');
	thisGraph.sel_rect = null;

	thisGraph.svgG = thisGraph.svg.append("g");

	thisGraph.dragLine = thisGraph.svgG.append('path').classed('s-path', true).classed('hidden', true).attr('stroke', 'black').attr('marker-end', 'url(#dragline-end-arrow)').attr('d', 'M0,0L0,0');

	thisGraph.paths = thisGraph.svgG.append('g').selectAll('g');
	thisGraph.circles = thisGraph.svgG.append('g').selectAll('g');

	thisGraph.drag = d3.behavior.drag().on('drag', function (args) {
		thisGraph.dragMove.call(thisGraph, args);
	}).on('dragend', function (args) {
		thisGraph.dragMoveEnd.call(thisGraph, args);
	});
	thisGraph.svg.on('mousedown', function (d) {
		thisGraph.mouseDownSvg.call(thisGraph, d);
	});
	thisGraph.svg.on('mousemove', function (d) {
		thisGraph.mouseMoveSvg.call(thisGraph, d);
	});
	thisGraph.svg.on('mouseup', function (d) {
		thisGraph.mouseUpSvg.call(thisGraph, d);
	});
	$(document).mouseup(function () {
		if (thisGraph.sel_rect) {
			thisGraph.removeMultiple();
		}
		var rects = d3.select('rect[_sel_rect]'); //鼠标出去svg  未能删除的框选rect
		if (rects.length) {
			rects.remove();
		}
	});

	//缩放
	var zoom = d3.behavior.zoom().scaleExtent([0.6, 1]).on('zoom', function () {
		if (!thisGraph.state.mouseDownSvgFlag) {
			thisGraph.zoomed.call(thisGraph);
		} else {
			return false;
		}
	});
	//.on()
	thisGraph.svg.call(zoom).on("dblclick.zoom", null);
	thisGraph.zoom = zoom;

	//工具按钮事件
	thisGraph.tool_pointer.on('click', function () {
		thisGraph.state.pointer = true;
		thisGraph.state.lineFlag = false;
		thisGraph.svg.classed('s-svg-cursor-liner', false);
	});
	thisGraph.tool_liner.on('click', function () {
		thisGraph.state.lineFlag = true;
		thisGraph.state.pointer = false;
		thisGraph.svg.classed('s-svg-cursor-liner', true);
	});
	thisGraph.tool_save.on('click', function () {
		//保存工作流
		thisGraph.state.lineFlag = false;
		thisGraph.svg.classed('s-svg-cursor-liner', false);
		$('#jf_win_newJob').window('open');
		$('#jf_jobName_input').val(thisGraph.name);
		$('#jf_jobDe_input').val(thisGraph.description);
		$('#jf_jobId_input').val(thisGraph.jobNo);
		$('#job_item_id').val(thisGraph.item_id);
		$('#folderId_input').combotree('clear');
		$('#folderId_input').combotree({ //加载文件夹信息 
			required: true
		});
		var folderId = GetQueryString("folderId");
		$("#folderId").val(folderId);
		if (folderId != null && folderId != '') {
			$('#folderId_input').combotree('setValue', folderId);
		}
	});
	thisGraph.tool_zoom.on('click', function () {
		//画布增大
		thisGraph.svg.classed('s-svg-cursor-liner', false);
		var _w = thisGraph.svg.attr('width') || $('#svgbox').width();
		_w = parseInt(_w) + 50;
		thisGraph.svg.attr('width', _w);
	});
	thisGraph.tool_zoomed.on('click', function () {
		thisGraph.svg.classed('s-svg-cursor-liner', false);
		thisGraph.svgG.transition().duration(800).attr('transform', 'translate(1,0)');
		thisGraph.zoom.translate([1, 0]);
		thisGraph.zoom.scale();
	});
	// 用于回显所属文件夹信息
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);return null;
	}
	//解绑右键菜单事件
	thisGraph.rMenu = {
		pathM: $('#pathM'),
		//svgM : $('#svgM'),   画布右键菜单去掉
		nodeM: $('#nodeM'),
		title: $('#title'),
		data: null
	};
	$('#svgbox').bind("contextmenu", function (e) {
		//画布右键菜单改成点击pionter图标的功能
		return false;
	});

	$('#nodeM_copy').click(function () {
		//复制
		if (thisGraph.state.selectedNodes.length) {
			var nodes = thisGraph.state.selectedNodes;
			thisGraph.state.copyNodes = [];
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i].type != 'S') {
					thisGraph.state.copyNodes.push(nodes[i]);
				}
			}
			thisGraph.pastNode();
		}
	});
	$('#nodeM_edit').click(function () {});
};

Graphic.prototype.update = function () {
	//	console.log('更新');
	var thisGraph = this;

	//更新node：update已经存在，circles是所有node的最外层g元素
	thisGraph.circles = thisGraph.circles.data(thisGraph.nodes, function (d) {
		return d.id;
	});
	thisGraph.circles.attr('transform', function (d) {
		return "translate(" + d.x + "," + d.y + ")";
	});
	thisGraph.circles.selectAll('text').text(function (d) {
		//console.log(d.name);
		return d.name;
	});
	var rectshas = thisGraph.circles.selectAll('rect');
	rectshas.each(function (d) {
		var flag = d.execute_flag || 'U';
		var color = '';
		if (flag == 'B' || flag == 'I') {
			color = 's-rect-red';
		} else if (flag == 'S') {
			color = 's-rect-green';
		} else if (flag == 'A' || flag == 'F') {
			color = 's-rect-yellow';
		} else if (flag == 'R' || flag == 'E') {
			color = 's-rect-blue1';
		}
		//		console.log(color);
		if (color != '') {
			d3.select(this).classed(color, true);
		}
	});

	//更新新增的node
	var addCircles_g = thisGraph.circles.enter().append('g').attr('id', function (d) {
		return d.id;
	}).attr('transform', function (d) {
		return "translate(" + d.x + "," + d.y + ")";
	});
	//为node添加拖拽事件
	addCircles_g.on('mousedown', function (d) {
		//d3.event.stopPropagation();

		thisGraph.mouseDownNode.call(thisGraph, d3.select(this), d);
	}).on('click', function (d) {
		d3.event.stopPropagation();
		thisGraph.clickNode.call(thisGraph, d3.select(this), d);
	}).on('mouseup', function (d) {
		//d3.event.stopPropagation();
		thisGraph.mouseUpNode.call(thisGraph, d3.select(this), d);
	}).call(thisGraph.drag).on('dblclick', function (d) {
		// thisGraph.nodeDblclick.call(thisGraph, d);
	}).on('contextmenu', function (d) {}).on('mouseenter', function (e) {
		var d = e;
		var e = window.event || e;
		if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
			e = arguments.callee.caller.arguments[0];
		}
		var de = e.fromElement || e.relatedTarget;
		delay = 0;
		if (document.all) {
			//判断浏览器是否为IE,如果存在document.all则为IE
			if (!this.contains(de)) {
				// 判断调用onmouseover的对象(this)是否包含自身或子级，如果包含，则不执行
				thisGraph.rightmenu1.call(thisGraph, thisGraph.rMenu.title, d);
				if (d.name) {
					$("#title_name").html(d.name);
				} else {
					$("#title_name").html(" ");
				};
				if (d.task_no) {
					$("#title_number").html(d.task_no);
				} else {
					$("#title_number").html(" ");
				};
				if (d.task_name) {
					$("#task_name").html(d.task_name);
				} else {
					$("#task_name").html(" ");
				};
				if (d.start_time) {
					$("#title_time").html(d.start_time);
				} else {
					$("#title_time").html(" ");
				};
				if (d.end_time) {
					$("#end_time").html(d.end_time);
				} else {
					$("#end_time").html(" ");
				};
				if (d.time_length) {
					$("#title_when").html(d.time_length);
				} else {
					$("#title_when").html(" ");
				};
				if (d.result_mess) {
					$("#title_return").html(d.result_mess);
				} else {
					$("#title_return").html(" ");
				};
				if (d.type == 5 || d.type == 2 || d.type == 1 || d.type == 3 || d.type == 4 || d.type == 6 || d.type == 8 || d.type == 10 || d.type == 9 || d.type == 11) {
					$("#task_names").hide();
					$("#task_names1").show();
				} else {
					$("#task_names1").hide();
					$("#task_names").show();
				};
				if (d.execute_flag) {
					if (d.execute_flag == 'S') {
						$("#title_state").html("Succeed");
					} else if (d.execute_flag == 'F') {
						$("#title_state").html("Error completed");
					} else if (d.execute_flag == 'B') {
						$("#title_state").html("Error Interrupt");
					} else if (d.execute_flag == 'I') {
						$("#title_state").html("Manual Interrupt");
					} else if (d.execute_flag == 'E') {
						$("#title_state").html("Interrupt Executing");
					} else if (d.execute_flag == 'R') {
						$("#title_state").html("Executing");
					} else if (d.execute_flag == 'A') {
						$("#title_state").html("Judgement is false.");
					} else if (d.execute_flag == 'U') {
						$("#title_state").html("unexecuted");
					}
				}
			}
		} else {
			//标准浏览器下的方法
			var de = e.relatedTarget || e.fromElement;
			if (de instanceof Node) {
				var reg = this.compareDocumentPosition(de);
			} else {
				var reg = 0;
			}
			if (!(reg == 20 || reg == 0)) {
				thisGraph.rightmenu1.call(thisGraph, thisGraph.rMenu.title, d);
				if (d.name) {
					$("#title_name").html(d.name);
				} else {
					$("#title_name").html(" ");
				};
				if (d.task_no) {
					$("#title_number").html(d.task_no);
				} else {
					$("#title_number").html(" ");
				};
				if (d.task_name) {
					$("#task_name").html(d.task_name);
				} else {
					$("#task_name").html(" ");
				};
				if (d.time_length) {
					$("#title_when").html(d.time_length);
				} else {
					$("#title_when").html(" ");
				};
				if (d.result_mess) {
					$("#title_return").html(d.result_mess);
				} else {
					$("#title_return").html(" ");
				};
				if (d.type == 5 || d.type == 2 || d.type == 1 || d.type == 3 || d.type == 4 || d.type == 6 || d.type == 8 || d.type == 10 || d.type == 9 || d.type == 11) {
					$("#task_names").hide();
					$("#task_names1").show();
				} else {
					$("#task_names1").hide();
					$("#task_names").show();
				};
				if (d.execute_flag) {
					if (d.execute_flag == 'S') {
						$("#title_state").html("Succeed");
					} else if (d.execute_flag == 'F') {
						$("#title_state").html("Error completed");
					} else if (d.execute_flag == 'B') {
						$("#title_state").html("Error Interrupt");
					} else if (d.execute_flag == 'I') {
						$("#title_state").html("Manual Interrupt");
					} else if (d.execute_flag == 'E') {
						$("#title_state").html("Interrupt Executing");
					} else if (d.execute_flag == 'R') {
						$("#title_state").html("Executing");
					} else if (d.execute_flag == 'A') {
						$("#title_state").html("Judgement is false");
					} else if (d.execute_flag == 'U') {
						$("#title_state").html("unexecuted");
					}
				}
			}
		};
	}).on('mouseleave', function (e) {
		e = window.event || e;
		delay = 1;
		if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
			e = arguments.callee.caller.arguments[0];
		}
		var de = e.toElement || e.relatedTarget;

		if (document.all) {
			//判断浏览器是否为IE,如果存在document.all则为IE

			if (!this.contains(de)) {
				// 判断调用onmouseover的对象(this)是否包含自身或子级，如果包含，则不执行
				$("#title").hide();
				$(".menu-shadow").hide();
			}
		} else {
			//标准浏览器下的方法
			if (de instanceof Node) {
				var reg = this.compareDocumentPosition(de);
			} else {
				var reg = 0;
			}
			if (!(reg == 20 || reg == 0)) {

				$("#title").hide();
				$(".menu-shadow").hide();
			}
		}
	});
	//为新增的node添加圆角矩形边框
	var rects = addCircles_g.append('rect').classed('s-rect', true).attr('width', thisGraph.rectW).attr('height', thisGraph.rectH).attr('rx', 5).attr('ry', 5);

	rects.each(function (d) {
		var flag = d.execute_flag || 'U';
		var color = '';
		if (flag == 'B' || flag == 'I' || flag == 'E') {
			color = 's-rect-red';
		} else if (flag == 'S') {
			color = 's-rect-green';
		} else if (flag == 'A' || flag == 'F') {
			color = 's-rect-yellow';
		} else if (flag == 'R') {
			color = 's-rect-blue1';
		}
		if (color != '') {
			d3.select(this).classed(color, true);
		}
	});

	addCircles_g.append('text').classed('s-text', true).attr('x', thisGraph.rectW / 2).attr('y', 15 + thisGraph.rectH).attr('text-anchor', 'middle').text(function (d) {
		var i = thisGraph.getNewOrder(d.type, d.title);
		d.name = d.name == '' || null ? i : d.name;

		return d.name;
	});
	addCircles_g.append('image').attr('width', thisGraph.rectH - 8).attr('height', thisGraph.rectH - 8).attr('x', 4).attr('y', 4).attr("xlink:href", function (d) {
		return 'svg/images/icon_type_' + d.type + '.png';
	});
	thisGraph.circles.exit().remove();

	//更新连线
	thisGraph.paths = thisGraph.paths.data(thisGraph.edges, function (d) {
		return String(d.source.id) + "+" + String(d.target.id);
	});

	//更新已经存（发生了改变的）连线的path 的箭头以及线、disabled
	thisGraph.paths.selectAll('path').attr('marker-end', function (d) {
		//console.log('url(#end-arrow-'+ d.conditional +')');
		if (d.enabled == 'Y') {
			return 'url(' + location.href + '#end-arrow-' + d.conditional + ')';
		} else {
			return 'url(' + location.href + '#end-arrow-disabled)';
		}
	}).classed('s-path', true).attr('stroke', function (d) {
		if (d.enabled == 'Y') {
			switch (d.conditional) {
				case 'S':
					return '#00a65a';
				case 'F':
					return '#dd4b39';
				case 'N':
					return '#0073b7';
			}
		} else {
			return '#cccccc';
		}
	}).attr('d', function (d) {
		return 'M' + (d.source.x + thisGraph.rectW / 2) + ',' + (d.source.y + thisGraph.rectH / 2) + 'L' + (d.target.x + thisGraph.rectW / 2) + "," + (d.target.y + thisGraph.rectH / 2);
	});
	//更新已经存在（发生了改变的）连线的true  or  false
	thisGraph.paths.selectAll('image').attr("xlink:href", function (d) {
		return 'svg/images/' + d.conditional + '.png';
	}).attr('x', function (d) {
		return (d.source.x + d.target.x + thisGraph.rectW) / 2 - 8;
	}).attr('y', function (d) {
		return (d.target.y + d.source.y + thisGraph.rectH) / 2 - 8;
	});
	//添加新的path及path  true or false									
	var addPaths_g = thisGraph.paths.enter().append('g');
	var addPaths = addPaths_g.append('path').attr('marker-end', function (d) {
		if (d.enabled == 'Y') {
			return 'url(' + location.href + '#end-arrow-' + d.conditional + ')';
		} else {
			return 'url(' + location.href + '#end-arrow-disabled)';
		}
	}).classed('s-path', true).attr('stroke', function (d) {
		if (d.enabled == 'Y') {
			switch (d.conditional) {
				case 'S':
					return '#00a65a';
				case 'F':
					return '#dd4b39';
				case 'N':
					return '#0073b7';
			}
		} else {
			return '#cccccc';
		}
	}).attr('d', function (d) {
		return 'M' + (d.source.x + thisGraph.rectW / 2) + ',' + (d.source.y + thisGraph.rectH / 2) + 'L' + (d.target.x + thisGraph.rectW / 2) + "," + (d.target.y + thisGraph.rectH / 2);
	});

	var addPathsImg = addPaths_g.append('image').attr("xlink:href", function (d) {
		return 'svg/images/' + d.conditional + '.png';
	}).attr('x', function (d) {
		return (d.source.x + d.target.x + thisGraph.rectW) / 2 - 8;
	}).attr('y', function (d) {
		return (d.target.y + d.source.y + thisGraph.rectH) / 2 - 8;
	}).attr('width', 16).attr('height', 16);

	addPathsImg.on('click', function (d) {//点击pathimg  选中path并更改path   true   false
	}).on('contextmenu', function (d) {//pathimg右键菜单  选中path并更改path   true   false
	});
	addPaths.on('click', function (d) {});

	thisGraph.paths.exit().remove();

	//给更新后的节点添加事件：右键菜单事件
};

Graphic.prototype.clickNode = function (node, d) {
	d3.event.stopPropagation();
	var thisGraph = this;
	thisGraph.selectNode(node, d);
};

Graphic.prototype.selectNode = function (node, d) {
	//	console.log('select node');
	var thisGraph = this;
	thisGraph.removePathFous();
	if (!thisGraph.state.nodesDragFlag) {
		thisGraph.state.selectedNodes = [];
		thisGraph.state.selectedNodes[0] = d;
		node.classed('s-selected', true);
		thisGraph.circles.filter(function (cd) {
			return cd !== d;
		}).classed('s-selected', false);
	}
	thisGraph.state.nodesDragFlag = false;
};

Graphic.prototype.dragMove = function (d) {
	var thisGraph = this;
	if (thisGraph.state.lineFlag) {
		//console.log('chu fa drag');
		thisGraph.dragLine.attr('d', 'M' + (d.x + thisGraph.rectW / 2) + ',' + (d.y + thisGraph.rectH / 2) + 'L' + d3.event.x + ',' + d3.event.y);
	} else if (thisGraph.state.pointer) {
		//console.log('drag chu fa'); 
		if (thisGraph.state.selectedEdge) {
			thisGraph.removePathFous();
		}
		if (thisGraph.state.selectedNodes.length > 1) {
			if (d) {
				var nodes = thisGraph.state.selectedNodes;
				var len = nodes.length;
				var max_xy = [0, 0];
				for (var i = 0; i < len; i++) {
					nodes[i].x += d3.event.dx;
					nodes[i].y += d3.event.dy;
					if (nodes[i].x < 15) {
						nodes[i].x = 15;
					}
					if (nodes[i].y < 0) {
						nodes[i].y = 0;
					}
					max_xy[0] = Math.max(max_xy[0], nodes[i].x);
					max_xy[1] = Math.max(max_xy[1], nodes[i].y);
				}
				if (max_xy[0] > thisGraph.canvas._w - thisGraph.rectW) {
					thisGraph.canvas._w = max_xy[0] + thisGraph.rectW;
					thisGraph.svg.attr('width', thisGraph.canvas._w);
					$('#svgbox').scrollLeft(thisGraph.canvas._w);
				}
				if (max_xy[1] > thisGraph.canvas._h - thisGraph.rectH) {
					thisGraph.canvas._h = max_xy[1] + thisGraph.rectH;
					thisGraph.svg.attr('height', thisGraph.canvas._h);
					$('#svgbox').scrollTop(thisGraph.canvas._h);
				}
				thisGraph.state.nodesDragFlag = true;
				thisGraph.update();
			}
		} else {
			d.x += d3.event.dx;
			d.y += d3.event.dy;
			if (d.x < 0) {
				d.x = 0;
			} else if (d.x > thisGraph.canvas._w - thisGraph.rectW) {
				thisGraph.canvas._w = d.x + thisGraph.rectW;
				thisGraph.svg.attr('width', thisGraph.canvas._w);
				$('#svgbox').scrollLeft(thisGraph.canvas._w);
			}
			if (d.y < 0) {
				d.y = 0;
			} else if (d.y > thisGraph.canvas._h - thisGraph.rectH) {
				thisGraph.canvas._h = d.y + thisGraph.rectH;
				thisGraph.svg.attr('height', thisGraph.canvas._h);
				$('#svgbox').scrollTop(thisGraph.canvas._h);
			}
			thisGraph.update();
		}
	}
};
Graphic.prototype.dragMoveEnd = function (d) {
	var thisGraph = this;
};
Graphic.prototype.mouseDownNode = function (node, d) {
	d3.event.stopPropagation();
	var thisGraph = this;
	if (thisGraph.state.lineFlag) {
		//		console.log('source');
		thisGraph.state.sNode = d;
		thisGraph.dragLine.classed('hidden', false).attr('d', 'M' + (d.x + thisGraph.rectW / 2) + ',' + (d.y + thisGraph.rectH / 2) + 'L' + (d.x + thisGraph.rectW / 2) + ',' + (d.y + thisGraph.rectH / 2));
	}
};

Graphic.prototype.mouseUpNode = function (node, d) {
	//	console.log('mouseupnode');
	var thisGraph = this;
	if (thisGraph.state.lineFlag) {
		if (d.type == 'S') {
			$.messager.alert('Sorry', 'Start node can only be used as the start of a job!');
		} else {
			thisGraph.state.tNode = d;
			thisGraph.dragLine.classed("hidden", true);
			if (thisGraph.state.sNode && thisGraph.state.sNode !== thisGraph.state.tNode) {
				var edges = thisGraph.edges,
				    sNode = thisGraph.state.sNode,
				    tNode = thisGraph.state.tNode;
				var isRepeat = false;
				for (var i = 0; i < edges.length; i++) {
					var hop = edges[i];
					if ((sNode == hop.source || sNode == hop.target) && (tNode == hop.source || tNode == hop.target)) {
						isRepeat = true;
						//						console.log('重复');
						break;
					}
				}

				if (!isRepeat) {
					var enableds = 'Y',
					    conditionals = 'S';
					if (thisGraph.state.sNode.type == 'S') {
						conditionals = 'N';
					}
					thisGraph.edges.push({
						source: thisGraph.state.sNode,
						target: thisGraph.state.tNode,
						enabled: enableds,
						conditional: conditionals
					});
					thisGraph.update();
					thisGraph.state.sNode = null;
				}
				thisGraph.state.tNode = null;
			}
		}
	}
};

Graphic.prototype.removeNodeFous = function () {
	var thisGraph = this;
	thisGraph.state.selectedNodes = [];
	thisGraph.state.sNode = null;
	thisGraph.circles.classed('s-selected', false);
};
Graphic.prototype.removePathFous = function () {
	var thisGraph = this;
	thisGraph.state.selectedEdge = null;
	thisGraph.paths.selectAll('path').classed('s-selected-path', false);
};

//path单击 更改  ture  or  false
Graphic.prototype.clickPathImg = function (d) {
	//	console.log('clickPathImg');
	var thisGraph = this;
	//	console.log(d);
	if (d.source.type == 'S' || d.target.type == 'S' || d.source.type == 'L') {
		return false;
	}
	thisGraph.update();

	//console.log(thisGraph.edges);
};
Graphic.prototype.selectPath = function (path, d) {
	var thisGraph = this;
	thisGraph.removeNodeFous();
	thisGraph.state.selectedEdge = d;

	path.classed('s-selected-path', true);
	thisGraph.paths.selectAll('path').filter(function (p) {
		return p !== d;
	}).classed('s-selected-path', false);
};
//点击path置灰
Graphic.prototype.clickPath = function (path, d) {
	var thisGraph = this;
	thisGraph.removeNodeFous();
	thisGraph.state.selectedEdge = d;

	d.enabled = d.enabled == 'Y' ? 'N' : 'Y';
	thisGraph.update();
};

Graphic.prototype.keyDownSvg = function () {
	var thisGraph = this;
	switch (d3.event.keyCode) {}
};

Graphic.prototype.pastNode = function () {
	var thisGraph = this;
	var _copynodes = thisGraph.state.copyNodes;
	thisGraph.removeNodeFous();
	if (_copynodes.length) {

		$.each(_copynodes, function (index) {
			var thisnode = _copynodes[index];
			var newnode = {
				id: thisGraph.getNodeId(),
				type: thisnode.type,
				title: thisnode.title,
				name: thisGraph.getNewOrder(thisnode.type, thisnode.title),
				x: thisnode.x + 30,
				y: thisnode.y + 30
			};
			thisGraph.nodes.push(newnode);
			thisGraph.state.selectedNodes.push(newnode);
		});
		thisGraph.update();
		$.each(thisGraph.state.selectedNodes, function (index) {
			var _n = thisGraph.state.selectedNodes[index];
			thisGraph.circles.filter(function (cd) {
				return cd.id == _n.id;
			}).classed('s-selected', true);
		});
	}
};
Graphic.prototype.selectNodesStyle = function (addNodes) {
	var thisGraph = this;
	thisGraph.update();
	thisGraph.state.selectedNodes = addNodes;
	if (addNodes.length) {
		$.each(thisGraph.state.selectedNodes, function (index) {
			var _n = thisGraph.state.selectedNodes[index];
			thisGraph.circles.filter(function (cd) {
				return cd.id == _n.id;
			}).classed('s-selected', true);
		});
	}
};

Graphic.prototype.mouseDownSvg = function () {
	var thisGraph = this;
	thisGraph.removeNodeFous();
	thisGraph.removePathFous();

	//thisGraph.state.mouseDownSvgFlag = true;  

	//	console.log('mousedownsvg，框选发生');
	//console.log(thisGraph.nodes);
	if (!thisGraph.state.lineFlag) {
		thisGraph.state.selectedMore = true;
		thisGraph.state.sel_startxy = d3.mouse(thisGraph.svg.node());
		thisGraph.sel_rect = thisGraph.svgG.append('rect').classed('s-sel-rect', true).attr('width', '0').attr('height', '0').attr('_sel_rect', '');
	}
};
Graphic.prototype.mouseMoveSvg = function () {
	var thisGraph = this;
};
Graphic.prototype.mouseUpSvg = function (d) {
	var thisGraph = this;
	if (thisGraph.state.lineFlag) {
		thisGraph.dragLine.classed("hidden", true);
	} else if (!thisGraph.state.lineFlag && thisGraph.state.selectedMore) {
		var sr_x = thisGraph.sel_rect.attr('x'),
		    sr_y = thisGraph.sel_rect.attr('y');
		var sr_wx = parseInt(sr_x) + parseInt(thisGraph.sel_rect.attr('width')),
		    sr_hy = parseInt(sr_y) + parseInt(thisGraph.sel_rect.attr('height'));
		var _nodes = thisGraph.nodes;
		for (var i = 0; i < _nodes.length; i++) {
			var _n = _nodes[i];
			var n_x = _n.x,
			    n_y = _n.y;
			var n_wx = n_x + thisGraph.rectW,
			    n_hy = n_y + thisGraph.rectH;
			if (n_x < sr_wx && n_wx > sr_x && n_hy > sr_y && n_y < sr_hy) {
				var an = thisGraph.circles.filter(function (cd) {
					return cd.id == _n.id;
				});
				an.classed('s-selected', true);
				thisGraph.state.selectedNodes.push(_n);
			}
		}
		thisGraph.removeMultiple();

		thisGraph.state.nodesDragFlag = false;
	}
};

Graphic.prototype.removeMultiple = function () {
	var thisGraph = this;
	thisGraph.state.selectedMore = false;
	if (thisGraph.sel_rect) {
		thisGraph.sel_rect.remove();
		thisGraph.sel_rect = null;
	}
};

Graphic.prototype.getNodeId = function () {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	});
	return uuid;
};

Graphic.prototype.getJobItemId = function () {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	});
	uuid = uuid.replace(new RegExp("-", "gm"), "");
	return uuid;
};

Graphic.prototype.zoomed = function () {
	//console.log('缩放中。。。');
	var thisGraph = this;
	thisGraph.svgG.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
};
// 连线右键菜单的显示与隐藏
//如果传入的xmlDoc为空，新建一个完整的xmlDoc
Graphic.prototype.createXmlDoc = function () {
	var thisGraph = this;
	thisGraph.item_id = thisGraph.getJobItemId();
	var ojob = {
		name: thisGraph.name || '', //新建作业+作业计数器  （job页面产生，接口传入）
		type: 'S',
		item_id: thisGraph.item_id,
		description: '',
		version: '',
		status: '',
		parallelism_count: '',
		canvas_h: thisGraph.canvas._h,
		canvas_w: thisGraph.canvas._w,

		nodes: thisGraph.nodes,
		edges: thisGraph.edges
	};

	var xmlDoc;
	// try //Internet Explorer
	// {
	// 	xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	// }
	// catch (e) {
	try //Firefox, Mozilla, Opera, etc.
	{
		xmlDoc = document.implementation.createDocument("", "", null);
	} catch (e) {
		alert(e.message);
	}
	// }
	var newPI = xmlDoc.createProcessingInstruction("xml", 'version=\"1.0\" encoding=\"utf-8\"');
	xmlDoc.appendChild(newPI);

	var job = xmlDoc.createElement("job");
	var j_name = xmlDoc.createElement("name");
	var j_type = xmlDoc.createElement("type");
	var j_item_id = xmlDoc.createElement("item_id");
	var j_description = xmlDoc.createElement("description");
	var j_version = xmlDoc.createElement("version");
	var j_status = xmlDoc.createElement("status");
	var j_parallelism_count = xmlDoc.createElement("parallelism_count");
	var j_canvas_w = xmlDoc.createElement("canvas_w");
	var j_canvas_h = xmlDoc.createElement("canvas_h");
	var j_entries = xmlDoc.createElement("entries");
	var j_hops = xmlDoc.createElement("hops");

	var t_name = xmlDoc.createTextNode(ojob.name);
	var t_type = xmlDoc.createTextNode(ojob.type);
	var t_item_id = xmlDoc.createTextNode(ojob.item_id);
	var t_description = xmlDoc.createTextNode(ojob.description);
	var t_version = xmlDoc.createTextNode(ojob.version);
	var t_status = xmlDoc.createTextNode(ojob.status);
	var t_parallelism_count = xmlDoc.createTextNode(ojob.parallelism_count);
	var t_canvas_w = xmlDoc.createTextNode(ojob.canvas_w);
	var t_canvas_h = xmlDoc.createTextNode(ojob.canvas_h);

	j_name.appendChild(t_name);
	j_type.appendChild(t_type);
	j_item_id.appendChild(t_item_id);
	j_description.appendChild(t_description);
	j_version.appendChild(t_version);
	j_status.appendChild(t_status);
	j_parallelism_count.appendChild(t_parallelism_count);
	j_canvas_w.appendChild(t_canvas_w);
	j_canvas_h.appendChild(t_canvas_h);

	job.appendChild(j_name);
	job.appendChild(j_type);
	job.appendChild(j_item_id);
	job.appendChild(j_description);
	job.appendChild(j_version);
	job.appendChild(j_status);
	job.appendChild(j_parallelism_count);
	job.appendChild(j_canvas_w);
	job.appendChild(j_canvas_h);
	job.appendChild(j_entries);
	job.appendChild(j_hops);

	xmlDoc.appendChild(job);

	//console.log(xmlDoc); 
	var oSerializer = new XMLSerializer();
	var sXML = oSerializer.serializeToString(xmlDoc);
	//console.log(sXML);
	return sXML;
};
//更新job的xmlDoc
Graphic.prototype.updateXmlDoc = function () {
	var thisGraph = this;

	var xmlDoc = thisGraph.getXmlDocs(thisGraph.xmlDoc);
	//	console.log(xmlDoc);
	var ojob = {
		name: thisGraph.name,
		type: 'S',
		item_id: thisGraph.item_id,
		description: thisGraph.description,
		version: '',
		status: '',
		parallelism_count: '',
		canvas_h: thisGraph.canvas._h,
		canvas_w: thisGraph.canvas._w,
		nodes: thisGraph.nodes,
		edges: thisGraph.edges
	};
	//console.log(thisGraph.xmlDoc);

	var xml_na = xmlDoc.getElementsByTagName("name")[0];
	if (xml_na.childNodes[0]) {
		xml_na.childNodes[0].nodeValue = ojob.name;
	} else {
		var t_name = xmlDoc.createTextNode(ojob.name);
		xml_na.appendChild(t_name);
	}
	var xml_des = xmlDoc.getElementsByTagName("description")[0];
	if (xml_des.childNodes[0]) {
		xml_des.childNodes[0].nodeValue = ojob.description;
	} else {
		var t_description = xmlDoc.createTextNode(ojob.description);
		xml_des.appendChild(t_description);
	}

	xmlDoc.getElementsByTagName("canvas_h")[0].childNodes[0].nodeValue = ojob.canvas_h;
	xmlDoc.getElementsByTagName("canvas_w")[0].childNodes[0].nodeValue = ojob.canvas_w;

	var entries = xmlDoc.getElementsByTagName('entries')[0];
	xmlDoc.documentElement.removeChild(entries);
	var hops = xmlDoc.getElementsByTagName('hops')[0];
	xmlDoc.documentElement.removeChild(hops);

	var j_entries = xmlDoc.createElement("entries");
	var j_hops = xmlDoc.createElement("hops");

	for (var i = 0; i < ojob.nodes.length; i++) {
		var node = ojob.nodes[i];

		var entry = xmlDoc.createElement('entry');
		var name = xmlDoc.createElement('name');
		var type = xmlDoc.createElement('type');
		var title = xmlDoc.createElement('title');
		var xloc = xmlDoc.createElement('xloc');
		var yloc = xmlDoc.createElement('yloc');
		var item_id;

		var t_name = xmlDoc.createTextNode(node.name);
		var t_type = xmlDoc.createTextNode(node.type);
		var t_title = xmlDoc.createTextNode(node.title);
		var t_xloc = xmlDoc.createTextNode(node.x);
		var t_yloc = xmlDoc.createTextNode(node.y);
		var t_item_id = null;

		name.appendChild(t_name);
		type.appendChild(t_type);
		title.appendChild(t_title);
		xloc.appendChild(t_xloc);
		yloc.appendChild(t_yloc);

		entry.appendChild(name);
		entry.appendChild(type);
		entry.appendChild(title);
		entry.appendChild(xloc);
		entry.appendChild(yloc);

		if (node.type == 'L') {
			var lock = xmlDoc.createElement('lock-option');
			var t_lock = xmlDoc.createTextNode(node.lock);
			lock.appendChild(t_lock);
			entry.appendChild(lock);
		} else if (node.type == 'F') {
			var file_names = xmlDoc.createElement('file-name');
			var t_file_names = xmlDoc.createTextNode(node.file_name);
			file_names.appendChild(t_file_names);
			entry.appendChild(file_names);
		} else if (node.type == 'C') {
			var variable_name = xmlDoc.createElement('variable-name');
			var t_variable_name = xmlDoc.createTextNode(node.variable_name);
			variable_name.appendChild(t_variable_name);

			var variable_type = xmlDoc.createElement('variable-type');
			var t_variable_type = xmlDoc.createTextNode(node.variable_type);
			variable_type.appendChild(t_variable_type);

			var variable_value = xmlDoc.createElement('value');
			var t_variable_value = xmlDoc.createTextNode(node.variable_value);
			variable_value.appendChild(t_variable_value);

			var success_condition = xmlDoc.createElement('success-condition');
			var t_success_condition = xmlDoc.createTextNode(node.success_condition);
			success_condition.appendChild(t_success_condition);

			var operation = xmlDoc.createElement('operation');
			if (node.operation) {
				var t_operation = xmlDoc.createTextNode(node.operation);
				operation.appendChild(t_operation);
			}

			entry.appendChild(variable_name);
			entry.appendChild(variable_type);
			entry.appendChild(variable_value);
			entry.appendChild(success_condition);
			entry.appendChild(operation);
		} else if (node.type == 'I') {
			var return_messages = xmlDoc.createElement('return-message');
			var t_return_messages = xmlDoc.createTextNode(node.return_message);
			return_messages.appendChild(t_return_messages);
			entry.appendChild(return_messages);
		} else if (node.type == 'G') {
			var wait_times = xmlDoc.createElement('wait-time');
			var t_wait_time = xmlDoc.createTextNode(node.wait_time);
			wait_times.appendChild(t_wait_time);

			var time_units = xmlDoc.createElement('time-unit');
			var t_time_unit = xmlDoc.createTextNode(node.time_unit);
			time_units.appendChild(t_time_unit);

			entry.appendChild(wait_times);
			entry.appendChild(time_units);
		} else {
			item_id = xmlDoc.createElement('item_id');
			t_item_id = xmlDoc.createTextNode(node.item_id);
			item_id.appendChild(t_item_id);
			entry.appendChild(item_id);
		}

		j_entries.appendChild(entry);
	}
	for (var j = 0; j < ojob.edges.length; j++) {
		var edge = ojob.edges[j];

		var hop = xmlDoc.createElement('hop');
		var from = xmlDoc.createElement('from');
		var to = xmlDoc.createElement('to');
		var enabled = xmlDoc.createElement('enabled');
		var conditional = xmlDoc.createElement('conditional');

		var t_from = xmlDoc.createTextNode(edge.source.name);
		var t_to = xmlDoc.createTextNode(edge.target.name);
		var t_enabled = xmlDoc.createTextNode(edge.enabled);
		var t_conditional = xmlDoc.createTextNode(edge.conditional);

		from.appendChild(t_from);
		to.appendChild(t_to);
		enabled.appendChild(t_enabled);
		conditional.appendChild(t_conditional);

		hop.appendChild(from);
		hop.appendChild(to);
		hop.appendChild(enabled);
		hop.appendChild(conditional);

		j_hops.appendChild(hop);
	}

	var xmlJob = xmlDoc.getElementsByTagName("job")[0];
	xmlJob.appendChild(j_entries);
	xmlJob.appendChild(j_hops);

	var oSerializer = new XMLSerializer();
	var sXML = oSerializer.serializeToString(xmlDoc);

	thisGraph.xmlDoc = sXML;
	return sXML;
};

Graphic.prototype.reappearXmlDoc = function () {
	var thisGraph = this;
	thisGraph.nodes = [];
	thisGraph.edges = [];

	if (thisGraph.xmlDoc || thisGraph.xmlDoc != '') {

		var xmlDoc = thisGraph.getXmlDocs(thisGraph.xmlDoc);
		var graphxml_name = xmlDoc.getElementsByTagName('name')[0];
		if (graphxml_name.childNodes[0]) {
			thisGraph.name = graphxml_name.childNodes[0].nodeValue;
		}

		var xml_item_id = xmlDoc.getElementsByTagName("item_id")[0];
		if (xml_item_id.childNodes[0]) {
			thisGraph.item_id = xml_item_id.childNodes[0].nodeValue;
		} else {
			thisGraph.item_id = thisGraph.getJobItemId();
		}
		var xml_description = xmlDoc.getElementsByTagName("description")[0];
		if (xml_description.childNodes[0]) {
			thisGraph.description = xml_description.childNodes[0].nodeValue;
		} else {
			thisGraph.description = '';
		}

		var xml_canvas_w = xmlDoc.getElementsByTagName('canvas_w')[0];
		if (xml_canvas_w.childNodes[0]) {
			var re_canvas_w = xml_canvas_w.childNodes[0].nodeValue;
			thisGraph.canvas._w = thisGraph.canvas._w < re_canvas_w ? re_canvas_w : thisGraph.canvas._w;
		}
		var xml_canvas_h = xmlDoc.getElementsByTagName('canvas_h')[0];
		if (xml_canvas_h.childNodes[0]) {
			var re_canvas_h = xml_canvas_h.childNodes[0].nodeValue;
			thisGraph.canvas._h = thisGraph.canvas._h < re_canvas_h ? re_canvas_h : thisGraph.canvas._h;
		}

		var nodesXml = xmlDoc.getElementsByTagName("entry");
		for (var i = 0; i < nodesXml.length; i++) {
			var names = '';
			var xml_name = nodesXml[i].getElementsByTagName('name')[0];
			if (xml_name.childNodes[0]) {
				names = xml_name.childNodes[0].nodeValue;
			}

			var types = '';
			var xml_type = nodesXml[i].getElementsByTagName('type')[0];
			if (xml_type.childNodes[0]) {
				types = xml_type.childNodes[0].nodeValue;
			}

			var titles = '';
			//此时可以忽略title
			/*var xml_title = nodesXml[i].getElementsByTagName('title')[0];
   if(xml_title.childNodes[0]){
   	titles = xml_title.childNodes[0].nodeValue;
   }*/

			var xlocation = 50;
			var xml_xlocation = nodesXml[i].getElementsByTagName('xloc')[0];
			if (xml_xlocation.childNodes[0]) {
				xlocation = xml_xlocation.childNodes[0].nodeValue;
			}
			//新添加起止时间

			var xml_start_time = nodesXml[i].getElementsByTagName('start_time')[0];
			if (xml_start_time && xml_start_time.childNodes[0]) {
				start_time = xml_start_time.childNodes[0].nodeValue;
			} else {
				start_time = '';
			}
			var xml_end_time = nodesXml[i].getElementsByTagName('end_time')[0];
			if (xml_end_time && xml_end_time.childNodes[0]) {
				end_time = xml_end_time.childNodes[0].nodeValue;
			} else {
				end_time = '';
			}

			//任务编号
			var xml_task_no = nodesXml[i].getElementsByTagName('task_no')[0];
			if (xml_task_no) {
				task_no = xml_task_no.childNodes[0].nodeValue;
			} else {
				task_no = '';
			}

			//任务名称
			var xml_task_name = nodesXml[i].getElementsByTagName('task_name')[0];
			if (xml_task_name) {
				task_name = xml_task_name.childNodes[0].nodeValue;
			} else {
				task_name = "";
			}

			//执行时长
			var xml_time_length = nodesXml[i].getElementsByTagName('time_length')[0];
			if (xml_time_length && xml_time_length.childNodes[0]) {
				time_length = xml_time_length.childNodes[0].nodeValue;
			} else {
				time_length = "";
			}

			//返回信息
			var xml_result_mess = nodesXml[i].getElementsByTagName('result_mess')[0];
			if (xml_result_mess) {
				result_mess = xml_result_mess.childNodes[0].nodeValue;
			} else {
				result_mess = "";
			}

			var ylocation = 50;
			var xml_ylocation = nodesXml[i].getElementsByTagName('yloc')[0];
			if (xml_ylocation.childNodes[0]) {
				ylocation = xml_ylocation.childNodes[0].nodeValue;
			}
			xlocation = parseInt(xlocation);
			ylocation = parseInt(ylocation);

			var execute_flags = 'U';
			var xml_execute_flags = nodesXml[i].getElementsByTagName('execute_flag');
			if (xml_execute_flags) {
				if (xml_execute_flags[0]) {
					if (xml_execute_flags[0].childNodes) {
						execute_flags = xml_execute_flags[0].childNodes[0].nodeValue;
					}
				}
			}

			var node = {};

			if (types == 'L') {
				var xml_lock = nodesXml[i].getElementsByTagName('lock-option')[0];
				var locks = '';
				if (xml_lock.childNodes[0]) {
					locks = xml_lock.childNodes[0].nodeValue;
				}

				node = {
					id: thisGraph.getNodeId(),
					name: names,
					type: types,
					title: titles,
					lock: locks,
					x: xlocation,
					y: ylocation,
					execute_flag: execute_flags,
					start_time: start_time,
					end_time: end_time,
					task_no: task_no,
					task_name: task_name,
					time_length: time_length,
					result_mess: result_mess

				};
			} else if (types == 'F') {
				var xml_file_name = nodesXml[i].getElementsByTagName('file-name')[0];
				var file_names = '';
				if (xml_file_name.childNodes[0]) {
					file_names = xml_file_name.childNodes[0].nodeValue;
				}

				node = {
					id: thisGraph.getNodeId(),
					name: names,
					type: types,
					title: titles,
					file_name: file_names,
					x: xlocation,
					y: ylocation,
					execute_flag: execute_flags,
					start_time: start_time,
					end_time: end_time,
					task_no: task_no,
					task_name: task_name,
					time_length: time_length,
					result_mess: result_mess
				};
			} else if (types == 'I') {
				var xml_return_message = nodesXml[i].getElementsByTagName('return-message')[0];
				var return_messages = '';
				if (xml_return_message.childNodes[0]) {
					return_messages = xml_return_message.childNodes[0].nodeValue;
				}
				node = {
					id: thisGraph.getNodeId(),
					name: names,
					type: types,
					title: titles,
					return_message: return_messages,
					x: xlocation,
					y: ylocation,
					execute_flag: execute_flags,
					start_time: start_time,
					end_time: end_time,
					task_no: task_no,
					task_name: task_name,
					time_length: time_length,
					result_mess: result_mess
				};
			} else if (types == 'G') {
				var xml_wait_time = nodesXml[i].getElementsByTagName('wait-time')[0];
				var wait_times = '';
				if (xml_wait_time.childNodes[0]) {
					wait_times = xml_wait_time.childNodes[0].nodeValue;
				}

				var xml_time_unit = nodesXml[i].getElementsByTagName('time-unit')[0];
				var time_units = '';
				if (xml_time_unit.childNodes[0]) {
					time_units = xml_time_unit.childNodes[0].nodeValue;
				}

				node = {
					id: thisGraph.getNodeId(),
					name: names,
					type: types,
					title: titles,
					wait_time: wait_times,
					time_unit: time_units,
					x: xlocation,
					y: ylocation,
					execute_flag: execute_flags,
					start_time: start_time,
					end_time: end_time,
					task_no: task_no,
					task_name: task_name,
					time_length: time_length,
					result_mess: result_mess
				};
			} else if (types == 'C') {
				var xml_variable_name = nodesXml[i].getElementsByTagName('variable-name')[0];
				var variable_name = '';
				if (xml_variable_name.childNodes[0]) {
					variable_name = xml_variable_name.childNodes[0].nodeValue;
				}

				var xml_variable_type = nodesXml[i].getElementsByTagName('variable-type')[0];
				var variable_type = '';
				if (xml_variable_type.childNodes[0]) {
					variable_type = xml_variable_type.childNodes[0].nodeValue;
				}

				var xml_variable_value = nodesXml[i].getElementsByTagName('value')[0];
				var variable_value = '';
				if (xml_variable_value.childNodes[0]) {
					variable_value = xml_variable_value.childNodes[0].nodeValue;
				}

				var xml_success_condition = nodesXml[i].getElementsByTagName('success-condition')[0];
				var success_condition = '';
				if (xml_success_condition.childNodes[0]) {
					success_condition = xml_success_condition.childNodes[0].nodeValue;
				}

				var xml_operation = nodesXml[i].getElementsByTagName('operation')[0];
				var operation = '';
				if (typeof xml_operation != "undefined" && xml_operation.childNodes[0]) {
					operation = xml_operation.childNodes[0].nodeValue;
				}

				node = {
					id: thisGraph.getNodeId(),
					name: names,
					type: types,
					title: titles,
					variable_name: variable_name,
					variable_type: variable_type,
					variable_value: variable_value,
					success_condition: success_condition,
					operation: operation,
					x: xlocation,
					y: ylocation,
					execute_flag: execute_flags,
					start_time: start_time,
					end_time: end_time,
					task_no: task_no,
					task_name: task_name,
					time_length: time_length,
					result_mess: result_mess

				};
			} else if (types == 'S') {
				node = {
					id: thisGraph.getNodeId(),
					name: names,
					type: types,
					title: titles,
					x: xlocation,
					y: ylocation,
					execute_flag: execute_flags,
					start_time: start_time,
					end_time: end_time,
					task_no: task_no,
					task_name: task_name,
					time_length: time_length,
					result_mess: result_mess
				};
			} else {
				var item_ids = '';
				var xml_item_id = nodesXml[i].getElementsByTagName('item_id')[0];
				if (xml_item_id.childNodes[0]) {
					item_ids = xml_item_id.childNodes[0].nodeValue;
				}
				node = {
					id: thisGraph.getNodeId(),
					name: names,
					type: types,
					title: titles,
					item_id: item_ids,
					x: xlocation,
					y: ylocation,
					execute_flag: execute_flags,
					start_time: start_time,
					end_time: end_time,
					task_no: task_no,
					task_name: task_name,
					time_length: time_length,
					result_mess: result_mess
				};
			}

			thisGraph.nodes.push(node);
		}
		//console.log(thisGraph.nodes);
		var hopsXml = xmlDoc.getElementsByTagName("hop");
		for (var j = 0; j < hopsXml.length; j++) {
			var froms = hopsXml[j].getElementsByTagName('from')[0].childNodes[0].nodeValue;
			var source, target;
			for (var k = 0; k < thisGraph.nodes.length; k++) {
				var thisnode = thisGraph.nodes[k];
				if (thisnode.name == froms) {
					soruce = thisnode;
					break;
				}
			}
			var tos = hopsXml[j].getElementsByTagName('to')[0].childNodes[0].nodeValue;
			for (var l = 0; l < thisGraph.nodes.length; l++) {
				var thisnode = thisGraph.nodes[l];
				if (thisnode.name == tos) {
					target = thisnode;
					break;
				}
			}
			var enableds = hopsXml[j].getElementsByTagName('enabled')[0].childNodes[0].nodeValue;
			var conditionals = hopsXml[j].getElementsByTagName('conditional')[0].childNodes[0].nodeValue;

			var edge = {
				source: soruce,
				target: target,
				enabled: enableds,
				conditional: conditionals
			};

			thisGraph.edges.push(edge);
		}
	} else {}
};

Graphic.prototype.getXmlDocs = function (text) {
	var xmlDoc;
	// try //Internet Explorer
	// {
	// 	xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	// 	xmlDoc.async = "false";
	// 	xmlDoc.loadXML(text);
	// }
	// catch (e) {
	try //Firefox, Mozilla, Opera, etc.
	{
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(text, "text/xml");
	} catch (e) {
		alert(e.message);
	}
	// }
	return xmlDoc;
};

Graphic.prototype.getNewOrder = function (types, titles) {
	var thisGraph = this;
	var nodes = thisGraph.nodes;
	var i = 0;

	var flag = true;
	while (flag) {
		var name = titles + i;
		var isExist = false;
		for (var j = 0; j < nodes.length; j++) {
			if (nodes[j].type == types) {
				if (nodes[j].name == name) {
					isExist = true;
					i++;
					break;
				}
			}
		}
		if (!isExist) {
			flag = false;
			return name;
		}
	}
	return i + '';
};

//导入任务按照编号命名
Graphic.prototype.getImportTaskName = function (taskNumber) {
	var thisGraph = this;
	var nodes = thisGraph.nodes;

	for (var j = 0; j < nodes.length; j++) {
		// 导入任务名称去重
		if (nodes[j].name == taskNumber) {
			taskNumber += '2';
			continue;
		}
	}
	return taskNumber;
};

//导入任务按照数组生成连线
Graphic.prototype.getImportTaskHop = function (addNodes, hopType) {
	var thisGraph = this;
	if (addNodes.length >= 2 && hopType != 'D') {
		for (var i = 1; i < addNodes.length; i++) {
			var hop = {
				source: addNodes[i - 1],
				target: addNodes[i],
				enabled: 'Y',
				conditional: hopType
			};
			thisGraph.edges.push(hop);
		}
	}
	//thisGraph.nodes = $.merge( thisGraph.nodes, addNodes);
};

//初始化画布，根据xml
Graphic.prototype.initCanvas = function () {
	var thisGraph = this;
	thisGraph.svg.attr('height', thisGraph.canvas._h);
	thisGraph.svg.attr('width', thisGraph.canvas._w);
};

//弹出窗口相关数据和按钮点击功能
Graphic.prototype.saveJobFlowXmlDoc = function () {
	var thisGraph = this;
	var jobName = $('#jf_jobName_input').val();
	thisGraph.name = jobName;
	thisGraph.description = $('#jf_jobDe_input').val();
	$('#jobFlow_xml').val(thisGraph.updateXmlDoc());
};

//不同组件的节点弹出窗口方法
Graphic.prototype.nodeDblclick = function (d) {
	var thisGraph = this;
	//取消选中的当前节点
	thisGraph.removeNodeFous();
	//根据d的type弹出不同的form
	var type = d.type;

	if (type == 'S') {
		//开始组件
		return false;
	} else if (type == 'L') {
		//等待完成组件
		$(thisGraph.formbox + type).window('open');
		$('#i_nodeIdL').val(d.id);
		$(".validatebox-tip").remove();
		$(".validatebox-invalid").removeClass("validatebox-invalid");
		$('#i_nodeNameL').val(d.name);
		if (d.lock != '' && d.lock != 'undefined') {
			var i = d.lock;
			var inputList = document.getElementsByName("lockOption");
			for (var x = 0; x < inputList.length; x++) {
				inputList[x].checked = false; //取消选中
			}
			var input = document.getElementById("input" + i);
			input.checked = true;
		} else {
			//默认选中第二个 
			var input = document.getElementById("input2");
			input.checked = true; //选中第二个　
		}
	} else if (type == 'I') {
		//中止组件
		$(thisGraph.formbox + type).window('open');
		$('#node_edit' + type).form('clear');
		$('#i_nodeIdI').val(d.id);
		$(".validatebox-tip").remove();
		$(".validatebox-invalid").removeClass("validatebox-invalid");
		//console.log(d.name);
		$('#i_nodeNameI').val(d.name);
		if (d.return_message != '') {
			$('#i_return_message').val(d.return_message);
		}
	} else if (type == 'G') {
		//等待一定时间组件
		$(thisGraph.formbox + type).window('open');
		//$('#node_edit' + type).form('clear');
		$('#i_nodeIdG').val(d.id);
		$(".validatebox-tip").remove();
		$(".validatebox-invalid").removeClass("validatebox-invalid");
		//console.log(d.name);
		$('#i_nodeNameG').val(d.name);
		if (d.wait_time != '' && d.wait_time != 'undefined') {
			$('#i_wait_time').val(d.wait_time);
			$('#i_time_unit').val(d.time_unit);
		} else {
			$('#i_wait_time').val('0');
		}
	} else if (type == 'C') {
		//条件判断组件--弹出条件校验窗口
		$(thisGraph.formbox + type).window('open');
		$('#node_edit' + type).form('clear');
		$('#i_nodeIdC').val(d.id);
		$('#i_nodeNameC').val(d.name);

		$(".validatebox-tip").remove();
		$(".validatebox-invalid").removeClass("validatebox-invalid");

		$('#i_variable_name').val(d.variable_name);
		$('#i_variable_type').val(d.variable_type);
		$('#i_variable_value').val(d.variable_value);
		$('#i_success_condition').val(d.success_condition);
	} else {
		//任务组件
		$(thisGraph.formbox + type).window('open');
		$('#node_edit' + type).form('clear');
		$(".validatebox-tip").remove();
		$(".validatebox-invalid").removeClass("validatebox-invalid");
		var formDom = $(thisGraph.forms + type);
		var data = {};
		data.i_nodeId = d.id;
		data.i_nodeName = d.name;
		//设置节点名称
		$('#i_nodeName' + d.type).val(d.name);
		var nodeItemIdDom = $('#i_nodeItem_id' + d.type);
		nodeItemIdDom.combobox({
			valueField: 'id',
			textField: 'name',
			editable: true,
			url: 'job/taskList.action?type=' + d.type,
			onLoadSuccess: function onLoadSuccess() {

				var data = nodeItemIdDom.combobox('getData');
				if (data.length > 0) {
					nodeItemIdDom.combobox('select', d.item_id);
				}
			}
		});
		formDom.form('myLoad', data);
	}
};

Graphic.prototype.nodePreContextMenu = function (node, d) {
	var thisGraph = this;
	if (thisGraph.state.selectedNodes.length <= 1) {
		thisGraph.selectNode(node, d);
	}
};

Graphic.prototype.pathM_true_click = function () {
	var thisGraph = this;
	thisGraph.state.selectedEdge.conditional = 'S';
	thisGraph.update();
};
Graphic.prototype.pathM_false_click = function () {
	var thisGraph = this;
	thisGraph.state.selectedEdge.conditional = 'F';
	thisGraph.update();
};
Graphic.prototype.pathM_reverse_click = function () {
	var thisGraph = this;
	var source = thisGraph.state.selectedEdge.target;
	var target = thisGraph.state.selectedEdge.source;

	//反转的时候等待完成组件判断（从任何状态变为成功状态）
	if (source.type == 'L') {
		thisGraph.state.selectedEdge.conditional = 'S';
	}

	thisGraph.state.selectedEdge.source = source;
	thisGraph.state.selectedEdge.target = target;
	thisGraph.update();
};

Graphic.prototype.pathM_enabled_click = function () {
	var thisGraph = this;
	var en = thisGraph.state.selectedEdge.enabled;
	thisGraph.state.selectedEdge.enabled = en == 'Y' ? 'N' : 'Y';
	thisGraph.update();
};

Graphic.prototype.pathM_unconditional_click = function () {
	var thisGraph = this;
	thisGraph.state.selectedEdge.conditional = 'N';
	thisGraph.update();
};

//鼠标移入菜单的显示与隐藏
Graphic.prototype.rightmenu1 = function (ele, d) {

	var thisGraph = this;

	var height_ = $("#svgbox").height();

	var _y = d3.event.clientY,
	    _x = d3.event.clientX;
	if (height_ - _y < 200) {
		_y = _y - 20;
	}
	var maxw = $('#svgbox').width() - ele.width();
	var maxh = $('#svgbox').height() - ele.height();
	var ts = setTimeout(function () {
		if (delay == '0') {
			ele.menu('show', {
				left: _x + 30,
				top: _y + 30

			});
		}
	}, 500);
	return false;
};