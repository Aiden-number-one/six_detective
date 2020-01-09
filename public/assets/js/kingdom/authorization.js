define(function (require, exports, module) {

    //"klogin","bootstrap","cookie","blockui","uniform","switch","toastr","plugins/jquery-validation/js/jquery.validate.min","app",

    require("cookie");
    require("blockui");
    require("uniform");
    require("switch");
    require("toastr");

    require("plugins/jquery-validation/js/jquery.validate");
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

    // var kweb = require("js/kingdom");

    $(function () {
        //在进行dom操作的时候，务必指定dom的唯一class标识
        //   点立即授权
        $("body").on("click", "#J_authorization_sys_platform_save", function () {
            if ($("#J_authorization_platform_date [name=file]").val() === "") {
                toastr.info("Please select a file");
                return;
            }
            var desPassword = $.des.getDes($("#J_authorization_platform_date input[name='passWord']").val());
            $("#J_authorization_platform_date input[name='passWord']").val(desPassword);
            if ($('#J_authorization_platform_date').validate().form()) {
                $.kingdom.uploadWithApi("J_authorization_platform_date", "update_auth_info", function (data) {
                    if (data.bcjson.flag == "1") {
                        $("#J_authorization_upload_modal").modal("hide");
                        toastr.success(data.bcjson.msg);
                        getAuthorizationTime(); //更新获取授权日期
                        $("#authorization_reset").click();
                    } else {
                        if (data.bcjson.msg === "非法拷贝") {
                            data.bcjson.msg = "无效的授权信息";
                        }
                        toastr.error(data.bcjson.msg);
                    }
                });
            }
        });
        // 获取授权到期日期
        (getAuthorizationTime = function getAuthorizationTime() {
            var options = {
                url: window.location.origin + "/retl/rest/admin/v4.0/bayconnect.superlop.get_auth_info.json",
                type: "POST",
                dataType: "json",
                success: function success(data) {
                    if (data.bcjson.flag == "1" && data.bcjson.items) {
                        if (data.bcjson.items.length > 0) {
                            var item = data.bcjson.items[0];
                            var date = item.date.substring(0, 4) + "-" + item.date.substring(4, 6) + "-" + item.date.substring(6, 8);
                            $("#J_authorization_platform_date #authorization_date").val(date);
                        }
                    }
                },
                error: function error(e) {
                    toastr.error(e.bcjson.msg);
                }
            };
            $("#login_authorization_date").ajaxSubmit(options);
        })();
        (function checkForm() {
            $('#J_authorization_platform_date').validate({
                debug: true,
                errorElement: 'span', //default input error message container
                errorClass: 'help-block', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    date: {},
                    userName: {
                        required: true,
                        maxlength: 50
                    },
                    passWord: {
                        required: true,
                        maxlength: 50
                    }
                },
                invalidHandler: function invalidHandler(event, validator) {//display error alert on form submit
                    // $('.alert-danger', $('.login-form')).show();
                },
                highlight: function highlight(element) {
                    // hightlight error inputs
                    $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
                },
                success: function success(label) {
                    label.closest('.form-group').removeClass('has-error');
                    label.remove();
                },
                errorPlacement: function errorPlacement(error, element) {
                    error.insertAfter(element);
                },
                submitHandler: function submitHandler(form) {}
            });
        })();
    });
});