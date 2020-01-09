define(function (require, exports, module) {

    var legalPerson = {};

    function setDataParams(sysType) {
        var linkEles = document.querySelectorAll('[data-toggle="link"]');
        if (linkEles) {
            var params = {
                sysType: sysType,
                legalerCode: sessionStorage.getItem(location.hash.substr(1, location.hash.length)) + ''
            };
            for (var item = 0; item < linkEles.length; item++) {
                if (linkEles[item].dataset.type === 'quick-add') {
                    params.type = linkEles[item].dataset.type;
                }
            }
            $('[data-type="quick-add"]').attr('data-params', JSON.stringify(params));
        }
    }

    legalPerson.genUIAfterRequestDataReturn = function (sysType, data, fallback) {
        if (Array.isArray(data.bcjson.items) && data.bcjson.items.length === 0) {
            toastr.error('请先配置法人信息！');
        } else if (Array.isArray(data.bcjson.items) && data.bcjson.items.length > 0) {
            var items = data.bcjson.items;
            $('.J_legalPersonTabs').empty();
            if (sessionStorage.getItem(location.hash.substr(1, location.hash.length)) === null) {
                sessionStorage.setItem(location.hash.substr(1, location.hash.length), items[0].paramId);
            }
            setDataParams(sysType);

            for (var i = 0; i < items.length; i++) {
                if (i === 0) {
                    $('.J_legalPersonTabs').append('<label class="btn red btn-outline btn-circle btn-sm active" data-paramid=' + items[i].paramId + ' title="' + items[i].comment + ' - ' + items[i].paramValue + ' - ' + items[i].paramId + '"><input type="radio" name="options" class="toggle">' + items[i].comment + '</label>');
                } else {
                    $('.J_legalPersonTabs').append('<label class="btn red btn-outline btn-circle btn-sm" data-paramid=' + items[i].paramId + ' title="' + items[i].comment + ' - ' + items[i].paramValue + ' - ' + items[i].paramId + '"><input type="radio" name="options" class="toggle">' + items[i].comment + '</label>');
                }
            }

            var tabItems = document.querySelectorAll('.J_legalPersonTabs label');
            tabItems = Array.from(tabItems);
            for (var i = 0; i < tabItems.length; i++) {
                if (sessionStorage.getItem(location.hash.substr(1, location.hash.length)) !== null) {
                    if (tabItems[i].dataset.paramid === sessionStorage.getItem(location.hash.substr(1, location.hash.length))) {
                        $(tabItems[i]).addClass('active');
                        $(tabItems[i]).siblings().removeClass('active');
                        // $(tabItems[i]).click();
                    }
                }
            };

            fallback();

            // 法人标签页切换
            $('.J_legalPersonTabs label').click(function () {
                // legalPersonCode = $(this).data('paramid');
                sessionStorage.setItem(location.hash.substr(1, location.hash.length), $(this).data('paramid'));
                setDataParams(sysType);

                App.blockUI({
                    target: '.page-content',
                    animate: true
                });
                window.setTimeout(function () {
                    App.unblockUI('.page-content');
                }, 500);

                fallback();
                if (sysType == "SIPF") {
                    $('.page-sipf-task-config .tab_location_change a label.active').click();
                } else if (sysType == "GPZY") {
                    $('.page-gpzy-task-config .tab_location_change a label.active').click();
                } else if (sysType == "CSFC") {
                    $('.page-csfc-task-config .tab_location_change a label.active').click();
                }
            });
        }
    };

    legalPerson.getLegalPersons = function (sysType, fallback) {

        //增加缓存，加速界面显示
        var isUpdate = false;

        var dataString = localStorage.getItem(sysType + "legalerInfo");
        if (dataString) {
            var data2 = JSON.parse(dataString);
            legalPerson.genUIAfterRequestDataReturn(sysType, data2, fallback);
            isUpdate = true; //页面加载后，更新为ＴＲＵＥ
        }

        var paramsMap = {
            sysType: sysType
        };
        $.kingdom.doKoauthAdminAPI("kingdom.krcs.get_biz_sys_legaler_code_list", "v4.0", paramsMap, function (data) {
            if (data.bcjson.flag === '1' && data.bcjson.items) {
                if (!isUpdate) {
                    //界面更新过后，此次不再更新界面
                    legalPerson.genUIAfterRequestDataReturn(sysType, data, fallback);
                }

                localStorage.setItem(sysType + "legalerInfo", JSON.stringify(data));
            }
        });
    };

    module.exports = legalPerson;
});