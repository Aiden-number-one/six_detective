define(function(require, exports, module) {
  var showContent = require("./data-drivenShow");
  require("plugins/jquery-validation/js/jquery.validate.js");
  require("plugins/jquery-validation/js/additional-methods.js");
  var init = {
    load: function() {
      showContent._load(); //加载页面数据
      var oBar = document.getElementById("J_drag_bar6");
      var oTarget = document.getElementById("J_drag_bar6");
      startDrag(oBar, oTarget, ".left-side-driven", ".right-content-driven", function () {
          LFWIDTH = $('.left-side').width();
         
      });
    }
  };
  $(function() {
    
    //数据驱动 -> 左边数据列表查询（enter 及 按钮）
    $("body").on("keydown","#data-driven #J_dd_list_search",function(event){
      if(event.keyCode ==13){
        $("#data-driven #dd-search").click();
      }
    });
    
    $("body").on("click","#data-driven #dd-search",function(){
      var value = $(this).siblings("input").val();
      showContent.get_Driven_List(value);
    });

    $("body").on("click","#data-driven #dd-clear-button",function(){
      $("#driven_Data_View_Detail").html('<tr><td colspan="4" class="t-c">暂无</td></tr>');
      App.clearForm("driven-datatable-view");
    });

    $("body").on("click", "#filebutton", function(){
      $("#dd-inputfile").click();
    })

    $("body").on("click", "#filebutton-add", function(){
      $("#dd-inputfile-add").click();
    })

    $("body").on("change", "#dd-inputfile-add", function(e) {
      $("#filename-add").text(e.target.value.match(/[^\\]+(?!.*\\)/) || "Please select a file")
    })

    $("body").on("change", "#dd-inputfile", function(e) {
      $("#filename").text(e.target.value.match(/[^\\]+(?!.*\\)/) || "Please select a file")
    })

    // 点击新增驱动按钮
    $("body").on("click", "#dd-driven-add-modal", function() {
      //清空上一个新增驱动弹出框中的filename、currentAddress和filetype、清空文件上传表单的form
      showContent.fileNameAdd = "";
      showContent.typeAdd = "";
      showContent.currentAddressAdd = "";
      var inputFileParent = $("#dd-inputfile-add").parent("div");
      $("#dd-inputfile-add").remove();
      $("#filebutton-add").remove();
      $("#filename-add").remove();
      inputFileParent.append(
        '<input id="dd-inputfile-add" type="file" name="file" style="display: none;">'
        + '<input type="button" id="filebutton-add" value="Select JAR">'
        + '<span id="filename-add">Please select a file</span>'
        
      );
      showContent.setAddressList(showContent.currentAddressAdd, "addtrue");

      $("#data-driven-add").modal("show");
    });
    // 点击数据源加载右边表格数据
    $("body").on("click", "#data-driven-menu li", function() {
      App.clearForm("datatable_update");
      //清空showcontent的filename、currentAddress和filetype、清空文件上传表单的form
      showContent.fileName = "";
      showContent.type = "";
      showContent.currentAddress = "";
      showContent.driverId = "";
      var inputFileParent = $("#dd-inputfile").parent("div");
      $("#dd-inputfile").remove();
      $("#filebutton").remove();
      $("#filename").remove();
      inputFileParent.append(
        '<input id="dd-inputfile" type="file" name="file" style="display: none;">'
        + '<input type="button" id="filebutton" value="Select JAR">'
        + '<span id="filename">Please select a file</span>'
      );

      var _this = $(this);
      var _driverName = _this.find("strong").html();
      $(".r-container-header")
        .find("h5")
        .html(_driverName);
      $(".r-container-header img").attr("src", _this.find("img").attr("src"));
      $(this).addClass("click-add-background");
      $(this)
        .siblings()
        .removeClass("click-add-background");
      $.each(showContent.list, function(i, item) {
        
        if (_driverName == item.driverName) {
          $("#resourceType").val(item.databasetype);
          $("#driver_category").val(item.driver_category);
          $("#driven-datatable-view input[name=driver_name]").val(
            item.driverName
          );
          $("#driven-datatable-view input[name=class_name]").val(
            item.className
          );
          $("#driven-datatable-view input[name=url_info]").val(item.urlInfo);
          $("#driven-datatable-view input[name=db_port]").val(item.dbPort);
          $("#driven-datatable-view input[name=maxtime]").val(item.maxtime);

          showContent.driverId = item.driverId;
          showContent.currentAddress = item.address;
          showContent.setAddressList(item.address);
        }
      });
    });

    // 新增驱动提交
    $("body").on("click", "#driven_add_submit", function() {
      if (
        $("#driven-Add-Form")
          .validate()
          .form()
      ) {
        if (!showContent.currentAddressAdd) {
          toastr.info("Please upload a Jar file！");
          return;
        }
        $("#data-driven-add").modal("hide");
        var params = App.getFormParams("driven-Add-Form");
        params.address = showContent.currentAddressAdd;
        App.blockUI({
          boxed: true,
          message: "新增中..."
        });
        showContent.addDrivenlist(params);
      }
    });

    // 删除驱动
    $("body").on("click", "#data-driven-menu  li span", function() {
      var params = {};
      params.opType = "del";
      params.driver_id = $(this).attr("driver_id");
      bootbox.confirm("Please confirm to delete.", function(result) {
        if (result) {
          App.blockUI({
            boxed: true,
            message: "deleting..."
          });
          showContent.deleteDriven(params);
        }
      });
    });

    //新增页面下的操作

    //增添jar包按钮
    $("body").on("click", "#dd-jaradd-btn-add", function() {
      $("#data-driven-add-file-add").modal("show");
    });

    //获取上传jar包的文件名及文件类型
    $("body").on("change", "#dd-inputfile-add", function(data) {
      showContent.fileNameAdd = data.currentTarget.files[0].name;
      showContent.typeAdd = showContent.fileNameAdd.substring(
        showContent.fileNameAdd.length - 3,
        showContent.fileNameAdd.length
      );
    });

    //点击上传按钮
    $("body").on("click", "#dd-upfilejar-btn-add", function() {
      if (!showContent.typeAdd) {
        toastr.info("Please upload a Jar file！");
        return false;
      }
      if (showContent.typeAdd !== "jar") {
        toastr.info("File type is incorrect, please upload a Jar file.");
        showContent.typeAdd = "";
        $("#filename-add").text("Please select a file");
        $("#dd-inputfile-add").val("");
        return false;
      }
      App.blockUI({
        boxed: true,
        message: "Uploading..."
      });
      showContent.upLoad(showContent.fileNameAdd, "addtrue");
    });

    //删除jar包
    $("body").on("click", "#data_Table02_Detail .delete-jar", function() {
      var deletecIndex = $(this);
      bootbox.confirm("Please confirm to delete.", function(result) {
        if (result) {
          var index = deletecIndex
            .parent("td")
            .data("index");
          var addrenssArray = showContent.currentAddressAdd.split(",");
          addrenssArray.splice(index - 1, 1);
          showContent.currentAddressAdd = addrenssArray.join(",");
          showContent.setAddressList(showContent.currentAddressAdd, "addtrue");
        }
      });
    });

    //更新页面下的操作

    //增添jar包按钮
    $("body").on("click", "#dd-jaradd-btn", function() {
      $("#data-driven-add-file").modal("show");
    });

    //获取上传jar包的文件名及文件类型
    $("body").on("change", "#dd-inputfile", function(data) {
      debugger;
      showContent.fileName = data.currentTarget.files[0].name;
      showContent.type = showContent.fileName.substring(
        showContent.fileName.length - 3,
        showContent.fileName.length
      );
    });

    //点击上传按钮
    $("body").on("click", "#dd-upfilejar-btn", function() {
      debugger;
      if (!showContent.type) {
        toastr.info("Please upload a Jar file！");
        return false;
      }
      if (showContent.type !== "jar") {
        toastr.info("File type is incorrect, please upload a Jar file.");
        showContent.type = "";
        $("#filename").text("Please select a file");
        $("#dd-inputfile").val("");
        return false;
      }
      App.blockUI({
        boxed: true,
        message: "Uploading..."
      });
      showContent.upLoad(showContent.fileName);
    });

    //删除jar包
    $("body").on("click", "#driven_Data_View_Detail .delete-jar", function() {
      var deletecIndex = $(this);
      bootbox.confirm("Please confirm to delete.", function(result) {
        if (result) {
          var index = deletecIndex
            .closest("td")
            .data("index");
          var addrenssArray = showContent.currentAddress.split(",");
          addrenssArray.splice(index - 1, 1);
          showContent.currentAddress = addrenssArray.join(",");
          showContent.setAddressList(showContent.currentAddress);
        }
      });
    });

    //更新驱动信息
    $("body").on("click", "#dd-update-button", function(data) {
      if (
        $("#driven-datatable-view")
          .validate()
          .form()
      ) {
        var paramsMap = App.getFormParams("datatable_update");
        paramsMap.address = showContent.currentAddress;
        if (!paramsMap.address) {
          toastr.info("请添加jAR包");
          return;
        }
        paramsMap.driver_id = showContent.driverId;
        showContent.updateDriven(paramsMap);
      }
    });
  });
  module.exports = init;
});
