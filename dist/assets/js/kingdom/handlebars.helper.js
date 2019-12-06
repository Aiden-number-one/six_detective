//common
Handlebars.registerHelper("rowStyle", function(item) { // 表格奇偶行样式
    return (item + 1) % 2 == 0 ? "even" : "odd";
})
Handlebars.registerHelper("equal", function(v1, v2, options) { //判断是否相等
    if (v1 == v2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
Handlebars.registerHelper('foreach', function(context, options) {
    var ret = "";
    var context = (typeof context == "object") ? context : eval("(" + context + ")");
    for (var i = 0, j = context.length; i < j; i++) {
        ret = ret + options.fn(context[i]);
    }
    return ret;
});
/**end**/
//financing-product-list
Handlebars.registerHelper("controler", function(status, id) {
        if (status == "99" || status == "77") {
            return new Handlebars.SafeString("<a href='javascript:;' data-borrowid='" + id + "' class='btn green btn-outline online'>上架</a>");
        } else {
            return new Handlebars.SafeString("<a href='javascript:;' data-borrowid='" + id + "' class='btn red btn-outline offline'>下架</a>");
        }
    })
    /** begin  [weijb method] **/
    //日期 格式化（MM-dd）
Handlebars.registerHelper("dateMonthFormatHelper", function(sbsj) {
    if (!sbsj) {
        return "";
    }
    var sbsj = sbsj.toString();
    return sbsj.substring(4, 6) + "-" + sbsj.substring(6, 8);
});
//是否拥有属性
Handlebars.registerHelper("ishaspropHelper", function(has_prop) {
    if ("1" == has_prop) {
        return new Handlebars.SafeString("<a id='edit_prop'> 编辑 </a>");
    } else if ("0" == has_prop) {
        return "否";
    }
});

//是否拥有参数
Handlebars.registerHelper("ishasparamHelper", function(has_param) {
    if ("1" == has_param) {
        return new Handlebars.SafeString("<a id='edit_params'> 编辑 </a>");
    } else if ("0" == has_param) {
        return "否";
    }
});

//是否扩展消息
Handlebars.registerHelper("ishasextHelper", function(has_ext) {
    if ("1" == has_ext) {
        return new Handlebars.SafeString("<a id='edit_ext'> 编辑 </a>");
    } else if ("0" == has_ext) {
        return "否";
    }
});

//状态判断 1. 未还 ; 2. 已还
Handlebars.registerHelper("repayStatusHelper", function(repaystatus) {
    if ("0" == repaystatus) {
        return "未还";
    } else if ("1" == repaystatus) {
        return "已还";
    } else {
        return "提前还清";
    }
});
//采集状态判断
Handlebars.registerHelper("CJStatusHelper", function(CJ) {
    if (undefined == CJ) {
        return "未配置";
    } else {
        return "采集已配置";
    }
});
//生成状态判断
Handlebars.registerHelper("SCStatusHelper", function(SC) {
    if (undefined == SC) {
        return "未配置";
    } else {
        return "生成已配置";
    }
});
//勾稽状态判断
Handlebars.registerHelper("GJStatusHelper", function(GJ) {
    if (undefined == GJ) {
        return "未配置";
    } else {
        return "勾稽已配置";
    }
});
//勾稽状态判断
Handlebars.registerHelper("DBStatusHelper", function(DB) {
    if (undefined == DB) {
        return "未配置";
    } else {
        return "打包已配置";
    }
});

//状态显示判断 1. 显示勾选框 ; 2. 显示 --
Handlebars.registerHelper("repayCheckBoxHelper", function(repaystatus, id, borrowid, repaydate) {
    if ("1" == repaystatus) {
        return new Handlebars.SafeString("<input type='checkbox' class='checkbox' data-set='#repaydatatable .checkboxes' onlyid=" + id + " borrowid=" + borrowid + " repaydate=" + repaydate + ">");
    } else if ("2" == repaystatus) {
        return "--";
    }
});

//状态判断 1.发行商还未打款  2. 发行商已还款 3. 确认发行商已还款; 4. 已还款给投资者 ;
Handlebars.registerHelper("hasfrozenStatusHelper", function(hasfrozenstatus, repaystatus) {
    if ("2" == hasfrozenstatus && "1" == repaystatus) {
        return "发行商已打款";
    } else if ("3" == hasfrozenstatus) {
        return "确认发行商已打款";
    } else if ("2" == repaystatus) {
        return "已还款给投资者";
    } else {
        return "发行商还未打款";
    }
});

//状态显示判断 1. 显示勾选框 ; 2. 显示 --
Handlebars.registerHelper("confirmCheckBoxHelper", function(repaystatus, id, borrowid, repaydate) {
    if ("1" == repaystatus) {
        return new Handlebars.SafeString("<input type='checkbox' class='checkbox' data-set='#repaydatatable .checkboxes' onlyid=" + id + " borrowid=" + borrowid + " repaydate=" + repaydate + ">");
    } else if ("2" == repaystatus) {
        return "--";
    }
});

//应收期数 99 提前还本付息  其余 返回期数
Handlebars.registerHelper("repayperiodHelper", function(repayperiod) {
    if ("99" == repayperiod) {
        return "提前还款";
    } else {
        return repayperiod;
    }
});

// 合同关键字3 代表 担保会员 0 融资会员  1  交易会员  2  回购会员

Handlebars.registerHelper("keyTemplateHelper", function(key) {
    if ("0" == key) {
        return "融资会员";
    } else if ("1" == key) {
        return "交易会员";
    } else if ("2" == key) {
        return "回购会员";
    } else if ("3" == key) {
        return "担保会员";
    }
});

//客户状态 0 正常, 1 冻结, * 销户
Handlebars.registerHelper("custstatusHelper", function(custstatus) {
    if ("0" == custstatus) {
        return "正常";
    } else if ("1" == custstatus) {
        return "冻结";
    } else if ("*" == custstatus) {
        return "销户";
    } else {
        return "异常";
    }
});

//客户类型 1 机构 0 个人
Handlebars.registerHelper("custTypeHelper", function(custtype) {
    if ("1" == custtype) {
        return "机构";
    } else if ("0" == custtype) {
        return "个人";
    } else {
        return "游客";
    }
});

//证件类型
Handlebars.registerHelper("certificatetypeHelper", function(custtype) {
    if ("0" == custtype) {
        return "身份证";
    } else if ("2" == custtype) {
        return "营业执照";
    } else if ("C" == custtype) {
        return "行政机关";
    } else if ("D" == custtype) {
        return "组织机构代码证";
    } else if ("E" == custtype) {
        return "社会团体";
    } else if ("F" == custtype) {
        return "军队";
    } else if ("G" == custtype) {
        return "武警";
    } else if ("H" == custtype) {
        return "下属机构（具有主管单位批文号）";
    } else if ("I" == custtype) {
        return "基金会";
    } else {
        return "";
    }
});

//排序，从1开始 rownumber
Handlebars.registerHelper("rownumber", function(item) {
    return item + 1;
});
//根据页面索引排序
Handlebars.registerHelper("rownumberIndex", function(pageNumber, pageSize, item) {
    if (pageNumber) {
        return (pageNumber - 1) * pageSize + item + 1;
    }
});


//订单支付状态 0 未支付 1 部分支付 2 已完成 3 取消
Handlebars.registerHelper("paymethodHelper", function(custtype) {
    if ("0" == custtype) {
        return "未支付";
    } else if ("1" == custtype) {
        return "部分支付";
    } else if ("2" == custtype) {
        return "已完成";
    } else if ("3" == custtype) {
        return "取消";
    } else {
        return "异常";
    }
});

//头像
Handlebars.registerHelper("headiconHelper", function(headicon) {
    if (" " == headicon) {
        return "/assets/img/layouts/photo.jpg";
    } else {
        return "/fileserver" + headicon;
    }
});

//附件
Handlebars.registerHelper("fileexistHelper", function(orgfilepath) {
    if ("" == orgfilepath) {
        return " ";
    } else {
        return new Handlebars.SafeString("<a href='/fileserver'" + orgfilepath + " title=" + orgfilepath + ">附件1</a>");
    }
});


//证书类型
Handlebars.registerHelper("certroleHelper", function(cert_role) {
    if ("0" == cert_role) {
        return "投融资者证书";
    } else if ("3" == cert_role) {
        return "担保方托管证书";
    } else if ("4" == cert_role) {
        return "平台方托管证书";
    } else if ("5" == cert_role) {
        return "管理员证书";
    } else {
        return "异常";
    }
});

//证书存储模式
Handlebars.registerHelper("certcsptypeHelper", function(cert_csptype) {
    if ("1" == cert_csptype) {
        return "usb证书";
    } else if ("3" == cert_csptype) {
        return "服务器托管";
    } else {
        return "异常";
    }
});

//签章记录管理 v1(contractCount) 合同总数 v2(hascontractcount) 已生成合同数
Handlebars.registerHelper("singStatusHelper", function(v1, v2) {
    // return new Handlebars.SafeString("<a class='btn btn-outline blue' name='action' flag='download'>下载合同</a>");
    if ("0" != v2 && v1 == v2) {
        return new Handlebars.SafeString("<a href='javascript:void(0)' name='action' flag='download'>下载合同</a>");
    } else {
        return new Handlebars.SafeString("<a href='javascript:void(0)' name='action' flag='create'>生成合同</a>");
    }
});
//当融资方||机构||平台Id为null时，不显示签章操作
Handlebars.registerHelper("SingShowHelper", function(v1, v2) {
    if (v1 && "" != v1) {
        return v2;
    } else {
        return '--';
    }
});

//平台签章显示 v1平台签章  v2机构签章 v3融资方签章 v4签章状态说明
Handlebars.registerHelper("platformSingShowHelper", function(v1, v2, v3) {
    // console.log('v3:'+!v3);
    if (!v3) {
        return '--';
    } else if ("" != v1 && "1" == v1) {
        return new Handlebars.SafeString("<a href='javascript:void(0)' name='sign' flag='signplatform' >签章</a>");
    } else {
        return v2;
    }
});

//机构签章显示 v1机构签章  v2融资方签章 v3签章状态说明
Handlebars.registerHelper("orgSingShowHelper", function(v1, v2, v3) {
    if (!v3) {
        return '--';
    } else if ("" != v1 && "1" == v1) {
        return new Handlebars.SafeString("<a href='javascript:void(0)' name='sign' flag='signorg' >签章</a>");
    } else {
        return v2;
    }
});

//融资方签章显示 v1融资方签章 v2签章状态说明
Handlebars.registerHelper("fiancSingShowHelper", function(v1, v2, v3) {
    if (!v3) {
        return '--';
    }
    if ("" != v1 && "1" == v1) {
        return new Handlebars.SafeString("<a href='javascript:void(0)' name='sign' flag='signfianc' >签章</a>");
    } else {
        return v2;
    }
});

Handlebars.registerHelper("updateCertShowHelper", function(v1) {
    if ("" != v1 && "0" == v1) {
        return new Handlebars.SafeString("<a name='modify'  href='javascript:void(0)'  flag='B' data-ope='1'>开启</a> ");
    } else {
        return new Handlebars.SafeString("<a name='modify'  href='javascript:void(0)' flag='B' data-ope='0'>禁用</a> ");
    }
});

//证书使用者显示 v1用户角色 v2、v3:用户名
Handlebars.registerHelper("cfcaUserHelper", function(v1, v2, v3) {
    if ("3" == v1 || "4" == v1) {
        return v2;
    } else {
        return v3;
    }
});
//期限转换
Handlebars.registerHelper("dealineTypeHelper", function(type) {
    if ("Y" === type) {
        return "年";
    } else if ('M' === type) {
        return "个月";
    } else {
        return "日";
    }
});


Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


 

/** end [weijb method] **/



//paymentmode
Handlebars.registerHelper("auditstatusHelper", function(auditstatus) {
    if ("99" == auditstatus) {
        return "初始状态";
    } else if ("0" == auditstatus) {
        return "审核中";
    } else if ("1" == auditstatus) {
        return "审核通过";
    } else if ("2" == auditstatus) {
        return "审核未通过";
    } else {
        return "--";
    }
});
//是否拥有参数
Handlebars.registerHelper("ishasparamHelper", function(has_param) {
    if ("1" == has_param) {
        return new Handlebars.SafeString("<a data-target='#stack2' data-toggle='modal'> 编辑 </a>");
    } else if ("0" == has_param) {
        return "否";
    }
})

//是否扩展消息
Handlebars.registerHelper("ishasextHelper", function(has_ext) {
    if ("1" == has_ext) {
        return new Handlebars.SafeString("<a data-target='#stack1' data-toggle='modal'> 编辑 </a>");
    } else if ("0" == has_ext) {
        return "否";
    }
})

/*huanglei*/
//根据资料type对应抵押资料和扩展资料
Handlebars.registerHelper('formtypeHelper', function(type, num, name) {
    if (type == num) {
        return new Handlebars.SafeString('<li>' + name + '</li>');
    }
    return '';
});
//产品状态
Handlebars.registerHelper("productStatusHeleper", function(check, product) {
    if (check == "1" && product == "1") {
        return new Handlebars.SafeString('<a href="javascript:void(0)" name="pmol-flowBt">发起上线审核</a>');
    } else if (check == "0" && product == "1") {
        return new Handlebars.SafeString("审核中");
    } else if (check == "1" && product == "2") {
        return new Handlebars.SafeString("审核成功");
    } else if (check == "2" && product == "1") {
        return new Handlebars.SafeString('<a href="javascript:void(0)" name="pmol-flowBt">发起上线审核</a>');
    }
})
Handlebars.registerHelper("checkStatusHelper", function(check, product) {
    if (check == "1" && product == "2") {
        return new Handlebars.SafeString('<a href="javascript:void(0)" name="pro-OverBt">发起结束募集审核</a>');
    } else if (check == "0" && product == "2") {
        return new Handlebars.SafeString("审核中");
    } else if (check == "1" && product == "3") {
        return new Handlebars.SafeString("审核成功");
    } else if (check == "2" && product == "2") {
        return new Handlebars.SafeString("审核失败");
    }
})

/*huanglei*/

//序号处理
Handlebars.registerHelper("processingHelper", function(index) {
        if (index < 10) {
            index = "00" + index
        } else if (index > 9 && index < 100) {

            index = "0" + index
        }
        return index;
    })
    //根据资料type对应抵押资料和扩展资料
Handlebars.registerHelper('formtypeHelper', function(type, num, name) {
        if (type == num) {
            return new Handlebars.SafeString('<li>' + name + '</li>');

        }
        return index;
    })
    //提现状态处理
Handlebars.registerHelper("applyStatusHelper", function(status) {
    var result;
    switch (status) {
        case '0':
            result = "审核中"
            break;
        case '1':
            result = "审核通过"
            break;

        case '2':
            result = "审核不通过"
            break;

        case "3":
            result = "转账中"
            break;

        case "4":
            result = "取消"
            break;
        case "5":
            result = "已完成"
            break;
        case "6":
            result = "失败"
            break;
    }
    return result;
});
Handlebars.registerHelper("paymentStatusHelper", function(status) {
    var rsult
    if (status == "1") {
        result = "未还款";
    } else if (status == "2") {

        result = "已还款";
    }
    return result;
});
//二，三级菜单辨别
Handlebars.registerHelper("equalPosHelper", function(v1, options) {
    var v = v1.substring(v1.length - 2, v1.length);
    if (v == "00") {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
//是否有募集+募集天数
Handlebars.registerHelper("raiseHelper", function(israise, raiseterm) {
    var result = "";
    if (israise == "0") {
        result = "无募集";
    } else if (israise == "1") {

        result = "募集" + raiseterm + "天";
    }
    return result;
});
//新闻附件处理
Handlebars.registerHelper("fileShowHelper", function(uploadfile) {
    var result = "";
    if (uploadfile === "") {
        return result;
    } else {

        uploadfile = uploadfile.split("?");

        for (var i = 0; i < uploadfile.length; i++) {
            var name = uploadfile[i].split("/");
            result += "<div class='col-md-offset-3 col-md-6'><a target='_blank' addr='" + uploadfile[i] + "' href='fileserver/" + uploadfile[i] + "'>" + name[name.length - 1] + "</a><i class='fa fa-times'/></div>"
        }
    }
    return new Handlebars.SafeString(result);
});


/**end  huanglei**/
/**end  huanglei**/
/**start leixr**/
Handlebars.registerHelper("paymentmodeHelper", function(paymentmode) {
    if ("1" == paymentmode) {
        return "按月付息，到期还本"; //15
    } else if ("2" == paymentmode) {
        return "按季付息，到期还本";
    } else if ("3" == paymentmode) {
        return "按半年付息，到期还本";
    } else if ("4" == paymentmode) {
        return "按年付息，到期还本";
    } else if ("5" == paymentmode) {
        return "到期还本付息";
    } else if ("6" == paymentmode) {
        return "等额本金";
    } else if ("7" == paymentmode) {
        return "等额本息";
    } else if ("101" == paymentmode) {
        return "每日计息，按市值计算";
    } else if ("15" == paymentmode) { //13
        return "按月计息,按年付息.到期还本";
    } else if ("13" == paymentmode) { //13
        return "等额本息,按月还款";
    }
});
//productOnline
Handlebars.registerHelper("productOnlineHelper", function(productOnline, checkstatus) {
    if ("99" == productOnline && "99" == checkstatus) {
        return new Handlebars.SafeString("<a class='btn green btn-outline' id='onlineapply'>发起上线申请</a>");
    } else if ("2" == productOnline) {
        return "材料审核通过期";
    } else if ("3" == productOnline && "0" != checkstatus) {
        return new Handlebars.SafeString("<a class='btn green btn-outline' id='endrecruitment'>结束募集</a>");
    } else if ("3" == productOnline && "0" == checkstatus) {
        return "结束募集审核中";
    } else if ("4" == productOnline && "1" == checkstatus) {
        return "完成";
    } else if ("5" == productOnline && "1" == checkstatus) {
        return "无募集审核完成";
    } else if ("77" == productOnline) {
        return "下架";
    } else if ("99" == productOnline && "0" == checkstatus) {
        return "项目审核中";
    } else if ("2" == checkstatus) {
        return "审核未通过";
    }
});
//counteragent反担保方式 是否本息担保 1是 2否
Handlebars.registerHelper("counteragentHelper", function(counteragent) {
    if ("1" == counteragent) {
        return "是";
    } else if ("2" == counteragent) {

        /**/
        return "否";
    }
});
//isclear是否需要(手动)清算 0-不需要 1-需要后台手动清算
Handlebars.registerHelper("isclearHelper", function(isclear) {
    if ("0" == isclear) {
        return "不需要";
    } else if ("1" == isclear) {
        return "需要";
    }
});
//isbuyback是否为回购 0-否，　１－是

Handlebars.registerHelper("isbuybackHelper", function(isbuyback) {
    if ("0" == isbuyback) {
        return "否";
    } else if ("1" == isbuyback) {
        return "是";
    }
});

//
Handlebars.registerHelper("buybackHelper", function(buyback, isbuyback) {
    if ("0" == isbuyback) {
        return "无";
    } else if ("1" == isbuyback) {
        return buyback + "天";
    }
});

/*产品上线下架*/
Handlebars.registerHelper("onlineHelper", function(status, checkstatus, id) {
    if (status == "99" && checkstatus == "1") {
        return new Handlebars.SafeString("<a href='javascript:;' data-borrowid='" + id + "' class='btn green btn-outline online'>上架</a>");
    } else if (status != "99" && status != "77" && checkstatus == "1") {
        return new Handlebars.SafeString("<a href='javascript:;' data-borrowid='" + id + "' class='btn red btn-outline offline'>下架</a>");
    } else if (status == "77" && checkstatus == "1") {
        return new Handlebars.SafeString("&nbsp&nbsp&nbsp完成");
    } else {
        return new Handlebars.SafeString("&nbsp&nbsp&nbsp暂无");
    }
})


/*end leixr*/



/**/
Handlebars.registerHelper("todolinkHelper", function(status) {
    switch (status) {
        case "audit_withdraw_apply": //提现申请审核
            return "audit-todos-withdraw";
            break;
        case "audit_product_online": //产品上线审核
            return "audit-todos-products";
            break;
        case "audit_capital_apply": //融资申请审核
            return "audit-todos-financing";
            break;
        case "audit_advanced_repay": //提前还款审核
            return "audit-todos-payback";
            break;
        case "audit_capitalregulate_apply": //资金调账审核
            return "audit-todos-account";
            break;
        case "audit_product_raise_finish": //结束募集审核
            return "audit-todos-raising";
            break;
        default:
            return "home-statistics";
    }
    return;
})

//收费类型
Handlebars.registerHelper("feePolicyHelper", function(type) {
    if (type === "" || type === "undefined" || type == undefined) {
        return ""
    }
    if (type === "00") {
        return "固定金额";
    } else {
        return "固定比例";
    }

});

Handlebars.registerHelper("parseFloat", function(item) { //保留小数点后两位
    // return item ? parseFloat(item).toFixed(2) : "0.00";
    var item1 = Math.round(item * 100) / 100;
    return item ? parseFloat(item1).toFixed(2) : "0.00";
});
Handlebars.registerHelper("hrefHandlebars", function(type) { //保留小数点后两位
    var href = "";
    switch (type) {

        case "audit_cash_subtract":
            href = "audit-todos-account";
            break;
        case "audit_withdraw_apply":
            href = "audit-todos-withdraw";
            break;
        case "audit_cash_addtion":
            href = "audit-todos-account";
            break;
        case "audit_product_setting":
            href = 'audit-todos-products-set';
            break;
        case "audit_advanced_repay":
            href = 'audit-todos-payback';
            break;
        case "audit_product_online":
            href = 'audit-todos-products';
            break;
        case "audit_product_raise_finish":
            href = 'audit-todos-raising';
            break;
        case "audit_capital_apply":
            href = 'audit-todos-financing';
            break;
    }
    return href;

});

//收费类型
Handlebars.registerHelper("operHelper", function(type) {
        var str = ""
        switch (type) {
            case "1":
                href = "定时任务";
                break;
            case "2":
                href = "后台操作";
                break;
            case "3":
                href = "前台";
                break;
            case "9":
                href = '其他';
                break
        }
        return href;
    })
    //黑名单禁用权限显示
Handlebars.registerHelper("authName", function(val) {
    var arr = val.split(",");
    var msg = "";
    $.each(arr, function(i, item) {
        switch (arr[i]) {
            case "1":
                msg += "登录，";
                break;
            case "2":
                msg += "认购，";
                break;
            case "3":
                msg += "充值，";
                break;
            case "4":
                msg += "提现，";
                break;
            case "5":
                msg += "出让，";
                break;
        }
    });
    msg = msg.substring(0, msg.length - 1);
    return msg;
});
//计算产品剩余可投
Handlebars.registerHelper("parseNumberLeftmount", function(bondAmount, bondInvestAmount) {
    bondAmount = parseFloat(bondAmount);
    bondInvestAmount = parseFloat(bondInvestAmount);
    if (bondAmount >= 0 && bondInvestAmount >= 0) {
        var s = bondAmount - bondInvestAmount;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        var t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        t = t.split("").reverse().join("");
        if (t.substring(0, 2) == "-,") {
            t = t.replace(",", "");
        }
        return t + "." + r;
    } else {
        return "数据错误";
    }
});
//带加减号的金额格式化
Handlebars.registerHelper("tradeFixMoney", function(value) {
    if (value == "" || value == null) {
        return "0.00";
    } else {
        var sub = '0';
        if (value.indexOf("-") >= 0) {
            sub = '1';
            value = value.replace(/-/g, "");
        } else if (value.indexOf("+") >= 0) {
            sub = '2';
            value = value.replace(/\+/g, "");
        }
        value = parseFloat((value + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
        var l = value.split(".")[0].split("").reverse(),
            r = value.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        if (sub == "2") {
            return "+" + t.split("").reverse().join("") + "." + r;
        } else if (sub == "1") {
            return "-" + t.split("").reverse().join("") + "." + r;
        } else {
            return t.split("").reverse().join("") + "." + r;
        }
    }
});
//提现管理多种状态判断返回true or false
Handlebars.registerHelper("equalWithdraw", function(v1, v2, options) { //判断是否相等
    if (v1 == "提现失败" || v2 == "2") {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
// 检查是否在输入的内容中
Handlebars.registerHelper("inArray", function(status, options) {
    if (status == 0 || status == 1 || status == 2) {
        return options;
    }
});
//
Handlebars.registerHelper("getColor", function(v1) { //判断是否相等
    switch (v1) {
        case "1":
            return new Handlebars.SafeString('<td class="t-c" style="background-color:pink"> 正在执行 </td>');
            break;
        case "2":
            return new Handlebars.SafeString('<td class="t-c" style="background-color:#66FF00"> 执行完成</td>');
            break;
        case "3":
            return new Handlebars.SafeString('<td class="t-c" style="background-color:#00FFFF">等待中 </td>');
            break;
        case "9":
            return new Handlebars.SafeString('<td class="t-c" style="background-color:red">执行失败 </td>');
            break;
        case "0":
            return new Handlebars.SafeString('<td class="t-c" style="background-color:gray"> 未开始 </td>');
            break;
    }
});
/**/

//报表状态
Handlebars.registerHelper("reportStatus", function(status) {
    if (status == "0") {
        return "./assets/img/icon_no.png";
    } else if (status == "1") {
        return "./assets/img/icon_for.gif";
    } else if (status == "2") {
        return "./assets/img/icon_complete.png";
    } else if (status == "9") {
        return "./assets/img/icon_error.png";
    } else {
        return "./assets/img/icon_no.png";
    }
});

Handlebars.registerHelper("STimeFormatHelper", function(time) {
    return new Date(time).Format("yyyy-MM-dd hh:mm:ss")
});
Handlebars.registerHelper("generativeFormText", function(generativeForm) {
    if (generativeForm) {
        var Arr = generativeForm.split(',');
        var str = '';
        for (var i in Arr) {
            switch (Arr[i]) {
                case '1026101':
                str += '+ DBF导入';
                break;
                case '1026102':
                str += '+ EXCEL导入';
                break;
                case '1026103':
                str += '+ 数据库生成';
                break;
                case '1026104':
                str += '+ 手工录入';
                break;
            }
        }
        return str.substring(1,str.length);
    }
});

Handlebars.registerHelper("processHelper", function(usertaskAuditors) {
    if(usertaskAuditors){
        var userArray = usertaskAuditors.split('|');
        var _html = '';
        for(var i in userArray){
            _html += '<div class="approver_item" style="float: left;">';
            if(i!=0){
                _html += '<div class="approver-arrow1"><i class="fa fa-arrow-right"></i></div>';
            }
            _html += '<div class="approver-portrait1"><p><i class="icon iconfont icon-touxiang"></i></p>';
            _html += '<p><span class="approver-btn1" title="'+userArray[i]+'">'+userArray[i]+'</span></p></div></div>';
        }
        return new Handlebars.SafeString(_html);
    }else{
        return '';
    }
});


//日期 格式化(yyyy-MM-dd)
Handlebars.registerHelper("dateFormatHelper", function(sbsj) {
    if (!sbsj) {
        return "";
    }
    sbsj = sbsj.toString();

    return sbsj.substring(0, 4) + "-" + sbsj.substring(4, 6) + "-" + sbsj.substring(6, 8);
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

//日期 格式化(yyyy-MM-dd hh:mm:ss)
Handlebars.registerHelper("dateTimeFormatHelper", function(sbsj) {
    if (!sbsj) {
        return "";
    }
    sbsj = sbsj.toString();
    return sbsj.substring(0, 4) + "-" + sbsj.substring(4, 6) + "-" + sbsj.substring(6, 8) + " " + sbsj.substring(8, 10) + ":" + sbsj.substring(10, 12) + ":" + sbsj.substring(12, 14);
});

// 时间戳格式化
Handlebars.registerHelper("translateTime", function(value) {
    if (value) {
        return new Date(Number(value)).Format("yyyy-MM-dd hh:mm:ss");
    }
});
    
// 时间转化为多少小时，多少分钟前
Handlebars.registerHelper('dateTimeStamp', function(sbs){
    var stringTime;
    if (sbs) {
        var sbsj = sbs.toString();
        stringTime = sbsj.substring(0, 4) + "-" + sbsj.substring(4, 6) + "-" + sbsj.substring(6, 8) + "   " + sbsj.substring(8, 10) + ":" + sbsj.substring(10, 12) + ":" + sbsj.substring(12, 14);
    } else {
        return '刚刚';
    }
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var dateTimeStamp = stringTime;
    var date = Date.parse(dateTimeStamp.replace(/-/gi,"/"));
    var diffValue = now - date;
    if(diffValue < 0){return dateTimeStamp;}
    var monthC =diffValue/month;
    var weekC =diffValue/(7*day);
    var dayC =diffValue/day;
    var hourC =diffValue/hour;
    var minC =diffValue/minute;
    if(monthC>=1){
        result="" + parseInt(monthC) + "月前";
    }
    else if(weekC>=1){
        result="" + parseInt(weekC) + "周前";
    }
    else if(dayC>=1){
        result=""+ parseInt(dayC) +"天前";
    }
    else if(hourC>=1){
        result=""+ parseInt(hourC) +"小时前";
    }
    else if(minC>=1){
        result=""+ parseInt(minC) +"分钟前";
    }
    result="刚刚";
    return result;
});

// 时间戳格式化
Handlebars.registerHelper("formatDataField", function(v1, v2) {
    if (v2 - v1 === 2) {
        return "(数据时间字段)";
    } else if (v2 - v1 === 1) {
        return "(操作时间字段)";
    } else {
        return "";
    }
});

// 时长格式化
Handlebars.registerHelper("formatDuration", function(v) {
    return $.kingdom.formatMillisecond(v);
});

// 格式化任务描述
Handlebars.registerHelper("ruleTypeDescHelper", function(v) {
    if (v === "1") {
        return "用于检查源表中目标字段是否有空值。";
    } else if (v === "3") {
        return "用于检查指标值的格式是否规范，支持身份证、手机号码、邮箱等多种类型的检测。";
    } else if (v === "5") {
        return "用于检查源表中目标字段是否有数据重复。";
    } else {
        return "用于检查源表目标字段数据与比照字段数据是否完全相等。";
    }
});

// 格式化任务描述
Handlebars.registerHelper("ruleIconFormat", function(v) {
    if (v === "1") {
        return "01";
    } else if (v === "3") {
        return "04";
    } else if (v === "5") {
        return "02";
    } else {
        return "03";
    }
});

// 格式化 状态
Handlebars.registerHelper("executeFlagFormat", function(executeFlag) {
    var color;
    if (executeFlag === 'B') {
        color = '#ed6b75'
    } else if (executeFlag === "R") {
        color = '#659be0'
    } else if (executeFlag === "S") {
        color = '#3fc9d5'
    } else if (executeFlag === "F") {
        color = '#F1C40F'
    } else if (executeFlag === "N") {
        color = '#bac3d0'
    } else if (executeFlag === "W") {
        color = '#bac3d0'
    } else if (executeFlag === "U") {
        color = '#bac3d0'
    } else {
        color = '#bac3d0'
    }
    return color;
});

// 格式化 状态 中信iframe特别版
Handlebars.registerHelper("executeFlagFormatIframe", function(executeFlag) {
    var color;
    if (executeFlag === 'B') {
        color = '#ff4638'
    } else if (executeFlag === "R") {
        color = '#3598dc'
    } else if (executeFlag === "S") {
        color = '#09b68b'
    } else if (executeFlag === "F") {
        color = '#ff4638'
    } else if (executeFlag === "N") {
        color = '#e9e9e9'
    } else if (executeFlag === "W") {
        color = '#e9e9e9'
    } else if (executeFlag === "U") {
        color = '#e9e9e9'
    } else {
        color = '#e9e9e9'
    }
    return color;
});
// 格式化 状态 中信iframe特别版 根据url里参数判断状态
Handlebars.registerHelper("executeFlagFormatIframe1", function(executeFlag) {
    var color;
    if (executeFlag === '03') {
        color = '#ff4638'
    } else if (executeFlag === "01") {
        color = '#3598dc'
    } else if (executeFlag === "02") {
        color = '#09b68b'
    } else if (executeFlag === "00") {
        color = '#e9e9e9'
    }
    return color;
});
// 格式化 状态名 中信iframe特别版
Handlebars.registerHelper("executeFlagNameFormatIframe", function(executeFlag) {
    var statusName;
    if (executeFlag === 'B') {
        statusName = '失败'
    } else if (executeFlag === "R") {
        statusName = '进行中'
    } else if (executeFlag === "S") {
        statusName = '已完成'
    } else if (executeFlag === "F") {
        statusName = '失败'
    } else if (executeFlag === "N") {
        statusName = '未开始'
    } else if (executeFlag === "W") {
        statusName = '未开始'
    } else if (executeFlag === "U") {
        statusName = '未开始'
    } else {
        statusName = '未开始'
    }
    return statusName;
});
// 格式化 状态名 中信iframe特别版
Handlebars.registerHelper("executeFlagNameFormatIframe1", function(executeFlag) {
    var statusName;
    if (executeFlag === '00') {
        statusName = '未开始'
    } else if (executeFlag === "01") {
        statusName = '进行中'
    } else if (executeFlag === "02") {
        statusName = '已完成'
    } else if (executeFlag === "03") {
        statusName = '失败'
    }
    return statusName;
});
// 格式化状态
Handlebars.registerHelper("statusColorFormat", function(status) {
    var color;
    if (status === '1') {
        color = '#3fc9d5';
    } else if (status === "0") {
        color = '#ed6b75';
    } 
    return color;
});

// 格式化状态
Handlebars.registerHelper("exportStatusColorFormat", function(status) {
    var color;
    if (status === "0") {
        color = '#ed6b75';
    } else if (status === '1') {
        color = '#3fc9d5';
    } else if (status === "2") {
        color = '#659be0';
    } else if (status === '3') {
        color = '#3fc9d5';
    } else if (status === "4") {
        color = '#ed6b75';
    } 
    return color;
});
// 格式化导出列表导出状态
Handlebars.registerHelper("exportStatusColorFormatS", function(status) {
    var color;
    if (status === "0") {
        color = '#ed6b75';
    } else if (status === '1') {
        color = '#3fc9d5';
    } else if (status === "2") {
        color = 'yellow';
    } else if (status === '3') {
        color = '#3fc9d5';
    } else if (status === "4") {
        color = '#ed6b75';
    } 
    return color;
});
// 格式化状态名
Handlebars.registerHelper("statusNameFormat", function(status) {
    var color;
    if (status === '1') {
        statusName = "成功";
    } else if (status === "0") {
        statusName = "失败";
    } 
    return statusName;
});

// 格式化状态名
Handlebars.registerHelper("formatFileName", function(fileName) {
    return fileName.replace("zip", "txt");
});
// 将字节转化为M
Handlebars.registerHelper("convertM", function(num) {
    let n = num/1024/1024;
    return n.toFixed(2)+"M";
   
});