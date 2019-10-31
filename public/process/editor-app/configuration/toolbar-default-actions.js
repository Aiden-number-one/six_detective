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
'use strict';

var KISBPM = KISBPM || {};
KISBPM.TOOLBAR = {
    ACTIONS: {

        saveModel: function(services) {

            var modal = services.$modal({
                backdrop: true,
                keyboard: true,
                template: 'editor-app/popups/save-model.html?version=' + Date.now(),
                scope: services.$scope
            });
        },

        undo: function(services) {

            // Get the last commands
            var lastCommands = services.$scope.undoStack.pop();

            if (lastCommands) {
                // Add the commands to the redo stack
                services.$scope.redoStack.push(lastCommands);

                // Force refresh of selection, might be that the undo command
                // impacts properties in the selected item
                if (services.$rootScope && services.$rootScope.forceSelectionRefresh) {
                    services.$rootScope.forceSelectionRefresh = true;
                }

                // Rollback every command
                for (var i = lastCommands.length - 1; i >= 0; --i) {
                    lastCommands[i].rollback();
                }

                // Update and refresh the canvas
                services.$scope.editor.handleEvents({
                    type: ORYX.CONFIG.EVENT_UNDO_ROLLBACK,
                    commands: lastCommands
                });

                // Update
                services.$scope.editor.getCanvas().update();
                services.$scope.editor.updateSelection();
            }

            var toggleUndo = false;
            if (services.$scope.undoStack.length == 0) {
                toggleUndo = true;
            }

            var toggleRedo = false;
            if (services.$scope.redoStack.length > 0) {
                toggleRedo = true;
            }

            if (toggleUndo || toggleRedo) {
                for (var i = 0; i < services.$scope.items.length; i++) {
                    var item = services.$scope.items[i];
                    if (toggleUndo && item.action === 'KISBPM.TOOLBAR.ACTIONS.undo') {
                        services.$scope.safeApply(function() {
                            item.enabled = false;
                        });
                    } else if (toggleRedo && item.action === 'KISBPM.TOOLBAR.ACTIONS.redo') {
                        services.$scope.safeApply(function() {
                            item.enabled = true;
                        });
                    }
                }
            }
        },

        redo: function(services) {

            // Get the last commands from the redo stack
            var lastCommands = services.$scope.redoStack.pop();

            if (lastCommands) {
                // Add this commands to the undo stack
                services.$scope.undoStack.push(lastCommands);

                // Force refresh of selection, might be that the redo command
                // impacts properties in the selected item
                if (services.$rootScope && services.$rootScope.forceSelectionRefresh) {
                    services.$rootScope.forceSelectionRefresh = true;
                }

                // Execute those commands
                lastCommands.each(function(command) {
                    command.execute();
                });

                // Update and refresh the canvas
                services.$scope.editor.handleEvents({
                    type: ORYX.CONFIG.EVENT_UNDO_EXECUTE,
                    commands: lastCommands
                });

                // Update
                services.$scope.editor.getCanvas().update();
                services.$scope.editor.updateSelection();
            }

            var toggleUndo = false;
            if (services.$scope.undoStack.length > 0) {
                toggleUndo = true;
            }

            var toggleRedo = false;
            if (services.$scope.redoStack.length == 0) {
                toggleRedo = true;
            }

            if (toggleUndo || toggleRedo) {
                for (var i = 0; i < services.$scope.items.length; i++) {
                    var item = services.$scope.items[i];
                    if (toggleUndo && item.action === 'KISBPM.TOOLBAR.ACTIONS.undo') {
                        services.$scope.safeApply(function() {
                            item.enabled = true;
                        });
                    } else if (toggleRedo && item.action === 'KISBPM.TOOLBAR.ACTIONS.redo') {
                        services.$scope.safeApply(function() {
                            item.enabled = false;
                        });
                    }
                }
            }
        },

        cut: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editCut();
            for (var i = 0; i < services.$scope.items.length; i++) {
                var item = services.$scope.items[i];
                if (item.action === 'KISBPM.TOOLBAR.ACTIONS.paste') {
                    services.$scope.safeApply(function() {
                        item.enabled = true;
                    });
                }
            }
        },

        copy: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editCopy();
            for (var i = 0; i < services.$scope.items.length; i++) {
                var item = services.$scope.items[i];
                if (item.action === 'KISBPM.TOOLBAR.ACTIONS.paste') {
                    services.$scope.safeApply(function() {
                        item.enabled = true;
                    });
                }
            }
        },

        paste: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editPaste();
        },

        deleteItem: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxEditPlugin(services.$scope).editDelete();
        },

        addBendPoint: function(services) {

            var dockerPlugin = KISBPM.TOOLBAR.ACTIONS._getOryxDockerPlugin(services.$scope);

            var enableAdd = !dockerPlugin.enabledAdd();
            dockerPlugin.setEnableAdd(enableAdd);
            if (enableAdd) {
                dockerPlugin.setEnableRemove(false);
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        },

        removeBendPoint: function(services) {

            var dockerPlugin = KISBPM.TOOLBAR.ACTIONS._getOryxDockerPlugin(services.$scope);

            var enableRemove = !dockerPlugin.enabledRemove();
            dockerPlugin.setEnableRemove(enableRemove);
            if (enableRemove) {
                dockerPlugin.setEnableAdd(false);
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        },

        /**
         * Helper method: fetches the Oryx Edit plugin from the provided scope,
         * if not on the scope, it is created and put on the scope for further use.
         *
         * It's important to reuse the same EditPlugin while the same scope is active,
         * as the clipboard is stored for the whole lifetime of the scope.
         */
        _getOryxEditPlugin: function($scope) {
            if ($scope.oryxEditPlugin === undefined || $scope.oryxEditPlugin === null) {
                $scope.oryxEditPlugin = new ORYX.Plugins.Edit($scope.editor);
            }
            return $scope.oryxEditPlugin;
        },

        zoomIn: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).zoom([1.0 + ORYX.CONFIG.ZOOM_OFFSET]);
        },

        zoomOut: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).zoom([1.0 - ORYX.CONFIG.ZOOM_OFFSET]);
        },

        zoomActual: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).setAFixZoomLevel(1);
        },

        zoomFit: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxViewPlugin(services.$scope).zoomFitToModel();
        },

        alignVertical: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxArrangmentPlugin(services.$scope).alignShapes([ORYX.CONFIG.EDITOR_ALIGN_MIDDLE]);
        },

        alignHorizontal: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxArrangmentPlugin(services.$scope).alignShapes([ORYX.CONFIG.EDITOR_ALIGN_CENTER]);
        },

        sameSize: function(services) {
            KISBPM.TOOLBAR.ACTIONS._getOryxArrangmentPlugin(services.$scope).alignShapes([ORYX.CONFIG.EDITOR_ALIGN_SIZE]);
        },

        closeEditor: function(services) {
            history.back();
        },

        /**
         * Helper method: fetches the Oryx View plugin from the provided scope,
         * if not on the scope, it is created and put on the scope for further use.
         */
        _getOryxViewPlugin: function($scope) {
            if ($scope.oryxViewPlugin === undefined || $scope.oryxViewPlugin === null) {
                $scope.oryxViewPlugin = new ORYX.Plugins.View($scope.editor);
            }
            return $scope.oryxViewPlugin;
        },

        _getOryxArrangmentPlugin: function($scope) {
            if ($scope.oryxArrangmentPlugin === undefined || $scope.oryxArrangmentPlugin === null) {
                $scope.oryxArrangmentPlugin = new ORYX.Plugins.Arrangement($scope.editor);
            }
            return $scope.oryxArrangmentPlugin;
        },

        _getOryxDockerPlugin: function($scope) {
            if ($scope.oryxDockerPlugin === undefined || $scope.oryxDockerPlugin === null) {
                $scope.oryxDockerPlugin = new ORYX.Plugins.AddDocker($scope.editor);
            }
            return $scope.oryxDockerPlugin;
        }
    }
};

/** Custom controller for the save dialog */
var SaveModelCtrl = ['$rootScope', '$scope', '$http', '$route', '$location',
    function($rootScope, $scope, $http, $route, $location) {

        var modelMetaData = $scope.editor.getModelMetaData();
        var description = '';
        if (modelMetaData.description) {
            description = modelMetaData.description;
        }
        modelMetaData.name=$scope.editor.getJSON().properties.name;
        var saveDialog = {
            'name': modelMetaData.name,
            'description': description
        };

        $scope.saveDialog = saveDialog;

        var json = $scope.editor.getJSON();
        json = JSON.stringify(json);

        var params = {
            modeltype: modelMetaData.model.modelType,
            json_xml: json,
            name: 'model'
        };

        $scope.status = {
            loading: false
        };

        $scope.close = function() {
            $scope.$hide();
        };

        $scope.saveAndClose = function() {
            $scope.save(function() {
                history.back();

            });
        };
        $scope.save = function(successCallback) {

            if (!$scope.saveDialog.name || $scope.saveDialog.name.length == 0) {
                return;
            }

            // Indicator spinner image
            $scope.status = {
                loading: true
            };
            modelMetaData.name = $scope.saveDialog.name;
            modelMetaData.description = $scope.saveDialog.description;
            modelMetaData.model.properties.name=$scope.saveDialog.name;
            var json = $scope.editor.getJSON();
            json = judgeJson(json);
            json.properties.name=$scope.saveDialog.name;
            json = JSON.stringify(json);

            var selection = $scope.editor.getSelection();
            $scope.editor.setSelection([]);

            // Get the serialized svg image source
            var svgClone = $scope.editor.getCanvas().getSVGRepresentation(true);
            $scope.editor.setSelection(selection);
            if ($scope.editor.getCanvas().properties["oryx-showstripableelements"] === false) {
                var stripOutArray = jQuery(svgClone).find(".stripable-element");
                for (var i = stripOutArray.length - 1; i >= 0; i--) {
                    stripOutArray[i].remove();
                }
            }

            // Remove all forced stripable elements
            var stripOutArray = jQuery(svgClone).find(".stripable-element-force");
            for (var i = stripOutArray.length - 1; i >= 0; i--) {
                stripOutArray[i].remove();
            }

            // Parse dom to string
            var svgDOM = DataManager.serialize(svgClone);

            ////encodeURIComponent
            //var basesvgDOM = BASE64.encoder(svgDOM);
            var basesvgDOM = encodeURIComponent(svgDOM);
            //var basejson = BASE64.encoder(json);
            var basejson = encodeURIComponent(json);
            var params = KISBPM.URL.getParams('kingdom.kbpm.set_kbpm_model_save', 'v1.0', {
                json_xml: basejson,
                svg_xml: basesvgDOM,
                name: $scope.saveDialog.name,
                description: $scope.saveDialog.description,
                modelId: EDITOR.UTIL.getParameterByName('modelId')
            });
            // Update
            $http({
                method: 'POST',
                data: params,
                ignoreErrors: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                },
                url: '/admin_api'
            })

            .success(function(data, status, headers, config) {
                    if (data.kdjson.flag == 1) {
                        $scope.editor.handleEvents({
                            type: ORYX.CONFIG.EVENT_SAVED
                        });
                        $scope.modelData.name = $scope.saveDialog.name;
                        $scope.modelData.lastUpdated = data.lastUpdated;

                        $scope.status.loading = false;
                        $scope.$hide();
                        // Fire event to all who is listening
                        var saveEvent = {
                            type: KISBPM.eventBus.EVENT_TYPE_MODEL_SAVED,
                            model: params,
                            modelId: modelMetaData.modelId,
                            eventType: 'update-model'
                        };
                        KISBPM.eventBus.dispatch(KISBPM.eventBus.EVENT_TYPE_MODEL_SAVED, saveEvent);

                        // Reset state
                        $scope.error = undefined;
                        $scope.status.loading = false;

                        // Execute any callback
                        if (successCallback) {
                            successCallback();
                        }
                    } else {
                        $scope.error = {};
                        console.log(JSON.stringify(data.kdjson.msg));
                        $scope.status.loading = false;
                    }

                })
                .error(function(data, status, headers, config) {
                    $scope.error = {};
                    console.log('Something went wrong when updating the process model:' + JSON.stringify(data));
                    $scope.status.loading = false;
                });
        };
        //处理判断节点
        var judgeJson = function(json) {
            var childShapes = json.childShapes;
            var childShapesForKey = {};
            var childShapesForTask = []; //任务节点
            var childShapesForExclusive = []; //排他网关
            var childShapesNew = [];
            var propertyPackagesList = {};
            var stencilsList = {};
            new Ajax.Request(KISBPM.URL.getStencilSet(), {
                asynchronous: false,
                method: 'get',
                onSuccess: function(data) {
                    data = JSON.parse(data.response);
                    jQuery.each(data.propertyPackages, function(index, pp) {
                        propertyPackagesList[pp.name] = pp.properties[0];
                    })
                    jQuery.each(data.stencils, function(index, sc) {
                        stencilsList[sc.id] = sc;
                    })
                    jQuery.each(stencilsList["BPMNDiagram"].hiddenPropertyPackages, function(index, v) {
                        //

                        if (v == 'process_idpackage' && !json.properties[propertyPackagesList[v].id]) {
                            propertyPackagesList[v].value = propertyPackagesList[v].value + "_" + new Date().getTime();
                            json.properties[propertyPackagesList[v].id] = propertyPackagesList[v].value;
                            return true;
                        } else if (v != 'process_idpackage') {
                            json.properties[propertyPackagesList[v].id] = propertyPackagesList[v].value;
                        }

                    });
                }
            });
            //如果名称和描述为空，则取模型的名称和描述
            if (json.properties.name == "") {
                json.properties.name = $scope.saveDialog.name;
                json.properties.name = $scope.saveDialog.name;
            }
            //遍历所有组件
            for (var i = 0; i < childShapes.length; i++) {
                var childShape = childShapes[i];
                var id = childShape.stencil.id;
                //获取隐藏的属性
                var hidepropertyPackages = stencilsList[id].hiddenPropertyPackages;
                jQuery.each(hidepropertyPackages, function(index, hpp) {
                    // 默认值格式为${...}时，如果元素隐藏，则为空 -- by xyx ==============
                    // 原代码：
                    // childShapes[i].properties[propertyPackagesList[hpp].id] = propertyPackagesList[hpp].value;
                    var value = propertyPackagesList[hpp].value;
                    if(typeof value === "string"){
                        value = value.replace(/\${[^}]*}/g, "");
                    }
                    childShape.properties[propertyPackagesList[hpp].id] = value;
                });

                childShapesForKey[childShape.resourceId] = childShape;
                    //属性
                if (id == 'StartNoneEvent') {
                    var formProperties = [];
                    //审核页面
                    var process_page = {};
                    process_page.name = "审核页面";
                    process_page.id = "process_page";
                    process_page.readable = true;
                    process_page.required = true;
                    process_page.type = "enum";
                    process_page.writable = true;
                    process_page.enumValues = []
                    jQuery.each(childShape.properties.process_page, function(k, v) {
                        process_page.enumValues.push({
                            name: v,
                            id: k
                        });
                        if (k === 'value') {
                            process_page.enumValues.push({
                                name: 'DEFAULT',
                                id: v
                            });
                        }
                    });
                    formProperties.push(process_page);
                    //审核事件
                    var process_eventaudit = {};
                    process_eventaudit.name = "审核事件";
                    process_eventaudit.id = "process_eventaudit";
                    process_eventaudit.readable = true;
                    process_eventaudit.required = true;
                    process_eventaudit.type = "enum";
                    process_eventaudit.writable = true;
                    process_eventaudit.enumValues = [];
                    jQuery.each(childShape.properties.process_eventaudit, function(k, v) {
                        process_eventaudit.enumValues.push({
                            name: v,
                            id: k
                        });
                        if (k === 'value') {
                            process_eventaudit.enumValues.push({
                                name: 'DEFAULT',
                                id: v
                            });
                        }
                    });
                    formProperties.push(process_eventaudit);
                    //结束事件
                    var process_eventend = {};
                    process_eventend.name = "结束事件";
                    process_eventend.id = "process_eventend";
                    process_eventend.readable = true;
                    process_eventend.required = true;
                    process_eventend.type = "enum";
                    process_eventend.writable = true;
                    process_eventend.enumValues = [];
                    jQuery.each(childShape.properties.process_eventend, function(k, v) {
                        process_eventend.enumValues.push({
                            name: v,
                            id: k
                        });
                        if (k === 'value') {
                            process_eventend.enumValues.push({
                                name: 'DEFAULT',
                                id: v
                            });
                        }
                    });
                    formProperties.push(process_eventend);
                    if (childShape.properties.process_eventinitialization) {
                        //初始化
                        var process_eventInitialization = {};
                        process_eventInitialization.name = "初始化事件";
                        process_eventInitialization.id = "process_eveninit";
                        process_eventInitialization.readable = true;
                        process_eventInitialization.required = true;
                        process_eventInitialization.type = "enum";
                        process_eventInitialization.writable = true;
                        process_eventInitialization.enumValues = [{
                            name: "DEFAULT",
                            id: childShape.properties.process_eventinitialization
                        }, {
                            id: "value",
                            name: childShape.properties.process_eventinitialization
                        }];
                        formProperties.push(process_eventInitialization);
                    }
                    childShape.properties.formproperties = {
                        formProperties: formProperties
                    }
                }else if (id === 'UserTask') {//判断是否是userTask
                    childShapesForTask.push(childShape);
                }else if (id === 'ExclusiveGateway') {
                    childShapesForExclusive.push(childShape);
                }else if (id === "SequenceFlow"){// 流
                    if(typeof childShape.properties.conditionsequenceflow === "string"){
                        // 应对在没有改变流条件时，自动添加了[]，现在去掉
                        childShape.properties.conditionsequenceflow = childShape.properties.conditionsequenceflow.replace(/\[\w*]$/, "");
                    }
                }
            }
            //遍历UserTask
            for (i = 0; i < childShapesForTask.length; i++) {
                //当前userTaskId
                var UserTaskId = childShapesForTask[i].resourceId, instanceId = UserTaskId;
                if("overrideid" in childShapesForTask[i].properties){
                    // 可能存在，但为空
                    instanceId = childShapesForTask[i].properties.overrideid || UserTaskId;
                }
                // var UserTaskId = childShapesForTask[i].resourceId;
                var formProperties = [];
                //审核结果
                formProperties.push({
                        id: instanceId + KISBPM.URL.APPROVE,
                        name: "审核意见",
                        readable: true,
                        required: true,
                        type: "string",
                        writable: true
                    });
                    //审核意见
                formProperties.push({
                    id: instanceId + KISBPM.URL.AUDITINFO,
                    name: "审核结果",
                    readable: true,
                    required: true,
                    type: "string",
                    writable: true
                });
                //审核页面
                var process_page = {};
                process_page.name = "审核页面";
                process_page.id = "process_page";
                process_page.readable = true;
                process_page.required = true;
                process_page.type = "enum";
                process_page.writable = true;
                process_page.enumValues = [];
                jQuery.each(childShapesForTask[i].properties.process_page, function(k, v) {
                    process_page.enumValues.push({
                        name: v,
                        id: k
                    });
                    if (k == 'value') {
                        process_page.enumValues.push({
                            name: 'DEFAULT',
                            id: v
                        });
                    }
                });
                formProperties.push(process_page);
                //审核事件
                var process_eventaudit = {}
                process_eventaudit.name = "审核事件";
                process_eventaudit.id = "process_eventaudit";
                process_eventaudit.readable = true;
                process_eventaudit.required = true;
                process_eventaudit.type = "enum";
                process_eventaudit.writable = true;
                process_eventaudit.enumValues = [];
                jQuery.each(childShapesForTask[i].properties.process_eventaudit, function(k, v) {
                    process_eventaudit.enumValues.push({
                        name: v,
                        id: k
                    });
                    if (k == 'value') {
                        process_eventaudit.enumValues.push({
                            name: 'DEFAULT',
                            id: v
                        });
                    }
                });
                formProperties.push(process_eventaudit);
                var properties = childShapesForKey[UserTaskId].properties;
                // 结果表达式
                formProperties.push({
                    id: instanceId + "_process_resultExpression",
                    name: "结果表达式",
                    readable: false,
                    required: true,
                    type: "string",
                    writable: true,
                    expression: properties["process_resultexpression"]
                });
                //huanglei 2018/6/7  添加task是否是填报节点属性
                 formProperties.push({
                    id: instanceId + "_process_usertasktype",
                    name: "任务类型",
                    readable: true,
                    required: true,
                    type: "string",
                    writable: true,
                    expression: properties["tasktype_type"]
                });
                properties.formproperties = {
                    formProperties: formProperties
                };
                // 处理多实例 multiinstance_collection 固定为 ID_assigneeList
                properties.multiinstance_collection = UserTaskId + "_assigneeList";
                if(properties.multiinstance_type === "None"){
                    delete properties.usertaskassignment;
                }else{
                    properties.usertaskassignment = {
                        assignment: {
                            assignee : "${assignee}",
                            candidateGroups: undefined,
                            candidateUsers: undefined
                        }
                    };
                }
            }
            //遍历网关
            for (i = 0; i < childShapesForExclusive.length; i++) {
                //当前排他网关id
                var ExclusiveId = childShapesForExclusive[i].resourceId;
                var UserTaskType = "";
                var incomingFlow = "";
                var incomingNodeId = childShapesForExclusive[i].resourceId;
                if(UserTaskType !== 'UserTask') {
                    incomingFlow = childShapesForKey[incomingNodeId].incoming;
                    incomingNodeId = childShapesForKey[childShapesForKey[incomingFlow[0].resourceId].incoming[0].resourceId].resourceId;
                    UserTaskType = childShapesForKey[incomingNodeId].stencil.id;
                }
                // var length = incomingFlow.length;
                    //拼接el表达式
                var elString = "${((";
                jQuery.each(incomingFlow, function(k, v) {
                    // 用组件编号
                    var obj = childShapesForKey[childShapesForKey[v.resourceId].incoming[0].resourceId],
                        userid = obj.resourceId;
                    if("overrideid" in obj.properties){
                        userid = obj.properties.overrideid || userid;
                    }
                    // var userid = childShapesForKey[childShapesForKey[v.resourceId].incoming[0].resourceId].resourceId;
                    elString += (userid + KISBPM.URL.APPROVE + "+")
                });
                elString += "0)/" + incomingFlow.length + ")";
                // 网关对应的流（流出）
                jQuery.each(childShapesForKey[ExclusiveId].outgoing, function(k, v) {
                    var properties = childShapesForKey[v.resourceId].properties;
                    var value = properties.conditionsequenceflow;
                    if(typeof value === "object"){
                        // 保存起来，刷新页面时来判断流条件是哪个类型
                        properties._conditionsequenceflowtype = value.type;
                        if(value.type === "approve_percent"){
                            // 通过率
                            var percentObj = value.approve_percent, elStr = elString;
                            var percent = percentObj.percent / 100;
                            if(percentObj.approve == 1){// 同意
                                elStr += '>=';
                            }else{// 不同意
                                elStr += "<";
                                if(percentObj.percent == 0||percentObj.percent==100){
                                    elStr += "=";
                                }
                                percent = 1 - percent;
                            }
                            elStr += percent.toFixed(2) + "}";
                            properties.conditionsequenceflow = elStr;
                        }else if(value.type === "condition"){
                            // 条件表达式
                            properties.conditionsequenceflow = value.condition;
                        }
                    }
                })
            }

            jQuery.each(childShapesForKey, function(k, v) {
                childShapesNew.push(v);
            });
            json.childShapes = childShapesNew;
            return json;
        }
    }
];