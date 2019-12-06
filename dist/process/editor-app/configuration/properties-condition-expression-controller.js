/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

/*
 * Condition expression
 */

var KisBpmConditionExpressionCtrl = ['$scope', '$modal', function($scope, $modal) {

    // Config for the modal window
    var opts = {
        template: 'editor-app/configuration/properties/condition-expression-popup.html?version=' + Date.now(),
        scope: $scope,
        backdrop: "static"
    };

    // Open the dialog
    $modal(opts);
}];

var KisBpmConditionExpressionPopupCtrl = ['$scope', '$translate', '$http', function($scope, $translate, $http) {
    var incomeValue = $scope.property.value;
    if(incomeValue.type === "approve_percent"){
        var typeObj = incomeValue.approve_percent;
        if(!isNaN(typeObj.precent)){
            typeObj.precent *= 100;
        }
    }
    $scope.conditionExpression = incomeValue;

    $scope.save = function() {
        var result = $scope.conditionExpression;
        if(result.type === "approve_percent"){
            var typeObj = result.approve_percent;
            if(!isNaN(typeObj.percent)){
                typeObj.approve_percent /= 100;
            }
        }
        $scope.property.value = result;
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    // Close button handler
    $scope.close = function() {
        $scope.property.mode = 'read';
        $scope.$hide();
    };
}];
var KisBpmConditionExpressionReadCtrl = ['$scope', '$modal', function($scope, $modal) {
    var incomeValue = $scope.property.value, percentObj;
    var result = {
        type: "", // approve_percent || condition
        // 百分比
        approve_percent: {
            precent: "",
            approve: 1// 1通过，0不通过
        },
        // 条件表达式
        condition: ""
    };
    if (incomeValue && incomeValue !== undefined && incomeValue !== null) {
        if(typeof incomeValue === "string"){
            var type;
            if(incomeValue.slice(-1) === "]"){
                type = incomeValue.match(/\[(\w*)]$/)[1];
                incomeValue = incomeValue.replace(/\[(\w*)]$/, "");
            }
            type = type || "condition";
            result.type = type;
            if(type === "approve_percent"){
                // ${((sid_1520229517482_approve+0)/1)>=0.9}
                percentObj = result.approve_percent;
                var approve = incomeValue.indexOf(">") > 0;
                percentObj.approve = +approve;// true => 1, false => 0
                if(approve){
                    percentObj.percent = incomeValue.split("=")[1].replace(/[\}\"]/g, '') * 100;
                }else{
                    percentObj.percent = 100 - incomeValue.match(/^(.*\<\=?)(.*)(\}\"?)/)[2] * 100;
                }
            }else if(type === "condition"){
                result.condition = incomeValue;
            }
        }else if(typeof incomeValue === "object"){
            if(incomeValue.type === "approve_percent"){
                var typeObj = incomeValue.approve_percent;
                if(!isNaN(typeObj.precent)){
                    typeObj.precent *= 100;
                }
            }
            result = incomeValue;
        }
    }
    $scope.conditionExpression = result;
    $scope.property.value = result
}];