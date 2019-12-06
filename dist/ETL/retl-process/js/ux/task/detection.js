var analyColName = "";
var sqlString = "";
var sqlStr = "";
var dbConnect = "";
var startPage = 0;
var range = 17; // 距下边界长度/单位px
var totalheight = 0;
$(function() {
	// 显示左边规则树
	showRuleTree("task/dqtreeList.action");
	$('#dd').scroll(function() {
		var srollPos = $("#dd").scrollTop(); // 滚动条距顶部距离(页面超出窗口的高度)
		totalheight = parseFloat($("#dd").height()) + parseFloat(srollPos);
		if (parseFloat($("#tableId").height() + range) <= totalheight) {
			startPage++;
			addTableLines();

		}

	});
	var html = ""
	getNowFormatDate()
	$("#m-navbox li").click(function() {
		$("#m-mainboxs").hide();
		var Titie = $(this).attr("titles");
		var Rid = $(this).attr("id");
		if (Rid == 'jindu') {
			$("#m-mainboxs").show();
			$("#number_s").hide();
		}
		tubiao(Rid, Titie)
		$(this).addClass('m-on');
		$(this).siblings('li').removeClass('m-on')
	})

})

// 加载左边树信息
function showRuleTree(url) {
	$('#list_taskflow')
			.tree(
					{
						url : url,
						method : 'post',
						animate : true,
						checkbox : false,
						cascadeCheck : false,// 层叠选中
						onlyLeafCheck : true,
						lines : true,// 显示虚线效果
						queryParams : {path:path},
						onSelect : function(node) {
							$("#m-mainboxs").hide();
							var Titie = node.folderName;
							var Rid = node.folderId;
							analyColName = node.taskType;

							$("#ruleInfo_span").empty();
							$("#analyImg").removeAttr('class');
							$("#analyImg").addClass(
									"tree-icon tree-file " + node.iconCls);
							if (node.sumMsg != "") {
								var headHtml = "<tr>"
									    + "<th width=\"3%;\"  style=\"text-align: center;padding-left: 0px;\">序号</th>"
										+ "<th width=\"7.7%;\"  style=\"text-align: center\">字段</th>"
										+ "<th width=\"7.7%;\" style=\"text-align: center\">规则类型</th>"
										+ "<th width=\"5.7%;\" style=\"text-align: center\">所有行数</th>"
										+ "<th width=\"7.7%;\"  style=\"text-align: center;padding-left: 0px;\">空值行数</th>"
										+ "<th width=\"7.7%;\" style=\"text-align: center\">空值行%</th>"
										+ "<th width=\"7.7%;\" style=\"text-align: center\">匹配行数</th>"
										+ "<th width=\"7.7%;\"  style=\"text-align: center;padding-left: 0px;\">匹配%</th>"
										+ "<th width=\"7.7%;\" style=\"text-align: center\">未匹配行数</th>"
										+ "<th width=\"7.7%;\" style=\"text-align: center\">未匹配%</th>"
										+ "<th width=\"7.7%;\"  style=\"text-align: center;padding-left: 0px;\">重复值数</th>"
										+ "<th width=\"7.7%;\" style=\"text-align: center\">重复值 %</th>"
										+ "<th width=\"7.7%;\" style=\"text-align: center\">唯一值行数</th>"
										+ "<th width=\"7.7%;\" style=\"text-align: center\">唯一值%</th>"
										+ "</tr>";
								$("#headId").empty();
								$("#headId").append(headHtml);
								$("#main_repeat").hide();
								$("#number_sd").hide()
								$("#number_s").show()
								$("#main").removeClass('Chart').hide();
								$("#number_s").removeClass('number_mai');
								$("#number_s").addClass('number_chart');
								var b = JSON.parse(node.sumMsg);
								var htmls = "";
								$.each(b, function(i, dc) {
									var rowIndex=parseInt(i)+1;
									var repeatLines = dc.repeatLines;
									var unexpectLines = dc.unexpectLines;
									if (Number(repeatLines) > 0) {
										repeatLines = "<font color='red'>"
												+ repeatLines + "</font>"
									}
									if (Number(unexpectLines) > 0) {
										unexpectLines = "<font color='red'>"
												+ unexpectLines + "</font>"
									}
									htmls = htmls
											+ "<tr class='profileShow'><td>"
											+ rowIndex + "</td><td>" + dc.name
											+ "</td><td>" + dc.type
											+ "</td><td>" + dc.allLines
											+ "</td><td>" + dc.emptyLines
											+ "</td><td>" + dc.emptyPercent
											+ "</td><td>" + dc.expectLines
											+ "</td><td>" + dc.expectPercent
											+ "</td><td>" + unexpectLines
											+ "</td><td>" + dc.unexpectPercent
											+ "</td><td>" + repeatLines
											+ "</td><td>" + dc.repeatPercent
											+ "</td><td>" + dc.uniqueLines
											+ "</td><td>" + dc.uniquePercent
											+ "</td></tr>"
								})
								$("#number_content").html(htmls);
								$("#ruleInfo_span").append(
										node.taskType + ":" + "概要信息");
							} else {
								tubiao(Rid, Titie)
								$("#ruleInfo_span").append(
										node.taskType + ":" + node.folderDesc);
							}

							$(this).addClass('m-on');
							$(this).siblings('li').removeClass('m-on')

						},
						onContextMenu : function(e, node) {
							e.preventDefault();
							$(this).tree('select', node.target);
							$('#t_rm_catalog').menu('show', {
								left : e.pageX,
								top : e.pageY
							});
						},
						onLoadSuccess : function(node, data) {
							if (data.length > 0) {
								// 找到第一个元素
								var n = $('#list_taskflow').tree('find',
										data[0].id);
								// 调用选中事件
								$('#list_taskflow').tree('select', n.target);
							}
						}
					});

}

// 柱状图
function transverse(Rid) {
	var name = [];
	var nambre = []
	$.ajax({
		url : 'task/getOneResult.action?rid=' + Rid,
		type : "post",
		dataType : 'json',
		data : {
			path : path,
		},
		success : function(data) {
			var b = data;
			if (b.length <= 1001) {
				$("#main_repeat").hide();
				$("#number_sd").hide()
				$("#number_s").show()
				$("#main").addClass('Chart').show();
				$("#number_s").addClass('number_mai');
				$("#number_s").removeClass('number_chart');
				var htmls = ''
				$.each(b, function(i, dc) {
					if (dc.name != "所有行数") {
						name.push(dc.name);
						nambre.push(dc.value)
					}
				})
				var myChart = echarts.init(document.getElementById('main'));

				option = {
					tooltip : {
						trigger : 'axis',
						axisPointer : { // 坐标轴指示器，坐标轴触发有效
							type : 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					backgroundColor : "#fff",
					grid : {
						x : 100,
					},
					legend : {
						show : false,
						data : [ '数据' ]
					},
					calculable : false,
					xAxis : [ {
						type : 'value',
						splitLine : {
							show : false
						}
					} ],
					yAxis : [ {
						type : 'category',
						data : name,
						splitLine : {
							show : false
						}
					} ],
					series : [ {
						name : '数据',
						type : 'bar',
						itemStyle : {
							normal : {
								color : function(params) {
									// build a color map as your need.
									var colorList = [ '#C1232B', '#B5C334',
											'#FCCE10', '#E87C25', '#27727B',
											'#FE8463', '#9BCA63', '#FAD860',
											'#F3A43B', '#60C0DD', '#D7504B',
											'#C6E579', '#F4E001', '#F0805A',
											'#26C0C0' ];
									return colorList[params.dataIndex]
								},
								label : {
									show : true,
									position : 'right'
								},
							}
						},
						data : nambre
					}

					]
				};

				// 为echarts对象加载数据
				myChart.setOption(option);
			}

		}
	})

	// 基于准备好的dom，初始化echarts图表
}
// 饼图
function Pie_chart(Rid) {
	var name = [];
	var nambre = [];
	$.ajax({
		url : 'task/getOneResult.action?rid=' + Rid,
		type : "post",
		data : {
			path : path,
		},
		dataType : 'json',
		success : function(data) {
			var b = eval(data)[0].value;
			var htmls = ''
			var zong = 0;
			$.each(eval(b), function(i, dc) {
				name.push(dc.name);
				if (dc.name == "所有行数") {
					zong = Number(dc.value);
				} else {
					nambre.push({
						name : dc.name,
						value : dc.value
					})
				}

				if (dc.name == "空值行数") {
					$("#jian").html(dc.name + "：" + dc.value)
				} else if (dc.name == "唯一值数") {
					$("#weiy").html(dc.name + "：" + dc.value)
				} else if (dc.name == "重复值数") {
					$("#repeatvalue").html(dc.name + "：" + dc.value)
				} else if (dc.name == "重复行数") {
					$("#repeat_row_count").html(dc.name + "：" + dc.value);
				}

			})
			$("#suoy").html("所有行数：" + zong)

			// 基于准备好的dom，初始化echarts图表
			var myChart = echarts.init(document.getElementById('main'));
			option = {
				tooltip : {
					trigger : 'item',

				},
				legend : {
					orient : 'vertical',
					x : 'left',
					show : false,
					data : name
				},

				calculable : false,
				series : [ {
					// name:'访问来源',
					type : 'pie',
					radius : [ '40%', '60%' ],
					data : nambre
				} ]
			};
			// 为echarts对象加载数据
			myChart.setOption(option);

		}
	})
}

// 显示图表判断
function tubiao(Rid, Titie) {
	$("#headId").empty();
	var headHtml = "<tr><th width=\"33%;\"  style=\"text-align: center;padding-left: 0px;\">名称</th><th width=\"33%;\" style=\"text-align: center\">数量</th><th width=\"33%;\" style=\"text-align: center\">百分比</th></tr>";
	var headHtmlExp = "<tr><th width=\"25%;\"  style=\"text-align: center;padding-left: 0px;\">名称</th><th width=\"25%;\"  style=\"text-align: center;padding-left: 0px;\">表达式</th><th width=\"25%;\" style=\"text-align: center\">数量</th><th width=\"25%;\" style=\"text-align: center\">百分比</th></tr>";
	if (Titie == 6) {
		$("#headId").append(headHtmlExp);
	} else {
		$("#headId").append(headHtml);
	}
	$("#ruleId").val(Rid);
	if (Titie == 5) {
		// 饼图
		$("#number_sd").hide()
		$("#number_s").show()
		$("#main").addClass('Chart').show();
		$("#number_s").addClass('number_mai');
		$("#number_s").removeClass('number_chart');
		$("#main_repeat").show();
		Pie_chart(Rid)
		right_numberz(Rid)
	} else if (Titie == 8) {
		// 柱状图
		$("#main_repeat").hide();
		$("#number_sd").hide()
		$("#number_s").show()
		$("#main").removeClass('Chart').hide();
		$("#number_s").removeClass('number_mai');
		$("#number_s").addClass('number_chart');
		transverse(Rid)
		right_number(Rid)
	} else if (Titie == 6) {
		$("#main_repeat").hide();
		$("#number_sd").hide()
		$("#number_s").show()
		$("#main").removeClass('Chart').hide();
		$("#number_s").removeClass('number_mai');
		$("#number_s").addClass('number_chart');
		right_number(Rid + ";" + Titie)
	} else if (Titie == 1) {
		$("#main_repeat").hide();
		$("#number_sd").hide()
		$("#number_s").show()
		$("#main").removeClass('Chart').hide();
		$("#number_s").removeClass('number_mai');
		$("#number_s").addClass('number_chart');
		transverse(Rid)
		right_number(Rid)
	} else {
		$("#main_repeat").hide();
		$("#number_sd").hide()
		$("#number_s").show()
		$("#main").removeClass('Chart').hide();
		$("#number_s").removeClass('number_mai');
		$("#number_s").addClass('number_chart');
		right_number(Rid)
	}
}
// 返回百分比(四舍五入)
function getDivValue(a, b) {
	return Math.round(a / b * 10000)/100.0 + "%";
}

function right_number(Rid) {
	var arr = Rid.split(";");
	if (arr.length > 1) {
		$
				.ajax({
					url : 'task/getOneResult.action?rid=' + arr[0],
					type : "post",
					dataType : 'json',
					data : {
						path : path,
					},
					success : function(data) {
						var b = data;
						var htmls = ''
						var allData = 0;
						$.each(b, function(i, dc) {
							if (dc.name == "所有行数") {
								allData = dc.value;
								return false;
							}
						})

						$
								.each(
										b,
										function(i, dc) {
											var sql = dc.path;
											var divValue = getDivValue(
													dc.value, allData);
											if (sql == "") {
												htmls = htmls
														+ "<tr class='profileShow'><td>"
														+ dc.name + "</td><td>"
														+ dc.model
														+ "</td><td>"
														+ dc.value
														+ "</td><td>"
														+ divValue
														+ "</td></tr>"
											} else {
												if (dc.value == '0') {
													htmls = htmls
															+ "<tr class='profileShow'><td>"
															+ dc.name
															+ "</td><td>"
															+ dc.model
															+ "</td><td><input type='hidden' value=\""
															+ sql
															+ "\"><a href='javascript:;'>"
															+ dc.value
															+ "<img src='images/right.png' class='right_img' style='background:#ccc;' /></a></td><td>"
															+ divValue
															+ "</td></tr>"
												} else {
													htmls = htmls
															+ "<tr class='profileShow'><td>"
															+ dc.name
															+ "</td><td>"
															+ dc.model
															+ "</td><td><input type='hidden' value=\""
															+ dc.path
															+ "\"><a onclick='getResult(this,\""
															+ "\");'>"
															+ dc.value
															+ "<img src='images/right.png' class='right_img' /></a></td><td>"
															+ divValue
															+ "</td></tr>"
												}
											}

										})
						$("#number_content").html(htmls)
						$("#number_content tr").mouseover(function() {
							$(this).css("background", "#dde6eb")
						})
						$("#number_content tr").mouseout(function() {
							$(this).css("background", "")
						})

					}
				})
	} else {
		$
				.ajax({
					url : 'task/getOneResult.action?rid=' + Rid,
					type : "post",
					dataType : 'json',
					data : {
						path : path,
					},
					success : function(data) {
						var b = data;
						var htmls = ''
						var allData = 0;
						$.each(b, function(i, dc) {
							if (dc.name == "所有行数") {
								allData = dc.value;
								return false;
							}
						})
						$
								.each(
										b,
										function(i, dc) {
											var divValue = getDivValue(
													dc.value, allData);
											if (dc.name == "总字符数") {
												divValue = "";
											}
											if (dc.name == "最大字符数") {
												divValue = "";
											}
											if (dc.name == "最小字符数") {
												divValue = "";
											}
											if (dc.name == "平均字符数") {
												divValue = "";
											}
											if (dc.name == "最大空格数") {
												divValue = "";
											}
											if (dc.name == "最大值") {
												divValue = "";
											}
											if (dc.name == "最小值") {
												divValue = "";
											}
											if (dc.name == "汇总值") {
												divValue = "";
											}
											if (dc.name == "平均值") {
												divValue = "";
											}
											if (dc.name == "最大日期") {
												divValue = "";
											}
											if (dc.name == "最小日期") {
												divValue = "";
											}
											if (dc.name == "最大时间") {
												divValue = "";
											}
											if (dc.name == "最小时间") {
												divValue = "";
											}
											var sql = dc.path;
											var sqlStr = dc.sql;
											if (sql == "" && sqlStr == "") {
												htmls = htmls
														+ "<tr class='profileShow'><td>"
														+ dc.name + "</td><td>"
														+ dc.value
														+ "</td><td>"
														+ divValue
														+ "</td></tr>"
											} else if (sql == ""
													&& sqlStr != "") {
												if (dc.value == '0') {
													htmls = htmls
															+ "<tr class='profileShow'><td>"
															+ dc.name
															+ "</td><td><input type='hidden' value=\""
															+ sql
															+ "\"><a href='javascript:;'>"
															+ dc.value
															+ "<img src='images/right.png' class='right_img' style='background:#ccc;' /></a></td><td>"
															+ divValue
															+ "</td></tr>"
												} else {
													htmls = htmls
															+ "<tr class='profileShow'><td>"
															+ dc.name
															+ "</td><td><input type='hidden' value=\""
															+ dc.sql
															+ "\"><a onclick=\"getResult(this,\'"
															+ "\');\">"
															+ dc.value
															+ "<img src='images/right.png' class='right_img' /></a></td><td>"
															+ divValue
															+ "</td></tr>"
												}
											} else {
												if (dc.value == '0') {
													htmls = htmls
															+ "<tr class='profileShow'><td>"
															+ dc.name
															+ "</td><td><input type='hidden' value=\""
															+ sql
															+ "\"><a href='javascript:;'>"
															+ dc.value
															+ "<img src='images/right.png' class='right_img' style='background:#ccc;' /></a></td><td>"
															+ divValue
															+ "</td></tr>"
												} else {
													htmls = htmls
															+ "<tr class='profileShow'><td>"
															+ dc.name
															+ "</td><td><input type='hidden' value=\""
															+ dc.path
															+ "\"><a onclick='getResult(this,\""
															+ "\");'>"
															+ dc.value
															+ "<img src='images/right.png' class='right_img' /></a></td><td>"
															+ divValue
															+ "</td></tr>"
												}

											}

										})
						$("#number_content").html(htmls)
						$("#number_content tr").mouseover(function() {
							$(this).css("background", "#dde6eb")
						})
						$("#number_content tr").mouseout(function() {
							$(this).css("background", "")
						})

					}
				})
	}

}
function right_numberz(Rid) {
	$
			.ajax({
				url : 'task/getOneResult.action?rid=' + Rid,
				type : "post",
				dataType : 'json',
				data : {
					path : path,
				},
				success : function(data) {
					var b = eval(data[1].value);
					var b1 = eval(data[0].value);
					var htmls = ''
					var allData = 0;
					$.each(b1, function(i, dc) {
						if (dc.name == "所有行数") {
							allData = dc.value;
							return false;
						}
					})
					$
							.each(
									b,
									function(i, dc) {
										var divValue = getDivValue(dc.value,
												allData);
										var sql = dc.path;
										var sqlStr = dc.sql;
										if (sql == "" && sqlStr == "") {
											htmls = htmls
													+ "<tr class='profileShow'><td>"
													+ dc.name + "</td><td>"
													+ dc.value + "</td><td>"
													+ divValue + "</td></tr>"
										} else if (sql == "" && sqlStr != "") {
											if (dc.value == '0') {
												htmls = htmls
														+ "<tr class='profileShow'><td>"
														+ dc.name
														+ "</td><td><input type='hidden' value=\""
														+ sql
														+ "\"><a href='javascript:;'>"
														+ dc.value
														+ "<img src='images/right.png' class='right_img' style='background:#ccc;' /></a></td><td>"
														+ divValue
														+ "</td></tr>"
											} else {
												htmls = htmls
														+ "<tr class='profileShow'><td>"
														+ dc.name
														+ "</td><td><input type='hidden' value=\""
														+ dc.sql
														+ "\"><a onclick=\"getResult(this,\'"
														+ "\');\">"
														+ dc.value
														+ "<img src='images/right.png' class='right_img' /></a></td><td>"
														+ divValue
														+ "</td></tr>"
											}
										} else {
											if (dc.value == '0') {
												htmls = htmls
														+ "<tr class='profileShow'><td>"
														+ dc.name
														+ "</td><td><input type='hidden' value=\""
														+ sql
														+ "\"><a href='javascript:;'>"
														+ dc.value
														+ "<img src='images/right.png' class='right_img' style='background:#ccc;' /></a></td><td>"
														+ divValue
														+ "</td></tr>"
											} else {
												htmls = htmls
														+ "<tr class='profileShow'><td>"
														+ dc.name
														+ "</td><td><input type='hidden' value=\""
														+ dc.path
														+ "\"><a onclick='getResult(this,\""
														+ "\");'>"
														+ dc.value
														+ "<img src='images/right.png' class='right_img' /></a></td><td>"
														+ divValue
														+ "</td></tr>"
											}

										}

									})
					$("#number_content").html(htmls)
					$("#number_content tr").mouseover(function() {
						$(this).css("background", "#dde6eb")
					})
					$("#number_content tr").mouseout(function() {
						$(this).css("background", "")
					})

				}
			})
}
/**
 * 动态加载数据
 */
function addTableLines() {
	$.messager.progress({
		title : '请稍后',
		msg : '正在加载中...',
	});
	var url = "";
	if (sqlString.indexOf("お") > 0) {
		url = "task/getSelDataSql.action";
	} else {
		url = "task/getSelData.action";
	}
	$
			.ajax({
				type : "post",
				dataType : 'json',
				data : {
					path : sqlString,
					startPage : startPage
				},
				url : url,
				success : function(data) {
					var html = "";
					for (var int = 0; int < data.length; int++) {
						var trObject = data[int];
						html = html + "<tr>"
						for (var i = 0; i < trObject.length; i++) {
							if (trObject[i].name.toUpperCase() == analyColName
									.toUpperCase()) {
								if (trObject[i].value == null
										|| trObject[i].value == "") {
									html = html
											+ "<td style='background:#4B4B4B;color:#99CCFF;min-width:100px;'>[NULL]</td>"
								} else {
									html = html
											+ "<td style='background:#4B4B4B;color:#fff;min-width:100px;'>"
											+ trObject[i].value.replace(
													/(\s)/g, '&nbsp;')
											+ "</td>"
								}

							} else {
								if (trObject[i].value == null
										|| trObject[i].value == "") {
									html = html
											+ "<td style=\"mso-number-format:'\@'\">[NULL]</td>"
								} else {
									html = html
											+ "<td style=\"mso-number-format:'\@'\">"
											+ trObject[i].value + "</td>"
								}

							}

						}
						html = html + "</tr>"
					}
					$("#tableId").append(html);
				}
			})
	$.messager.progress('close');
}
/**
 * 点击数目得到相应的条目
 * 
 * @param sql
 * @param name
 * @param conId
 */
function getResult(ts, path) {
	$.messager.progress({
		title : '请稍后',
		msg : '正在加载中...',
	});
	var cname = "";
	sqlString = $(ts).prev().val();
	var url = "";
	if (sqlString.indexOf("お") > 0) {
		url = "task/getSelDataSql.action";
	} else {
		url = "task/getSelData.action";
	}
	var width = 300;
	var html = "<div class='See_div'><select onChange='changeShow(this)' class='easyui-combobox See_select' style='width:200px;'><option value='0'>查看明细记录</option><option value='1'>查看记录行数</option></select><div class='col-sm-1 export' style='width:48px;'>"
			+ "<button type='button' id='btn-none' class='btn btn-default btn-small'>导出</button></div></div><table id='tableId' border='1' cellspacing='0'>";
	$
			.ajax({
				type : "post",
				dataType : 'json',
				data : {
					path : sqlString,
					startPage : 0
				},
				url : url,
				success : function(data) {
					var headStr = "";
					for (var int = 0; int < data[0].length; int++) {
						if (headStr == "") {
							headStr = data[0][int].name;
						} else {
							headStr = headStr + ";" + data[0][int].name;
						}
					}
					var headArr = headStr.split(";");
					if (headArr.length * 100 > width) {
						width = headArr.length * 100;
					}
					html = html + "<tr>";
					for (var int = 0; int < headArr.length; int++) {
						html = html + "<td width='100px'><font size='3'><b>"
								+ headArr[int] + "</b></font></td>"
					}
					html = html + "</tr>";
					for (var int = 0; int < data.length; int++) {
						var trObject = data[int];
						html = html + "<tr>"
						for (var i = 0; i < trObject.length; i++) {
							if (trObject[i].name.toUpperCase() == analyColName
									.toUpperCase()) {
								if (trObject[i].value == null
										|| trObject[i].value == "") {
									html = html
											+ "<td style='background:#4B4B4B;color:#99CCFF;min-width:100px;'>[NULL]</td>"
								} else {
									html = html
											+ "<td style='background:#4B4B4B;color:#fff;min-width:100px;'>"
											+ trObject[i].value.replace(
													/(\s)/g, '&nbsp;')
											+ "</td>"
								}

							} else {
								if (trObject[i].value == null
										|| trObject[i].value == "") {
									html = html
											+ "<td style=\"mso-number-format:'\@'\">[NULL]</td>"
								} else {
									html = html
											+ "<td style=\"mso-number-format:'\@'\">"
											+ trObject[i].value + "</td>"
								}

							}

						}
						html = html + "</tr>"
					}
					html = html + "</table>"
					html = html
							+ "<table style='display:none' id='countId' border='1' cellspacing='0'><tr><td width='400px'>目标值</td><td width='400px'>条数</td></tr><tr><td width='400px'>"
							+ analyColName
							+ "</td><td width='400px'><input style='border:none;' type='text' id='allCountId' value='' ></td></tr></table>";
					$('#dd').empty();
					startPage = 0;
					$('#dd').append(html);
					// 导出
					$("#btn-none").click(function() {
						$("#export").window('open')
					})
					$('#dd').dialog({
						title : "结果查看",
						width : 800,
						height : 600,
						closed : false,
						cache : false,
						modal : true,
						minimizable : true,
						maximizable : true,
					});
					$('#dd').scrollTop(0);
				}
			})
	$.messager.progress('close');

}

function ifHaveExcute(id) {
	var res = $("#excutedIds").val();
	if (res == "") {
		return false;
	} else {
		var flag = $.inArray(id, res.split(","))
		if (flag == -1) {
			return false;
		} else {
			return true;
		}
	}

}

function changeShow(ts) {
	var flag = $(ts).val();
	if (flag == "0") {
		$("#tableId").show();
		$("#countId").hide();

	} else {
		var url = "";
		if (sqlString.indexOf("お") > 0) {
			url = "task/getCountSql.action";
		} else {
			url = "task/getCount.action";
		}
		if ($("#allCountId").val() == "") {
			$.ajax({
				type : "post",
				url : url,
				async : false,
				data : {
					path : sqlString,
					startPage : "0"
				},
				dataType : 'text',
				success : function(data) {
					$("#allCountId").val(data);
				}
			})
		}
		$("#tableId").hide();
		$("#countId").show();
	}
}
function getNowFormatDate() {
	// var date = new Date();
	// var seperator1 = "-";
	// var seperator2 = ":";
	// var month = date.getMonth() + 1;
	// var strDate = date.getDate();
	// if (month >= 1 && month <= 9) {
	// month = "0" + month;
	// }
	// if (strDate >= 0 && strDate <= 9) {
	// strDate = "0" + strDate;
	// }
	// var currentdate = date.getFullYear() + seperator1 + month + seperator1
	// + strDate + " " + date.getHours() + seperator2 + date.getMinutes()
	// + seperator2 + date.getSeconds();
	$("#Titled_time").html(path.split(",")[2])
	return path.split(",")[2];
}
// 取消导出
$("#Excellent_cancel").click(function() {
	$("#export").window('close')
})
// 导出功能
$("#Excellent").click(function() {
	var nameText = $("#name_text").val();
	if (nameText == '') {
		if ($('#name_text').val() == '') {
			$('#name_text').validatebox({
				required : true
			});
		}
		$.messager.alert('警告', '有非空字段需要填写，请检查.', 'warning');
		return;
	} else {
		var CSV_cc = $("#cc_csv").combobox('getValue')
		var csv_excel
		if (CSV_cc == 'excel') {
			csv_excel = 'xls'
		} else {
			csv_excel = 'csv'
		}
		$(this).attr('download', nameText + '.' + csv_excel)
		if (CSV_cc == 'excel') {
			return ExcellentExport.excel(this, 'tableId')
		} else {
			return ExcellentExport.csv(this, 'tableId')
		}
	}
	// $(this).attr('download', nameText + '.' + csv_excel)
	// if (CSV_cc == 'excel') {
	// 	return ExcellentExport.excel(this, 'tableId')
	// } else {
	// 	return ExcellentExport.csv(this, 'tableId')
	// }

})
