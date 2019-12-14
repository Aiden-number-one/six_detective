/**
 * @Author:      limin01
 * @DateTime:    2018-12-11 15:05:20
 * @Description: 表格树形
 * @Last Modified by:   lanjianyan 
 * @Last Modified time: 2019-04-08 10:57:05 
 */
function TableTree(element, options = {}) {
    this.element = element;
    this.menus = "";
    this.ths = options.checkbox ? ['<th>全选</th>'] : []; // 表头
    this.trs = []; // 行
    this.isTheadRendered = false; // 表头是否渲染过
    this.index = 0; // 当前li的层级
    const defaultOptions = {
        indentSize: 20, // 缩进
        openAll: false, // 全选
        checkbox: false, // 勾选框
        widthScale: 1, // 宽度的增大缩小比例 number类型（如果宽度不够宽，可设置为1.5）
    }
    this.options = Object.assign(defaultOptions, options);
    const elementWidth = this.element.width();
    this.widthPercentage = (elementWidth - 40) * this.options.widthScale / Object.keys(this.options.data[0].columns).length + 'px';
    this.init();
    this.bindEvent();
}

TableTree.prototype.init = function() {
    let html = this.generateTableTree("id", "pId", this.options.data);
    this.element.html(html);
    App.initUniform();
}

// format
TableTree.prototype.format = function(argument) {
    if (typeof argument === "object" && argument) {
        return argument.formatter();
    } else {
        return argument;
    }
}

TableTree.prototype.formatTitle = function(argument) {
    if (typeof argument === "object") {
        return "";
    } else {
        return argument;
    }
}

// 渲染td 默认展开全部; 后续可添加配置
TableTree.prototype.renderTd = function(i, columns, hasChildren) {
    if (this.isFirstTd) {
        this.isFirstTd = false;
        return `<td style="max-width: ${this.widthPercentage}" class="ellipsis" title='${this.formatTitle(columns[i])}'> 
	                <span class="table-row-indent indent-level-0" style="padding-left: ${this.index * this.options.indentSize}px;"></span>
	                <span class="table-row-expand-icon ${hasChildren ? "table-row-collapsed" : "table-row-spaced"}"></span>
	                ${this.format(columns[i])} 
	            </td>`;
    } else {
        return `<td style="max-width: ${this.widthPercentage}" class="ellipsis" title='${this.formatTitle(columns[i])}'> ${this.format(columns[i])} </td>`;
    }
}

TableTree.prototype.renderTdCheckbox = function(attrs) {
    if (this.options.checkbox) {
        return `<td class="width40">
                        <input type="checkbox" ${attrs} />
                    </td>`
    } else {
        return "";
    }
}

// TableTree.prototype.renderThCheckbox = function() {
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
TableTree.prototype.generateTableTree = function(id, pId, data) {
    for (let item of data) {
        this.index++;
        // 循环列，解析表头和表格
        let tds = ""; // 表格单元格
        let hasChildren = (item.hasOwnProperty("children") && item.children.length > 0);
        this.isFirstTd = true;
        let attrs = ""; // 自定义属性
        if (item.hasOwnProperty('attr')) {
        	let attr = item.attr;
        	for (let i in attr) {
        		attrs += `${i}='${attr[i]}' `;
        	}
        }
        for (let i in item.columns) {
            if (!this.isTheadRendered) {
                this.ths.push(`<th class="t-l"> ${i} </th>`);
            }
            tds += this.renderTd(i, item.columns, hasChildren);
        }
        this.isTheadRendered = true;
        this.trs.push(`<tr key="${item[id].replace(/ /g, "")}" pKey="${item[pId].replace(/ /g, "")}" level="${this.index}" style="display: ${this.index === 1 ? "table-row" : "none"}">
						${this.renderTdCheckbox(attrs)}
						${tds}
					</tr>`);
        if (hasChildren) {
            this.generateTableTree(id, pId, item.children);
        }
        this.index--;
    }
    return `<thead>
                <tr>
                    ${this.ths.join(',')}
                </tr>
            </thead>
            <tbody>
            	${this.trs.join(',')}
           	<tbody>`;
}

// 打开节点 key: 节点的key； isChangeIcon: 是否改变图标
TableTree.prototype.openNode = function(key, isChangeIcon = true) {
    let node = $(`[key="${key}"]`); // tr
    let childNode = $(`[pkey="${key}"]`); // 子集tr
    let _this = this;
    childNode.show();
    isChangeIcon && node.find(".table-row-expand-icon").removeClass("table-row-collapsed").addClass("table-row-expanded");
    $.each(childNode, function() {
        let isExpanded = $(this).find(".table-row-expanded").length > 0 ? true : false; // 状态是否为展开（-号）
        let key = $(this).attr("key");
        if (isExpanded) {
            _this.openNode(key, false);
        }
    })
}

// 关闭节点 key: 节点的key； isChangeIcon: 是否改变图标
TableTree.prototype.closeNode = function(key, isChangeIcon = true) {
    let node = $(`[key="${key}"]`); // tr
    let childNode = $(`[pkey="${key}"]`); // 子集tr
    let _this = this;
    childNode.hide();
    isChangeIcon && node.find(".table-row-expand-icon").removeClass("table-row-expanded").addClass("table-row-collapsed");
    $.each(childNode, function() {
        let isExpanded = $(this).find(".table-row-expanded").length > 0 ? true : false; // 状态是否为展开（-号）
        let key = $(this).attr("key");
        if (isExpanded) {
            _this.closeNode(key, false);
        }
    })
}


TableTree.prototype.bindEvent = function() {
    let _this = this;
    this.element.find(".table-row-expand-icon").click(function() {
        let isCollapsed = $(this).hasClass("table-row-collapsed"); // 状态是否为关闭（+号）
        let key = $(this).closest("tr").attr("key"); // 当前tr
        if (isCollapsed) {
            _this.openNode(key);
        } else {
            _this.closeNode(key);
        }
    });

    // 改变下级选中状态
    function changeChildrenCheckedStatus(checked, key) {
        _this.element.find(`tbody tr[pkey='${key}']`).each(function() {
            $(this).find("input[type=checkbox]:not(.make-switch)").prop("checked", checked);
            let newKey = $(this).attr('key');
            changeChildrenCheckedStatus(checked, newKey);
            // 添加active样式
            if(checked){
                $(this).addClass("active")
            } else {
                $(this).removeClass("active")
            }
        })
    }

    // 改变上级选中状态
    function changeParentsCheckedStatus(checked, pkey) {
        if (pkey === "-1") {
            return;
        }
        let isAllChecked = checked;  // 同类是否全选
        // 如果是选中了 则判断同类是否都选中 
        if (checked) {
            _this.element.find(`tbody tr[pkey='${pkey}']`).each(function() {
                if (!$(this).find("input[type=checkbox]:not(.make-switch)").prop("checked")) {
                    isAllChecked = false;
                    return;
                }
            })

        }
        // 添加active样式
        if(isAllChecked){
            _this.element.find(`tbody tr[key='${pkey}']`).addClass("active")
        } else {
            _this.element.find(`tbody tr[key='${pkey}']`).removeClass("active")
        }
        _this.element.find(`tbody tr[key='${pkey}'] input[type=checkbox]:not(.make-switch)`).prop("checked", isAllChecked);
        let newPkey = _this.element.find(`tbody tr[key='${pkey}']`).attr('pkey');
        changeParentsCheckedStatus(isAllChecked, newPkey);
    }

    this.element.find('tbody tr input[type=checkbox]:not(.make-switch)').change(function() {
        var checked = $(this).is(":checked");
        var key = $(this).closest('tr').attr('key');
        var pkey = $(this).closest('tr').attr('pkey');
        // 改变下级选中状态
        changeChildrenCheckedStatus(checked, key);
        // 改变上级选中状态
        changeParentsCheckedStatus(checked, pkey);
        // 添加active样式
        if(checked){
            $(this).closest('tr').addClass("active")
        } else {
            $(this).closest('tr').removeClass("active")
        }
        jQuery.uniform.update();
    });
}

$.fn.tableTree = function(options) {
    return new TableTree(this, options);
}
// 调用方式
// $("#J_table_tree").tableTree({
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