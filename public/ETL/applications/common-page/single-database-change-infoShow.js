define(function (require, exports, module) {
  var showContent = {};
  showContent._load = function () {
    var checkType = sessionStorage.getItem("type");
    sessionStorage.setItem("type", "");
    if (checkType) {
      $("[name=checkType]").val(checkType);
      $("[href=\"#collapseSourChange\"]").click();
    }
    showContent.getSingleDatasourceList();
  };
  // 查询列表
  showContent.getSingleDatasourceList = function (paramsPage) {
    if ($("#local-data").data("params")) {
      var parentMonitorId = $("#local-data").data("params").monitorId;
    }
    var params = { parentMonitorId: parentMonitorId };
    var params = $.extend(params, paramsPage);
    $.kingdom.getList({
      apiName: "bayconnect.superlop.get_single_db_change_info",
      apiVision: "v4.0",
      params: params,
      tableId: "J_dcq_change_single_query_table",
      pageId: "J_dcq_change_query_single_page",
      formName: "J_dcq_change_query_form",
      template: "common-page/template/single-database-change-info-list.handlebars",
      cb: showContent.getSingleDatasourceList
    });
  };
  module.exports = showContent;
});