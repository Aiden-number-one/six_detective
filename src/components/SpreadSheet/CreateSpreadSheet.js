/*
 * @Description: sheet的高阶函数
 * @Author: mus
 * @Date: 2019-09-20 17:15:40
 * @LastEditTime: 2019-09-25 13:56:54
 * @LastEditors: lan
 * @Email: mus@szkingdom.com
 */
import React, { Component } from 'react';
import _ from 'lodash';

const styleKeyMap = {
  'font-bold': 'bold',
  'font-italic': 'italic',
};

export default WrapperComponent =>
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      // sheet的实例
      this.spreadSheet = null;
      // 点击单元格回调函数
      this.clickCellReflectFunc = () => {};
      // 点击cell
      this.clickCell = _.debounce(this.clickCell, 500);
    }

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
          afterSelection: (sri, sci, eri, eci) => {
            this.clickCell(sri, sci, eri, eci);
          },
          /** 拖动鼠标多选之后 回调
           * @description:
           * @param {type}
           * @return:
           * @Author: linjian
           * @Date: 2019-06-24 14:23:55
           */
          afterMultiSelection: (sri, sci, eri, eci) => {
            this.clickCell(sri, sci, eri, eci);
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

    // 点击单元格
    clickCell = (sri, sci) => {
      if (!this.spreadSheet) {
        return;
      }
      const {
        sheet: { data },
      } = this.spreadSheet;
      this.clickCellReflectFunc(data.getCellStyle(sri, sci) || {});
    };

    // 设置cell属性
    setCellStyle = (property, value) => {
      const {
        sheet,
        sheet: { cellAttrChange },
      } = this.spreadSheet;
      cellAttrChange.call(sheet, property, value);
    };

    // 得到cell属性
    getCellStyle = property => {
      const {
        sheet: { data },
      } = this.spreadSheet;
      return (() => {
        const styles = data.getSelectedCellStyle();
        const cells = data.getSelectedCell();
        if (property === 'font-bold' || property === 'font-italic') {
          return styles.font[styleKeyMap[property]];
        }
        if (property === 'underline' || property === 'strike' || property === 'textwrap') {
          return styles[property];
        }
        if (property === 'merge') {
          return cells && !!cells[property];
        }
        if (property === 'freeze') {
          return data.freeze[0] === data.selector.ri && data.freeze[1] === data.selector.ci;
        }
        if (property === 'readOnly') {
          if (cells) {
            if (cells.readOnly) {
              cells.readOnly = !cells.readOnly;
            } else {
              cells.readOnly = true;
            }
          }
        }
        return false;
      })();
    };

    // 设置点击单元格的回调函数
    setCellCallback = callback => {
      this.clickCellReflectFunc = callback;
    };

    render() {
      const props = {
        setCellStyle: this.setCellStyle,
        getCellStyle: this.getCellStyle,
        setCellCallback: this.setCellCallback,
        ...this.props,
      };
      return <WrapperComponent {...props} />;
    }
  };
