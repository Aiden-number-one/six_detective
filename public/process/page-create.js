define(function(require, exports, module) {
    require("js/base/base64");
    require("js/base/json2");
    require("js/base/md5");
    require("js/base/kjax.des");
    require("js/layouts/layout.min");
    require("js/layouts/demo.min");
    require("js/global/jquery.kingdom");
    require("js/global/kd.ui.plugin");
    require("js/global/handlebars.helper");
    require("js/global/handlebars.helper.common");
    //require("js/global/datatable");
    //require("plugins/datatables/plugins/bootstrap/datatables.bootstrap");
    require("plugins/counterup/jquery.waypoints.min");
    require("plugins/counterup/jquery.counterup.min");
    require("plugins/jquery.form");
    require("plugins/jquery.sortable");
    require("plugins/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.min");
    require("plugins/bootstrap-summernote/lang/summernote-zh-CN");
    require("plugins/jquery-validation/js/additional-methods");
    require("plugins/jquery-validation/js/localization/messages_zh.min");
    var showContent = {}
    var bms_kingt = require("js/global/ajaxdata");
    var theme = $.kingdom.kconfig().theme;
    var root = $.kingdom.kconfig().root;
    var apiname = require("js/global/api_name");
    var showContent = {};
    var pageId = '';
    var init = {
        load: function() {
            showContent._load(); //加载页面数据
        }
    };
    $(function() {
        $("body").delegate(".component", "form mousedown", function(md) {
            $(".popover").remove();
            md.preventDefault();
            var tops = [];
            var mouseX = md.pageX;
            var mouseY = md.pageY;
            var $temp = $($(this).find('.contet')[0]).clone().removeClass('hidden');
            var timeout;
            var $this = $(this);
            var type;

            var delayed = setTimeout(function() {
                //读取配置
                $("body").append($temp);
                $temp.css({
                    "position": "absolute",
                    "top": mouseY - ($temp.height() / 2) + "px",
                    "left": mouseX - ($temp.width() / 2) + "px",
                    "opacity": "0.9",
                    'cursor': "move"
                }).show()

                var half_box_height = ($temp.height() / 2);
                var half_box_width = ($temp.width() / 2);
                var $target = $("#target");
                var tar_pos = $target.offset();
                var $target_component = $("#target .groups");
                var num = $temp.attr("num")
                var newrow = $temp.attr("newrow")
                    //

                $(document).delegate("body", "mousemove", function(mm) {

                    var mm_mouseX = mm.pageX;
                    var mm_mouseY = mm.pageY;
                    $temp.css({
                        "top": mm_mouseY - half_box_height + "px",
                        "left": mm_mouseX - half_box_width + "px",
                        "cursor": "move"

                    });
                    console.log(mm_mouseX + "----" + tar_pos.left + "---------")
                    if (mm_mouseX > tar_pos.left &&
                        mm_mouseX < tar_pos.left + $target.width() + $temp.width() / 2 &&
                        mm_mouseY > tar_pos.top &&
                        mm_mouseY < tar_pos.top + $target.height() + $temp.height() / 2
                    ) {
                        $target_component.find('.content').css({
                            "border": "1px dashed red"
                        });
                        tops = $.grep($target_component, function(e) {
                            return (mm_mouseY - $(e).offset().top > 0 && mm_mouseX - $(e).offset().left && mm_mouseY - $(e).offset().top - $(e).height() < 0 && mm_mouseX - $(e).offset().left - $(e).width() < 0);
                        });

                        if (tops.length > 0) {
                            $($target_component).removeClass('checked');
                            $($target_component).find(".content").css("background-color", "")
                            if ($temp.attr("newrow") !== "y") {
                                $(tops[0]).addClass('checked');
                                $($(tops[0]).nextAll().slice(0, parseInt(num) - 1)).addClass('checked');
                                $(tops[0]).find('.content').css("background-color", "navajowhite")
                                $($(tops[0]).nextAll().slice(0, parseInt(num) - 1)).find('.content').css("background-color", "navajowhite")
                            } else {
                                if ($(tops[0]).offset().left > 940) {
                                    //改变指针样式
                                    $temp.css({
                                        "cursor": "not-allowed"
                                    });
                                    $($target_component).removeClass('checked');
                                    $($target_component).find('.content').css("background-color", "");
                                } else {
                                    $(tops[0]).addClass('checked');
                                    $(tops[0]).find('.content').css("background-color", "navajowhite")
                                    $($(tops[0]).nextAll().slice(0, parseInt(num) - 1)).addClass('checked');
                                    $($(tops[0]).nextAll().slice(0, parseInt(num) - 1)).find('.content').css("background-color", "navajowhite")
                                }
                            }
                        } else {
                            if ($target_component.length > 0) {
                                $($target_component).removeClass('checked');
                                $($target_component).find('.content').css("background-color", "");
                            }
                        }
                    } else {
                        $($target_component).removeClass('checked');
                        $($target_component).find('.content').css({
                            "border": "",
                            "background-color": ""
                        });
                    }
                });
                $("body").delegate(".contet", "mouseup", function(mu) {
                    mu.preventDefault();
                    var mu_mouseX = mu.pageX;
                    var mu_mouseY = mu.pageY;
                    var tar_pos = $target.offset();
                    $($target_component).find('.content').css({
                        "border": "",
                        "background-color": ""
                    });
                    // acting only if mouse is in right place
                    if (mu_mouseX > tar_pos.left &&
                        mu_mouseX < tar_pos.left + $target.width() + $temp.width() / 2 &&
                        mu_mouseY > tar_pos.top &&
                        mu_mouseY < tar_pos.top + $target.height() + $temp.height() / 2
                    ) {
                        //添加
                        $($(".checked")[0]).replaceWith($temp.html());
                        $(".checked").remove();
                    }

                    //clean up & add popover
                    $('[data-toggle="popover"]').popover();
                    $(document).undelegate("body", "mousemove");
                    $("body").undelegate(".contet", "mouseup");
                    $temp.remove();
                });
            }, 0);

            $(document).mouseup(function() {
                clearInterval(delayed);
                return false;
            });
            $(this).mouseout(function() {
                clearInterval(delayed);
                return false;
            });
        });
        $('body').on("click", "#build button[name=open]", function(e) {
            e.preventDefault();
            //OK
            var form = $(this).parents("form");
            var data = $(form).serializeArray();
            var params = {}
            var isCheck = true;
            var error;
            $.each(data, function(i, item) {
                if (item.value) {
                    if (item.name == 'name') {
                        item.value = 'key_' + item.value;
                    }
                    params[item.name] = item.value;
                } else {
                    isCheck = false;
                    error = $(form).find('[name=' + item.name + ']').parent().prev().html() + "不能为空"
                    return false;
                }
            })
            if (!isCheck) {
                alert(error);
                return false;
            }
            //获取组件类型
            var type = $(this).parents('.popover').prev().attr('types');
            params = pluginUpdata[type](params, form);
            $(this).parents('.popover').prev().attr("form-data", JSON.stringify(params));
            $(this).parents('.popover').prev().popover('hide');
            if ($(form).find('input[name=title]').val()) {
                $(this).parents('.popover').prev().find('label').html(($(form).find('input[name=title]').val()))
            }
        })
        $('body').on("click", "#build button[name=close]", function(e) {
            e.preventDefault();
            $(this).parents('.popover').prev().popover('hide');
        })
        $('body').on("click", "#build .form-group", function(e) {
                e.preventDefault();
                var data = $(this).attr('form-data');
                if (data && $(this).next().hasClass('popover')) {
                    data = JSON.parse(data);
                    var popover = $(this).next();
                    $.each(data, function(name, item) {
                        if (name.indexOf('checked') > -1) {
                            if (item == 1) {
                                $(popover).find("[name=" + name + "][value=" + item + "]").prop('checked', 'checked');
                            } else {
                                $(popover).find("[name=" + name + "]").prop('checked', "");
                            }
                        } else {
                            if (name == 'name') {
                                item = item.split("_")[1];
                            }
                            $(popover).find("[name=" + name + "]").val(item);
                        }
                    });
                }
            })
            //保存
        $('body').on("click", "#saveviewBt", function(e) {
            e.preventDefault();
            $("#add-pageEdit").modal("show");
        })
        $('body').on("click", "#saveview", function(e) {
                e.preventDefault();
                if ($('#pe-addmodalForm').validate().form()) {
                    //解析
                    var formGroup = $('#build .form-group');
                    var jointList = [];
                    $.each(formGroup, function() {
                        var joint = {};
                        //
                        joint['html'] = encodeURIComponent($(this).clone().removeAttr('data-toggle data-content data-original-title data-placement data-html aria-describedby form-data').prop('outerHTML'));
                        joint['type'] = $(this).attr('types');
                        var data = JSON.parse($(this).attr("form-data"));
                        joint[joint['type']] = data;
                        jointList.push(joint);
                    });
                    $("#add-pageEdit").modal("hide");
                    var params = {};
                    params.pageName = $("#pe-addmodalForm input[name=pagename]").val();

                    params.pageContent = JSON.stringify(jointList);
                    showContent.savaPage(params);
                }
            })
            //添加栅格
        $('body').on("click", "#addgrop", function(e) {
                e.preventDefault();
                $("#build .form-horizontal").append('<div class="col-xs-6 groups"><div class="content"></div></div>');
                alert('添加成功');
            })
            //删除组件
        $('body').on("click", "#build .form-group button", function(e) {
                e.stopPropagation();
                $(this).parents(".form-group").next().remove()
                $(this).parents(".form-group").remove();
            })
            //各种组件保存个性化的数据
        var pluginUpdata = {
            input: function(params) {
                //是否必填
                if (!params['checked_isnull']) {
                    params['checked_isnull'] = '0';
                }
                //是否可编辑
                if (!params['checked_isdisabled']) {
                    params['checked_isdisabled'] = '0';
                }
                return params;
            },
            textarea: function(params) {
                //是否必填
                if (!params['checked_isnull']) {
                    params['checked_isnull'] = '0';
                }
                //是否可编辑
                if (!params['checked_isdisabled']) {
                    params['checked_isdisabled'] = '0';
                }
                return params;
            },
            select: function(params) {
                //是否必填
                if (!params['checked_isnull']) {
                    params['checked_isnull'] = '0';
                }
                //是否可编辑
                if (!params['checked_isdisabled']) {
                    params['checked_isdisabled'] = '0';
                }
                return params;
            },
            date: function(params) {
                //是否必填
                if (!params['checked_isnull']) {
                    params['checked_isnull'] = '0';
                }
                //是否可编辑
                if (!params['checked_isdisabled']) {
                    params['checked_isdisabled'] = '0';
                }
                //时间组件是否有默认日期
                if (!params['checked_istoday']) {
                    params['checked_istoday'] = '0';
                }
                return params;
            },
            explain: function(params, form) {
                $(form).parents('.popover').prev().find('legend').html(params.content);
                return params;
            }
        }

    });
    showContent._load = function() {
        ////表单验证
        $('#pe-addmodalForm').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                pagename: {
                    required: true,
                    minlength: 2,
                    maxlength: 16
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
            submitHandler: function(form) {}
        });
    };
    showContent.savaPage = function(params) {
        if (pageId) {
            params.pageId = params;
        }
        $.kingdom.doKoauthAdminAPI("kingdom.kbpm.set_kifp_user_defined_page", "v1.0", params, function(data) {
            App.unblockUI();
            if (data.kdjson.flag == 1) {
                toastr.success(data.kdjson.msg);
            } else {
                toastr.error(data.kdjson.msg);
            }
        })
    }
    showContent.getPageContent = function(pageid) {
        $.kingdom.doKoauthAdminAPI("kingdom.kbpm.get_kifp_user_defined_page_detail", "v1.0", {
            pageId: pageid
        }, function(data) {
            if (data.kdjson.items) {
                //处理返回数据
                data = JSON.parse(data.kdjson.items[0].pagecontent);
                var roucont = 0;
                $("#build .form-horizontal").html("");
                $.each(data, function() {
                    var type = this.type;
                    var html = $(".component div[types=" + type + "]").clone();
                    var title = this[type].title;
                    $(html).find(".row label").html(this[type].title);
                    $(html).attr("form-data", JSON.stringify(this[type]));
                    $("#build .form-horizontal").append(html);
                })
            } else {
                toastr.error(data.kdjson.msg + "未查询到该条记录详情");
            }
        })
    }
    init.load();
    module.exports = init;
});