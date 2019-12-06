define(function(require, exports, module) {

    //"klogin","bootstrap","cookie","blockui","uniform","switch","toastr","plugins/jquery-validation/js/jquery.validate.min","app",

    require("cookie");
    require("blockui");
    require("uniform");
    require("switch");
    require("toastr");

    require("plugins/jquery-validation/js/jquery.validate");


    var kweb = require("./kweb");
    var checkImage = false;
    var showContent = {};
    var codetime = 60;
    var paramRealValue
    var localName = '';
    if (window.sessionStorage.getItem('loginErrorCount') >= 3) {
        // debugger;
        // $("#J_checkcode").removeClass("hide");
    }
	
			 //进入登录页面则重置
    kweb.kingdom.setValue("x-trace-user-id", kweb.kingdom.uuid());
    
    	
							
    var Login = function() {
        //获取到当前时间
        function getCurrentTimeLogin() {      
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_sys_current_date", "v4.0", {}, function(data) {
                if (data.bcjson.flag === "1" && data.bcjson.items[0]) {
                    var times = data.bcjson.items[0].currentDate;
                    var startTime = times.substring(0,8)
                    getAuthorizationTime(startTime)
                }
            });

        }
        // 获取授权到期日期判断是否将要过期
        function getAuthorizationTime (startTime){
                var options = {
                    url:
                      window.location.origin +
                      "/retl/rest/admin/v4.0/bayconnect.superlop.get_auth_info.json",
                    type: "POST",
                    dataType: "json",
                    success: function(data) {
                      App.unblockUI();
                      if(data.bcjson.flag == "1" && data.bcjson.items){ 
                          if(data.bcjson.items.length>0){
                            let item = data.bcjson.items[0];
                            let date = item.date.substring(0,4)+"-"+item.date.substring(4,6)+"-"+item.date.substring(6,8);
                            let year = startTime.substring(0,4);
                            let mounth =startTime.substring(4,6);
                            let day = startTime.substring(6,8);
                            let dateFormat=  year+"-"+mounth+"-"+day;
                            var date1 = new Date(dateFormat).getTime();
                            var date2 = new Date(date).getTime();
                            var date3 = (date2 - date1)/ 86400000;
                             if(date3<paramRealValue&&date3>0){
                                 $(".authorizationing").removeClass("hide");
                                 $(".authorizationing span").html(date);
                             }
                             if(date3<0){
                                $(".authorizationed").removeClass("hide");
                                $(".authorizationed span").html(date);
                             }
                          }
                      }
                    },
                    error: function(e) {
                      App.unblockUI();
                      toastr.error(e.bcjson.msg);
                    }
                  };
                  $("#login-authorization").ajaxSubmit(options)
        }
        // 获取判断是否过期的相差天数  
        (function getAuthorizationDay (){  
            $.kingdom.doKoauthAdminAPI(" bayconnect.superlop.get_sys_param_info","v4.0", {"groupNo":"group.authinfo.warn","paramKey":"group.authinfo.warn.deadline"},
                function(data) {
                    var items = data.bcjson.items[0] || data.bcjson;               
                    if (data.bcjson.flag == "1" && items) {
                        paramRealValue = items.paramRealValue*1;
                        getCurrentTimeLogin();
                    } else {
                        toastr.error(items.bcjson.msg);
                    }
                })
            })();  
        var uniqueID = "";
        var handleLogin = function() {

            $('.login-form').validate({
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    username: {
                        required: true
                    },
                    password: {
                        required: true
                    },
                    validation: {
                        required: true,
                        validateimg: false
                    }
                },
                messages: {
                    username: {
                        required: "用户名不能为空"
                    },
                    password: {
                        required: "密码不能为空"
                    },
                    validation: {
                        required: "验证码不能为空"
                    }
                },
                invalidHandler: function(event, validator) { //display error alert on form submit
                    // $('.alert-danger', $('.login-form')).show();
                },
                highlight: function(element) { // hightlight error inputs
                    $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
                },
                success: function(label) {
                    label.closest('.form-group').removeClass('has-error');
                    label.remove();
                },
                errorPlacement: function(error, element) {
                    error.insertAfter(element);
                },
                submitHandler: function(form) {
                    submitForm();
                }
            });

            $('.login-form input').keypress(function(e) {
                if (e.which == 13) {
                    if ($('.login-form').validate().form()) {
                        submitForm(); //form validation success, call ajax form submit
                    }
                    return false;
                }
            });
            $(".rem-checkbox").change(function() {
                if ($(this).prop("checked")) {
                    checkImage = true;
                    $("#login-validation").rules("add", {
                        required: true,
                        validateimg: false
                    });
                } else {
                    checkImage = false;
                    $("#login-validation").rules("remove");
                }
            });
            $(".rem-checkbox").prop("checked", "true").parent().addClass("checked");
        };
        var submitForm = function() {
            var pswd = $('input[name=password]').val();
            var name = $('input[name=username]').val();
            var validcode = $("#login-validation").val();
            var loginErrorCount = $.kingdom.getParameter('loginErrorCount');
            // var msgcode = $.trim($("#messagecode input[name='validation']").val());
            // if (loginErrorCount >= 3) {
            //     if (!validateimg(validcode)) {
            //         toastr.error("验证码错误，请重新输入！");
            //         $("#login-validation").val('');
            //         // loadvalidateimg();
            //         return false;
            //     }
            // }
            $('input[name=password]').val(kweb.des.getDes(pswd));
            var api_params = {
                loginName: name,
                loginPwd: kweb.des.getDes(pswd),
                storeId: "100",
                ipAddress: "127.0.0.1",
                loginType: "1",
                loginFromWay: "0",
                businessCode: '1001',
                // msgCode: msgcode
            };
            kweb.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_dis_employee_login", "v4.0", api_params, function(data) {
                if (data.bcjson.flag == "0") {
                    // if (!data.bcjson.items[0].loginErrorCount || (data.bcjson.items[0].loginErrorCount != "-1" && data.bcjson.items[0].loginErrorCount >= 3)) {
                    //     // $("#J_checkcode").removeClass("hide");
                    // }
                    $.kingdom.setParameter('loginErrorCount', parseInt(loginErrorCount ? loginErrorCount : 0) + 1);
                    if ($.kingdom.getParameter('loginErrorCount') >= 3) {
                        // $("#J_checkcode").removeClass("hide");
                    }
                    if(data.bcjson.msg==="非法拷贝"){
                        data.bcjson.msg="无效的授权信息";
                    }
                    toastr.error(data.bcjson.msg);
                    $('input[name=password]').val("");
                    $('input[name=password]').focus()
                    $("#login-validation").val("");
                    // loadvalidateimg();
                } else if (data.bcjson.flag == "1") {
                    $.kingdom.setParameter('loginErrorCount', "0");
                    $.kingdom.setParameter('employeeId', data.bcjson.items[0].employeeId);
                    $.kingdom.setParameter('loginName', api_params.loginName);
                    $.cookie('adminFlagTrue', data.bcjson.items[0].adminFlagTrue);
                    $.cookie('parentDepartmentId', data.bcjson.items[0].currentUserdepartmentId);
                    $.cookie('parentDepartmentType', data.bcjson.items[0].currUserdepartmentType);
                    document.location = "/index.html";
                }
            });
        };
        var loadvalidateimg = function() {


            /**
                               var pp = {};
                               pp.aa = "aaaa";
                               pp.bb = "bbbbb" ;
                            kweb.kdata.getJsonData("/retl/rest/imageValideCodeService/get.json",pp,function(data) {
                            $(".img-validate").attr("src", data.bcjson.items[0].validcode);
                            uniqueID = data.bcjson.items[0].uniqueID;
                        }); **/


            kweb.kdata.getBackApiJsonAsync("bayconnect.superlop.get_base64_image_validcode_v4", "v4.0", {}, function(data) {
                // $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_base64_image_validcode_v4", "v4.0", {}, function(data) {
                $(".img-validate").attr("src", data.bcjson.items[0].validcode);
                uniqueID = data.bcjson.items[0].uniqueID;
            });



        };
        var buttonCountdown = function($el, msNum, timeFormat) {
            var text = $el.data("text") || $el.text(),
                timer = 0;
            $el.prop("disabled", true).addClass("disabled")
                .on("bc.clear", function() {
                    clearTime();
                });

            (function countdown() {
                var time = showTime(msNum)[timeFormat];
                $el.text(time + '后失效');
                if (msNum <= 0) {
                    msNum = 0;
                    clearTime();
                    localName = '';
                } else {
                    msNum -= 1000;
                    timer = setTimeout(arguments.callee, 1000);
                }
            })();

            function clearTime() {
                clearTimeout(timer);
                $el.prop("disabled", false).removeClass("disabled").text(text);
            }

            function showTime(ms) {
                var d = Math.floor(ms / 1000 / 60 / 60 / 24),
                    h = Math.floor(ms / 1000 / 60 / 60 % 24),
                    m = Math.floor(ms / 1000 / 60 % 60),
                    s = Math.floor(ms / 1000 % 60),
                    ss = Math.floor(ms / 1000);

                return {
                    d: d + "天",
                    h: h + "小时",
                    m: m + "分",
                    ss: ss + "秒",
                    "d:h:m:s": d + "天" + h + "小时" + m + "分" + s + "秒",
                    "h:m:s": h + "小时" + m + "分" + s + "秒",
                    "m:s": m + "分" + s + "秒"
                };
            }

            return this;
        }
        $("body").on("click", "#uml-forgetpwd #VerificationCodeId", function() {
            var loginName = $("#uml-forgetpwd input[name=loginName]").val();
            var sysType = "cisp";
            var loginType = "1";
            if (!loginName) {
                toastr.options = {
                    positionClass: "toast-top-center"
                };
                toastr.error("请输入登录名！");
                $(this).trigger("bc.clear");
                return;
            }
            var paramsMap = {};
            paramsMap.loginName = loginName;
            paramsMap.sysType = sysType;
            paramsMap.loginType = loginType;
            buttonCountdown($(this), 1000 * 60 * 3, "ss");
            getcheckcode(paramsMap);
        });
        var getcheckcode = function(paramsMap) {
            $.kingdom.doKoauthAdminAPI("kingdom.krcs.set_send_mail_message_reset_pwd", "v4.0", paramsMap, function(data) {
                var items = data.bcjson.items || data.bcjson;
                if (data.bcjson.flag == "0") {
                    $("#VerificationCodeId").trigger("bc.clear");
                    toastr.options = {
                        positionClass: "toast-top-center"
                    };
                    localName = '';
                    toastr.error(data.bcjson.msg);
                    return;
                };
                if (data.bcjson.flag == "1") {
                    toastr.options = {
                        positionClass: "toast-top-center"
                    };
                    localName = $("#uml-forgetpwd input[name=loginName]").val();
                    toastr.success(data.bcjson.msg);
                    var uniqueID = items[0].uniqueID;
                    $("#uml-forgetpwd input[name=uniqueID]").val(uniqueID);
                    return;
                }
            });
        };
        $("body").on("click", "#uml-forgetUserBt", function() {
            var paramsMap = {};
            var V_code = $("#uml-forgetpwd input[name=V_code]").val();
            if (!V_code) {
                toastr.options = {
                    positionClass: "toast-top-center"
                };
                toastr.error("验证码不能为空");
                return;
            }
            var uniqueID=$("#uml-forgetpwd input[name=uniqueID]").val();
            if(uniqueID==null||uniqueID==""){
                toastr.options = {positionClass: "toast-top-center"};
                toastr.error("验证码非法！"); 
                return;
            }
            paramsMap.loginName = $("#uml-forgetpwd input[name=loginName]").val();
            var loginpwd = $("#uml-forgetpwd input[name=loginPwd]").val();
            if (paramsMap.loginName && paramsMap.loginName!=localName){
                toastr.error("登录名不一致，请重新输入！");
                return;
            }
            if (!loginpwd) {
                toastr.options = {
                    positionClass: "toast-top-center"
                };
                toastr.error("新密码不能为空！");
                return;
            }
            var loginPwdTwo = $("#uml-forgetpwd input[name=loginPwdTwo]").val();
            if (loginPwdTwo != loginpwd) {
                toastr.options = {
                    positionClass: "toast-top-center"
                };
                toastr.error("两次密码不一致！");
                return;
            }
            paramsMap.loginPwd = kweb.des.getDes(loginpwd);
            paramsMap.loginType = "1";
            paramsMap.exchangeId = "1";
            paramsMap.distributorId = "100";
            paramsMap.employeeId = "230004";
            paramsMap.forgetPwd="true";
            paramsMap.uniqueID=uniqueID; 
            paramsMap.V_code=V_code;
            $.kingdom.doKoauthAdminAPI("bayconnect.superlop.update_dis_employee_pwd", "v4.0", paramsMap, function(data) {
                var items = data.bcjson.items || data.bcjson;
                if (data.bcjson.flag == "0") {
                    $("#VerificationCodeId").trigger("bc.clear");
                    toastr.options = {
                        positionClass: "toast-top-center"
                    };
                    toastr.error(data.bcjson.msg);
                    return;
                };
                if (data.bcjson.flag == "1") {
                    $("#forget-password").modal("hide");
                     $('#reset').click();
                    toastr.options = {
                        positionClass: "toast-top-center"
                    };
                    toastr.success(data.bcjson.msg);
                    return;
                }
            });
        });
        $("body").on("blur", "#uml-forgetpwd input[name=loginPwdTwo]", function() {
            var loginPwd = $("#uml-forgetpwd input[name=loginPwd]").val();
            if (!loginPwd) {
                toastr.options = {
                    positionClass: "toast-top-center"
                };
                toastr.error("新密码不能为空！");
                return;
            }
            var loginPwdTwo = $("#uml-forgetpwd input[name=loginPwdTwo]").val();
            if (loginPwdTwo != loginPwd) {
                toastr.options = {
                    positionClass: "toast-top-center"
                };
                toastr.error("两次密码不一致！");
                return;
            }
        });
        $("body").on("blur", "#uml-forgetpwd input[name=loginPwd]", function() {
            var loginPwd = $("#uml-forgetpwd input[name=loginPwd]").val();
            var pattern = /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/;
            if (loginPwd) {
                if (!pattern.test(loginPwd)) {
                    toastr.options = {
                        positionClass: "toast-top-center"
                    };
                    toastr.error("请输入6-16位字符（中文占两个字符），至少包含数字、字母(区分大小写)！");
                    return;
                }
            }
        });

        $('body').on("click", "#J_message_time", function() {
            if ($(this).hasClass('green')) {
                var name = $.trim($('#login-username').val());
                if (!name) {
                    toastr.info("请输入用户名");
                    return;
                }
                messagecode(name, "#messagecode input[name='validation']");
            }
        });

        //获取短信验证码
        var messagecode = function(value, element) {
            kweb.kingdom.doKoauthAdminAPISync("kingdom.krcs.get_message_code_send", "v4.0", {
                "exchangeId": '1',
                "distributorId": '100',
                "businessCode": '1001',
                "loginName": value
            }, function(data) { 
                if (data.bcjson.flag == "1") {
                    var items = data.bcjson.items[0];
                    $(element).val(items.msgCode);
                    //控制按钮  倒计时显示
                    codetime = items.effectiveTime;
                    showContent.timeinterval = setInterval(function() {
                        $.kingdom.ls.set('codetime', codetime);
                        codetime = $.kingdom.ls.get('codetime');
                        leftcodetime(codetime);
                        codetime--;
                    }, 1000);
                } else {
                    toastr.error(data.bcjson.msg);
                }
            });
        };
        //恢复发送验证码按钮
        var leftcodetime = function(time) {
            if (time == 0 || time < 0) {
                $('#J_message_time').html("发送短信验证码");
                $('#J_message_time').removeClass('btn-gray').addClass('green');
                window.clearInterval(showContent.timeinterval);
                return;
            };
            $('#J_message_time').removeClass('green').addClass('btn-gray');
            $('#J_message_time').html(time + "s后重新发送");
        };
        //获取验证码图片
        var validateimg = function(value, element) {
            var result = false;
            kweb.kingdom.doKoauthAdminAPISync("bayconnect.superlop.set_check_base64_image_validcode", "v4.0", {
                "uniqueID": uniqueID,
                "inputValidecode": value
            }, function(data) {
                if (data.bcjson.flag == "1") {
                    result = true;
                } else {
                    result = false;
                }
            });
            return result;
        };

        return {
            //main function to initiate the module
            init: function() {
                handleLogin();
                // loadvalidateimg();
                // init background slide images
                $('.login-bg').backstretch(["assets/img/pages/login/bg1.jpg", "assets/img/pages/login/bg2.jpg", "assets/img/pages/login/bg3.jpg"], {
                    fade: 1500,
                    duration: 8000
                });
                //change img code
                $('.js-validation').click(function() {
                    // loadvalidateimg();
                });
            }
        };
    }();



    jQuery(document).ready(function() {
            //修改平台信息
        // $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_sys_platform_info", "v4.0", {}, data => {
        //     if(data.bcjson.flag == "1" && data.bcjson.items.length > 0) {
        //         let item = data.bcjson.items[0];
        //         let platformName = item.platformName ? item.platformName + " | 欢迎登录" : "";
        //         let loginImgPath = item.loginImgPath ? "/platformImg"+item.loginImgPath.replace(/\\/g,"/") : "";
        //         let iconImgPath = item.iconImgPath ? location.origin+"/platformImg"+item.iconImgPath.replace(/\\/g,"/") : "";
        //         let loginLogoPath = item.loginLogoPath ? "/platformImg"+item.loginLogoPath.replace(/\\/g,"/") : "";
        //         if(platformName) {$(document).attr("title",platformName)}
        //         if(loginImgPath) {$(".login-bj").css("background-image","url("+loginImgPath+")");}
        //         if(loginLogoPath) {$("#bgLogo").attr("src",loginLogoPath)}
        //         if(iconImgPath) {$("#logo").attr("href",iconImgPath)}
        //     }
        // })
        compareValideEnd();
        $.kingdom.recommendBrowser();
        Login.init();

        $("#login-username").focus();
        $("body").on("click", ".indexVersionTip", function() {
            $(".login-header").addClass('hide');
        });
        //低版本控制
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                $(".login-header").removeClass('hide');
            } else if (navigator.userAgent.indexOf("MSIE 7.0") > 0) {
                $(".login-header").removeClass('hide');
            } else if (navigator.userAgent.indexOf("MSIE 8.0") > 0) { //这里是重点，你懂的   && !window.innerWidth
                $(".login-header").removeClass('hide');
            } else if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
                alert("ie9");
            }
        }
    });


    function compareValideEnd(){
		/*
        kweb.kingdom.doKoauthAdminAPI("kingdom.krcs.get_auth_info", "v4.0", {
            }, function(data) {
                var items = data.bcjson.items;
                if (data.bcjson.flag == "1" && items && items.length>0) {
                    var valide_start_end = items[0].valide_start_end;
                    if(valide_start_end){
                        var valide_start_end1 = valide_start_end.substring(0,4)+'/'+valide_start_end.substring(4,6)+'/'+valide_start_end.substring(6,8);
                        var valide_start_end2 = valide_start_end.substring(0,4)+'-'+valide_start_end.substring(4,6)+'-'+valide_start_end.substring(6,8);
                        valide_start_end = new Date(valide_start_end1);
                        var currentDate =  new Date();
                        currentDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate());
                        var dates = (valide_start_end-currentDate)/86400000;
                        var title = '软件许可将于['+valide_start_end2+']到期，离软件许可到期还剩['+dates+']天。去<a href="/license.html" target="_blank" style="color:#29b2e6;">授权</>';
                        if(dates<=15 && dates>=0){
                            toastr.warning(title,'',{positionClass:'toast-top-right',timeOut:60000});
                        }else if(dates<0){
                            title = '软件许可已于['+valide_start_end2+']到期，请先更新软件许可。去<a href="/license.html" target="_blank" style="color:#29b2e6;">授权</>'
                            toastr.warning(title,'',{positionClass:'toast-top-right',timeOut:60000});
                        }
                    }
                } else {
                    toastr.warning(data.bcjson.msg,'',{positionClass:'toast-top-right',timeOut:60000});
                }
            }); */
    }
});