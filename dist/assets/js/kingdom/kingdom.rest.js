/**
kingdom.rest.js
此类主要是用于存放与服务端数据接口交互的方法



**/


if (typeof jQuery === "undefined") {
    throw new Error("kingdom.rest requires jQuery");
}


var kingdom = kingdom || {};
kingdom.rest = kingdom.rest || {};
kingdom.rest.config = kingdom.rest.config || {};
kingdom.rest.util = kingdom.rest.util || {};

kingdom.rest.config.theme = "retl";
kingdom.rest.config.root = "/applications/" + kingdom.rest.config.theme + "/";;
kingdom.rest.config.fileserver = "/fileserver";
kingdom.rest.config.developer = false;
 
kingdom.rest.util.log = function(arg) {
            if ($.kingdom.logShow && console && console.log) {
                console.log(arg);
            }
        };
		
kingdom.rest.util.uuid = function() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        };		

kingdom.rest.util.dateFormat = function(fmt) { //author: meizz   
            var that = new Date();
            var o = {
                "M+": that.getMonth() + 1, //月份   
                "d+": that.getDate(), //日   
                "h+": that.getHours(), //小时   
                "m+": that.getMinutes(), //分   
                "s+": that.getSeconds(), //秒   
                "q+": Math.floor((that.getMonth() + 3) / 3), //季度   
                "S": that.getMilliseconds() //毫秒   
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (that.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };

kingdom.rest.api = function(api_name, api_version, api_params, cbfunc, method) {

                $.kingdom.log("\n\n\n======" + $.kingdom.dateFormat("yyyy-MM-dd hh:mm:ss") + "\t" + document.location.href + "\n======begin call api:" + api_name + " ,version:" + api_version);
                $.kingdom.log("======api params:" + JSON.stringify(api_params || {}));
                // $.kingdom.log(api_params);

                var $this = this;
                var param = $.kingdom.getAjaxParams(api_name, api_version, api_params);

                var dataLen = JSON.stringify(param);
                // $.post("/admin_api", param, function(data) {
                //     if (cbfunc) {
                //         var flag = data.bcjson.flag;
                //         if (flag != "0" && flag != "1") {
                //             //refreshFunction();
                //             $this.logout(function() {
                //                 document.location.href = "/login.html";
                //             });
                //             return false;
                //         }
                //         cbfunc(data);
                //     }
                // }, "json");

                var url = "/admin_api";
                url = "/retl/rest/common/admin/" + $.trim(api_version) + "/" + $.trim(api_name) + ".json";
                var type = "get";


                if (dataLen && dataLen.length > 2048 /** && method=="get" **/ ) {


                    type = "post";

                } else {
                    type = method;
                }



                $.ajax({

                    type: type,
                    url: url,
                    dataType: 'json',
                    data: param,
                    timeout: 120000,
                    async: true,
                    beforeSend: function(request) {

                        var x_trace_user_id = $.cookie("x-trace-user-id");
                        if ($.trim(x_trace_user_id) == "") {
                            x_trace_user_id = $.kingdom.uuid();
                            $.cookie("x-trace-user-id", x_trace_user_id);
                        }
                        var x_trace_page_id = window.x_trace_page_id;
                        if ($.trim(x_trace_page_id) == "") {
                            x_trace_page_id = $.kingdom.uuid();
                            window.x_trace_page_id = x_trace_page_id;
                        }
                        request.setRequestHeader("X-Kweb-Menu-Id", document.location.href);
                        //  request.setRequestHeader("X-Kweb-Op-Id", "op_id1122333");
                        request.setRequestHeader("X-Kweb-Trace-Req-Id", $.kingdom.uuid());
                        request.setRequestHeader("X-Kweb-Trace-Page-Id", x_trace_page_id);
                        request.setRequestHeader("X-Kweb-Trace-User-Id", x_trace_user_id);
                        request.setRequestHeader("X-Kweb-Location-Href", document.location.href);

                        request.setRequestHeader("X-Kweb-Timestamp", new Date().getTime() + "");
                        request.setRequestHeader("X-Kweb-Sign", $.md5(document.location.href));

                        request.setRequestHeader("X-Kweb-Api-Name", $.trim(api_name));
                        request.setRequestHeader("X-Kweb-Api-Version", $.trim(api_version));
                        // request.setRequestHeader("X-Kweb-Api-Async", false);
                    },
                }).done(function(data) {
                    $.kingdom.log("======api return result:" + JSON.stringify(data || {}));
                    //$.kingdom.log(data);
                    if (data && data.bcjson && data.bcjson.flag) {
                        var flag = data.bcjson.flag;
                        if (flag == "0" && console) {
                            // console.error("===\n" + window.location.href + "\n" + data);
                        }
                    }
                    if (typeof data != "object") {
                        data = eval("(" + data + ")")
                    }
                    if (cbfunc && data) {
                        if (data.bcjson) {
                            var flag = data.bcjson.flag;
                        } else {
                            return false;
                        }
                        if (flag == "0" && data.bcjson.msg == "入参检查失败， [employeeId] 不能为空") {
                            //refreshFunction();
                            $this.logout(function() {
                                document.location.href = "/login.html";
                            });
                            return false;
                        }
                        //拦截异常报错信息
                        //是否开启flag为0时异常弹出
                        // var temp = true;
                        var _exception = false;
                        if (data.bcjson.exception) {
                            _exception = true;
                        }
                        if (data.bcjson.exception != "" && _exception && $.kingdom.logShow == true) {
                            $(".bootbox-confirm").hide();
                            $(".modal-backdrop").hide();
                            App.unblockUI();
                            $(".exceptionLocation").show();
                            $("#message_info_all").modal("show");
                            $("#message_info_all_params_1").html("");
                            $("#message_info_all_params_2").html("");
                            $("#message_info_all_params_3").html("");
                            $("#message_info_all_params_4").html("");
                            var params = {};
                            //标题
                            $("#message_info_all_title").html(data.bcjson.traceId);
                            //失败信息
                            $("#message_info_all_params_1").html(data.bcjson.msg);
                            var paramApi = "请求API：" + api_name + ",<br />入参：";
                            //请求入参
                            $("#message_info_all_params_2").html(paramApi + data.bcjson.reqParam.replace(/,/g, ",<br />"));
                            //当前上下文参数
                            $("#message_info_all_params_3").html(data.bcjson.currentParam.replace(/,/g, ",<br />"));
                            //异常堆栈信息
                            $("#message_info_all_params_4").html(data.bcjson.exception.replace(/at /g, " <br /> at ").replace(/,/g, ",<br />"));
                            //登录
                            $("#message_info_all_params").html(paramApi + data.bcjson.reqParam.replace(/,/g, ",<br />"));
                            $("#message_info_all_content").html(data.bcjson.msg);
                            return false;
                        } else if (data.bcjson.flag == "0" && $.kingdom.logShow == true) {
                            $(".bootbox-confirm").hide();
                            $(".modal-backdrop").hide();
                            App.unblockUI();
                            $(".exceptionLocation").hide();
                            $("#message_info_all").modal("show");
                            $("#message_info_all_params_1").html("");
                            $("#message_info_all_params_2").html("");
                            $("#message_info_all_params_3").html("");
                            $("#message_info_all_params_4").html("");
                            var params = {};
                            //标题
                            $("#message_info_all_title").html("调试跟踪:" + data.bcjson.traceId);
                            //失败信息
                            $("#message_info_all_params_1").html(data.bcjson.msg);
                            //请求入参
                            var paramApi = "请求API： " + api_name + ",<br />入参：";
                            if (data.bcjson.reqParam) {
                                $("#message_info_all_params_2").html(paramApi + data.bcjson.reqParam.replace(/,/g, ",<br />"));
                            }
                            //当前上下文参数
                            if (data.bcjson.currentParam) {
                                $("#message_info_all_params_3").html(data.bcjson.currentParam.replace(/,/g, ",<br />"));
                            } else {
                                $("#message_info_all_params_3").html("");
                            }
                            cbfunc(data);
                            //异常堆栈信息
                            //$("#message_info_all_params_1").html(data.bcjson.exception.replace(/at /g, " <br /> at "));
                            return false;
                        } else {
                            cbfunc(data);
                        }
                    }
                });
            }
		



//*************************************************


$.extend({
    kingdom_temp: {
        kconfig: function() {
            var theme = "retl";
            var root = "/applications/" + theme + "/";
            var fileserver = "/fileserver";
            var developer = false;//true表示打印功能关闭
            return {
                theme: theme,
                root: root,
                fileserver: fileserver,
                developer: developer
            }
        },

        testMode: true,
        // test: false,
        logShow: false,
        // logShow: false,

        // 页面跳转缓存数据
        tempParams: {
            //audit : {} //审核页面跳转参数
        },
        log: function(arg) {
            if ($.kingdom.logShow && console && console.log) {
                console.log(arg);
            }
        },
        getBrowser: function (getVersion) {
            //注意关键字大小写
            var ua_str = navigator.userAgent.toLowerCase(), ie_Tridents, trident, match_str, ie_aer_rv, browser_chi_Type;

            if("ActiveXObject" in self){
                // ie_aer_rv:  指示IE 的版本.
                // It can be affected by the current document mode of IE.
                ie_aer_rv= (match_str = ua_str.match(/msie ([\d.]+)/)) ?match_str[1] :
                      (match_str = ua_str.match(/rv:([\d.]+)/)) ?match_str[1] : 0;

                // ie: Indicate the really version of current IE browser.
                ie_Tridents = {"trident/7.0": 11, "trident/6.0": 10, "trident/5.0": 9, "trident/4.0": 8};
                //匹配 ie8, ie11, edge
                trident = (match_str = ua_str.match(/(trident\/[\d.]+|edge\/[\d.]+)/)) ?match_str[1] : undefined;
                browser_chi_Type = (ie_Tridents[trident] || ie_aer_rv) > 0 ? "ie" : undefined;
            }else{
                //判断 windows edge 浏览器
                // match_str[1]: 返回浏览器及版本号,如: "edge/13.10586"
                // match_str[1]: 返回版本号,如: "edge" 
                //若要返回 "edge" 请把下行的 "ie" 换成 "edge"。 注意引号及冒号是英文状态下输入的
                browser_chi_Type = (match_str = ua_str.match(/edge\/([\d.]+)/)) ? "edge" :
                            //判断firefox 浏览器
                              (match_str = ua_str.match(/firefox\/([\d.]+)/)) ? "firefox" : 
                            //判断chrome 浏览器
                              (match_str = ua_str.match(/chrome\/([\d.]+)/)) ? "chrome" : 
                            //判断opera 浏览器
                              (match_str = ua_str.match(/opera.([\d.]+)/)) ? "opera" : 
                            //判断safari 浏览器
                              (match_str = ua_str.match(/version\/([\d.]+).*safari/)) ? "safari" : undefined;
            }
           
            //返回浏览器类型和版本号
            var verNum, verStr;
            verNum = trident && ie_Tridents[trident] ? ie_Tridents[trident] : match_str[1];
            verStr = (getVersion != undefined) ? browser_chi_Type+"/"+verNum : browser_chi_Type;
            return verStr;
        },
        recommendBrowser: function(){
            var browser = this.getBrowser(true);
            if(browser.indexOf('ie/')>-1 || browser.indexOf('edge/')>-1){//表明是ie浏览器
                toastr.info('Google browser recommended^_^',{positionClass:'toast-top-right'});
            }
        },
        uuid: function() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        dateFormat: function(fmt) { //author: meizz   
            var that = new Date();
            var o = {
                "M+": that.getMonth() + 1, //月份   
                "d+": that.getDate(), //日   
                "h+": that.getHours(), //小时   
                "m+": that.getMinutes(), //分   
                "s+": that.getSeconds(), //秒   
                "q+": Math.floor((that.getMonth() + 3) / 3), //季度   
                "S": that.getMilliseconds() //毫秒   
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (that.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        doKoauthAPI: function(api_name, api_version, api_params, cbfunc) {
                var $this = this;


                var param = $.kingdom.getAjaxParams(api_name, api_version, api_params);
                $.post("/api", param, function(data) {
                    if (cbfunc) {

                        var flag = data.bcjson.flag;
                        if (flag != "0" && flag != "1") {
                            //refreshFunction();
                            $this.logout(function() {
                                document.location.href = "/login.html";
                            });
                            return false;
                        }

                        cbfunc(data);
                    }
                }, "json");
            } //doKoauthAPI
            ,
        doKoauthAdminAPI: function(api_name, api_version, api_params, cbfunc, method) {

                $.kingdom.log("\n\n\n======" + $.kingdom.dateFormat("yyyy-MM-dd hh:mm:ss") + "\t" + document.location.href + "\n======begin call api:" + api_name + " ,version:" + api_version);
                $.kingdom.log("======api params:" + JSON.stringify(api_params || {}));
                // $.kingdom.log(api_params);

                var $this = this;
                var param = $.kingdom.getAjaxParams(api_name, api_version, api_params);

                var dataLen = JSON.stringify(param);
                // $.post("/admin_api", param, function(data) {
                //     if (cbfunc) {
                //         var flag = data.bcjson.flag;
                //         if (flag != "0" && flag != "1") {
                //             //refreshFunction();
                //             $this.logout(function() {
                //                 document.location.href = "/login.html";
                //             });
                //             return false;
                //         }
                //         cbfunc(data);
                //     }
                // }, "json");

                var url = "/admin_api";
                url = "/retl/rest/admin/" + $.trim(api_version) + "/" + $.trim(api_name) + ".json";
                var type = "get";


                if (dataLen && dataLen.length > 2048 /** && method=="get" **/ ) {


                    type = "post";

                } else {
                    type = method;
                }



                $.ajax({

                    type: type,
                    url: url,
                    dataType: 'json',
                    data: param,
                    timeout: 120000,
                    async: true,
                    beforeSend: function(request) {

                        var x_trace_user_id = $.cookie("x-trace-user-id");
                        if ($.trim(x_trace_user_id) == "") {
                            x_trace_user_id = $.kingdom.uuid();
                            $.cookie("x-trace-user-id", x_trace_user_id);
                        }
                        var x_trace_page_id = window.x_trace_page_id;
                        if ($.trim(x_trace_page_id) == "") {
                            x_trace_page_id = $.kingdom.uuid();
                            window.x_trace_page_id = x_trace_page_id;
                        }
                        request.setRequestHeader("X-Kweb-Menu-Id", document.location.href);
                        //  request.setRequestHeader("X-Kweb-Op-Id", "op_id1122333");
                        request.setRequestHeader("X-Kweb-Trace-Req-Id", $.kingdom.uuid());
                        request.setRequestHeader("X-Kweb-Trace-Page-Id", x_trace_page_id);
                        request.setRequestHeader("X-Kweb-Trace-User-Id", x_trace_user_id);
                        request.setRequestHeader("X-Kweb-Location-Href", document.location.href);

                        request.setRequestHeader("X-Kweb-Timestamp", new Date().getTime() + "");
                        request.setRequestHeader("X-Kweb-Sign", $.md5(document.location.href));

                        request.setRequestHeader("X-Kweb-Api-Name", $.trim(api_name));
                        request.setRequestHeader("X-Kweb-Api-Version", $.trim(api_version));
                        // request.setRequestHeader("X-Kweb-Api-Async", false);
                    },
                }).done(function(data) {
                    $.kingdom.log("======api return result:" + JSON.stringify(data || {}));
                    //$.kingdom.log(data);
                    if (data && data.bcjson && data.bcjson.flag) {
                        var flag = data.bcjson.flag;
                        if (flag == "0" && console) {
                            // console.error("===\n" + window.location.href + "\n" + data);
                        }
                    }
                    if (typeof data != "object") {
                        data = eval("(" + data + ")")
                    }
                    if (cbfunc && data) {
                        if (data.bcjson) {
                            var flag = data.bcjson.flag;
                        } else {
                            return false;
                        }
                        if (flag == "0" && data.bcjson.msg == "入参检查失败， [employeeId] 不能为空") {
                            //refreshFunction();
                            $this.logout(function() {
                                document.location.href = "/login.html";
                            });
                            return false;
                        }
                        //拦截异常报错信息
                        //是否开启flag为0时异常弹出
                        // var temp = true;
                        var _exception = false;
                        if (data.bcjson.exception) {
                            _exception = true;
                        }
                        if (data.bcjson.exception != "" && _exception && $.kingdom.logShow == true) {
                            $(".bootbox-confirm").hide();
                            $(".modal-backdrop").hide();
                            App.unblockUI();
                            $(".exceptionLocation").show();
                            $("#message_info_all").modal("show");
                            $("#message_info_all_params_1").html("");
                            $("#message_info_all_params_2").html("");
                            $("#message_info_all_params_3").html("");
                            $("#message_info_all_params_4").html("");
                            var params = {};
                            //标题
                            $("#message_info_all_title").html(data.bcjson.traceId);
                            //失败信息
                            $("#message_info_all_params_1").html(data.bcjson.msg);
                            var paramApi = "请求API：" + api_name + ",<br />入参：";
                            //请求入参
                            $("#message_info_all_params_2").html(paramApi + data.bcjson.reqParam.replace(/,/g, ",<br />"));
                            //当前上下文参数
                            $("#message_info_all_params_3").html(data.bcjson.currentParam.replace(/,/g, ",<br />"));
                            //异常堆栈信息
                            $("#message_info_all_params_4").html(data.bcjson.exception.replace(/at /g, " <br /> at ").replace(/,/g, ",<br />"));
                            //登录
                            $("#message_info_all_params").html(paramApi + data.bcjson.reqParam.replace(/,/g, ",<br />"));
                            $("#message_info_all_content").html(data.bcjson.msg);
                            return false;
                        } else if (data.bcjson.flag == "0" && $.kingdom.logShow == true) {
                            $(".bootbox-confirm").hide();
                            $(".modal-backdrop").hide();
                            App.unblockUI();
                            $(".exceptionLocation").hide();
                            $("#message_info_all").modal("show");
                            $("#message_info_all_params_1").html("");
                            $("#message_info_all_params_2").html("");
                            $("#message_info_all_params_3").html("");
                            $("#message_info_all_params_4").html("");
                            var params = {};
                            //标题
                            $("#message_info_all_title").html("调试跟踪:" + data.bcjson.traceId);
                            //失败信息
                            $("#message_info_all_params_1").html(data.bcjson.msg);
                            //请求入参
                            var paramApi = "请求API： " + api_name + ",<br />入参：";
                            if (data.bcjson.reqParam) {
                                $("#message_info_all_params_2").html(paramApi + data.bcjson.reqParam.replace(/,/g, ",<br />"));
                            }
                            //当前上下文参数
                            if (data.bcjson.currentParam) {
                                $("#message_info_all_params_3").html(data.bcjson.currentParam.replace(/,/g, ",<br />"));
                            } else {
                                $("#message_info_all_params_3").html("");
                            }
                            cbfunc(data);
                            //异常堆栈信息
                            //$("#message_info_all_params_1").html(data.bcjson.exception.replace(/at /g, " <br /> at "));
                            return false;
                        } else {
                            cbfunc(data);
                        }
                    }
                });
            } //doKoauthAdminAPI
            ,
        doKoauthAdminAPISync: function(api_name, api_version, api_params, cbfunc, method) {

                $.kingdom.log("\n\n\n======" + $.kingdom.dateFormat("yyyy-MM-dd hh:mm:ss") + "\t" + document.location.href + "\n======begin call api:" + api_name + " ,version:" + api_version);
                $.kingdom.log("======api params:" + JSON.stringify(api_params || {}));
                // $.kingdom.log(api_params);

                var $this = this;
                var param = $.kingdom.getAjaxParams(api_name, api_version, api_params);


                // $.post("/admin_api", param, function(data) {
                //     if (cbfunc) {
                //         var flag = data.bcjson.flag;
                //         if (flag != "0" && flag != "1") {
                //             //refreshFunction();
                //             $this.logout(function() {
                //                 document.location.href = "/login.html";
                //             });
                //             return false;
                //         }
                //         cbfunc(data);
                //     }
                // }, "json");

                var url = "/admin_api";
                url = "/retl/rest/admin/" + $.trim(api_version) + "/" + $.trim(api_name) + ".json";

                var type = method ? method : "get";

                var dataLen = JSON.stringify(param);
                if (dataLen && dataLen.length > 2048) {
                    type = "post";
                }



                $.ajax({

                    type: type,
                    url: url,
                    dataType: 'json',
                    data: param,
                    timeout: 120000,
                    async: false,
                    beforeSend: function(request) {

                        var x_trace_user_id = $.cookie("x-trace-user-id");
                        if ($.trim(x_trace_user_id) == "") {
                            x_trace_user_id = $.kingdom.uuid();
                            $.cookie("x-trace-user-id", x_trace_user_id);
                        }
                        var x_trace_page_id = window.x_trace_page_id;
                        if ($.trim(x_trace_page_id) == "") {
                            x_trace_page_id = $.kingdom.uuid();
                            window.x_trace_page_id = x_trace_page_id;
                        }
                        request.setRequestHeader("X-Kweb-Menu-Id", document.location.href);
                        //  request.setRequestHeader("X-Kweb-Op-Id", "op_id1122333");
                        request.setRequestHeader("X-Kweb-Trace-Req-Id", $.kingdom.uuid());
                        request.setRequestHeader("X-Kweb-Trace-Page-Id", x_trace_page_id);
                        request.setRequestHeader("X-Kweb-Trace-User-Id", x_trace_user_id);
                        request.setRequestHeader("X-Kweb-Location-Href", document.location.href);

                        request.setRequestHeader("X-Kweb-Timestamp", new Date().getTime() + "");
                        request.setRequestHeader("X-Kweb-Sign", $.md5(document.location.href));

                        request.setRequestHeader("X-Kweb-Api-Name", $.trim(api_name));
                        request.setRequestHeader("X-Kweb-Api-Version", $.trim(api_version));
                        // request.setRequestHeader("X-Kweb-Api-Async", false);
                    },
                }).done(function(data) {
                    $.kingdom.log("======api return result:" + JSON.stringify(data || {}));
                    //$.kingdom.log(data);
                    if (data && data.bcjson && data.bcjson.flag) {
                        var flag = data.bcjson.flag;
                        if (flag == "0" && console) {
                            // console.error("===\n" + window.location.href + "\n" + data);
                        }
                    }
                    if (typeof data != "object") {
                        data = eval("(" + data + ")")
                    }
                    if (cbfunc && data) {
                        if (data.bcjson) {
                            var flag = data.bcjson.flag;
                        } else {
                            return false;
                        }
                        if (flag == "0" && data.bcjson.msg == "入参检查失败， [employeeId] 不能为空") {
                            //refreshFunction();
                            $this.logout(function() {
                                document.location.href = "/login.html";
                            });
                            return false;
                        }
                        //拦截异常报错信息
                        //是否开启flag为0时异常弹出
                        // var temp = true;
                        var _exception = false;
                        if (data.bcjson.exception) {
                            _exception = true;
                        }
                        if (data.bcjson.exception != "" && _exception && $.kingdom.logShow == true) {
                            $(".bootbox-confirm").hide();
                            $(".modal-backdrop").hide();
                            App.unblockUI();
                            $(".exceptionLocation").show();
                            $("#message_info_all").modal("show");
                            $("#message_info_all_params_1").html("");
                            $("#message_info_all_params_2").html("");
                            $("#message_info_all_params_3").html("");
                            $("#message_info_all_params_4").html("");
                            var params = {};
                            //标题
                            $("#message_info_all_title").html(data.bcjson.traceId);
                            //失败信息
                            $("#message_info_all_params_1").html(data.bcjson.msg);
                            var paramApi = "请求API：" + api_name + ",<br />入参：";
                            //请求入参
                            $("#message_info_all_params_2").html(paramApi + data.bcjson.reqParam.replace(/,/g, ",<br />"));
                            //当前上下文参数
                            $("#message_info_all_params_3").html(data.bcjson.currentParam.replace(/,/g, ",<br />"));
                            //异常堆栈信息
                            $("#message_info_all_params_4").html(data.bcjson.exception.replace(/at /g, " <br /> at ").replace(/,/g, ",<br />"));
                            //登录
                            $("#message_info_all_params").html(paramApi + data.bcjson.reqParam.replace(/,/g, ",<br />"));
                            $("#message_info_all_content").html(data.bcjson.msg);
                            return false;
                        } else if (data.bcjson.flag == "0" && $.kingdom.logShow == true) {
                            $(".bootbox-confirm").hide();
                            $(".modal-backdrop").hide();
                            App.unblockUI();
                            $(".exceptionLocation").hide();
                            $("#message_info_all").modal("show");
                            $("#message_info_all_params_1").html("");
                            $("#message_info_all_params_2").html("");
                            $("#message_info_all_params_3").html("");
                            $("#message_info_all_params_4").html("");
                            var params = {};
                            //标题
                            $("#message_info_all_title").html("调试跟踪:" + data.bcjson.traceId);
                            //失败信息
                            $("#message_info_all_params_1").html(data.bcjson.msg);
                            //请求入参
                            var paramApi = "请求API： " + api_name + ",<br />入参：";
                            if (data.bcjson.reqParam) {
                                $("#message_info_all_params_2").html(paramApi + data.bcjson.reqParam.replace(/,/g, ",<br />"));
                            }
                            //当前上下文参数
                            if (data.bcjson.currentParam) {
                                $("#message_info_all_params_3").html(data.bcjson.currentParam.replace(/,/g, ",<br />"));
                            } else {
                                $("#message_info_all_params_3").html("");
                            }
                            cbfunc(data);
                            //异常堆栈信息
                            //$("#message_info_all_params_1").html(data.bcjson.exception.replace(/at /g, " <br /> at "));
                            return false;
                        } else {
                            cbfunc(data);
                        }
                    }
                });
            } //doKoauthAdminAPI
            ,
        doKoauthCode: function(params, cbfunc) {
            var param = $.kingdom.getCodeAjaxParams(params, cbfunc);
            $.post("/code", param, function(data) {
                if (cbfunc) {
                    cbfunc(data);
                }
            }, "json");
        },
        doKoauthAPISync: function(api_name, api_version, api_params, cbfunc) {
                var param = $.kingdom.getAjaxParams(api_name, api_version, api_params);
                $.ajax({
                    type: "post",
                    url: "/api",
                    dataType: 'json',
                    data: param,
                    async: false
                }).done(function(data) {
                    if (typeof data != "object") {
                        data = eval("(" + data + ")")
                    }
                    if (cbfunc) {
                        cbfunc(data);
                    }
                });
            } //doKoauthAPI
            ,
        // doKoauthAdminAPISync: function(api_name, api_version, api_params, cbfunc) {
        //         var $this = this;
        //         var param = $.kingdom.getAjaxParams(api_name, api_version, api_params);
        //         $.ajax({
        //             type: "post",
        //             url: "/admin_api",
        //             dataType: 'json',
        //             data: param,
        //             async: false
        //         }).done(function(data) {
        //             if (typeof data != "object") {
        //                 data = eval("(" + data + ")")
        //             }
        //             if (cbfunc) {
        //                 var flag = data.bcjson.flag;
        //                 if (flag != "0" && flag != "1") {
        //                     //refreshFunction();
        //                     $this.logout(function() {
        //                         document.location.href = "/login.html";
        //                     });
        //                     return false;
        //                 }
        //                 cbfunc(data);
        //             }
        //         });
        //     } //doKoauthAPI
        //     ,
        doCloudKoauthAPI: function(api_name, api_version, api_params, cbfunc) {
                var param = $.kingdom.getAjaxParams(api_name, api_version, api_params);
                $.post("/api_cloud", param, function(data) {
                    if (cbfunc) {
                        cbfunc(data);
                    }
                }, "json");
            } //doCloudKoauthAPI(用于调用接入的各金融机构的接口)
            ,
        doCloudKoauthAPISync: function(api_name, api_version, api_params, cbfunc) {
                var param = $.kingdom.getAjaxParams(api_name, api_version, api_params);
                $.ajax({
                    type: "post",
                    url: "/api_cloud",
                    dataType: 'json',
                    data: param,
                    async: false
                }).done(function(data) {
                    if (typeof data != "object") {
                        data = eval("(" + data + ")")
                    }
                    if (cbfunc) {
                        cbfunc(data);
                    }
                });
            } //doCloudKoauthAPISync(用于调用接入的各金融机构的接口)
            ,
	 doDevToolApi: function(api_service, api_params, cbfunc) {
                var param = $.kingdom.getAjaxParams("api_name", "api_version", api_params);
				var reqUrl = "/retl/rest/common/devtool/"+api_service+".json";
                $.ajax({
                    type: "post",
                    url: reqUrl,
                    dataType: 'json',
                    data: param,
                    async: true
                }).done(function(data) {
                    if (typeof data != "object") {
                        data = eval("(" + data + ")")
                    }
                    if (cbfunc) {
                        cbfunc(data);
                    }
                });
            } //doCloudKoauthAPISync(用于调用接入的各金融机构的接口)
            ,
        // getLoginName: function(cbfunc) {
        //         $.post("/krcs/login_name", {}, function(data) {
        //             if (cbfunc) {
        //                 cbfunc(data);
        //             }
        //         }, "json");
        //     } //getLoginName
        getLoginName: function(cbfunc) {
            $.ajax({
                url: "/krcs/login_name",
                data: {},
                type: "post",
                dataType: "json",
               // timeout: 10000,
                success: function(data) {
                    if (cbfunc) {
                        cbfunc(data);
                    }
                },
                error: function(data, textStatus) {
                    if (textStatus == "timeout") {
                        window.location.href = "/login.html";
                        return false;
                    }
                }
            });
        },
        getRedirect: function(cbfunc) { //登录跳转
            $.ajax({
                type: "post",
                url: "/redirect",
                dataType: 'json',
                async: true
            }).done(function(data) {
                var result = "";
                if (data.bcjson.flag == "1") {
                    result = data.bcjson.items[0].redirect;
                }
                if (cbfunc) {
                    cbfunc(result)
                }
            });
            //return result;
        },
        logout: function(cbfunc) {
                // $.post("/logout", {}, function(data) {
                //     if (cbfunc) {
                //         cbfunc(data);
                //     }
                // }, "json");
                api_name = "kingdom.ktrade.set_dis_employee_login_out";
                api_version = "v4.0";
                api_params = {
                    "loginName": $('.username').html().trim()
                };
                $.kingdom.log("\n\n\n======" + $.kingdom.dateFormat("yyyy-MM-dd hh:mm:ss") + "\t" + document.location.href + "\n======begin call api:" + api_name + " ,version:" + api_version);
                $.kingdom.log("======api params:" + JSON.stringify(api_params || {}));
                // $.kingdom.log(api_params);
                var $this = this;
                var param = $.kingdom.getAjaxParams(api_name, api_version, api_params);
                var url = "/admin_api";
                url = "/retl/rest/admin/" + $.trim(api_version) + "/" + $.trim(api_name) + ".json";
                $.ajax({
                    type: "get",
                    url: url,
                    dataType: 'json',
                    data: param,
                    async: false,
                    beforeSend: function(request) {
                        request.setRequestHeader("X-Kweb-Menu-Id", "id1122333");
                        request.setRequestHeader("X-Kweb-Op-Id", "op_id1122333");
                        request.setRequestHeader("X-Kweb-Req-Trace-Id", "rt1122333");
                        request.setRequestHeader("X-Kweb-Location-Href", document.location.href);

                        request.setRequestHeader("X-Kweb-Timestamp", new Date().getTime() + "");
                        request.setRequestHeader("X-Kweb-Sign", $.md5(document.location.href));

                        request.setRequestHeader("X-Kweb-Api-Name", $.trim(api_name));
                        request.setRequestHeader("X-Kweb-Api-Version", $.trim(api_version));
                        request.setRequestHeader("X-Kweb-Api-Async", false);
                    },
                }).done(function(data) {
                    $.kingdom.log("======api return result:" + JSON.stringify(data || {}));
                    //$.kingdom.log(data);

                    if (data && data.bcjson && data.bcjson.flag) {
                        var flag = data.bcjson.flag;
                        if (flag == "0" && console) {
                            // console.error("===\n" + window.location.href + "\n" + data);
                        }
                    }


                    if (typeof data != "object") {
                        data = eval("(" + data + ")")
                    }
                    if (cbfunc && data) {
                        if (data.bcjson) {
                            var flag = data.bcjson.flag;
                        } else {
                            return false;
                        }

                        if (flag != "0" && flag != "1") {
                            //refreshFunction();
                            $this.logout(function() {
                                document.location.href = "/login.html";
                            });
                            return false;
                        }
                        //拦截异常报错信息
                        if (data.bcjson.msg.indexOf("请求处理异常") > -1 && $.kingdom.logShow == true) {
                            $("#message_info_all").modal("show");
                            var items = data.bcjson.msg;
                            var params = {};
                            params.titleIndex = items.indexOf("请求处理异常");
                            params.paramIndex = items.indexOf("入参");
                            params.contentIndex = items.indexOf("异常堆栈");
                            var title = items.substring(params.titleIndex, params.paramIndex);
                            var param = items.substring(params.paramIndex, params.contentIndex);
                            var content = items.substring(params.contentIndex, items.length);
                            if (title.length > 50) {
                                title = title.substring(0, 50) + "...";
                            }
                            param = "请求API: " + api_name + " <br />" + param;
                            param = param.replace(/,/g, ",<br />");
                            content = content.replace(/at /g, " <br /> at ");
                            $("#message_info_all_title").html(title);
                            $("#message_info_all_params").html(param);
                            $("#message_info_all_content").html(content);
                            return false;
                        } else {
                            cbfunc(data);
                        }
                    }
                });
            } //logout
            ,
        getAjaxParams: function(a, v, p) {
                if ($.kingdom.testMode) {
                    var test_param = {};
                    // test_param.a = a;
                    //  test_param.v = v;
                    test_param.p = JSON.stringify(p);
                    test_param._ts = new Date().getTime();
                    //  test_param.href = document.location.href;
                    return test_param;
                } else {
                    if (random) {
                        if (random == 0) {
                            return $.kingdom.get16(a, v, p);
                        } else if (random == 1) {
                            return $.kingdom.getK(a, v, p);
                        } else {
                            return $.kingdom.getL(a, v, p);
                        }
                    }
                }
            } //getAjaxParams
            ,
        getCodeAjaxParams: function(params) {
            var pp = {};
            var random = "kingdom" + new Date().getTime() + "";
            pp[random] = $.base64.encode(encodeURIComponent(JSON.stringify(params)));
            return pp;
        },
        get16: function(a, v, p) {
                var pp = {};
                var _t = new Date().getTime() + "";
                var _p = JSON.stringify(p);
                pp._0x0111 = $.base64.encode(_t);
                pp._0x1011 = $.base64.encode(a);
                pp._0x1100 = $.base64.encode(v);
                pp._0x1110 = $.base64.encode(encodeURIComponent(_p));
                pp._0x1001 = $.md5(pp._0x0111 + pp._0x1011 + pp._0x1100 + pp._0x1110).toUpperCase()
                pp._0x1101 = $.base64.encode(document.location.href);
                return pp;
            } //get16
            ,
        getK: function(a, v, p) { //_params.._version .. _timestamp .. _api_name
                var pp = {};
                var _t = new Date().getTime() + "";
                var _p = JSON.stringify(p);
                pp.KInGDOM = $.base64.encode(_t);
                pp.KINGdOM = $.base64.encode(a);
                pp.KINGDoM = $.base64.encode(v);
                pp.KiNGDOM = $.base64.encode(encodeURIComponent(_p));
                pp.kINGDOM = $.md5(pp.KiNGDOM + pp.KINGDoM + pp.KInGDOM + pp.KINGdOM).toUpperCase()
                pp.KINgDOM = $.base64.encode(document.location.href);
                pp.KINGDOm = $.base64.encode(document.location.protocol);
                return pp;
            } //getK
            ,
        getL: function(a, v, p) {
                var pp = {};
                var _t = new Date().getTime() + "";
                var _p = JSON.stringify(p);
                pp.css = $.base64.encode(_t);
                pp.android = $.base64.encode(a);
                pp.html = $.base64.encode(v);
                pp.ios = $.base64.encode(encodeURIComponent(_p));
                pp.js = $.md5(pp.ios + pp.android + pp.css + pp.html).toUpperCase()
                pp.wp = $.base64.encode(document.location.href);
                return pp;
            } //getL
            ,
        upload: function(form_id, cbfunc) { //上传
                var options = {
                    url: "/krcs/file/upload",
                    type: "POST",
                    dataType: "json",
                    success: function(data) {
                        var jsondata = {};
                        if (typeof(data) == "string") {
                            jsondata = eval('(' + data + ')');
                        } else {
                            jsondata = data
                        }
                        if (cbfunc) {
                            cbfunc(jsondata);
                        }
                    },
                    error: function(e) {
                        var jsondata = {};
                        if (typeof(e.responseText) == "string") {
                            jsondata = eval('(' + e.responseText + ')');
                        } else {
                            jsondata = e

                        }
                        if (cbfunc) {
                            cbfunc(jsondata);
                        }
                    }
                };
                $("#" + form_id).ajaxSubmit(options);
            } //upload
            ,
        cutimage: function(form_id, cbfunc) { //裁剪
                var options = {
                    url: "/cutimage",
                    type: "POST",
                    dataType: "json",
                    success: function(data) {
                        var jsondata = {};
                        if (typeof(data) == "string") {
                            jsondata = eval('(' + data + ')');
                        } else {
                            jsondata = data;
                        }
                        if (cbfunc) {
                            cbfunc(jsondata);
                        }
                    },
                    error: function(e) {
                        var jsondata = {};
                        if (typeof(e.responseText) == "string") {
                            jsondata = eval('(' + e.responseText + ')');
                        } else {
                            jsondata = data;
                        }
                        if (cbfunc) {
                            cbfunc(jsondata);
                        }
                    }
                };
                $("#" + form_id).ajaxSubmit(options);
            } //cutimage
            ,
        getUrlParameter: function(name) { //获取url参数
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURI(r[2]);
            }
            return null;
        },
        getCookieParameter: function(name) { //获取cookie参数
            var reg = new RegExp(name + '=([^;]*)(;|$)', 'i');
            var r = document.cookie.match(reg);
            if (r != null) {
                return $.base64.decode(decodeURI(r[1]));
            }
            return null;
        },
        setParameter: function(key, value) {
            window.sessionStorage.setItem(key, value);
            return;
        },
        getParameter: function(key) {
            var value = window.sessionStorage.getItem(key);
            if (!value || value == '') {
                return '';
            }
            return value;
        },
        delParameter: function(key) {
            window.sessionStorage.removeItem(key);
            return;
        },
        fixMoney: function(s, n) { //格式化金额如：1,100,000.00
            if (!s) {
                return "0.00";
            }
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1];
            t = "";
            for (i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        },
        toDate: function(sbsj) { //格式化日期 (yyyy-MM-dd)
            if (!sbsj) {
                return "";
            }
            sbsj = sbsj.toString();

            return sbsj.substring(0, 4) + "-" + sbsj.substring(4, 6) + "-" + sbsj.substring(6, 8);

        },
        replaceString: function(s, n, r) {
            //s:字符串;n:保留字符串前后n位数不被替换;r:默认替换“*”
            var r = r ? r : "*";
            var l = s.length;
            j = "";
            for (var i = l - n; i > 0; i--) {
                j = r.concat(j);
            };
            return s = s.replace(s.substr(n, l - n), j);
        },
        uniqueArray: function(arry) { //数组去重
            var n = {},
                r = []; //n为hash表，r为临时数组
            for (var i = 0; i < arry.length; i++) //遍历当前数组
            {
                if (!n[arry[i]]) //如果hash表中没有当前项
                {
                    n[arry[i]] = true; //存入hash表
                    r.push(arry[i]); //把当前数组的当前项push到临时数组里面
                }
            }
            return r;
        },
        // 入参：生成树的数组，id的属性名，父id的属性名，生成的子数组的，排序的属性，升序asc/降序desc
        generateTree: function(array, idName, parentIdName, childrenName, sortName, sortType) {
            idName = idName || "id";
            parentIdName = parentIdName || "parentId";
            childrenName = childrenName || "children";
            //sortName = sortName || "sort";
            sortType = sortType || "asc";
            var result = [];
            var leafList = [];
            var parent = {}; // 缓存所有的父id
            // 先收集所有的父元素id
            $.each(array, function(i, n) {
                if (!parent[n[parentIdName]]) {
                    parent[n[parentIdName]] = 1;
                }
            });
            // 区分叶子节点和父节点，父节点放result里，叶子节点放leafList里
            $.each(array, function(iLeaf, leaf) {
                if (typeof(leaf[childrenName]) == 'undefined') {
                    leaf[childrenName] = [];
                }
                if (parent[leaf[idName]] == 1) {
                    // 当前元素是父节点
                    //  leaf.type="node";
                    result.push(leaf);
                } else {
                    // 当前元素是叶子节点
                    // leaf.type ="leaf";
                    leafList.push(leaf);
                }
            });
            // 排序
            if (sortName) {
                $.kingdom.quickSort(leafList, 0, leafList.length - 1, sortName, sortType);
            }
            // 当result的length和array的length一样时，说明全是叶子元素，则跳出
            if (leafList.length == array.length) {

                $.each(leafList, function(idx, obj) {
                    if (!obj.children || obj.children.length == 0) {
                        obj.type = "leaf";
                    }

                });
                return leafList;
            }
            // 此时，result里面没有叶子元素了
            // 把叶子元素放入result中对应元素的属性中
            // 若没有对应元素匹配，则直接放到result数组中
            $.each(leafList, function(iLeaf, leaf) {
                // 是否已经放入结果集
                var hasPushed = false;
                $.each(result, function(iParent, parentObject) {
                    if (leaf[parentIdName] == parentObject[idName]) {
                        // 把叶子元素放入result中对应元素的属性中
                        parentObject[childrenName].push(leaf);

                        parentObject.type = "node";

                        hasPushed = true;
                        return false; // 实现break功能
                    }
                });
                $.each(result, function(i, e) {
                    $.kingdom.quickSort(e[childrenName], 0, e[childrenName].length - 1, idName, "asc")
                });
                // result中没有对应元素匹配，则直接放到result数组中
                if (hasPushed == false) {
                    result.push(leaf);
                }
            });
            // 继续找叶子元素，直到全是叶子元素
            return $.kingdom.generateTree(result, idName, parentIdName, childrenName, sortName, sortType);
        },
        // 快排入口
        quickSort: function(array, low, high, sortName, sortType) {
            function QuickSortHelp(array, low, high, sortName, sortType) {
                // 若是纯数字，则转成数字排序
                array[high][sortName] = isNaN(array[high][sortName]) ? array[high][sortName] : parseFloat(array[high][sortName]);
                array[low][sortName] = isNaN(array[low][sortName]) ? array[low][sortName] : parseFloat(array[low][sortName]);
                if (sortType == "asc") {
                    while (low < high) {
                        while (low < high && array[low][sortName] <= array[high][sortName]) {
                            high--;
                        }
                        var temp = array[low];
                        array[low] = array[high];
                        array[high] = temp;
                        while (low < high && array[low][sortName] <= array[high][sortName]) {
                            low++
                        }
                        temp = array[low];
                        array[low] = array[high];
                        array[high] = temp;
                    }
                    return low;
                } else if (sortType == "desc") {
                    while (low > high) {
                        while (low > high && array[low][sortName] >= array[high][sortName]) {
                            high--;
                        }
                        var temp = array[low];
                        array[low] = array[high];
                        array[high] = temp;
                        while (low > high && array[low][sortName] >= array[high][sortName]) {
                            low++
                        }
                        temp = array[low];
                        array[low] = array[high];
                        array[high] = temp;
                    }
                    return low;
                }
            };
            if (low < high) {
                var keypoint = QuickSortHelp(array, low, high, sortName, sortType);
                $.kingdom.quickSort(array, low, keypoint - 1, sortName, sortType);
                $.kingdom.quickSort(array, keypoint + 1, high, sortName, sortType);
            }
        },
        getDateStr: function(n, split) { //计算昨天、明天等日期；入参为当前天数的+-n天，0为今天，1为明天，-1为昨天
            var split = split ? split : "";
            var dd = new Date();
            dd.setDate(dd.getDate() + n); //获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1; //获取当前月份的日期
            var d = dd.getDate();
            return y + "" + split + "" + ((m <= 9) ? ('0' + m) : m) + "" + split + "" + ((d <= 9) ? ('0' + d) : d);
        },
        fixMoneyBig: function(num) { //金额转为大写显示
            var strOutput = "";
            var strUnit = '仟佰拾亿仟佰拾万仟佰拾圆角分';
            num += "00";
            var intPos = num.indexOf('.');
            if (intPos >= 0)
                num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
            strUnit = strUnit.substr(strUnit.length - num.length);
            for (var i = 0; i < num.length; i++)
                strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
            return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+圆/, '圆').replace(/亿零{0,3}万/, '亿').replace(/^圆/, "零圆");
        },
        openWin: function(url) {
            var a = document.createElement("a");
            a.setAttribute("href", url);
            //a.setAttribute("target", "_blank");
            a.setAttribute("id", "openwin");
            document.body.appendChild(a);
            a.click();
            $(a).remove();
        },
        draggable: function(locaiton, type) {
            var $modal = $(locaiton);
            /* 完成拖拽 */
            $modal.draggable({
                cursor: "move",
                handle: '.modal-header'
            });
            if (type) {
                $modal.modal(type);
            } else {
                $modal.modal('hide');
            }
        },
        // 文本域限制
        textCounter: function(field, maxlimit) {
            // 函数，3个参数，表单名字，表单域元素名，限制字符；
            var checkMax = function(fields, maxlimits) {
                    var countfield = $(fields).next();

                    if (fields.val().length > maxlimits) { // 如果元素区字符数大于最大字符数，按照最大字符数截断；
                        fields.val(fields.val().substring(0, maxlimits));
                    } else { //在记数区文本框内显示剩余的字符数；
                        countfield.text(maxlimits - fields.val().length);
                    }
                }
                // 通知内容字数限制
            $(field).after(" 还可输入<span>" + maxlimit + "</span>/<span>" + maxlimit + "</span>个字符")
            $(field).on('input', '', function(event) {
                checkMax($(this), $(this).next().next().text());
            });
        },
        animateMarginLeft: function(marginLf, time) {
            var timeout = time || 300;
            $("#J_sheet_tabs").animate({
                'margin-left': marginLf,
            }, timeout);
        },
        ls: {
            set: function (key , value, cTime) {
                var cValue={}; 
                cValue.data = value;
                if(cTime && cTime > 0) cValue.expire = (new Date().getTime() / 60000) + cTime;
                else cValue.expire = 0;
                window.localStorage.setItem(key , JSON.stringify(cValue));
            },
            get:function (key) {
                try {
                    var rst = JSON.parse(window.localStorage.getItem(key));
                    if(!rst) rst = '';
                    else if(rst.expire > 0 && rst.expire <= (new Date().getTime() / 60000)){
                        rst = ''; 
                        window.localStorage.removeItem(key);
                    } 
                    else rst = rst.data;
                }
                catch(err) { 
                    var rst = '';
                }
                return rst;
            },
            del: function (key) {window.localStorage.removeItem(key);}, //remove one
            clear: function (key) {window.localStorage.clear();} //remove all localStorage data
        },
    }
});



//kingdom module wrapper =======================
try {
    if (seajs) {
        define(function(require, exports, module) {
            module.exports = jQuery.kingdom;
        });
    }
} catch (_error) {}