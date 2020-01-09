define(function (require, exports, module) {
    require("toastr");

    $(function () {

        $("body").on("click", "#j_btn_download_apply", function (e) {
            e.preventDefault();
            // $("body").trigger("#j_license_upload_input","click");

            var params = {};
            $.kingdom.doKoauthAdminAPI("kingdom.krcs.get_auth_apply_file", "v4.0", params, function (response) {

                if (response && response.bcjson && response.bcjson.flag) {

                    var items = response.bcjson.items;
                    if (items && items[0]) {

                        var url = items[0].url;

                        if ($.trim(url) != "") {
                            window.location = "/retl/rest/admin/klcs/file/download?fileUrl=" + url;
                        }
                    }
                    //  console.log(response.bcjson);
                }
            });
        });

        //??????
        window.upload_file_get_info = function () {

            var params = {};
            $.kingdom.doKoauthAdminAPI("kingdom.krcs.get_auth_info", "v4.0", params, function (response) {

                if (response && response.bcjson && response.bcjson.flag) {

                    var flag = response.bcjson.flag;
                    if (flag && flag == "1") {
                        var item = response.bcjson.items[0];

                        if (item) {

                            $("#j_active_date").val(item.active_date);
                            $("#j_active_start_date").val(item.active_start_date);
                            $("#j_active_start_end").val(item.active_start_end);
                            $("#j_lcs_type").val(item.lcs_type);
                            $("#j_valide_start_date").val(item.valide_start_date);
                            $("#j_valide_start_end").val(item.valide_start_end);

                            var license_control_param_json = item.license_control_param;
                            var license_control_param_obj = $.parseJSON(license_control_param_json);
                            if (license_control_param_obj) {
                                $("#j_org_count").val(license_control_param_obj.org_count);
                                $("#j_report_count").val(license_control_param_obj.report_count);
                                $("#j_biz_depart_count").val(license_control_param_obj.biz_depart_count);
                            }
                        }
                    }
                }
            });
        };

        //????????
        window.upload_file_get_info(); //??????????


        //??????
        window.upload_file_cbfunc = function (response) {

            if (response && response.bcjson && response.bcjson.items && response.bcjson.items[0]) {
                var item = response.bcjson.items[0];
                if (item) {
                    var fileUrl = item.fileUrl;

                    if ($.trim(fileUrl) != "") {

                        var params = {};
                        params.fileUrl = fileUrl;
                        $.kingdom.doKoauthAdminAPI("kingdom.krcs.set_auth_file_parse", "v4.0", params, function (response) {

                            if (response && response.bcjson && response.bcjson.flag) {
                                var flag = response.bcjson.flag;
                                // toastr.info(response.bcjson.msg,'',{positionClass:'toast-top-center'});
                                //  window.upload_file_get_info(); //??????????
                                if (flag == "1") {
                                    window.upload_file_get_info(); //刷新页面授权显示信息
                                } else {
                                    toastr.error(response.bcjson.msg, '', { positionClass: 'toast-top-center' });
                                    // window.alert(response.bcjson.msg);
                                    //window.location.reload();
                                }
                            }
                        });
                    }
                }
            }

            // console.log(response);
        };

        $("#j_license_upload_input").change(function (e) {
            var file = $(this).val();
            if ($.trim(file) == "") {
                return;
            }
            var options = {
                url: "/retl/rest/admin/klcs/file/upload",
                type: "POST",
                dataType: "json",
                success: function success(data) {
                    var jsondata = {};
                    if (typeof data == "string") {
                        jsondata = eval('(' + data + ')');
                    } else {
                        jsondata = data;
                    }
                    if (window.upload_file_cbfunc) {
                        window.upload_file_cbfunc(jsondata);
                    }
                },
                error: function error(e) {
                    var jsondata = {};
                    if (typeof e.responseText == "string") {
                        jsondata = eval('(' + e.responseText + ')');
                    } else {
                        jsondata = e;
                    }
                    if (window.upload_file_cbfunc) {
                        window.upload_file_cbfunc(jsondata);
                    }
                }
            };
            $("#j_license_upload_form").ajaxSubmit(options);
        });

        $("#j_btn_upload_auth_file").click(function (e) {
            e.preventDefault();

            $("#j_license_upload_input").trigger("click");
        });

        //??????
        $("body").on("click", "#j_btn_download_auth_file", function (e) {
            e.preventDefault();
            // $("body").trigger("#j_license_upload_input","click");

            var params = {};
            $.kingdom.doKoauthAdminAPI("kingdom.krcs.get_auth_file", "v4.0", params, function (response) {

                if (response && response.bcjson && response.bcjson.flag) {

                    var items = response.bcjson.items;
                    if (items && items[0]) {

                        var fileUrl = items[0].fileUrl;

                        if ($.trim(fileUrl) != "") {
                            window.location = "/retl/rest/admin/klcs/file/download?fileUrl=" + fileUrl;
                        }
                    }
                    //  console.log(response.bcjson);
                }
            });
        });
    });
});