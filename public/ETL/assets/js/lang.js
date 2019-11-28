/*默认语言*/
var LANGUAGE_CODE = "en";
function loadProperties(type) {
    jQuery.i18n.properties({
    name: "i18n", // 资源文件名称
    path: "assets/i18n/", // 资源文件所在目录路径
    mode: "map", // 模式：变量或 Map
    language: type, // 对应的语言
    cache: false,
    encoding: "UTF-8",
    callback: function() {
        // 回调方法
        for (var i in $.i18n.map) {
        $(`[data-lang=${i}]`).text($.i18n.map[i]);
        }
        // $('[data-job-1]').text($.i18n.prop('job-1'));
    }
    });
}

$(document).ready(function(type) {
    loadProperties(LANGUAGE_CODE);
});