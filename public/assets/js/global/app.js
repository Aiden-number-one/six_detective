var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
Core script to handle the entire theme and core functions
**/
var App = function () {
    // IE mode
    var _isRTL = false;
    var _isIE = false;
    var _isIE2 = false;
    var isIE10 = false;
    var resizeHandlers = [];
    var assetsPath = '/assets/';
    var globalImgPath = 'img/global/';
    var globalPluginsPath = 'plugins/';
    var globalCssPath = 'css/global/';
    // theme layout color set
    var brandColors = {
        'blue': '#89C4F4',
        'red': '#F3565D',
        'green': '#1bbc9b',
        'purple': '#9b59b6',
        'grey': '#95a5a6',
        'yellow': '#F8CB00'
    };
    // initializes main settings
    var handleInit = function handleInit() {
        if ($('body').css('direction') === 'rtl') {
            _isRTL = true;
        }
        _isIE = !!navigator.userAgent.match(/MSIE 8.0/);
        _isIE2 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);
        if (isIE10) {
            $('html').addClass('ie10'); // detect IE10 version
        }
        if (isIE10 || _isIE2 || _isIE) {
            $('html').addClass('ie'); // detect IE10 version
        }
    };
    // runs callback functions set by App.addResponsiveHandler().
    var _runResizeHandlers = function _runResizeHandlers() {
        // reinitialize other subscribed elements
        for (var i = 0; i < resizeHandlers.length; i++) {
            var each = resizeHandlers[i];
            each.call();
        }
    };
    // handle the layout reinitialization on window resize
    var handleOnResize = function handleOnResize() {
        var resize;
        if (_isIE) {
            var currheight;
            $(window).resize(function () {
                if (currheight == document.documentElement.clientHeight) {
                    return; //quite event since only body resized not window.
                }
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    _runResizeHandlers();
                }, 50); // wait 50ms until window resize finishes.
                currheight = document.documentElement.clientHeight; // store last body client height
            });
        } else {
            $(window).resize(function () {
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function () {
                    _runResizeHandlers();
                }, 50); // wait 50ms until window resize finishes.
            });
        }
    };
    // Handles portlet tools & actions
    var handlePortletTools = function handlePortletTools() {
        // handle portlet remove
        $('body').on('click', '.portlet > .portlet-title > .tools > a.remove', function (e) {
            e.preventDefault();
            var portlet = $(this).closest(".portlet");
            if ($('body').hasClass('page-portlet-fullscreen')) {
                $('body').removeClass('page-portlet-fullscreen');
            }
            portlet.find('.portlet-title .fullscreen').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .reload').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .remove').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .config').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip('destroy');
            portlet.remove();
        });
        // handle portlet fullscreen
        $('body').on('click', '.portlet > .portlet-title .fullscreen', function (e) {
            e.preventDefault();
            var portlet = $(this).closest(".portlet");
            if (portlet.hasClass('portlet-fullscreen')) {
                $(this).removeClass('on');
                portlet.removeClass('portlet-fullscreen');
                $('body').removeClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height', 'auto');
            } else {
                var height = App.getViewPort().height - portlet.children('.portlet-title').outerHeight() - parseInt(portlet.children('.portlet-body').css('padding-top')) - parseInt(portlet.children('.portlet-body').css('padding-bottom'));
                $(this).addClass('on');
                portlet.addClass('portlet-fullscreen');
                $('body').addClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height', height);
            }
        });
        $('body').on('click', '.portlet > .portlet-title > .tools > a.reload', function (e) {
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            var url = $(this).attr("data-url");
            var _error = $(this).attr("data-error-display");
            if (url) {
                App.blockUI({
                    target: el,
                    animate: true,
                    overlayColor: 'none'
                });
                $.ajax({
                    type: "GET",
                    cache: false,
                    url: url,
                    dataType: "html",
                    success: function success(res) {
                        App.unblockUI(el);
                        el.html(res);
                        App.initAjax(); // reinitialize elements & plugins for newly loaded content
                    },
                    error: function error(xhr, ajaxOptions, thrownError) {
                        App.unblockUI(el);
                        var msg = 'Error on reloading the content. Please check your connection and try again.';
                        if (_error == "toastr" && toastr) {
                            toastr.error(msg);
                        } else if (_error == "notific8" && $.notific8) {
                            $.notific8('zindex', 11500);
                            $.notific8(msg, {
                                theme: 'ruby',
                                life: 3000
                            });
                        } else {
                            alert(msg);
                        }
                    }
                });
            } else {
                // for demo purpose
                App.blockUI({
                    target: el,
                    animate: true,
                    overlayColor: 'none'
                });
                window.setTimeout(function () {
                    App.unblockUI(el);
                }, 1000);
            }
        });
        // load ajax data on page init
        $('.portlet .portlet-title a.reload[data-load="true"]').click();
        $('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function (e) {
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            if ($(this).hasClass("collapse")) {
                $(this).removeClass("collapse").addClass("expand");
                el.slideUp(200);
            } else {
                $(this).removeClass("expand").addClass("collapse");
                el.slideDown(200);
            }
        });
    };
    // Handles custom checkboxes & radios using jQuery Uniform plugin
    var handleUniform = function handleUniform() {
        if (!$().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");
        if (test.size() > 0) {
            test.each(function () {
                if ($(this).parents(".checker").size() === 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    };
    // Handlesmaterial design checkboxes
    var handleMaterialDesign = function handleMaterialDesign() {
        // Material design ckeckbox and radio effects
        $('body').on('click', '.md-checkbox > label, .md-radio > label', function () {
            var the = $(this);
            // find the first span which is our circle/bubble
            var el = $(this).children('span:first-child');
            // add the bubble class (we do this so it doesnt show on page load)
            el.addClass('inc');
            // clone it
            var newone = el.clone(true);
            // add the cloned version before our original
            el.before(newone);
            // remove the original so that it is ready to run on next click
            $("." + el.attr("class") + ":last", the).remove();
        });
        if ($('body').hasClass('page-md')) {
            // Material design click effect
            // credit where credit's due; http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-design
            var element, circle, d, x, y;
            $('body').on('click', 'a.btn, button.btn, input.btn, label.btn', function (e) {
                element = $(this);
                if (element.find(".md-click-circle").length == 0) {
                    element.prepend("<span class='md-click-circle'></span>");
                }
                circle = element.find(".md-click-circle");
                circle.removeClass("md-click-animate");
                if (!circle.height() && !circle.width()) {
                    d = Math.max(element.outerWidth(), element.outerHeight());
                    circle.css({
                        height: d,
                        width: d
                    });
                }
                x = e.pageX - element.offset().left - circle.width() / 2;
                y = e.pageY - element.offset().top - circle.height() / 2;
                circle.css({
                    top: y + 'px',
                    left: x + 'px'
                }).addClass("md-click-animate");
                setTimeout(function () {
                    circle.remove();
                }, 1000);
            });
        }
        // Floating labels
        var handleInput = function handleInput(el) {
            if (el.val() != "") {
                el.addClass('edited');
            } else {
                el.removeClass('edited');
            }
        };
        $('body').on('keydown', '.form-md-floating-label .form-control', function (e) {
            handleInput($(this));
        });
        $('body').on('blur', '.form-md-floating-label .form-control', function (e) {
            handleInput($(this));
        });
        $('.form-md-floating-label .form-control').each(function () {
            if ($(this).val().length > 0) {
                $(this).addClass('edited');
            }
        });
    };
    // Handles custom checkboxes & radios using jQuery iCheck plugin
    var handleiCheck = function handleiCheck() {
        if (!$().iCheck) {
            return;
        }
        $('.icheck').each(function () {
            var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-grey';
            var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-grey';
            if (checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
                $(this).iCheck({
                    checkboxClass: checkboxClass,
                    radioClass: radioClass,
                    insert: '<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
                });
            } else {
                $(this).iCheck({
                    checkboxClass: checkboxClass,
                    radioClass: radioClass
                });
            }
        });
    };
    // Handles Bootstrap switches
    var handleBootstrapSwitch = function handleBootstrapSwitch() {
        if (!$().bootstrapSwitch) {
            return;
        }
        $('.make-switch').bootstrapSwitch();
    };
    // Handles Bootstrap confirmations
    var handleBootstrapConfirmation = function handleBootstrapConfirmation() {
        if (!$().confirmation) {
            return;
        }
        $('[data-toggle=confirmation]').confirmation({
            container: 'body',
            btnOkClass: 'btn btn-sm btn-success',
            btnCancelClass: 'btn btn-sm btn-danger'
        });
    };
    // Handles Bootstrap Accordions.
    var handleAccordions = function handleAccordions() {
        $('body').on('shown.bs.collapse', '.accordion.scrollable', function (e) {
            App.scrollTo($(e.target));
        });
    };
    // Handles Bootstrap Tabs.
    var handleTabs = function handleTabs() {
        //activate tab if tab id provided in the URL
        if (location.hash) {
            var tabid = encodeURI(location.hash.substr(1));
            $('a[href="#' + tabid + '"]').parents('.tab-pane:hidden').each(function () {
                var tabid = $(this).attr("id");
                $('a[href="#' + tabid + '"]').click();
            });
            $('a[href="#' + tabid + '"]').click();
        }
        if ($().tabdrop) {
            $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
                text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
            });
        }
    };
    // Handles Bootstrap Modals.
    var handleModals = function handleModals() {
        // fix stackable modal issue: when 2 or more modals opened, closing one of modal will remove .modal-open class.
        $('body').on('hide.bs.modal', function () {
            if ($('.modal:visible').size() > 1 && $('html').hasClass('modal-open') === false) {
                $('html').addClass('modal-open');
            } else if ($('.modal:visible').size() <= 1) {
                $('html').removeClass('modal-open');
            }
        });
        // fix page scrollbars issue
        $('body').on('show.bs.modal', '.modal', function () {
            if ($(this).hasClass("modal-scroll")) {
                $('body').addClass("modal-open-noscroll");
            }
        });
        // fix page scrollbars issue
        $('body').on('hide.bs.modal', '.modal', function () {
            $('body').removeClass("modal-open-noscroll");
        });
        // remove ajax content and remove cache on modal closed
        $('body').on('hidden.bs.modal', '.modal:not(.modal-cached)', function () {
            $(this).removeData('bs.modal');
        });
    };
    // Handles Bootstrap Tooltips.
    var handleTooltips = function handleTooltips() {
        // global tooltips
        $('.tooltips').tooltip();
        // portlet tooltips
        $('.portlet > .portlet-title .fullscreen').tooltip({
            container: 'body',
            title: 'Fullscreen'
        });
        $('.portlet > .portlet-title > .tools > .reload').tooltip({
            container: 'body',
            title: 'Reload'
        });
        $('.portlet > .portlet-title > .tools > .remove').tooltip({
            container: 'body',
            title: 'Remove'
        });
        $('.portlet > .portlet-title > .tools > .config').tooltip({
            container: 'body',
            title: 'Settings'
        });
        $('.portlet > .portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip({
            container: 'body',
            title: 'Collapse/Expand'
        });
    };
    // Handles Bootstrap Dropdowns
    var handleDropdowns = function handleDropdowns() {
        /*
          Hold dropdown on click
        */
        $('body').on('click', '.dropdown-menu.hold-on-click', function (e) {
            e.stopPropagation();
        });
    };
    var handleAlerts = function handleAlerts() {
        $('body').on('click', '[data-close="alert"]', function (e) {
            $(this).parent('.alert').hide();
            $(this).closest('.note').hide();
            e.preventDefault();
        });
        $('body').on('click', '[data-close="note"]', function (e) {
            $(this).closest('.note').hide();
            e.preventDefault();
        });
        $('body').on('click', '[data-remove="note"]', function (e) {
            $(this).closest('.note').remove();
            e.preventDefault();
        });
    };
    // Handle Hower Dropdowns
    var handleDropdownHover = function handleDropdownHover() {
        $('[data-hover="dropdown"]').not('.hover-initialized').each(function () {
            $(this).dropdownHover();
            $(this).addClass('hover-initialized');
        });
    };
    // Handle textarea autosize
    var handleTextareaAutosize = function handleTextareaAutosize() {
        if (typeof autosize == "function") {
            autosize(document.querySelector('textarea.autosizeme'));
        }
    };
    // Handles Bootstrap Popovers
    // last popep popover
    var lastPopedPopover;
    var handlePopovers = function handlePopovers() {
        $('.popovers').popover();
        // close last displayed popover
        $(document).on('click.bs.popover.data-api', function (e) {
            if (lastPopedPopover) {
                lastPopedPopover.popover('hide');
            }
        });
    };
    // Handles scrollable contents using jQuery SlimScroll plugin.
    var handleScrollers = function handleScrollers() {
        App.initSlimScroll('.scroller');
    };
    // Handles Image Preview using jQuery Fancybox plugin
    var handleFancybox = function handleFancybox() {
        if (!jQuery.fancybox) {
            return;
        }
        if ($(".fancybox-button").size() > 0) {
            $(".fancybox-button").fancybox({
                groupAttr: 'data-rel',
                prevEffect: 'none',
                nextEffect: 'none',
                closeBtn: true,
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });
        }
    };
    // Handles counterup plugin wrapper
    var handleCounterup = function handleCounterup() {
        if (!$().counterUp) {
            return;
        }
        $("[data-counter='counterup']").counterUp({
            delay: 10,
            time: 1000
        });
    };
    // Fix input placeholder issue for IE8 and IE9
    var handleFixInputPlaceholderForIE = function handleFixInputPlaceholderForIE() {
        //fix html5 placeholder attribute for ie7 & ie8
        if (_isIE || _isIE2) {
            // ie8 & ie9
            // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
            $('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {
                var input = $(this);
                if (input.val() === '' && input.attr("placeholder") !== '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }
                input.focus(function () {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });
                input.blur(function () {
                    if (input.val() === '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    };
    // Handle Select2 Dropdowns
    var handleSelect2 = function handleSelect2() {
        if ($().select2) {
            $.fn.select2.defaults.set("theme", "bootstrap");
            $('.select2me').select2({
                placeholder: "Select",
                width: 'auto',
                allowClear: true
            });
        }
    };
    // handle group element heights
    var handleHeight = function handleHeight() {
        $('[data-auto-height]').each(function () {
            var parent = $(this);
            var items = $('[data-height]', parent);
            var height = 0;
            var mode = parent.attr('data-mode');
            var offset = parseInt(parent.attr('data-offset') ? parent.attr('data-offset') : 0);
            items.each(function () {
                if ($(this).attr('data-height') == "height") {
                    $(this).css('height', '');
                } else {
                    $(this).css('min-height', '');
                }
                var height_ = mode == 'base-height' ? $(this).outerHeight() : $(this).outerHeight(true);
                if (height_ > height) {
                    height = height_;
                }
            });
            height = height + offset;
            items.each(function () {
                if ($(this).attr('data-height') == "height") {
                    $(this).css('height', height);
                } else {
                    $(this).css('min-height', height);
                }
            });
            if (parent.attr('data-related')) {
                $(parent.attr('data-related')).css('height', parent.height());
            }
        });
    };
    //* END:CORE HANDLERS *//
    return {
        //main function to initiate the theme
        init: function init() {
            //IMPORTANT!!!: Do not modify the core handlers call order.
            //Core handlers
            handleInit(); // initialize core variables
            handleOnResize(); // set and handle responsive
            //UI Component handlers
            handleMaterialDesign(); // handle material design
            handleUniform(); // hanfle custom radio & checkboxes
            handleiCheck(); // handles custom icheck radio and checkboxes
            handleBootstrapSwitch(); // handle bootstrap switch plugin
            handleScrollers(); // handles slim scrolling contents
            handleFancybox(); // handle fancy box
            handleSelect2(); // handle custom Select2 dropdowns
            handlePortletTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
            handleAlerts(); //handle closabled alerts
            handleDropdowns(); // handle dropdowns
            handleTabs(); // handle tabs
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleAccordions(); //handles accordions
            handleModals(); // handle modals
            handleBootstrapConfirmation(); // handle bootstrap confirmations
            handleTextareaAutosize(); // handle autosize textareas
            handleCounterup(); // handle counterup instances
            //Handle group element heights
            this.addResizeHandler(handleHeight); // handle auto calculating height on window resize
            // Hacks
            handleFixInputPlaceholderForIE(); //IE8 & IE9 input placeholder issue fix
        },
        //main function to initiate core javascript after ajax complete
        initAjax: function initAjax() {
            handleUniform(); // handles custom radio & checkboxes
            handleiCheck(); // handles custom icheck radio and checkboxes
            handleBootstrapSwitch(); // handle bootstrap switch plugin
            handleDropdownHover(); // handles dropdown hover
            handleScrollers(); // handles slim scrolling contents
            handleSelect2(); // handle custom Select2 dropdowns
            handleFancybox(); // handle fancy box
            handleDropdowns(); // handle dropdowns
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleAccordions(); //handles accordions
            handleBootstrapConfirmation(); // handle bootstrap confirmations
        },
        //init main components
        initComponents: function initComponents() {
            this.initAjax();
        },
        //public function to remember last opened popover that needs to be closed on click
        setLastPopedPopover: function setLastPopedPopover(el) {
            lastPopedPopover = el;
        },
        //public function to add callback a function which will be called on window resize
        addResizeHandler: function addResizeHandler(func) {
            resizeHandlers.push(func);
        },
        //public functon to call _runresizeHandlers
        runResizeHandlers: function runResizeHandlers() {
            _runResizeHandlers();
        },
        // wrApper function to scroll(focus) to an element
        scrollTo: function scrollTo(el, offeset) {
            var pos = el && el.size() > 0 ? el.offset().top : 0;
            if (el) {
                if ($('body').hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                } else if ($('body').hasClass('page-header-top-fixed')) {
                    pos = pos - $('.page-header-top').height();
                } else if ($('body').hasClass('page-header-menu-fixed')) {
                    pos = pos - $('.page-header-menu').height();
                }
                pos = pos + (offeset ? offeset : -1 * el.height());
            }
            $('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },
        initSlimScroll: function initSlimScroll(el) {
            $(el).each(function () {
                if ($(this).attr("data-initialized")) {
                    return; // exit
                }
                var height;
                if ($(this).attr("data-height")) {
                    height = $(this).attr("data-height");
                } else {
                    height = $(this).css('height');
                }
                $(this).slimScroll({
                    allowPageScroll: true, // allow page scroll when the element scroll is ended
                    size: '7px',
                    color: $(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#bbb',
                    wrapperClass: $(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv',
                    railColor: $(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea',
                    position: _isRTL ? 'left' : 'right',
                    height: height,
                    alwaysVisible: $(this).attr("data-always-visible") == "1" ? true : false,
                    railVisible: $(this).attr("data-rail-visible") == "1" ? true : false,
                    disableFadeOut: true
                });
                $(this).attr("data-initialized", "1");
            });
        },
        destroySlimScroll: function destroySlimScroll(el) {
            $(el).each(function () {
                if ($(this).attr("data-initialized") === "1") {
                    // destroy existing instance before updating the height
                    $(this).removeAttr("data-initialized");
                    $(this).removeAttr("style");
                    var attrList = {};
                    // store the custom attribures so later we will reassign.
                    if ($(this).attr("data-handle-color")) {
                        attrList["data-handle-color"] = $(this).attr("data-handle-color");
                    }
                    if ($(this).attr("data-wrapper-class")) {
                        attrList["data-wrapper-class"] = $(this).attr("data-wrapper-class");
                    }
                    if ($(this).attr("data-rail-color")) {
                        attrList["data-rail-color"] = $(this).attr("data-rail-color");
                    }
                    if ($(this).attr("data-always-visible")) {
                        attrList["data-always-visible"] = $(this).attr("data-always-visible");
                    }
                    if ($(this).attr("data-rail-visible")) {
                        attrList["data-rail-visible"] = $(this).attr("data-rail-visible");
                    }
                    $(this).slimScroll({
                        wrapperClass: $(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv',
                        destroy: true
                    });
                    var the = $(this);
                    // reassign custom attributes
                    $.each(attrList, function (key, value) {
                        the.attr(key, value);
                    });
                }
            });
        },
        // function to scroll to the top
        scrollTop: function scrollTop() {
            App.scrollTo();
        },
        // wrApper function to  block element(indicate loading)
        blockUI: function blockUI(options) {
            options = $.extend(true, {}, options);
            var html = '';
            if (options.animate) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
            } else if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-blue.gif" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-blue.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }
            if (options.target) {
                // element blocking
                var el = $(options.target);
                if (el.height() <= $(window).height()) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 9999999,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else {
                // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        },
        // wrApper function to  un-block element(finish loading)
        unblockUI: function unblockUI(target) {
            if (target) {
                $(target).unblock({
                    onUnblock: function onUnblock() {
                        $(target).css('position', '');
                        $(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        },
        startPageLoading: function startPageLoading(options) {
            if (options && options.animate) {
                $('.page-spinner-bar').remove();
                $('body').append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            } else {
                $('.page-loading').remove();
                $('body').append('<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : 'Loading...') + '</span></div>');
            }
        },
        stopPageLoading: function stopPageLoading() {
            $('.page-loading, .page-spinner-bar').remove();
        },
        alert: function alert(options) {
            options = $.extend(true, {
                container: "", // alerts parent container(by default placed after the page breadcrumbs)
                place: "append", // "append" or "prepend" in container
                type: 'success', // alert's type
                message: "", // alert's message
                close: true, // make alert closable
                reset: true, // close all previouse alerts first
                focus: true, // auto scroll to the alert after shown
                closeInSeconds: 0, // auto close after defined seconds
                icon: "" // put icon before the message
            }, options);
            var id = App.getUniqueID("App_alert");
            var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';
            if (options.reset) {
                $('.custom-alerts').remove();
            }
            if (!options.container) {
                if ($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) {
                    $('.page-title').after(html);
                } else {
                    if ($('.page-bar').size() > 0) {
                        $('.page-bar').after(html);
                    } else {
                        $('.page-breadcrumb').after(html);
                    }
                }
            } else {
                if (options.place == "append") {
                    $(options.container).append(html);
                } else {
                    $(options.container).prepend(html);
                }
            }
            if (options.focus) {
                App.scrollTo($('#' + id));
            }
            if (options.closeInSeconds > 0) {
                setTimeout(function () {
                    $('#' + id).remove();
                }, options.closeInSeconds * 1000);
            }
            return id;
        },
        // initializes uniform elements
        initUniform: function initUniform(els) {
            if (els) {
                $(els).each(function () {
                    if ($(this).parents(".checker").size() === 0) {
                        $(this).show();
                        $(this).uniform();
                    }
                });
            } else {
                handleUniform();
            }
        },
        //wrApper function to update/sync jquery uniform checkbox & radios
        updateUniform: function updateUniform(els) {
            $.uniform.update(els); // update the uniform checkbox & radios UI after the actual input control state changed
        },
        //public function to initialize the fancybox plugin
        initFancybox: function initFancybox() {
            handleFancybox();
        },
        //public helper function to get actual input value(used in IE9 and IE8 due to placeholder attribute not supported)
        getActualVal: function getActualVal(el) {
            el = $(el);
            if (el.val() === el.attr("placeholder")) {
                return "";
            }
            return el.val();
        },
        //public function to get a paremeter by name from URL
        getURLParameter: function getURLParameter(paramName) {
            var searchString = window.location.search.substring(1),
                i,
                val,
                params = searchString.split("&");
            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },
        // check for device touch support
        isTouchDevice: function isTouchDevice() {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        },
        // To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
        getViewPort: function getViewPort() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },
        getUniqueID: function getUniqueID(prefix) {
            return 'prefix_' + Math.floor(Math.random() * new Date().getTime());
        },
        // check IE8 mode
        isIE8: function isIE8() {
            return _isIE;
        },
        // check IE9 mode
        isIE9: function isIE9() {
            return _isIE2;
        },
        //check RTL mode
        isRTL: function isRTL() {
            return _isRTL;
        },
        // check IE8 mode
        isAngularJsApp: function isAngularJsApp() {
            return typeof angular == 'undefined' ? false : true;
        },
        getAssetsPath: function getAssetsPath() {
            return assetsPath;
        },
        setAssetsPath: function setAssetsPath(path) {
            assetsPath = path;
        },
        setGlobalImgPath: function setGlobalImgPath(path) {
            globalImgPath = path;
        },
        getGlobalImgPath: function getGlobalImgPath() {
            return assetsPath + globalImgPath;
        },
        setGlobalPluginsPath: function setGlobalPluginsPath(path) {
            globalPluginsPath = path;
        },
        getGlobalPluginsPath: function getGlobalPluginsPath() {
            return assetsPath + globalPluginsPath;
        },
        getGlobalCssPath: function getGlobalCssPath() {
            return assetsPath + globalCssPath;
        },
        // get layout color code by color name
        getBrandColor: function getBrandColor(name) {
            if (brandColors[name]) {
                return brandColors[name];
            } else {
                return '';
            }
        },
        getResponsiveBreakpoint: function getResponsiveBreakpoint(size) {
            // bootstrap responsive breakpoints
            var sizes = {
                'xs': 480, // extra small
                'sm': 768, // small
                'md': 992, // medium
                'lg': 1200 // large
            };
            return sizes[size] ? sizes[size] : 0;
        },
        //自定义
        //初始化数据表格分页
        // initPagination: function(cp, tp, tr, id) { //当前页，总页码，总条数，分页id
        //     if (arguments.length == 1) {
        //         var id = arguments[0];
        //     }
        //     $.kd.kdPager.init({
        //         pager: id ? id : "page-area",
        //         currentPage: cp,
        //         totalPage: tp,
        //         totalRecords: tr,
        //         prefix: 'javascript:void(0)'
        //     });
        // },
        initPagination: function initPagination(cp, tp, tr, id, size, cfunc, isChangeSize, isGoPage) {
            //当前页，总页码，总条数，分页id, 回调， 是否显示改变每页条数， 是否显示页数跳转
            if (arguments.length == 1) {
                var id = arguments[0];
            }
            $.kd.kdPager.init({
                pager: id ? id : "page-area",
                currentPage: cp,
                totalPage: tp,
                totalRecords: tr,
                prefix: 'javascript:void(0)',
                isChangeSize: isChangeSize,
                isGoPage: isGoPage
            });
            // 分页跳转 
            $("#" + id + " ul.pagination a").click(function () {
                var _this = $(this);
                var page = _this.text();
                if (_this.parent().hasClass("next")) {
                    page = $.kd.kdPager.next + "";
                }
                if (_this.parent().hasClass("prev")) {
                    page = $.kd.kdPager.prv + "";
                }
                var params = {};
                params.pageNumber = page;
                cfunc(params);
            });
            $("#" + id + " select[name='pager_size']").change(function (e) {
                if (e.which == 13) {
                    cfunc();
                }
            });
            if (size) {
                size = Math.round(Number(size));
                $("#" + id + " select[name='pager_size']").val(size || "10");
                $("#" + id + " select[name='pager_size']").change(function (e) {
                    cfunc();
                });
                $("#" + id + " input[name='pager_number']").keyup(function (e) {
                    if (!(e.which >= 48 && e.which <= 57 || e.which >= 96 && e.which <= 105)) {
                        $(this).val($(this).val().substring(0, $(this).val().length - 1));
                    }
                });
                $("#" + id + " button[name='pager_number_btn']").click(function () {
                    cfunc();
                });
                $("#" + id + " input[name='pager_number']").keydown(function (e) {
                    if (e.which == 13) {
                        cfunc();
                    }
                });
            }
        },
        //初始化带checkbox\radiobox的表格
        initCheckableTable: function initCheckableTable(table) {
            var table = table;
            this.initUniform();
            table.find('.group-checkable').change(function () {
                var checked = jQuery(this).is(":checked");
                // 全选
                table.find("tbody tr input[type=checkbox]:not(.make-switch)").each(function () {
                    if (checked && !$(this).attr("disabled")) {
                        $(this).prop("checked", true).change();
                        $(this).parents('tr').addClass("active");
                    } else {
                        $(this).prop("checked", false).change();
                        $(this).parents('tr').removeClass("active");
                    }
                });
                jQuery.uniform.update();
            });
            table.find('tbody tr .form-control').click(function (e) {
                e.stopPropagation();
            });
            table.find('tbody tr input[type=checkbox]:not(.make-switch)').click(function (e) {
                e.stopPropagation();
                if ($(this).prop("checked")) {
                    $(this).parents('tr').addClass("active");
                } else {
                    $(this).parents('tr').removeClass("active");
                }
                jQuery.uniform.update();
            });
            table.find('tbody tr').click(function () {
                var dom = $(this).find("input[type=checkbox]:not(.make-switch)");
                if (dom.length === 0) return;
                if (dom.prop("checked")) {
                    dom.prop("checked", false).change();
                    $(this).removeClass("active");
                } else {
                    dom.prop("checked", true).change();
                    $(this).addClass("active");
                }
                jQuery.uniform.update();
            });
        },
        //表单参数获取
        getFormParams: function getFormParams(name) {
            var form = $("form[name=" + name + "]");
            var data = form.serializeArray();
            var params = {};
            $.each(data, function (i, item) {
                var name = item.name;
                params[name] = item.value.trim().toString();
            });
            return params;
        },
        //表单重置
        clearForm: function clearForm(formName) {
            var formObj = document.forms[formName];
            var formEl = formObj.elements;
            for (var i = 0; i < formEl.length; i++) {
                var element = formEl[i];
                if (element.type == 'submit') {
                    continue;
                }
                if (element.type == 'reset') {
                    continue;
                }
                if (element.type == 'button') {
                    continue;
                }
                if (element.type == 'hidden') {
                    element.value = '';
                }
                if (element.type == 'number') {
                    element.value = '';
                }
                if (element.type == 'text') {
                    element.value = '';
                }
                if (element.type == 'password') {
                    element.value = '';
                }
                if (element.type == 'textarea') {
                    element.value = '';
                }
                if (element.type == 'checkbox') {
                    element.checked = false;
                    $(element).parent().removeClass("checked");
                }
                if (element.type == 'radio') {
                    element.checked = false;
                    $(element).parent().removeClass("checked");
                }
                if (element.type == 'select-multiple') {
                    element.selectedIndex = 0;
                }
                if (element.type == 'select-one') {
                    element.selectedIndex = 0;
                }
                $(element).closest('.form-group').removeClass('has-error');
                $(element).siblings(".help-block").remove();
            }
        },
        //表单赋值,入参：#form,数据对象{}
        setFormData: function setFormData(formName, data) {
            var $form = $("form[name=" + formName + "]");
            this.clearForm(formName);

            $.each(data, function (name, val) {
                var $oinput = $form.find("[name='" + name + "']");
                if ($oinput.attr("type") == "checkbox") {
                    if (val) {
                        var checkArray = val.split(",");
                        for (var i = 0; i < $oinput.length; i++) {
                            if ($.inArray($oinput[i].value, checkArray) != "-1") {
                                $($oinput[i]).click();
                            }
                        }
                    }
                } else if ($oinput.attr("type") == "radio") {
                    $oinput.each(function () {
                        for (var i = 0; i < $oinput.length; i++) {
                            if ($oinput[i].value == val) {
                                $($oinput[i]).click();
                            }
                        }
                    });
                } else if ($oinput.attr("type") == "html") {
                    $oinput.html(val);
                } else if ($oinput.hasClass("form-control-static")) {
                    $oinput.html(val);
                } else {
                    $oinput.val(val);
                }
            });
        },
        //datepicker
        handleDatePickers: function handleDatePickers() {
            //初始化datepicker
            if (jQuery().datepicker) {
                $('.date-picker').datepicker({
                    rtl: App.isRTL(),
                    orientation: "left",
                    todayBtn: "linked",
                    autoclose: true,
                    language: 'zh-CN',
                    todayHighlight: true
                });
                $('.date-picker-no-day').datepicker({
                    rtl: App.isRTL(),
                    orientation: "left",
                    autoclose: true,
                    minViewMode: 1,
                    language: 'zh-CN'
                });
            }
        },
        //timepicker
        handleTimePickers: function handleTimePickers() {
            if (jQuery().timepicker) {
                $('.timepicker-default').timepicker({
                    autoclose: true,
                    showSeconds: true,
                    minuteStep: 1
                });
                $('.timepicker-no-seconds').timepicker({
                    autoclose: true,
                    minuteStep: 1,
                    showMeridian: false
                });
                $('.timepicker-24').timepicker({
                    autoclose: true,
                    showSeconds: true,
                    minuteStep: 1,
                    showMeridian: false
                });
            }
        },
        //datetimepicker
        handleDateTimePickers: function handleDateTimePickers() {
            if (jQuery().datetimepicker) {
                $('.date-time-picker').datetimepicker({
                    autoclose: true,
                    minuteStep: 1
                });
            }
        },
        exportList: function exportList(paramsMap) {
            var sendData = {
                "apiname": "kingdom.kifp.get_list_excel_download_by_api",
                "apiversion": "v1.3",
                "paramsMap": paramsMap
            };
            $.kingdom.doKoauthAdminAPI(sendData.apiname, sendData.apiversion, sendData.paramsMap, function (data) {
                if (data.bcjson.flag == "1") {

                    bootbox.confirm({
                        "message": "导出" + data.bcjson.items[0].relativeUrl,
                        "title": "文件导出",
                        callback: function callback(result) {
                            if (result) {
                                window.location.href = "fileserver/" + data.bcjson.items[0].relativeUrl;
                            }
                        }
                    });
                } else {
                    toastr.error(data.bcjson.msg);
                }
            });
        },

        // 获取表格数据
        getTableParamsFakeName: function getTableParamsFakeName(selector) {
            var arr = [],
                checked = true; // 必填项是否必填
            $.each($(selector + ' tr:not([hidden])'), function () {
                var _this = $(this),
                    obj = {};
                $.each(_this.find("[fakename]"), function (i) {
                    var dom = _this.find("[fakename]").eq(i),
                        name = dom.attr("fakename"),
                        // 为什么用fakename，避免getFormParams方法获取了name
                    selectTrue = dom.prop("tagName") === "SELECT",
                        //是否为select标签
                    value = !selectTrue ? dom.val() || $.trim(dom.text()) : dom.val(),
                        required = dom.attr("required");
                    // 校验 针对存储过程 direction为IN必填
                    if (required && !value) {
                        checked = false;
                        $('[href="#tab_4_2"]').click();
                        $("#J_modal_TP").animate({ scrollTop: dom.position().top });
                        dom.focus();
                        return false;
                    }
                    obj[name] = value;
                });
                if (!checked) return false;
                arr.push(obj);
            });
            return checked ? arr : checked;
        },
        // 获取局部表单
        getFormParamsFakeName: function getFormParamsFakeName(selector) {
            var obj = {};
            $.each($(selector + ' .form-control'), function () {
                var name = $(this).attr("fakename"),
                    value = $(this).val();
                obj[name] = value;
            });
            return obj;
        },
        // 查询存储过程 存储过程任务->参数处理  && 数据剖析
        handleParams: function handleParams(selector) {
            var _this2 = this;

            this.addRow = function () {
                var num = $(selector + " tr:not([hidden])").length,
                    clone = $(selector + " [data-clone-sample]").clone().removeAttr("data-clone-sample hidden");
                clone.find("td:first").children("span").text(num + 1);
                $(selector).append(clone);
            };
            // this.addRowDQ = () => {
            //     let num = $(selector + " tr:not([hidden])").length,
            //         len = $(selector + " [data-clone-sample] [fakename=colName]")[0].length;
            //     if (num === len) {  // 不能超过字段长度
            //         return;
            //     }
            //     let clone = $(selector + " [data-clone-sample]").clone().removeAttr("data-clone-sample hidden");
            //         clone.find("td:first").children("span").text(num + 1);
            //     $(selector).append(clone);
            // };
            // this.addRowDQ_S = () => {
            //     let num = $(selector + " tr:not([hidden])").length,
            //         len = $(selector + " [data-clone-sample] [fakename=ruleName]")[0].length;
            //     if (num === len) {  // 不能超过字段长度
            //         return;
            //     }
            //     let clone = $(selector + " [data-clone-sample]").clone().removeAttr("data-clone-sample hidden");
            //     clone.find("td:first").children("span").text(num + 1);
            //     $(selector).append(clone);
            // };
            this.addAllRow = function () {
                var num = $(selector + " tr:not([hidden])").length,
                    len = $(selector + " [data-clone-sample] [fakename=colName]")[0].length;
                for (var i = 0; i < len - num; i++) {
                    _this2.addRow();
                }
            };
            // this.addAllRow_S = () => {
            //     let num = $(selector + " tr:not([hidden])").length,
            //         len = $(selector + " [data-clone-sample] [fakename=ruleName]")[0].length;
            //     for (let i = 0; i < len - num; i++) {
            //         this.addRow();
            //     }
            // };
            this.batchAddRow = function () {
                for (var i = 0; i < 5; i++) {
                    _this2.addRow();
                }
            };
            this.delRow = function (dom) {
                dom.closest("tr").remove();
                _this2.reorder();
            };
            this.delAllRow = function () {
                $(selector + " tr:not([hidden])").remove();
            };
            this.delCheckedRow = function () {
                $.each($(selector + " input[type=checkbox]:checked"), function (i) {
                    $(this).closest("tr").remove();
                });
            };
            this.reorder = function () {
                $.each($(selector + " tr:not([hidden])"), function (i) {
                    $(this).find("td:first").children("span").text(i + 1);
                });
            };
            this.getData = function (cb) {
                var parameters = App.getTableParamsFakeName(selector);
                if (typeof cb === "function") {
                    cb(parameters);
                } else {
                    return JSON.stringify(parameters);
                }
            };
            this.setData = function (items) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    var _loop = function _loop() {
                        var item = _step.value;

                        var clone = $(selector + " [data-clone-sample]").clone().removeAttr("data-clone-sample hidden");
                        $.each(clone.find("[fakename]"), function (i) {
                            var fakename = $(this).attr("fakename");
                            if (i === 0) {
                                $(this).html(item[fakename]);
                            } else {
                                $(this).val(item[fakename]);
                            }
                            // 储存 参数 特殊处理 当方向为IN时 必填 和 App.getTableParamsFakeName 方法相呼应
                            if (fakename === "value" && item.direction === "IN") {
                                $(this).attr("required", "required").attr("placeholder", "required");
                            }
                        });
                        $(selector).append(clone);
                    };

                    for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        _loop();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            };
        },
        loading: function loading(selector) {
            $(selector).html('<img src="/assets/plugins/jstree/dist/themes/default/throbber.gif" style="margin: 25px auto;display: block;"/>');
        },
        treeEllipsis: function treeEllipsis(treeSelector) {
            function isChinese(str) {
                var reg = /[\u4e00-\u9fa5]/;
                if (reg.test(str)) {
                    return true;
                }
            }
            function getRealLength(str) {
                var len = 0,
                    index = void 0;
                str.split("").forEach(function (item, i) {
                    if (isChinese(item)) {
                        len += 2;
                    } else {
                        len++;
                    }
                    if (len <= 16) {
                        index = i;
                    }
                });
                return [len, index];
            }
            $.each($(treeSelector + ' .jstree-anchor'), function () {
                var title = $(this).attr("title") || $(this).text();
                var temp = $(this).children("i").prop("outerHTML");

                var _getRealLength = getRealLength(title),
                    _getRealLength2 = _slicedToArray(_getRealLength, 2),
                    len = _getRealLength2[0],
                    index = _getRealLength2[1];

                if (len > 16) {
                    $(this).attr("title", title);
                    $(this).html(temp + title.substring(0, index) + "...");
                }
            });
        },
        treeEllipsis1: function treeEllipsis1(treeSelector) {
            function isChinese(str) {
                var reg = /[\u4e00-\u9fa5]/;
                if (reg.test(str)) {
                    return true;
                }
            }
            function getRealLength(str) {
                var len = 0,
                    index = void 0;
                str.split("").forEach(function (item, i) {
                    if (isChinese(item)) {
                        len += 2;
                    } else {
                        len++;
                    }
                    if (len <= 16) {
                        index = i;
                    }
                });
                return [len, index];
            }
            $.each($(treeSelector + ' .jstree-anchor'), function () {
                var title = $(this).attr("title") || $(this).text();
                var temp = $(this).children("i").prop("outerHTML");

                var _getRealLength3 = getRealLength(title),
                    _getRealLength4 = _slicedToArray(_getRealLength3, 2),
                    len = _getRealLength4[0],
                    index = _getRealLength4[1];

                if (len > 16) {
                    $(this).attr("title", title);
                    $(this).html(temp + title.substring(0, index) + "...");
                }
            });
        },
        // 时间条件搜索校验 @lable 提示的具体时间类型
        checkDate: function checkDate(selector) {
            var lable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

            var start = Date.parse(selector.find(".date-time-picker,.date-picker").first().val()),
                end = Date.parse(selector.find(".date-time-picker,.date-picker").last().val()),
                now = Date.now();
            if (!isNaN(start) && start > now) {
                if (selector.find(".date-time-picker").length === 0) {
                    toastr.info(lable + "Start time should be earlier than end time");
                } else {
                    toastr.info(lable + "开始时间不能大于当前时间");
                }
                return false;
            }
            if (!isNaN(start) && !isNaN(end) && start > end) {
                if (selector.find(".date-time-picker").length === 0) {
                    toastr.info(lable + "开始日期不能大于结束日期");
                } else {
                    toastr.info(lable + "开始时间不能大于结束时间");
                }
                return false;
            }
            return true;
        }
    };
}();

jQuery(document).ready(function () {
    App.init(); // init metronic core componets
});

// kingdom module wrapper =======================
if (seajs) {
    define(function (require, exports, module) {
        module.exports = App;
    });
}