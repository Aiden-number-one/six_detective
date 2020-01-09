var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(function (require, exports, module) {
    require("jquery-handlebars");
    // require("/concatjs?/js/kingdom/base64.js,/js/kingdom/json2.js,/js/kingdom/md5.js");
    var bms_kingt = bms_kingt || {};
    var datetime = new Date();
    bms_kingt.hello = "hello";
    //ajax 获取接口数据
    //bms_kingt._url = "kingt/kingt_indexadv!getIndexAdv.do";
    bms_kingt._ajax = function (url, sendData, callback, async) {
        var apiname = sendData.apiname;
        var version = sendData.version;
        var params = sendData.paramsMap || {};

        var pageNumber = params.pageNumber;
        var pageSize = params.pageSize;

        var param = $.kingdom.getAjaxParams(apiname, version, params);
        $.ajax({
            type: "get",
            url: url,
            dataType: 'json',
            data: param,
            async: typeof async == "boolean" ? async && true : true,
            beforeSend: function beforeSend(request) {
                var x_trace_user_id = $.kingdom.getValue("x-trace-user-id");
                if ($.trim(x_trace_user_id) == "") {
                    x_trace_user_id = $.kingdom.uuid();
                    $.kingdom.setValue("x-trace-user-id", x_trace_user_id);
                }
                var x_trace_page_id = window.x_trace_page_id;
                if ($.trim(x_trace_page_id) == "") {
                    x_trace_page_id = $.kingdom.uuid();
                    window.x_trace_page_id = x_trace_page_id;
                }
                request.setRequestHeader("X-Kweb-Menu-Id", document.location.href);
                request.setRequestHeader("X-Kweb-Trace-Req-Id", $.kingdom.uuid());
                request.setRequestHeader("X-Kweb-Trace-Page-Id", x_trace_page_id);
                request.setRequestHeader("X-Kweb-Trace-User-Id", x_trace_user_id);
                request.setRequestHeader("X-Kweb-Location-Href", document.location.href);

                request.setRequestHeader("X-Kweb-Timestamp", new Date().getTime() + "");
                request.setRequestHeader("X-Kweb-Sign", $.md5(document.location.href));

                request.setRequestHeader("X-Kweb-Api-Name", $.trim(apiname));
                request.setRequestHeader("X-Kweb-Api-Version", $.trim(version));
            }
        }).done(function (data) {
            if ((typeof data === "undefined" ? "undefined" : _typeof(data)) != "object") {
                data = eval("(" + data + ")");
            }
            var flag = data.bcjson.flag;
            if (flag != "0" && flag != "1") {
                $.kingdom.logout(function () {
                    document.location.href = "/login.html";
                });
                return false;
            }

            if (data && data.bcjson && data.bcjson.items) {
                if (pageNumber && pageSize) {
                    //如果入参中有pageNumber,pageSize,时在返回结果里也加入pageNumber,pageSize

                    var items = data.bcjson.items;
                    for (var i = 0; i < items.length; i++) {
                        items[i].pageNumber = pageNumber;
                        items[i].pageSize = pageSize;
                    }

                    data.bcjson.items = items;
                }
            }

            var result = data.bcjson.items || data.bcjson;
            callback(result, data.bcjson);
        });
    };
    //Handlebars 渲染数据
    bms_kingt._handlebars_ajax_action = function (options) {
        /*
        url:请求接口地址；
        apiType:接口类型api,api_cloud（默认api）;
        sendData:请求数据参数 格式：{xx:xx};
        domArray:handlebars指定加载区域dom选择器 格式：[selector,scriptID]
        count:返回请求数据条数（默认全展示）;
        async:是否异步，默认true异步
        callback:回调函数
        */
        var params = options.sendData;
        var url = "/admin_api";
        url = "/retl/rest/admin/" + $.trim(params.version) + "/" + $.trim(params.apiname) + ".json";
        var settings = {
            url: url, //../kfsp/kingt/kingt_indexadv!getIndexAdv.do
            //apiType:"api",
            sendData: {},
            domArray: [],
            count: 0,
            async: true,
            callback: function callback() {}
        };
        var options = options || {};
        $.extend(settings, options);
        var count = /^[1-9]\d*$/.test(settings.count) ? settings.count : 0; //判断受否为正整数
        /*var apiType = (settings.apiType == "api_cloud")?settings.apiType:"api";
        settings.url = "/"+apiType;*/
        this._ajax(settings.url, settings.sendData, function (obj) {

            var retData;
            if (count) {
                retData = $.grep(obj, function (n, i) {
                    return i < count;
                });
            } else {
                retData = obj;
            };
            //指定handlebars脚本ID加载指定dom区域
            var a = settings.domArray[0],
                b = settings.domArray[1];
            $(a).handlebars($(b), retData);
            //数据加载成功后扩展方法
            settings.callback(retData);
        }, settings.async);
    };
    //Handlebars&seajs 模块化 渲染数据
    bms_kingt._seajs_handlebars_ajax_action = function (options) {
        /*
        url:请求接口地址；
        apiType:接口类型api,api_cloud（默认api）;
        sendData:请求数据参数 格式：{xx:xx};
        selector:handlebars指定加载区域dom选择器；(支持多个选择器加载) 格式："#id1,#id2"
        template:handlebars模板地址；kingt/js/template 格式"xx.handlebars,xx.handlebars"
        count:返回请求数据条数（默认全展示）;
        async:是否异步，默认true异步
        callback:回调函数
        method:数据插入方式html\append\before\after\prepend(默认html)
        */
        var params = options.sendData;
        var url = "/admin_api";
        url = "/retl/rest/admin/" + $.trim(params.version) + "/" + $.trim(params.apiname) + ".json";
        var settings = {
            url: url,
            //apiType:"api",
            sendData: {},
            selector: "",
            template: "",
            count: 0,
            async: true,
            method: "html", //append\before\after\prepend
            callback: function callback() {}
        };
        var options = options || {};
        $.extend(settings, options);
        var count = /^[1-9]\d*$/.test(settings.count) ? settings.count : 0; //判断受否为正整数
        /*var apiType = (settings.apiType == "api_cloud")?settings.apiType:"api";
        settings.url = "/"+apiType;*/
        this._ajax(settings.url, settings.sendData, function (obj, data) {

            var retData;
            if (count) {
                retData = $.grep(obj, function (n, i) {
                    return i < count;
                });
            } else {
                retData = obj;
            };
            //指定handlebars脚本ID加载指定dom区域
            var selector = settings.selector.split(",");
            var template = settings.template.split(","); //
            var method = settings.method;
            $.each(selector, function (n, item) {
                var tpl = template.length == 1 ? template[0] : template[n];
                require.async(tpl, function (compiled) {
                    if (method == "html") {
                        $(item).html(compiled(retData));
                    };
                    if (method == "prepend") {
                        $(item).prepend(compiled(retData));
                    };
                    if (method == "append") {
                        $(item).append(compiled(retData));
                    };
                    if (method == "before") {
                        $(item).before(compiled(retData));
                    };
                    if (method == "after") {
                        $(item).after(compiled(retData));
                    };
                    //数据加载后扩展方法
                    settings.callback(retData, data);
                });
            });
        });
    };
    module.exports = bms_kingt;
});