/*
 * @Author: lixiaojie
 * @Description: file content
 * @email: lixiaojie@szkingdom.com
 * @Date: 2019-05-07 10:48:22
 */

define((require, exports, module) => {
    let showContent = require("./data-modelShow");
    const PAGE = location.hash.replace("#", ".page-");
    let init = {
        load: function () {
            showContent._load(); //加载页面数据
             //初始化拖动
          var oBar = document.getElementById("J_drag_bar4");
          var oTarget = document.getElementById("J_drag_bar4");
          startDrag(oBar, oTarget, ".left-side-model", ".right-content-model", function () {
              LFWIDTH = $('.left-side').width();
             
          });
        }
    };
    $(function () {
         
        // 左侧树名称超出隐藏
        $("body").on("click", `${PAGE} #J_dataModel_tree .jstree-ocl`, function () {
            App.treeEllipsis("#J_dataModel_tree");
        })
        // 点击左侧树
        $("body").on("click", `${PAGE} #J_dataModel_tree .jstree-anchor`, function () {
            showContent.getTaskList();
            showContent.getDataModel();
        });

        //模型数据表 > 新增
        $("body").on("click", `${PAGE} #J_dataModel_add`, function () {
            //如果存在编辑状态就不让添加;
            var isedit = 0;
            $.each($(`${PAGE} #J_dataModal_list tr`), function () {
                var edit = $(this).attr("edit");
                if (edit == "1") {
                    isedit = 1;
                    return false;
                }
            })
            if (isedit == 1) {
                toastr.warning("请先保存未保存的数据");
                return false;
            }
            var trAttr = {};
            //用来给保存的时候 判断是编辑保存，还是新增保存
            trAttr.addNew = "1";
            //如果是暂无数据的时候 添加特殊处理
            if ($(`${PAGE} #J_dataModal_list tr:last-child`).hasClass("lastTr")) {
                trAttr.isNull = 0;
                trAttr.tableId = "";
                trAttr.chianeseName = "";
                trAttr.englishName = "";
                trAttr.folderId = "";
                trAttr.dbTablespace = "";
                trAttr.dbUser = "";
                trAttr.dictId = "";
                trAttr.remark = "";
            } else {
                var ele = $(`${PAGE} #J_dataModal_list tr:last-child`);
                trAttr.isNull = 1;
                trAttr.tableId = ele.attr("tableId");
                trAttr.chianeseName = ele.attr("chianeseName");
                trAttr.englishName = ele.attr("englishName");
                trAttr.folderId = ele.attr("folderId");
                trAttr.dbTablespace = ele.attr("dbTablespace");
                trAttr.dbUser = ele.attr("dbUser");
                trAttr.dictId = ele.attr("dictId");
                trAttr.remark = ele.attr("remark");
            }
            showContent.treeData(trAttr);
        })
        //模型数据表 > 保存
        $("body").on("click", `${PAGE} #J_dataModal_list .J_dataModel_save`, function (e) {
            e.preventDefault();
            e.stopPropagation();
            //传参+数据处理  显示不可编辑状态
            var str = {};
            str.tr = $(this).parent().parent();
            str.basicId = str.tr.attr("basicId");
            str.tableId = $(`${PAGE} #J_dataModal_list input:eq(0)`).val();
            str.chianeseName = $(`${PAGE} #J_dataModal_list input:eq(1)`).val();
            str.englishName = $(`${PAGE} #J_dataModal_list input:eq(2)`).val();
            str.folderId = $(`${PAGE} #J_dataModal_list .foldername select`).val();
            str.folderName = $(`${PAGE} #J_dataModal_list .foldername [value=${str.folderId}]`).html();
            str.dbTablespace = $(`${PAGE} #J_dataModal_list input:eq(3)`).val();
            str.dictId = $(`${PAGE} #J_dataModal_list .dictname select`).val();
            str.dictName = $(`${PAGE} #J_dataModal_list .dictname [value=${str.dictId}]`).html();
            str.dbUser = $(`${PAGE} #J_dataModal_list input:eq(4)`).val();
            str.remark = $(`${PAGE} #J_dataModal_list input:eq(5)`).val();
            str.addNew = str.tr.attr("addNew");
            // 编号 表中文名称 表英文名称 表空间 表用户 不能为空
            if (!str.tableId) {
                toastr.error("编号不能为空");
                $(`${PAGE} #J_dataModal_list input:eq(0)`).focus();
                return false;
            }
            if (!str.chianeseName) {
                toastr.error("表中文名称不能为空");
                $(`${PAGE} #J_dataModal_list input:eq(1)`).focus();
                return false;
            }
            if (!str.englishName) {
                toastr.error("表英文名称不能为空");
                $(`${PAGE} #J_dataModal_list input:eq(2)`).focus();
                return false;
            }
            if (!str.dbTablespace) {
                toastr.error("表空间不能为空");
                $(`${PAGE} #J_dataModal_list input:eq(3)`).focus();
                return false;
            }
            if (!str.dbUser) {
                toastr.error("表用户不能为空");
                $(`${PAGE} #J_dataModal_list input:eq(4)`).focus();
                return false;
            }
            params = {};
            if (str.addNew == "1") {
                params.operType = "ADD";
            } else {
                params.operType = "UPD";
            }
            params.tableId = str.tableId;
            params.basicId = str.basicId;
            params.folderId = str.folderId;
            params.chianeseName = str.chianeseName;
            params.englishName = str.englishName;
            params.dictId = str.dictId;
            params.dbTablespace = str.dbTablespace;
            params.dbUser = str.dbUser;
            params.remark = str.remark;
            showContent.setModify(params, str);
        })
        //模型数据表 > 编辑
        $("body").on("click", `${PAGE} #J_dataModal_list .J_dataModel_edit`, function (e) {
            e.preventDefault();
            e.stopPropagation();
            //如果存在编辑状态 先提示保存
            var isedit = 0;
            $.each($(`${PAGE} #J_dataModal_list tr`), function () {
                var edit = $(this).attr("edit");
                if (edit == "1") {
                    isedit = 1;
                    return false;
                }
            })
            if (isedit == 1) {
                toastr.warning("请先保存未保存的数据");
                return false;
            }
            var trAttr = {};
            var ele = $(this).parent().parent();
            trAttr.index = ele.index();
            trAttr.tableId = ele.attr("tableId");
            trAttr.chianeseName = ele.attr("chianeseName");
            trAttr.englishName = ele.attr("englishName");
            trAttr.folderId = ele.attr("folderId");
            trAttr.dbTablespace = ele.attr("dbTablespace");
            trAttr.dbUser = ele.attr("dbUser");
            trAttr.dictId = ele.attr("dictId");
            trAttr.remark = ele.attr("remark");
            trAttr.addNew = "0";
            showContent.treeDataEdit(trAttr);
        })
        //模型数据表 > 取消
        $("body").on("click", `${PAGE} #J_dataModal_list .J_dataModel_cancel`, function (e) {
            e.preventDefault();
            e.stopPropagation();
            var tr = $(this).parent().parent();
            var tableid = tr.attr("tableid");
            //如果是新增之后，点击取消做删除操作
            if (!tableid) {
                var index = tr.index();
                
                $(`${PAGE} #J_dataModal_list tr:eq(${index})`).remove();
                if($(`${PAGE} #J_dataModal_list tr`).length == 0){
                    $(`${PAGE} #J_dataModal_list`).html(`<tr class="lastTr"><td colspan="9" class="t-c">暂无数据</td></tr>`);
                }
                return false;
            }
            var tableId = tr.attr("tableId");
            var chianeseName = tr.attr("chianeseName");
            var englishName = tr.attr("englishName");
            var folderName = tr.attr("folderName");
            var dbTablespace = tr.attr("dbTablespace");
            var dbUser = tr.attr("dbUser");
            var dictName = tr.attr("dictName");
            var remark = tr.attr("remark");
            var html = `
                <td class="t-c"> ${tableId} </td>
                <td> ${chianeseName} </td>
                <td> ${englishName} </td>
                <td class="foldername"> ${folderName} </td>
                <td> ${dbTablespace} </td>
                <td> ${dbUser} </td>
                <td class="dictname"> ${dictName} </td>
                <td title="${remark}"> <div>${remark}</div> </td>
                <td> 
                    <a class="J_dataModel_save hide">保存</a>
                    <a class="J_dataModel_edit">编辑</a> 
                    <a class="J_dataModel_cancel hide">取消</a> 
                    <a class="J_dataModel_del hide">删除</a> 
                </td>
            `
            tr.html(html);
            tr.children("td").css("padding","8px");
            tr.attr("edit",'0');
        })
        //模型数据表 > 删除
        $("body").on("click", `${PAGE} #J_dataModal_list .J_dataModel_del`, function () {
            var tr = $(this).parent().parent();
            tableId = tr.attr("tableid");
            if (!tableId) {
                var index = tr.index();
                $(`${PAGE} #J_dataModal_list tr:eq(${index})`).remove();
                if($(`${PAGE} #J_dataModal_list tr`).length == 0){
                    $(`${PAGE} #J_dataModal_list`).html(`<tr class="lastTr"><td colspan="9" class="t-c">暂无数据</td></tr>`);
                }
                return false;
            }
            var params = {};
            params.tableId = tr.attr("tableid");
            params.operType = "DEL";
            bootbox.confirm("确定删除吗？", function(result) {
                if (result) {
                    App.blockUI({
                        boxed: true,
                        message: "删除中..."
                    });
                    showContent.setModify(params);
                }
            });
            
        })
        //模型数据表 点击 查询对应的属性
        $("body").on("click", `${PAGE} #J_dataModal_list tr`, function () {
            if($(this).hasClass("lastTr")){
                $(`${PAGE} #J_dataModal_type_list`).html(`<tr class="lastTr"><td colspan="10" class="t-c">暂无数据</td></tr>`);
                return false;
            }
            $(`${PAGE} #J_dataModal_list tr`).removeClass("active");
            $(this).addClass("active");
            var tableId = $(this).attr("tableId");
            var params = {};
            params.tableId = tableId;
            showContent.getMember(params);
        })


        //属性类表 > 新增
        $("body").on("click",`${PAGE} #J_dataModelType_add`,function(){
            //如果没有数据表的情况下，不然添加
            if($(`${PAGE} #J_dataModal_list tr`).length == 1 && $(`${PAGE} #J_dataModal_list tr`).hasClass("lastTr")){
                toastr.info("请先添加模型数据表");
                return false;
            }
            //如果存在编辑状态就不让添加;
            var isedit = 0;
            $.each($(`${PAGE} #J_dataModal_type_list tr`), function () {
                var edit = $(this).attr("edit");
                if (edit == "1") {
                    isedit = 1;
                    return false;
                }
            })
            if (isedit == 1) {
                toastr.warning("请先保存未保存的数据");
                return false;
            }
            var trAttr = {};
            //如果是暂无数据的时候 添加特殊处理
            if ($(`${PAGE} #J_dataModal_type_list tr:last-child`).hasClass("lastTr")) {
                trAttr.tableId = "";
                trAttr.modelchianesename = $(`${PAGE} #J_dataModal_list tr.active`).attr("chianesename")
                trAttr.chianeseName = "";
                trAttr.englishName = "";
                trAttr.columnTypeVal = "C";
                trAttr.columnLength = "";
                trAttr.isPrimary = 0;
                trAttr.isNull = 1;
                trAttr.isForeign = 0;
                trAttr.remark = "";
            } else {
                var ele = $(`${PAGE} #J_dataModal_type_list tr:last-child`);
                trAttr.modelchianesename = ele.attr("modelchianesename");
                trAttr.chianeseName = ele.attr("chianeseName");
                trAttr.englishName = ele.attr("englishName");
                trAttr.columnTypeVal = ele.attr("columntypekey");
                trAttr.columnLength = ele.attr("columnLength");
                trAttr.isPrimary = ele.attr("isPrimary");
                trAttr.isNull = ele.attr("isNull");
                trAttr.isForeign = ele.attr("isForeign");
                trAttr.remark = ele.attr("remark");
            }
            var select = "";
            for (var i in showContent.fieldType) {
                select += `<option value="${i}">${showContent.fieldType[i]}</option>`
            }
            var html = `
                <tr edit="1" addNew="1">
                    <td class="modelchianesename"> <input class="form-control input-small" value="${trAttr.modelchianesename}"  readonly="readonly"> </td>
                    <td class="chianeseName"> <input class="form-control input-small" value="${trAttr.chianeseName}"> </td>
                    <td class="englishName"> <input class="form-control input-small" value="${trAttr.englishName}"> </td>
                    <td class="columnTypeVal"> 
                        <select class="form-control input-msmall">
                            ${select}
                        </select>
                    </td>
                    <td class="columnLength"> <input class="form-control input-msmall" maxlength="6" value="${trAttr.columnLength}"> </td>
                    <td class="isPrimary">
                        <select class="form-control input-xsmall">
                            <option value="0">否</option>
                            <option value="1">是</option>
                        </select>
                    </td>
                    <td class="isNull">
                        <select class="form-control input-xsmall">
                            <option value="0">否</option>
                            <option value="1">是</option>
                        </select>
                    </td>
                    <td class="isForeign">
                        <select class="form-control input-xsmall">
                            <option value="0">否</option>
                            <option value="1">是</option>
                        </select>
                    </td>
                    <td class="remark"> <input class="form-control input-small" value="${trAttr.remark}"> </td>
                    <td> 
                        <a class="J_member_save">保存</a>
                        <a class="J_member_edit hide">编辑</a> 
                        <a class="J_member_cancel">取消</a> 
                        <a class="J_member_del">删除</a> 
                    </td>
                </tr>
            `;
            if($(`${PAGE} #J_dataModal_type_list tr`).length == "1" && $(`${PAGE} #J_dataModal_type_list tr`).hasClass("lastTr")){
                $(`${PAGE} #J_dataModal_type_list`).html(html);
            }else{
                $(`${PAGE} #J_dataModal_type_list`).append(html);
            }
            $(`${PAGE} #J_dataModal_type_list .columnTypeVal select`).val(trAttr.columnTypeVal);
            $(`${PAGE} #J_dataModal_type_list .isPrimary select`).val(trAttr.isPrimary);
            $(`${PAGE} #J_dataModal_type_list .isNull select`).val(trAttr.isNull);
            $(`${PAGE} #J_dataModal_type_list .isForeign select`).val(trAttr.isForeign);
        })

        //属性类表 > 保存
        $("body").on("click",`${PAGE} #J_dataModal_type_list .J_member_save`,function(){
            var str = {};
            str.isDel = 0;
            str.tr = $(this).parent().parent();
            str.columnId = str.tr.attr("columnId");
            str.addNew = str.tr.attr("addNew");
            str.tableId = $(`${PAGE} #J_dataModal_type_list .tableId input`).val();
            str.chianeseName = $(`${PAGE} #J_dataModal_type_list .chianeseName input`).val();
            str.englishName = $(`${PAGE} #J_dataModal_type_list .englishName input`).val();
            str.columnType = $(`${PAGE} #J_dataModal_type_list .columnTypeVal select`).val();
            str.columnLength = $(`${PAGE} #J_dataModal_type_list .columnLength input`).val();
            str.isPrimary = $(`${PAGE} #J_dataModal_type_list .isPrimary select`).val();
            str.isNull = $(`${PAGE} #J_dataModal_type_list .isNull select`).val();
            str.isForeign = $(`${PAGE} #J_dataModal_type_list .isForeign select`).val();
            str.remark = $(`${PAGE} #J_dataModal_type_list .remark input`).val();
            if(!str.chianeseName){
                toastr.error("字段中文名称不能为空");
                return false;
            }
            if(!str.englishName){
                toastr.error("字段英文名称不能为空");
                return false;
            }
            // tr.attr({
            //     tableId:tableId,
            //     chianeseName:chianeseName,
            //     englishName:englishName,
            //     dictName:dictName,
            //     columnLength:columnLength,
            //     isPrimary:isPrimary,
            //     isNull:isNull,
            //     isForeign:isForeign,
            //     remark:remark,
            //     edit:0,
            //     addNew:addNew
            // })
            // var html = `
            //     <td class="t-c" class="tableId"> ${tableId} </td>
            //     <td class="chianeseName"> ${chianeseName} </td>
            //     <td class="englishName"> ${englishName} </td>
            //     <td class="dictName"> ${dictName} </td>
            //     <td class="columnLength"> ${columnLength} </td>
            //     <td class="isPrimary">
            //         ${isPrimary=="1"?'是':'否'}
            //     </td>
            //     <td class="isNull">
            //         ${isNull=="1"?'是':'否'}
            //     </td>
            //     <td class="isForeign"> 
            //         ${isForeign=="1"?'是':'否'}
            //     </td>
            //     <td title="${remark}" class="remark"> <div>${remark}</div> </td>
            //     <td> 
            //         <a class="J_dataModel_save hide">保存</a>
            //         <a class="J_dataModel_edit">编辑</a> 
            //         <a class="J_dataModel_cancel hide">取消</a>
            //         <a class="J_dataModel_del hide">删除</a> 
            //     </td>
            // `
            // tr.html(html);
            str.tableId = $(`${PAGE} #J_dataModal_list tr.active`).attr("tableid");
            if(str.addNew == "1"){
                str.operType = "ADD"
            }else{
                str.operType = "UPD";
            }
            showContent.setMember(str);
        })
        
        //属性类表 > 编辑
        $("body").on("click",`${PAGE} #J_dataModal_type_list .J_dataModel_edit`,function(){
            var isedit = 0;
            $.each($(`${PAGE} #J_dataModal_type_list tr`), function () {
                var edit = $(this).attr("edit");
                if (edit == "1") {
                    isedit = 1;
                    return false;
                }
            })
            if (isedit == 1) {
                toastr.warning("请先保存未保存的数据");
                return false;
            }
            var tr = $(this).parent().parent();
            tr.attr("edit",1);
            var str = {};
            str.tableId = tr.attr("tableId");
            str.modelchianesename = tr.attr("modelchianesename");
            str.chianeseName = tr.attr("chianeseName");
            str.englishName = tr.attr("englishName");
            str.columnType = tr.attr("columnTypeKey");
            str.columnLength = tr.attr("columnLength");
            str.isPrimary = tr.attr("isPrimary");
            str.isNull = tr.attr("isNull");
            str.isForeign = tr.attr("isForeign");
            str.remark = tr.attr("remark");
            var select = "";
            for (var i in showContent.fieldType) {
                select += `<option value="${i}">${showContent.fieldType[i]}</option>`
            }
            var html = `
                <td class="modelchianesename"> <input class="form-control input-small" value="${str.modelchianesename}" readonly="readonly"> </td>
                <td class="chianeseName"> <input class="form-control input-small" value="${str.chianeseName}"> </td>
                <td class="englishName"> <input class="form-control input-small" value="${str.englishName}"> </td>
                <td class="columnTypeVal"> 
                    <select class="form-control input-msmall">
                        ${select}
                    </select>
                </td>
                <td class="columnLength"> <input class="form-control input-msmall" maxlength="6" value="${str.columnLength}"> </td>
                <td class="isPrimary">
                    <select class="form-control input-xsmall">
                        <option value="0">否</option>
                        <option value="1">是</option>
                    </select>
                </td>
                <td class="isNull">
                    <select class="form-control input-xsmall">
                        <option value="0">否</option>
                        <option value="1">是</option>
                    </select>
                </td>
                <td class="isForeign">
                    <select class="form-control input-xsmall">
                        <option value="0">否</option>
                        <option value="1">是</option>
                    </select>
                </td>
                <td class="remark"> <input class="form-control input-small" value="${str.remark}"> </td>
                <td> 
                    <a class="J_member_save">保存</a>
                    <a class="J_member_edit hide">编辑</a> 
                    <a class="J_member_cancel">取消</a> 
                    <a class="J_member_del">删除</a> 
                </td>`;
            tr.html(html);
            tr.children(".columnTypeVal").children("select").val(str.columnType);
            tr.children(".isPrimary").children("select").val(str.isPrimary);
            tr.children(".isNull").children("select").val(str.isNull);
            tr.children(".isForeign").children("select").val(str.isForeign);
        })
        //属性类表 > 取消
        $("body").on("click",`${PAGE} #J_dataModal_type_list .J_member_cancel`,function(){
            var tr = $(this).parent().parent();
            var tableid = tr.attr("tableid");
            //如果是新增之后，点击取消做删除操作
            if (!tableid) {
                var index = tr.index();
                $(`${PAGE} #J_dataModal_type_list tr:eq(${index})`).remove();
                if($(`${PAGE} #J_dataModal_type_list tr`).length == 0){
                    $(`${PAGE} #J_dataModal_type_list`).html(`<tr class="lastTr"><td colspan="10" class="t-c">暂无数据</td></tr>`);
                }
                return false;
            }
            tr.attr("edit","0");
            var str = {};
            str.tableId = tr.attr("tableId");
            str.chianeseName = tr.attr("chianeseName");
            str.englishName = tr.attr("englishName");
            str.dictName = tr.attr("columnTypeVal");
            str.columnLength = tr.attr("columnLength");
            str.isPrimary = tr.attr("isPrimary");
            str.isNull = tr.attr("isNull");
            str.isForeign = tr.attr("isForeign");
            str.remark = tr.attr("remark");
            var html = `
                <td class="t-c" class="tableId"> ${str.tableId} </td>
                <td class="chianeseName"> ${str.chianeseName} </td>
                <td class="englishName"> ${str.englishName} </td>
                <td class="columnTypeVal"> ${str.dictName} </td>
                <td class="columnLength"> ${str.columnLength} </td>
                <td class="isPrimary">
                    ${str.isPrimary=="1"?'是':'否'}
                </td>
                <td class="isNull">
                    ${str.isNull=="1"?'是':'否'}
                </td>
                <td class="isForeign"> 
                    ${str.isForeign=="1"?'是':'否'}
                </td>
                <td title="${str.remark}" class="remark"> <div>${str.remark}</div> </td>
                <td> 
                    <a class="J_dataModel_edit">编辑</a> 
                </td>
            `
            tr.html(html);
        })
        //属性类表 > 删除 J_member_del
        $("body").on("click",`${PAGE} #J_dataModal_type_list .J_member_del`,function(){
            var tr = $(this).parent().parent();
            tableId = tr.attr("tableid");
            if (!tableId) {
                var index = tr.index();
                $(`${PAGE} #J_dataModal_type_list tr:eq(${index})`).remove();
                if($(`${PAGE} #J_dataModal_type_list tr`).length == 0){
                    $(`${PAGE} #J_dataModal_type_list`).html(`<tr class="lastTr"><td colspan="10" class="t-c">暂无数据</td></tr>`);
                }
                return false;
            }
            var params = {};
            params.columnId = tr.attr("columnId");
            params.operType = "DEL";
            bootbox.confirm("确定删除吗？", function(result) {
                if (result) {
                    App.blockUI({
                        boxed: true,
                        message: "删除中..."
                    });
                    showContent.setMember(params);
                }
            });
        })

        //导出  模型数据表
        $("body").on("click",`${PAGE} #J_dataModel_export`,function(){
            var params = {};
            let folderId = $("#J_dataModel_tree li[aria-selected=true]").attr("folderId");
            params.folderId = folderId;
            params.expType = "model";
            App.blockUI({
                boxed: true,
                message: "导出中..."
            });
            showContent.export(params).then(data=>showContent.listImport2({
                fileClass: "ZIP",
                filePath: data.bcjson.items[0].filePatch
            }).then(data=>showContent.listImport3({
                fileClass: "ZIP",
                downloadToken: data.bcjson.items[0].downloadToken,
                _s_t_i_0000: $.kingdom.getValue("x-trace-user-id"),
            })))
        })
        //导出  模型类型
        $("body").on("click",`${PAGE} #J_dataModelType_export`,function(){
            var params = {};
            let tableId = $(`${PAGE} #J_dataModal_list tr.active`).attr("tableId");
            params.tableId = tableId;
            if(!tableId){
                toastr.info("请先新增模型数据表");
                return false;
            }
            params.expType = "member";
            App.blockUI({
                boxed: true,
                message: "导出中..."
            });
            showContent.export(params).then(data=>showContent.listImport2({
                fileClass: "ZIP",
                filePath: data.bcjson.items[0].filePatch
            }).then(data=>showContent.listImport3({
                fileClass: "ZIP",
                downloadToken: data.bcjson.items[0].downloadToken,
                _s_t_i_0000: $.kingdom.getValue("x-trace-user-id"),
            })))
        })
        //建表的时候，查询
        $("body").on("click",`${PAGE} .add_table`,function(){
            var params = {};
            let tableId = $(`${PAGE} #J_dataModal_list tr.active`).attr("tableId");
            params.tableId = tableId;
            if(!tableId){
                toastr.info("请先新增模型数据表");
                return false;
            }
            showContent.addTable(params);
        })
        //数据查询
        $("body").on("click",`${PAGE} .data-query`,function(){
            var params = {};
            let tableId = $(`${PAGE} #J_dataModal_list tr.active`).attr("tableId");
            params.tableId = tableId;
            if(!tableId){
                toastr.info("请先新增模型数据表");
                return false;
            }
            showContent.dataQuery(params);
        })
        
        //建表取消
        $("body").on("click",`${PAGE} #add_table .J_table_default`,function(){
            var tableId = $(`${PAGE} #J_dataModal_list tr.active`).attr("tableId");
            var params = {};
            params.tableId = tableId;
            showContent.tabledel(params);
        })

        //数据查询 下载全部数据
        $("body").on("click",`${PAGE} #data-query .down`,function(){
            var params = {};
            params.expType = "down"
            params.tableId = $(`${PAGE} #J_dataModal_list tr.active`).attr("tableId");
            App.blockUI({
                boxed: true,
                message: "导出中..."
            });
            showContent.export(params).then(data=>showContent.listImport2({
                fileClass: "ZIP",
                filePath: data.bcjson.items[0].filePatch
            }).then(data=>showContent.listImport3({
                fileClass: "ZIP",
                downloadToken: data.bcjson.items[0].downloadToken,
                _s_t_i_0000: $.kingdom.getValue("x-trace-user-id"),
            })))
        })

    });
    module.exports = init;
});
