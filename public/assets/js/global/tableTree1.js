var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * @Author:      limin01
 * @DateTime:    2018-12-11 15:05:20
 * @Description: 表格树形
 */
function TableTree1(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.element = element;
    this.menus = "";
    this.ths = options.checkbox ? ['<th>全选</th>'] : []; // 表头
    this.trs = []; // 行
    this.isTheadRendered = false; // 表头是否渲染过
    this.index = 0; // 当前li的层级
    var defaultOptions = {
        indentSize: 20, // 缩进
        openAll: false, // 全选
        checkbox: false, // 勾选框
        widthScale: 1 // 宽度的增大缩小比例 number类型（如果宽度不够宽，可设置为1.5）
    };
    this.options = _extends(defaultOptions, options);
    var elementWidth = this.element.width();
    this.widthPercentage = (elementWidth - 40) * this.options.widthScale / Object.keys(this.options.data[0].columns).length + 'px';
    this.init();
    this.bindEvent();
}

TableTree1.prototype.init = function () {
    var html = this.generateTableTree1("id", "pId", this.options.data);
    this.element.html(html);
    App.initUniform();
};

// format
TableTree1.prototype.format = function (argument) {
    if ((typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) === "object" && argument) {
        return argument.formatter();
    } else {
        return argument;
    }
};

TableTree1.prototype.formatTitle = function (argument) {
    if ((typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) === "object") {
        return "";
    } else {
        return argument;
    }
};

// 渲染td 默认展开全部; 后续可添加配置
TableTree1.prototype.renderTd = function (i, columns, hasChildren) {
    if (this.isFirstTd) {
        this.isFirstTd = false;
        return '<td style="max-width: ' + this.widthPercentage + '" class="ellipsis" title=\'' + this.formatTitle(columns[i]) + '\'> \n\t                <span class="table-row-indent indent-level-0" style="padding-left: ' + this.index * this.options.indentSize + 'px;"></span>\n\t                <span class="table-row-expand-icon ' + (hasChildren ? "table-row-collapsed" : "table-row-spaced") + '"></span>\n\t                ' + this.format(columns[i]) + ' \n\t            </td>';
    } else {
        return '<td style="max-width: ' + this.widthPercentage + '"  class="ellipsis" title=\'' + this.formatTitle(columns[i]) + '\'> ' + this.format(columns[i]) + ' </td>';
    }
};

TableTree1.prototype.renderTdCheckbox = function (attrs) {
    if (this.options.checkbox) {
        return '<td class="width40">\n                        <input type="checkbox" ' + attrs + ' />\n                    </td>';
    } else {
        return "";
    }
};

// TableTree1.prototype.renderThCheckbox = function() {
//     if (this.options.checkbox) {
//         return `<th class="width40">
//                     <input type="checkbox" class="group-checkable" />
//                 </th>`
//     } else {
//         return "";
//     }
// }

/*
 	function: 生成html
 	@id: 当前id
 	@pId: 父级Id
 	@data: 数据
*/
/**/
TableTree1.prototype.generateTableTree1 = function (id, pId, data) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            this.index++;
            // 循环列，解析表头和表格
            var tds = ""; // 表格单元格
            var hasChildren = item.hasOwnProperty("children") && item.children.length > 0;
            this.isFirstTd = true;
            var attrs = ""; // 自定义属性
            if (item.hasOwnProperty('attr')) {
                var attr = item.attr;
                for (var i in attr) {
                    attrs += i + '=\'' + attr[i] + '\' ';
                }
            }
            for (var _i in item.columns) {
                if (!this.isTheadRendered) {
                    this.ths.push('<th class="t-l" style="min-width:40px"> ' + _i + ' </th>');
                }
                tds += this.renderTd(_i, item.columns, hasChildren);
            }
            this.isTheadRendered = true;
            this.trs.push('<tr key="' + item[id].replace(/ /g, "") + '" pKey="' + item[pId].replace(/ /g, "") + '" level="' + this.index + '" style="display: ' + (this.index === 1 ? "table-row" : "none") + '">\n\t\t\t\t\t\t' + this.renderTdCheckbox(attrs) + '\n\t\t\t\t\t\t' + tds + '\n\t\t\t\t\t</tr>');
            if (hasChildren) {
                this.generateTableTree1(id, pId, item.children);
            }
            this.index--;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return '<thead>\n                <tr>\n                    ' + this.ths.join(',') + '\n                </tr>\n            </thead>\n            <tbody>\n            \t' + this.trs.join(',') + '\n           \t<tbody>';
};

// 打开节点 key: 节点的key； isChangeIcon: 是否改变图标
TableTree1.prototype.openNode = function (key) {
    var isChangeIcon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var node = $('[key="' + key + '"]'); // tr
    var childNode = $('[pkey="' + key + '"]'); // 子集tr
    var _this = this;
    childNode.show();
    isChangeIcon && node.find(".table-row-expand-icon").removeClass("table-row-collapsed").addClass("table-row-expanded");
    $.each(childNode, function () {
        var isExpanded = $(this).find(".table-row-expanded").length > 0 ? true : false; // 状态是否为展开（-号）
        var key = $(this).attr("key");
        if (isExpanded) {
            _this.openNode(key, false);
        }
    });
};

// 关闭节点 key: 节点的key； isChangeIcon: 是否改变图标
TableTree1.prototype.closeNode = function (key) {
    var isChangeIcon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var node = $('[key="' + key + '"]'); // tr
    var childNode = $('[pkey="' + key + '"]'); // 子集tr
    var _this = this;
    childNode.hide();
    isChangeIcon && node.find(".table-row-expand-icon").removeClass("table-row-expanded").addClass("table-row-collapsed");
    $.each(childNode, function () {
        var isExpanded = $(this).find(".table-row-expanded").length > 0 ? true : false; // 状态是否为展开（-号）
        var key = $(this).attr("key");
        if (isExpanded) {
            _this.closeNode(key, false);
        }
    });
};

TableTree1.prototype.bindEvent = function () {
    var _this = this;
    this.element.find(".table-row-expand-icon").click(function () {
        var isCollapsed = $(this).hasClass("table-row-collapsed"); // 状态是否为关闭（+号）
        var key = $(this).closest("tr").attr("key"); // 当前tr
        if (isCollapsed) {
            _this.openNode(key);
        } else {
            _this.closeNode(key);
        }
    });

    // 改变下级选中状态
    function changeChildrenCheckedStatus(checked, key) {
        _this.element.find('tbody tr[pkey=\'' + key + '\']').each(function () {
            $(this).find("input[type=checkbox]:not(.make-switch)").prop("checked", checked);
            var newKey = $(this).attr('key');
            changeChildrenCheckedStatus(checked, newKey);
        });
    }

    // 改变上级选中状态
    function changeParentsCheckedStatus(checked, pkey) {
        if (pkey === "-1") {
            return;
        }
        var isAllChecked = checked; // 同类是否全选
        // 如果是选中了 则判断同类是否都选中 
        if (checked) {
            _this.element.find('tbody tr[pkey=\'' + pkey + '\']').each(function () {
                if (!$(this).find("input[type=checkbox]:not(.make-switch)").prop("checked")) {
                    isAllChecked = false;
                    return;
                }
            });
        }
        _this.element.find('tbody tr[key=\'' + pkey + '\'] input[type=checkbox]:not(.make-switch)').prop("checked", isAllChecked);
        var newPkey = _this.element.find('tbody tr[key=\'' + pkey + '\']').attr('pkey');
        changeParentsCheckedStatus(isAllChecked, newPkey);
    }

    this.element.find('tbody tr input[type=checkbox]:not(.make-switch)').change(function () {
        var checked = $(this).is(":checked");
        var key = $(this).closest('tr').attr('key');
        var pkey = $(this).closest('tr').attr('pkey');
        // 改变下级选中状态
        changeChildrenCheckedStatus(checked, key);
        // 改变上级选中状态
        changeParentsCheckedStatus(checked, pkey);
        jQuery.uniform.update();
    });
};

$.fn.TableTree1 = function (options) {
    return new TableTree1(this, options);
};
// 调用方式
// $("#J_table_tree").TableTree1({
//     openAll: true,
//     data: [{
//         id: "0",
//         pId: "-1",
//         columns: {
//             "name": "Limin",
//             age: "24",
//             address: "Sichuan",
//         },
//         children: [{
//             id: "01",
//             pId: "0",
//             columns: {
//                 name: "Limin",
//                 age: "24",
//                 address: "Sichuan",
//             },
//         }, {
//             id: "02",
//             pId: "0",
//             columns: {
//                 name: "Limin",
//                 age: "24",
//                 address: "Sichuan",
//             },
//             children: [{
//                 id: "021",
//                 pId: "02",
//                 columns: {
//                     name: "Limin",
//                     age: "24",
//                     address: "Sichuan",
//                 },
//                 children: [{
//                     id: "0211",
//                     pId: "021",
//                     columns: {
//                         name: "Limin",
//                         age: "24",
//                         address: "Sichuan",
//                     },
//                 }],
//             }],
//         }, {
//             id: "03",
//             pId: "0",
//             columns: {
//                 name: "Limin",
//                 age: "24",
//                 address: "Sichuan",
//             },
//             children: [{
//                 id: "031",
//                 pId: "03",
//                 columns: {
//                     name: "Limin",
//                     age: "24",
//                     address: "Sichuan",
//                 },
//                 children: [{
//                     id: "0311",
//                     pId: "031",
//                     columns: {
//                         name: "Limin",
//                         age: "24",
//                         address: "Sichuan",
//                     },
//                 }, {
//                     id: "0312",
//                     pId: "031",
//                     columns: {
//                         name: "Limin",
//                         age: "24",
//                         address: "Sichuan",
//                     },
//                 }],
//             }],
//         }]
//     }]
// });