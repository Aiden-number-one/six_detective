/**
 * @Author:      limin01
 * @DateTime:    2018-10-15 19:05:08
 * @Description: 树操作公共方法 增删查改 （转换任务、作业流程、数据质量）
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-04-09 13:22:24
 */

define(function (require, exports, module) {
    function init(PAGE, tree, queryBtn, queryInput, fileType) {
        var _this2 = this;

        this.PAGE = PAGE;
        this.tree = tree;
        this.queryBtn = queryBtn;
        this.queryInput = queryInput;
        this.fileType = fileType;
        var _this = this;
        // 左侧树形 查询任务 
        this.getTask = function () {
            var foldName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
            var isRenderMain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var isRenderMinor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var folderId = arguments[3];
            var resolve = arguments[4];
            var issearch = arguments[5];

            var self = _this2;
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_folder_menu", "v4.0", {
                fileType: _this2.fileType // 1 作业, 2 任务
            }, function (data) {
                if (data.bcjson.flag == "1") {
                    var items = data.bcjson.items;
                    if (foldName) items = $.kingdom.filterFoldName(data.bcjson.items, foldName); // 前端实现搜索筛选数据
                    if (items.length === 0) {
                        $("" + _this2.tree).html("<div class=\"no-data\">\u6CA1\u6709\u67E5\u8BE2\u6570\u636E</div>");
                        return;
                    }
                    var html = new $.kingdom.generateTreeData().init("", items, "foldName", "folderId");
                    if (isRenderMain) {
                        $("" + _this2.tree).jstree('destroy');
                        $("" + _this2.tree).html(html);
                        $("" + _this2.tree).jstree({
                            'core': {
                                "themes": {
                                    "responsive": false
                                },
                                'check_callback': true
                            },
                            "plugins": ["types", "themes", "html_data", "state"]
                        });
                        $("" + _this2.tree).jstree(true);
                        $("" + _this2.tree).on("ready.jstree", function (e, data) {
                            if (folderId) {
                                $(self.tree + " li[folderid=" + folderId + "]>.jstree-anchor").click();
                            } else {
                                $(self.tree + " .jstree-anchor:first").click();
                            }
                            // 默认展开根节点
                            var inst = data.instance;
                            var obj = inst.get_node(e.target.firstChild.firstChild.lastChild);
                            inst.open_node(obj);
                            if (issearch) {
                                inst.open_all();
                            }
                            App.treeEllipsis("" + self.tree); // 超出...
                            if (resolve) resolve();
                        });
                    }
                    if (isRenderMinor) {
                        $(_this2.PAGE + " [type=jstree]").jstree('destroy');
                        $(_this2.PAGE + " [type=jstree]").html(html);
                        $(_this2.PAGE + " [type=jstree]").jstree({
                            "types": {
                                "default": {
                                    "icon": false // 删除默认图标
                                }
                            },
                            'core': {
                                "themes": {
                                    "responsive": false
                                },
                                'check_callback': true
                            },
                            "plugins": ["types", "themes", "html_data", "contextmenu", "state"]
                        });
                    }
                }
            });
        };

        // 左侧树形 新增(修改,删除)任务
        this.addTask = function (obj) {
            var self = _this2;
            var folderName = $.trim(obj.text);
            // 必传参数
            var params = {
                fileType: _this2.fileType, // 1 作业, 2 任务
                creator: localStorage.getItem('loginName'),
                operType: "ADD",
                folderName: folderName,
                parentFolderId: parentFolderId,
                isParentFolder: obj.parents[1] === "#" ? "1" : "0"
            };
            // 新增需要传入父级folderID; 修改需要传入当前folderID
            if (!folderName) {
                toastr.info("File Name is missing");
                self.getTask("", true, false, params.parentFolderId);
                return;
            }

            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_folder_menu_modify", "v4.0", params, function (data) {
                if (data.bcjson.flag == "1") {
                    var items = data.bcjson.items;
                    var folderId = items[0].folderId;
                    $(_this2.tree + " li[id=" + obj.id + "]").attr("folderId", folderId);
                    self.getTask("", true, true, folderId);
                    App.treeEllipsis("" + _this2.tree);
                    toastr.success(data.bcjson.msg);
                } else {
                    self.getTask("", true, false, params.parentFolderId);
                    toastr.error(data.bcjson.msg);
                }
            });
        };
        // 左侧树形 新增(修改,删除)任务
        this.editTask = function (obj) {
            var self = _this2;
            var folderName = $.trim(obj.text);
            // 必传参数
            var params = {
                fileType: _this2.fileType, // 1 作业, 2 任务
                creator: localStorage.getItem('loginName'),
                operType: "UPD",
                folderName: folderName,
                folderId: obj.li_attr.folderid
            };
            // 新增需要传入父级folderID; 修改需要传入当前folderID
            if (!folderName) {
                toastr.info("File Name is missing");
                self.getTask("", true, false, params.folderId);
                return;
            }
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_folder_menu_modify", "v4.0", params, function (data) {
                if (data.bcjson.flag == "1") {
                    // let items = data.bcjson.items;
                    // let folderId = items[0].folderId;
                    $(_this2.tree + " li[id=" + obj.id + "]").attr("folderId", params.folderId);
                    self.getTask("", true, true, params.folderId);
                    App.treeEllipsis("" + _this2.tree);
                    toastr.success(data.bcjson.msg);
                } else {
                    self.getTask("", true, false, params.folderId);
                    toastr.error(data.bcjson.msg);
                }
            });
        };

        // 左侧树形 新增(修改,删除)任务
        this.delTask = function (obj) {
            var self = _this2;
            // 必传参数
            var params = {
                fileType: _this2.fileType, // 1 作业, 2 任务
                creator: localStorage.getItem('loginName'),
                operType: "DEL",
                folderId: obj.folderId
            };

            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_folder_menu_modify", "v4.0", params, function (data) {
                if (data.bcjson.flag == "1") {
                    // let items = data.bcjson.items;
                    // let folderId = items[0].folderId;
                    $(_this2.tree + " li[id=" + obj.parent + "]>a").click(); // 触发父级菜单查询
                    self.getTask("", false, true);
                    App.treeEllipsis("" + _this2.tree);
                    toastr.success(data.bcjson.msg);
                } else {
                    self.getTask("", true, false, params.folderId);
                    toastr.error(data.bcjson.msg);
                }
            });
        };
        // 查询树 
        $("body").on("click", this.PAGE + " " + this.queryBtn, function () {
            var folderName = $.trim($(_this.PAGE + " " + _this.queryInput).val());
            _this.getTask(folderName, true, false, "", "", true);
        });

        // 查询树 
        $("body").on("keydown", this.PAGE + " " + this.queryInput, function (e) {
            if (e.keyCode == "13") {
                e.preventDefault();
                var folderName = $.trim($(this).val());
                _this.getTask(folderName, true, false, "", "", true);
            };
        });

        // hover左侧树
        $("body").on("mouseenter", this.tree + " .jstree-anchor", function () {
            var _this3 = this;

            setTimeout(function () {
                var level = $(_this3).closest("li").attr("aria-level");
                if ($(_this3).find(".jstree-operate").length === 1) {
                    return;
                }
                if (level === "1") {
                    $(_this3).append("<div class=\"jstree-operate\"><a name=\"add\" title=\"ADD\"><i class=\"glyphicon glyphicon-plus\" style=\"color:#464C51;\"></i></a><a name=\"edit\" title=\"EDIT\"><i class=\"glyphicon glyphicon-pencil\" style=\"color:#464C51;\"></i></a></div>");
                } else if (level === "2") {
                    $(_this3).append("<div class=\"jstree-operate\"><a name=\"add\" title=\"ADD\"><i class=\"glyphicon glyphicon-plus\" style=\"color:#464C51;\"></i></a><a name=\"edit\" title=\"EDIT\"><i class=\"glyphicon glyphicon-pencil\" style=\"color:#464C51;\"></i></a><a name=\"del\" title=\"DELETE\"><i class=\"glyphicon glyphicon-trash\" style=\"color:#464C51;\"></i></a></div>");
                } else if (level === "3") {
                    $(_this3).append("<div class=\"jstree-operate\"><a name=\"add\" title=\"ADD\"><i class=\"glyphicon glyphicon-plus\" style=\"color:#464C51;\"></i></a><a name=\"edit\" title=\"EDIT\"><i class=\"glyphicon glyphicon-pencil\" style=\"color:#464C51;\"></i></a><a name=\"del\" title=\"DELETE\"><i class=\"glyphicon glyphicon-trash\" style=\"color:#464C51;\"></i></a></div>");
                } else {
                    $(_this3).append("<div class=\"jstree-operate\"><a name=\"edit\" title=\"EDIT\"><i class=\"glyphicon glyphicon-pencil\" style=\"color:#464C51;\"></i></a><a name=\"del\" title=\"DELTTE\"><i class=\"glyphicon glyphicon-trash\" style=\"color:#464C51;\"></i></a></div></div>");
                }
            }, 0);
        });
        $("body").on("mouseenter", this.tree + " .jstree-operate", function () {
            $(this).css('z-index', 10000);
        });

        // 新增树
        $("body").on("click", this.PAGE + " .jstree-operate [name=add]", function (e) {
            var reference = $(this).closest(".jstree-anchor");
            var inst = $.jstree.reference(reference);
            var obj = inst.get_node(reference);
            var iconArray = ["fa fa-folder icon-state-primary icon-lg", "fa fa-folder icon-state-primary", "fa fa-file icon-state-default", "fa fa-file icon-state-primary", "fa fa-file icon-state-primary"];
            parentFolderId = $(_this.tree + " li[id=" + obj.id + "]").attr("folderid"); // 刚新增的数据修改时手动添加的attr会被清除掉，这里强行赋值
            // 自定义新增节点的icon
            var level = obj.parents.length;
            if (level > 3) {
                toastr.info("不能创建子目录");
                return;
            }
            obj.types = iconArray[level];
            var newNode = inst.create_node(obj, {}, "first");
            inst.edit(newNode, $.trim(newNode.val), "64", _this.addTask);
        });

        // 编辑树
        $("body").on("click", this.PAGE + " .jstree-operate [name=edit]", function (e) {

            var reference = $(this).closest(".jstree-anchor");
            var inst = $.jstree.reference(reference);
            var obj = inst.get_node(reference);
            obj.li_attr.folderid = $(_this.tree + " li[id=" + obj.id + "]").attr("folderid"); // 刚新增的数据修改时手动添加的attr会被清除掉，这里强行赋值
            inst.edit(reference, $.trim(obj.text), "64", _this.editTask);
        });

        // 删除树
        $("body").on("click", this.PAGE + " .jstree-operate [name=del]", function (e) {
            var reference = $(this).closest(".jstree-anchor"),
                inst = $.jstree.reference(reference),
                obj = inst.get_node(reference);
            obj.li_attr.folderid = $(_this.tree + " li[id=" + obj.id + "]").attr("folderid"); // 刚新增的数据修改时手动添加的attr会被清除掉，这里强行赋值
            bootbox.confirm("Please confirm to delete  <span style='color:red'>" + obj.text + "</span>", function (result) {
                if (result) {
                    inst.delete_node(reference);
                    var folderId = obj.li_attr.folderid;
                    _this.delTask({
                        folderId: folderId,
                        parent: obj.parent
                    });
                }
            });
        });

        $("body").on("mouseleave", this.tree + " .jstree-anchor", function () {
            setTimeout(function () {
                $(".jstree-operate").remove();
            }, 0);
        });
    }
    module.exports = init;
});