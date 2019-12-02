define(function(require, exports, module) {
    require("cookie");
    require("blockui");
    require("uniform");
    require("switch");
    require("toastr");
    var kweb = require("js/kingdom/kweb");
    var showContent = {};

    // 查询列表
    showContent.getList = params => {
        let _params = {
            pageSize: "999",
            pageNumber: "1",
        };
        _params = Object.assign(_params, params);
        $("#J_iframe_node_name").text(_params.nodeName);
        $("#J_iframe_job_id").text(_params.jobId);
        kweb.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_detail_flow_for_out_way", "v4.0", _params, data => {
            if (data.bcjson.flag == "1"&&data.bcjson.items.length) {
                let items = data.bcjson.items;
                // mysql数据库不会返回ROWNUM_；需要前端计算
                if (!items[0].hasOwnProperty("ROWNUM_")) {
                    let startPage = parseInt(_params.pageSize) * parseInt(_params.pageNumber); // 从哪开始计数，(防止这种情况：当输入pagenumber * pagisize > 数据库存的数量时 ，序号展示不对)
                    startPage = Math.floor(items.length / startPage) * parseInt(_params.pageSize);
                    for (let i = 0, len = items.length; i < len; i++) {
                        items[i].ROWNUM_ = startPage + i + 1;
                    } 
                }
                require.async("./iframe-list.handlebars", compiled => {
                    $(`#table-detail tbody`).html(compiled(items));
                });
                let search = location.search.substr('1');
                let urlParams = JSON.parse(decodeURIComponent(search));
                $("#J_iframe_status").text(Handlebars.helpers.executeFlagNameFormatIframe1(urlParams.status)).css({
                    color: Handlebars.helpers.executeFlagFormatIframe1(urlParams.status)
                });
            } else {
                $(`#table-detail tbody`).html(`<tr><td class="t-c" colspan="20">没有相关记录</td></tr>`);
            }
        });
    };

    $(function() {

        let search = location.search.substr('1');
        let urlParams = JSON.parse(decodeURIComponent(search));
        //  传参格式   {
        //         nodeName: "START",
        //         jobId: "TEST_BFRW_001",
        //     }

        showContent.getList(urlParams);
        // 点击错误信息，显示错误详情
        $("body").on("click", "[name=checkDetail]", function() {
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