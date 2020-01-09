define(function (require, exports, module) {
    var showContent = require("./single-database-change-infoShow");
    var init = {
        load: function load() {
            showContent._load(); //加载页面数据
        }
    };
    $(function () {
        // 点击查询
        $("body").on("click", "#J_dcq_change_query_search", function () {
            showContent.getSingleDatasourceList();
        });

        $("body").on("click", "#J_dcq_change_single_query_table a", function () {
            $("#J_sdci_checkmsg_modal").modal("show");
            $("#J_sdci_checkmsg_modal_msg").html($(this).attr("checkmsg").replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'));
        });
    });
    module.exports = init;
});