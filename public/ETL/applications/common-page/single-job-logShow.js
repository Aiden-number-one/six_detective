var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(function (require, exports, module) {
    var showContent = {};
    showContent._load = function () {
        showContent.getSingleDatasourceList();
    };
    function formart1(name, executeFlag) {
        var color;
        if (executeFlag === 'B') {
            color = '#ed6b75';
        } else if (executeFlag === "R") {
            color = '#659be0';
        } else if (executeFlag === "S") {
            color = '#3fc9d5';
        } else if (executeFlag === "F") {
            color = '#F1C40F';
        } else if (executeFlag === "N") {
            color = '#bac3d0';
        }
        return '<span style="color:' + color + '">' + name + '</span>';
    }

    function formart3(nodeName, executeFlag, executeMsg) {
        return '<span style="margin-right: 10px;" title=\'' + nodeName + '\' >' + nodeName + ("F,B".includes(executeFlag) ? '<i class=\'fa fa-info-circle\' title=\'' + executeMsg.substring(0, 100) + '\'></i>' : "") + '</span>';
    }
    function formart2(executeMsg) {
        return '<span class="execute-error-msg" msg=\'' + executeMsg.replace(/\'/g, "\"") + '\' style="color:#3fc9d5;cursor:pointer;">' + executeMsg.substring(0, 100) + '</span>';
    }
    // 将数据格式转化成tabletree需要的数据
    function gene(items) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            var _loop = function _loop() {
                var item = _step.value;

                if (!item.parentMonitorId) {
                    var data = [{
                        id: item.monitorId,
                        pId: "-1",
                        columns: {
                            "序号": item.orderNo,
                            "节点": {
                                formatter: function formatter() {
                                    return formart3(item.nodeName, item.executeFlag, item.executeMsg);
                                }
                            },
                            "任务名称": item.jobName,
                            "任务类型": item.memberTypeName,
                            "删除": item.deleteNum,
                            "插入": item.insertNum,
                            "开始时间": $.kingdom.toDateTime(item.startTime),
                            "结束时间": $.kingdom.toDateTime(item.endTime),
                            "执行时长": $.kingdom.formatMillisecond(item.duration),
                            "执行状态": {
                                formatter: function formatter() {
                                    return formart1(item.executeFlagName, item.executeFlag);
                                }
                            },
                            "执行信息(点击显示全部信息)": {
                                formatter: function formatter() {
                                    return formart2(item.executeMsg);
                                }
                            }
                        },
                        children: []
                    }];
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        var _loop4 = function _loop4() {
                            var item1 = _step2.value;

                            if (item1.parentMonitorId === item.monitorId) {
                                var obj = {
                                    id: item1.monitorId,
                                    pId: item1.parentMonitorId,
                                    attr: {
                                        obj: JSON.stringify(item1)
                                    },
                                    columns: {
                                        "序号": item1.orderNo,
                                        "节点": {
                                            formatter: function formatter() {
                                                return formart3(item1.nodeName, item1.executeFlag, item1.executeMsg);
                                            }
                                        },
                                        "任务名称": item1.jobName,
                                        "任务类型": item1.memberTypeName,
                                        "删除": item1.deleteNum,
                                        "插入": item1.insertNum,
                                        "开始时间": $.kingdom.toDateTime(item1.startTime),
                                        "结束时间": $.kingdom.toDateTime(item1.endTime),
                                        "执行时长": $.kingdom.formatMillisecond(item1.duration),
                                        "执行状态": {
                                            formatter: function formatter() {
                                                return formart1(item1.executeFlagName, item1.executeFlag);
                                            }
                                        },
                                        "执行信息(点击显示全部信息)": {
                                            formatter: function formatter() {
                                                return formart2(item1.executeMsg);
                                            }
                                        }
                                    },
                                    children: []
                                };
                                data[0].children.push(obj);
                            }
                        };

                        for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            _loop4();
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    var children = data[0].children;
                    for (var i = 0, len = children.length; i < len; i++) {
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            var _loop2 = function _loop2() {
                                var item2 = _step3.value;

                                if (item2.parentMonitorId === children[i].id) {
                                    var obj = {
                                        id: item2.monitorId,
                                        pId: item2.parentMonitorId,
                                        attr: {
                                            obj: JSON.stringify(item2)
                                        },
                                        columns: {
                                            "序号": item2.orderNo,
                                            "节点": {
                                                formatter: function formatter() {
                                                    return formart3(item2.nodeName, item2.executeFlag, item2.executeMsg);
                                                }
                                            },
                                            "任务名称": item2.jobName,
                                            "任务类型": item2.memberTypeName,
                                            "删除": item2.deleteNum,
                                            "插入": item2.insertNum,
                                            "开始时间": $.kingdom.toDateTime(item2.startTime),
                                            "结束时间": $.kingdom.toDateTime(item2.endTime),
                                            "执行时长": $.kingdom.formatMillisecond(item2.duration),
                                            "执行状态": {
                                                formatter: function formatter() {
                                                    return formart1(item2.executeFlagName, item2.executeFlag);
                                                }
                                            },
                                            "执行信息(点击显示全部信息)": {
                                                formatter: function formatter() {
                                                    return formart2(item2.executeMsg);
                                                }
                                            }
                                        },
                                        children: []
                                    };
                                    data[0].children[i].children.push(obj);
                                }
                            };

                            for (var _iterator3 = items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                _loop2();
                            }
                            /**
                                * @description: 第四级数据
                                * @param {type} 
                                * @return: 
                                * @Author: xiaojun
                                * @Date: 2019-06-25 14:57:00
                                */
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }

                        var children1 = data[0].children[i].children;
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            var _loop3 = function _loop3() {
                                var item3 = _step4.value;

                                for (var j = 0, _len = children1.length; j < _len; j++) {
                                    if (item3.parentMonitorId === children1[j].id) {
                                        var obj = {
                                            id: item3.monitorId,
                                            pId: item3.parentMonitorId,
                                            attr: {
                                                obj: JSON.stringify(item3)
                                            },
                                            columns: {
                                                "序号": item3.orderNo,
                                                "节点": {
                                                    formatter: function formatter() {
                                                        return formart3(item3.nodeName, item3.executeFlag, item3.executeMsg);
                                                    }
                                                },
                                                "任务名称": item3.jobName,
                                                "任务类型": item3.memberTypeName,
                                                "删除": item3.deleteNum,
                                                "插入": item3.insertNum,
                                                "开始时间": $.kingdom.toDateTime(item3.startTime),
                                                "结束时间": $.kingdom.toDateTime(item3.endTime),
                                                "执行时长": $.kingdom.formatMillisecond(item3.duration),
                                                "执行状态": {
                                                    formatter: function formatter() {
                                                        return formart1(item3.executeFlagName, item3.executeFlag);
                                                    }
                                                },
                                                "执行信息(点击显示全部信息)": {
                                                    formatter: function formatter() {
                                                        return formart2(item3.executeMsg);
                                                    }
                                                }
                                            },
                                            children: []
                                        };
                                        data[0].children[i].children[j].children.push(obj);
                                    }
                                }
                            };

                            for (var _iterator4 = items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                _loop3();
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    }
                    return {
                        v: data
                    };
                }
            };

            for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ret = _loop();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    // 查询列表
    showContent.getSingleDatasourceList = function (paramsPage) {
        var jobId = $("#local-data").data("params").jobId;
        var batchNo = $("#local-data").data("params").batchNo;
        var params = { jobId: jobId, batchNo: batchNo, pageNumber: 1000, pageSize: 1 };
        params = $.extend(params, paramsPage);
        // $.kingdom.getList({
        //   apiName: "bayconnect.superlop.get_monitor_log_detail_info",
        //   apiVision: "v4.0",
        //   params: params,
        //   tableId: "J_sjl_single_job_log_table",
        //   pageId: "J_sjl_single_job_log_page",
        //   template: "common-page/template/single-job-log-list.handlebars",
        //   cb: showContent.getSingleDatasourceList,
        // });
        showContent.getTableData1(params);
    };
    showContent.getTableData1 = function (params) {
        $('#right-content-table').show();
        var paramsMap = $.extend({}, params);
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_monitor_log_detail_info", "v4.0", paramsMap, function (data) {
            // console.log(data);
            var items = data.bcjson.items || data.bcjson;
            if (data.bcjson.flag == "1") {
                $("#J_tableList").jstree('destroy');
                if (items.length > 0) {
                    showContent.currentMsgCollection = {};
                    //存放错误信息
                    $.each(items, function (index, item) {
                        showContent.currentMsgCollection[index] = item.executeMsg;
                        item['errorIndex'] = index;
                    });
                    var data_ = gene(items);
                    $("#single-job-log-table-tree").tableTree({
                        data: data_
                    });
                    var a = $("#single-job-log-table-tree").tableTree({
                        widthScale: 2,
                        data: data_
                    });
                    a.openNode($('[pkey="-1"]').attr('key'));
                    // if (executeFlag === "R") {

                    //     showContent.preTableData = [];

                    //     //执行中状态，所有的叶子节点，若无执行结果的状态则，给与display none
                    //     if ($("#single-job-log-table-tree .jstree-leaf").length > 1) {
                    //         $("#single-job-log-table-tree .jstree-leaf").css("display", "none");
                    //     }

                    //     showContent.updateTableData(paramsMap);
                    //     showContent.setInterval = setInterval(function() {
                    //         showContent.updateTableData(paramsMap);
                    //     }, 3000)
                    // }
                } else {
                    $('#J_tableList').html("<image src='assets/img/nonedata.png'/>").css('text-align', "center");
                }
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };
    module.exports = showContent;
});