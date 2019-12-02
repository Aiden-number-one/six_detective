/* eslint-disable*/
var KisBpmPagePropertyCtrl = ['$scope', '$modal', function($scope, $modal) {
    // Config for the modal window
    var opts = {
        template: 'editor-app/configuration/properties/custompage-popup.html?version=' + Date.now(),
        scope: $scope,
        backdrop: "static"
    };
    // Open the dialog
    $modal(opts);
}];
var KisBpmPageCtrlPopupCtrl = ['$scope', '$modal', function($scope, $modal) {
    // Put json representing custompage on scope
    if ($scope.property.value && $scope.property.value !== undefined && $scope.property.value !== null) {
        $scope.custompage = $scope.property.value;
    } else {
        $scope.custompage = {};
    }
    if ($scope.custompage.isCustom == undefined) {
        $scope.custompage.isCustom = 1;
        $scope.custompage.value = [];
    } else {
        var value = $scope.custompage.value;
        $scope.custompage.value = [];
        $scope.custompage.value[$scope.custompage.isCustom] = value
    }
    if ($scope.custompage.isEditing == undefined || $scope.custompage.isEditing == '1') {
        $scope.custompage.isEditing = true;
    }
    $scope.next = false;
    $scope.previous = false;
    $scope.class = ""
    var pageNumber = "1";
    $scope.sites = [];
    var getPageList = function() {
        //查询自定义页面列表
        var url = '/admin_api';
        var data = KISBPM.URL.getParams('kingdom.kbpm.get_kifp_user_defined_page', 'v1.0', {
            pageNumber: pageNumber,
            pageSize: "6"
        });
        jQuery.ajax({
            type: "post",
            url: url,
            dataType: 'json',
            data: data,
            async: false
        }).done(function(data) {
            if (data.kdjson.items) {
                $scope.sites = data.kdjson.items
            }
            var totalRecords = data.kdjson.lengths;
            var totalPage = Math.ceil(parseInt(totalRecords) / parseInt('6'));
            if (pageNumber == '1') {
                $scope.previous = false;
            } else {
                $scope.previous = true;
            }
            if (totalPage == pageNumber) {
                $scope.next = false;
            } else {
                $scope.next = true;
            }
        });
    }
    getPageList();
    $scope.create = function() {
        var opts = {
            template: 'editor-app/configuration/properties/custompage-create-popup.html?version=' + Date.now(),
            scope: $scope,
            backdrop: 'static'
        };
        // Open the dialog
        $scope.$hide();
        $modal(opts);
    };
    $scope.save = function() {
        $scope.close(true);
    };
    $scope.showMenu = function() {
        if ($scope.class) {
            $scope.class = ""
        } else {
            $scope.class = "open"
        }
    }
    $scope.selectPage = function(index) {
        $scope.custompage.value[1] = $scope.sites[index].pageid;
        this.custompage.pageName = $scope.sites[index].pagename;
        $scope.class = ""
    }
    $scope.nextBt = function() {
        pageNumber++;
        pageNumber = pageNumber + "";
        getPageList();
    };
    $scope.previousBt = function() {
        pageNumber--;
        pageNumber = pageNumber + "";
        getPageList();
    };

    // Close button handler
    $scope.close = function(flag) {
        $scope.property.value = {};
        $scope.custompage.value = $scope.custompage.value[$scope.custompage.isCustom];
        if (!$scope.custompage.value) {
            $scope.custompage = "";
        }
        if ($scope.custompage.isEditing) {
            $scope.custompage.isEditing = '1'
        } else {
            $scope.custompage.isEditing = '0';
        }
        $scope.property.value = $scope.custompage;
        if (flag) {
            $scope.updatePropertyInModel($scope.property);
        }
        $scope.property.mode = 'read';
        $scope.$hide();
    };


}];
var KisBpmPageEditPopupCtrl = ['$scope', '$modal', function($scope, $modal) {
    $scope.close = function(index) {
        var opts = {
            template: 'editor-app/configuration/properties/custompage-popup.html?version=' + Date.now(),
            scope: $scope,
            backdrop: "static"
        };
        // Open the dialog
        $scope.$hide();
        $modal(opts);
    };
}];
var KisBpmeventauditPopupCtrl = ['$scope', '$modal', function($scope, $modal) {
    // Config for the modal window
    var opts = {
        template: 'editor-app/configuration/properties/eventaudit-popup.html?version=' + Date.now(),
        scope: $scope,
        backdrop: "static"
    };
    // Open the dialog
    $modal(opts);
}];
//审核事件
var KisBpmeventauditPropertyCtrl = ['$scope', '$modal', function($scope, $modal) {
    // Put json representing eventAudit on scope
    if ($scope.property.value && $scope.property.value !== undefined && $scope.property.value !== null) {
        $scope.eventAudit = $scope.property.value;
    } else {
        $scope.eventAudit = {};
    }
    if ($scope.eventAudit.isCurrency == undefined) {
        $scope.eventAudit.isCurrency = 1;
        $scope.eventAudit.value = [];
    } else {
        var value = $scope.eventAudit.value;
        $scope.eventAudit.value = [];
        $scope.eventAudit.value[$scope.eventAudit.isCurrency] = value
    }
    $scope.next = false;
    $scope.previous = false;
    $scope.class = ""
    var pageNumber = "1";
    $scope.sites = [];
    var getEventList = function() {
        //查询自定审核列表
        const V = 'v2.0'; // 版本号
        const N = 'bayconnect.superlop.get_flow_event_page'; // 接口名
        const P = {
            pageNumber: pageNumber,
            pageSize: "6"
        }; // 参数
        const S = new Date().getTime(); // 时间戳
        var dataAndHeader = KISBPM.URL.getParams({ N, V, P, S },false);
      //   debugger;
      const params = dataAndHeader.param;
      const header = dataAndHeader.header;
        // var url = '/admin_api';
        // var data = KISBPM.URL.getParams('kingdom.kbpm.get_sel_spm_flow_event', 'v1.0', {
        //     pageNumber: pageNumber,
        //     pageSize: "6"
        // });
        jQuery.ajax({
            type: "post",
            url: '/api/' + V + '/' + N + '.json',
            dataType: 'json',
            data: params,
            headers:header,
            async: false
        }).done(function(data) {
            if (data.bcjson.items) {
                $scope.sites = data.bcjson.items
            }
            var totalRecords = data.bcjson.lengths;
            var totalPage = Math.ceil(parseInt(totalRecords) / parseInt('6'));
            if (pageNumber == '1') {
                $scope.previous = false;
            } else {
                $scope.previous = true;
            }
            if (totalPage == pageNumber) {
                $scope.next = false;
            } else {
                $scope.next = true;
            }
        });
    }
    getEventList();
    $scope.save = function() {

        $scope.close(true);
    };
    // Close button handler
    $scope.close = function(flag) {
        $scope.property.value = {};
        $scope.eventAudit.value = $scope.eventAudit.value[$scope.eventAudit.isCurrency];
        if (!$scope.eventAudit.value) {
            $scope.eventAudit = "";
        }
        $scope.property.value = $scope.eventAudit;
        if (flag) {
            $scope.updatePropertyInModel($scope.property);
        }
        $scope.property.mode = 'read';
        $scope.$hide();
    };
    $scope.showMenu = function() {
        if ($scope.class) {
            $scope.class = ""
        } else {
            $scope.class = "open"
        }
    }
    $scope.selectPage = function(index) {
        $scope.eventAudit.value[1] = $scope.sites[index].bexid;
        $scope.eventAudit.eventname = $scope.sites[index].eventname;
        $scope.class = ""
    }
    $scope.nextBt = function() {
        pageNumber++;
        pageNumber = pageNumber + "";
        getEventList();
    };
    $scope.previousBt = function() {
        pageNumber--;
        pageNumber = pageNumber + "";
        getEventList();
    };
}];