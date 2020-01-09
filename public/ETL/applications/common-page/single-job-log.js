define(function (require, exports, module) {
  var showContent = require("./single-job-logShow");
  var init = {
    load: function load() {
      showContent._load(); //加载页面数据
    }
  };
  $(function () {
    $("body").on("click", "#J_sjl_single_job_log_page ul.pagination a", function () {
      var _this = $(this);
      var page = _this.text();
      if (_this.parent().hasClass("next")) {
        page = $.kd.kdPager.next + "";
      }
      if (_this.parent().hasClass("prev")) {
        page = $.kd.kdPager.prv + "";
      }
      var paramsMap = {};
      paramsMap.pageNumber = page;
      showContent.getSingleDatasourceList(paramsMap);
    });

    $("body").on("click", "#J_sjl_single_job_log_list .executeMsg", function () {
      $("#J_sjl_checkmsg_modal").modal("show");
      $("#J_sjl_checkmsg_modal_msg").html($(this).html().replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'));
    });
    //点击错误信息，显示错误详情
    $("body").on("click", "#single-job-log-table-tree .execute-error-msg", function () {
      // var errorMsg = showContent.currentMsgCollection[$(this).attr("errorindex")];
      var errorMsg = $(this).attr("msg");
      $("#pg-sigle-log-job-modal").modal("show");
      $("#pg-sigle-log-job-modal-msg").html(errorMsg.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;'));
    });
  });
  module.exports = init;
});