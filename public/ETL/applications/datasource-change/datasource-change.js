define(function (require, exports, module) {
  var showContent = require("./datasource-changeShow");
  var init = {
    load: function load() {
      showContent._load(); //加载页面数据
    }
  };
  $(function () {});
  module.exports = init;
});