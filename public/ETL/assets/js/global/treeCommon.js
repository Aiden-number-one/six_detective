/**
 * @Author:      limin01
 * @DateTime:    2018-10-15 19:05:08
 * @Description: 树操作公共方法 增删查改 （转换任务、作业流程、数据质量）
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-04-09 13:22:24
 */

define((require, exports, module) => {
    function init(PAGE, tree, queryBtn, queryInput, fileType) {
        this.PAGE = PAGE;
        this.tree = tree;
        this.queryBtn = queryBtn;
        this.queryInput = queryInput;
        this.fileType = fileType;
        let _this = this;
        // 左侧树形 查询任务 
        this.getTask = (foldName = "", isRenderMain = true, isRenderMinor = true, folderId,resolve,issearch) => {
            let self = this;
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_folder_menu", "v4.0", {
                fileType: this.fileType, // 1 作业, 2 任务
            }, data => {
                if (data.bcjson.flag == "1") {
                    let items = data.bcjson.items;
                    if (foldName) items = $.kingdom.filterFoldName(data.bcjson.items, foldName); // 前端实现搜索筛选数据
                    if (items.length === 0) {
                        $(`${this.tree}`).html(`<div class="no-data">No Data</div>`);
                        return;
                    }
                    let html = new $.kingdom.generateTreeData().init("", items, "foldName", "folderId");
                    if (isRenderMain) {
                        $(`${this.tree}`).jstree('destroy');
                        $(`${this.tree}`).html(html);
                        $(`${this.tree}`).jstree({
                            'core': {
                                "themes": {
                                    "responsive": false
                                },
                                'check_callback': true,
                            },
                            "plugins": ["types", "themes", "html_data", "state"],
                        });
                        $(`${this.tree}`).jstree(true);
                        $(`${this.tree}`).on("ready.jstree", function(e, data) {
                            if (folderId) {
                                $(`${self.tree} li[folderid=${folderId}]>.jstree-anchor`).click();
                            } else {
                                $(`${self.tree} .jstree-anchor:first`).click();
                            }
                            // 默认展开根节点
                            var inst = data.instance;  
                            var obj = inst.get_node(e.target.firstChild.firstChild.lastChild);  
                            inst.open_node(obj);  
                            if(issearch){
                                inst.open_all();
                            }
                            App.treeEllipsis(`${self.tree}`); // 超出...
                            if(resolve) resolve();
                        });
                    }
                    if (isRenderMinor) {
                        $(`${this.PAGE} [type=jstree]`).jstree('destroy');
                        $(`${this.PAGE} [type=jstree]`).html(html);
                        $(`${this.PAGE} [type=jstree]`).jstree({
                            "types": {
                                "default": {
                                    "icon": false // 删除默认图标
                                },
                            },
                            'core': {
                                "themes": {
                                    "responsive": false
                                },
                                'check_callback': true,
                            },
                            "plugins": ["types", "themes", "html_data", "contextmenu", "state"]
                        });
                    }
                }
            });
        };

        // 左侧树形 新增(修改,删除)任务
        this.addTask = obj => {
            let self = this;
            let folderName = $.trim(obj.text);
            // 必传参数
            let params = {
                fileType: this.fileType, // 1 作业, 2 任务
                creator: "admin",
                operType: "ADD",
                folderName,
                parentFolderId: parentFolderId,
                isParentFolder: obj.parents[1] === "#" ? "1" : "0",
            };
            // 新增需要传入父级folderID; 修改需要传入当前folderID
            if (!folderName) {
                toastr.info("File Name is missing");
                self.getTask("", true, false, params.parentFolderId);
                return;
            }

            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_folder_menu_modify", "v4.0", params, data => {
                if (data.bcjson.flag == "1") {
                    let items = data.bcjson.items;
                    let folderId = items[0].folderId;
                    $(`${this.tree} li[id=${obj.id}]`).attr("folderId", folderId);
                    self.getTask("", true, true, folderId);
                    App.treeEllipsis(`${this.tree}`);
                    toastr.success(data.bcjson.msg);
                } else {
                    self.getTask("", true, false, params.parentFolderId);
                    toastr.error(data.bcjson.msg);
                }
            });
        };
        // 左侧树形 新增(修改,删除)任务
        this.editTask = obj => {
            let self = this;
            let folderName = $.trim(obj.text);
            // 必传参数
            let params = {
                fileType: this.fileType, // 1 作业, 2 任务
                creator: "admin",
                operType: "UPD",
                folderName,
                folderId: obj.li_attr.folderid,
            };
            // 新增需要传入父级folderID; 修改需要传入当前folderID
            if (!folderName) {
                toastr.info("File Name is missing");
                self.getTask("", true, false, params.folderId);
                return;
            }
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_folder_menu_modify", "v4.0", params, data => {
                if (data.bcjson.flag == "1") {
                    // let items = data.bcjson.items;
                    // let folderId = items[0].folderId;
                    $(`${this.tree} li[id=${obj.id}]`).attr("folderId", params.folderId);
                    self.getTask("", true, true, params.folderId);
                    App.treeEllipsis(`${this.tree}`);
                    toastr.success(data.bcjson.msg);
                } else {
                    self.getTask("", true, false, params.folderId);
                    toastr.error(data.bcjson.msg);
                }
            });
        };

        // 左侧树形 新增(修改,删除)任务
        this.delTask = obj => {
            let self = this;
            // 必传参数
            let params = {
                fileType: this.fileType, // 1 作业, 2 任务
                creator: "admin",
                operType: "DEL",
                folderId: obj.folderId
            };

            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_folder_menu_modify", "v4.0", params, data => {
                if (data.bcjson.flag == "1") {
                    // let items = data.bcjson.items;
                    // let folderId = items[0].folderId;
                    $(`${this.tree} li[id=${obj.parent}]>a`).click(); // 触发父级菜单查询
                    self.getTask("", false, true);
                    App.treeEllipsis(`${this.tree}`);
                    toastr.success(data.bcjson.msg);
                } else {
                    self.getTask("", true, false, params.folderId);
                    toastr.error(data.bcjson.msg);
                }
            });
        }
        // 查询树 
        $("body").on("click", `${this.PAGE} ${this.queryBtn}`, function() {
            let folderName = $.trim($(`${_this.PAGE} ${_this.queryInput}`).val());
            _this.getTask(folderName, true, false,"","",true);
        });

        // 查询树 
        $("body").on("keydown", `${this.PAGE} ${this.queryInput}`, function(e) {
            if (e.keyCode == "13") {
                e.preventDefault();
                let folderName = $.trim($(this).val());
                _this.getTask(folderName, true, false,"","",true);
            };
        });
        
        // hover左侧树
        $("body").on("mouseenter", `${this.tree} .jstree-anchor`, function() {
            let level = $(this).closest("li").attr("aria-level");
            if ($(this).find(".jstree-operate").length === 1) {
                return;
            }
            if (level === "1") {
                $(this).append(`<div class="jstree-operate"><a name="add" title="新增"><i class="glyphicon glyphicon-plus" style="color:#10416c;"></i></a><a name="edit" title="编辑"><i class="glyphicon glyphicon-pencil" style="color:#10416c;"></i></a></div>`);
            } else if (level === "2") {
                $(this).append(`<div class="jstree-operate"><a name="add" title="新增"><i class="glyphicon glyphicon-plus" style="color:#10416c;"></i></a><a name="edit" title="编辑"><i class="glyphicon glyphicon-pencil" style="color:#10416c;"></i></a><a name="del" title="删除"><i class="glyphicon glyphicon-trash" style="color:#10416c;"></i></a></div>`);
            }
             else if (level === "3") {
                    $(this).append(`<div class="jstree-operate"><a name="add" title="新增"><i class="glyphicon glyphicon-plus" style="color:#10416c;"></i></a><a name="edit" title="编辑"><i class="glyphicon glyphicon-pencil" style="color:#10416c;"></i></a><a name="del" title="删除"><i class="glyphicon glyphicon-trash" style="color:#10416c;"></i></a></div>`);
            } else {
                $(this).append(`<div class="jstree-operate"><a name="edit" title="编辑"><i class="glyphicon glyphicon-pencil" style="color:#10416c;"></i></a><a name="del" title="删除"><i class="glyphicon glyphicon-trash" style="color:#10416c;"></i></a></div></div>`);
            }
        });

        $("body").on("mouseleave", `${this.tree} .jstree-anchor`, function() {
            $(".jstree-operate").remove();
        });

        // 新增树
        $("body").on("click", `${this.PAGE} .jstree-operate [name=add]`, function(e) {
            let reference = $(this).closest(".jstree-anchor");
            let inst = $.jstree.reference(reference);
            let obj = inst.get_node(reference);
            let iconArray = ["fa fa-folder icon-state-primary icon-lg", "fa fa-folder icon-state-primary", "fa fa-file icon-state-default", "fa fa-file icon-state-primary", "fa fa-file icon-state-primary"];
            parentFolderId = $(`${_this.tree} li[id=${obj.id}]`).attr("folderid"); // 刚新增的数据修改时手动添加的attr会被清除掉，这里强行赋值
            // 自定义新增节点的icon
            let level = obj.parents.length;
            if (level > 3) {
                toastr.info("不能创建子目录");
                return;
            }
            obj.types = iconArray[level];
            let newNode = inst.create_node(obj, {}, "first");
            inst.edit(newNode, $.trim(newNode.val), "64", _this.addTask);
        });

        // 编辑树
        $("body").on("click", `${this.PAGE} .jstree-operate [name=edit]`, function(e) {
            
            let reference = $(this).closest(".jstree-anchor");
            let inst = $.jstree.reference(reference);
            let obj = inst.get_node(reference);
            obj.li_attr.folderid = $(`${_this.tree} li[id=${obj.id}]`).attr("folderid"); // 刚新增的数据修改时手动添加的attr会被清除掉，这里强行赋值
            inst.edit(reference, $.trim(obj.text), "64", _this.editTask);
        });

        // 删除树
        $("body").on("click", `${this.PAGE} .jstree-operate [name=del]`, function(e) {
            let reference = $(this).closest(".jstree-anchor"),
            inst = $.jstree.reference(reference),
            obj = inst.get_node(reference);
            obj.li_attr.folderid = $(`${_this.tree} li[id=${obj.id}]`).attr("folderid"); // 刚新增的数据修改时手动添加的attr会被清除掉，这里强行赋值
            bootbox.confirm("Please confirm to delete <span style='color:red'>" + obj.text + "</span>", result => {
                if (result) {
                    inst.delete_node(reference);
                    let folderId = obj.li_attr.folderid ;
                    _this.delTask({ 
                        folderId, 
                        parent: obj.parent
                    });
                }
            });
        });
        
    }
    module.exports = init;
});
