define(function(require,exports,module){require("plugins/drag/kd_drag.js");var showContent={list:[],_load:function(){App.handleDatePickers(),showContent.initForm(),showContent.getResourceOption({dictValue:"DATABASETYPE"},function(){showContent.getDrivenOption({dictValue:"CATEGORY"},function(){showContent.get_Driven_List()})})},get_Driven_List:function(e){var t=e?{driverName:e}:{};$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_data_driver_info","v4.0",t,function(e){var r=e.bcjson.items||e.bcjson;showContent.list=r,"1"==e.bcjson.flag&&r&&require.async("./template/data-driven-list.handlebars",function(e){if($("#data-driven-menu").html(e(r)),!r[0])return!1;var t=r[0].driverName;$(".r-container-header").find("h5").html(t),$("#data-driven-menu li:first").click()})})},addDrivenlist:function(e){var t=$.extend({opType:"add"},e);$.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_data_driver_info","v4.0",t,function(e){App.unblockUI();var t=e.bcjson;"0"==t.flag?toastr.error(t.msg):(toastr.success(t.msg),App.clearForm("driven-Add-Form"),showContent.get_Driven_List())})},updateDriven:function(e){var t=$.extend({opType:"upd"},e);$.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_data_driver_info","v4.0",t,function(e){App.unblockUI();var t=e.bcjson;"1"==t.flag?toastr.success("更新成功"):toastr.error(t.msg)})},deleteDriven:function(e){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.set_data_driver_info","v4.0",e,function(e){App.unblockUI();var t=e.bcjson;"0"==t.flag?toastr.error(t.msg):(toastr.success(t.msg),showContent.get_Driven_List())})},getResourceOption:function(e,o){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_dict_data_list","v4.0",e,function(e){var t=e.bcjson.items||e.bcjson;t=t[0].DATABASETYPE;var r="<option value=''>--请选择--</option>";if("1"==e.bcjson.flag&&t){for(var n in t)r+="<option value="+n+">"+t[n]+"</option>";$("#resourceType").html(r),$("#resourceType2").html(r),"function"==typeof o&&o()}})},getDrivenOption:function(e,o){$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_all_dict_data_list","v4.0",e,function(e){var t=e.bcjson.items||e.bcjson;t=t[0].CATEGORY;var r="<option value=''>--请选择--</option>";if("1"==e.bcjson.flag&&t){for(var n in t)r+="<option value="+n+">"+t[n]+"</option>";$("#driver_category").html(r),$("#driver_category2").html(r),"function"==typeof o&&o()}})},upLoad:function(address,addtrue){var options={url:window.location.origin+"/superlop/restv2/admin/v2.0/bayconnect.superlop.file_upload.json",type:"POST",dataType:"json",success:function success(data){App.unblockUI(),"string"==typeof data&&(data=eval("("+data+")")),"addtrue"===addtrue?(showContent.currentAddressAdd=showContent.currentAddressAdd?showContent.currentAddressAdd+","+address:address,showContent.setAddressList(showContent.currentAddressAdd,addtrue)):(showContent.currentAddress=showContent.currentAddress?showContent.currentAddress+","+address:address,showContent.setAddressList(showContent.currentAddress))},error:function(){App.unblockUI(),toastr.info("上传失败")}};"addtrue"===addtrue?$("#dd-uploadFileForm_params-add").ajaxSubmit(options):$("#dd-uploadFileForm_params").ajaxSubmit(options)},setAddressList:function(e,t){var r=[],n=1,o=[];e&&(r=e.split(","));var a=!0,i=!1,s=void 0;try{for(var d,u=r[Symbol.iterator]();!(a=(d=u.next()).done);a=!0){var c=d.value,l={};l.address=c,l.index=n,o.push(l),n++}}catch(e){i=!0,s=e}finally{try{!a&&u.return&&u.return()}finally{if(i)throw s}}0===o.length&&(o={flag:1}),"addtrue"===t?require.async("./template/data-driven-file.handlebars",function(e){$("#data_Table02_Detail").html(e(o))}):require.async("./template/data-driven-file.handlebars",function(e){$("#driven_Data_View_Detail").html(e(o))})},initForm:function(){$("#driven-Add-Form").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{databasetype:{required:!0},driver_category:{required:!0},driver_name:{required:!0,maxlength:64},class_name:{required:!0,maxlength:100},url_info:{required:!0,maxlength:100},db_port:{required:!0,maxlength:32,numCheck:!0},maxtime:{required:!0,maxlength:32,numCheck:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}}),$("#driven-datatable-view").validate({debug:!0,errorElement:"span",errorClass:"help-block",focusInvalid:!1,rules:{databasetype:{required:!0},driver_category:{required:!0},driver_name:{required:!0,maxlength:64},class_name:{required:!0,maxlength:100},url_info:{required:!0,maxlength:100},db_port:{required:!0,maxlength:32,numCheck:!0},maxtime:{required:!0,maxlength:32,numCheck:!0}},invalidHandler:function(){},highlight:function(e){$(e).closest(".form-group").addClass("has-error")},success:function(e){e.closest(".form-group").removeClass("has-error"),e.remove()},errorPlacement:function(e,t){e.insertAfter(t)},submitHandler:function(){}})}};module.exports=showContent});