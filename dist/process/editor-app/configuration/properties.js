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
(function() {
    var path = "editor-app/configuration/properties/";
    KISBPM.PROPERTY_CONFIG = {
        "string": {
            "readModeTemplateUrl": path + "default-value-display-template.html",
            "writeModeTemplateUrl": path + "string-property-write-mode-template.html"
        },
        "boolean": {
            "templateUrl": path + "boolean-property-template.html"
        },
        "text": {
            "readModeTemplateUrl": path + "default-value-display-template.html",
            "writeModeTemplateUrl": path + "text-property-write-template.html"
        },
        "kisbpm-multiinstance": {
            "templateUrl": path + "multiinstance-property-write-template.html"
        },
        "kisbpm-tasktype": {
            "templateUrl": path + "tasktype-property-write-template.html"
        },

        "oryx-formproperties-complex": {
            "readModeTemplateUrl": path + "form-properties-display-template.html",
            "writeModeTemplateUrl": path + "form-properties-write-template.html"
        },
        "oryx-executionlisteners-multiplecomplex": {
            "readModeTemplateUrl": path + "execution-listeners-display-template.html",
            "writeModeTemplateUrl": path + "execution-listeners-write-template.html"
        },
        "oryx-tasklisteners-multiplecomplex": {
            "readModeTemplateUrl": path + "task-listeners-display-template.html",
            "writeModeTemplateUrl": path + "task-listeners-write-template.html"
        },
        "oryx-eventlisteners-multiplecomplex": {
            "readModeTemplateUrl": path + "event-listeners-display-template.html",
            "writeModeTemplateUrl": path + "event-listeners-write-template.html"
        },
        "oryx-usertaskassignment-complex": {
            "readModeTemplateUrl": path + "assignment-display-template.html",
            "writeModeTemplateUrl": path + "assignment-write-template.html"
        },
        "oryx-servicetaskfields-complex": {
            "readModeTemplateUrl": path + "fields-display-template.html",
            "writeModeTemplateUrl": path + "fields-write-template.html"
        },
        "oryx-callactivityinparameters-complex": {
            "readModeTemplateUrl": path + "in-parameters-display-template.html",
            "writeModeTemplateUrl": path + "in-parameters-write-template.html"
        },
        "oryx-callactivityoutparameters-complex": {
            "readModeTemplateUrl": path + "out-parameters-display-template.html",
            "writeModeTemplateUrl": path + "out-parameters-write-template.html"
        },
        "oryx-subprocessreference-complex": {
            "readModeTemplateUrl": path + "subprocess-reference-display-template.html",
            "writeModeTemplateUrl": path + "subprocess-reference-write-template.html"
        },
        "oryx-sequencefloworder-complex": {
            "readModeTemplateUrl": path + "sequenceflow-order-display-template.html",
            "writeModeTemplateUrl": path + "sequenceflow-order-write-template.html"
        },
        "conditionsequenceflow": {
            "readModeTemplateUrl": path + "condition-expression-display-template.html",
            "writeModeTemplateUrl": path + "condition-expression-write-template.html"
        },
        "oryx-signaldefinitions-multiplecomplex": {
            "readModeTemplateUrl": path + "signal-definitions-display-template.html",
            "writeModeTemplateUrl": path + "signal-definitions-write-template.html"
        },
        "oryx-signalref-string": {
            "readModeTemplateUrl": path + "default-value-display-template.html",
            "writeModeTemplateUrl": path + "signal-property-write-template.html"
        },
        "oryx-messagedefinitions-multiplecomplex": {
            "readModeTemplateUrl": path + "message-definitions-display-template.html",
            "writeModeTemplateUrl": path + "message-definitions-write-template.html"
        },
        "oryx-messageref-string": {
            "readModeTemplateUrl": path + "default-value-display-template.html",
            "writeModeTemplateUrl": path + "message-property-write-template.html"
        },
        "pagestring": {
            "readModeTemplateUrl": path + "page-value-display-template.html",
            "writeModeTemplateUrl": path + "page-property-write-template.html"
        },
        "eventaudit": {
            "readModeTemplateUrl": path + "eventaudit-value-display-template.html",
            "writeModeTemplateUrl": path + "eventaudit-property-write-template.html"
        },
        "eventend": {
            "readModeTemplateUrl": path + "eventaudit-value-display-template.html",
            "writeModeTemplateUrl": path + "eventaudit-property-write-template.html"
        },
        "eventinit": {
            "readModeTemplateUrl": path + "default-value-display-template.html",
            "writeModeTemplateUrl": path + "string-property-write-mode-template.html"
        }
    };
})();
