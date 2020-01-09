var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * @Author:      limin01
 * @DateTime:    2018-12-12 11:28:50
 * @Description: Description
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-04-08 15:02:59
 */
define(function (require, exports, module) {
    require("plugins/jstree/dist/jstree");
    require("plugins/jstree/dist/themes/default/style.css");

    require("plugins/select2/js/select2.js");
    require("plugins/select2/css/select2.css");
    require("plugins/select2/css/select2-compatible.css");
    require("assets/js/global/tableTree");
    require("assets/js/global/tableTree1");
    var showContent = {};
    showContent._load = function () {
        showContent.getDataSourceList();
        showContent.getList();
        showContent.initForm();
        App.handleDateTimePickers();
    };
    //禁止浏览器滑动
    showContent.unScroll = function () {
        var top = $(document).scrollTop();
        $(document).on('scroll.unable', function (e) {
            $(document).scrollTop(top);;
        });
    };
    // 浏览器滑动
    showContent.reScroll = function () {
        $(document).off('scroll.unable');
    };
    // 如果需要分细类，请把注释放开
    function gene(items) {
        var data = [{
            id: "1",
            pId: "-1",
            columns: {
                "Name": "资料管理",
                // "文件夹": "",
                "Type": "",
                "Description": "",
                "Action": {
                    formatter: function formatter() {
                        return "<a name=\"export\" title=\"EXPORT\">EXPORT</a>";
                    }
                }
            },
            children: []
        }];

        for (var i in items) {
            var obj = {
                id: i,
                pId: "1",
                attr: {
                    objectType: items[i][0].objectType
                },
                columns: {
                    "Name": items[i][0].objectTypeName,
                    // "文件夹": "",
                    "Type": "",
                    "Description": "",
                    "Action": {
                        formatter: function formatter() {
                            return "<a name=\"export\" title=\"EXPORT\">EXPORT</a>";
                        }
                    }
                },
                children: []
            };
            data[0].children.push(obj);
        };

        var children = data[0].children;

        var o = {}; // 储存第三级的children
        for (var _i = 0, len = children.length; _i < len; _i++) {
            // let arr = []; // 校验是否重复
            var _obj = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var item = _step.value;

                    for (var x in item) {
                        item[x] = item[x].replace(/\"/g, "&quot;"); // 双引号转义
                        item[x] = item[x].replace(/\'/g, "&apos;"); // 单引号转义
                    }
                    console.log(item.objectName);
                    if (item.folderName) {
                        (function () {
                            // 如果存在文件夹
                            var folder = item.folderName.split("/");
                            var folderId = item.folderIds.split(",");
                            var cacheObj = []; //用于循环时保存children
                            var pId = "";

                            var _loop2 = function _loop2(j) {
                                item.folderId = folderId[j] || "";
                                item.folderName = folder[j] || "";
                                item.parentFolderId = folderId[0];
                                if (j === 0) {
                                    //第一级文件夹
                                    if (_obj.length > 0) {
                                        //如果已有数据
                                        if (_obj.map(function (e) {
                                            //判断文件夹是否已经存在
                                            if (e.id === item.folderId[j]) {
                                                return true;
                                            }
                                            return false;
                                        }).includes(true)) {
                                            cacheObj = _obj;
                                            pId = folderId[j];
                                        } else {
                                            // 不存在则添加
                                            _obj.push({
                                                id: folderId[j],
                                                pId: item.objectType,
                                                attr: {
                                                    obj: JSON.stringify(item)
                                                },
                                                columns: {
                                                    "Name": folder[j],
                                                    // "文件夹": "",
                                                    "Type": "",
                                                    "Description": "",
                                                    "Action": {
                                                        formatter: function formatter() {
                                                            return "<a name=\"export\" title=\"EXPORT\">EXPORT</a>";
                                                        }
                                                    }
                                                },
                                                children: []
                                            });
                                            cacheObj = _obj;
                                            pId = folderId[j];
                                        }
                                    } else {
                                        // 如果没数据则直接添加
                                        _obj.push({
                                            id: folderId[j],
                                            pId: item.objectType,
                                            attr: {
                                                obj: JSON.stringify(item)
                                            },
                                            columns: {
                                                "Name": folder[j],
                                                // "文件夹": "",
                                                "Type": "",
                                                "Description": "",
                                                "Action": {
                                                    formatter: function formatter() {
                                                        return "<a name=\"export\" title=\"EXPORT\">EXPORT</a>";
                                                    }
                                                }
                                            },
                                            children: []
                                        });
                                        cacheObj = _obj;
                                        pId = folderId[j];
                                    }
                                } else if (j < folder.length) {
                                    // 第二。。级文件夹
                                    var num = void 0,
                                        child = void 0;
                                    cacheObj.map(function (value, index) {
                                        if (value.id === folderId[j - 1]) {
                                            num = index;
                                            return index;
                                        }
                                    }); //判断应该添加到第几个child里面
                                    child = cacheObj[num].children;
                                    // 1和第一层一样的Action
                                    if (child.length > 0) {
                                        var isnew = false;
                                        child.map(function (e) {
                                            if (e.id === folderId[j]) {
                                                isnew = true;
                                                return true;
                                            }
                                            return false;
                                        });
                                        if (isnew) {
                                            cacheObj = child;
                                            pId = folderId[j];
                                        } else {
                                            child.push({
                                                id: folderId[j],
                                                pId: pId,
                                                attr: {
                                                    obj: JSON.stringify(item)
                                                },
                                                columns: {
                                                    "Name": folder[j],
                                                    // "文件夹": "",
                                                    "Type": "",
                                                    "Description": "",
                                                    "Action": {
                                                        formatter: function formatter() {
                                                            return "<a name=\"export\" title=\"EXPORT\">EXPORT</a>";
                                                        }
                                                    }
                                                },
                                                children: []
                                            });
                                            cacheObj = child;
                                            pId = folderId[j];
                                        }
                                    } else {
                                        child.push({
                                            id: folderId[j],
                                            pId: pId,
                                            attr: {
                                                obj: JSON.stringify(item)
                                            },
                                            columns: {
                                                "Name": folder[j],
                                                // "文件夹": "",
                                                "Type": "",
                                                "Description": "",
                                                "Action": {
                                                    formatter: function formatter() {
                                                        return "<a name=\"export\" title=\"EXPORT\">EXPORT</a>";
                                                    }
                                                }
                                            },
                                            children: []
                                        });
                                        cacheObj = child;
                                        pId = folderId[j];
                                    }
                                } else {
                                    // 文件夹添加完毕  添加任务层
                                    var _num = void 0,
                                        _child = void 0;
                                    cacheObj.map(function (value, index) {
                                        if (value.id === folderId[j - 1]) {
                                            _num = index;
                                            return index;
                                        }
                                    });
                                    _child = cacheObj[_num].children;
                                    item.folderIds = "";
                                    _child.push({
                                        id: item.objectId,
                                        pId: pId,
                                        attr: {
                                            obj: JSON.stringify(item)
                                        },
                                        columns: {
                                            "Name": item.objectName,
                                            // "文件夹": "",
                                            "Type": item.objectClassTypeName,
                                            "Description": item.objectDesc,
                                            "Action": {
                                                formatter: function formatter() {
                                                    return "<a name=\"export\" title=\"EXPORT\">EXPORT</a>";
                                                }
                                            }
                                        },
                                        children: []
                                    });
                                }
                            };

                            for (var j = 0; j <= folder.length; j++) {
                                _loop2(j);
                            }
                            children[_i].children = _obj;
                        })();
                    } else {
                        //如果没有文件夹  直接添加任务层
                        var _obj2 = {
                            id: item.objectId,
                            pId: item.objectType,
                            attr: {
                                obj: JSON.stringify(item)
                            },
                            columns: {
                                "Name": item.objectName,
                                // "文件夹": item.folderName,
                                "Type": item.objectClassTypeName,
                                "Description": item.objectDesc,
                                "Action": {
                                    formatter: function formatter() {
                                        return "<a name=\"export\" title=\"EXPORT\">EXPORT</a>";
                                    }
                                }
                            },
                            children: []
                        };
                        children[_i].children.push(_obj2);
                    }
                };

                for (var _iterator = items[children[_i].id][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
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
        return data;
    }
    //导入弹框树处理数据函数
    function gene1(items) {
        var data = [{
            id: "1",
            pId: "-1",
            columns: {
                "Name": "资料管理",
                "Type": "",
                "Description": ""
            },
            children: []
        }];

        for (var i in items) {
            var obj = {
                id: i,
                pId: "1",
                attr: {
                    objectType: items[i][0].objectType
                },
                columns: {
                    "Name": items[i][0].objectTypeName,
                    // "文件夹": item.folderName,
                    "Type": items[i][0].objectClassTypeName,
                    "Description": items[i][0].objectDesc
                },
                children: []
            };
            data[0].children.push(obj);
        };

        var children = data[0].children;

        var o = {}; // 储存第三级的children
        for (var _i2 = 0, len = children.length; _i2 < len; _i2++) {
            // let arr = []; // 校验是否重复
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = items[children[_i2].id][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _item = _step2.value;

                    var _obj3 = {
                        id: _item.objectId,
                        pId: _item.objectType,
                        attr: {
                            obj: JSON.stringify(_item)
                        },
                        columns: {
                            "Name": _item.objectName,
                            // "文件夹": "",
                            "Type": _item.objectClassTypeName,
                            "Description": _item.objectDesc
                        },
                        children: []
                    };
                    // if (!arr.includes(obj.id)) {
                    children[_i2].children.push(_obj3);
                    //     arr.push(obj.id);
                    // }
                    // if (item.objectClassType) {
                    //     if (o.hasOwnProperty(item.objectClassType)) {
                    //         o[item.objectClassType].push({
                    //             id: item.objectId,
                    //             pId: item.objectClassType,
                    //             columns: {
                    //                 "Name": item.objectName,
                    //                 "文件夹": item.folderName,
                    //                 "Type": item.objectClassTypeName,
                    //                 "Description": item.objectDesc,
                    //                 "Action": format(),
                    //             },
                    //         });
                    //     } else {
                    //         o[item.objectClassType] = [{
                    //             id: item.objectId,
                    //             pId: item.objectClassType,
                    //             columns: {
                    //                 "Name": item.objectName,
                    //                 "文件夹": item.folderName,
                    //                 "Type": item.objectClassTypeName,
                    //                 "Description": item.objectDesc,
                    //                 "Action": format(),
                    //             },
                    //         }];
                    //     }
                    // }
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
        }

        // for (let i = 0, len = children.length; i < len; i++) {
        //     for (let item of children[i].children) {
        //         if (o.hasOwnProperty(item.id)) {
        //             item.children = o[item.id];
        //         }
        //     }
        // }

        return data;
    }

    showContent.getList = function () {
        var params = App.getFormParams("J_export_list_form");
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_config_export_list", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                if (items.length === 0) {
                    $("#J_source_tree").html("<div class=\"no-data\">No Data</div>");
                    return;
                } else {
                    var data_ = gene(items[0]);
                    $("#J_table_tree").tableTree({
                        checkbox: true,
                        data: data_
                    }).openNode("1"); // 默认展开一级
                    $("#J_table_tree thead tr th:first-child").css("width", "50px");
                    $("#J_table_tree thead tr th:nth-child(2)").css("text-indent", "100px");
                }
            }
        });
    };
    // 过滤传参 规则： 如果第二级全选，则只传父级 objectType ，不全选，传子类 objectList ，逗号隔开
    showContent.filterCondition = function () {
        // let checkedLevel3 = $("#J_table_tree [level=3] [type=checkbox]:checked"), // 选中的level3
        checkedLevel2 = $("#J_table_tree [level=2] [type=checkbox]:checked"), // 选中的level2
        checkedLevel1 = $("#J_table_tree [level=1] [type=checkbox]:checked"), // 选中的level1
        level2 = $("#J_table_tree [level=2] [type=checkbox]"), // 所有的level2
        checkedAll = $("#J_table_tree [type=checkbox]:checked"), // 所有被选中的checkBoxed
        arr3 = [], // 单个的数据集 array 
        arr2 = [];
        if (checkedLevel2) {
            $.each(checkedLevel2, function () {
                arr2.push($(this).closest('tr').attr("key"));
            });
        }

        checkedAll.length && $.each(checkedAll, function () {
            var obj = "",
                tr = $(this).closest('tr');
            if ($(this).attr("obj")) {
                obj = JSON.parse($(this).attr("obj"));
            }
            if (obj) {
                if (!obj.folderName) {
                    var pkey = void 0,
                        ot = void 0;
                    if (obj.parentFolderId) {
                        pkey = $("#J_table_tree [key=" + obj.parentFolderId + "] [type=checkbox]").closest('tr').attr("pkey"), ot = $("#J_table_tree [key=" + pkey + "] [type=checkbox]:checked").attr("objecttype"); // 如果父级勾选 传父级的objecttype
                    } else {
                        pkey = tr.attr("pkey");
                        ot = $("#J_table_tree [key=" + pkey + "] [type=checkbox]:checked").attr("objecttype"); // 如果父级勾选 传父级的objecttype
                    }

                    if (!arr2.includes(ot)) {
                        var _obj4 = obj,
                            _objectType = _obj4.objectType,
                            objectClassTypeName = _obj4.objectClassTypeName,
                            objectId = _obj4.objectId,
                            objectTypeName = _obj4.objectTypeName,
                            objectName = _obj4.objectName,
                            tableName = _obj4.tableName,
                            columnsId = _obj4.columnsId,
                            objectClassType = _obj4.objectClassType,
                            folderId = _obj4.folderId,
                            folderIds = _obj4.folderIds;

                        arr3.push({
                            objectType: _objectType,
                            objectId: objectId,
                            objectName: objectName,
                            tableName: tableName,
                            columnsId: columnsId,
                            objectClassType: objectClassType,
                            folderId: folderId,
                            objectTypeName: objectTypeName,
                            objectClassTypeName: objectClassTypeName,
                            folderIds: folderIds
                        });
                    }
                }
            }
        });
        // checkedLevel3.length && 
        //     $.each(checkedLevel3, function() {
        //         let obj = JSON.parse($(this).attr("obj")),
        //             tr = $(this).closest('tr'),
        //             pkey = tr.attr("pkey"),
        //             ot = $(`#J_table_tree [key=${pkey}] [type=checkbox]:checked`).attr("objecttype"); // 如果父级勾选 传父级的objecttype
        //         // 全选
        //             if (!arr2.includes(ot)) {
        //                 if(!obj.folderName){
        //                     let { objectType,objectClassTypeName, objectId,objectTypeName, objectName, tableName, columnsId, objectClassType, folderId,folderIds} = obj;
        //                     arr3.push({
        //                         objectType,
        //                         objectId,
        //                         objectName,
        //                         tableName,
        //                         columnsId,
        //                         objectClassType,
        //                         folderId,
        //                         objectTypeName,
        //                         objectClassTypeName,
        //                         folderIds
        //                     });
        //                 }
        //             }       
        //     });


        checkedLevel2.length && $.each(checkedLevel2, function () {
            var ot = $(this).attr("objecttype");
            if (!arr2.includes(ot)) {
                arr2.push(ot);
            }
        });

        if (checkedLevel1.length > 0) {
            level2.length && $.each(level2, function () {
                var ot = $(this).attr("objecttype");
                if (!arr2.includes(ot)) {
                    arr2.push(ot);
                }
            });
        }

        objectType = arr2.join(",");
        return {
            objectType: objectType,
            objectList: JSON.stringify(arr3)
        };
    };
    // 过滤传参 规则： 如果第二级全选，则只传父级 objectType ，不全选，传子类 objectList ，逗号隔开
    showContent.filterConditionImport = function (i) {
        var checkedLevel3 = $("#execDbConnection_" + i + " [level=3] [type=checkbox]:checked"),
            // 选中的level3
        checkedLevel2 = $("#execDbConnection_" + i + " [level=2] [type=checkbox]:checked"),
            // 选中的level2
        checkedLevel1 = $("#execDbConnection_" + i + " [level=1] [type=checkbox]:checked"),
            // 选中的level1
        level2 = $("#execDbConnection_" + i + " [level=2] [type=checkbox]"),
            // 所有的level2
        arr3 = [],
            // 单个的数据集 array 
        arr2 = [];
        // if (checkedLevel2) {
        //     $.each(checkedLevel2, function() {
        //         arr2.push($(this).closest('tr').attr("key"));
        //     })
        // }
        checkedLevel3.length && $.each(checkedLevel3, function () {
            var obj = JSON.parse($(this).attr("obj")),
                tr = $(this).closest('tr'),
                pkey = tr.attr("pkey"),
                ot = $("#execDbConnection_" + i + " [key=" + pkey + "] [type=checkbox]:checked").attr("objecttype"); // 如果父级勾选 传父级的objecttype
            // 全选
            // if (!arr2.includes(ot)) {
            var objectType = obj.objectType,
                objectId = obj.objectId,
                folderIds = obj.folderIds;

            arr3.push({
                objectType: objectType,
                objectId: objectId,
                folderIds: folderIds
            });
            // }
        });

        // checkedLevel2.length &&
        //     $.each(checkedLevel2, function() {
        //         let ot = $(this).attr("objecttype");
        //         if (!arr2.includes(ot)) {
        //             arr2.push(ot);
        //         }
        //     })

        // if (checkedLevel1.length > 0) {
        //     level2.length &&
        //         $.each(level2, function() {
        //             let ot = $(this).attr("objecttype");
        //             if (!arr2.includes(ot)) {
        //                 arr2.push(ot);
        //             }
        //         })
        // }

        // objectType = arr2.join(",");
        return {
            configList: JSON.stringify(arr3)
        };
    };
    // EXPORT
    showContent.export = function (params) {
        App.blockUI({
            boxed: true,
            message: "Processing..."
        });
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.export_sys_config", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                $("#J_export_success_modal").modal('show');
                $("#J_edit_fileName_modal").modal("hide");
            } else {
                toastr.error(data.bcjson.msg);
            }
            App.unblockUI();
        });
    };
    // 导入
    showContent.import = function (params) {
        App.blockUI({
            boxed: true,
            message: "Processing..."
        });
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_config_info_import_v2", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                toastr.success(data.bcjson.msg);
                $("#J_import_modal").modal("hide");
            } else {
                toastr.error(data.bcjson.msg);
            }
            App.unblockUI();
        });
    };

    // 校验文件并获取
    showContent.downloadFile = function (params) {
        return new Promise(function (resolve, reject) {
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.file_info", "v4.0", params, function (data) {
                if (data.bcjson.flag == "1") {
                    resolve(data);
                } else {
                    App.unblockUI();
                    toastr.error(data.bcjson.msg);
                }
            });
        });
    };

    // 下载文件
    showContent.downloadFile2 = function (params) {
        var url = "/retl/rest/admin/v4.0/bayconnect.superlop.file_download.json?p=" + encodeURI(JSON.stringify(params));
        try {
            var a = document.createElement("a");
            a.href = url, a.download = url, a.click();
            App.unblockUI();
        } catch (e) {
            console.error(e);
        }
    };
    // 重新EXPORT文件
    showContent.reExport = function (params) {
        App.blockUI({
            boxed: true,
            message: "Processing..."
        });
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_re_download_sys_config", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                showContent.getExportList();
                $("#J_export_success_modal").modal('show');
                $("#J_edit_fileName_modal").modal("hide");
            } else {
                toastr.error(data.bcjson.msg);
            }
            App.unblockUI();
        });
    };
    // 导入列表获取
    showContent.getImportList = function () {
        App.blockUI({
            boxed: true,
            message: "Processing..."
        });
        $.kingdom.uploadWithApi("J_import_form", "get_sys_config_import_list", function (data) {
            App.unblockUI();
            if (data.bcjson.flag == "1") {
                toastr.success(data.bcjson.msg);
                var items = data.bcjson.items;
                $("#J_import_modal .nav-tabs").html("");
                $("#J_import_modal .tab-content").html("");
                showContent.deZipPaths = [];
                $.each(items, function (i, item) {
                    showContent.deZipPaths.push(item.deZipPath);
                    $("#J_import_modal .nav-tabs").append(" <li>\n                    <a href=\"#tab_3_" + i + "\" data-toggle=\"tab\" aria-expanded=\"true\">" + item.fileName + " </a>\n                </li>");
                    $("#J_import_modal .tab-content").append("\n                <div class=\"tab-pane\" id=\"tab_3_" + i + "\"> \n                <div class=\"row\">\n                 <div class=\"form-group\" >\n                    <div style=\"padding: 0 20px 0 80px;\">\n                    <div class=\"col-md-11\" style=\"max-height: 400px;overflow:auto;\">\n                    <table id=\"execDbConnection_" + i + "\"  class=\"table table-hover table-tree\" style=\"max-height:800px;over-flow:auto\">\n                    </table>\n                  </div>\n                 </div>\n                        </div>\n                </div> \n                </div>\n                ");
                    var data_ = gene1(items[i].configInfoList);
                    $("#execDbConnection_" + i).TableTree1({
                        checkbox: true,
                        data: data_
                    }).openNode("1"); // 默认展开一级
                    $("#execDbConnection_" + i + " thead tr th:nth-child(2)").css("text-indent", "100px");
                });
                $("#J_import_modal .nav-tabs li").eq(0).addClass("active").css("margin-left", "80px");
                $("#J_import_modal .tab-content .tab-pane").eq(0).addClass("active");
                // showContent.deZipPath = data.bcjson.items[0].deZipPath;
                // let data_ = gene1(data.bcjson.items[0].configInfoList);
                // $("#execDbConnection").TableTree1({
                //     checkbox: true,
                //     data: data_,
                // }).openNode("1"); // 默认展开一级
                // $("#execDbConnection thead tr th:nth-child(2)").css("text-indent", "100px");
                // $("#J_import_modal").modal('hide');
            } else {
                toastr.error(data.bcjson.msg);
            }
        });
    };

    // 查询数据连接 
    showContent.getDataSourceList = function () {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_source_config", "v4.0", {}, function (data) {
            if (data.bcjson.flag == "1") {
                var items = data.bcjson.items;
                var arr = [{
                    id: "",
                    text: ""
                }];
                if (items && items.length > 0) {
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var _item2 = _step3.value;

                            arr.push({
                                id: _item2.connectionId,
                                text: _item2.connectionName
                            });
                        }
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
                }
                // 数据连接
                $("[name=execDbConnectionId]").select2({
                    data: arr,
                    placeholder: '- Please Select -'
                });
            }
        });
    };

    showContent.getExportList = function (params) {
        var _params = {}; // 这里用来传特殊参数
        _params = _extends(_params, params);
        $.kingdom.getList({
            apiName: "bayconnect.superlop.get_sys_config_import_log",
            apiVision: "v4.0",
            params: _params,
            tableId: "J_export_list",
            pageId: "J_export_page",
            formName: "J_export_form",
            template: "database-import/template/export-list.handlebars",
            cb: showContent.getExportList
        });
    };

    // 保存
    showContent.del = function (params) {
        App.blockUI({
            boxed: true,
            message: "处理中..."
        });
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_sys_config_data_log_del", "v4.0", params, function (data) {
            if (data.bcjson.flag == "1") {
                toastr.success(data.bcjson.msg);
                showContent.getExportList();
            } else {
                toastr.error(data.bcjson.msg);
            }
            App.unblockUI();
        });
    };

    //下载错误日志
    showContent.downloadLog = function (filename, content) {
        var blob = new Blob([content], { type: 'txt' });
        var a = document.getElementById('downloadFtsetBtn');
        if (a == undefined) {
            a = document.createElement('a');
            a.id = 'downloadFtsetBtn';
            a.style.display = 'none';
            a.target = '_blank';
            document.body.appendChild(a);
        }
        try {
            var URL = window.URL || window.webkitURL;
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            if (typeof navigator.msSaveBlob == "function") {
                //IE
                navigator.msSaveBlob(blob, filename);
            }
            a.click();
        } catch (e) {
            console.error(e);
        }
    };
    /**
     * @description: 获取当前时间戳
     * @param {type} 
     * @return: 
     * @Author: xiaojun
     * @Date: 2019-07-02 13:26:28
     */
    showContent.timestampToTime = function () {
        var date = new Date();
        var Y = date.getFullYear();
        var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
    };
    // 所有表单校验配置
    showContent.initForm = function () {
        // 
        $('#J_edit_fileName').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                fileName: {
                    required: true,
                    isEditFileName: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });
        $('#J_reExport_edit_fileName').validate({
            debug: true,
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                fileName: {
                    required: true,
                    isEditFileName: true
                }
            },
            invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                // $('.alert-danger', $('.login-form')).show();
            },
            highlight: function highlight(element) {
                // hightlight error inputs
                $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function success(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
            errorPlacement: function errorPlacement(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function submitHandler(form) {}
        });
        $.validator.addMethod("isEditFileName", function (value, element) {
            var res = /^[^\\\/:\*\?\"\<\>\|]{0,50}$/;
            if (res.test(value)) {
                return true;
            } else {
                return false;
            }
        }, "\u540D\u79F0\u4E0D\u8D85\u8FC750\u4E2A\u5B57\u7B26\u4E14\u4E0D\u80FD\u5305\u542B\u4EE5\u4E0B\u5B57\u7B26\uFF1A\\ / : * ? \" <> | ");
    };
    module.exports = showContent;
});