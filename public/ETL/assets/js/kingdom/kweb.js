var kweb = kweb || {};

kweb.copyright = "copyright@www.szkingdom.com";

if (seajs) {
    define(function (require, exports, module) {
        var jquery_plugin_list = require("jquery-plugin-list");
        kweb.app = require("app");
        kweb.handlebars = require("handlebars");
        kweb.echarts = require("echarts");
        require("js/kingdom/kd.ui.plugin");
        require("js/kingdom/handlebars.helper");
        require("js/kingdom/handlebars.helper.common");
        require("ajaxdata");
        require("plugins/jquery-validation/js/localization/messages_zh.min");
        var apiname = require("api_name");
        // require("js/layouts/demo.min");
        // require("js/layouts/layout.min");
        var base64 = require("base64");
        var JSON = require("json2");
        var md5Func = require("md5");
        var des = require("js/kingdom/kjax.des");
        var kingdom = require("js/kingdom/jquery.kingdom");
        var kdata = require("js/kingdom/kdata");
        kweb.Handlebars = Handlebars;
        kweb.base64 = base64;
        kweb.JSON = JSON;
        kweb.md5 = md5Func;
        kweb.des = des;
        kweb.kingdom = kingdom;
        kweb.kdata = kdata;
        kweb.apiname = apiname;
        module.exports = kweb;
    });
}