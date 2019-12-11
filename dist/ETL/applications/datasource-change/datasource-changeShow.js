define(function (require, exports, module) {
  var showContent = {};
  showContent._load = function () {
    showContent.getList();
  }
  // 查询列表
  showContent.getList = function (paramsPage) {
    var params = {}
    var params = $.extend(params, paramsPage);
    $.kingdom.getList({
      apiName: "bayconnect.superlop.get_all_db_change_list",
      apiVision: "v4.0",
      params: params,
      tableId: "J_dcq_change_query_table",
      pageId: "J_dcq_change_query_page",
      formName: "J_dcq_change_query_form",
      template: "datasource-change/template/datasource-manage-query-list.handlebars",
      cb: showContent.getList,
    });
  }
  module.exports = showContent;
})