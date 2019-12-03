/*
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-04-09 15:25:39
 */
define(function(require, exports, module) {

            require("plugins/jstree/dist/jstree");
            require("plugins/jstree/dist/themes/default/style.css");
            require("assets/js/global/tableTree");
            require("plugins/drag/kd_drag.js");
            var showContent = {};
            showContent.BulletBoxData = {};

            //初始化作业执行配置信息 -> 变量设置实例
            showContent.handleParams = new App.handleParams("#J_pm_perfrom_modal_var_set");
            showContent.handleParams.delAllRow();
            showContent._load = function() {

                //初始化表单样式
                App.initUniform();

                // 2S监听获取左边的框列表数据
                showContent.preLeftBoxItems = [];
                showContent.getLeftBoxList();
                showContent.getLeftBoxMyList({ "info": "focus" });
                showContent.setIntervalLeftBox =
                    setInterval(function() {
                        showContent.getLeftBoxList();
                    }, 5000);

                //点击选择日期
                App.handleDatePickers();

                //获取执行频度
                showContent.ExecutionFrequency();
            }

            function formart1(name, executeFlag) {
                var color;
                if (executeFlag === 'B') {
                    color = '#ed6b75'
                } else if (executeFlag === "R") {
                    color = '#659be0'
                } else if (executeFlag === "S") {
                    color = '#3fc9d5'
                } else if (executeFlag === "F") {
                    color = '#F1C40F'
                } else if (executeFlag === "N") {
                    color = '#bac3d0'
                }
                return `<span style="color:${color}">${name}</span>`
            }

            function formart3(nodeName, executeFlag, executeMsg) {
                return `<span style="margin-right: 10px;" title='${nodeName}' >${nodeName}${"F,B".includes(executeFlag) ? `<i class='fa fa-info-circle' title='${executeMsg.substring(0,100)}'></i>` : "" }</span>`
        }
            function formart2(executeMsg) {
                return `<span class="execute-error-msg" msg='${executeMsg.replace(/\'/g, "\"")}' style="color:#3fc9d5;cursor:pointer;">${executeMsg.substring(0,100)}</span>`
            }
            // 新增到我的
    showContent.addMyTree = function (params) {
        var paramsMap = $.extend({ operType: "ADD" }, params);
        $.kingdom.doKoauthAdminAPI(
            "bayconnect.superlop.set_my_focus_job_modify",
            "v4.0",
            paramsMap,
            data => {
                App.unblockUI();
                if (data.bcjson.flag == "1") {
                    toastr.success(data.bcjson.msg);
                    showContent.getLeftBoxMyList({"info":"focus "});
                } else {
                    toastr.error(data.bcjson.msg);
                }
            }
        );
    };
    // 删除我的
    showContent.delMyTree = function (params) {
        var paramsMap = $.extend({ operType: "DEL" }, params);
        $.kingdom.doKoauthAdminAPI(
            "bayconnect.superlop.set_my_focus_job_modify",
            "v4.0",
            paramsMap,
            data => {
                App.unblockUI();
                if (data.bcjson.flag == "1") {
                    toastr.success(data.bcjson.msg);
                    showContent.getLeftBoxMyList({"info":"focus "});
                } else {
                    toastr.error(data.bcjson.msg);
                }
            }
        );
    };
            // 将数据格式转化成tabletree需要的数据
            function gene(items) {
                for (let item of items) {
                    if (!item.parentMonitorId) {
                        let data = [{
                            id: item.monitorId,
                            pId: "-1",
                            columns: {
                                "序号":item.orderNo,
                                "节点":{
                                    formatter: function() {
                                        return formart3(item.nodeName,item.executeFlag,item.executeMsg);
                                    }
                                },
                                "任务名称":item.jobname,
                                "任务类型": item.memberTypeName,
                                "删除": item.deleteNum,
                                "插入": item.insertNum,
                                "开始时间": $.kingdom.toDateTime(item.startTime),
                                "执行时长": $.kingdom.formatMillisecond(item.zxsj),
                                "执行状态": {
                                    formatter: function() {
                                        return formart1(item.executeFlagName, item.executeFlag);
                                    }
                                },
                                "执行信息(点击显示全部信息)": {
                                    formatter: function() {
                                        return formart2(item.executeMsg);
                                    }
                                }
                            },
                            children: []
                        }];
                        for (let item1 of items) {
                            if (item1.parentMonitorId === item.monitorId) {
                                let obj = {
                                    id: item1.monitorId,
                                    pId: item1.parentMonitorId,
                                    attr: {
                                        obj: JSON.stringify(item1),
                                    },
                                    columns: {
                                        "序号":item1.orderNo,
                                        "节点":{
                                            formatter: function() {
                                                return formart3(item1.nodeName,item1.executeFlag, item1.executeMsg);
                                            }
                                        },
                                        "任务名称": item1.jobname,
                                        "任务类型": item1.memberTypeName,
                                        "删除": item1.deleteNum,
                                        "插入": item1.successNum,
                                        "开始时间": $.kingdom.toDateTime(item1.startTime),
                                        "执行时长": $.kingdom.formatMillisecond(item1.zxsj),
                                        "执行状态": {
                                            formatter: function() {
                                                return formart1(item1.executeFlagName, item1.executeFlag);
                                            }
                                        },
                                        "执行信息(点击显示全部信息)": {
                                            formatter: function() {
                                                return formart2(item1.executeMsg);
                                            }
                                        }
                                    },
                                    children: [],
                                };
                                data[0].children.push(obj);
                            }
                        }
                        let children = data[0].children;
                        for (let i = 0, len = children.length; i < len; i++) {
                        for(let item2 of items){            
                            if (item2.parentMonitorId === children[i].id) {
                                let obj = {
                                    id: item2.monitorId,
                                    pId: item2.parentMonitorId,
                                    attr: {
                                        obj: JSON.stringify(item2),
                                    },
                                    columns: {
                                        "序号":item2.orderNo,
                                        "节点":{
                                            formatter: function() {
                                                return formart3(item2.nodeName,item2.executeFlag, item2.executeMsg);
                                            }
                                        },
                                        "任务名称": item2.jobname,
                                        "任务类型": item2.memberTypeName,
                                        "删除": item2.deleteNum,
                                        "插入": item2.successNum,
                                        "开始时间": $.kingdom.toDateTime(item2.startTime),
                                        "执行时长": $.kingdom.formatMillisecond(item2.zxsj),
                                        "执行状态": {
                                            formatter: function() {
                                                return formart1(item2.executeFlagName, item2.executeFlag);
                                            }
                                        },
                                        "执行信息(点击显示全部信息)": {
                                            formatter: function() {
                                                return formart2(item2.executeMsg);
                                            }
                                        }
                                    },
                                    children: [],
                                };
                                data[0].children[i].children.push(obj); 
                           
                            }
                        }
                         /**
                             * @description: 第四级数据
                             * @param {type} 
                             * @return: 
                             * @Author: xiaojun
                             * @Date: 2019-06-25 14:57:00
                             */
                            let children1 = data[0].children[i].children;                
                            for(let item3 of items){
                                for (let j = 0, len = children1.length; j < len; j++) {
                                    if (item3.parentMonitorId === children1[j].id) {
                                        let obj = {
                                            id: item3.monitorId,
                                            pId: item3.parentMonitorId,
                                            attr: {
                                                obj: JSON.stringify(item3),
                                            },
                                            columns: {
                                                "序号":item3.orderNo,
                                                "节点":{
                                                    formatter: function() {
                                                        return formart3(item3.nodeName,item3.executeFlag, item3.executeMsg);
                                                    }
                                                },
                                                "任务名称": item3.jobname,
                                                "任务类型": item3.memberTypeName,
                                                "删除": item3.deleteNum,
                                                "插入": item3.successNum,
                                                "开始时间": $.kingdom.toDateTime(item3.startTime),
                                                "执行时长": $.kingdom.formatMillisecond(item3.zxsj),
                                                "执行状态": {
                                                    formatter: function() {
                                                        return formart1(item3.executeFlagName, item3.executeFlag);
                                                    }
                                                },
                                                "执行信息(点击显示全部信息)": {
                                                    formatter: function() {
                                                        return formart2(item3.executeMsg);
                                                    }
                                                }
                                            },
                                            children: [],
                                        };
                                        data[0].children[i].children[j].children.push(obj);        
                                    }
                                }
                            }
                            
                    }              
                        return data;
                    }
                }
            }
              // 获取左边的框列表数据
              showContent.getLeftBoxList = function(params, isSearch) {
                $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_job_deal_info", "v4.0", params ? params : {}, function(data) {
                    var items = data.bcjson.items || data.bcjson;
                    if (data.bcjson.flag == "1") {
                        if (checkIsReloadLeftList(showContent.preLeftBoxItems, items)) {
                            if(items.length > 0){
                                var nowClick = $("#perform-monitoring  #J_pm_jobname_tree .jstree-children .jstree-children a").index($("#perform-monitoring  #J_pm_jobname_tree .jstree-children .jstree-children a.jstree-clicked"));
                                var selectJobId = $("#perform-monitoring  #J_pm_jobname_tree .jstree-children .jstree-children a.jstree-clicked").attr("jobid");
                                $("#J_pm_jobname_tree").jstree("destroy");
                                var treeData = [
                                    { text: "出错中断", typeFlag: "B", icon: "fa fa-times-circle icon-state-danger", children: [] },
                                    { text: "执行中", typeFlag: "R", icon: "fa fa-spinner icon-state-info", children: [], state: { opened: true } },
                                    { text: "成功完成", typeFlag: "S", icon: "fa fa-check-circle icon-state-success", children: [] },
                                    { text: "出错完成", typeFlag: "F", icon: "fa fa-times-circle icon-state-warning", children: [] },
                                    { text: "新建", typeFlag: "N", icon: "fa fa-plus-circle icon-state-default", children: [] }
                                ];
                                $.each(items, function(index, value) {
                                    var obj = {};
                                    obj.a_attr = { "jobId": value.jobId, "batchNo": value.batchNo, "executeFlag": value.executeFlag, "title": value.jobNo + "(" + value.jobName + ")" };
                                    obj.text = value.jobNo ? value.jobName + "(" + value.jobNo + ")" : value.jobName;
                                    if (value.jobId === selectJobId) {
                                        value.parentShouldOpen = true;
                                    }
                                    if (value.executeFlag === "N") {
                                        obj.icon = "fa fa-folder icon-state-default"
                                        treeData[4]['children'].push(obj);
                                        if (value.parentShouldOpen) {
                                            treeData[4]['state'] = { opened: true };
                                        }
                                    } else if (value.executeFlag === "R") {
                                        obj.icon = "fa fa-folder icon-state-info"
                                        treeData[1]['children'].push(obj);
                                        if (value.parentShouldOpen) {
                                            treeData[1]['state'] = { opened: true };
                                        }
                                    } else if (value.executeFlag === "S") {
                                        obj.icon = "fa fa-folder icon-state-success"
                                        treeData[2]['children'].push(obj);
                                        if (value.parentShouldOpen) {
                                            treeData[2]['state'] = { opened: true };
                                        }
                                    } else if (value.executeFlag === "B") {
                                        obj.icon = "fa fa-folder icon-state-danger"
                                        treeData[0]['children'].push(obj);
                                        if (value.parentShouldOpen) {
                                            treeData[0]['state'] = { opened: true };
                                        }
                                    } else if (value.executeFlag === "F") {
                                        obj.icon = "fa fa-folder icon-state-warning"
                                        treeData[3]['children'].push(obj);
                                        if (value.parentShouldOpen) {
                                            treeData[3]['state'] = { opened: true };
                                        }
                                    } else {
                                        obj.icon = "fa fa-folder icon-state-default"
                                        treeData[4]['children'].push(obj);
                                        if (value.parentShouldOpen) {
                                            treeData[4]['state'] = { opened: true };
                                        }
                                    }
                                });
                                $.each(treeData, function(index, value) {
                                    var amount = value.children.length;
                                    value.text += ` (${amount})`
                                });
                                //如果是搜索情况，则不默认显示第一个
                                if (isSearch) {
                                    delete treeData[0].state;
                                    $.each(treeData, function(index, item) {
                                        if (item.children.length > 0) {
                                            item.state = { opened: true };
                                        }
                                    });
                                }
                                $("#J_pm_jobname_tree").jstree({
                                    types: {
                                        default: {
                                            icon: false // 删除默认图标
                                        }
                                    },
                                    core: {
                                        themes: {
                                            responsive: false
                                        },
                                        data: treeData,
                                        multiple: false,
                                        dblclick_toggle: false //禁用tree的双击展开
                                    },
                                    plugins: ["types", "themes", "html_data"],
                                }).on("loaded.jstree", function() {
                                    // $("#J_pm_jobname_tree").jstree("open_all");
                                    if (nowClick < 0) {
                                        if(isSearch){
                                            $("#perform-monitoring  #J_pm_jobname_tree .jstree-children .jstree-children a:eq(0)").click();
                                            App.treeEllipsis1(`#J_pm_jobname_tree`);
                                        }
                                    } else {
                                        $("#perform-monitoring #J_pm_jobname_tree .jstree-children .jstree-children a").removeClass("jstree-clicked");
                                        $("#perform-monitoring #J_pm_jobname_tree .jstree-children .jstree-children a[jobid='" + selectJobId + "']").addClass("jstree-clicked");
                                        App.treeEllipsis1(`#J_pm_jobname_tree`);
                                    }
                                }).on("click",function(){
                                    App.treeEllipsis1(`#J_pm_jobname_tree`);
                                });
                            } else {
                                //清空树加载gif
                                $("#J_pm_jobname_tree").html("");
                            }
                        }
                    }
                });
            };
             // 获取左边的框列表数据
             showContent.getLeftBoxMyList = function(params, isSearch) {
                $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_job_deal_info", "v4.0", params ? params : {}, function(data) {
                    var items = data.bcjson.items || data.bcjson;
                    if (data.bcjson.flag == "1" && items.length > 0) {
                      
                            var nowClick = $("#perform-monitoring  #J_pm_jobname_my_tree .jstree-children .jstree-children a").index($("#perform-monitoring  #J_pm_jobname_tree .jstree-children .jstree-children a.jstree-clicked"));
                            var selectJobId = $("#perform-monitoring  #J_pm_jobname_my_tree .jstree-children .jstree-children a.jstree-clicked").attr("jobid");
                            $("#J_pm_jobname_my_tree").jstree("destroy");
                            var treeData = [
                                { text: "出错中断", typeFlag: "B", icon: "fa fa-times-circle icon-state-danger", children: [] },
                                { text: "执行中", typeFlag: "R", icon: "fa fa-spinner icon-state-info", children: [], state: { opened: true } },
                                { text: "成功完成", typeFlag: "S", icon: "fa fa-check-circle icon-state-success", children: [] },
                                { text: "出错完成", typeFlag: "F", icon: "fa fa-times-circle icon-state-warning", children: [] },
                                { text: "新建", typeFlag: "N", icon: "fa fa-plus-circle icon-state-default", children: [] }
                            ];
                            $.each(items, function(index, value) {
                                var obj = {};
                                obj.a_attr = { "jobId": value.jobId, "batchNo": value.batchNo, "executeFlag": value.executeFlag, "title": value.jobNo + "(" + value.jobName + ")" };
                                obj.text = value.jobNo ? value.jobName + "(" + value.jobNo + ")" : value.jobName;
                                if (value.jobId === selectJobId) {
                                    value.parentShouldOpen = true;
                                }
                                if (value.executeFlag === "N") {
                                    obj.icon = "fa fa-folder icon-state-default"
                                    treeData[4]['children'].push(obj);
                                    if (value.parentShouldOpen) {
                                        treeData[4]['state'] = { opened: true };
                                    }
                                } else if (value.executeFlag === "R") {
                                    obj.icon = "fa fa-folder icon-state-info"
                                    treeData[1]['children'].push(obj);
                                    if (value.parentShouldOpen) {
                                        treeData[1]['state'] = { opened: true };
                                    }
                                } else if (value.executeFlag === "S") {
                                    obj.icon = "fa fa-folder icon-state-success"
                                    treeData[2]['children'].push(obj);
                                    if (value.parentShouldOpen) {
                                        treeData[2]['state'] = { opened: true };
                                    }
                                } else if (value.executeFlag === "B") {
                                    obj.icon = "fa fa-folder icon-state-danger"
                                    treeData[0]['children'].push(obj);
                                    if (value.parentShouldOpen) {
                                        treeData[0]['state'] = { opened: true };
                                    }
                                } else if (value.executeFlag === "F") {
                                    obj.icon = "fa fa-folder icon-state-warning"
                                    treeData[3]['children'].push(obj);
                                    if (value.parentShouldOpen) {
                                        treeData[3]['state'] = { opened: true };
                                    }
                                } else {
                                    obj.icon = "fa fa-folder icon-state-default"
                                    treeData[4]['children'].push(obj);
                                    if (value.parentShouldOpen) {
                                        treeData[4]['state'] = { opened: true };
                                    }
                                }
                            });
                            $.each(treeData, function(index, value) {
                                var amount = value.children.length;
                                value.text += ` (${amount})`
                            });
                            //如果是搜索情况，则不默认显示第一个
                            if (isSearch) {
                                delete treeData[0].state;
                                $.each(treeData, function(index, item) {
                                    if (item.children.length > 0) {
                                        item.state = { opened: true };
                                    }
                                });
                            }
                            $("#J_pm_jobname_my_tree").jstree({
                                types: {
                                    default: {
                                        icon: false // 删除默认图标
                                    }
                                },
                                core: {
                                    themes: {
                                        responsive: false
                                    },
                                    data: treeData,
                                    multiple: false,
                                    dblclick_toggle: false //禁用tree的双击展开
                                },
                                plugins: ["types", "themes", "html_data"],
                            }).on("loaded.jstree", function() {
                                // $("#J_pm_jobname_tree").jstree("open_all");
                                if (nowClick < 0) {
                                    if(isSearch){
                                        $("#perform-monitoring  #J_pm_jobname_my_tree .jstree-children .jstree-children a:eq(0)").click();
                                        App.treeEllipsis1(`#J_pm_jobname_my_tree`);
                                    }
                                } else {
                                    $("#perform-monitoring #J_pm_jobname_my_tree .jstree-children .jstree-children a").removeClass("jstree-clicked");
                                    $("#perform-monitoring #J_pm_jobname_my_tree .jstree-children .jstree-children a[jobid='" + selectJobId + "']").addClass("jstree-clicked");
                                    App.treeEllipsis1(`#J_pm_jobname_my_tree`);
                                }
                            }).on("click",function(){
                                App.treeEllipsis1(`#J_pm_jobname_my_tree`);
                            });
                            
                         
                            App.treeEllipsis1(`#J_tps_1_5`);             
                    } else {
                        //清空树加载gif
                        $("#J_pm_jobname_my_tree").html("");
                    }
                });
            };

            // 获取右边的框前三块的数据
            showContent.getRightTopBoxList = function(params) {
                var paramsMap = $.extend({}, params);
                $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_finish_rate_info", "v4.0", paramsMap, function(data) {
                    var items = data.bcjson.items || data.bcjson;
                    if (data.bcjson.flag === "1" && items.length > 0) {
                        //保存当前任务的jobId
                        var currentJobId = {};
                        currentJobId.jobId = items[0].jobId;
                        showContent.jobId = currentJobId;

                        //作业执行配置信息 -> tab3 选择任务操作详情
                        showContent.selectTask(showContent.jobId);

                        //作业执行配置信息 -> tab2 变量设置
                        showContent.variableSetting(showContent.jobId);

                        //如果是正在执行，则获取系统时间计算已经运行时间
                        if (items[0].executeFlag === "R") {
                            showContent.getAlreadyTime(items[0].startTime);
                        }

                        if (items[0].executeFlag === "N" || !items[0].executeFlag) {
                            items[0].endTime = items[0].endTime.length === 8 && items[0].endTime + "000000";
                            items[0].startTime = items[0].startTime.length === 8 && items[0].startTime + "000000";
                        }

                        //获取当前的作业的memberNo和nodeName
                        showContent.BulletBoxData.memberNo = items[0].jobNo;
                        showContent.BulletBoxData.nodeName = items[0].jobName;
                        //显示出弹框--作业流程的内容
                        $(" input[name=task-Process]").val("【" + showContent.BulletBoxData.memberNo + "】" + showContent.BulletBoxData.nodeName);
                        // 获取右边的框的上面第一块的数据
                        require.async("./template/perform-rightTop-list.handlebars", function(compiled) {
                            $(".page-perform-monitoring #right-content-top").html(compiled([items[0]]));
                        });

                        // 获取右边的框的上面第二块的数据
                        showContent.getPieList(paramsMap);

                        // 获取右边的框的上面第三块的数据
                        showContent.getThirdBoardData(items[0], null, false);

                    } else {
                        toastr.error(data.bcjson.msg);
                    }
                });
            }

            /**
             * 获取右边的第三块的数据
             * @param {Object} items - 渲染所需要的数据源
             * @param {Object} param - 查询新的数据源所需要的参数
             * @param {Bool} isClickPie - 是否通过点击右边图中的圆形Echart而加载
             */
            showContent.getThirdBoardData = function(items, param, isClickPie) {
                // 获取右边的框的上面第三块的数据
                if (isClickPie) {
                    require.async("./template/perform-rightMiddle-tast.handlebars", function(compiled) {
                        $(".page-perform-monitoring #right-content-middle-tast").html(compiled([items]));
                    });

                    //变换第一块数据
                    require.async("./template/perform-rightTop-list.handlebars", function(compiled) {
                        $(".page-perform-monitoring #right-content-top").html(compiled([items]));
                    });
                    showContent.getTableData(param, items.executeFlag, true);
                    if (items.executeFlag === "R") {
                        showContent.getAlreadyTime(items.startTime);
                    } else {
                        clearInterval(showContent.timeInterval);
                    }
                } else {
                    require.async("./template/perform-rightMiddle-tast.handlebars", function(compiled) {
                        $(".page-perform-monitoring #right-content-middle-tast").html(compiled([items]));
                    });
                }
            }

            showContent.getPieList = function(paramsMap) {
                paramsMap.pageSize = "100";
                paramsMap.pageNumber = "1";
                $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_each_batch_finish_data_info", "v4.0", paramsMap, function(data) {
                    if (data.bcjson.flag == 1) {
                        var items = data.bcjson.items || data.bcjson;
                        items = items.length > 0 ? items : data.bcjson;
                        require.async("./template/perform-rightMiddle-round.handlebars", function(compiled) {
                            $(".page-perform-monitoring #right-content-middle-round").html(compiled(items));
                            if (items && items.length > 0) {
                                $.each(items, function(index, item) {
                                    var taskSum = item.taskSum;
                                    var successNum = item.successNum;
                                    var errorNum = item.errorNum;
                                    var initail = taskSum - successNum - errorNum;
                                    var data;
                                    if (taskSum) {
                                        data = [
                                            { value: initail, name: '未执行' },
                                            { value: successNum, name: '执行成功' },
                                            { value: errorNum, name: '执行失败' },
                                        ];
                                    } else {
                                        data = [
                                            { value: 0, name: '执行中' }
                                        ];
                                    }
                                    var params = {
                                        batchNo: item.batchNo,
                                        jobId: item.jobId
                                    }
                                    showContent.createPieChart(data, index, params);
                                });
                            }
                        });
                    }

                });
            }

            showContent.createPieChart = function(data, index, params) {
                if (index == "0") {
                    // $('#circle' + index).css("width","240px");
                    $('#circle' + index)
                        .siblings(".circleChart-text")
                        .css("margin-left", "65px")
                        .siblings(".num-block")
                        .css("width", "120%");
                }
                var myChart = echarts.init(document.getElementById('circle' + index));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'top',
                        data: ['未执行', '执行成功', '执行失败'],
                        itemWidth: 16, //图形的宽度，即长条的宽度。
                        itemHeight: 10,

                    },
                    color: ['#ccc', '#17C4BB', '#ed6b75'],
                    series: [{
                        center: ["60%", "50%"],
                        name: '执行结果',
                        type: 'pie',
                        radius: ['75%', '90%'],
                        startAngle: 225,
                        avoidLabelOverlap: false,
                        silent: true,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: data
                    }]
                };
                if (index !== 0) {
                    delete option.legend;
                    delete option.series[0].center
                }
                myChart.setOption(option);
                // $("#circle" + index).click(function() {
                //     showContent.updateTableData(params);
                // });
            }

            //自动更新右边页面调用的渲染函数
            showContent.updateTableData = function(params) {
                var paramsMap = $.extend({}, params);
                $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_detail_flow_info", "v4.0", paramsMap, function(data) {
                    // console.log(data);
                    var items = data.bcjson.items || data.bcjson;
                    if (data.bcjson.flag == "1") {
                        if (items.length > 0) {
                            var hasFinishStatus = [];
                            //遍历所有的节点，若有执行结果状态，则加入hasFinishStatus
                            $.each(items, function(index, value) {
                                if (value.executeFlag) {
                                    if (value.executeFlag !== "N") {
                                        hasFinishStatus.push(value.monitorId);
                                    }
                                }
                            });

                            showContent.currentMsgCollection = {};
                            //存放错误信息
                            $.each(items, function(index, item) {
                                showContent.currentMsgCollection[index] = item.executeMsg;
                                item['errorIndex'] = index;
                            });

                            if (checkIsReloadTableData(showContent.preTableData, items)) {
                                $("#perform-monitoring-table-tree tbody").jstree('destroy');
                                // var html = new showContent.getTreeData().GetData("null", items, "jobname", "monitorId", "parentMonitorId", "monitorId");
                                // $('#J_tableList').html(html).closest("td").removeClass("t-c");
                                // $("#J_tableList").jstree({
                                // 	"types": {
                                // 		"default": {
                                // 			"icon": false
                                // 		},
                                // 	},
                                // 	'core': {
                                // 		"themes": {
                                // 			"theme": "classic",
                                // 			"dots": false,
                                // 			"icons": false
                                // 		},
                                // 	},
                                // 	"plugins": ["types", "themes", "html_data", "state"],

                                // });
                                // $("#J_tableList").jstree(true).open_all();
                                let data_ = gene(items);
                                var a = $("#perform-monitoring-table-tree").tableTree({
                                    widthScale: 1.5,
                                    data: data_
                                })
                                a.openNode($('[pkey="-1"]').attr('key'));
                                if ($("#perform-monitoring-table-tree tbody.jstree-leaf").length > 1) {
                                    $("#perform-monitoring-table-tree tbody .jstree-leaf").css("display", "none");
                                }
                            }

                            //对于所有的节点，若在其domMonitorid在hasFinishStatus，则block
                            var liCollection = $("#J_tableList li");
                            $.each(liCollection, function(index, value) {
                                var domMonitorid = $(value).attr("monitorid")
                                if (hasFinishStatus.includes(domMonitorid)) {
                                    $(value).css("display", "block");
                                }
                            });


                            if (items[0].executeFlag !== "R") {
                                //处理后续完成后的后续操作
                                $(".perform-play").find("img").attr("src", "/assets/img/perform-start.png").removeClass("current-play");
                                //执行完毕刷新左侧树
                                showContent.getLeftBoxList();
                                showContent.getLeftBoxMyList({ "info": "focus" });
                                showContent.getRightTopBoxList({ jobId: params.jobId });
                                //清除执行时长轮询，及获取tabledata
                                clearInterval(showContent.setInterval);
                                clearInterval(showContent.timeInterval);
                                //清除iframe中流程轮询
                                var iframWindow = $("#perform-monitoring #J_change_view_job iframe")[0].contentWindow
                                iframWindow.clearInterval(iframWindow.setIntervalVarIframe);
                            }
                        }
                    } else {
                        toastr.error(data.bcjson.msg);
                    }
                });
            }

            //获取右边大框table的数据
            showContent.getTableData = function(params, executeFlag, onlyRenderTree) {
                $('#right-content-table').show();
                var paramsMap = $.extend({}, params);
                $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_detail_flow_info", "v4.0", paramsMap, function(data) {
                    // console.log(data);
                    var items = data.bcjson.items || data.bcjson;
                    if (data.bcjson.flag == "1") {
                        $("#J_tableList").jstree('destroy');
                        if (items.length > 0) {
                            showContent.currentMsgCollection = {};
                            //存放错误信息
                            $.each(items, function(index, item) {
                                showContent.currentMsgCollection[index] = item.executeMsg;
                                item['errorIndex'] = index;
                            });
                            let data_ = gene(items);
                            $("#perform-monitoring-table-tree").tableTree({
                                data: data_
                            });
                            var a = $("#perform-monitoring-table-tree").tableTree({
                                widthScale: 2,
                                data: data_
                            })
                            a.openNode($('[pkey="-1"]').attr('key'));
                            // let tds = $(".page-perform-monitoring #perform-monitoring-table-tree tbody tr td:nth-child(9)");
                            // let tds1 = $(".page-perform-monitoring #perform-monitoring-table-tree tbody tr td:nth-child(10)");
                            // for (i = 0; i < tds1.length; i++) {
                            //     let td1 = $(tds1[i]);
                            //     td1.css({ "color": "#3fc9d5", "cursor": "pointer" })
                            // }
                            // for (i = 0; i < tds.length; i++) {
                            //     let td = $(tds[i]);
                            //     let executeFlag = td.html().replace(/\s/g, "");
                            //     var color = "";
                            //     if (executeFlag === '出错完成') {
                            //         color = '#ed6b75'
                            //     } else if (executeFlag === "R") {
                            //         color = '#659be0'
                            //     } else if (executeFlag === "成功完成") {
                            //         color = '#3fc9d5'
                            //     } else if (executeFlag === "出错完成") {
                            //         color = '#F1C40F'
                            //     } else if (executeFlag === "新建") {
                            //         color = '#bac3d0'
                            //     }
                            //     td.css("color", color)
                            // }
                            // // 获取右边的框的table的数据
                            // var html = new showContent.getTreeData().GetData("null", items, "jobname", "monitorId", "parentMonitorId", "monitorId");
                            // $('#J_tableList').html(html).closest("td").removeClass("t-c");
                            // $("#J_tableList").jstree({
                            // 	"types": {
                            // 		"default": {
                            // 			"icon": false
                            // 		},
                            // 	},
                            // 	'core': {
                            // 		"themes": {
                            // 			"theme": "classic",
                            // 			"dots": false,
                            // 			"icons": false
                            // 		},
                            // 	},
                            // 	"plugins": ["types", "themes", "html_data", "state"],

                            // });
                            // $("#J_tableList").jstree(true).open_all();
                            // $('#J_tableList ul li:first').css('padding', 0);



                            //若点击echart圆形图，则不加载右边三块数据，近加载状态树数据
                            if (!onlyRenderTree) {
                                showContent.getRightTopBoxList({ jobId: params.jobId });
                            }

                            clearInterval(showContent.setInterval);
                            if (executeFlag === "R") {

                                showContent.preTableData = [];

                                //执行中状态，所有的叶子节点，若无执行结果的状态则，给与display none
                                if ($("#perform-monitoring-table-tree .jstree-leaf").length > 1) {
                                    $("#perform-monitoring-table-tree .jstree-leaf").css("display", "none");
                                }

                                showContent.updateTableData(paramsMap);
                                showContent.setInterval = setInterval(function() {
                                    showContent.updateTableData(paramsMap);
                                }, 3000)
                            }
                        } else {
                            $('#J_tableList').html("<image src='assets/img/nonedata.png'/>").css('text-align', "center");
                        }
                    } else {
                        toastr.error(data.bcjson.msg);
                    }
                });
            }

            //获得树数据
            showContent.getTreeData = function() {
                    this.menus = "";
                    var rank = 0;
                    var temp = [];
                    this.GetData = function(id, arry, name, foldId, parentmenuid, menuid) {
                            if (!temp[id + '']) {
                                temp[id + ''] = 'exist';
                                rank++
                            }
                            var childArry = this.GetParentArry(id, parentmenuid, arry);
                            if (childArry.length > 0) {
                                this.menus += '<ul>';
                                for (var i in childArry) {
                                    var startTime = $.kingdom.toDateTime(childArry[i].startTime)
                                    var executeFlag = childArry[i].executeFlag;
                                    var color = "";
                                    if (executeFlag === 'B') {
                                        color = '#ed6b75'
                                    } else if (executeFlag === "R") {
                                        color = '#659be0'
                                    } else if (executeFlag === "S") {
                                        color = '#3fc9d5'
                                    } else if (executeFlag === "F") {
                                        color = '#F1C40F'
                                    } else if (executeFlag === "N") {
                                        color = '#bac3d0'
                                    }
                                    // var backgroundColor = executeFlag === 'B' ? 'background-color:#FF7580' : '';
                                    this.menus += '<li executeFlag="' + childArry[i]['executeFlag'] + '" monitorId="' + childArry[i]['monitorId'] + '"' + foldId + '="' + childArry[i][foldId] + '">' +
                                        `<div style=" border-bottom: 1px solid #ddd;" jobNo="${childArry[i].jobNo}" nodeName='${childArry[i].nodeName}'>
                            <span class="text-overflow t-c" style="width:20px">${childArry[i].orderNo}</span>
                            <span class="text-overflow t-l" title='${childArry[i].nodeName}' style='width:${180 - rank * 12}px;padding-right: 15px; position:relative;'>${childArry[i].nodeName} ${"F,B".includes(childArry[i].executeFlag) ? `<i class='fa fa-info-circle execute-error-msg' style='font-size:16px;color:#d84c15;position:absolute; top: 7px; right: 0;' title='${childArry[i].executeMsg.substring(0,100)}' errorindex='${childArry[i].errorIndex}'></i>` : "" }</span>
                            <span class="text-overflow t-l pdleft10 pdright10"  title='${childArry[i].jobname}'>${childArry[i].jobname}</span>
                            <span class="text-overflow t-c pdleft10 pdright10" style="width: 90px;" title='${childArry[i].memberTypeName}'>${childArry[i].memberTypeName}</span>
                            <span class="text-overflow pdleft10 pdright10" style="width: 40px;"  title='{childArry[i].errorNum}'>${childArry[i].errorNum}</span>
                            <span class="text-overflow pdleft10 pdright10" style="width: 40px;"  title='${childArry[i].successNum}'>${childArry[i].successNum}</span>
                            <span class="text-overflow pdleft10 pdright10 t-c" style="width: 140px;" title='${startTime}'>${startTime}</span>
                            <span class="text-overflow pdleft10 pdright10" style="width:100px; padding-left: 30px;">${$.kingdom.formatMillisecond(childArry[i].zxsj)}</span>
                            <span class="text-overflow pdleft10 pdright10 t-c" style="width: 100px; color: ${color}"  title='${childArry[i].executeFlagName}'>${childArry[i].executeFlagName}</span>
                            <span class="text-overflow t-l pdleft10 pdright10 execute-error-msg" style="padding-left: 30px;color: #28bcc9" errorindex='${childArry[i].errorIndex}'  title='${childArry[i].executeMsg.substring(0, 100)}'>${childArry[i].executeMsg.substring(0, 100)}</span>
                        </div>`;
					this.GetData(childArry[i][menuid], arry, name, foldId, parentmenuid, menuid);
					this.menus += '</li>';
				}
				this.menus += '</ul>';
				rank--;
				return this.menus;
			} else {
				rank--;
			}

		};
		// 获取子级数组
		this.GetParentArry = function (id, parentmenuid, arry) {
			var newArry = new Array();
			for (var i in arry) {
				if (arry[i][parentmenuid] + '' === id)
					newArry.push(arry[i]);
			}
			return newArry;
		};
	};
	//获取执行频度
	showContent.ExecutionFrequency = function (params) {
		var paramsMap = $.extend({ pageNumber: "1", pageSize: "10" }, params);
		$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_schedule_info", "v4.0", paramsMap, function (data) {
			console.log(data);
			var items = data.bcjson.items || data.bcjson;
			if (data.bcjson.flag == "1" && items) {
				//获取执行频度
				require.async("./template/perform-ExecutionFrequency.handlebars", function (compiled) {
					$(".page-perform-monitoring #ExecutionFrequency").html(compiled(items));
				});
			} else {
				toastr.error(data.bcjson.msg);
			}
		});
	}

	//变量设置
	showContent.variableSetting = function (params) {
		$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_task_var_list", "v4.0", params, function (data) {
			var items = data.bcjson.items || data.bcjson;
			if (data.bcjson.flag === "1") {
				let html_t = ``;
				html_t += `<option value="">- 请选择 -</option>`;
				let i = 0;
				for (let item of items) {
					item.no = ++i;
					html_t += `<option value="${item.varName}">${item.varName}</option>`;
				}
				$("#J_pm_perfrom_modal_var_set select").html(html_t);
				showContent.handleParams.delAllRow();
				showContent.handleParams.setData(items);
			}
		});
	}

	//选择任务
	showContent.selectTask = function (params) {

		var paramsMap = $.extend({}, params);
		$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_xml_nodeinfo", "v4.0", paramsMap, function (data) {

			var items = data.bcjson.items || data.bcjson;
			if (data.bcjson.flag == "1" && items) {
				//执行部分任务
				require.async("./template/perform-PerformSomeTasks.handlebars", function (compiled) {
					$(".page-perform-monitoring #J_pm_tab3_body").html(compiled(items));
					App.initCheckableTable($("#J_pm_tab3_table"));
				});
				//从某点开始
				require.async("./template/perform-point-perform.handlebars", function (compiled) {
					$(".page-perform-monitoring #J_pm_tab3_select").html(compiled(items));
				});
			}
		});
	}

	//执行任务
	showContent.performTask = function (params) {

		var paramsMap = $.extend({}, params);
		$.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_job_manual_exec", "v4.0", paramsMap, function (data) {
			var items = data.bcjson.items || data.bcjson;
			if (data.bcjson.flag == "1" && items) {
				//得到新的batchNo
				var batchNo = data.bcjson.items[0].batchNo;
				//清空树
				$("#J_tableList").jstree('destroy');

				var job_detail = {};
				job_detail.jobId = params.jobId;
				job_detail.batchNo = batchNo;
				showContent.getPieList({ jobId: params.jobId });
                showContent.getTableData(job_detail,"R");
                //开始执行任务刷新左侧树
                showContent.getLeftBoxMyList({ "info": "focus" });
                showContent.getLeftBoxList();
				$('#pm-add').modal('hide');
			} else {
				toastr.error(data.bcjson.msg);
			}
		});
	}

	//判断左边的列表是否需要渲染
	function checkIsReloadLeftList(preItems, newItems) {
		showContent.preLeftBoxItems = newItems;
		var needReold = false;
		if (preItems.length !== newItems.length) {
			needReold = true;
			return needReold;
		} else {
			for (var i = 0, length = preItems.length; i < length; i++) {
				if ((preItems[i]["jobName"] !== newItems[i]["jobName"]) ||
					(preItems[i]["executeFlag"] !== newItems[i]["executeFlag"])) {
					needReold = true;
					return needReold;
				}
			}
			return false;
		}
	}

	//判断table是否需要更新
	function checkIsReloadTableData(preItems, newItems) {
		showContent.preTableData = newItems;
		var needReold = false;
		if (preItems.length !== newItems.length) {
			needReold = true;
			return needReold;
		} else {
			for (var i = 0, length = preItems.length; i < length; i++) {
				if ((preItems[i]["executeFlag"] !== newItems[i]["executeFlag"])) {
					needReold = true;
					return needReold;
				}
			}
			return false;
		}
	}


	//计算执行时长
	showContent.getAlreadyTime = function (start) {
		$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_sys_current_date", "v4.0", {}, function (data) {
			if (data.bcjson.flag === "1" && data.bcjson.items[0]) {
				var times = data.bcjson.items[0].currentDate;
				var nowSystemTime = $.kingdom.toStandardDateObj(times);
				var startTime = $.kingdom.toStandardDateObj(start);
				var excTime = nowSystemTime.getTime() - startTime.getTime();
				var fakeTime = new Date(2018, 0, 1).getTime() + excTime;
				var fakeTimeObj = new Date(fakeTime);
				var hours = fakeTimeObj.getHours() > 9 ? fakeTimeObj.getHours() : "0" + fakeTimeObj.getHours();
				var minutes = fakeTimeObj.getMinutes() > 9 ? fakeTimeObj.getMinutes() : "0" + fakeTimeObj.getMinutes();
				var seconds = fakeTimeObj.getSeconds() > 9 ? fakeTimeObj.getSeconds() : "0" + fakeTimeObj.getSeconds();
				$("#right-content-top h4").html("时长：" + hours + ":" + minutes + ":" + seconds);
				clearInterval(showContent.timeInterval);
				showContent.timeInterval = setInterval(function () {
					fakeTime = fakeTime + 1000;
					var fakeTimeObj = new Date(fakeTime);
					var hours = fakeTimeObj.getHours() > 9 ? fakeTimeObj.getHours() : "0" + fakeTimeObj.getHours();
					var minutes = fakeTimeObj.getMinutes() > 9 ? fakeTimeObj.getMinutes() : "0" + fakeTimeObj.getMinutes();
					var seconds = fakeTimeObj.getSeconds() > 9 ? fakeTimeObj.getSeconds() : "0" + fakeTimeObj.getSeconds();
					$("#right-content-top h4").html("时长：" + hours + ":" + minutes + ":" + seconds);
				}, 1000);

			}
		});
	};

	showContent.stopCurrentTask = function (jobId, batchNo) {
		var params = {
			jobId: jobId,
			batchNo: batchNo
		}
		$.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_job_manual_break", "v4.0", params, function (data) {
			App.unblockUI();
			if (data.bcjson.flag === "1") {
				$(".page-perform-monitoring  #left-list-show .todo-project-list[jobid='" + jobId + "']").click();
			} else {
				toastr.error(data.bcjson.msg);
			}
		});

	}


	module.exports = showContent;
})