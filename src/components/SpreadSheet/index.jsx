import React, { Component, Fragment } from 'react';

export default class SpreadsheetComponent extends Component {
  state = {};

  spreadSheet = null;

  componentDidMount() {
    const { data = {} } = this.props;
    const xsOptions = {
      showGrid: true, // 是否显示默认网格
      showToolbar: true, // 是否显示工具栏
      showContextmenu: true, // 是否显示右键菜单
      showAddCol: false, // 是否显示添加列按钮
      showAddRow: false, // 是否显示添加行按钮
      isNeedCut: true, // 是否启用剪切功能
      isNeedAutoFilter: false, // 是否启用自动过滤
      isOnlyCopeText: true, // 设置在复制、剪切、自动填充  只处理文本
      waterMarkContent: ['融汇通金', '分公司1填报', '鸟人'],
      isShowWatermark: false,
      name: 'sheet1',
      fxObj: document.querySelector('#fxFn'),
      row: {
        len: 10,
        height: 30,
        minHeight: 2, // 设置高度可调最小高度
      },
      col: {
        len: 20,
        width: 50,
        indexWidth: 20,
        minWidth: 2, // 设置列最小宽度
        colAttr: [],
      },
      streamCharts: [
        { finalFirstRows: 0, finalLastRows: 0 },
        { finalFirstRows: 3, finalLastRows: 10 },
      ],
      isCalCulatorFormula: true, // 是否运算公式
      isCalculatorDropdownRange: true, // 是否运算下拉项
      imageImg: document.querySelectorAll('.sheet-img-collection img')[0],
      imageFile: document.querySelectorAll('.sheet-img-collection img')[1],
      imageCheckedBox: document.querySelectorAll('.sheet-img-collection img')[2],
      imageUncheckedBox: document.querySelectorAll('.sheet-img-collection img')[3],
      contextMenuItems: [
        {
          key: 'freezePanes',
          isShow: true,
        },
        { key: 'divider', isShow: true },
        {
          key: 'edit_modal',
          title: '编辑',
          isShow: true,
          callback(params) {
            console.table(params);
          },
        },
        { key: 'divider', isShow: true },
        {
          key: 'insert_modal',
          title: '插入',
          isShow: true,
          callback(params) {
            console.table(params);
          },
        },
        {
          key: 'delete_settings',
          title: '删除',
          isShow: true,
          callback: params => {
            console.table(params);
          },
        },
      ],
      hooks: {
        beforeChangeFile(cellProps, row, col, index) {
          console.log(`row:${row} col:${col} index:${index}`);
        },
        afterTriggerHistoryAction(historyType, params) {
          console.table(historyType, params);
        },
        /**
         * @description: 右键菜单显示前回调 可用于显示和隐藏菜单
         * @param {type}
         * @return:
         * @Author: linjian
         * @Date: 2019-08-05 10:50:29
         */
        beforeContextMenuShow(contextMenu) {
          console.log('show contextMenu before');
        },
        /**
         * @description: 选择单元格后回调
         * @param {type}
         * @return:
         * @Author: linjian
         * @Date: 2019-06-24 13:32:05
         */
        afterSelection(sri, sci, eri, eci) {
          // console.log('sri:' + sri + ' sci:' + sci + ' eri:' + eri + ' eci:' + eci);
          document.querySelector('#J_choose_location').innerHTML = `${sri + 1},${sci + 1}`;
        },
        /** 拖动鼠标多选之后 回调
         * @description:
         * @param {type}
         * @return:
         * @Author: linjian
         * @Date: 2019-06-24 14:23:55
         */
        afterMultiSelection(sri, sci, eri, eci) {
          // console.log('sri:' + sri + ' sci:' + sci + ' eri:' + eri + ' eci:' + eci);
          document.querySelector('#J_choose_location').innerHTML = `${sri + 1},${sci + 1}:${eri +
            1},${eci + 1}`;
        },
        /**
         * @description:
         * @param {string} tipType：toast/alert/confirm
         * @param {string} msg 消息内容
         * @return:
         * @Author: linjian
         * @Date: 2019-06-14 09:39:30
         */
        tipMessage(tipType, msg) {
          switch (tipType) {
            case 'toast':
              console.log('tipType', tipType, 'msg', msg);
              break;
            case 'alert':
              console.log('tipType', tipType, 'msg', msg);
              break;
            case 'confirm':
              console.log('tipType', tipType, 'msg', msg);
              break;
            default:
              break;
          }
        },
        /**
         * @description: 增加行回调，如果有这个回调 就不会执行默认操作
         * @param {type}
         * @return:
         * @Author: linjian
         * @Date: 2019-06-26 09:16:33
         */
        insertRow() {
          // xs
          //   .sheet
          //   .insertDeleteRowColumn('insert-row', xs.data.rows.len, 1, xs.data.rows.len - 1);
        },
        /**
         * @description: 增加l列回调，如果有这个回调 就不会执行默认操作
         * @param {type}
         * @return:
         * @Author: linjian
         * @Date: 2019-06-26 09:16:33
         */
        insertCol() {
          // xs.sheet.insertDeleteRowColumn('insert-column', xs.data.cols.len, 1);
        },
        requestCondition(ri, ci, conditionItems, afterGetConditionItemsCallback) {
          // console.log(ri, ci, conditionItems, afterGetConditionItemsCallback);
          let content = [
            'linjian1',
            'linjian2',
            'linjian3',
            'linjian4',
            'linjian5',
            'linjian6',
            'linjian7',
          ];
          if (conditionItems) {
            content = ['黄垒1', '黄垒2'];
          }
          afterGetConditionItemsCallback(content);
        },
        requestData({ startRow, endRow, conditions }, callback) {},
      },
      // hideCol: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
    window.xsObj.spreadsheet.locale('zhCn');
    this.spreadSheet = window.xsObj
      .spreadsheet('#x-spreadsheet', xsOptions)
      .loadData(data)
      .change(() => {});
  }

  setCellStyle = (property, value) => {
    const {
      sheet,
      sheet: { cellAttrChange },
    } = this.spreadSheet;
    cellAttrChange.call(sheet, property, value);
  };

  render() {
    return (
      <Fragment>
        <div id="x-spreadsheet"></div>
        <div className="formulabar-text" id="J_choose_location"></div>
        <div style={{ display: 'none' }} className="sheet-img-collection">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACK0lEQVQ4T63UPYgTQRQH8P/bzXpqo0HRQgiCFoeNYE4tREmfr5lALEQRtdAT5K7RRg5BPCuvEcHCSuQQCfJeEjFXCWIh2okfcILY2IgIcoiJLrtPJtyC5nIJ0dtu2Hm/eTPvzRDW+KPEy+fz6SAIjgPYMsoaRPRFVedF5JuL64KlUmm77/tNVV0AEI8IjgEwqVRqX61Wa3dBY8wJANtEZG4ULJlrrb0M4D0z1xJwkoh+MPPdarW6IQzDGwAOAAgBzInIw0ELGWPOEJHHzHdWgMYYl6UvItPLuERRdK7ZbH5cDR0IWmufM/Oh5CyNMa5Qm0XkVi9YqVT2x3E8TkQGwELfDK21tTiOb9br9WfL53udiF4wc92Nc7nc+nQ6PamqRwB8IKJFVd1DRO/6gqVSacL3/ccAHqnqd9cJInLBYeVyueh53nlVvSIiL5OMB27ZTSoUCjuCINgN4A0zf13O9CqAtIhM9bbWULD3rIwxDvslItf6FWZVUFWfAtjped5Su91+22q1flYqlbyqHmXmk6NW+RSAMYcS0TpVPUhEDwCc7nQ6E61Wa2lUcJyZpwGoC6xWq34YhvNE9JqZZ/+5sf8MtNbWoyi61Gg0FtcKfMXMe4fd7xVFKZfLx4hok4jcToKz2WyQyWSeMPPhYaC19qKqfhKR+927XCwWN6ZSKdfMs6rqHgSo6lbP86ZUdWYIuIuIzkZRVGw0Gp//+4EF4Br/3l8P7LAtjfL/N2JOPCTFuUnLAAAAAElFTkSuQmCC"
            alt=""
          />
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACZUlEQVQ4T8WUT2gTQRTGvzfTBvQoVREE8SYeFLws2ZmXxhZtK6igiAgqeBH8S8GD2INeimhRsGfFs4gotCg9hszY7TZEwaOCeBAURFGRZttsd2SlG9I0NBQKzm2YNz++9773HmGdD60zD/8fyMz7nHN3AWwgoo0ArJRypFQq/UmzXVWh7/t5IUSPtXYyDVZKHRFCPHDOnbDWVgFIrfUoAG2t5VWBSikWQowDGDDGfFuC3QHQb4z50lx7rfVjAE+ttVNtFTJzv3NunIj2pzCt9SAR3Z6fnz8wOzv7vdVIZlZpAsaYsRVApdSQEOJ+FEV9lUrlq+/7fVLK0YWFhcEwDH+36wpmPg0gMsY8WwZk5qMA7kVRxClMa62JaGxubm6oWq3+SmG+7+8QQpTr9boKw/Cz53lbc7ncRBzHxSAIag0gM+92zk3W6/XeNFBr7QEYr9VqA60wAMPW2hfMvNk59ypJkovT09OVZaZorYMkSa6mD1rrvQAeLS4uDgRB8KNZWSsMwGVrbZiV4p9Cz/O2d3d3P7TWDqV3Zp4ioivlcvnDWmANhUqpQ0TUb629tgR87Zw7Y639mNUsU+b7/hYhxMtWZcsUMvMeADeMMaeWgMcB3HLOPSeiswBGjDFPisViTxzHUwAuNafZ7HxmimDmt1LK3lKp9DMNyOfzu6SUB+M4npiZmfmUwZIkuZAZ0K6FGi4rpY4JIQ4bY861adxtaQd0gq0YPa319XS0nHM3oyh619XVtSmXyxWdc8NEdN4Y86bTulsxKYVCoZAkyUkAO4konYz3UsqxbJusGdjpQ6f3dV+wfwHIazMkPz5y0QAAAABJRU5ErkJggg=="
            alt=""
          />
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAC0tAIdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpENkJCODQ0MUExMjkxMUU5QUUwREExNDZCOUY0RkE1NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpENkJCODQ0MkExMjkxMUU5QUUwREExNDZCOUY0RkE1NCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2QkI4NDNGQTEyOTExRTlBRTBEQTE0NkI5RjRGQTU0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQ2QkI4NDQwQTEyOTExRTlBRTBEQTE0NkI5RjRGQTU0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+N72W1QAAAH1JREFUeNqskm0GACEQhtvV3bpSJNGPdKS6WCSxMaw+ZtdELxM1z4zXTFcIgZHFWwghKGiM8WY7Ok075wbfP7LWppRItDEm5zzPBCSlbKf3Hq5a61JK/4L4hhql1IoO9JtoBbXWFZ179+kVRZwAhKL4vL/Q7V1y+C5E+hFgAOiJMcbuCH22AAAAAElFTkSuQmCC"
            alt=""
          />
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAIAAAC0tAIdAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDODkzMkVDQUExMjkxMUU5QkJGNkVDRjVFMzY2MzZEMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDODkzMkVDQkExMjkxMUU5QkJGNkVDRjVFMzY2MzZEMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkM4OTMyRUM4QTEyOTExRTlCQkY2RUNGNUUzNjYzNkQzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkM4OTMyRUM5QTEyOTExRTlCQkY2RUNGNUUzNjYzNkQzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Zf5svAAAACtJREFUeNpi3LFjBwPRgAWI3d3diVG6c+dOJgZSwKjqkaqaBZJciFQNEGAAfh0HdcX9m3AAAAAASUVORK5CYII="
            alt=""
          />
        </div>
      </Fragment>
    );
  }
}
