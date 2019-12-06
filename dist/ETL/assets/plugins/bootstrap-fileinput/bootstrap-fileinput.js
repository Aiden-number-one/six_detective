/* ===========================================================
 * Bootstrap: fileinput.js v3.1.3
 * http://jasny.github.com/bootstrap/javascript/#fileinput
 * ===========================================================
 * Copyright 2012-2014 Arnold Daniels
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

+ function($) {
    "use strict";

    var isIE = window.navigator.appName == 'Microsoft Internet Explorer'

    // FILEUPLOAD PUBLIC CLASS DEFINITION
    // =================================

    var Fileinput = function(element, options) {
        this.$element = $(element)

        this.$input = this.$element.find(':file')
        if (this.$input.length === 0) return

        this.name = this.$input.attr('name') || options.name

        this.$hidden = this.$element.find('input[type=hidden][name="' + this.name + '"]')
        if (this.$hidden.length === 0) {
            this.$hidden = $('<input type="hidden">').insertBefore(this.$input)
        }

        this.$preview = this.$element.find('.fileinput-preview')
        var height = this.$preview.css('height')
        if (this.$preview.css('display') !== 'inline' && height !== '0px' && height !== 'none') {
            this.$preview.css('line-height', height)
        }

        this.original = {
            exists: this.$element.hasClass('fileinput-exists'),
            preview: this.$preview.html(),
            hiddenVal: this.$hidden.val()
        }

        this.listen()
    }

    Fileinput.prototype.listen = function() {
            this.$input.on('change.bs.fileinput', $.proxy(this.change, this))
            $(this.$input[0].form).on('reset.bs.fileinput', $.proxy(this.reset, this))

            this.$element.find('[data-trigger="fileinput"]').on('click.bs.fileinput', $.proxy(this.trigger, this))
            this.$element.find('[data-dismiss="fileinput"]').on('click.bs.fileinput', $.proxy(this.clear, this))
        },

        Fileinput.prototype.change = function(e) {
            var files = e.target.files === undefined ? (e.target && e.target.value ? [{ name: e.target.value.replace(/^.+\\/, '') }] : []) : e.target.files

            e.stopPropagation()

            if (files.length === 0) {
                this.clear()
                return
            }
            var acceptFileTpye = $(e.target).data("accept");
            var url = $(e.target).data("url");
            var filetype = files[0].name.substring(files[0].name.lastIndexOf(".") + 1).toUpperCase();           
            if (acceptFileTpye.indexOf(filetype) === -1) {
                toastr.info('请上传类型为' + acceptFileTpye + '的文件');
                return;
            }
            var _this = this;
            App.blockUI({
                boxed: true,
                message: "上传中..."
            });
            this.upload(e.target.form, url, function(data) {
                App.unblockUI();
                if (data.bcjson.flag == "0") {
                  toastr.error("Upload failed");
                  return;
                } else {
                  toastr.success("Upload successfully");
                }
                $("[name=fileName]").val(files[0].name);
                $("[name=fileType]").val(filetype.toLowerCase()).change();
                $("[name=fileUrl]").val(data.bcjson.msg);
                data.bcjson.items && $(e.target).siblings("[name=loginImgPath],[name=iconImgPath],[name=logoImgPath],[name=loginLogoPath]").val(data.bcjson.items[0].absolutePath);
                _this.$hidden.val('')
                _this.$hidden.attr('name', '')
                _this.$input.attr('name', _this.name)

                var file = files[0]

                if (_this.$preview.length > 0 && (typeof file.type !== "undefined" ? file.type.match(/^image\/(gif|png|jpeg)$/) : file.name.match(/\.(gif|png|jpe?g)$/i)) && typeof FileReader !== "undefined") {
                    var reader = new FileReader()
                    var preview = _this.$preview
                    var element = _this.$element

                    reader.onload = function(re) {
                        var $img = $('<img>')
                        $img[0].src = re.target.result
                        files[0].result = re.target.result

                        element.find('.fileinput-filename').text(file.name)

                        // if parent has max-height, using `(max-)height: 100%` on child doesn't take padding and border into account
                        if (preview.css('max-height') != 'none') $img.css('max-height', parseInt(preview.css('max-height'), 10) - parseInt(preview.css('padding-top'), 10) - parseInt(preview.css('padding-bottom'), 10) - parseInt(preview.css('border-top'), 10) - parseInt(preview.css('border-bottom'), 10))

                        preview.html($img)
                        element.addClass('fileinput-exists').removeClass('fileinput-new')

                        element.trigger('change.bs.fileinput', files)
                    }

                    reader.readAsDataURL(file)
                } else {
                    _this.$element.find('.fileinput-filename').text(file.name)
                    _this.$preview.text(file.name)

                    _this.$element.addClass('fileinput-exists').removeClass('fileinput-new')

                    _this.$element.trigger('change.bs.fileinput')
                }
            });


        },

        Fileinput.prototype.clear = function(e) {
            if (e) e.preventDefault()

            this.$hidden.val('')
            this.$hidden.attr('name', this.name)
            // this.$element.find('[name=fileUrl]').val("");

            //ie8+ doesn't support changing the value of input with type=file so clone instead
            if (isIE) {
                var inputClone = this.$input.clone(true);
                this.$input.after(inputClone);
                this.$input.remove();
                this.$input = inputClone;
            } else {
                this.$input.val('')
            }

            this.$preview.html('')
            this.$element.find('.fileinput-filename').text('')
            this.$element.addClass('fileinput-new').removeClass('fileinput-exists')

            if (e !== undefined) {
                this.$input.trigger('change')
                this.$element.trigger('clear.bs.fileinput')
            }
        },

        Fileinput.prototype.reset = function() {
            this.clear()

            this.$hidden.val(this.original.hiddenVal)
            this.$preview.html(this.original.preview)
            this.$element.find('.fileinput-filename').text('')

            if (this.original.exists) this.$element.addClass('fileinput-exists').removeClass('fileinput-new')
            else this.$element.addClass('fileinput-new').removeClass('fileinput-exists')

            this.$element.trigger('reset.bs.fileinput')
        },

        Fileinput.prototype.trigger = function(e) {
            this.$input.trigger('click')
            e.preventDefault()
        },

        Fileinput.prototype.upload = function(formDom, url, cbfunc) { //上传
            var options = {
                url: "/superlop/rest/admin/v2.0/" + url,
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
                        //若返回0000，则显示弹出框显示具体信息
                        if (data.bcjson.flag == "0000") {
                            //传入前端逻辑处理以flag为0，处理
                            var errorData = {
                                bcjson: {
                                    flag: "0",
                                    msg: data.bcjson.items[0].message
                                }
                            };
                            cbfunc(errorData);
                            if ($("#catch-error-basic-modal").css("display") === "block") {
                                return false;
                            }
                            $(".bootbox-confirm").hide();
                            $(".modal-backdrop").hide();
                            App.unblockUI();
                            $("#catch-error-basic-modal").modal("show");
                            var params = {};
                            //失败信息
                            $("#catch-error-basic-msg").html(data.bcjson.items[0].message);
                            //请求入参及请求参数
                            var paramApi = "请求API: " + options.url + ",<br />";
                            //异常堆栈信息
                            if (data.bcjson.msg) {
                                $("#catch-error-detail-msg").html(paramApi + data.bcjson.msg.replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;'));
                            } else {
                                $("#catch-error-detail-msg").html("");
                            }
                            return false;
                        } else {
                            cbfunc(data);
                        }
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
                        //若返回0000，则显示弹出框显示具体信息
                        if (data.bcjson.flag == "0000") {
                            //传入前端逻辑处理以flag为0，处理
                            var errorData = {
                                bcjson: {
                                    flag: "0",
                                    msg: data.bcjson.items[0].message
                                }
                            };
                            cbfunc(errorData);
                            if ($("#catch-error-basic-modal").css("display") === "block") {
                                return false;
                            }
                            $(".bootbox-confirm").hide();
                            $(".modal-backdrop").hide();
                            App.unblockUI();
                            $("#catch-error-basic-modal").modal("show");
                            var params = {};
                            //失败信息
                            $("#catch-error-basic-msg").html(data.bcjson.items[0].message);
                            //请求入参及请求参数
                            var paramApi = "请求API: " + options.url + ",<br />";
                            //异常堆栈信息
                            if (data.bcjson.msg) {
                                $("#catch-error-detail-msg").html(paramApi + data.bcjson.msg.replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;'));
                            } else {
                                $("#catch-error-detail-msg").html("");
                            }
                            return false;
                        } else {
                            cbfunc(data);
                        }
                    }
                }
            };
            $(formDom).ajaxSubmit(options);
        } //upload

    // FILEUPLOAD PLUGIN DEFINITION
    // ===========================

    var old = $.fn.fileinput

    $.fn.fileinput = function(options) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('bs.fileinput')
            if (!data) $this.data('bs.fileinput', (data = new Fileinput(this, options)))
            if (typeof options == 'string') data[options]()
        })
    }

    $.fn.fileinput.Constructor = Fileinput


    // FILEINPUT NO CONFLICT
    // ====================

    $.fn.fileinput.noConflict = function() {
        $.fn.fileinput = old
        return this
    }


    // FILEUPLOAD DATA-API
    // ==================

    $(document).on('click.fileinput.data-api', '[data-provides="fileinput"]', function(e) {
        var $this = $(this)
        if ($this.data('bs.fileinput')) return
        $this.fileinput($this.data())

        var $target = $(e.target).closest('[data-dismiss="fileinput"],[data-trigger="fileinput"]');
        if ($target.length > 0) {
            e.preventDefault()
            $target.trigger('click.bs.fileinput')
        }
    })

}(window.jQuery);