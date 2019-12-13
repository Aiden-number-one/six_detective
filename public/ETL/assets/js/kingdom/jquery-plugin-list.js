

var jquery_plugin_list = jquery_plugin_list || {} 

 

if ( seajs) {
	define(function(require, exports, module) {

//=============jquery  and bootstrap
                  // require("jquery"); 

                  require("validate");
                  require("validation-additional-methods");


                   require("bootstrap");

 //============== jquery plugin                  

                  require("backstretch");

                      //require("js/global/datatable");
    //require("plugins/datatables/plugins/bootstrap/datatables.bootstrap");
    require("plugins/counterup/jquery.waypoints.min");
    require("plugins/counterup/jquery.counterup");
    require("plugins/form/jquery.form");
    require("uniform");
    require("datatables");
    
    require("plugins/sortable/jquery.sortable");
    require("plugins/jquery-validation/js/additional-methods");
    require("plugins/jquery-validation/js/localization/messages_zh.min");


    require("cookie");

   require("plugins/bootbox/bootbox.min");
   require("blockui");

   require("plugins/codemirror/codemirror");
   
 //==================jquery bootstrap

  require("bootstrap-summernote");

      require("bootstrap-timepicker");
    require("bootstrap-datepicker");
     require("bootstrap-datepicker-zh-CN");

    

    // require("plugins/bootstrap-select/bootstrap-select.js");
    require("toastr");

    require("plugins/fullcalendar/moment.min");


  jquery_plugin_list.jquery = jQuery;
  jquery_plugin_list.$ = $ ;




    




	 module.exports = jquery_plugin_list;
	});
}