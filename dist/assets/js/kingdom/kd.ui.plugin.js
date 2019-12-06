$.extend({

    kd: {
        kdTimeout: null,
        kdInterval: null,
        kdLoadImage: function($obj, src, defaultImg, onLoaded) {
            var self = this;
            this.src = src;
            this.width = 0;
            this.height = 0;
            this.onLoaded = onLoaded;
            this.loaded = false;
            this.image = null;

            this.load = function() {
                if (this.loaded) return;
                this.image = new Image();
                this.image.src = this.src;

                function loadImage() {
                    if (/msie/.test(navigator.userAgent.toLowerCase()) && (self.width != 28 && self.height != 30 && self.width != 0 && self.height != 0) || !(/msie/.test(navigator.userAgent.toLowerCase())) && self.width != 0 && self.height != 0) {
                        clearTimeout(timeout);
                        clearInterval(interval);
                        self.loaded = true;
                        $obj.attr("src", src);
                        if (typeof self.onLoaded == "function") self.onLoaded(src);
                    }
                    self.width = self.image.width;
                    self.height = self.image.height;
                }
                var interval = setInterval(loadImage, 100);
                var timeout = setTimeout(function() {
                    clearInterval(interval);
                    $obj.attr("src", defaultImg);
                    if (typeof self.onLoaded == "function") self.onLoaded(defaultImg);
                }, 5000);
            }
        },

        kdValidateNull: function(id, msg) {
            if (id) {
                var $obj = $("#" + id);

                if ($obj.size() > 0 && $obj.eq(0).val().replace(/^ +| +$/g, '') == '') {
                    $.kd.kdMsg(msg, "error");
                    return true;
                }
            }
        },

        kdEllipsis: function($obj) {
            $obj.each(function(i) {
                var reg = /(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/;
                var $p = $("p", $(this)).eq(0),
                    text = $p.text(),
                    divH = $(this).height();

                var replaceTxt = function(t) {
                    var txt = t.substr(0, parseInt(t.length / 2));
                    $p.text(txt.replace(reg, "..."));
                    if ($p.outerHeight() > divH) {
                        replaceTxt(txt)
                    } else {
                        $p.text(t);
                        while ($p.outerHeight() > divH) $p.text($p.text().replace(reg, "..."));
                    }
                }

                replaceTxt(text);
            });
        },

        kdPager: {
            pager: 'page-area', // container id
            currentPage: 1, // 当前页码
            totalPage: 1, // 总页码
            totalRecords: 0, // 总数据条数
            isGoPage: true, // 是否显示页码跳转输入框
            isChangeSize: true, // 是否可改变显示条数
            isShowTotalPage: true, // 是否显示总页数
            isShowTotalRecords: true, // 是否显示总记录数
            prefix: '', // 链接前部
            suffix: '', // 链接尾部
            tagurl: '',
            getLink: function(n) {
                var former = "",
                    latter = "";
                if (typeof this.prefix == 'function') {
                    former = this.prefix(n);
                } else {
                    former = this.prefix;
                }

                if (typeof this.suffix == 'function') {
                    latter = this.suffix(n);
                } else {
                    latter = this.suffix;
                }

                return former + (latter ? "?" + latter : "");
            },

            inpage: function(vobj) { // 跳转框得到输入焦点时
                //alert(vobj);
                $('#btn_go_input').attr('hideFocus', true);
                $('#go_page_wrap').css('border-color', '#F50');
                //$('#btn_go').css('left', 0).show().animate({left: '+=34'}, 100);
            },

            outpage: function() { // 跳转框失去输入焦点时
                /*setTimeout(function() {
                	$('#btn_go').animate({left: '-=34'}, 100, function() {
                		$('#btn_go').css('left', 0).hide();
                		$('#go_page_wrap').css('border-color', '#DFDFDF');
                	});
                }, 400);
                */
            },

            gopage: function(vobj, vtotalpage, vtagurl) {
                var str_page = vobj.parentNode.children.btn_go_input.value;
                //var str_page = $("#btn_go_input").val();
                if (isNaN(str_page)) {
                    //$("#btn_go_input").val(this.next);
                    vobj.parentNode.children.btn_go_input.value = "1";
                    return;
                }
                var n = parseInt(str_page);
                if (n < 1 || n > vtotalpage) {
                    //$("#btn_go_input").val(this.next);
                    vobj.parentNode.children.btn_go_input.value = "1";
                    return;
                }
                if (isNaN(vtagurl)) {
                    window.location.href = vtagurl + n;
                } else {
                    window.location.href = this.getLink(n);

                }
            },

            init: function(config) {
                this.currentPage = isNaN(config.currentPage) ? 1 : parseInt(config.currentPage);
                this.totalPage = isNaN(config.totalPage) ? 1 : parseInt(config.totalPage);
                this.totalRecords = isNaN(config.totalRecords) ? 0 : parseInt(config.totalRecords);

                if (config.pager) this.pager = config.pager;
                if (config.isShowTotalPage) this.isShowTotalPage = config.isShowTotalPage;
                if (config.isShowTotalRecords) this.isShowTotalRecords = config.isShowTotalRecords;
                if (typeof config.isGoPage !== "undefined") this.isGoPage = config.isGoPage;
                if (typeof config.isChangeSize !== "undefined") this.isChangeSize = config.isChangeSize;
                this.prefix = config.prefix || '';
                this.suffix = config.suffix || '';
                this.tagurl = config.tagurl || '';
                if (this.currentPage < 1) this.currentPage = 1;
                this.totalPage = (this.totalPage <= 1) ? 1 : this.totalPage;
                if (this.currentPage > this.totalPage) this.currentPage = this.totalPage;
                this.prv = (this.currentPage <= 2) ? 1 : (this.currentPage - 1);
                this.next = (this.currentPage >= this.totalPage - 1) ? this.totalPage : (this.currentPage + 1);
                this.hasPrv = (this.currentPage > 1);
                this.hasNext = (this.currentPage < this.totalPage);
                this.inited = true;
                $.kd.kdPager.generPageHtml();
                return this;
            },

            checkKey: function(e) {
                if (e.keyCode == 13) {
                    $.kd.kdPager.gopage();
                    return true;
                } else if (e.keyCode < 48 || e.keyCode > 57) {
                    return false;
                }
            },

            generPageHtml: function() {
                if (!this.inited) return;

                var str_prv = [],
                    str_next = [];
                if (this.hasPrv) {
                    str_prv.push("<li class='prev'><a href='", this.getLink(this.prv), "' title='上一页'><i class='fa fa-angle-left'></i></a></li>");
                } else {
                    str_prv.push("<li class='disabled prev'><span><i class='fa fa-angle-left'></i></span></li>");
                }

                if (this.hasNext) {
                    str_next.push("<li class='next'><a href='", this.getLink(this.next), "' title='下一页'><i class='fa fa-angle-right'></i></a></li>");
                } else {
                    str_next.push("<li class='next disabled'><span><i class='fa fa-angle-right'></i></span></li>");
                }

                var str = [],
                    dot = "<li><span>...</span></li>",
                    total_info = [];
                if (this.isShowTotalPage || this.isShowTotalRecords) {
                    total_info.push("<span class='normalsize'>"+$.i18n.map['total']+"");
                    if (this.isShowTotalPage) {
                        total_info.push(this.totalPage, $.i18n.map['Page']);
                        this.isShowTotalRecords && total_info.push("&nbsp;/&nbsp;");
                    }
                    this.isShowTotalRecords && total_info.push(this.totalRecords, $.i18n.map['records-in-total']);

                    total_info.push("</span>");
                }

                var gopage_info = [];
                if (this.isGoPage) {
                	gopage_info.push("<label class='inline-block' style='vertical-align: top;line-height: 50px;margin: 0 10px;'> "+$.i18n.map['Jump-to']+" <input name='pager_number' value="+ this.currentPage +" type='text' style='height: 26px;width: 45px;text-align: center;'> "+$.i18n.map['Page']+" </label><button name='pager_number_btn' class='btn green' style='vertical-align: top;margin-top: 10px;'>"+$.i18n.map['CONFIRM']+"</button></div>");
                }

                if (this.totalPage <= 8) {
                    for (var i = 1; i <= this.totalPage; i++) {
                        if (this.currentPage == i) {
                            str.push("<li class='active'><span>", i, "</span></li>");
                        } else {
                            str.push("<li><a href='", this.getLink(i), "' title='第", i, "页'>", i, "</a></li>");
                        }
                    }
                } else {
                    if (this.currentPage <= 5) {
                        for (var i = 1; i <= 7; i++) {
                            if (this.currentPage == i) {
                                str.push("<li class='active'><span>", i, "</span></li>");
                            } else {
                                str.push("<li><a href='", this.getLink(i), "' title='第", i, "页'>", i, "</a></li>");
                            }
                        }
                        str.push(dot);
                        str.push("<li><a href='", this.getLink(this.totalPage), "' title='第", this.totalPage, "页'>", this.totalPage, "</a></li>");
                    } else {
                        str.push("<li><a href='", this.getLink(1), "' title='第1页'>1</a></li>");
                        str.push(dot);

                        var begin = this.currentPage - 2;
                        var end = this.currentPage + 2;
                        if (end > this.totalPage) {
                            end = this.totalPage;
                            begin = end - 4;
                            if (this.currentPage - begin < 2) begin = begin - 1;
                        } else if (end + 1 == this.totalPage) {
                            end = this.totalPage;
                        }
                        for (var i = begin; i <= end; i++) {
                            if (this.currentPage == i) {
                                str.push("<li class='active'><span>", i, "</span></li>");
                            } else {
                                str.push("<li><a href='", this.getLink(i), "' title='第", i, "页'>", i, "</a></li>");
                            }
                        }
                        if (end != this.totalPage) {
                            str.push(dot);
                            str.push("<li><a href='", this.getLink(this.totalPage), "' title='第", this.totalPage, "页'>", this.totalPage, "</a></li>");
                        }
                    }
                }
                //可自定义页面条数大小
                if (this.isChangeSize) {
                     $("#" + this.pager).html(
                  "<div class='col-md-4 col-sm-12' style='padding-top:8px;'><label style='padding-left:0px'>"+$.i18n.map['records-per-page']+"<select name='pager_size' style='margin-right: 5px;height: 26px;margin-top: 5px;width: 49px;'><option value='10'>10</option><option value='20'>20</option><option value='50'>50</option><option value='100'>100</option><option value='200'>200</option></select></label>" +
                  total_info.join("") + "</div><div class='col-md-8 col-sm-12 text-right'><ul class='pagination pagination-sm'>" + str_prv.join("") + str.join("") + str_next.join("") + "</ul>" + gopage_info.join(""));
                } else {
                    $("#" + this.pager).html("<div class='col-md-4 col-sm-12' style='padding-top:8px;'>" + total_info.join("") + gopage_info.join("") + "</div><div class='col-md-8 col-sm-12 text-right'><ul class='pagination'>" + str_prv.join("") + str.join("") + str_next.join("") + "</ul></div>");
                }
            }
        },

        showLoading: function($obj, txt) {
            $obj.after('<span id="kd-ui-loading" class="kdValidform_loading">' + (txt ? txt : '正在处理中') + '<span style="min-width: 15px"></span></span>');
            $.kd.kdInterval = setInterval(function() {
                if ($("#kd-ui-loading>span").text().length < 4) {
                    $("#kd-ui-loading>span").append(".")
                } else {
                    $("#kd-ui-loading>span").text("");
                }
            }, 500);
        },
        closeLoading: function() {
            clearInterval($.kd.kdInterval);
            $("#kd-ui-loading").remove();
            $("#iframepage").contents().find("#kd-ui-loading").remove()
        },
        tableShowLoading: function($obj) {
            $($obj).each(function() {
                var num = $(this).parents("table").find("thead th").size();
                var html = '<tr><td colspan="' + num + '"><div class="kd-loading"><div class="kd-loading-center"><div class="kd-loading-center-absolute"><div class="kd-object kd-object_one" ></div><div class="kd-object kd-object_two" ></div><div class="kd-object kd-object_three"></div></div></div></div></td></tr>'
                $(this).html(html);
            })
        }
    }
});
