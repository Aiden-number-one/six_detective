
if (typeof jQuery === "undefined") {
    throw new Error("Kingdom requires jQuery");
}

var Kingdom = Kingdom || {};
Kingdom.Tool = Kingdom.Tool || {};

Kingdom.Tool.bindSelect = function (selectNode, dataList, textKey, valuekey) {
    var arrayList = [];

    arrayList.push($("<option/>").val("").text("请选择"));

    $.each(dataList, function (idx, obj) {
        var text1 = obj[textKey];
        var value2 = obj[valuekey];
        arrayList.push($("<option/>").val(value2).text(text1));
    });

    $(selectNode).empty();
    $(selectNode).append(arrayList);
};