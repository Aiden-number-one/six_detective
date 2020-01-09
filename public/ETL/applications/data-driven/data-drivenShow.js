define(function (require, exports, module) {
  //var apiname = require("js/global/api_name");
  require("plugins/drag/kd_drag.js");
  var showContent = {};
  showContent.list = [];
  showContent._load = function () {
    App.handleDatePickers();
    showContent.initForm();
    showContent.getResourceOption({ "dictValue": "DATABASETYPE" }, function () {
      showContent.getDrivenOption({ "dictValue": "CATEGORY" }, function () {
        showContent.get_Driven_List();
      });
    });
  };
  //查询驱动信息
  showContent.get_Driven_List = function (val) {
    var paramsMap = val ? { driverName: val } : {};
    $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_driver_info", "v4.0", paramsMap, function (data) {
      var items = data.bcjson.items || data.bcjson;
      showContent.list = items;
      if (data.bcjson.flag == "1" && items) {
        require.async("./template/data-driven-list.handlebars", function (compiled) {
          $("#data-driven-menu").html(compiled(items));
          if (!items[0]) {
            return false;
          }
          var driverName = items[0].driverName;
          $(".r-container-header").find("h5").html(driverName);
          $("#data-driven-menu li:first").click();
        });
      }
    });
  };
  // 新增驱动信息
  showContent.addDrivenlist = function (params) {
    var paramsMap = $.extend({ opType: "add" }, params);
    $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_data_driver_info", "v4.0", paramsMap, function (data) {
      App.unblockUI();
      var items = data.bcjson;
      if (items.flag == "0") {
        toastr.error(items.msg);
      } else {
        //新增后清空以前数据
        //$("#addReceivbleForm input").val("");
        toastr.success(items.msg);
        App.clearForm("driven-Add-Form");
        showContent.get_Driven_List();
      }
    });
  };
  //更新驱动信息
  showContent.updateDriven = function (params) {
    var paramsMap = $.extend({ opType: "upd" }, params);
    $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_data_driver_info", "v4.0", paramsMap, function (data) {
      App.unblockUI();
      var items = data.bcjson;
      if (items.flag == "1") {
        toastr.success("Succeed");
      } else {
        toastr.error(items.msg);
      }
    });
  };
  // 删除驱动信息
  showContent.deleteDriven = function (params) {
    $.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_data_driver_info", "v4.0", params, function (data) {
      App.unblockUI();
      var items = data.bcjson;
      if (items.flag == "0") {
        toastr.error(items.msg);
      } else {
        //新增后清空以前数据
        //$("#addReceivbleForm input").val("");
        toastr.success(items.msg);
        showContent.get_Driven_List();
      }
    });
  };
  //获取资源类型字典
  showContent.getResourceOption = function (params, cb) {
    $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_dict_data_list", "v4.0", params, function (data) {
      var items = data.bcjson.items || data.bcjson;
      items = items[0].DATABASETYPE;
      var html = "<option value=''>--Please select a type--</option>";
      if (data.bcjson.flag == "1" && items) {
        for (var i in items) {
          html += "<option value=" + i + ">" + items[i] + "</option>";
        }
        $("#resourceType").html(html);
        $("#resourceType2").html(html);
        typeof cb === "function" && cb();
      }
    });
  };
  // 获取驱动类型字典
  showContent.getDrivenOption = function (params, cb) {
    $.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_dict_data_list", "v4.0", params, function (data) {
      var items = data.bcjson.items || data.bcjson;
      items = items[0].CATEGORY;
      var html = "<option value=''>--Please select a type--</option>";
      if (data.bcjson.flag == "1" && items) {
        for (var i in items) {
          html += "<option value=" + i + ">" + items[i] + "</option>";
        }
        $("#driver_category").html(html);
        $("#driver_category2").html(html);
        typeof cb === "function" && cb();
      }
    });
  };
  //上传jar包
  showContent.upLoad = function (address, addtrue) {
    //addtrue 用于判断是否从增添驱动弹出框中上传
    var options = {
      url: window.location.origin + "/superlop/restv2/admin/v2.0/bayconnect.superlop.file_upload.json",
      type: "POST",
      dataType: "json",
      success: function success(data) {
        App.unblockUI();
        if (typeof data == "string") {
          data = eval("(" + data + ")");
        }
        if (addtrue === "addtrue") {
          showContent.currentAddressAdd = showContent.currentAddressAdd ? showContent.currentAddressAdd + "," + address : address;
          showContent.setAddressList(showContent.currentAddressAdd, addtrue);
        } else {
          showContent.currentAddress = showContent.currentAddress ? showContent.currentAddress + "," + address : address;
          showContent.setAddressList(showContent.currentAddress);
        }
      },
      error: function error(e) {
        App.unblockUI();
        toastr.info("Fail");
      }
    };
    if (addtrue === "addtrue") {
      $("#dd-uploadFileForm_params-add").ajaxSubmit(options);
    } else {
      $("#dd-uploadFileForm_params").ajaxSubmit(options);
    }

    showContent.type = "";
    showContent.typeAdd = "";
    $("#filename").text("Please select a file");
    $("#filename-add").text("Please select a file");
    $("#dd-inputfile").val("");
    $("#dd-inputfile-add").val("");
  };

  showContent.setAddressList = function (data, addtrue) {
    //addtrue 用于判断渲染出的列表是否是出现新增弹出框中

    //获取jar包列表
    var jarArray = [];
    var index = 1;
    var jarCollection = [];

    if (data) {
      jarArray = data.split(",");
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = jarArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var singleJar = _step.value;

        var jarInfoObj = {};
        jarInfoObj.address = singleJar;
        jarInfoObj.index = index;
        jarCollection.push(jarInfoObj);
        index++;
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

    if (jarCollection.length === 0) {
      jarCollection = { flag: 1 };
    }
    if (addtrue === "addtrue") {
      require.async("./template/data-driven-file.handlebars", function (compiled) {
        $("#data_Table02_Detail").html(compiled(jarCollection));
      });
    } else {
      require.async("./template/data-driven-file.handlebars", function (compiled) {
        $("#driven_Data_View_Detail").html(compiled(jarCollection));
      });
    }
  };

  //表单校验
  showContent.initForm = function () {
    $("#driven-Add-Form").validate({
      debug: true,
      errorElement: "span", //default input error message container
      errorClass: "help-block", // default input error message class
      focusInvalid: false, // do not focus the last invalid input
      rules: {
        databasetype: {
          required: true
        },
        driver_category: {
          required: true
        },
        driver_name: {
          required: true,
          maxlength: 64
        },
        class_name: {
          required: true,
          maxlength: 100
        },
        url_info: {
          required: true,
          maxlength: 100
        },
        db_port: {
          required: true,
          maxlength: 32,
          numCheck: true
        },
        maxtime: {
          required: true,
          maxlength: 32,
          numCheck: true
        }
      },
      invalidHandler: function invalidHandler(event, validator) {
        //display error alert on form submit
        // $('.alert-danger', $('.login-form')).show();
      },
      highlight: function highlight(element) {
        // hightlight error inputs
        $(element).closest(".form-group").addClass("has-error"); // set error class to the control group
      },
      success: function success(label) {
        label.closest(".form-group").removeClass("has-error");
        label.remove();
      },
      errorPlacement: function errorPlacement(error, element) {
        error.insertAfter(element);
      },
      submitHandler: function submitHandler(form) {}
    });

    $("#driven-datatable-view").validate({
      debug: true,
      errorElement: "span", //default input error message container
      errorClass: "help-block", // default input error message class
      focusInvalid: false, // do not focus the last invalid input
      rules: {
        databasetype: {
          required: true
        },
        driver_category: {
          required: true
        },
        driver_name: {
          required: true,
          maxlength: 64
        },
        class_name: {
          required: true,
          maxlength: 100
        },
        url_info: {
          required: true,
          maxlength: 100
        },
        db_port: {
          required: true,
          maxlength: 32,
          numCheck: true
        },
        maxtime: {
          required: true,
          maxlength: 32,
          numCheck: true
        }
      },
      invalidHandler: function invalidHandler(event, validator) {
        //display error alert on form submit
        // $('.alert-danger', $('.login-form')).show();
      },
      highlight: function highlight(element) {
        // hightlight error inputs
        $(element).closest(".form-group").addClass("has-error"); // set error class to the control group
      },
      success: function success(label) {
        label.closest(".form-group").removeClass("has-error");
        label.remove();
      },
      errorPlacement: function errorPlacement(error, element) {
        error.insertAfter(element);
      },
      submitHandler: function submitHandler(form) {}
    });
  };

  module.exports = showContent;
});