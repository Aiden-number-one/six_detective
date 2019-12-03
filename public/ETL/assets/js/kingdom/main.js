define(function(require, exports, module) {

    window.App = require("app");
    var kweb = require("./kweb");
    require("js/layouts/layout.min");
    require("js/layouts/demo.min");
    require("plugins/jquery-validation/js/jquery.validate");
    require("plugins/jquery-validation/js/additional-methods.js");
    require("plugins/jquery-validation/js/localization/messages_zh.min.js");
    require("plugins/fullcalendar/fullcalendar");
	require("plugins/fullcalendar/lib/moment.min");
    require("plugins/fullcalendar/lang/zh-cn");
    require("assets/plugins/colresizable/colResizable-1.6");

    var breadcrumb = [];

    var theme = kweb.kingdom.kconfig().theme;
    var root = kweb.kingdom.kconfig().root;

    var currentPage = "";

    if ($.kingdom.kconfig().developer) {
        console.log = function() {};
    }

    /**页面跳转**/
    var jumpToLink = function(link, tag) {
        //首页
        if (!link) {
            link = "index"
        }
        //同步修改地址栏
        // if (!link == "common-page") {
        if (history.pushState) {
            if (!link == "common-page") {
                history.pushState("", "", "index.html#" + link);
            } else if (link == "index") {
                history.pushState("", "", "index.html");
            }
        }
        // }
        // history.pushState("","","index.html#"+link);
        //清除页面加载效果
        $(".loading").remove();
        $("#js_page_row,#index_page").hide();
        $(".page-container").show();
        //var root = "applications/"+theme+"/";
        var folder = ""; //文件夹名称
        var file = "";
        //外链二级页面

        if (link.indexOf("common-page") > -1 && !tag) {
            //解析link
            folder = "common-page";
            var params = link.substr(link.indexOf("?") + 1, link.length);
            params = params.split("&");
            var paramstr = "{";
            for (var i = 0; i < params.length; i++) {
                var parm = params[i].split("=");

                if (parm[0] == "page") {
                    file = parm[1];
                } else {
                    paramstr += '"' + parm[0] + '":"' + parm[1] + '",';
                }

            }
            paramstr = paramstr.substr(0, paramstr.length - 1);
            paramstr += "}";
            paramstr = JSON.parse(paramstr);
            $("#local-data").data("params", paramstr); //处理传入参数
            // $(".sidebar-toggler").click();
        } else {
            folder = link.replace("#", "")
            file = tag ? tag : folder; //文件名称
        }
        var page = root + folder + "/" + file;
        var t = (new Date).getTime();
        $.ajax({
            url: page + ".html",
            dataType: "html",
            beforeSend: function() {
                App.blockUI({
                    target: ".page-content",
                    overlayColor: 'none',
                    cenrerY: true,
                    animate: true
                });
            },
            success: function(data) {
                window.x_trace_page_id = $.kingdom.uuid()
                if (data.match("<!DOCTYPE html>") == null) {
                    if (link.indexOf("common-page") > -1) {
                        $(".margin-top-20").fadeOut();
                        $("#js_page_common").html(data);
                        $("#js_page_common").removeAttr("class").addClass("margin-top-20 page-" + folder + ' ' + 'page-common-' + file);
                        $("#js_page_common").fadeIn();
                        //数据加载初始化

                    } else {
                        $("#js_page_common").hide();
                        $(".margin-top-20").hide();
                        $(".page-tabs-content a").removeClass("active");
                        if ($(".page-tabs-content a[data-titleId='" + folder + "']").length > 0) {
                            $(".page-tabs-content a[data-titleId='" + folder + "']").addClass("active");
                            $("#" + folder + "").show();
                        } else if (link == "index") {
                            $(".page-tabs-content a").eq(0).addClass("active");
                            // $(".page-tabs-content a").eq(0).data("titleid","#");
                            $("#js_page_row").removeAttr("class").addClass("margin-top-20 page-" + folder).html(data).show();
                        } else if ($(".page-tabs-content a[data-titleId='" + folder + "']").length === 0) {
                            var menueName = $("a[href=#" + link + "] span").html();
                            if (link == "indexInformation") {
                                menueName = "信息统计";
                            }
                            $(".page-tabs-content").append('<a href="javascript:;" class="active J_menuTab" data-titleId="' + folder + '">' + menueName + ' <i class="fa fa-times-circle"></i></a>');
                            $(".page-content").append('<div id="' + folder + '" class="margin-top-20 J_htmlTab page-' + folder + '" style="display:none;"></div>');
                            $("#" + folder + "").html(data).show();
                        }
                        mobilePhone();
                        App.runResizeHandlers();

                    } //require.async(page + ".js?t=" + t);

                    require.async(page + ".js", function(b) {
                        if (b && b.load) {
                            b.load();
                            slideToggle(".page-" + folder);
                            slideToggleTreeCommon(".page-" + folder);
                            // initDragTable(); // 初始化拖拽表格
                            $(`.page-${folder} .table`).colResizable({
                                liveDrag: true,
                                draggingClass: "dragging",
                                resizeMode: "flex"
                            });
                        }

                    });
                    rewriteBreadcrumb();
                } else {
                    toastr.info("请刷新当前页面重新登录。", "登录失效！");
                }
            },
            error: function() {
                var html = '<div class="row"><div class="col-md-12 page-404"><div class="number font-red"> 404 </div><div class="details"><h3>啊唷，您要找的页面发生了意外。</h3><p>我们无法找到这个页面。<br/><p><a href="" class="btn red btn-outline"> 刷新试试 </a> 或<a href="index.html" class="btn red btn-outline"> 返回首页 </a><br> </p></div></div></div>';
                if (link == "common-page") {
                    $("#js_page_common").removeAttr("class").addClass("margin-top-20 page-" + folder).html(html).show();
                } else {
                    $("#js_page_row").removeAttr("class").addClass("margin-top-20 page-" + folder).html(html).show();
                }
            },
            complete: function() {
                App.unblockUI(".page-content");
            }
        });
    };
    var rewriteBreadcrumb = function(link) {
        $(".page-breadcrumb").empty();
        $(".page-breadcrumb").append('<li><a href="index.html" style="color: #0C95E8;">主页</a></li>');
        $(".active.open>a .title").each(function(i, item) {
            breadcrumb[i] = $(item).html();
            $(".page-breadcrumb").append('<li><i class="fa fa-angle-right"></i><span></span></li>');
            $(".page-breadcrumb li").eq(i + 1).find("span").html($(item).html());
        });
        //$(".page-title").html(breadcrumb[0] + "  <small>" + breadcrumb[1] + "</small>");.
        //$(".caption-subject").html(breadcrumb[1]);
    };

    // 恢复出厂设置
    var reset = function(link) {
        kweb.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_sys_config_clear", "v4.0", {}, function(data) {
            if (data.bcjson.flag == '1') {
                toastr.success(data.bcjson.msg);
            } else {
                toastr.error(data.bcjson.msg);
            }
            App.unblockUI();
        });
    }

    var createMenu = function(cbfunc) {
        var api_params = {
            //"platform_theme": theme
            endType: '1'
        }
        // App.blockUI({
        //     target: '.page-sidebar-refresh',
        //     overlayColor: 'none',
        //     cenrerY: true,
        //     animate: true,
        // });

        kweb.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_dis_employee_menu", "v4.0", api_params, function(data) {
            // var html = "";
            // if (data.bcjson.flag != 1) {
            //     window.location.href = "/login.html";
            // }
            // // 生成树状结构
            // //  var result = $.kingdom.generateTree(data.bcjson.items, "menuid", "parentmenuid", "children", "menuid", "asc");
            // var result = $.kingdom.generateMenuTree(data.bcjson.items, "menuid", "parentmenuid", "children");

            // $.each(result, function(i, n) {
            //     var child = n.children;
            //     html += '<li class="nav-item">';
            //     if (n.page) {
            //         html += '<a href="#' + n.page.split("#")[1] + '" menuId="' + n.menuid + '" class="nav-link nav-toggle">' + '<i class="' + n.icon + '"></i>' + '<span class="title">' + n.menuname + '</span>';
            //     } else {
            //         html += '<a href="javascript:;" class="nav-link nav-toggle">' + '<i class="' + n.icon + '"></i>' + '<span class="title">' + n.menuname + '</span>';
            //     }
            //     if (child && child.length > 0) {
            //         html += '<span class="arrow"></span></a><ul class="sub-menu">';
            //         $.each(child, function(ci, cn) { //'+cn.page.split("#")[1]+'
            //             var nchild = cn.children;
            //             html += menu(cn);
            //         });
            //         html += '</ul>';
            //     } else {
            //         html += "</a>";
            //     };
            //     html += '</li>';
            // });
            // App.unblockUI('.page-sidebar-refresh');
            // $(".page-sidebar-refresh").hide();
            // $(".page-sidebar-menu").html(html);
            // $(".page-sidebar-menu.page-sidebar-menu-hover-submenu>li:last > .sub-menu").css({ bottom: "0" }); // 最后一个超出底部
            // if (cbfunc) {
            //     cbfunc();
            // }
            // if ($.cookie("class")) {
            //     $("." + $.cookie("class")).click();
            // } else {
            //     $("#menu_list>li:eq('0')>a[name='first_menu']").click();
            // }
        })

    };
    var menu = function(cn) {
        var html = "";
        var nchild = cn.children;
        html += '<li class="nav-item">';
        if (nchild && nchild.length > 0) {
            html += '<a href="javascript:;" class="nav-link nav-toggle"><span class="title">' + cn.menuname + '</span><span class="arrow"></span></a><ul class="sub-menu">';
            $.each(nchild, function(cci, ccn) {
                //html += '<li class="nav-item"><a href="#' + ccn.page.split("#")[1] + '" class="nav-link "><span class="title">' + ccn.menuname + '</span></a></li>'
                html += menu(ccn);
            });
            html += "</ul>"
        } else {
            html += '<a href="#' + cn.page.split("#")[1] + '" menuId="' + cn.menuid + '" class="nav-link "><span class="title">' + cn.menuname + '</span></a>';
        };
        html += '</li>';
        return html
    };

    var fixSidebar = function() {
        $("body").addClass("page-sidebar-fixed");
        $("page-sidebar-menu").addClass("page-sidebar-menu-fixed");
        $("page-sidebar-menu").removeClass("page-sidebar-menu-default");
        Layout.initFixedSidebar();
        Layout.initFixedSidebarHoverEffect(); //
    };
    // 高亮导航栏
    var refreshSidebar = function(link) {
        var _navitem = $("li.nav-item");
        var _navitemLink = $("li.nav-item a");
        var _curNavitemLink = $("li.nav-item a[href=#" + link + "]");
        if ((link) || (link == "")) {
            if (_curNavitemLink && _curNavitemLink.length) {
                _navitem.removeClass("active open");
                _navitem.find(".arrow").removeClass("active open");
                _navitem.find(".selected").remove();
                // _navitem.find(".sub-menu").hide();
                if (_curNavitemLink.length == 2) {
                    _curNavitemLink.eq(1).parents(".nav-item").addClass("active open");
                } else {
                    _curNavitemLink.eq(0).parents(".nav-item").addClass("active open");
                }
                // _curNavitemLink.eq(0).parents(".sub-menu").show();
                // $("#menu_list ul").css("style","display:none");
                _curNavitemLink.eq(0).parents(".nav-item").children(".nav-toggle").append("<span class='selected'></span>");
                _curNavitemLink.eq(0).parents(".nav-item").children(".nav-link").find(".arrow").addClass("open");
            } else {
                //toastr.error("找不到该页面！", "404");
            }
        }

    };
    var init = function() {
        //初始化a标签跳转
        $("body").on("click", "[data-toggle='link']", function() {
            var href = $(this).attr("href").split("#")[1];
            $("#local-data").data("params", $(this).data("params")); //处理传入参数
            $("#local-data").data("source", $(this).data("source"));
            if (href == "common-page") { //如果是通用页面的话直接跳转至指定页面
                var linkto = $(this).data("linkto");
                jumpToLink(href, linkto);
                return false;
            };
        });
        //返回列表页
        $("body").on("click", ".js-backtolist", function() {
            if (location.href.indexOf("?page") > -1) {
                window.close();
            } else {
                $("#js_page_common").fadeOut();
                var pageId = location.hash;
                $(pageId).fadeIn();
                if ($(this).is("[refresh]")) {
                    jumpToLink($(".J_menuTab.active").data("titleid"));
                }
            }
        });
        window.util = {};
        // 高亮左边导航栏
        window.util.highlightNav = refreshSidebar;
        //初始化toastr提示框
        toastr.options.closeButton = true;
        toastr.options.setTimeout = "500";
        toastr.options.positionClass = "toast-top-center";
        //初始化bootbox提示框
        bootbox.setDefaults({
            title: "提示",
            locale: 'zh_CN'
        });
        //退出系统操作
        $("#js-logout1").click(function() {
            var _this = $(this);
            bootbox.confirm("确定退出当前系统吗？", function(result) {
                if (result) {
                    $.kingdom.logout(function(data) {
                        App.blockUI({
                            boxed: true,
                            message: "正在退出"
                        });
                        if (data.bcjson.flag == 1) {
                            window.setTimeout(function() {
                                App.unblockUI();
                                // window.location.href = _this.data("link");
                                window.location.href = "/login.html";
                            }, 1000);
                        } else {
                            App.unblockUI();
                            toastr.success(data.bcjson.msg);
                        }
                    });
                }
            })
        });
        // if (window.applicationCache) {
            $(window).bind('hashchange', function() {
                var link = window.location.hash.substr(1);
                if(location.hash!=="#report-table-info-manage"){
                    let oldHref = location.href;
                 let newHref = oldHref.replace(location.search,"");
                   window.location.href=newHref;
                }

                if (link.indexOf("?") > -1) {
                    link = link.substring(0, link.indexOf("?"));
                }
                currentPage = link
                jumpToLink(link);
                refreshSidebar(link); //更新导航
            });
        // } else {
            $('body').on('click', '.nav-link', function() {
                const _this = $(this);
                const href = _this.attr("href");
                const isSameHash = location.hash === href;
                if (href.indexOf("#") > -1 && isSameHash) {
                    const link = href.replace("#", "");
                    currentPage = link;
                    jumpToLink(link);
                    refreshSidebar(link); //更新导航
                }
            });
        // }
    };
    //手机兼容性调整
    var mobilePhone = function() {
        //导航栏图标隐藏
        var userAgent = navigator.userAgent.toLowerCase();
        //移动设备
        if (userAgent.indexOf("ipad") > -1 || userAgent.indexOf("iphone") > -1 || userAgent.indexOf("android") > -1 || userAgent.indexOf("Android") > -1 || userAgent.indexOf("iPhone") > -1) {
            $("#head-navBtn").find("span").hide();
            $("#head-navBtn").find("span").hide();
            var aList = $(".tourist-wide a");
            aList.each(function() {
                var i = $(this).find("i");
                $(this).html(i);

            })
        } else {
            //PC
            var winWidth;
            if (window.innerWidth)
                winWidth = window.innerWidth;
            else if ((document.body) && (document.body.clientWidth))
                winWidth = document.body.clientWidth;
            if (winWidth < 800) {
                $("#head-navBtn").find("span").hide();
                var aList = $(".tourist-wide a");
                /* aList.each(function() {
                     var i = $(this).find("i");
                     $(this).html(i);

                 })*/
            } else {
                $("#head-navBtn").find("span").show();
            }
            $(window).resize(function() {
                var width = $(this).width();
                if (width < 800) {
                    $("#head-navBtn").find("span").hide();
                    $("#head-navBtn").find("span").hide();
                    /*  var aList = $(".tourist-wide a");
                      aList.each(function() {
                          var i = $(this).find("i");
                          $(this).html(i);

                      })*/
                } else {
                    $("#head-navBtn").find("span").show();
                }
            });

        }
    }

    //修改密码
    var setDistributorLoginPwd1 = function(params) {
        $.kingdom.doKoauthAdminAPI("bayconnect.superlop.update_dis_employee_pwd", "v4.0", params, function(data) {
            App.unblockUI();
            var items = data.bcjson;
            if (items.flag == "0") {
                toastr.error(items.msg);
            } else {
                toastr.success(items.msg);
                $(".page-common-page .reset").click();
            }
        })
    };




    var handleLogin = function() {
        $('#submit_form1').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true,
                    passwodCheck: $("#submit_form1 input[name='password']").val()
                },
                loginPwd: {
                    required: true,
                    equalTo: "#password"
                }
            },
            messages: {
                password: {
                    required: "密码不能为空",
                    rangelength: "6-16位字符（中文占两个字符），至少包含数字、字母(区分大小写)"
                },
                confirmpassword: {
                    required: "密码不能为空",
                    equalTo: "两次输入密码不一致"
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
            }
        });
    };
    var slideToggle = function(page) {
        if ($(page + " .slide-toggle").length === 0) {
            return;
        }
        const FULL_WIDTH = $("body").width();
        const L_WIDTH = $(page + " .left-side").width();
        const S_WIDTH = $(".page-logo").outerWidth();
        const LEFT = $(page + " .slide-toggle").position().left;
        $(page + " .right-content").css("width", `calc(100% - ${L_WIDTH + 10}px)`);
        // 隐藏左侧栏
        $(page + " .slide-toggle").click(function() {
            if ($(this).find(".fa-angle-left").length > 0) {
                $(this).siblings(".left-side").width(0);
                $(this).css({ left: 0 });
                $(this).siblings(".right-content").css("width", "100%");
                $(this).html(`<i class="slide-icon fa fa-angle-right"></i>`);
            } else {
                $(this).siblings(".left-side").width(L_WIDTH);
                $(this).css({ left: LEFT });
                $(this).siblings(".right-content").css("width", `calc(100% - ${L_WIDTH + 10}px)`);
                $(this).html(`<i class="slide-icon fa fa-angle-left"></i>`);
            }
        });
    }
        
/**
     * @description: 此为使用treeCommon.js的树slide函数
     * @param {type} 
     * @return: 
     * @Author: xiaojun
     * @Date: 2019-06-25 15:15:33
     */    
    var slideToggleTreeCommon = function(page) {
        if ($(page + " .slide-toggle1").length === 0) {
            return;
        }
        const L_WIDTH =  $(page + " .left-side").width()
        // const FULL_WIDTH = $("body").width(); 
        // var  L_WIDTH ;
        // var S_WIDTH ;
        // var S_WIDTH = $(".page-logo").outerWidth();
        $(page + " .right-content").css("width", `calc(100% - ${L_WIDTH + 10}px)`);
        const LEFT = $(page + " .drag_bar").position().left;
        // $(".slide-toggle1").css("left",LEFT-20);
        // 隐藏左侧栏
        $(page).on('click', ".slide-toggle1", function() {
            if ($(this).find(".fa-angle-left").length > 0) {
                $(".drag_bar").siblings(".left-side").width(0);
                $(".drag_bar").css({ left: 0 });
                $(".drag_bar").siblings(".right-content").css("width", "100%");
                $(this).html(`<i class="slide-icon fa fa-angle-right"></i>`);
                $(this).css({left:0});
            } else {
                $(".drag_bar").siblings(".left-side").width(L_WIDTH);
                $(".drag_bar").css({ left: LEFT });
                $(this).css("left",LEFT-20);
                $(".drag_bar").siblings(".right-content").css("width", `calc(100% - ${L_WIDTH + 10}px)`);
                $(this).html(`<i class="slide-icon fa fa-angle-left"></i>`);
            }
        });


    }

    

    function initDragTable() {
        $(".table thead th").each(function() {
            if ($(this).find('.movableLine')) {
                $(this).append(`<div class="movableLine"></div>`);
            }
        })
    
        $('body').on('mousedown',".movableLine", function(e) {
          let clientXBefore = e.clientX;
          const _this = this;
          $('body').mousemove(mouseMove);
          $('body').on('mouseup',".movableLine", onMouseUp);
    
          function mouseMove(e) {
            let clientX = e.clientX;
            $(_this).css("right", clientXBefore - clientX);
          }
    
          function onMouseUp(e) {
            $('body').unbind("mousemove", mouseMove);
            $('body').unbind("mouseup", onMouseUp);
            const width = $(this)
              .parent("th")
              .width();
            let clientX = e.clientX;
            const offsetX = clientXBefore - clientX;
            $(this)
              .parent("th")
              .width(width - offsetX);
            $(this).css("right", 0);
          }
        });

    }
    
    $(function() {
        var link = window.location.hash.substr(1).split("?")[0];
        jumpToLink(link);
        // 搜索条件显示隐藏
        $("body").on("click", "[data-toggle=collapse].collapse-control", function() {
            if ($(this).find(".fa-sort-desc").length > 0) {
                $(this).html(`<i class="fa fa-sort-asc"></i><span>${$.i18n.map['Collapse']}</span>`);
            } else {
                $(this).html(`<i class="fa fa-sort-desc"></i><span>${$.i18n.map['Search-More']}</span>`);
            }
        });
        $("body").on("click", "[data-toggle=collapse] span, [data-toggle=collapse] i", function(e) {
            e.stopPropagation();
            $(this).parent().click();
        });
        return;
        // handleLogin();
        // window.jumpToLink = jumpToLink;

        // //获取用户信息
        // kweb.kingdom.getLoginName(function(data) {
        //     if (data.bcjson.flag == "0") {
        //         window.location.href = "/login.html";
        //         return false;
        //     };
        //     var items = data.bcjson.items[0];
        //     $(".dropdown-user .username").text(items.login_name);
        //     kweb.kingdom.username = items.login_name;
        //     init();
        //     // 初始化导航
        //     // createMenu(function() { //回调函数，进行导航栏状态判断
        //     //     var _navitemLink = $();
        //     //     currentPage = link;
        //     //     // 跳转页面
        //     //     if (link != "") {
        //     //         // window.clearTimeout(intervalForReportTime1);
        //     //     }
        //     //     //fixSidebar(); //固定左边导航
        //     //     if (link.indexOf("common-page") == -1) {
        //     //         refreshSidebar(link); //更新导航
        //     //     }
        //     // });
        // });

        // // 触发校验 防止红色提示不消失
        // $("body").on("change", `.date-picker,.date-time-picker,select[data-select2-id]`, function() {
        //      $(this).closest("form").length > 0 && $(this).closest("form").validate().element(this);
        // });

        //  //修改平台信息
        // //  $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_sys_platform_info", "v4.0", {}, data => {
        // //     if(data.bcjson.flag == "1" && data.bcjson.items.length > 0){
        // //         let item = data.bcjson.items[0];
        // //         let platformName = item.platformName ? item.platformName : "";
        // //         let logoImgPath = item.logoImgPath ? "/platformImg"+item.logoImgPath.replace(/\\/g,"/") : "";
        // //         let iconImgPath = item.iconImgPath? location.origin+"/platformImg"+item.iconImgPath.replace(/\\/g,"/") : "";
        // //         if(platformName) {$(document).attr("title",platformName)}
        // //         if(logoImgPath) {$(".logo-default").attr("src",logoImgPath);}
        // //         if(iconImgPath) {$("#logo").attr("href",iconImgPath)}
        // //     }
        // // })

        // // 点击收起
        // $("body").on("click", ".sidebar-toggler", function() {
        //     let page = ".page-" + location.hash.substring("1");
        //     let width = $(page + " .right-content").width();
        //     const L_WIDTH = $(page + " .left-side").width();
        //     if ($(page + " .slide-toggle .fa-angle-left").length > 0) {
        //         $(page + " .right-content").css("width", `calc(100% - ${L_WIDTH + 9}px)`);
        //     } else {
        //         $(page + " .right-content").css("width", `calc(100% - ${L_WIDTH}px)`);
        //     }
        //     if ($(this).hasClass("close-flag")) {
        //         $(".page-sidebar-menu.page-sidebar-menu-hover-submenu>li:last > .sub-menu").css({ bottom: "0" }); // 最后一个超出底部
        //         $(this).removeClass("close-flag");
        //     } else {
        //         $(".page-sidebar-menu.page-sidebar-menu-hover-submenu>li:last > .sub-menu").css({ bottom: "auto" }); // 最后一个超出底部
        //         $(this).addClass("close-flag");
        //     }
        // });
        // $("body").on("mouseover", "#header_notification_bar", function() {
        //     $(this).addClass("open");
        // })
        // $("body").on("mouseout", "#header_notification_bar", function() {
        //     $(this).removeClass("open");
        // })
        // $("body").on("click", "#header_notification_bar a", function() {
        //     sessionStorage.setItem("isJump","1");
        //     window.open("/index.html#log-query");
        // })
        // //修改密码提交
        // $("body").on("click", "#save_updates", function() {
        //     var loginPwd = $("#submit_forms input[name=password]").val();
        //     if (!loginPwd) {
        //         toastr.options = {
        //             positionClass: "toast-top-center"
        //         };
        //         toastr.error("新密码不能为空！");
        //         return;
        //     }
        //     var loginPwdTwo = $("#submit_forms input[name=loginPwd]").val();
        //     if (loginPwdTwo != loginPwd) {
        //         toastr.options = {
        //             positionClass: "toast-top-center"
        //         };
        //         toastr.error("两次密码不一致！");
        //         return;
        //     }
        //     //
        //     var pattern = /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/;
        //     if (!pattern.test($("#submit_forms input[name=password]").val())) {
        //         toastr.options = {
        //             positionClass: "toast-top-center"
        //         };
        //         toastr.error("请输入6-16位字符（中文占两个字符），至少包含数字、字母(区分大小写)！");
        //         return;
        //     }
        //     var params = {};
        //     params.loginPwd = $("#loginPwd").val();
        //     params.loginPwd = $.des.getDes(params.loginPwd);
        //     params.memberId = sessionStorage.getItem("employeeId");
        //     setDistributorLoginPwd1(params);
        //     var loginPwd = $("#submit_forms input[name=password]").val("");
        //     var loginPwdTwo = $("#submit_forms input[name=loginPwd]").val("");
        //     $("#edit_user_passwords").modal('hide');
        // });
        // $("body").on("blur", "#submit_forms input[name=loginPwd]", function() {
        //     var loginPwd = $("#submit_forms input[name=password]").val();
        //     if (!loginPwd) {
        //         toastr.options = {
        //             positionClass: "toast-top-center"
        //         };
        //         toastr.error("新密码不能为空！");
        //         return;
        //     }
        //     var loginPwdTwo = $("#submit_forms input[name=loginPwd]").val();
        //     if (loginPwdTwo != loginPwd) {
        //         toastr.options = {
        //             positionClass: "toast-top-center"
        //         };
        //         toastr.error("两次密码不一致！");
        //         return;
        //     }
        // });
        // $("body").on("blur", "#submit_forms input[name=password]", function() {
        //     var password = $("#submit_forms input[name=password]").val();
        //     var pattern = /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/;
        //     if (password) {
        //         if (!pattern.test(password)) {
        //             toastr.options = {
        //                 positionClass: "toast-top-center"
        //             };
        //             toastr.error("请输入6-16位字符（中文占两个字符），至少包含数字、字母(区分大小写)！");
        //             return;
        //         }
        //     }
        // });

        // // 下拉树形控制
        // $("body").on("click", "[type=jstree], [type=treeselectchild], .jstree-ocl, .jstree-closed", function(e) {
        //     e.stopPropagation();
        // });
        // $("body").on("click", "[type=jstree] .jstree-anchor", function(e) {
        //     e.stopPropagation();
        //     $(this).parents("[type=jstree]").siblings("input[type=hidden]").val($(this).parent().attr("folderid"));
        //     $(this).parents("[type=jstree]").siblings(".dropdown-toggle").val($(this).text()).attr("aria-expanded", "false").parent().removeClass("open");
        // });
        // // 系统下拉框 问题优化，右侧下拉箭头 图标 点击无效
        // $("body").on("click", ".dropdown-toggle[name='folderName'][data-toggle=dropdown]+i", function(e) {
        //     e.stopPropagation();
        //     $(this).parent().toggleClass("open");
        // });
        // $("body").on("click", ".dropdown-toggle[name='jobName'][data-toggle=dropdown]+i", function(e) {
        //     e.stopPropagation();
        //     $(this).parent().toggleClass("open");
        // });
        // // 搜索条件显示隐藏
        // $("body").on("click", "[data-toggle=collapse].collapse-control", function() {
        //     if ($(this).find(".fa-sort-desc").length > 0) {
        //         $(this).html(`<i class="fa fa-sort-asc"></i><span>收起</span>`);
        //     } else {
        //         $(this).html(`<i class="fa fa-sort-desc"></i><span>高级搜索</span>`);
        //     }
        // });
        // $("body").on("click", "[data-toggle=collapse] span, [data-toggle=collapse] i", function(e) {
        //     e.stopPropagation();
        //     $(this).parent().click();
        // });


        // $("body").on('click', 'tbody tr .bootstrap-switch-label', function(e) {
        //     e.stopPropagation();
        // });

        // // 恢复出厂设置
        // $("body").on("click", "#J_reset_system", function() {
        //     bootbox.confirm('该操作将清除系统上的所有业务数据（转换任务、作业流程、调度计划），请先进入【系统管理】-【资料库导入/导出】<a href="#database-import" class="colored-blue">备份数据</a>。如您已备份数据，点击确认删除信息。', function(result) {
        //         if (result) {
        //             bootbox.confirm('执行此操作将清除所有业务数据，在未备份数据的情况下将无法恢复，确定继续进行此操作吗？', function(result) {
        //                 if (result) {
        //                     App.blockUI({
        //                         boxed: true,
        //                         message: "恢复出厂设置中..."
        //                     });
        //                     reset();
        //                 }
        //             })
        //         }
        //     });
        // });

        // //获取到当前时间
        // (function getCurrentTime() {
        //     function setDate(mseconds) {
        //         var time = new Date(mseconds);
        //         var year = time.getFullYear();
        //         var mouth = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
        //         var day = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
        //         var hours = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
        //         var minutes = time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
        //         var seconds = time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
        //         var accurate = year + "-" + mouth + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        //         var weekDay = time.getDay();
        //         var weekDayZn = "";
        //         switch (weekDay) {
        //             case 0:
        //                 weekDayZn = "星期天"
        //                 break;
        //             case 1:
        //                 weekDayZn = "星期一"
        //                 break;
        //             case 2:
        //                 weekDayZn = "星期二"
        //                 break;
        //             case 3:
        //                 weekDayZn = "星期三"
        //                 break;
        //             case 4:
        //                 weekDayZn = "星期四"
        //                 break;
        //             case 5:
        //                 weekDayZn = "星期五"
        //                 break;
        //             case 6:
        //                 weekDayZn = "星期六"
        //                 break;
        //             default:
        //                 break;
        //         }
        //         // $("#current-time-index").html('<i style="font-size: 19px;margin-right: 10px;color:#ff7d00;" class="fa fa-calendar-times-o"></i>' + accurate + "  " + weekDayZn)
        //         $("#current-time-index span").text(accurate + "  " + weekDayZn)
        //     }

        //     $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_sys_current_date", "v4.0", {}, function(data) {
        //         if (data.bcjson.flag === "1" && data.bcjson.items[0]) {
        //             var times = data.bcjson.items[0].currentDate;
        //             var startTime = $.kingdom.toStandardDateObj(times).getTime();
        //             setDate(startTime);
        //             setInterval(function() {
        //                 startTime = startTime + 1000;
        //                 setDate(startTime);
        //             }, 1000)
        //         }
        //     });

        // })();

        // //调度计划日历相关
        // (function getCalendar() {
        //     //保留当前当前搜索条件 及 当前event中的开始、结束时间及callback
        //     var eventScheduleId = "";
        //     var eventExecuteStatus = "";
        //     var eventStartTime = "";
        //     var eventEndTime = "";
        //     var eventCallback = "";
        //     var options = {
        //         header: {
        //             right: 'prev,next today',
        //             left: 'title',
        //             // right: ''
        //         },
        //         defaultDate: new Date().Format("yyyy-mm-dd"),
        //         monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        //         eventLimit: false, // allow "more" link when too many events
        //         eventStartEditable: true,
        //         editable: true,
        //         dayClick: function(date, jsEvent, view) {

        //             console.log('Clicked on: ' + date.format());

        //             console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);

        //             console.log('Current view: ' + view.name);
        //         },
        //         eventClick: function(event, jsEvent, view) {
        //             displayDetail(event);
        //         },
        //         eventMouseover: function(event, jsEvent, view) {
        //             $(this).find('.fc-title').attr('title', $(this).find('.fc-title').html());
        //         },
        //         eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
        //             // 拖动某个日程到新位置时，日程时间改变，此处可做相关处理
        //             console.log(event + dayDelta + minuteDelta + allDay + revertFunc + jsEvent + ui + view)
        //         },
        //         // events:JSON.parse(itemString)
        //         events: function(start, end, timezone, callback) {

        //             var startFomateDate = start._d.getFullYear().toString() +
        //                 ((start._d.getMonth() + 1) < 10 ? "0" + (start._d.getMonth() + 1) : (start._d.getMonth() + 1)) +
        //                 (start._d.getDate() < 10 ? "0" + (start._d.getDate()) : (start._d.getDate()));

        //             var endFomateDate = end._d.getFullYear().toString() +
        //                 ((end._d.getMonth() + 1) < 10 ? "0" + (end._d.getMonth() + 1) : (end._d.getMonth() + 1)) +
        //                 (end._d.getDate() < 10 ? "0" + (end._d.getDate()) : (end._d.getDate()));

        //             eventStartTime = startFomateDate;
        //             eventEndTime = endFomateDate;
        //             eventCallback = callback;

        //             var paramsMap = {};
        //             paramsMap.startTime = startFomateDate;
        //             paramsMap.endTime = endFomateDate;
        //             paramsMap.scheduleId = eventScheduleId
        //             paramsMap.executeFlag = eventExecuteStatus;

        //             requestScheduleCalendarInfo(paramsMap);
        //         }
        //     };

        //     function requestScheduleCalendarInfo(paramsMap, isSelect) {
        //         App.blockUI({
        //             boxed: true,
        //             message: "加载调度计划中..."
        //         });
        //         $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_schedule_calendar_info", "v4.0", paramsMap, function(data) {
        //             if (data.bcjson.flag === "1") {
        //                 var optionData = [];
        //                 var items = data.bcjson.items || [];
        //                 if (items.length > 0) {
        //                     $.each(items, function(i, value) {
        //                         var scheduleInfo = value.scheduleInfo;
        //                         if (scheduleInfo.length !== 0) {
        //                             var typeS = 0, arrayS = []; //成功执行
        //                             var typeF = 0, arrayF = []; //出错完成
        //                             var typeB = 0, arrayB = []; //出错中断
        //                             $.each(scheduleInfo, function(scheduleInfoIndex, singleValue) {
        //                                 if (singleValue['executeFlag'] == "B") {
        //                                     typeB++;
        //                                     arrayB.push(singleValue);
        //                                 } else if (singleValue['executeFlag'] == "F") {
        //                                     typeF++;
        //                                     arrayF.push(singleValue);
        //                                 } else if (singleValue['executeFlag'] == "S") {
        //                                     typeS++;
        //                                     arrayS.push(singleValue);
        //                                 }
        //                             });
        //                             if (typeS !== 0) {
        //                                 optionData.push({
        //                                     start: value.scheduleDate,
        //                                     end: value.scheduleDate,
        //                                     title: "成功完成(" + typeS + ")",
        //                                     currentAllData: arrayS,
        //                                     className: "success-complete"
        //                                 })
        //                             }
        //                             if (typeF !== 0) {
        //                                 optionData.push({
        //                                     start: value.scheduleDate,
        //                                     end: value.scheduleDate,
        //                                     title: "出错完成(" + typeF + ")",
        //                                     currentAllData: arrayF,
        //                                     className: "error-complete"
        //                                 })
        //                             }
        //                             if (typeB !== 0) {
        //                                 optionData.push({
        //                                     start: value.scheduleDate,
        //                                     end: value.scheduleDate,
        //                                     title: "出错中断(" + typeB + ")",
        //                                     currentAllData: arrayB,
        //                                     className: "error-suspend"

        //                                 })
        //                             }
        //                         }
        //                     });
        //                 }
        //             }
        //             if (isSelect) {
        //                 $('#modal-inside-calendar').fullCalendar('refetchEvents');
        //             } else {
        //                 eventCallback(optionData);
        //             }
        //             App.unblockUI();
        //         });
        //     }

        //     $('#J_calendar_modal').on('show.bs.modal', function() {

        //         getScheduleList();
        //         getExecuteFlag();

        //         $('#modal-inside-calendar').fullCalendar(options);
        //         setTimeout(function() {
        //             if ($("#J_calendar_modal .fc-view-container .fc-basic-view").length === 0) {
        //                 $("#J_calendar_modal .fc-today-button").click();
        //             }
        //         }, 200)
        //     });

        //     //点击搜索
        //     $("body").on("click", "#J_calendar_modal_search_form button[type='submit']", function() {
        //         //获取已经选取的调度计划，并存到公共中
        //         var scheduleId = "";
        //         $.each($("#schedule-list-menu-calendar .title-color-blue"), function(index, value) {
        //             scheduleId = scheduleId + $(value).attr("scheduleid") + ",";
        //         });
        //         if (!scheduleId) {
        //             scheduleId = scheduleId.substring(0, scheduleId.length - 1);
        //         }
        //         eventScheduleId = scheduleId;

        //         //获取已经选取的执行状态，并存到公共中
        //         var flagId = "";
        //         $.each($("#flag-list-menu-calendar .title-color-blue"), function(index, value) {
        //             flagId = flagId + $(value).attr("flagid") + ",";
        //         });
        //         if (flagId) {
        //             flagId = flagId.substring(0, flagId.length - 1);
        //         }
        //         eventExecuteStatus = flagId;
        //         var paramsMap = {
        //             startTime: eventStartTime,
        //             endTime: eventEndTime,
        //             scheduleId: eventScheduleId,
        //             executeFlag: eventExecuteStatus,
        //         };
        //         requestScheduleCalendarInfo(paramsMap, true);
        //     });

        //     //点击重置
        //     $("body").on("click", "#J_calendar_modal_search_form button[type='reset']", function() {
        //         $("#J_calendar_modal_search_form .dropdown-menu div").removeClass("title-color-blue");
        //     });

        //     function getScheduleList() {
        //         var paramsMap = { "pageNumber": "1", "pageSize": "999" };
        //         $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_schedule_info", "v4.0", paramsMap, function(data) {
        //             if (data.bcjson.flag === "1") {
        //                 var items = data.bcjson.items || [];
        //                 if (items.length > 0) {
        //                     var scheduleList = "";
        //                     $.each(items, function(index, value) {
        //                         scheduleList = scheduleList + "<div style='white-space:nowrap;padding: 8px 12px' scheduleId='" + value.scheduleId + "'>" + value.scheduleName + "</div>"
        //                     });
        //                     $("#schedule-list-menu-calendar").html(scheduleList);
        //                 }
        //             }
        //         });
        //     }

        //     function getExecuteFlag() {
        //         $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_dict_data_list", "v4.0", {}, function(data) {
        //             if (data.bcjson.flag === "1") {
        //                 var items = data.bcjson.items || [];
        //                 var EXECUTE_FLAG = items[0]['EXECUTE_FLAG'];
        //                 if (EXECUTE_FLAG) {
        //                     var flagList = "";
        //                     $.each(EXECUTE_FLAG, function(index, value) {
        //                         if (index === "B" || index === "F" || index == "S") {
        //                             flagList = flagList + "<div style='padding: 8px 12px' flagId='" + index + "'>" + value + "</div>"
        //                         }
        //                     });
        //                     $("#flag-list-menu-calendar").html(flagList);
        //                 }
        //             }
        //         });
        //     }
        //     //两个搜索框的多选处理
        //     $("body").on("click", "#schedule-list-menu-calendar div,#flag-list-menu-calendar div", function(e) {
        //         e.stopPropagation();
        //         $(this).toggleClass("title-color-blue");

        //         var selectString = "";
        //         //得出class为title-color-blue的div，则拼成字符串

        //         var id = $(this).closest(".dropdown-menu").attr("id")

        //         $.each($("#" + id + " div"), function(index, value) {
        //             if ($(value).attr("class") === "title-color-blue") {
        //                 selectString = selectString + $(value).text() + ",";
        //             }
        //         });
        //         $("#" + id).siblings("input").val(selectString);

        //     });

        //     function displayDetail(event) {
        //         $("#J_calendar_detail_modal").modal("show");
        //         require.async("../../../applications/common-template/calendar-datail-list.handlebars", compiled => {
        //             $("#J_calendar_detail_list_body").html(compiled(event.currentAllData));
        //         })
        //     }

        // })();
        // // // 获取首页邮件统计信息
        // (function() {
        //     $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_email_send_info", "v4.0", {}, function(data) {
        //         if (data.bcjson.flag == "1") {
        //             let items = data.bcjson.items;
        //             $(".J_email_num").html(items[0].count);
        //             // require.async("/applications/common-template/email-list.handlebars", function(compiled) {
        //             //     $("#J_email_list").html(compiled(items[0].mailInfoList));
        //             // });
        //         }
        //     });
        // })();


        // //  铃铛图标信息列表
        // // (function() {
        // //     $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_finish_schedule_about_today_info", "v4.0", {}, function(data) {
        // //         var items = data.bcjson.items || data.bcjson;
        // //         if (data.bcjson.flag == "1" && items) {
        // //             require.async("/applications/common-template/schedule-info-list.handlebars", function(compiled) {
        // //                 $("#schedule_info_ul").html(compiled(items));
        // //                 $("#small_bell").html(items.length);
        // //             });
        // //         }
        // //     });
        // // })();

        // // 获取头部admin操作员基础信息及成功失败信息
        // (function() {
        //     // $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_user_info", "v4.0", {}, function(data) {
        //     //     var items = data.bcjson.items || data.bcjson;
        //     //     if (data.bcjson.flag == "1" && items) {
        //     //         var time = items[0].loginTime;
        //     //         //转换时间格式 
        //     //         var loginTime = time.substring(0, 4) + "-" + time.substring(4, 6) + "-" + time.substring(6, 8) + " " + time.substring(8, 10) + ":" + time.substring(10, 12) + ":" + time.substring(12, 14)
        //     //         $("#J_userName").html(items[0].userName)
        //     //         $("#J_employeeId").html(items[0].employeeId)
        //     //         $("#J_nickName").html(items[0].roleName)
        //     //         $("#J_loginTime").html(loginTime)
        //     //     }
        //     // });
        //     // $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_version_info", "v4.0", {}, function(data) {
        //     //     if (data.bcjson.flag === "1" && data.bcjson.items) {
        //     //         var items = data.bcjson.items[0];
        //     //         $("#J_currentVersion").html(items.version);
        //     //     }
        //     // });
        //     // $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_schedule_index_count_info", "v4.0", {}, function(data) {
        //     //     if (data.bcjson.flag === "1" && data.bcjson.items) {
        //     //         var items = data.bcjson.items[0];
        //     //         $("#J_success_complete").html(items.countS);
        //     //         $("#J_error_complete").html(items.countF);
        //     //         $("#J_error_suspend").html(items.countB);
        //     //         $("#small_bell").html(parseInt(items.countS) + parseInt(items.countF) + parseInt(items.countB));
        //     //     }
        //     // });
        // })();


        // // 已选变量
        // function setVLength() {
        //     $("#J_variable_num").text($("#J_variable_modal .variable-r .list-group-item:not('.first')").length);
        // }
        // // 变量弹框 查询变量
        // $("body").on('click', '#J_variable_search', function() {
        //     getVariable();
        // });
        // // 变量弹框 右侧删除单个
        // $("body").on('click', '#J_variable_modal .variable-r .list-group-item .v-close', function() {
        //     let variablename = $(this).closest(".list-group-item").data("variablename");
        //     $(`input[type=checkbox][data-variablename=${variablename}]`).prop("checked", false);
        //     jQuery.uniform.update();
        //     $(this).closest(".list-group-item").remove();
        //     setVLength();
        // });
        // // 变量弹框 右侧删除全部
        // $("body").on('click', '#J_variable_modal .variable-r .list-group-item .v-delete', function() {
        //     $("#J_variable_modal .variable-r .list-group-item:not('.first')").remove();
        //     setVLength();
        //     $("#J_variable_table tbody tr input[type=checkbox]").prop("checked", false);
        //     jQuery.uniform.update();
        // });

        // // 变量弹框 左侧勾选变化
        // $("body").on('change', '#J_variable_table tbody tr td input[type=checkbox]', function() {
        //     let checked = $(this).prop("checked"),
        //         variableName = $(this).data("variablename"),
        //         choose = $("#J_variable_modal .variable-r .list-group-item:not('.first')")
        //     if (!checked) {
        //         $.each(choose, function() {
        //             let variableName_ = $(this).data("variablename");
        //             if (variableName === variableName_) {
        //                 $(this).remove();
        //             }
        //         })
        //     } else {
        //         if (choose.length === 0) {
        //             $("#J_variable_modal .variable-r .list-group").append(`<li class="list-group-item" data-variablename="${variableName}"> 
        //                 <span>${variableName}</span> 
        //                 <a class="v-close" title="删除"> <i class="fa fa-close"></i> </a> 
        //             </li>`);
        //         } else {
        //             // 判断是否存在
        //             let includes = false;
        //             $.each(choose, function() {
        //                 let variableName_ = $(this).data("variablename");
        //                 if (variableName === variableName_) {
        //                     includes = true;
        //                 }
        //             });
        //             if (!includes) {
        //                 $("#J_variable_modal .variable-r .list-group").append(`<li class="list-group-item" data-variablename="${variableName}"> 
        //                     <span>${variableName}</span> 
        //                     <a class="v-close" title="删除"> <i class="fa fa-close"></i> </a> 
        //                 </li>`);
        //             }
        //         }
        //     }
        //     setVLength();
        // });

        // // 变量弹框
        // $("body").on('click', '.set-variable', function() {
        //     $("#J_variable_modal .variable-r .list-group-item:not('.first')").remove();
        //     let input = $(this).prev(".form-control"),
        //         v = input.val(),
        //         variables = v.match(/\$\{[\w+$]+\}/g);
        //     // variables && variables.forEach((item, i) => {
        //     //     $("#J_variable_modal .variable-r .list-group").append(`<li class="list-group-item" data-variablename="${item.replace(/[\$\{\}]/g, "")}">
        //     //         <span>${item.replace(/[\$\{\}]/g, "")}</span>
        //     //         <a class="v-close"> <i class="fa fa-close"></i> </a> 
        //     //     </li>`);
        //     // })
        //     input.attr("modalTrigger", "modalTrigger");
        //     setVLength();
        //     getVariable();
        //     $("#J_variable_modal").modal("show");
        // });

        // // 变量弹框 变量选择
        // $("body").on('click', '#J_choose_variable', function() {
        //     let choose = $("#J_variable_modal .variable-r .list-group-item:not('.first')");
        //     if (choose.length === 0) {
        //         toastr.info("请选择变量");
        //         return;
        //     }
        //     $.each(choose, function() {
        //         let variableName = $(this).data("variablename"),
        //         v = $(`[modalTrigger=modalTrigger]`).val();
        //         $(`[modalTrigger=modalTrigger]`).val(v + "${" + variableName + "}");
        //     })
        //     $("#J_variable_modal").modal("hide");
            
        // });

        // // 当关闭时，删除触发dom
        // $('#J_variable_modal').on('hide.bs.modal', function () {
        //     $(`[modalTrigger=modalTrigger]`).removeAttr("modalTrigger");
        // })
        
        // //  查询变量
        // var getVariable = params => {
        //     let _params = {
        //         taskType: "TV",
        //     }; // 这里用来传特殊参数
        //     _params = Object.assign(_params, params);
        //     $.kingdom.getList({
        //         apiName: "bayconnect.superlop.get_task_detail_info",
        //         apiVision: "v4.0",
        //         params: _params,
        //         tableId: "J_variable_table",
        //         pageId: "J_variable_page",
        //         template: "common-template/variable-list.handlebars",
        //         formName: "J_variable_form",
        //         // isChangeSize: false, 
        //         isGoPage: false,
        //         cb: getVariable
        //     }, () => {
        //         let choose = $("#J_variable_modal .variable-r .list-group-item:not('.first')");
        //         $.each(choose, function() {
        //             let variableName = $(this).data("variablename");
        //             $(`input[type=checkbox][data-variablename=${variableName}]`).prop("checked", true);
        //         })
        //         jQuery.uniform.update();
        //     });
        // };
        

       
    });
    
});
