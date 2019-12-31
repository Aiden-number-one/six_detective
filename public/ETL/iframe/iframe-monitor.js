var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

define(function (require, exports, module) {
    require("cookie");
    require("blockui");
    require("uniform");
    require("switch");
    require("toastr");
    var kweb = require("js/kingdom/kweb");
    var showContent = {};

    // 查询列表
    showContent.getList = function (params) {
        var _params = {
            pageSize: "999",
            pageNumber: "1"
        };
        _params = _extends(_params, params);
        $("#J_iframe_node_name").text(_params.nodeName);
        $("#J_iframe_job_id").text(_params.jobId);
        kweb.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_detail_flow_for_out_way", "v4.0", _params, function (data) {
            if (data.bcjson.flag == "1" && data.bcjson.items.length) {
                var items = data.bcjson.items;
                // mysql数据库不会返回ROWNUM_；需要前端计算
                if (!items[0].hasOwnProperty("ROWNUM_")) {
                    var startPage = parseInt(_params.pageSize) * parseInt(_params.pageNumber); // 从哪开始计数，(防止这种情况：当输入pagenumber * pagisize > 数据库存的数量时 ，序号展示不对)
                    startPage = Math.floor(items.length / startPage) * parseInt(_params.pageSize);
                    for (var i = 0, len = items.length; i < len; i++) {
                        items[i].ROWNUM_ = startPage + i + 1;
                    }
                }
                require.async("./iframe-list.handlebars", function (compiled) {
                    $("#table-detail tbody").html(compiled(items));
                });
                var search = location.search.substr('1');
                var urlParams = JSON.parse(decodeURIComponent(search));
                $("#J_iframe_status").text(Handlebars.helpers.executeFlagNameFormatIframe1(urlParams.status)).css({
                    color: Handlebars.helpers.executeFlagFormatIframe1(urlParams.status)
                });
            } else {
                $("#table-detail tbody").html("<tr><td class=\"t-c\" colspan=\"20\">\u6CA1\u6709\u76F8\u5173\u8BB0\u5F55</td></tr>");
            }
        });
    };

    $(function () {

        var search = location.search.substr('1');
        var urlParams = JSON.parse(decodeURIComponent(search));
        //  传参格式   {
        //         nodeName: "START",
        //         jobId: "TEST_BFRW_001",
        //     }

        showContent.getList(urlParams);
        // 点击错误信息，显示错误详情
        $("body").on("click", "[name=checkDetail]", function () {
            var errorMsg = $(this).attr("title");
            // if (!errorMsg) {
            //     toastr.info("没有查询到数据");
            //     return;
            // }
            $("#J_pg-perform-detail-modal").modal("show");
            $("#J_pg-perform-detail-modal-msg").html(errorMsg.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'));
        });
    });
});