//
//window.hdata = window.hdata || {} ;

if (typeof jQuery === "undefined") {
    throw new Error("kweb.kdata requires jQuery");
}

//kingdom module wrapper =======================
if (seajs) {
    define(function (require, exports, module) {
        // require("jquery");
        var JSON = require("json2");

        var kdata = kdata || {};

        kdata.context = "/krcs";

        kdata.ajax = $.ajax;

        kdata.uuid = function () {
            function S4() {
                return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
            }
            return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
        };

        kdata.dateFormat = function (fmt) {
            //author: meizz   
            var that = new Date();
            var o = {
                "Y+": that.getYear(),
                "M+": that.getMonth() + 1, //月份   
                "d+": that.getDate(), //日   
                "h+": that.getHours(), //小时   
                "m+": that.getMinutes(), //分   
                "s+": that.getSeconds(), //秒   
                "q+": Math.floor((that.getMonth() + 3) / 3), //季度   
                "S": that.getMilliseconds() //毫秒   
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (that.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }return fmt;
        };

        kdata.getFrontApiJsonAsync = function (apiName, apiVersion, params, cbfunc) {
            var url = kdata.context + "/rest/" + $.trim(apiVersion) + "/" + $.trim(apiName) + ".json";
            kdata.getAsync(url, apiName, apiVersion, params, cbfunc);
        };
        kdata.getBackApiJsonAsync = function (apiName, apiVersion, params, cbfunc) {
            var url = kdata.context + "/rest/admin/" + $.trim(apiVersion) + "/" + $.trim(apiName) + ".json";
            kdata.getAsync(url, apiName, apiVersion, params, cbfunc);
        };

        kdata.getAsync = function (url, apiName, apiVersion, params, cbfunc) {
            kdata.getJsonData("get", url, true, apiName, apiVersion, params, cbfunc);
        };
        kdata.getSync = function (url, apiName, apiVersion, params, cbfunc) {
            kdata.getJsonData("get", url, false, apiName, apiVersion, params, cbfunc);
        };

        kdata.postAsync = function (url, apiName, apiVersion, params, cbfunc) {
            kdata.getJsonData("post", url, true, apiName, apiVersion, params, cbfunc);
        };
        kdata.postSync = function (url, apiName, apiVersion, params, cbfunc) {
            kdata.getJsonData("post", url, false, apiName, apiVersion, params, cbfunc);
        };

        kdata.getJsonData = function (method, url, async, apiName, apiVersion, param, cbfunc) {

            var ajaxParam = {};
            ajaxParam.p = JSON.stringify(param || {});
            ajaxParam._ts = new Date().getTime();
            var timestamp = kdata.dateFormat("YYYY-MM-dd hh:mm:ss.S");
            kdata.ajax({

                type: method,
                url: url,
                dataType: 'json',
                data: ajaxParam,
                async: async,
                beforeSend: function beforeSend(request) {
                    request.setRequestHeader("X-Kweb-Menu-Id", window.location.pathname + window.location.hash);
                    request.setRequestHeader("X-Kweb-Op-Id", "????op_id1122333");
                    request.setRequestHeader("X-Kweb-Req-Trace-Id", kdata.uuid());
                    request.setRequestHeader("X-Kweb-Location-Href", document.location.href);

                    request.setRequestHeader("X-Kweb-Timestamp", timestamp);
                    request.setRequestHeader("X-Kweb-Sign", $.md5(timestamp + ajaxParam.p));

                    request.setRequestHeader("X-Kweb-Api-Name", $.trim(apiName));
                    request.setRequestHeader("X-Kweb-Api-Version", $.trim(apiVersion));
                }
            }).done(function (data) {

                if (data && data.bcjson && data.bcjson.flag) {
                    var flag = data.bcjson.flag;
                    if (flag == "0" && console) {
                        console.info(window.location.href, " --> ", data);
                    }
                }

                if (cbfunc) {
                    cbfunc(data);
                }
            });
        };

        module.exports = kdata;
    });
}