Handlebars.registerHelper('fileserver', function() { // 返回文件服务器
    //return $.kingdom.kconfig().fileserver;
    return $.kingdom.kconfig().fileserver;
});
Handlebars.registerHelper('plus', function(num1, num2, fix) { // 加法
    var result = parseFloat(num1) + parseFloat(num2);
    fix = parseFloat(fix);
    if (fix >= 0) {
        result = result.toFixed(fix);
    }
    return result;
});
Handlebars.registerHelper('minus', function(num1, num2, fix) { // 减法
    var result = parseFloat(num1) - parseFloat(num2);
    fix = parseFloat(fix);
    if (fix >= 0) {
        result = result.toFixed(fix);
    }
    return result;
});
Handlebars.registerHelper('bigminus', function(num1, num2, fix) { // 大数字的减法精确计算的bug
    var num11, num22, m;
    try {
        num11 = num1.toString().split('.').length;
    } catch (e) {
        num11 = 0;
    }
    try {
        num22 = num2.toString().split('.').length;
    } catch (e) {
        num22 = 0;
    }
    m = Math.pow(10, Math.max(num11, num22));
    if (fix >= 0) {
        return ((num1 * m - num2 * m) / m).toFixed(fix >= 0 ? fix : 0);
    } else {
        return ((num1 * m - num2 * m) / m);
    }
});
Handlebars.registerHelper('times', function(num1, num2, fix) { // 乘法
    var result = parseFloat(num1) * parseFloat(num2);
    fix = parseFloat(fix);
    if (fix >= 0) {
        result = result.toFixed(fix);
    }
    return result;
});
Handlebars.registerHelper('division', function(num1, num2, fix) { // 除法
    var result = parseFloat(num1) / parseFloat(num2);
    fix = parseFloat(fix);
    if (fix >= 0) {
        result = result.toFixed(fix);
    }
    return result;
});

Handlebars.registerHelper("nulltips", function(item, result) { //如果为空，给默认值
    if (item == "" || item == undefined) {
        return result;
    } else {
        return item;
    }
});

Handlebars.registerHelper("equal", function(v1, v2, options) { //判断是否相等
    if (v1 == v2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper("greaterThan", function(v1, v2, options) { //判断是否大于
    v1 = parseFloat(v1);
    v2 = parseFloat(v2);
    if (v1 > v2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

//时间 格式化(HH:mm:ss)
Handlebars.registerHelper("timeFormatHelper", function(sbsj) {
    if (!sbsj) {
        return "";
    }
    var sbsj = sbsj.toString();
    if (sbsj.length < 6)
        sbsj = "0" + sbsj;
    return sbsj.substring(0, 2) + ":" + sbsj.substring(2, 4) + ":" + sbsj.substring(4, 6);
});
//日期 格式化（MM-dd）
Handlebars.registerHelper("dateMonthFormatHelper", function(sbsj) {
    if (!sbsj) {
        return "";
    }
    var sbsj = sbsj.toString();
    return sbsj.substring(4, 6) + "-" + sbsj.substring(6, 8);
});
//日期 格式化(yyyy-MM-dd)
Handlebars.registerHelper("dateFormatHelper", function(sbsj) {
    if (!sbsj) {
        return "";
    }
    sbsj = sbsj.toString();

    return sbsj.substring(0, 4) + "-" + sbsj.substring(4, 6) + "-" + sbsj.substring(6, 8);
});

//日期时间 格式化(yyyy-MM-dd HH:mm:ss) 2015-12-04 14:27:29
Handlebars.registerHelper("dateTimeFormatHelper", function(sbs) {
    if (sbs) {
        var sbsj = sbs.toString();
        return sbsj.substring(0, 4) + "-" + sbsj.substring(4, 6) + "-" + sbsj.substring(6, 8) + "   " + sbsj.substring(8, 10) + ":" + sbsj.substring(10, 12) + ":" + sbsj.substring(12, 14);
    }
});
//千分号
Handlebars.registerHelper("permilFormatHelper", function format(num){  
    num=num+'';//数字转字符串  
    var str="";//字符串累加  
    for(var i=num.length- 1,j=1;i>=0;i--,j++){  
        if(j%3==0 && i!=0){//每隔三位加逗号，过滤正好在第一个数字的情况  
            str+=num[i]+",";//加千分位逗号  
            continue;  
        }  
        str+=num[i];//倒着累加数字
    }  
    return str.split('').reverse().join("");//字符串=>数组=>反转=>字符串  
  });

//格式化金额 (2,000.00)
Handlebars.registerHelper("fixMoneyHelper", function(s, n) {
    if (!s) {
        return "0.00";
    }
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
});
//格式化金额(2,000)
Handlebars.registerHelper("fixMoneyInt", function(s) {
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    if (r == '00') {
        return t.split("").reverse().join("");
    } else {
        return t.split("").reverse().join("") + "." + r;
    }
});
Handlebars.registerHelper("dateOrtimeFormat", function(date, type) {
    if (type == "date") {
        return date.substring(0, 4) + "年" + date.substring(4, 6) + "月" + date.substring(6, 8) + "日";
    } else if (type == "time") {
        return date.substring(8, 10) + ":" + date.substring(10, 12);
    }
});

// 截取整数部分
Handlebars.registerHelper("getInt", function(date) {
    if (isNaN(date) == false) {
        return parseInt(date);
    }
});

// 截取小数部分
Handlebars.registerHelper("getDecimal", function(data, fix) {
    if (isNaN(data) == false) {
        var decimal = parseFloat(data) - parseInt(data);
        if (fix && isNaN(fix) == false) {
            var temp = decimal.toFixed(fix);
            return temp.substring(2, temp.length);
        }
        if (decimal > 0) {
            var temp = decimal.toString();
            return temp.substring(2, temp.length);
        }
        return "";
    }
});

// 判断是否为空
Handlebars.registerHelper("notNull", function(v1, options) {
    if (v1) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// js 的 toFix
Handlebars.registerHelper("toFix", function(data, fix, error) {
    if (isNaN(data) == false && isNaN(fix) == false) {
        return parseFloat(data).toFixed(parseInt(fix));
    } else {
        return error || "";
    }
});

// 转换显示 -- 如入参 "2" "1,2,3" "未开始,进行中,结束"，则返回 "进行中"
Handlebars.registerHelper("toTransfer", function(value, ids, values, error) {
    var idList = ids.split(",");
    var valueList = values.split(",");
    var minIndex = idList.length <= valueList.length ? idList.length : valueList.length;
    for (var i = 0; i < minIndex; i++) {
        if (value == idList[i]) {
            return valueList[i];
        }
    }
    return error || "";
});

// 检查是否在输入的内容中
Handlebars.registerHelper("inArray", function(v1, arrayStr, options) {
    var array = arrayStr.split(",");
    if ($.inArray(v1, array) >= 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// 截取字符串
Handlebars.registerHelper("substring", function(v1, start, end) {
    if (v1 != undefined) {
        if (v1.length > end) {
            return v1.toString().substring(start, end) + "...";
        } else {
            return v1.toString()
        }
    }
});

// 截取文件链接路径
Handlebars.registerHelper("substringFile", function(item) {

    // var index = item.LastIndexOf("/")+1;
    return item.toString().substring(15);
});

// 检查是否已输入的字符串结尾，是则忽略，不是则加上
Handlebars.registerHelper("endAs", function(str, end) {
    if (end.length > str.length) {
        return str + end;
    }
    var strEnd = str.substring(str.length - end.length, str.length);
    if (strEnd == end) {
        return str;
    } else {
        return str + end;
    }
});
// 检查是否在输入的内容中
Handlebars.registerHelper("inArray", function(status, options) {
    if (status == 0 || status == 1) {
        return options;
    }
});
//检查是否有子类
Handlebars.registerHelper("haveChildren", function(options) {
    if (options.length != 0) {
        return "<span class='fa fa-caret-down'></span>";
    } else {
        return "<span></span>";
    }
});


//
Handlebars.registerHelper("getColors", function(v1) { //判断是否相等
    switch (v1) {
        case "1":
            return new Handlebars.SafeString('<td class="t-c" style="background-color:pink"> ' + 正在执行 + ' </td>');
            break;
        case "2":
            return new Handlebars.SafeString('<td class="t-c" style="background-color:pink"> ' + 执行完成 + ' </td>');
            break;
        case "3":
            return new Handlebars.SafeString('<td class="t-c" style="background-color:pink"> ' + 执行失败 + ' </td>');
            break;
        case "0":
            msg += "提现，";
            break;

    }
});
Handlebars.registerHelper("obj2StrHelper", function(obj) {

    return JSON.stringify(obj);
});
Handlebars.registerHelper("dataFormatMs", function(obj) {
    if (!obj) {
        return '';
    }
    return new Date(obj).Format('yyyy-MM-dd');
});

//转换表格
Handlebars.registerHelper("parseTable", function(obj) {
    if (obj.is_show === "1") { //判断是否存在
        var _html = '';
        if (obj.startRow) {
            _html += "<tr>";
        }
        var title = "类型：" + obj.cellType;
        if (obj.cellTableField) obj.title += ',字段：' + obj.cellTableField;
        switch (obj.cellType) {
            case "show":
                if (obj.fieldShowText) {
                    _html += "<td rowspan='" + obj.mergedRowCount + "' colspan='" + obj.mergedColCount + "' style='width:" + obj.colWidth + "px;min-width: 150px;max-width: 200px;white-space: normal;' data-params=\'" + JSON.stringify(obj) + "\' data-toggle='tooltip' data-placement='top' title='" + obj.fieldShowText + "' colspan='" + obj.mergedColCount + "'>" + obj.fieldShowText + "</td>";
                } else {
                    _html += "<td rowspan='" + obj.mergedRowCount + "' colspan='" + obj.mergedColCount + "' style='width:" + obj.colWidth + "px;min-width: 150px;max-width: 200px;white-space: normal;' data-params=\'" + JSON.stringify(obj) + "\' data-toggle='tooltip' data-placement='top' colspan='" + obj.mergedColCount + "'></td>";

                }
                break;
            case "input":
                // _html += '<td data-params=\''+JSON.stringify(obj)+'\' data-toggle="tooltip" data-placement="top" title="'+obj.title+'" colspan="'+obj.mergedColCount+'"><input style="width:"'+obj.colWidth+'px;" class="form-control" readonly type="'+obj.inputType+'" name="'+$.trim(obj.cellTableField)+'"/></td>';
                // break;
                obj.colWidth = 150;
                switch (obj.inputType) {
                    case "text":
                        _html += "<td data-params=\'" + JSON.stringify(obj) + "\' rowspan='" + obj.mergedRowcount + "' colspan='" + obj.mergedColCount + "'><input style='width:" + obj.colWidth + "px;' class='form-control' readonly type='" + obj.inputType + "' name='" + $.trim(obj.cellTableField) + "'/></td>";
                        break;
                    case "number":
                        _html += "<td data-params=\'" + JSON.stringify(obj) + "\' rowspan='" + obj.mergedRowcount + "' colspan='" + obj.mergedColCount + "'><input style='width:" + obj.colWidth + "px;' class='form-control' readonly type='" + obj.inputType + "' name='" + $.trim(obj.cellTableField) + "'/></td>";
                        break;
                    case "int":
                        _html += "<td data-params=\'" + JSON.stringify(obj) + "\' rowspan='" + obj.mergedRowcount + "' colspan='" + obj.mergedColCount + "'><input style='width:" + obj.colWidth + "px;' class='form-control' readonly type='" + obj.inputType + "' name='" + $.trim(obj.cellTableField) + "'/></td>";
                        break;
                    case "percent":
                        _html += "<td data-params=\'" + JSON.stringify(obj) + "\' rowspan='" + obj.mergedRowcount + "' colspan='" + obj.mergedColCount + "'><input style='width:" + obj.colWidth + "px;' class='form-control' readonly type='" + obj.inputType + "' name='" + $.trim(obj.cellTableField) + "'/></td>";
                        break;
                    case "select":
                        _html += '<td data-params=\'' + JSON.stringify(obj) + '\' rowspan="' + obj.mergedRowcount + '" colspan="' + obj.mergedColCount + '"><select style="width:' + obj.colWidth + 'px;" class="form-control" readonly name="' + $.trim(obj.cellTableField) + '"><select></td>';
                        break;
                    case "radio":
                        _html += '<td data-params=\'' + JSON.stringify(obj) + '\' rowspan="' + obj.mergedRowcount + '" colspan="' + obj.mergedColCount + '"><input type="radio" name="' + $.trim(obj.cellTableField) + '" readonly checked>' + $.trim(obj.cellTableField) + '</td>';
                        break;
                    case "checkbox":
                        _html += '<td data-params=\'' + JSON.stringify(obj) + '\' rowspan="' + obj.mergedRowcount + '" colspan="' + obj.mergedColCount + '"><input type="checkbox" name="' + $.trim(obj.cellTableField) + '" readonly checked>' + $.trim(obj.cellTableField) + '</td>';
                        break;
                    case "textarea":
                        _html += '<td data-params=\'' + JSON.stringify(obj) + '\' rowspan="' + obj.mergedRowcount + '" colspan="' + obj.mergedColCount + '"><textarea class="form-control" readonly name="' + $.trim(obj.cellTableField) + '" ></textarea></td>';
                        break;
                    case "date":
                        _html += '<td data-params=\'' + JSON.stringify(obj) + '\' rowspan="' + obj.mergedRowcount + '" colspan="' + obj.mergedColCount + '"><input style="width:' + obj.colWidth + 'px;" class="form-control" readonly type="' + obj.inputType + '" name="' + $.trim(obj.cellTableField) + '"/></td>';
                        break;
                };
                break;
            default:
                if (obj.mergedColCount <= obj.cellCol && obj.totalt - obj.cellCol >= obj.mergedColCount) {
                    _html += '<td data-params=\'' + JSON.stringify(obj) + '\' rowspan="' + obj.mergedRowcount + '" colspan="' + obj.mergedColCount + '"></td>';
                };
        }
        if (obj.endRow) {
            _html += "</tr>";
        }
        return new Handlebars.SafeString(_html);
    }
});

// 截取字符串
Handlebars.registerHelper("substring2", function(v1, start, end) {
    if (v1 != undefined) {
        if (v1.length > end) {
            return v1.toString().substring(start, end);
        } else {
            return v1.toString()
        }
    }
});
//时间计算 毫秒转换  2757  45分57秒
Handlebars.registerHelper("msTimeToChange", function(value) {
    if (!value) return null;
    var theTime = parseInt(value); // 秒  
    var theMs = 0; //毫秒
    var theTime1 = 0; // 分  
    var theTime2 = 0; // 小时  
    if (theTime > 1000) {
        theMs = theTime - parseInt(theTime / 1000) * 1000;
        var theMi = parseInt(theTime / 1000);
        if (theMi > 60) {
            theTime1 = parseInt(theMi / 60);
            theMi = parseInt(theMi % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
    } else {
        return result = value / 1000 + '秒';
    }

    var result = parseInt(theMs) / 1000; // + parseInt(theMs) + '毫秒';
    if (theMi > 0) {
        result = "" + Number(Number(parseInt(theMi)) + Number(result)) + "秒";
    } else {
        result += "秒";
    }
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    return result;
});
//时间计算 秒转换  2757  45分57秒
Handlebars.registerHelper("sTimeToChange", function(value) {
    if (!value) return null;
    var theTime = parseInt(value); // 秒  
    var theTime1 = 0; // 分  
    var theTime2 = 0; // 小时  
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + parseInt(theTime) + "秒";
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    return result;
});

// 格式化备份状态
Handlebars.registerHelper("formatType", function(v) {
    if (v === "0") {
        return "未开始";
    } else if (v === "1") {
        return "运行中";
    } else if (v === "2") {
        return "成功";
    } else if (v === "9") {
        return "失败";
    } else {
        return "-";
    }
});



//decode  类似if esle   2种枚举值
//通用的字典转义方法
Handlebars.registerHelper("case1Helper", function(value,
    val1, txt1) {
    if (v === val1) {
        return txt1;
    } else {
        return v;
    }
});

//例如： {{case2Helper configStatus '1' '启用' '0' '未启用'}}
Handlebars.registerHelper("case2Helper", function(value,
    val1, txt1,
    val2, txt2) {
    if (value === val1) {
        return txt1;
    } else if (value === val2) {
        return txt2;
    } else {
        return value;
    }
});

Handlebars.registerHelper("case3Helper", function(value,
    val1, txt1,
    val2, txt2,
    val3, txt3) {
    if (value === val1) {
        return txt1;
    } else if (value === val2) {
        return txt2;
    } else if (value === val3) {
        return txt3;
    } else {
        return value;
    }
});

Handlebars.registerHelper("case4Helper", function(value,
    val1, txt1,
    val2, txt2,
    val3, txt3,
    val4, txt4) {
    if (value === val1) {
        return txt1;
    } else if (value === val2) {
        return txt2;
    } else if (value === val3) {
        return txt3;
    } else if (value === val4) {
        return txt4;
    } else {
        return value;
    }
});

Handlebars.registerHelper("case5Helper", function(value,
    val1, txt1,
    val2, txt2,
    val3, txt3,
    val4, txt4,
    val5, txt5) {
    if (value === val1) {
        return txt1;
    } else if (value === val2) {
        return txt2;
    } else if (value === val3) {
        return txt3;
    } else if (value === val4) {
        return txt4;
    } else if (value === val5) {
        return txt5;
    } else {
        return value;
    }
});


Handlebars.registerHelper("case6Helper", function(value,
    val1, txt1,
    val2, txt2,
    val3, txt3,
    val4, txt4,
    val5, txt5,
    val6, txt6) {
    if (value === val1) {
        return txt1;
    } else if (value === val2) {
        return txt2;
    } else if (value === val3) {
        return txt3;
    } else if (value === val4) {
        return txt4;
    } else if (value === val5) {
        return txt5;
    } else if (value === val6) {
        return txt6;
    } else {
        return value;
    }
});


//如果value存在返回value,否则返回val2
Handlebars.registerHelper("rhtjNvlHelper", function(value, val2) {
    if (!value || value == "") {
        return val2;
    } else {
        return value;
    }
});
Handlebars.registerHelper("runningStatusHelper", function(value) {
    if (value === '3') {
        return new Handlebars.SafeString('<td class="colse-color t-c">关闭</td>');
    } else {
        return new Handlebars.SafeString('<td class="open-color t-c">开启</td>');
    }
});
Handlebars.registerHelper("formatDuringHelper", function(s) {
    if (!s) {
        return $.kingdom.formatDuring(0);
    }
    return $.kingdom.formatDuring(s);
    // s = parseInt(s);
    // if (isNaN(s)) {
    //     return "--"
    // } else if (s > 1000 * 60 * 60) {
    //     return (s / (1000 * 60 * 60)).toFixed(2) + "h";
    // } else if (s > 1000 * 60) {
    //     return (s / (1000 * 60)).toFixed(2) + "m";
    // } else if (s > 1000) {
    //     return s / 1000 + "s";
    // } else {
    //     return s + "ms";
    // }
});
//调度计划列表颜色展示
Handlebars.registerHelper("schduleColor", function(value) {
    var color = "black";
    switch (value) {
        case "B":
            color = "#ed6b75"; 
            break;
        case "F":
            color = "#F1C40F";
            break;
        case "S":
            color = "#3fc9d5";
            break;
        default:
            color = "black";
            break;
    }
    return color;
});
//执行计划头部按钮控制
Handlebars.registerHelper("performIcon",function(value){
    if(value === "R"){
        return "icon-control-pause";
    }else{
        return "icon-control-play";
    }
});
//根据状态返回html（执行监控）
Handlebars.registerHelper("judgeDiffStatus",function(value){
    var html = "";
    switch (value) {
        case "S":
            html = '<div class="perform-fl-box bg-color-success" title="Succeed"><i class="fa fa-check"></i></div>';
            break;
        case "R":
            html = '<div class="perform-fl-box bg-color-blue" title="Executing"><i class="fa fa-clock-o"></i></div>';
            break;
        case "N":
            html = '<div class="perform-fl-box bg-color-blue" title="Creating" ><i class="fa fa-check"></i></div>';
            break;
        case "B":
            html = '<div class="perform-fl-box bg-color-red" title="Error Interrupt"><i class="fa fa-close"></i></div>';
            break;
        case "F":
            html = '<div class="perform-fl-box bg-color-yellow" title="Error completed"><i class="fa fa-check"></i></div>';
            break;                        
        default:
            html = '<div class="perform-fl-box bg-color-blue" title="Creating" ><i class="fa fa-check"></i></div>';
            break;
    }
    return new Handlebars.SafeString(html);
});
//根据状态显示头部颜色（执行监控）
Handlebars.registerHelper("judgeRightTopColor",function(value){
    var color = "";
    switch (value) {
        case "S":
            color = "bg-color-success";
            break;
        case "R":
            color = "bg-color-blue";
            break;
        case "N":
            color = "bg-color-blue";
            break;
        case "F":
            color = "bg-color-yellow";
            break;
        case "B":
            color = "bg-color-red";
            break;                        
        default:
            color = "bg-color-blue"
            break;
    }
    return color;
});

//根据状态显示边框颜色颜色（执行监控）
Handlebars.registerHelper("judgeRightTopBorderColor",function(value){
    var color = "";
    switch (value) {
        case "S":
            color = "bg-color-success-border";
            break;
        case "R":
            color = "bg-color-blue-border";
            break;
        case "N":
            color = "bg-color-default-border";
            break;
        case "F":
            color = "bg-color-yellow-border";
            break;
        case "B":
            color = "bg-color-red-border";
            break;                        
        default:
            color = "bg-color-default-border"
            break;
    }
    return color;
});

Handlebars.registerHelper("judgeRightTopStatusName",function(value){
    var color = "";
    switch (value) {
        case "S":
            color = "Succ eed";
            break;
        case "R":
            color = "Exec uting";
            break;
        case "N":
            color = "Crea ting";
            break;
        case "F":
            color = "Error Interrupt";
            break;
        case "B":
            color = "Error completed";
            break;                        
        default:
            color = "Crea ting"
            break;
    }
    return color;
});

Handlebars.registerHelper("calcIndex",function(value){
    return (parseInt(value)+1).toString();
});
