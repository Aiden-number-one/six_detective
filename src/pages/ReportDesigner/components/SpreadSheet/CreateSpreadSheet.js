/*
 * @Description: sheet的高阶函数
 * @Author: mus
 * @Date: 2019-09-20 17:15:40
 * @LastEditTime : 2020-01-17 19:41:23
 * @LastEditors  : mus
 * @Email: mus@szkingdom.com
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { generateJson } from './spreadSheetUtil';
import { INITHEIGHT, INITWIDTH } from '../../utils';

const styleKeyMap = {
  'font-bold': 'bold',
  'font-italic': 'italic',
};

export default WrapperComponent => {
  class Hoc extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      // sheet的实例
      this.spreadSheet = null;
      // 点击单元格回调函数
      this.clickCellReflectFunc = () => {};
      // 格式刷的回调函数
      this.paintformatActiveFunc = () => {};
      // 点击单元格返回属性
      // 点击cell
      // this.clickCell = _.debounce(this.clickCell, 500);
      // WrapperComponent的ref
      this.WrapperComponentRef = React.createRef();
    }

    componentDidMount() {
      //
    }

    /**
     * @description: 初始化sheet
     * @param {object} options sheet的options，用于补充options
     * @param {object} callbackProps 钩子中的回调函数集合
     * @return:
     * @Author: mus
     * @Date: 2019-12-12 11:27:53
     */
    initSheet = (options, callbackProps) => {
      const { data = {} } = this.props;
      const xsOptions = {
        showGrid: true, // 是否显示默认网格
        showToolbar: false, // 是否显示工具栏
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
          len: 14,
          height: INITHEIGHT,
          minHeight: 2, // 设置高度可调最小高度
        },
        col: {
          len: 8,
          width: INITWIDTH,
          indexWidth: 20,
          minWidth: 2, // 设置列最小宽度
          colAttr: [],
        },
        streamCharts: [
          // { finalFirstRows: 0, finalLastRows: 0 },
          // { finalFirstRows: 3, finalLastRows: 10 },
        ],
        isCalCulatorFormula: false, // 是否运算公式
        isCalculatorDropdownRange: false, // 是否运算下拉项
        imageImg: document.querySelectorAll('.sheet-img-collection img')[0],
        imageFile: document.querySelectorAll('.sheet-img-collection img')[1],
        imageCheckedBox: document.querySelectorAll('.sheet-img-collection img')[2],
        imageUncheckedBox: document.querySelectorAll('.sheet-img-collection img')[3],
        contextMenuItems: {
          // 基本的右键功能
          base: [
            { key: 'copy', title: 'contextmenu.copy' },
            { key: 'cut', title: 'contextmenu.cut' },
            {
              key: 'paste-options',
              title: 'contextmenu.pasteOptions',
              subResource: [
                { key: 'paste', title: 'contextmenu.paste' },
                { key: 'paste-formula', title: 'contextmenu.pasteFormula' },
                { key: 'paste-value', title: 'contextmenu.pasteValue' },
                { key: 'paste-format', title: 'contextmenu.pasteFormat' },
              ],
            },
          ],

          // ----- 普通右键菜单-start -----
          usual: [
            { key: 'divider' },
            /* {
              key: 'filter',
              title: 'contextmenu.filter',
              callback: (type, obj) => {
                console.log(type, obj);
              },
            }, */
            { key: 'insert-comment', title: 'contextmenu.insertComment' },
            { key: 'divider' },
            { key: 'clear', title: 'contextmenu.clear' },
            {
              key: 'data-design',
              title: 'contextmenu.dataDesign',
              callback: (type, obj) => {
                const { dispatch } = this.props;
                dispatch({
                  type: 'reportDesigner/triggerRightSidebar',
                  payload: { showRightSidebar: true },
                });
              },
            },
          ],
          // ----- 普通右键菜单-end -----
        },
        hooks: {
          calloutSpecialActionPanel(params) {
            // 双击特殊类型的单元格，调出面板（公式|超链接）
            callbackProps.calloutSpecialActionPanel(params);
          },
          afterDrop(params) {
            // 拖拽放置后的回调
            callbackProps.afterDrop(params);
          },
          beforeChangeFile(cellProps, row, col, index) {
            console.log(`row:${row} col:${col} index:${index}`);
          },
          afterTriggerHistoryAction(historyType, params) {
            // console.table(historyType, params);
          },
          /**
           * @description: 右键菜单显示前回调 可用于显示和隐藏菜单
           * @param {type}
           * @return:
           * @Author: linjian
           * @Date: 2019-08-05 10:50:29
           */
          beforeContextMenuShow(/* contextMenu */) {
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
            callbackProps.afterSelection(sri, sci, eri, eci);
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
          requestData(/* { startRow, endRow, conditions }, callback */) {},
        },
        ...options,
        // hideCol: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      };
      // window.xsObj.spreadsheet.locale('zhCn');
      this.spreadSheet = window.xsObj
        .spreadsheet('#x-spreadsheet', xsOptions)
        .loadData(data)
        .change(changeData => {
          const { dispatch } = this.props;
          const contentDetail = generateJson(changeData);
          dispatch({
            type: 'reportDesigner/setTemplateArea',
            payload: { contentDetail, changeData },
          });
        });
    };

    // 点击单元格
    clickCell = (/* sri, sci */) => {
      if (!this.spreadSheet) {
        return;
      }
      const {
        data,
        sheet: { toolbar },
      } = this.spreadSheet;
      if (toolbar.paintformatActive()) {
        // 对格式刷的处理
        data.paste('format', () => {});
        setTimeout(() => {
          toolbar.paintformatActive = () => false;
          this.paintformatActiveFunc(toolbar.paintformatActive());
        }, 100);
      }
      this.clickCellReflectFunc(data || {});
      // this.clickCellReflectFunc(data.getCellStyle(sri, sci) || {});
    };

    // 设置cell属性
    setCellStyle = (property, value) => {
      const {
        data,
        sheet,
        sheet: { cellAttrChange, toolbar },
      } = this.spreadSheet;
      if (property === 'paintformat') {
        // 对格式刷进行处理
        toolbar.paintformatActive = () => true;
        this.paintformatActiveFunc(toolbar.paintformatActive());
      }
      cellAttrChange.call(sheet, property, value);
      this.clickCellReflectFunc(data);
    };

    // 设置cellType
    setCellType = (property, value) => {
      // console.log('setCellType: ', property, value);
      const {
        sheet,
        sheet: { cellTypeChange },
      } = this.spreadSheet;
      cellTypeChange.call(sheet, property, value);
      /* setTimeout(() => {
        // eslint-disable-next-line no-underscore-dangle
        const cell = window.xsObj._getCell({ ri: 3, ci: 3 });
        console.log('setCellType -> cell: ', cell);
      }, 2000); */
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

    insertDeleteRowColumn = (type, opera) => {
      const {
        sheet,
        sheet: { insertDeleteRowColumn, data },
      } = this.spreadSheet;
      if (type === 'row') {
        insertDeleteRowColumn.call(sheet, opera, data.selector.ri);
      } else if (type === 'column') {
        insertDeleteRowColumn.call(sheet, opera, data.selector.ci);
      }
    };

    // 设置点击单元格的回调函数
    /**
     * @description: 用于设置回调
     * @param {function} 用于设置单元格样式的回调
     * @param {function} 用于设置格式刷的回调
     * @Author: mus
     * @Date: 2019-12-13 11:22:43
     */
    setCellCallback = (callbackOne, callbackOneTwo) => {
      this.clickCellReflectFunc = callbackOne;
      this.paintformatActiveFunc = callbackOneTwo;
    };

    render() {
      const props = {
        setCellType: this.setCellType,
        setCellStyle: this.setCellStyle,
        getCellStyle: this.getCellStyle,
        setCellCallback: this.setCellCallback,
        insertDeleteRowColumn: this.insertDeleteRowColumn,
        initSheet: this.initSheet,
        ...this.props,
      };
      return <WrapperComponent {...props} ref={this.WrapperComponentRef} />;
    }
  }

  return connect(({ reportDesigner }) => ({
    rightSideCollapse: reportDesigner.rightSideCollapse,
  }))(Hoc);
};
