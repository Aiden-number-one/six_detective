var typeNome = 1;
var thisd; // 用来存储thisGraph信息
var mousX, mousY; // 用来存储鼠标坐标
var zoomDX = 1; // 用来存储缩放比例
var zoomWidth = 1300,
    zoomHeight = 600 // 画布初始宽高
var item_id;
var delay = 0
var Multiselect = false
var name_mumb = 1;
var listdata;
var muduleList = []; //储存任务名
var get16 = function(a, v, p) {
    var pp = {};
    var _t = new Date().getTime() + "";
    var _p = JSON.stringify(p);
    pp._0x0111 = $.base64.encode(_t);
    pp._0x1011 = $.base64.encode(a);
    pp._0x1100 = $.base64.encode(v);
    pp._0x1110 = $.base64.encode(encodeURIComponent(_p));
    pp._0x1001 = $.md5(pp._0x0111 + pp._0x1011 + pp._0x1100 + pp._0x1110).toUpperCase()
    pp._0x1101 = $.base64.encode(document.location.href);
    return pp;
} //get16
var getK = function(a, v, p) { //_params.._version .. _timestamp .. _api_name
    var pp = {};
    var _t = new Date().getTime() + "";
    var _p = JSON.stringify(p);
    pp.KInGDOM = $.base64.encode(_t);
    pp.KINGdOM = $.base64.encode(a);
    pp.KINGDoM = $.base64.encode(v);
    pp.KiNGDOM = $.base64.encode(encodeURIComponent(_p));
    pp.kINGDOM = $.md5(pp.KiNGDOM + pp.KINGDoM + pp.KInGDOM + pp.KINGdOM).toUpperCase()
    pp.KINgDOM = $.base64.encode(document.location.href);
    pp.KINGDOm = $.base64.encode(document.location.protocol);
    return pp;
} //getK
var getL = function(a, v, p) {
    var pp = {};
    var _t = new Date().getTime() + "";
    var _p = JSON.stringify(p);
    pp.css = $.base64.encode(_t);
    pp.android = $.base64.encode(a);
    pp.html = $.base64.encode(v);
    pp.ios = $.base64.encode(encodeURIComponent(_p));
    pp.js = $.md5(pp.ios + pp.android + pp.css + pp.html).toUpperCase()
    pp.wp = $.base64.encode(document.location.href);
    return pp;
} //getL
var getAjaxParams = function(a, v, p) {
    var test_param = {};
    test_param.p = JSON.stringify(p);
    test_param._ts = new Date().getTime();
    return test_param;

} //getAjaxParams
var getApi = function(api_name, api_version, api_params, cbfunc) {
    var param = getAjaxParams(api_name, api_version, api_params);
    var reqUrl = "/retl/rest/admin/" + $.trim(api_version) + "/" + $.trim(api_name) + ".json";
    $.ajax({
        type: "post",
        url: reqUrl,
        dataType: 'json',
        data: param,
        async: true
    }).done(function(data) {
        if (typeof data != "object") {
            data = eval("(" + data + ")")
        }
        if (data.bcjson.flag == "001") {
            document.location.href = "/login.html";
            return false;
        }
        if (cbfunc) {
            cbfunc(data);
        }
    });
}

var saveJobInfo = function(params) {
    var jobInfo = sessionStorage.getItem("jobInfo");
    if (jobInfo) jobInfo = JSON.parse(jobInfo);
    params.job_id = jobInfo.jobId;
    params.job_no = $("[name=job_no]").val();
    params.job_name = $("[name=job_name]").val();
    params.folder_id = $("[name=folderid]").val();
    params.job_desc = $("[name=job_desc]").val();
    params.max_parallel = "";
    params.fault_type = "";
    params.valid_flag = "";
    params.creator = localStorage.getItem('loginName');
    params.operType = "ADD";
    $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_job_info", "v4.0", params, function(data) {
        if (data.bcjson.flag === "1") {
            alert("新增成功");
            $("#J_job_info_modal").modal("hide");
        }
    });
};
// 画布返回信息处理
function backInfo() {
    $.messager.confirm('确认', '是否保存作业信息？', function(r) {
        if (r) {
            if (item_id) {
                thisd.item_id = item_id;
            }
            baseJob(thisd)
            $('#ifBack').val("1"); // 跳转
            if ($('#jf_jobId_input').val().length == 0 &&
                $('#jf_jobName_input').val().length == 0) {
                baseJob(thisd)
            } else {
                $('#jf_win_newJob').window({
                    minimizable: false,
                }).window("open");
                Peony.jobFlow.initSave();
            }
        } else {
            $(location).attr('href', "job/list.action");
            var Rid = $('#folderId_input').combotree('getValue');
            if (Rid.length > 0) {
                window.sessionStorage.setItem('chooseInfo', Rid);
            }
        }
    });

    // 返回后再次查询，部分参数传值
    var folderId;
    if (thisd.folderId) {
        folderId = thisd.folderId;
    } else {
        folderId = GetQueryString("folderId");
    }
    window.sessionStorage.setItem('_folderId', folderId);
    window.sessionStorage.setItem('_ifCheck', $("input[name='ifCheck']").val());
}

function mouseMove(ev) {
    ev = ev || window.event;
    var mousePos = mouseCoords(ev);
    mousX = mousePos.x;
    mousY = mousePos.y;
}

function mouseCoords(ev) {
    if (ev.pageX || ev.pageY) {
        return {
            x: ev.pageX,
            y: ev.pageY
        };
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}

document.onmousemove = mouseMove;

// 最新画布保存方法
function baseJob(thisd) {
    thisd.state.lineFlag = false;
    thisd.svg.classed('s-svg-cursor-liner', false);
    $("#fromResultJob").trigger("click"); // 清空form数据 
    $('#jf_win_newJob').window({
        minimizable: false,
    }).window("open");
    $("#_saveJobType").val("1");
    if (!thisd.name) {
        $("#_ifNew").val("true");
    }
    $('#jf_jobName_input').val(thisd.name);
    $('#jf_jobDe_input').val(thisd.description);
    $('#jf_jobId_input').val(thisd.jobNo);
    $('#job_item_id').val(thisd.item_id);
    var folderId;
    if (thisd.folderId) {
        folderId = thisd.folderId;
    } else {
        folderId = GetQueryString("folderId");
    }
    $("#folderId").val(folderId);
    if (folderId != null && folderId != '') {
        $('#folderId_input').combotree('setValues', folderId);
    }
}

// 另存画布保存方法
function baseSave(thisd) {
    thisd.state.lineFlag = false;
    thisd.svg.classed('s-svg-cursor-liner', false);
    $("#fromResultJob").trigger("click"); // 清空form数据
    $('#jf_win_newJob').window({
        minimizable: false,
    }).window("open");
    $("#_saveJobType").val("2");
    if (!thisd.name) {
        $("#_ifNew").val("true");
    }
    $('#jf_jobName_input').val(thisd.name);
    $('#jf_jobDe_input').val(thisd.description);
    $('#jf_jobId_input').val(thisd.jobNo);
    $('#job_item_id').val(item_id);
    var folderId;
    if (thisd.folderId) {
        folderId = thisd.folderId;
    } else {
        folderId = GetQueryString("folderId");
    }
    $("#folderId").val(folderId);
    if (folderId != null && folderId != '') {
        $('#folderId_input').combotree('setValues', folderId);
    }
}

function baseJobs(thisd) {
    thisd.state.lineFlag = false;
    thisd.svg.classed('s-svg-cursor-liners', false);
    $("#fromResultJobs").trigger("click"); // 清空form数据
    $('#jf_win_newJobs').window({
        minimizable: false,
    }).window("open");

}

function Graphic(svg, xmlDoc) {
    var thisGraph = this;
    // 节点宽度和高度
    thisGraph.rectW = 32;
    thisGraph.rectH = 32;

    thisGraph.name = ''; // job name
    thisGraph.description = '';
    thisGraph.item_id = ''; // job item_id 如果是新建的话 前端生成uuid
    thisGraph.jobNo = ''; // 作业编号

    thisGraph.svg = svg;
    thisGraph.nodes = [];
    thisGraph.edges = [];

    thisGraph.canvas = { // 画布大小管理
        _h: thisGraph.svg.attr('height') || $('#svgbox').height(),
        _w: thisGraph.svg.attr('width') || $('#svgbox').width(),
    }

    // 悬浮工具按钮
    thisGraph.tool_pointer = d3.select('#t-pointer');
    thisGraph.tool_liner = d3.select('#t-line');
    thisGraph.tool_save = d3.select('#t-save');
    // 编辑节点弹窗的命名规则

    thisGraph.formbox = '#nodeformbox';
    thisGraph.forms = '#node_edit'

    // 基本变量初始化完成，xmlDoc开始reappear
    if (xmlDoc) {
        thisGraph.xmlDoc = xmlDoc;
        thisGraph.reappearXmlDoc();
        thisGraph.initCanvas();
    } else {
        thisGraph.xmlDoc = thisGraph.createXmlDoc();
        thisGraph.initCanvas();
    }

    // 辅助状态变量
    thisGraph.state = {
        nodeFlag: false, // 添加node
        lineFlag: false, // 连线
        pointer: true, // 指针释放、可进行拖拽node
        selectedEdge: null, // 被选中的连线
        sNode: null, // 连线源node
        tNode: null, // 连线目标node

        selectedNodes: [], // 1、框选实现多选所需属性 2、 被选中的node
        selectedMore: false,
        sel_startxy: [0, 0], // 款选鼠标开始相对于svg的坐标

        nodesDragFlag: false, // 节点是否被拖动

        copyNodes: [],

        // mouseDownSvgFlag: false,
        // //辅助实现缩放：目的是去掉鼠标拖拽时（框选）的对zoom的影响,因为mousemove会触发zoom事件
    };

    // 撤销恢复功能
    thisGraph.stack = new Undo.Stack(), EditCommand = Undo.Command.extend({
        constructor: function(thisGraph, oldXmlValue, newXmlValue) {
            this.thisGraph = thisGraph;
            this.oldXmlValue = oldXmlValue;
            this.newXmlValue = newXmlValue;
        },
        execute: function() {},
        undo: function() {
            // this.textarea.html(this.oldValue);
            // 撤销恢复旧数据

            thisGraph.xmlDoc = this.oldXmlValue;
            thisGraph.reappearXmlDoc();
            thisGraph.initCanvas();
            thisGraph.update();
        },

        redo: function() {
            thisGraph.xmlDoc = this.newXmlValue;
            thisGraph.reappearXmlDoc();
            thisGraph.initCanvas();
            thisGraph.update();
        }
    });

    thisGraph.stack.execute(new EditCommand(thisGraph, thisGraph.xmlDoc,
        thisGraph.xmlDoc));
    // 撤销恢复功能

    // 绑定键盘事件
    d3.select(window).on('keydown', function() {
        thisGraph.keyDownSvg.call(thisGraph);
    });
    // 画布上添加 可重复使用的箭头（红色、绿色、蓝色）所有连线复用 辅助箭头（黑色）连线过程中使用
    var defs = thisGraph.svg.append('defs');
    defs.append('marker') // green markerUnits="strokeWidth"
        .attr('id', 'end-arrow-S')
        .attr('refX', '29').attr('refY', '6').attr('markerWidth', '12').attr(
            'markerHeight', '12').attr('orient', 'auto').attr('markerUnits',
            'userSpaceOnUse').append('path').attr('fill', '#00a65a').attr('d',
            'M 0 0 L 12 6 L 0 12 z');
    defs.append('marker') // false
        .attr('id', 'end-arrow-F')
        .attr('refX', '29').attr('refY', '6').attr('markerWidth', '12').attr(
            'markerHeight', '12').attr('orient', 'auto').attr('markerUnits',
            'userSpaceOnUse').append('path').attr('fill', '#dd4b39').attr('d',
            'M 0 0 L 12 6 L 0 12 z');
    defs.append('marker') // blue
        .attr('id', 'end-arrow-N')
        // .attr('viewBox','0 0 10 10')
        .attr('refX', '29').attr('refY', '6').attr('markerWidth', '12').attr(
            'markerHeight', '12').attr('orient', 'auto').attr('markerUnits',
            'userSpaceOnUse').append('path').attr('fill', '#0073b7').attr('d',
            'M 0 0 L 12 6 L 0 12 z');
    defs.append('marker') // 拖拽过程中的黑色箭头
        .attr('id', 'dragline-end-arrow').attr('viewBox', '0 0 10 10').attr('refX',
            '5').attr('refY', '5').attr('markerWidth', '5').attr(
            'markerHeight', '5').attr('orient', 'auto').append('path').attr(
            'd', 'M 0 0 L 10 5 L 0 10 z');
    defs.append('marker') // 灰色
        .attr('id', 'end-arrow-disabled')
        // .attr('viewBox','0 0 10 10')
        .attr('refX', '29').attr('refY', '6').attr('markerWidth', '12').attr(
            'markerHeight', '12').attr('orient', 'auto').attr('markerUnits',
            'userSpaceOnUse').append('path').attr('fill', '#cccccc').attr('d',
            'M 0 0 L 12 6 L 0 12 z');
    thisGraph.sel_rect = null;

    thisGraph.svgG = thisGraph.svg.append("g");

    thisGraph.dragLine = thisGraph.svgG.append('path').classed('s-path', true)
        .classed('hidden', true).attr('stroke', 'black').attr('marker-end',
            'url(#dragline-end-arrow)').attr('d', 'M0,0L0,0');

    thisGraph.paths = thisGraph.svgG.append('g').selectAll('g');
    thisGraph.circles = thisGraph.svgG.append('g').selectAll('g');
    // d3拖拽事件绑定
    thisGraph.drag = d3.behavior.drag()
        .on('drag', function(args) {
            thisGraph.dragMove.call(thisGraph, args);
        }).on('dragend', function(args) {
            thisGraph.dragMoveEnd.call(thisGraph, args);
        });
    thisGraph.svg.on('mousedown', function(d) {

        thisGraph.mouseDownSvg.call(thisGraph, d);
    });
    thisGraph.svg.on('mousemove', function(d) {
        thisGraph.mouseMoveSvg.call(thisGraph, d);
    });
    thisGraph.svg.on('mouseup', function(d) {
        thisGraph.mouseUpSvg.call(thisGraph, d);
    });
    $(document).mouseup(function() {
        if (thisGraph.sel_rect) {
            thisGraph.removeMultiple();
        }
        var rects = d3.select('rect[_sel_rect]'); // 鼠标出去svg 未能删除的框选rect
        if (rects.length) {
            rects.remove();
        }

    });
    $("#t-enlarge").click(function() { // 放大
        zoomDX += 0.1;
        if (zoomDX >= 1) {
            zoomDX = 1;
        };
        thisGraph.svgG.attr("transform", "scale(" + zoomDX + ")");
        thisGraph.XYzoom(thisGraph);

    })
    $("#t-narrow").click(function() { // 缩小
        zoomDX -= 0.1;
        if (zoomDX <= 0.5) {
            zoomDX = 0.5;
        };
        thisGraph.svgG.attr("transform", "scale(" + zoomDX + ")");

    })
    // 工具按钮事件
    thisGraph.tool_pointer.on('click', function() {
        thisGraph.state.pointer = true;
        thisGraph.state.lineFlag = false;
        thisGraph.svg.classed('s-svg-cursor-liner', false);
    });
    thisGraph.tool_liner.on('click', function() {
        thisGraph.state.lineFlag = true;
        thisGraph.state.pointer = false;
        thisGraph.svg.classed('s-svg-cursor-liner', true);
    });



    thisd = thisGraph; // 赋值
    $("#t-Saves").on('click', function() {
        item_id = thisGraph.getJobItemId();
        $('#ifBack').val("2");
        baseSave(thisd);
    })

    // });
    $("body").on('click', '#t-save', function() { // 弹框
        // alert(thisd.xmlDoc);
        baseJob(thisd)
        if ($('#jf_jobName_input').val().length == 0) {
            baseJob(thisd);
        } else {
            $('#ifBack').val("2"); // 不跳转
            $('#jf_win_newJob').window({
                minimizable: false,
            }).window("open");
            // saveFlowInfo();
        }
        // $("#J_job_info_modal").modal("show");
    });
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
    // 解绑右键菜单事件
    thisGraph.rMenu = {
        pathM: $('#pathM'),
        nodeM: $('#nodeM'),
        title: $('#title'),
        sort: $('#sort'),
        data: null,
    };
    $('#svgbox').bind("contextmenu", function(e) { // 画布右键菜单改成点击pionter图标的功能
        if (e.target != $('svg.s-svg')[0]) {
            return false;
        }
        e.preventDefault();
        thisGraph.state.pointer = true;
        thisGraph.state.lineFlag = false;
        thisGraph.svg.classed('s-svg-cursor-liner', false);
        // return false;
    });


    $('#nodeM_copy').click(function() { // 复制
        if (thisGraph.state.selectedNodes.length) {
            var nodes = thisGraph.state.selectedNodes;
            thisGraph.state.copyNodes = [];
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].type != 'S') {
                    thisGraph.state.copyNodes.push(nodes[i]);
                }
            }
        }
    });
    $('#nodeM_edit').click(
        function() {
            // $('#t-save').trigger('click');
            // d3.select().node.trigger('dblclick');
            typeNome = thisGraph.state.selectedNodes[0].type;

            thisGraph.nodeDblclick.call(thisGraph,
                thisGraph.state.selectedNodes[0]);
        });

    $('#pathM_delete').click(
        function() {
            thisGraph.edges.splice(thisGraph.edges
                .indexOf(thisGraph.state.selectedEdge), 1);
            thisGraph.state.selectedEdge = null;
            thisGraph.update();
            thisGraph.commands();
        });

    // 节点编辑窗口点击保存按钮事件
    $('#node_edit1').submit(function(e) { // 数据抽取任务
        e.preventDefault();

        if ($("#node_edit1").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit1").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id1").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    // console.log(item_id);
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '1').window('close');
            // 撤销恢复栈数据
            thisGraph.commands();

        }
    });
    $('#node_edit2').submit(function(e) { // 执行sql任务
        e.preventDefault();
        if ($("#node_edit2").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit2").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id2").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '2').window('close');
            thisGraph.commands();
        }
    });
    $('#node_edit3').submit(function(e) { // 变量设置任务
        e.preventDefault();
        if ($("#node_edit3").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit3").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id3").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '3').window('close');

            thisGraph.commands();
        }
    });
    $('#node_edit4').submit(function(e) { // 作业流程
        e.preventDefault();
        if ($("#node_edit4").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit4").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id4").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '4').window('close');

            thisGraph.commands();
        }
    });
    $('#node_edit18').submit(function(e) { // 文件格式转换
        e.preventDefault();
        if ($("#node_edit18").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit18").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id18").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '18').window('close');

            thisGraph.commands();
        }
    });
    $('#node_edit5').submit(function(e) { // 存储过程任务
        e.preventDefault();
        if ($("#node_edit5").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit5").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id5").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '5').window('close');

            thisGraph.commands();
        }
    });
    $('#node_edit6').submit(function(e) { // 外部程序任务
        e.preventDefault();
        if ($("#node_edit6").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit6").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id6").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '6').window('close');

            thisGraph.commands();
        }
    });
    /** ------------新增任务组件提交  ------- */
    $('#node_edit8').submit(function(e) { // 导出文本
        e.preventDefault();

        if ($("#node_edit8").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit8").serializeArray();

            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id8").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '8').window('close');

            thisGraph.commands();
        }
    });
    $('#node_edit9').submit(function(e) { // 发送邮件
        e.preventDefault();
        if ($("#node_edit9").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit9").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id9").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '9').window('close');

            thisGraph.commands();
        }
    });
    $('#node_edit10').submit(function(e) { // 执行Kettle
        e.preventDefault();
        if ($("#node_edit10").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit10").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id10").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    // console.log(item_id);
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '10').window('close');

            thisGraph.commands();
        }
    });
    $('#node_edit11').submit(function(e) { // 执行JS
        e.preventDefault();
        if ($("#node_edit11").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit11").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id11").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    // console.log(item_id);
                    break;
                }
            }
            thisGraph.update();
            // console.log(thisGraph.nodes);
            $(thisGraph.formbox + '11').window('close');

            thisGraph.commands();
        }
    });
    $('#node_edit12').submit(function(e) { // 执行Webserive
        e.preventDefault();
        if ($("#node_edit12").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit12").serializeArray();
            // console.log(formText);
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id12").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    // console.log(item_id);
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '12').window('close');

            thisGraph.commands();
        }
    });

    $('#node_edit13').submit(function(e) { // 数据剖析
        e.preventDefault();
        if ($("#node_edit13").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit13").serializeArray();
            // console.log(formText);
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id13").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            // console.log(thisGraph.nodes);
            $(thisGraph.formbox + '13').window('close');
            thisGraph.commands();
        }
    });
    $('#node_edit14').submit(function(e) { // FTP文件
        e.preventDefault();

        if ($("#node_edit14").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit14").serializeArray();

            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id14").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '14').window('close');

            thisGraph.commands();
        }
    });
    $('#node_edit15').submit(function(e) { // 发送邮件
        e.preventDefault();
        if ($("#node_edit15").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit15").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id15").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '15').window('close');

            thisGraph.commands();
        }
    });

    $('#node_edit16').submit(function(e) { // 压缩打包
        e.preventDefault();
        if ($("#node_edit16").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit16").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id16").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '16').window('close');

            thisGraph.commands();
        }
    });

    $('#node_edit17').submit(function(e) { // 压缩打包
        e.preventDefault();
        if ($("#node_edit17").form('validate')) {
            var nodeName = '';
            var item_id = '';
            var nodeId = '';

            var formText = $("#node_edit17").serializeArray();
            $.each(formText, function(i, ele) {
                var name = ele.name;
                var value = ele.value;
                switch (name) {
                    case 'i_nodeId':
                        nodeId = value;
                        break;
                    case 'i_nodeName':
                        nodeName = value;
                        break;
                    case 'i_nodeItem_id':
                        item_id = value;
                        break;
                }
            });
            var item_name = $("#i_nodeItem_id17").combobox('getText');
            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.item_id = item_id;
                    node.item_name = item_name;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + '17').window('close');

            thisGraph.commands();
        }
    });

    /** ------------新增任务组件提交 ------- */
    $('#node_editL').submit(function(e) { // 等待完成
        e.preventDefault();
        var nodeName = $('#i_nodeNameL').val();
        var nodeId = $('#i_nodeIdL').val();
        var nodeLock = $('#i_nodeItem_idL input:radio:checked').val();
        for (var i = 0; i < thisGraph.nodes.length; i++) {
            var node = thisGraph.nodes[i];
            if (node.id == nodeId) {
                node.name = nodeName;
                node.lock = nodeLock;
                break;
            }
        }
        thisGraph.update();
        $(thisGraph.formbox + 'L').window('close');

        thisGraph.commands();

    });
    // 条件组件编辑提交
    $('#node_editC')
        .submit(
            function(e) { // 条件组件
                e.preventDefault();
                var nodeName = $('#i_nodeNameC').val();
                var nodeId = $('#i_nodeIdC').val();

                var variable_name = joinAttrVal("input[name='i_variable_name']");
                var variable_type = joinAttrVal("select[name='i_variable_type']");
                var variable_value = joinAttrVal("input[name='i_variable_value']");
                var success_condition = joinAttrVal("select[name='i_success_condition']");
                var operation = joinAttrVal("select[name='i_operation']");
                for (var i = 0; i < thisGraph.nodes.length; i++) {
                    var node = thisGraph.nodes[i];
                    if (node.id == nodeId) {
                        node.name = nodeName;
                        node.variable_name = variable_name;
                        node.variable_type = variable_type;
                        node.variable_value = variable_value;
                        node.success_condition = success_condition;
                        node.operation = operation;
                        break;
                    }
                }
                thisGraph.update();
                $(thisGraph.formbox + 'C').window('close');
                thisGraph.commands();
            });

    // 中止组件编辑提交
    $('#node_editI').submit(function(e) { // 中止组件
        e.preventDefault();
        var nodeName = $('#i_nodeNameI').val();
        var nodeId = $('#i_nodeIdI').val();
        var return_message = $('#i_return_message').val();

        for (var i = 0; i < thisGraph.nodes.length; i++) {
            var node = thisGraph.nodes[i];
            if (node.id == nodeId) {
                node.name = nodeName;
                node.return_message = return_message;

                break;
            }
        }
        thisGraph.update();

        $(thisGraph.formbox + 'I').window('close');

        thisGraph.commands();

    });
    // 等待一定时间组件编辑提交
    $('#node_editG').submit(function(e) { // 等待一定时间组件
        if ($("#node_editG").form('validate')) { // 启用校验
            e.preventDefault();
            var nodeName = $('#i_nodeNameG').val();
            var nodeId = $('#i_nodeIdG').val();
            var time_unit = $('#i_time_unit').val();
            var wait_time = $('#i_wait_time').val();

            for (var i = 0; i < thisGraph.nodes.length; i++) {
                var node = thisGraph.nodes[i];
                if (node.id == nodeId) {
                    node.name = nodeName;
                    node.wait_time = wait_time;
                    node.time_unit = time_unit;
                    break;
                }
            }
            thisGraph.update();
            $(thisGraph.formbox + 'G').window('close');

            thisGraph.commands();
        } else {
            return false;
        }
    });
    // 检查文件编辑提交
    $('#nodeformboxF').submit(function(e) { // 检查文件组件
        e.preventDefault();
        var nodeName = $('#i_nodeNameF').val();
        var nodeId = $('#i_nodeIdF').val();
        var i_file_name = $('#i_file_name').val();

        for (var i = 0; i < thisGraph.nodes.length; i++) {
            var node = thisGraph.nodes[i];
            if (node.id == nodeId) {
                node.name = nodeName;
                node.file_name = i_file_name; // 其中node的字段名称和job_flow_template.xml文件中组件字段名称相匹配          

                break;
            }
        }
        thisGraph.update();

        $(thisGraph.formbox + 'F').window('close');

        thisGraph.commands();

    });
    // 成功提交-
    $('#nodeformboxU').submit(function(e) { // 成功组件
        e.preventDefault();
        var nodeName = $('#i_nodeNameU').val();
        var nodeId = $('#i_nodeIdU').val();

        for (var i = 0; i < thisGraph.nodes.length; i++) {
            var node = thisGraph.nodes[i];
            if (node.id == nodeId) {
                node.name = nodeName;

                break;
            }
        }
        thisGraph.update();

        $(thisGraph.formbox + 'U').window('close');
        thisGraph.commands();
    });
};

/**
 * 根据属性名称拼接其属性值
 */
function joinAttrVal(attr) {
    var array = new Array();
    $(attr).each(function() {
        array.push($(this).val());
    });
    return array.join('|');
}

// 画布更新
Graphic.prototype.update = function() {

    var thisGraph = this;

    // 更新node：已经存在的、新增的
    thisGraph.circles = thisGraph.circles.data(thisGraph.nodes, function(d) {
        return d.id
    });
    thisGraph.circles.attr('transform', function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
    thisGraph.circles.selectAll('text').text(function(d) {

        return d.name;
    });
    var addCircles_g = thisGraph.circles.enter().append('g').attr('id',
        function(d) {
            return d.id;
        }).attr('transform', function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

    // 为node添加拖拽事件

    addCircles_g
        .on('mousedown', function(d) {

            thisGraph.mouseDownNode.call(thisGraph, d3.select(this), d);

        })
        .on('click', function(d) {
            d3.event.stopPropagation();
            thisGraph.clickNode.call(thisGraph, d3.select(this), d);

        })
        .on('mouseup', function(d) {
            thisGraph.mouseUpNode.call(thisGraph, d3.select(this), d);
        })
        .call(thisGraph.drag)
        .on('dblclick', function(d) {
            thisGraph.nodeDblclick.call(thisGraph, d);
        })
        .on(
            'contextmenu',
            function(d) {
                // 如果当前是多选节点的状态，右键菜单不需要选中当前节点，如果当前不是那个状态，选中当前node
                if (thisGraph.state.selectedNodes.length == 1) {
                    if (thisGraph.state.selectedNodes[0].type === "S") {
                        return;
                    }
                    thisGraph.nodePreContextMenu.call(thisGraph, d3
                        .select(this), d);
                    thisGraph.rightmenu.call(thisGraph,
                        thisGraph.rMenu.nodeM, d);
                    thisGraph.sortPreContextMenu(thisGraph,
                        thisGraph.state.selectedNodes);
                } else if (thisGraph.state.selectedNodes.length > 1) {
                    thisGraph.sortmenu.call(thisGraph,
                        thisGraph.rMenu.sort, d);
                    thisGraph.sortPreContextMenu(thisGraph,
                        thisGraph.state.selectedNodes);
                }
                $("#title").hide();
                $(".menu-shadow").hide();
            })

        .on(
            'mouseenter',
            function(e) {
                var d = e
                delay = 0;
                e = window.event || e;
                if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
                    e = arguments.callee.caller.arguments[0]
                }
                var de = e.fromElement || e.relatedTarget;
                if (document.all) { // 判断浏览器是否为IE,如果存在document.all则为IE
                    if (!this.contains(de)) { // 判断调用onmouseover的对象(this)是否包含自身或子级，如果包含，则不执行
                        thisGraph.rightmenu1.call(thisGraph,
                            thisGraph.rMenu.title, d);

                        var id = d.item_id; // 获取值
                        if (d.name) {
                            $("#title_name").html(d.name);
                        } else {
                            $("#title_name").html(" ");
                        };
                        if (d.title) {
                            $("#title_type").html(d.title);
                        } else {
                            $("#title_type").html(" ");
                        };
                        $("#title_number").html(d.item_id || "");
                        $("#title_task").html(d.item_name || "");              
                    }
                } else { // 标准浏览器下的方法
                    if (de instanceof Node) {
                        var reg = this.compareDocumentPosition(de);
                    } else {
                        var reg = 0;
                    }
                    if (!(reg == 20 || reg == 0)) {
                        thisGraph.rightmenu1.call(thisGraph,
                            thisGraph.rMenu.title, d);

                        var id = d.item_id; // 获取值
                        if (d.name) {
                            $("#title_name").html(d.name);
                        } else {
                            $("#title_name").html(" ");
                        };
                        if (d.title) {
                            $("#title_type").html(d.title);
                        } else {
                            $("#title_type").html(" ");
                        };
                        if (d.type == 4) {
                            $("#yw_number").html("Job");
                            $("#yw_task").html("Job");
                        } else {
                            $("#yw_number").html("Task");
                            $("#yw_task").html("Task");
                        }

                        $("#title_number").html(d.item_id || "");
                        $("#title_task").html(d.item_name || "");
                    }
                }

            }).on('mouseleave', function(e) {
            delay = 1;
            e = window.event || e;

            if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
                e = arguments.callee.caller.arguments[0]
            }
            var de = e.toElement || e.relatedTarget;
            if (document.all) { // 判断浏览器是否为IE,如果存在document.all则为IE

                if (!this.contains(de)) { // 判断调用onmouseover的对象(this)是否包含自身或子级，如果包含，则不执行
                    $("#title").hide();
                    $(".menu-shadow").hide();
                }
            } else { // 标准浏览器下的方法
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

    addCircles_g.append('rect').classed('s-rect', true).attr('width',
            thisGraph.rectW).attr('height', thisGraph.rectH).attr('rx', 5)
        .attr('ry', 5);
    addCircles_g.append('text').classed('s-text', true).attr('x',
        thisGraph.rectW / 2).attr('y', 15 + thisGraph.rectH).attr(
        'text-anchor', 'middle').text(function(d) {
        var i = thisGraph.getNewOrder(d.type, d.title)
        d.name = d.name == '' || null ? i : d.name;

        return d.name;
    });
    addCircles_g.append('image').attr('width', thisGraph.rectH - 8).attr(
        'height', thisGraph.rectH - 8).attr('x', 4).attr('y', 4).attr(
        "xlink:href",
        function(d) {
            return 'svg/images/icon_type_' + d.type + '.png';
        });
    thisGraph.circles.exit().remove();

    // 更新连线
    thisGraph.paths = thisGraph.paths.data(thisGraph.edges, function(d) {
        return String(d.source.id) + "+" + String(d.target.id);
    });

    // 更新已经存（发生了改变的）连线的path 的箭头以及线、disabled
    thisGraph.paths.selectAll('path').attr(
        'marker-end',
        function(d) {

            if (d.enabled == 'Y') {
                return 'url(' + location.href + '#end-arrow-' +
                    d.conditional + ')';
            } else {
                return 'url(' + location.href + '#end-arrow-disabled)';
            }
        }).classed('s-path', true).attr('stroke', function(d) {
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

    }).attr(
        'd',
        function(d) {
            return 'M' + (d.source.x + thisGraph.rectW / 2) + ',' +
                (d.source.y + thisGraph.rectH / 2) + 'L' +
                (d.target.x + thisGraph.rectW / 2) + "," +
                (d.target.y + thisGraph.rectH / 2);
        });
    // 更新已经存在（发生了改变的）连线的true or false
    thisGraph.paths.selectAll('image').attr("xlink:href", function(d) {
        return 'svg/images/' + d.conditional + '.png'
    }).attr('x', function(d) {
        return (d.source.x + d.target.x + thisGraph.rectW) / 2 - 8;
    }).attr('y', function(d) {
        return (d.target.y + d.source.y + thisGraph.rectH) / 2 - 8;
    });
    // 添加新的path及path true or false
    var addPaths_g = thisGraph.paths.enter().append('g');
    var addPaths = addPaths_g.append('path').attr(
        'marker-end',
        function(d) {
            if (d.enabled == 'Y') {
                return 'url(' + location.href + '#end-arrow-' +
                    d.conditional + ')';
            } else {
                return 'url(' + location.href + '#end-arrow-disabled)';
            }
        }).classed('s-path', true).attr('stroke', function(d) {
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
    }).attr(
        'd',
        function(d) {
            return 'M' + (d.source.x + thisGraph.rectW / 2) + ',' +
                (d.source.y + thisGraph.rectH / 2) + 'L' +
                (d.target.x + thisGraph.rectW / 2) + "," +
                (d.target.y + thisGraph.rectH / 2);
        });

    var addPathsImg = addPaths_g.append('image').attr("xlink:href",
        function(d) {
            return 'svg/images/' + d.conditional + '.png';
        }).attr('x', function(d) {
        return (d.source.x + d.target.x + thisGraph.rectW) / 2 - 8;
    }).attr('y', function(d) {
        return (d.target.y + d.source.y + thisGraph.rectH) / 2 - 8;
    }).attr('width', 16).attr('height', 16);

    addPathsImg.on('click', function(d) { // 点击pathimg 选中path并更改path true
        // false
        var path_select = $(this).siblings('path')[0];
        thisGraph.selectPath.call(thisGraph, d3.select(path_select), d);
        thisGraph.clickPathImg.call(thisGraph, d);
    }).on('contextmenu', function(d) { // pathimg右键菜单 选中path并更改path true false
        var path_select = $(this).siblings('path')[0];
        thisGraph.selectPath.call(thisGraph, d3.select(path_select), d);
        thisGraph.rightmenu.call(thisGraph, thisGraph.rMenu.pathM, d);
    });
    addPaths.on('click', function(d) {
        thisGraph.clickPath.call(thisGraph, d3.select(this), d);
    });

    thisGraph.paths.exit().remove();

    // 给更新后的节点添加事件：右键菜单事件

};

Graphic.prototype.clickNode = function(node, d) {
    d3.event.stopPropagation();
    var thisGraph = this;
    thisGraph.selectNode(node, d);
};

function keyPress(event) {
    Multiselect = true
};

function keyRelease(event) {
    Multiselect = false
};
Graphic.prototype.selectNode = function(node, d) {
    var thisGraph = this;
    thisGraph.removePathFous();
    if (!thisGraph.state.nodesDragFlag) {
        if (Multiselect == false) {
            thisGraph.state.selectedNodes = [];
            thisGraph.state.selectedNodes[0] = d;
            node.classed('s-selected', true);
            thisGraph.circles.filter(function(cd) {
                return cd !== d;
            }).classed('s-selected', false);
        } else {
            thisGraph.state.selectedNodes.push(d);
            node.classed('s-selected', true);
        }

    }
    thisGraph.state.nodesDragFlag = false;
};

// 放大时节点超出宽高缩放
Graphic.prototype.XYzoom = function(thisGraph) {
    nodeXY = thisGraph.nodes
    for (i = 0; i < nodeXY.length; i++) {
        for (j = 0; j < nodeXY.length; j++) {
            if (nodeXY[i].x > nodeXY[j].x) {
                zoomWidth = nodeXY[i].x;
            }
            if (nodeXY[i].y > nodeXY[j].y) {
                zoomHeight = nodeXY[i].y;
            }
        }
        thisGraph.dragMove.call(thisGraph, nodeXY[i])
    }
}

Graphic.prototype.dragMove = function(d) {
    var thisGraph = this;
    if (thisGraph.state.lineFlag) {

        thisGraph.dragLine.attr('d', 'M' + (d.x + thisGraph.rectW / 2) + ',' +
            (d.y + thisGraph.rectH / 2) + 'L' + (d3.event.x) + ',' +
            (d3.event.y));
    } else if (thisGraph.state.pointer) {

        if (thisGraph.state.selectedEdge) {
            thisGraph.removePathFous();
        }
        if (thisGraph.state.selectedNodes.length > 1) {
            if (d) {
                var nodes = thisGraph.state.selectedNodes;
                var len = nodes.length;
                var max_xy = [0, 0];
                for (var i = 0; i < len; i++) {
                    if (d3.event) {
                        nodes[i].x += d3.event.dx;
                        nodes[i].y += d3.event.dy;
                    }
                    if (nodes[i].x < 15) {
                        nodes[i].x = 15;
                    // 控制不拖出边界
                    } else if (nodes[i].x > (thisGraph.canvas._w - thisGraph.rectW)) {
                        thisGraph.canvas._w = zoomWidth + 100;
                        thisGraph.svg.attr('width', thisGraph.canvas._w);
                        $('#svgbox').scrollLeft(thisGraph.canvas._w);
                        if (nodes[i].x > (thisGraph.canvas._w / zoomDX - thisGraph.rectW)) {
                            nodes[i].x = thisGraph.canvas._w / zoomDX - thisGraph.rectW;
                        }
                    }
                    if (nodes[i].y < 0) {
                        nodes[i].y = 0;
                    // 控制不拖出边界
                    } else if (nodes[i].y > (thisGraph.canvas._h - thisGraph.rectH)) {
                        thisGraph.canvas._h = zoomWidth + 100;
                        thisGraph.svg.attr('height', thisGraph.canvas._h);
                        $('#svgbox').scrollTop(thisGraph.canvas._h);
                        if (nodes[i].y > (thisGraph.canvas._h / zoomDX - thisGraph.rectH)) {
                            nodes[i].y = thisGraph.canvas._h / zoomDX - thisGraph.rectH;
                        }
                    }
                    max_xy[0] = Math.max(max_xy[0], nodes[i].x);
                    max_xy[1] = Math.max(max_xy[1], nodes[i].y);
                }
                if (max_xy[0] > (thisGraph.canvas._w - thisGraph.rectW)) {
                    thisGraph.canvas._w = zoomWidth + 100;
                    $('#svgbox').scrollLeft(thisGraph.canvas._w);
                }
                if (max_xy[1] > (thisGraph.canvas._h - thisGraph.rectH)) {
                    thisGraph.canvas._h = zoomWidth + 100;
                    // thisGraph.canvas._h = zoomHeight+100;
                    thisGraph.svg.attr('height', thisGraph.canvas._h);
                    $('#svgbox').scrollTop(thisGraph.canvas._h);
                }
                thisGraph.state.nodesDragFlag = true;
                thisGraph.update();
            }
        } else {
            if (d3.event) {
                d.x += d3.event.dx;
                d.y += d3.event.dy;
            }
            if (d.x < 0) {
                d.x = 0;
            } else if (d.x > (thisGraph.canvas._w - thisGraph.rectW)) {
                thisGraph.canvas._w = zoomWidth + 100;
                // thisGraph.canvas._w = zoomWidth+100;
                // 控制不拖出边界
                if (d.x > (thisGraph.canvas._w / zoomDX - thisGraph.rectW)) {
                    d.x = thisGraph.canvas._w / zoomDX - thisGraph.rectW;
                } 
                thisGraph.svg.attr('width', thisGraph.canvas._w);
                $('#svgbox').scrollLeft(thisGraph.canvas._w);
            }

            if (d.y < 0) {
                d.y = 0;
            } else if (d.y > (thisGraph.canvas._h - thisGraph.rectH)) {
                thisGraph.canvas._h = zoomWidth + 100;
                // thisGraph.canvas._h = zoomHeight+100;
                // 控制不拖出边界
                if (d.y > (thisGraph.canvas._h / zoomDX - thisGraph.rectH)) {
                    d.y = thisGraph.canvas._h / zoomDX - thisGraph.rectH;
                }
                thisGraph.svg.attr('height', thisGraph.canvas._h);

                $('#svgbox').scrollTop(thisGraph.canvas._h);
            }
            thisGraph.update();
        }

    }

};
Graphic.prototype.dragMoveEnd = function(d) {
    var thisGraph = this;
    thisGraph.commands();
}
Graphic.prototype.mouseDownNode = function(node, d) {

    d3.event.stopPropagation();
    var thisGraph = this;
    if (thisGraph.state.lineFlag) {
        thisGraph.state.sNode = d;
        thisGraph.dragLine.classed('hidden', false).attr(
            'd',
            'M' + (d.x + thisGraph.rectW / 2) + ',' +
            (d.y + thisGraph.rectH / 2) + 'L' +
            (d.x + thisGraph.rectW / 2) + ',' +
            (d.y + thisGraph.rectH / 2));
    }

};
// 从节点上抬起时的事件--连线终点判断
Graphic.prototype.mouseUpNode = function(node, d) {

    var thisGraph = this;
    if (thisGraph.state.lineFlag) {
        if (d.type == 'S') {
            $.messager.alert('Sorry', 'START节点只能作为一个作业的开始!');
        } else {
            thisGraph.state.tNode = d;
            thisGraph.dragLine.classed("hidden", true);
            if (thisGraph.state.sNode &&
                thisGraph.state.sNode !== thisGraph.state.tNode) {
                var edges = thisGraph.edges,
                    sNode = thisGraph.state.sNode,
                    tNode = thisGraph.state.tNode;
                var isRepeat = false;
                for (var i = 0; i < edges.length; i++) {
                    var hop = edges[i];
                    if ((sNode == hop.source || sNode == hop.target) &&
                        (tNode == hop.source || tNode == hop.target)) {
                        isRepeat = true;

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

                    thisGraph.commands();
                }
                thisGraph.state.tNode = null;
            }
        }

    }
};

// 将选中节点数组清空，取出选中节点的选中样式
Graphic.prototype.removeNodeFous = function() {
    var thisGraph = this;
    thisGraph.state.selectedNodes = [];
    thisGraph.state.sNode = null;
    thisGraph.circles.classed('s-selected', false);
}
// 将选中连线数组清空，取出选中连线的选中样式
Graphic.prototype.removePathFous = function() {
    var thisGraph = this;
    thisGraph.state.selectedEdge = null;
    thisGraph.paths.selectAll('path').classed('s-selected-path', false);
}

// path单击 更改 ture or false

Graphic.prototype.clickPathImg = function(d) {

    var thisGraph = this;

    if (d.source.type == 'S' || d.target.type == 'S') {
        return false;
    }
    switch (d.conditional) {
        case 'S':
            d.conditional = 'F';
            break;
        case 'F':
            d.conditional = 'N';
            break;
        case 'N':
            d.conditional = 'S';
            break;
    }

    thisGraph.update();

    thisGraph.commands();

}
// 选中连线
Graphic.prototype.selectPath = function(path, d) {
    var thisGraph = this;
    thisGraph.removeNodeFous();
    thisGraph.state.selectedEdge = d;

    path.classed('s-selected-path', true);

    thisGraph.paths.selectAll('path').filter(function(p) {
        return p !== d;
    }).classed('s-selected-path', false);
  

}
// 点击path 切换状态
Graphic.prototype.clickPath = function(path, d) {
    var thisGraph = this;
    thisGraph.removeNodeFous();
    thisGraph.state.selectedEdge = d;

    d.enabled = d.enabled == 'Y' ? 'N' : 'Y';
    thisGraph.update();

    thisGraph.commands();


}
// 捕获键盘事件
Graphic.prototype.keyDownSvg = function() {
    var thisGraph = this;
    switch (d3.event.keyCode) {
        case 46: // 删除事件

            // d3.event.preventDefault();

            if (thisGraph.state.selectedNodes.length) {

                var nodel = thisGraph.state.selectedNodes;
                var index = -1;
                for (var i = 0; i < nodel.length; i++) {
                    if (nodel[i].type == 'S') {
                        index = i;
                    } else {
                        thisGraph.nodes
                            .splice(thisGraph.nodes.indexOf(nodel[i]), 1);
                    }
                }
                if (index >= 0) {
                    nodel.splice(index, 1);
                }

                var spliceEdge = [];
                var edgesl = thisGraph.edges;
                for (var i = 0; i < edgesl.length; i++) {
                    for (var j = 0; j < nodel.length; j++) {
                        if (edgesl[i].source === nodel[j] ||
                            edgesl[i].target === nodel[j]) {
                            spliceEdge.push(edgesl[i]);
                            break;
                        }
                    }
                }

                spliceEdge.forEach(function(l) {
                    thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
                });
                thisGraph.state.selectedNodes = [];
                thisGraph.update();
                thisGraph.commands();
            } else if (thisGraph.state.selectedEdge) {
                thisGraph.edges.splice(thisGraph.edges
                    .indexOf(thisGraph.state.selectedEdge), 1);
                thisGraph.state.selectedEdge = null;
                thisGraph.update();
                thisGraph.commands();
            }
            break;
        case event.ctrlKey && 67: // ctrl+c
            if (thisGraph.state.selectedNodes.length) {
                var nodes = thisGraph.state.selectedNodes;
                thisGraph.state.copyNodes = [];

                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].type != 'S') {
                        thisGraph.state.copyNodes.push(nodes[i]);
                    }
                }
            }
            break;
        case event.ctrlKey && 90: // ctrl+z
            if ($(thisGraph.formbox + typeNome).is(':hidden')) {
                thisGraph.stack.canUndo() && thisGraph.stack.undo();
            }
            // return false;
            break;
        case event.ctrlKey && 89: // ctrl+Y
            if ($(thisGraph.formbox + typeNome).is(':hidden')) {
                thisGraph.stack.canRedo() && thisGraph.stack.redo();
            }
            break;
        case event.ctrlKey && 86: // ctrl + v
            thisGraph.pastNode();
            break;
        case event.ctrlKey && 88: // ctrl + x
            if (thisGraph.state.selectedNodes.length) {
                var nodes = thisGraph.state.selectedNodes;
                thisGraph.state.copyNodes = [];

                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].type != 'S') {
                        thisGraph.state.copyNodes.push(nodes[i]);
                    }
                }
            }
            if (thisGraph.state.selectedNodes.length) {

                var nodel = thisGraph.state.selectedNodes;
                var index = -1;
                for (var i = 0; i < nodel.length; i++) {
                    if (nodel[i].type == 'S') {
                        index = i;
                    } else {
                        thisGraph.nodes
                            .splice(thisGraph.nodes.indexOf(nodel[i]), 1);
                    }
                }
                if (index >= 0) {
                    nodel.splice(index, 1);
                }

                var spliceEdge = [];
                var edgesl = thisGraph.edges;
                for (var i = 0; i < edgesl.length; i++) {
                    for (var j = 0; j < nodel.length; j++) {
                        if (edgesl[i].source === nodel[j] ||
                            edgesl[i].target === nodel[j]) {
                            spliceEdge.push(edgesl[i]);
                            break;
                        }
                    }
                }

                spliceEdge.forEach(function(l) {
                    thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
                });
                thisGraph.state.selectedNodes = [];
                thisGraph.update();
                thisGraph.commands();
            } else if (thisGraph.state.selectedEdge) {
                thisGraph.edges.splice(thisGraph.edges
                    .indexOf(thisGraph.state.selectedEdge), 1);
                thisGraph.state.selectedEdge = null;
                thisGraph.update();
                thisGraph.commands();
            }
            break;
    }
}
// 复制节点--信息包括表单信息也随之被复制
Graphic.prototype.pastNode = function() {
    var thisGraph = this;
    var _copynodes = thisGraph.state.copyNodes;
    thisGraph.removeNodeFous();
    if (_copynodes.length) {
        $.each(_copynodes, function(index) {
            var thisnode = _copynodes[index];
            var newnode = {
                id: thisGraph.getNodeId(),
                type: thisnode.type,
                title: thisnode.title,
                name: thisGraph.getNewOrder(thisnode.type, thisnode.title),
                x: thisnode.x + 30,
                y: thisnode.y + 30,
                execute_flag: 'U'
            }
            if (thisnode.type == 'L') {
                newnode.lock = thisnode.lock;
            } else if (thisnode.type == 'C') {
                newnode.variable_name = thisnode.variable_name;
                newnode.variable_type = thisnode.variable_type;
                newnode.variable_value = thisnode.variable_value;
                newnode.success_condition = thisnode.success_condition;
            } else if (thisnode.type == 'G') {
                newnode.time_unit = thisnode.time_unit;
                newnode.wait_time = thisnode.wait_time;
            } else if (thisnode.type == 'I') {
                newnode.return_message = thisnode.return_message;
            } else if (thisnode.type == 'F') {
                newnode.file_name = thisnode.file_name;
            } else {
                if (thisnode.item_id && thisnode.item_id != '') {
                    newnode.item_id = thisnode.item_id;
                } else {
                    newnode.item_id = '';
                }

            }
            thisGraph.nodes.push(newnode);
            thisGraph.state.selectedNodes.push(newnode);
        });
        thisGraph.update();
        thisGraph.commands();
        $.each(thisGraph.state.selectedNodes, function(index) {
            var _n = thisGraph.state.selectedNodes[index];
            thisGraph.circles.filter(function(cd) {
                return cd.id == _n.id;
            }).classed('s-selected', true);
        });
    }
}
// 设置被选中的节点的样式
Graphic.prototype.selectNodesStyle = function(addNodes) {
    var thisGraph = this;
    thisGraph.update();
    thisGraph.state.selectedNodes = addNodes;
    if (addNodes.length) {
        $.each(thisGraph.state.selectedNodes, function(index) {
            var _n = thisGraph.state.selectedNodes[index];
            thisGraph.circles.filter(function(cd) {
                return cd.id == _n.id;
            }).classed('s-selected', true);
        });
    }
}

// 鼠标在画布上按下--框选事件
Graphic.prototype.mouseDownSvg = function() {
    var thisGraph = this;
    thisGraph.removeNodeFous();
    thisGraph.removePathFous();

    if (!thisGraph.state.lineFlag) {
        thisGraph.state.selectedMore = true;
        thisGraph.state.sel_startxy = d3.mouse(thisGraph.svg.node());
        thisGraph.sel_rect = thisGraph.svgG.append('rect').classed(
                's-sel-rect', true).attr('width', '0').attr('height', '0')
            .attr('_sel_rect', '');
    }
}
// 鼠标在画布上移动事件---框选过程事件
Graphic.prototype.mouseMoveSvg = function() {
    var thisGraph = this;

    if (!thisGraph.state.lineFlag && thisGraph.state.selectedMore) {

        var cu_xy = d3.mouse(thisGraph.svg.node());
        thisGraph.sel_rect.attr('x',
                Math.min(cu_xy[0], thisGraph.state.sel_startxy[0]) / zoomDX)
            .attr(
                'y',
                Math.min(cu_xy[1], thisGraph.state.sel_startxy[1]) /
                zoomDX).attr(
                'width',
                Math.abs(cu_xy[0] - thisGraph.state.sel_startxy[0]) /
                zoomDX).attr(
                'height',
                Math.abs(cu_xy[1] - thisGraph.state.sel_startxy[1]) /
                zoomDX);

    }
}
// 鼠标在画布上抬起--框选结束事件
Graphic.prototype.mouseUpSvg = function(d) {
    var thisGraph = this;
    if (thisGraph.state.lineFlag) {
        thisGraph.dragLine.classed("hidden", true);

    } else if ((!thisGraph.state.lineFlag) && thisGraph.state.selectedMore) {

        var sr_x = thisGraph.sel_rect.attr('x'),
            sr_y = thisGraph.sel_rect
            .attr('y');
        var sr_wx = parseInt(sr_x) + parseInt(thisGraph.sel_rect.attr('width')),
            sr_hy = parseInt(sr_y) +
            parseInt(thisGraph.sel_rect.attr('height'));
        var _nodes = thisGraph.nodes;
        for (var i = 0; i < _nodes.length; i++) {
            var _n = _nodes[i];

            var n_x = _n.x,
                n_y = _n.y;
            var n_wx = n_x + thisGraph.rectW,
                n_hy = n_y + thisGraph.rectH;
            if (n_x < sr_wx && n_wx > sr_x && n_hy > sr_y && n_y < sr_hy) {

                var an = thisGraph.circles.filter(function(cd) {
                    return cd.id == _n.id;
                });
                an.classed('s-selected', true);
                thisGraph.state.selectedNodes.push(_n);
            }
        }

        thisGraph.removeMultiple();
        thisGraph.sortPreContextMenu(thisGraph, thisGraph.state.selectedNodes);
        thisGraph.state.nodesDragFlag = false;

    }

};
// 撤销框选节点
Graphic.prototype.removeMultiple = function() {
    var thisGraph = this;
    thisGraph.state.selectedMore = false;
    if (thisGraph.sel_rect) {
        thisGraph.sel_rect.remove();
        thisGraph.sel_rect = null;
    }

}
// 获取节点uuid
Graphic.prototype.getNodeId = function() {
    var d = new Date().getTime();

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);

        });
    return uuid;
}
// 获取jobId uuid
Graphic.prototype.getJobItemId = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    uuid = uuid.replace(new RegExp("-", "gm"), "");

    return uuid;
}

Graphic.prototype.zoomed = function() {
    var thisGraph = this;
    thisGraph.svgG.attr("transform", "translate(" + d3.event.translate +
        ") scale(" + d3.event.scale + ")");
}
// 连线右键菜单的显示与隐藏
Graphic.prototype.rightmenu = function(ele, d) {

    var thisGraph = this;
    thisGraph.rMenu.data = d;
    var offset = $('#svgbox').offset();
    var _y = d3.event.clientY,
        _x = d3.event.clientX;
    var maxw = $('#svgbox').width() - ele.width();
    var maxh = $('#svgbox').height() - ele.height();
    _x = _x < maxw ? _x : maxw;
    _y = _y < maxh ? _y : maxh;

    var itemEl_true = $('#pathM_true')[0]; // the menu item element
    var item_true = ele.menu('getItem', itemEl_true);
    ele.menu('enableItem', item_true.target);

    $('#pathM_true').unbind();
    $('#pathM_true').on('click', function() {
        thisGraph.pathM_true_click.call(thisGraph);
    });

    var itemEl_false = $('#pathM_false')[0];
    var item_false = ele.menu('getItem', itemEl_false);
    ele.menu('enableItem', item_false.target);
    $('#pathM_false').unbind();
    $('#pathM_false').on('click', function() {
        thisGraph.pathM_false_click.call(thisGraph);
    });

    var itemEl_unconditional = $('#pathM_unconditional')[0];
    var itemEl_unconditional = ele.menu('getItem', itemEl_unconditional);
    ele.menu('enableItem', itemEl_unconditional.target);
    $('#pathM_unconditional').unbind();
    $('#pathM_unconditional').on('click', function() {
        thisGraph.pathM_unconditional_click.call(thisGraph);
    });

    var itemEl_reverse = $('#pathM_reverse')[0];
    var item_reverse = ele.menu('getItem', itemEl_reverse);
    ele.menu('enableItem', item_reverse.target);
    $('#pathM_reverse').unbind();
    $('#pathM_reverse').on('click', function() {
        thisGraph.pathM_reverse_click.call(thisGraph);
    });

    var itemEl_enabled = $('#pathM_enabled')[0];
    var item_enabled = ele.menu('getItem', itemEl_enabled);
    ele.menu('enableItem', item_enabled.target);
    $('#pathM_enabled').unbind();
    $('#pathM_enabled').on('click', function() {
        thisGraph.pathM_enabled_click.call(thisGraph);
    });

    if (d.source && d.source.type == 'S') {
        var itemEl_true = $('#pathM_true')[0]; // the menu item element
        var item_true = ele.menu('getItem', itemEl_true);
        ele.menu('disableItem', item_true.target);
        $('#pathM_true').unbind();

        var itemEl_false = $('#pathM_false')[0];
        var item_false = ele.menu('getItem', itemEl_false);
        ele.menu('disableItem', item_false.target);
        $('#pathM_false').unbind();

        var itemEl_reverse = $('#pathM_reverse')[0];
        var item_reverse = ele.menu('getItem', itemEl_reverse);
        ele.menu('disableItem', item_reverse.target);
        $('#pathM_reverse').unbind();

    }

    ele.menu('show', {
        left: _x,
        top: _y,

    });
    return false;
}

// 鼠标右键对齐菜单的显示与隐藏
Graphic.prototype.sortmenu = function(ele, d) {

    var thisGraph = this;
    thisGraph.rMenu.data = d;
    var _y = d3.event.clientY,
        _x = d3.event.clientX;
    var maxw = $('#svgbox').width() - ele.width();
    var maxh = $('#svgbox').height() - ele.height();
    _x = _x < maxw ? _x : maxw;
    _y = _y < maxh ? _y : maxh;

    ele.menu('show', {
        left: _x,
        top: _y,

    });
    return false;
}

// 鼠标移入菜单的显示与隐藏
Graphic.prototype.rightmenu1 = function(ele, d) {

    var thisGraph = this;
    thisGraph.rMenu.data = d;

    var _y = d3.event.clientY,
        _x = d3.event.clientX;
    var maxw = $('#svgbox').width() - ele.width();
    var maxh = $('#svgbox').height() - ele.height();
    _x = _x < maxw ? _x + 15 : maxw;
    _y = _y < maxh ? _y + 15 : maxh;
    var ts = setTimeout(function() {
        if (delay == '0') {
            ele.menu('show', {
                left: _x,
                top: _y,

            });
        }
    }, 500)
    ele.menu({
        hideOnUnhover: false,

    });
    return false;
}


// 如果传入的xmlDoc为空，新建一个完整的xmlDoc
Graphic.prototype.createXmlDoc = function() {
    var thisGraph = this;
    thisGraph.item_id = thisGraph.getJobItemId();
    var ojob = {
        name: thisGraph.name || '', // 新建作业+作业计数器 （job页面产生，接口传入）
        type: 'S',
        item_id: thisGraph.item_id,
        description: '',
        version: '',
        status: '',
        parallelism_count: '',
        canvas_h: thisGraph.canvas._h,
        canvas_w: thisGraph.canvas._w,

        nodes: thisGraph.nodes,
        edges: thisGraph.edges,
    };

    var xmlDoc;
    try // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    } catch (e) {
        try // Firefox, Mozilla, Opera, etc.
        {
            xmlDoc = document.implementation.createDocument("", "", null);
        } catch (e) {
            alert(e.message)
        }
    }
    var newPI = xmlDoc.createProcessingInstruction("xml",
        'version=\"1.0\" encoding=\"utf-8\"');
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
    // var t_item_name = xmlDoc.createTextNode(ojob.item_name);
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

    var oSerializer = new XMLSerializer();
    var sXML = oSerializer.serializeToString(xmlDoc);

    return sXML;
}
// 更新job的xmlDoc
Graphic.prototype.updateXmlDoc = function() {
    var thisGraph = this;

    var xmlDoc = thisGraph.getXmlDocs(thisGraph.xmlDoc);

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
        edges: thisGraph.edges,
    };

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
        var item_id = '';
        var execute_flag = xmlDoc.createElement('execute_flag');

        var t_name = xmlDoc.createTextNode(node.name);
        var t_type = xmlDoc.createTextNode(node.type);
        var t_title = xmlDoc.createTextNode(node.title);
        var t_xloc = xmlDoc.createTextNode(node.x);
        var t_yloc = xmlDoc.createTextNode(node.y);
        var t_item_id = null;
        var t_item_name = null;
        var t_execute_flag = xmlDoc.createTextNode('U');

        name.appendChild(t_name);
        type.appendChild(t_type);
        title.appendChild(t_title);
        xloc.appendChild(t_xloc);
        yloc.appendChild(t_yloc);
        execute_flag.appendChild(t_execute_flag);

        entry.appendChild(name);
        entry.appendChild(type);
        entry.appendChild(title);
        entry.appendChild(xloc);
        entry.appendChild(yloc);

        if (node.type == 'L') {
            var lock = xmlDoc.createElement('lock-option');

            if (node.lock) {
                var t_lock = xmlDoc.createTextNode(node.lock);
                lock.appendChild(t_lock);
            }
            entry.appendChild(lock);
        } else if (node.type == 'F') {
            var file_names = xmlDoc.createElement('file-name');
            if (node.file_name) {
                var t_file_names = xmlDoc.createTextNode(node.file_name);
                file_names.appendChild(t_file_names);
            }
            entry.appendChild(file_names);
        } else if (node.type == 'C') {
            var variable_name = xmlDoc.createElement('variable-name');
            if (node.variable_name) {
                var t_variable_name = xmlDoc.createTextNode(node.variable_name);
                variable_name.appendChild(t_variable_name);
            }

            var variable_type = xmlDoc.createElement('variable-type');
            if (node.variable_type) {
                var t_variable_type = xmlDoc.createTextNode(node.variable_type);
                variable_type.appendChild(t_variable_type);
            }

            var variable_value = xmlDoc.createElement('value');
            if (node.variable_value) {
                var t_variable_value = xmlDoc
                    .createTextNode(node.variable_value);
                variable_value.appendChild(t_variable_value);
            }

            var success_condition = xmlDoc.createElement('success-condition');
            if (node.success_condition) {
                var t_success_condition = xmlDoc
                    .createTextNode(node.success_condition);
                success_condition.appendChild(t_success_condition);
            }

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
            if (node.return_message) {
                var t_return_messages = xmlDoc
                    .createTextNode(node.return_message);
                return_messages.appendChild(t_return_messages);
            }
            entry.appendChild(return_messages);
        } else if (node.type == 'G') {
            var wait_times = xmlDoc.createElement('wait-time');
            if (node.wait_time) {
                var t_wait_time = xmlDoc.createTextNode(node.wait_time);
                wait_times.appendChild(t_wait_time);
            }

            var time_units = xmlDoc.createElement('time-unit');
            if (node.time_unit) {
                var t_time_unit = xmlDoc.createTextNode(node.time_unit);
                time_units.appendChild(t_time_unit);
            }

            entry.appendChild(wait_times);
            entry.appendChild(time_units);
        } else if (node.type == 'S') {
            // 不做任何处理
        } else {
            item_id = xmlDoc.createElement('item_id');
            if (node.item_id) {
                t_item_id = xmlDoc.createTextNode(node.item_id);
                item_id.appendChild(t_item_id);
            }
            entry.appendChild(item_id);

            item_name = xmlDoc.createElement('item_name');
            if (node.item_name) {
                t_item_name = xmlDoc.createTextNode(node.item_name);
                item_name.appendChild(t_item_name);
            }
            entry.appendChild(item_name);
        }

        if (node.type != 'S') {
            entry.appendChild(execute_flag);
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
    // console.log(xmlDoc);

    var oSerializer = new XMLSerializer();
    var sXML = oSerializer.serializeToString(xmlDoc);

    thisGraph.xmlDoc = sXML;
    // console.log(sXML);
    return sXML;
}

// 根据后台传给的xml重现画布信息
Graphic.prototype.reappearXmlDoc = function() {

    var thisGraph = this;
    thisGraph.nodes = [];
    thisGraph.edges = [];
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
        thisGraph.canvas._w = thisGraph.canvas._w < re_canvas_w ? re_canvas_w :
            thisGraph.canvas._w;
    }
    var xml_canvas_h = xmlDoc.getElementsByTagName('canvas_h')[0];
    if (xml_canvas_h.childNodes[0]) {
        var re_canvas_h = xml_canvas_h.childNodes[0].nodeValue;
        thisGraph.canvas._h = thisGraph.canvas._h < re_canvas_h ? re_canvas_h :
            thisGraph.canvas._h;
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
        var xml_title = nodesXml[i].getElementsByTagName('title')[0];
        if (xml_title.childNodes[0]) {
            titles = xml_title.childNodes[0].nodeValue;
        }

        var xlocation = 50;
        var xml_xlocation = nodesXml[i].getElementsByTagName('xloc')[0];
        if (xml_xlocation.childNodes[0]) {
            xlocation = xml_xlocation.childNodes[0].nodeValue;
        }
        var ylocation = 50;
        var xml_ylocation = nodesXml[i].getElementsByTagName('yloc')[0];
        if (xml_ylocation.childNodes[0]) {
            ylocation = xml_ylocation.childNodes[0].nodeValue;
        }
        xlocation = parseInt(xlocation);
        ylocation = parseInt(ylocation);

        var execute_flags = 'U';

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
                execute_flag: execute_flags
            }
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
                execute_flag: execute_flags
            }
        } else if (types == 'I') {
            var xml_return_message = nodesXml[i]
                .getElementsByTagName('return-message')[0];
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
                execute_flag: execute_flags
            }
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
                execute_flag: execute_flags
            }
        } else if (types == 'C') {
            var xml_variable_name = nodesXml[i]
                .getElementsByTagName('variable-name')[0];
            var variable_name = '';
            if (xml_variable_name.childNodes[0]) {
                variable_name = xml_variable_name.childNodes[0].nodeValue;
            }

            var xml_variable_type = nodesXml[i]
                .getElementsByTagName('variable-type')[0];
            var variable_type = '';
            if (xml_variable_type.childNodes[0]) {
                variable_type = xml_variable_type.childNodes[0].nodeValue;
            }

            var xml_variable_value = nodesXml[i].getElementsByTagName('value')[0];
            var variable_value = '';
            if (xml_variable_value.childNodes[0]) {
                variable_value = xml_variable_value.childNodes[0].nodeValue;
            }

            var xml_success_condition = nodesXml[i]
                .getElementsByTagName('success-condition')[0];
            var success_condition = '';
            if (xml_success_condition.childNodes[0]) {
                success_condition = xml_success_condition.childNodes[0].nodeValue;
            }

            var xml_operation = nodesXml[i].getElementsByTagName('operation')[0];
            var operation = '';
            if (typeof(xml_operation) != "undefined" &&
                xml_operation.childNodes[0]) {
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
                execute_flag: execute_flags
            };

        } else if (types == 'S') {
            node = {
                id: thisGraph.getNodeId(),
                name: names,
                type: types,
                title: titles,
                x: xlocation,
                y: ylocation,
            }
        } else {
            var item_ids = '';
            var xml_item_id = nodesXml[i].getElementsByTagName('item_id')[0];
            if (xml_item_id.childNodes[0]) {
                item_ids = xml_item_id.childNodes[0].nodeValue;
            }

            var item_names = '';
            var xml_item_name = nodesXml[i].getElementsByTagName('item_name')[0];
            if (xml_item_name.childNodes[0]) {
                item_names = xml_item_name.childNodes[0].nodeValue;
            }

            node = {
                id: thisGraph.getNodeId(),
                name: names,
                type: types,
                title: titles,
                item_id: item_ids,
                item_name: item_names,
                x: xlocation,
                y: ylocation,
                execute_flag: execute_flags
            }
        }

        thisGraph.nodes.push(node);
    }
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
        }

        thisGraph.edges.push(edge);
    }
}

// load xml方法
Graphic.prototype.getXmlDocs = function(text) {
    var xmlDoc;
    try // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(text);
    } catch (e) {
        try // Firefox, Mozilla, Opera, etc.
        {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(text, "text/xml");
        } catch (e) {
            alert(e.message)
        }
    }
    return xmlDoc;
}
// 按照顺序获取名字
Graphic.prototype.getNewOrder = function(types, titles) {
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
}

// 导入任务按照编号命名
Graphic.prototype.getImportTaskName = function(taskNumber) {
    var thisGraph = this;
    var nodes = thisGraph.nodes;

    for (var j = 0; j < nodes.length; j++) { // 导入任务名称去重
        if (nodes[j].name == taskNumber) {
            taskNumber += '2';
            continue;
        }
    }
    return taskNumber;
}

// 导入任务按照数组生成连线
Graphic.prototype.getImportTaskHop = function(addNodes, hopType) {
    var thisGraph = this;
    if (addNodes.length >= 2 && hopType != 'D') {
        for (var i = 1; i < addNodes.length; i++) {
            var hop = {
                source: addNodes[i - 1],
                target: addNodes[i],
                enabled: 'Y',
                conditional: hopType
            }
            thisGraph.edges.push(hop);
        }
    }
}

// 初始化画布，根据xml
Graphic.prototype.initCanvas = function() {
    var thisGraph = this;
    $("#Refresh").click(function() { // 页面刷新
        $("#sea_txt").val("")
        thisGraph.circles.classed('s-searCH', false);
    })
    for (var i = 0; i < thisGraph.nodes.length; i++) {
        if (thisGraph.nodes[i].y > (thisGraph.canvas._h - 50)) {
            thisGraph.canvas._h = thisGraph.nodes[i].y + 100
        }
        if (thisGraph.nodes[i].x > (thisGraph.canvas._w - 50)) {
            thisGraph.canvas._w = thisGraph.nodes[i].x + 100
        }
    }
    var existence_list, existence_task, existence_tyekm, existId
    var existence = []
    var existence_task = []
    var existence_condition = []
    $("#sea_but").unbind('click').click(function() {
        thisGraph.circles.classed('s-searCH', false);
        var seaTxt = $("#sea_txt").val().toUpperCase();
        searCH('name', seaTxt, thisGraph.nodes);
    })

    function searCH(name, seaTxt, t_nodes) {
        for (var i = 0; i < t_nodes.length; i++) {
            var thnos = t_nodes[i].name.toUpperCase()
            if (thnos.indexOf(seaTxt) >= 0) {
                var an = thisGraph.circles.filter(function(cd) {
                    return cd.id == t_nodes[i].id;
                });
                an.classed('s-searCH', true);
            }
        }
    }
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].execute_flag != 'undefined') {
            var attri = this.nodes[i]
        }
        existence_list = "<span draggable=\"true\" class='shu1' id=" +
            this.nodes[i].id + " type=" + this.nodes[i].type + " title='" +
            this.nodes[i].title + "'>" + this.nodes[i].name + "</span>"
        existence_tyekm = "icon_type" + this.nodes[i].type;
        existence.push({
            id: this.nodes[i].id,
            text: existence_list,
            iconCls: existence_tyekm,
            attributes: attri,
            checked: true
        });
    }

    $("#sousuo").unbind('click').click(function() {
        var souTxt = $("#sousuo_text").val().toUpperCase();
        for (var i = 0; i < thisGraph.nodes.length; i++) {
            var thno = thisGraph.nodes[i].name.toUpperCase()
            if (thno.indexOf(souTxt) >= 0) {
                Tree_Menu(existence, thisGraph, thisGraph.nodes[i].id)
                break;
            }
        }

    })

    $("#sxin")
        .unbind('click')
        .click(
            function() {
                existence = []
                for (var i = 0; i < thisGraph.nodes.length; i++) {
                    if (thisGraph.nodes[i].execute_flag != 'undefined') {
                        var attri = thisGraph.nodes[i]
                    }
                    existence_list = "<span draggable=\"true\" class='shu1' id=" +
                        thisGraph.nodes[i].id +
                        " type=" +
                        thisGraph.nodes[i].type +
                        " title='" +
                        thisGraph.nodes[i].title +
                        "'>" +
                        thisGraph.nodes[i].name + "</span>"
                    existence_tyekm = "icon_type" +
                        thisGraph.nodes[i].type;
                    existence.push({
                        id: thisGraph.nodes[i].id,
                        text: existence_list,
                        iconCls: existence_tyekm,
                        attributes: attri,
                        checked: true
                    });
                }
                Tree_Menu(existence, thisGraph, existId)
            })
    Tree_Menu(existence, thisGraph, existId)
    thisGraph.svg.attr('height', thisGraph.canvas._h);
    thisGraph.svg.attr('width', thisGraph.canvas._w);
}

// 弹出窗口相关数据和按钮点击功能
Graphic.prototype.saveJobFlowXmlDoc = function() {
    var thisGraph = this;
    thisGraph.jobNo = $('#jf_jobId_input').val();
    thisGraph.name = $('#jf_jobName_input').val();
    thisGraph.description = $('#jf_jobDe_input').val();
    thisGraph.folderId = $('#folderId_input').combobox('getValue');
    thisd = thisGraph;
    $('#jobFlow_xml').val(thisGraph.updateXmlDoc());
    $('#jf_win_newJob').window('close');
}

// 不同组件的节点弹出窗口方法
Graphic.prototype.nodeDblclick = function(d) {
    var thisGraph = this;
    // 取消选中的当前节点
    thisGraph.removeNodeFous();
    thisGraph.state.copyNodes = [];
    // 根据d的type弹出不同的form

    var type = d.type;

    if (type == 'S') { // 开始组件
        return false;
    } else if (type == 'L') { // 等待完成组件
        $(thisGraph.formbox + type).window({
            minimizable: false,
        }).window("open");
        $('#i_nodeIdL').val(d.id);
        $(".validatebox-tip").remove();
        $(".validatebox-invalid").removeClass("validatebox-invalid");
        $('#i_nodeNameL').val(d.name);

        if (d.lock != '' && d.lock != 'undefined') {
            var i = d.lock;
            var inputList = document.getElementsByName("lockOption");
            for (var x = 0; x < inputList.length; x++) {
                inputList[x].checked = false; // 取消选中
            }
            var input = document.getElementById("input" + i);
            input.checked = true;
        } else { // 默认选中第二个 
            var input = document.getElementById("input2");
            input.checked = true; // 选中第二个
        }

    } else if (type == 'I') { // 中止组件
        $(thisGraph.formbox + type).window({
            minimizable: false,
        }).window("open");
        $('#node_edit' + type).form('clear');
        $('#i_nodeIdI').val(d.id);
        $(".validatebox-tip").remove();
        $(".validatebox-invalid").removeClass("validatebox-invalid");
        $('#i_nodeNameI').val(d.name);

        if (d.return_message != '') {
            $('#i_return_message').val(d.return_message);
        }

    } else if (type == 'F') { // 检查文件组件
        $(thisGraph.formbox + type).window({
            minimizable: false,
        }).window("open");
        $('#node_edit' + type).form('clear');
        $('#i_nodeIdF').val(d.id);
        $(".validatebox-tip").remove();
        $(".validatebox-invalid").removeClass("validatebox-invalid");
        $('#i_nodeNameF').val(d.name);
        if (d.file_name != '') {
            $('#i_file_name').val(d.file_name);
        }

    } else if (type == 'G') { // 等待一定时间组件
        $(thisGraph.formbox + type).window({
            minimizable: false,
        }).window("open");
        $('#i_nodeIdG').val(d.id);
        $(".validatebox-tip").remove();
        $(".validatebox-invalid").removeClass("validatebox-invalid");
        $('#i_nodeNameG').val(d.name);
        if (d.wait_time != '' && d.wait_time != 'undefined') {
            $('#i_wait_time').val(d.wait_time);
            $('#i_time_unit').val(d.time_unit);
        } else {
            $('#i_wait_time').val('0');
        }

    } else if (type == 'C') { // 条件判断组件--弹出条件校验窗口
        $(thisGraph.formbox + type).window({
            minimizable: false,
        }).window("open");
        $('#node_edit' + type).form('clear');
        $('#i_nodeIdC').val(d.id);
        $('#i_nodeNameC').val(d.name);

        $(".validatebox-tip").remove();
        $(".validatebox-invalid").removeClass("validatebox-invalid");
        rowCount = 0;
        delAllLine(true);
        var sep = "|"; // 分隔符
        var nameArr = d.variable_name.split(sep);
        for (var i = 0; i < nameArr.length; i++) {
            var array = new Array();
            array.variableName = nameArr[i];
            array.variableType = d.variable_type.split(sep)[i];
            array.value = d.variable_value.split(sep)[i];
            array.successCondition = d.success_condition.split(sep)[i];
            if (typeof(d.operation) != "undefined") {
                array.operation = d.operation.split(sep)[i];
            } else {
                array.operation = "";
            }
            addLineCondition(i, array);
        }
    } else if (type == 'U') { // 成功组件
        $(thisGraph.formbox + type).window({
            minimizable: false,
        }).window("open");
        $('#node_edit' + type).form('clear');
        $('#i_nodeIdU').val(d.id);
        $(".validatebox-tip").remove();
        $(".validatebox-invalid").removeClass("validatebox-invalid");
        $('#i_nodeNameU').val(d.name);
    } else { // 任务组件
        $(thisGraph.formbox + type).window({
            minimizable: false,
        }).window("open");
        $('#node_edit' + type).form('clear');
        $(".validatebox-tip").remove();
        $(".validatebox-invalid").removeClass("validatebox-invalid");

        var formDom = $(thisGraph.forms + type);
        var dataObj = {};
        dataObj.i_nodeId = d.id;
        dataObj.i_nodeName = d.name;
        formDom.form('myLoad', dataObj);
        // 设置节点名称，暂时
        $('#i_nodeName' + d.type).val(d.name);
        var nodeItemIdDom = $('#i_nodeItem_id' + d.type);
        // 查询任务菜单
        var getTree_ = function() {
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_folder_menu", "v4.0", {
                fileType: "2",
            }, function(data) {
                if (data.bcjson.flag == "1") {
                    var menus = kd.generateTreeData("", data.bcjson.items, "foldName", "folderId");
                    menus = menus.replace(',"children":', '').replace(/},]/g, "}]");
                    $('[name="folderId"]').combotree({
                        data: JSON.parse(menus),
                       
                    });
                }
            });
        };
        // 查询任务下拉框信息
        var getTask = function(taskType) {
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_task_info", "v4.0", {
                taskType: taskType
            }, function(data) {
                if (data.bcjson.flag === "1") {
                    var items = data.bcjson.items;
                    var arr = [];
                    for (var i = 0; i < items.length; i++) {
                        arr.push({ "text": items[i].taskName + "（" + items[i].folderName + "）", "id": items[i].taskId });
                    }
                    nodeItemIdDom.combobox({
                        panelHeight: '200px', //自适应
                        valueField: 'id', //绑定字段ID
                        textField: 'text', //绑定字段Name
                        data: arr,
                    });
                    nodeItemIdDom.combobox('select', d.item_id);
                }
            });
        };

        // 查询作业下拉框信息
        var getWork = function() {
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_jobs_list", "v4.0", {}, function(data) {
                if (data.bcjson.flag === "1") {
                    var items = data.bcjson.items;
                    var arr = [];
                    for (var i = 0; i < items.length; i++) {
                        arr.push({ "text": items[i].jobName + "（" + items[i].folderName + "）", "id": items[i].jobId });
                    }
                    nodeItemIdDom.combobox({
                        panelHeight: '200px', //自适应
                        valueField: 'id', //绑定字段ID
                        textField: 'text', //绑定字段Name
                        data: arr,
                    });
                    nodeItemIdDom.combobox('select', d.item_id);
                }
            });
        };

        // 查询tasktype
        let getTaskType = function() {
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_dict_data_list", "v4.0", {}, function(data) {
                if (data.bcjson.flag == "1") {
                    var items = data.bcjson.items[0];
                    for (var i in items.TASK_TYPE) {
                        if (items.TASK_TYPE[i] === d.title) {
                            getTask(i);
                        }
                    }
                } else {
                    // toastr.error(data.bcjson.msg);
                }
            });
        }

        if (d.title === "作业流程") {
            getWork();
        } else {
            getTaskType();
        }
    }
}

Graphic.prototype.sortPreContextMenu = function(d, node) {
    var thisGraph = d
    var xz = []
    var yz = []
    var nodes = node
    var pushnode = []
    for (i = 0; i < node.length; i++) {
        xz.push(node[i].x);
        yz.push(node[i].y);
    }
    var _xzx = Math.min.apply(Math, xz)
    var _yzx = Math.min.apply(Math, yz)
    var _xzd = Math.max.apply(Math, xz)
    var _yzd = Math.max.apply(Math, yz)

    // 水平分散
    $(".x_Dispersed").unbind("click").click(function() {
        var d
        for (i = 0; i < nodes.length; i++) {
            for (j = 0; j < nodes.length; j++) {
                if (nodes[i].x < nodes[j].x) {
                    d = nodes[j];
                    nodes[j] = nodes[i];
                    nodes[i] = d;
                }
            }
        }
        var sp = Math.round((_xzd - _xzx) / (nodes.length - 1))
        for (i = 0; i < nodes.length; i++) {
            nodes[i].x = ((sp * i) + _xzx);
            thisGraph.dragMove.call(thisGraph, nodes[i]);
        }
        sp = 0;
        nodes = [];
        thisGraph.circles.classed('s-selected', false);
    });
    // 垂直分散
    $(".y_Dispersed").unbind("click").click(function() {

        var d
        for (i = 0; i < nodes.length; i++) {
            for (j = 0; j < nodes.length; j++) {
                if (nodes[i].y < nodes[j].y) {
                    d = nodes[j];
                    nodes[j] = nodes[i];
                    nodes[i] = d;
                }
            }
        }
        var sp1 = Math.round((_yzd - _yzx) / (nodes.length - 1))
        for (i = 0; i < nodes.length; i++) {
            nodes[i].y = ((sp1 * i) + _yzx);

            thisGraph.dragMove.call(thisGraph, nodes[i]);
        }

        sp1 = 0;
        nodes = [];
        thisGraph.circles.classed('s-selected', false);
    });
    // 上对齐
    $(".s_alignment").unbind("click").click(function() {
        for (i = 0; i < nodes.length; i++) {
            nodes[i].y = _yzx;
            thisGraph.dragMove.call(thisGraph, nodes[i]);
        }
        nodes = [];
        thisGraph.circles.classed('s-selected', false);
    });

    // 下对齐
    $(".x_alignment").unbind("click").click(function() {
        for (i = 0; i < nodes.length; i++) {
            nodes[i].y = _yzd;
            thisGraph.dragMove.call(thisGraph, nodes[i]);
        }
        nodes = [];
        thisGraph.circles.classed('s-selected', false);
    });

    // 左对齐
    $(".z_alignment").unbind("click").click(function() {

        for (i = 0; i < nodes.length; i++) {
            nodes[i].x = _xzx;
            thisGraph.dragMove.call(thisGraph, nodes[i]);
        }
        nodes = [];
        thisGraph.circles.classed('s-selected', false);
    });

    // 右对齐
    $(".y_alignment").click(function() {
        for (i = 0; i < nodes.length; i++) {
            nodes[i].x = _xzd;
            thisGraph.dragMove.call(thisGraph, nodes[i]);
        }
        nodes = [];
        thisGraph.circles.classed('s-selected', false);
    });
    // 剪切
    $(".Shear").unbind("click").click(
        function() {
            if (thisGraph.state.selectedNodes.length) {
                var nodes = thisGraph.state.selectedNodes;
                thisGraph.state.copyNodes = [];
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].type != 'S') {
                        thisGraph.state.copyNodes.push(nodes[i]);
                    }
                }
            }

            if (thisGraph.state.selectedNodes.length) {

                var nodel = thisGraph.state.selectedNodes;
                var index = -1;
                for (var i = 0; i < nodel.length; i++) {
                    if (nodel[i].type == 'S') {
                        index = i;
                    } else {
                        thisGraph.nodes.splice(thisGraph.nodes
                            .indexOf(nodel[i]), 1);
                    }
                }
                if (index >= 0) {
                    nodel.splice(index, 1);
                }

                var spliceEdge = [];
                var edgesl = thisGraph.edges;
                for (var i = 0; i < edgesl.length; i++) {
                    for (var j = 0; j < nodel.length; j++) {
                        if (edgesl[i].source === nodel[j] ||
                            edgesl[i].target === nodel[j]) {
                            spliceEdge.push(edgesl[i]);
                            break;
                        }
                    }
                }

                spliceEdge.forEach(function(l) {
                    thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
                });
                thisGraph.state.selectedNodes = [];
                thisGraph.update();
                thisGraph.commands();
            } else if (thisGraph.state.selectedEdge) {
                thisGraph.edges.splice(thisGraph.edges
                    .indexOf(thisGraph.state.selectedEdge), 1);
                thisGraph.state.selectedEdge = null;
                thisGraph.update();
                thisGraph.commands();
            };
            thisGraph.circles.classed('s-selected', false);
        });
    // 复制
    $(".Copy").unbind("click").click(function() {
        if (thisGraph.state.selectedNodes.length) {
            localStorage.clear();
            var nodes = thisGraph.state.selectedNodes;
            var copyDetails = '';
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].type != 'S') {
                    if (copyDetails == '') {
                        copyDetails = JSON.stringify(nodes[i]);
                    } else {
                        copyDetails = copyDetails + ";" + JSON.stringify(nodes[i]);
                    }
                }
            }
            localStorage.setItem('nodes', copyDetails);
        }
        thisGraph.circles.classed('s-selected', false);
    });
    // 粘贴
    $(".Paste").unbind("click").click(function() {
        var nodes = localStorage.getItem('nodes');
        var nodesArr = [];
        if (nodes != null && nodes != '') {
            nodesArr = nodes.split(";");
            thisGraph.state.copyNodes = [];
            for (var i = 0; i < nodesArr.length; i++) {
                thisGraph.state.copyNodes.push(JSON.parse(nodesArr[i]));
            }
            thisGraph.pastNode();
        }
        thisGraph.circles.classed('s-selected', false);
    });
    // 删除
    $(".Delete").unbind("click").click(
        function() {
            //              console.log(thisGraph.state.selectedNodes)
            if (thisGraph.state.selectedNodes.length) {

                var nodel = thisGraph.state.selectedNodes;
                var index = -1;
                for (var i = 0; i < nodel.length; i++) {
                    if (nodel[i].type == 'S') {
                        index = i;
                    } else {
                        thisGraph.nodes.splice(thisGraph.nodes
                            .indexOf(nodel[i]), 1);
                    }
                }
                if (index >= 0) {
                    nodel.splice(index, 1);
                }

                var spliceEdge = [];
                var edgesl = thisGraph.edges;
                for (var i = 0; i < edgesl.length; i++) {
                    for (var j = 0; j < nodel.length; j++) {
                        if (edgesl[i].source === nodel[j] ||
                            edgesl[i].target === nodel[j]) {
                            spliceEdge.push(edgesl[i]);
                            break;
                        }
                    }
                }

                spliceEdge.forEach(function(l) {
                    thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
                });
                thisGraph.state.selectedNodes = [];
                thisGraph.update();
                thisGraph.commands();
            } else if (thisGraph.state.selectedEdge) {
                thisGraph.edges.splice(thisGraph.edges
                    .indexOf(thisGraph.state.selectedEdge), 1);
                thisGraph.state.selectedEdge = null;
                thisGraph.update();
                thisGraph.commands();
            };
            thisGraph.circles.classed('s-selected', false);
        });

}

Graphic.prototype.nodePreContextMenu = function(node, d) {
    var thisGraph = this;

    if (thisGraph.state.selectedNodes.length <= 1) {
        thisGraph.selectNode(node, d);
    }
}

Graphic.prototype.pathM_true_click = function() {
    var thisGraph = this;
    thisGraph.state.selectedEdge.conditional = 'S';
    thisGraph.update();
    thisGraph.commands();
}
Graphic.prototype.pathM_false_click = function() {
    var thisGraph = this;
    thisGraph.state.selectedEdge.conditional = 'F';
    thisGraph.update();
    thisGraph.commands();
}
Graphic.prototype.pathM_reverse_click = function() {
    var thisGraph = this;
    var source = thisGraph.state.selectedEdge.target;
    var target = thisGraph.state.selectedEdge.source;

    // 反转的时候等待完成组件判断（从任何状态变为成功状态）
    if (source.type == 'L') {
        thisGraph.state.selectedEdge.conditional = 'S';
    }

    thisGraph.state.selectedEdge.source = source;
    thisGraph.state.selectedEdge.target = target;
    thisGraph.update();
    thisGraph.commands();
}

Graphic.prototype.pathM_enabled_click = function() {
    var thisGraph = this;
    var en = thisGraph.state.selectedEdge.enabled;
    thisGraph.state.selectedEdge.enabled = en == 'Y' ? 'N' : 'Y';
    thisGraph.update();
    thisGraph.commands();
}

Graphic.prototype.pathM_unconditional_click = function() {
    var thisGraph = this;
    thisGraph.state.selectedEdge.conditional = 'N';
    thisGraph.update();
    thisGraph.commands();
}

// 撤销恢复栈的管理
Graphic.prototype.commands = function() {
    var thisGraph = this;
    var oldXml = thisGraph.xmlDoc;
    var newXml = thisGraph.updateXmlDoc();
    if (oldXml != newXml) {
        thisGraph.stack.execute(new EditCommand(thisGraph, oldXml, newXml));

    }
}

function Tree_Menu(existence, thisGraph, existId) {
    var leftW = 45;
    var headerH = 0; // 头部标签高度
    // 静态数据
    // var data = [{ "icon": "svg/images/icon_type_2.png", "title": "执行SQL", "type": "2" }, { "icon": "svg/images/icon_type_3.png", "title": "变量设置", "type": "3" }, { "icon": "svg/images/icon_type_4.png", "title": "作业流程", "type": "4" }, { "icon": "svg/images/icon_type_5.png", "title": "存储过程", "type": "5" }, { "icon": "svg/images/icon_type_6.png", "title": "外部程序", "type": "6" }, { "icon": "svg/images/icon_type_G.png", "title": "等待", "type": "G" }, { "icon": "svg/images/icon_type_I.png", "title": "中止", "type": "I" }, { "icon": "svg/images/icon_type_L.png", "title": "阻塞", "type": "L" }, { "icon": "svg/images/icon_type_C.png", "title": "条件判断", "type": "C" }, { "icon": "svg/images/icon_type_1.png", "title": "数据抽取", "type": "1" }, { "icon": "svg/images/icon_type_8.png", "title": "导出文本", "type": "8" }, { "icon": "svg/images/icon_type_9.png", "title": "邮件", "type": "9" }, { "icon": "svg/images/icon_type_10.png", "title": "执行Kettle", "type": "10" }, { "icon": "svg/images/icon_type_F.png", "title": "检查文件", "type": "F" }, { "icon": "svg/images/icon_type_U.png", "title": "成功", "type": "U" }, { "icon": "svg/images/icon_type_11.png", "title": "执行JS语句", "type": "11" }, { "icon": "svg/images/icon_type_12.png", "title": "执行Webservice", "type": "12" }, { "icon": "svg/images/icon_type_13.png", "title": "数据剖析", "type": "13" }, { "icon": "svg/images/icon_type_14.png", "title": "FTP传输", "type": "14" }];
    // var data = [];

    // 获取左侧操作模块
    $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_module_info_list", "v4.0", {
        module_type: 1
    }, function(data) {
        if (data.bcjson.flag === "1") {
            var items = data.bcjson.items;
            let arr = [];
            for (var i = 0; i < items.length; i++) {
                arr.push({
                    icon: "svg/images/" + items[i].icon,
                    title: items[i].trans_type_name,
                    type: items[i].trans_type
                });
            }
            data = arr;
            sessionStorage.setItem("job_module", JSON.stringify(arr));
            var temp_list, tyekm, temp_t, temp_c, temp_ta, temp_co;
            var temp = []
            var temp_task = [];
            var temp_condition = [];
            for (var i = 0; i < data.length; i++) {
                temp_list = "<span draggable=\"true\" class='shu' type=" +
                    data[i].type +
                    " title='" +
                    data[i].title +
                    "'>" + data[i].title + "</span>"
                tyekm = "icon_type" + data[i].type;
                temp.push({
                    text: temp_list,
                    iconCls: tyekm
                });
                if (data[i].type.match(/^[0-9]*$/)) {
                    temp_t = "<span draggable=\"true\" class='shu' type=" +
                        data[i].type +
                        " title='" +
                        data[i].title +
                        "'>" + data[i].title + "</span>"
                    temp_ta = "icon_type" + data[i].type;
                    temp_task.push({
                        text: temp_list,
                        iconCls: temp_ta
                    });
                } else {
                    temp_c = "<span draggable=\"true\" class='shu' type=" +
                        data[i].type +
                        " title='" +
                        data[i].title +
                        "'>" + data[i].title + "</span>"
                    temp_co = "icon_type" + data[i].type;
                    temp_condition.push({
                        text: temp_list,
                        iconCls: temp_co
                    });
                }
            }
            $('#tt1').tree({ // 节点对象
                animate: true,
                data: [{
                    "id": 0,
                    "text": "节点对象",
                    "children": existence,

                }],
                onDblClick: function(node) { // 双击左侧画布节点事件
                    if (node.attributes != undefined) {
                        thisGraph.nodeDblclick.call(
                            thisGraph,
                            node.attributes);
                    }
                },
                onClick: function(node) { // 单击对应右边画布选中状态
                    thisGraph.circles.classed(
                        's-selected', false);
                    var an = thisGraph.circles
                        .filter(function(cd) {
                            return cd.id == node.attributes.id;
                        });
                    an.classed('s-selected', true);
                },
                onLoadSuccess: function() {
                    var nodedd = $('#tt1').tree('find',
                        existId);
                    if (nodedd) {
                        $('#tt1').tree('select',
                            nodedd.target);
                    }

                }
            })

            $('#temp_task').tree({ // 作业组件
                // url:'job/moduleList.action?type=1',
                // method:'get',
                animate: true,
                data: [{
                    "id": 0,
                    "text": "Work Component",
                    "children": [{
                        "id": 1,
                        "text": "All",
                        "children": temp
                    }, {
                        "id": 2,
                        "text": "Task",
                        "state": "closed",
                        "children": temp_task
                    }, {
                        "id": 3,
                        "text": "Condition",
                        "state": "closed",
                        "children": temp_condition
                    }]
                }],
                onLoadSuccess: function() { // 左侧添加节点事件
                    var drag_domnodes = $('.shu');
                    var drag_domnode
                    drag_domnode_draging(drag_domnodes);

                    function drag_domnode_draging(
                        drag_domnodes) {
                        for (var i = 0; i < drag_domnodes.length; i++) {
                            drag_domnodes[i].ondragstart = function(
                                e) {
                                e.dataTransfer.effectAllowed = "move";
                                e.dataTransfer.setData(
                                    "text",
                                    this.innerHTML);
                                drag_domnode = e.target;
                                return true;
                            }
                            drag_domnodes[i].ondragend = function(
                                e) {
                                try {
                                    e.dataTransfer
                                        .clearData("text");
                                } catch (err) {};
                                drag_domnode = null;
                                return false;
                            }
                        }
                    }
                    var _osvg = $('#svgbox>svg')[0];
                    var svgbox = $('#svgbox');
                    _osvg.ondragover = function(e) {
                        e.preventDefault();
                        return true;
                    };
                    _osvg.ondrop = function(e) {
                        if (drag_domnode != undefined) {
                            var xlocation = e.clientX -
                                leftW +
                                (svgbox
                                    .scrollLeft() - _osvg.style.width) -
                                graphic.rectW / 2 -
                                230;
                            var ylocation = e.clientY -
                                headerH +
                                (svgbox
                                    .scrollTop() - _osvg.style.height) -
                                graphic.rectH / 2;
                            var types = drag_domnode
                                .getAttribute('type');
                            var titles = drag_domnode
                                .getAttribute('title');
                            var isAdd = false;
                            if (types == 'S') {
                                var nodes = graphic.nodes;
                                var isExist = false;
                                for (var i = 0; i < nodes.length; i++) {
                                    if (nodes[i].type == 'S') {
                                        isExist = true;
                                        break;
                                    }
                                }
                                if (isExist) {
                                    $.messager
                                        .alert(
                                            '提示',
                                            '一个作业中只能有一个开始节点!');
                                } else {
                                    graphic.nodes
                                        .push({
                                            id: graphic
                                                .getNodeId(),
                                            name: titles,
                                            type: types,
                                            title: titles,
                                            x: xlocation,
                                            y: ylocation
                                        });
                                    isAdd = true;
                                }
                            } else if (types == 'L') {
                                graphic.nodes
                                    .push({
                                        id: graphic
                                            .getNodeId(),
                                        name: graphic
                                            .getNewOrder(
                                                types,
                                                titles),
                                        type: types,
                                        title: titles,
                                        lock: '',
                                        x: xlocation,
                                        y: ylocation,
                                        execute_flag: 'U'
                                    });
                                isAdd = true;
                            } else if (types == 'I') {
                                graphic.nodes
                                    .push({
                                        id: graphic
                                            .getNodeId(),
                                        name: graphic
                                            .getNewOrder(
                                                types,
                                                titles),
                                        type: types,
                                        title: titles,
                                        return_message: '',
                                        x: xlocation,
                                        y: ylocation,
                                        execute_flag: 'U'
                                    });
                                isAdd = true;
                            } else if (types == 'G') {
                                graphic.nodes
                                    .push({
                                        id: graphic
                                            .getNodeId(),
                                        name: graphic
                                            .getNewOrder(
                                                types,
                                                titles),
                                        type: types,
                                        title: titles,
                                        wait_time: '',
                                        time_unit: 'S',
                                        x: xlocation,
                                        y: ylocation,
                                        execute_flag: 'U'
                                    });
                                isAdd = true;
                            } else if (types == 'C') {
                                graphic.nodes
                                    .push({
                                        id: graphic
                                            .getNodeId(),
                                        name: graphic
                                            .getNewOrder(
                                                types,
                                                titles),
                                        type: types,
                                        title: titles,
                                        variable_name: '',
                                        variable_type: '',
                                        variable_value: '',
                                        success_condition: '',
                                        x: xlocation,
                                        y: ylocation,
                                        execute_flag: 'U'
                                    });
                                isAdd = true;
                            } else if (types == 'F') { // 检查文件组件
                                graphic.nodes
                                    .push({
                                        id: graphic
                                            .getNodeId(),
                                        name: graphic
                                            .getNewOrder(
                                                types,
                                                titles),
                                        type: types,
                                        title: titles,
                                        file_name: '',
                                        x: xlocation,
                                        y: ylocation,
                                        execute_flag: 'U'
                                    });
                                isAdd = true;
                            } else {
                                graphic.nodes
                                    .push({
                                        id: graphic
                                            .getNodeId(),
                                        name: graphic
                                            .getNewOrder(
                                                types,
                                                titles),
                                        type: types,
                                        title: titles,
                                        item_id: '',
                                        x: xlocation,
                                        y: ylocation,
                                        execute_flag: 'U'
                                    });
                                isAdd = true;

                            }
                            if (isAdd) {
                                graphic.update();
                                graphic.commands();
                            }

                            return false;
                        };
                        _osvg
                            .addEventListener(
                                "dragover",
                                function(e) {
                                    e
                                        .stopPropagation();
                                    e
                                        .preventDefault();
                                }, false);
                        // 拖拽添加节点
                    }
                }
            });
        } else {
            alert(data.bcjson.msg);
        }
    });
}

$("#tab_Label li").click(
    function() {
        $("#tab_Label li").eq($(this).index()).addClass("tab_li")
            .siblings().removeClass('tab_li');
        $("#tab_div").children().hide().eq($(this).index()).show();
        if ($(this).index() == 0) {
            $("#ssou").hide()
        } else if ($(this).index() == 1) {
            $("#ssou").show()
        }
    })
$(function() {
    Tree_Menu();
    // 下拉树形控制
    $("body").on("click", "[type=jstree]", function(e) {
        e.stopPropagation();
    });
    $("body").on("click", "[type=jstree] .jstree-anchor", function() {
        $(this).parents("[type=jstree]").siblings("input[type=hidden]").val($(this).parent().attr("folderid"));
        $(this).parents("[type=jstree]").siblings(".dropdown-toggle").val($(this).text()).attr("aria-expanded", "false").parent().removeClass("open");
    });
})
// 禁止火狐下拖拽弹窗
document.body.ondrop = function(event) {
    event.preventDefault();
    event.stopPropagation();
}

function addTab(title, url) {
    var jq = top.jQuery;
    var tab_wrap = jq('#main_tab_box');
    var content = '<iframe  frameborder="0" src="' +
        url +
        '" style="display:block;width:100%;height:100%;" border="0" marginwidth="0" marginheight="0" scrolling="no" ></iframe>';
    tab_wrap.tabs('add', {
        title: title,
        content: content,
        closable: true
    });
}
/**
 * 获取项目的绝对路径
 * 
 * @returns {String}
 */
function getRealPath() {
    var localObj = window.location;
    var contextPath = localObj.pathname.split("/")[1];
    var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
    return basePath;
};