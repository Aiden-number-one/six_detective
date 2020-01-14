/* eslint-disable no-underscore-dangle */
/*
 * @Des: 报表设计器
 * @Author: liangchaoshun
 * @Email: liangchaoshun@szkingdom.com
 * @Date: 2020-01-08 21:25:00
 * @LastEditors  : liangchaoshun
 * @LastEditTime : 2020-01-14 15:09:08
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { setLocale, formatMessage } from 'umi/locale';
import { DndProvider, DropTarget } from 'react-dnd';
import { Layout, Drawer, Modal, Spin } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import { createCellPos } from '@/utils/utils';
import { setCellTypeAndValue, getCellStringByIndex, dynamicEleOutsideClickHandler } from './utils';
import SpreadSheet from './components/SpreadSheet';
import CustomSearchArea from './components/CustomSearchArea/index';
import ToolBar from './components/ToolBar/index';
import RightSideBar from './components/SideBar/RightSideBar';
import LeftSideBar from './components/SideBar/LeftSideBar';
import DatasetModify from './components/DatasetModify';
import SaveModal from './components/SaveModal';
import FormulaModal from './components/FormulaModal';
import HyperlinkModal from './components/HyperlinkModal';
import styles from './ReportDesigner.less';

const { Sider, Content } = Layout;

@connect(({ loading, reportDesigner, reportTree }) => ({
  showFmlModal: reportDesigner.showFmlModal,
  cellPosition: reportDesigner.cellPosition,
  classifyTree: reportTree.classifyTree,
  rightSideCollapse: reportDesigner.rightSideCollapse,
  loading:
    loading.effects['privateDataSetEdit/getField'] ||
    loading.effects['reportDesigner/importExcel'] ||
    loading.effects['reportDesigner/packageTemplate'],
}))
@SpreadSheet.createSpreadSheet
export default class ReportDesigner extends PureComponent {
  constructor(props) {
    super(props);
    this.formulaInputRef = React.createRef();
  }

  state = {
    display: false, // 查询区域是否显示
    leftSideCollapse: false, // 左边sideBar展开收起
    displayDraw: false, // 是否显示数据集修改的抽屉
    displaySaveAs: false, // 是否显示数据集保存的抽屉
    displayDropSelect: false, // 是否显示DropSelect
    displayDelete: false, // 是否显示私有删除框
    initFmlVal: '', // 公式模态框的公式初始值
    initHylContentVal: '', // 超链接模态框的内容初始值
    initHylLinkVal: '', // 超链接模态框的地址初始值
  };

  componentWillMount() {
    setLocale('en-US');
  }

  componentDidMount() {
    const { initSheet } = this.props;
    const { leftSideCollapse } = this.state;
    // const leftWidth = document.getElementById('leftSideBar').offsetWidth;
    // const rigthWidth = document.getElementById('rigthSideBar').offsetWidth;
    const leftWidth = leftSideCollapse ? 300 : 30;
    initSheet(
      {
        view: {
          // sheet的宽高 （由窗口高度减去一级导航栏、二级导航栏）
          height: () => window.innerHeight - 50 - 70,
          width: () => window.innerWidth - leftWidth,
        },
      },
      {
        afterSelection: this.afterSelection,
        afterDrop: this.afterDropSpreadSheet, // drop钩子函数
        calloutSpecialActionPanel: this.calloutSpecialActionPanel, // 调出特殊类型处理的模态框
      },
    );
    // 若有reportId，则调用接口查询报表设计器相关信息
    const {
      dispatch,
      location: {
        query: { reportId },
      },
    } = this.props;
    if (reportId) {
      dispatch({
        type: 'reportDesigner/getReportTemplateContent',
        payload: {
          reportId,
        },
      });
    }

    // 获取数据源数据 - 用于查询条件Select类型的数据源头
    dispatch({
      type: 'formArea/getDataSourceList',
      payload: {},
    });
    // 获取数据集分类树 - 用于保存与另存文
    dispatch({
      type: 'reportTree/getClassifyTree',
      payload: {
        dataStyle: 'Y',
        fileType: 'R',
      },
    });
  }

  // 单元格选择后
  afterSelection = (rowIndex, columnIndex) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportDesigner/changeCellPosition',
      payload: {
        rowIndex,
        columnIndex,
      },
    });
  };

  // spreadsheet的拖动区域
  afterDropSpreadSheet = dropPosition => {
    // 获取到拖动的区域
    this.dropPosition = dropPosition;
  };

  // 双击特殊类型的单元格，弹出相关的模态框（公式|超链接）
  calloutSpecialActionPanel = args => {
    // console.log('Reportdesigner -> ', args);
    const { text, cellType, extra } = args;
    const { dispatch } = this.props;

    let whichOne = 'noop';
    let apis = '';

    switch (
      cellType // 区分公式和超链接的处理
    ) {
      case 'formula':
        whichOne = 'showFmlModal';
        apis = 'triggerFmlModal';
        this.setState({ initFmlVal: text });
        break;
      case 'hyperlink':
        whichOne = 'showHylModal';
        apis = 'triggerHylModal';
        this.setState({ initHylContentVal: text, initHylLinkVal: extra.hyperlink });
        break;

      // no default
    }

    dispatch({
      type: `reportDesigner/${apis}`,
      payload: { [whichOne]: true },
    });
  };

  /**
   *
   * @param { Set } dragInfo 拖放过程中携带的数据
   * @description react-dnd 拖放数据集，放置后的回调
   * @description 一个数据集时，直接写入
   * @description 多个数据集时，可以选择扩展方向
   * @description 当扩展方向是：往右/往下 且 超出表格范围后，动态追加行列，再写入
   * @description 操作扩展方向的面板：dsoPanel 为动态添加的，其中的点击事件处理函数，每次获取到的数据均为旧值
   * @description 由上一条原因，所以将每次的 拖放数据 保存到组件中，orientHandler 函数即可每次获取到最新拖放数据，位置信息数据（ri, ci）同理
   */
  afterDrop = dragInfo => {
    const { dispatch } = this.props;

    // 拖放如果只有一个的话，就传字符串，否则传字符串数组
    // 保存在组件上，保证 orientHandler 能每次获取到最新的 dragInfo
    this.passInfoArr = [...dragInfo].map(item => `${item.datasetName}.${item.fieldDataName}`);

    /**
     *
     * @param { String } cellTxt 放入单元格的数据集内容
     * @param { String } row 行
     * @param { String } col 列
     * @param { Array|String } dataSetInfo 当前拖放的信息
     * @description 放入数据集逻辑
     */
    const dropBiz = (cellTxt, row, col, dataSetInfo) => {
      // 设置当前单元格为数据集类型且设置其值
      setCellTypeAndValue({
        type: 'dataSet',
        value: cellTxt,
        cellPosition: getCellStringByIndex(row, col),
      });
      dispatch({
        type: 'reportDesigner/modifyTemplateArea',
        payload: {
          dataSet: dataSetInfo, // ???
          elementType: 'column', // ???
        },
        cellPostion: createCellPos(col) + (Number(row) + 1),
      });

      // 进行刷新
      window.xsObj._sheetReset();
    };

    if (this.passInfoArr.length === 1) {
      // 单选数据集拖放
      const { ri, ci } = this.dropPosition; // 放置位置
      dropBiz(this.passInfoArr[0], ri, ci, this.passInfoArr[0]);
    } else {
      // 多选数据集拖放
      /**
       *
       * @param {String} ori: orientation 方向 l2r r2l t2b b2t
       * @description 设置写入数据集的扩展方向
       */
      const orientHandler = ori => {
        const { ri, ci } = this.dropPosition;
        const xInst = window.xsObj._getSheetInst(); // 获取报表实例
        const {
          data: { rows, cols },
        } = xInst;
        const rowsCount = rows.len; // 获取报表总行数
        const colsCount = cols.len; // 获取报表总列数

        // console.log('** orientHandler **', this.passInfoArr, ri, ci);

        // 枚举扩展方向
        switch (ori) {
          case 'l2r': {
            // 从左到右扩展
            const dlens = this.passInfoArr.length; // 当前数据集的个数
            const availableCols = colsCount - ci; // 当前可用列数
            const diff = dlens - availableCols; // 差值：需新增的列数
            if (diff > 0) {
              // 说明需要新增列
              cols.len += diff;
              window.xsObj._sheetReset();
            }
            // console.log(`${ori}`, availableCols, dlens, diff);
            // 循环放入数据集
            for (let i = 0; i < this.passInfoArr.length; i++) {
              const dataSetContent = this.passInfoArr[i];
              dropBiz(dataSetContent, +ri, Number(ci) + i, this.passInfoArr);
            }
            break;
          }
          case 'r2l': // 从右往左扩展
            for (let i = 0; i < this.passInfoArr.length; i++) {
              const dataSetContent = this.passInfoArr[i];
              const colIndex = Number(ci) - i; // 数字类型
              if (colIndex < 0) break;
              dropBiz(dataSetContent, +ri, colIndex, this.passInfoArr);
            }
            break;
          case 't2b': {
            // 从上到下扩展
            const dlens = this.passInfoArr.length; // 当前数据集的个数
            const availableRows = rowsCount - ri; // 当前可用行数
            const diff = dlens - availableRows; // 差值：需新增的行数
            if (diff > 0) {
              // 说明需要新增行
              rows.len += diff;
              window.xsObj._sheetReset();
            }
            // console.log(`${ori}`, availableRows, dlens, diff);
            // 循环放入数据集
            for (let i = 0; i < this.passInfoArr.length; i++) {
              const dataSetContent = this.passInfoArr[i];
              dropBiz(dataSetContent, Number(ri) + i, +ci, this.passInfoArr);
            }
            break;
          }
          case 'b2t': // 从下到上扩展
            for (let i = 0; i < this.passInfoArr.length; i++) {
              const dataSetContent = this.passInfoArr[i];
              const rowIndex = Number(ri) - i; // 数字类型
              // console.log('rowIndex: ', rowIndex, ri, ci);
              if (rowIndex < 0) break;
              dropBiz(dataSetContent, rowIndex, +ci, this.passInfoArr);
            }
            break;

          // no default
        }
      };

      // 新建一个面板
      const newPanel = () => {
        // 设置方向
        const panel = document.createElement('div');
        const l2r = document.createElement('a');
        const r2l = document.createElement('a');
        const t2b = document.createElement('a');
        const b2t = document.createElement('a');
        l2r.innerText = 'From left to right';
        r2l.innerText = 'From right to left';
        t2b.innerText = 'From top to bottom';
        b2t.innerText = 'From bottom to top';

        l2r.addEventListener(
          'click',
          () => {
            panel.style.display = 'none';
            orientHandler('l2r');
          },
          false,
        );
        r2l.addEventListener(
          'click',
          () => {
            panel.style.display = 'none';
            orientHandler('r2l');
          },
          false,
        );
        t2b.addEventListener(
          'click',
          () => {
            panel.style.display = 'none';
            orientHandler('t2b');
          },
          false,
        );
        b2t.addEventListener(
          'click',
          () => {
            panel.style.display = 'none';
            orientHandler('b2t');
          },
          false,
        );

        panel.appendChild(l2r);
        panel.appendChild(r2l);
        panel.appendChild(t2b);
        panel.appendChild(b2t);
        panel.className = styles['set-dataset-orient-panel'];
        panel.setAttribute('name', 'dsoPanel'); // 设置 name 属性好找！
        dynamicEleOutsideClickHandler(panel); // 点击元素外部区域，自身隐藏
        panel.addEventListener('click', ev => ev.stopPropagation(), false); // 阻止事件冒泡

        const xsheet = document.querySelector('#x-spreadsheet');
        xsheet.appendChild(panel);

        return panel;
      };

      // 若不存在，则新建
      const legacyPanel = document.querySelector("div[name='dsoPanel']");
      const dsoPanel = legacyPanel || newPanel();

      const { left, top } = this.dropPosition; // 放置位置
      dsoPanel.style.display = 'block';
      dsoPanel.style.top = `${parseInt(top, 10)}px`;
      dsoPanel.style.left = `${parseInt(left, 10)}px`;
    }
  };

  // 设置单元格样式
  setCellStyle = (property, value) => {
    const { setCellStyle, getCellStyle } = this.props;
    const result = getCellStyle(property);
    if (result === value) {
      setCellStyle(property, false);
    } else {
      setCellStyle(property, value);
    }
  };

  editRowColumn = (type, opera) => {
    const { insertDeleteRowColumn } = this.props;
    insertDeleteRowColumn(type, opera);
  };

  // 展开或收起左边SideBar
  changeLeftSideBar = leftSideCollapse => {
    this.setState({
      leftSideCollapse,
    });
  };

  // 改变属否显示查询条件区域
  changeDisplaySearchArea = () => {
    this.setState(preState => ({
      display: !preState.display,
    }));
  };

  // 改变是否显示抽屉
  displayDraw = currentSelectDataSet => {
    // 打开抽屉所需要的参数
    this.currentSelectDataSetOtherInfo = currentSelectDataSet.otherInfo;
    this.setState(preState => ({
      displayDraw: !preState.displayDraw,
    }));
  };

  // 是否要显示删除弹出框
  displayDeletePrivate = (displayDelete, deteleDataSetKey) => {
    if (deteleDataSetKey) {
      this.deteleDataSetKey = deteleDataSetKey;
    }
    this.setState({
      displayDelete,
    });
  };

  // 删除action
  deleteDataSetAction = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportDesigner/deleteDataSetPrivate',
      payload: this.deteleDataSetKey,
    });
    this.displayDeletePrivate(false);
  };

  // 改变是否显示dropSelect
  changedisplayDropSelect = displayDropSelect => {
    this.setState({
      displayDropSelect,
    });
  };

  // 弹出保存模板的抽屉
  saveDrawDisplay = (displaySaveAs, type) => {
    this.setState({
      displaySaveAs,
    });
    this.saveType = type;
  };

  // 保存模板
  saveReportTemplate = fieldsValue => {
    window.xsObj.instanceArray[0].sheet.toolbar.change();
    setTimeout(() => {
      const { dispatch } = this.props;
      dispatch({
        type: 'reportDesigner/packageTemplate',
        payload: fieldsValue,
      });
    });
  };

  render() {
    const {
      display,
      leftSideCollapse,
      displayDropSelect,
      displayDelete,
      displaySaveAs, // 数据集保存抽屉
      initFmlVal,
      initHylContentVal,
      initHylLinkVal,
    } = this.state;
    const {
      setCellCallback,
      dispatch,
      setCellType,
      loading = false,
      rightSideCollapse,
    } = this.props;
    // ToolBar的相关Props
    const toolBarProps = {
      displayArea: display, // 是否显示查询区域
      changeDisplaySearchArea: this.changeDisplaySearchArea, // 改变属否显示查询条件区域
      setCellStyle: this.setCellStyle, // 设置单元格样式
      editRowColumn: this.editRowColumn, // 编辑行与列
      saveDrawDisplay: this.saveDrawDisplay, // 保存抽屉是否显示
      setCellType, // 设置单元格的数据类型
      setCellCallback,
      dispatch,
    };

    // leftTree的相关Props
    const leftSideBarProps = {
      changeLeftSideBar: this.changeLeftSideBar, // 展开或收起树
      leftSideCollapse, // 是否展开树
      displayDraw: this.displayDraw, // 是否显示抽屉
      displayDropSelect, // 是否显示drop select
      changedisplayDropSelect: this.changedisplayDropSelect, // 显示drop select
      displayDeletePrivate: this.displayDeletePrivate, // 删除私有数据集
    };
    // 保存模板相关的Props
    const saveProps = {
      saveDrawDisplay: this.saveDrawDisplay, // 是否显示保存Modal
      saveReportTemplate: this.saveReportTemplate, // 保存报表模板
      saveType: this.saveType, // 保存的模板类型 存为或另存为
    };
    // 数据集编辑的相关
    const datasetModifyProps = {
      currentSelectDataSetOtherInfo: this.currentSelectDataSetOtherInfo, // 编辑数据集所需要的参数
    };
    return (
      <DndProvider backend={HTML5Backend}>
        <Spin spinning={loading}>
          <div
            onClick={() => {
              this.changedisplayDropSelect(false);
            }}
          >
            {/* 保存另存为-抽屉区域 */}
            <Drawer
              destroyOnClose
              closable={false}
              title={this.saveType === 'save' ? 'Save' : 'Save As'}
              width={600}
              onClose={() => {
                this.setState({
                  displaySaveAs: false,
                });
              }}
              visible={displaySaveAs}
            >
              <SaveModal
                {...saveProps}
                onClose={() => {
                  this.setState({
                    displaySaveAs: false,
                  });
                }}
              />
            </Drawer>
            {/* 数据集修改-抽屉区域 */}
            <Drawer
              destroyOnClose
              closable={false}
              title="Dataset Modify"
              width={900}
              onClose={() => {
                this.setState({
                  displayDraw: false,
                });
              }}
              visible={this.state.displayDraw}
            >
              <DatasetModify
                {...datasetModifyProps}
                onClose={() => {
                  this.setState({
                    displayDraw: false,
                  });
                }}
              />
            </Drawer>
            {/* 删除 */}
            <Modal
              title={formatMessage({ id: 'app.common.confirm' })}
              visible={displayDelete}
              onOk={this.deleteDataSetAction}
              onCancel={() => {
                this.displayDeletePrivate(false);
              }}
              cancelText={formatMessage({ id: 'app.common.cancel' })}
              okText={formatMessage({ id: 'app.common.confirm' })}
            >
              <span>Please confirm that you want to delete this record?</span>
            </Modal>
            {/* 头部菜单栏 */}
            <ToolBar {...toolBarProps} />
            <div className={styles.container}>
              <Layout className={classNames(styles.layout)}>
                {/* 数据集区域 */}
                <Sider width={leftSideCollapse ? 300 : 30}>
                  <LeftSideBar {...leftSideBarProps} />
                </Sider>
                {/* 报表区域 */}
                <Content>
                  <div className={classNames(styles.main)}>
                    {/* 右侧区域 */}
                    <div
                      id="rigthSideBar"
                      className={classNames(styles.right)}
                      style={{ width: rightSideCollapse ? '300px' : '30px' }}
                    >
                      <RightSideBar />
                    </div>
                    {display && <CustomSearchArea />}
                    <div>
                      <WrapperDropContent afterDrop={this.afterDrop} />
                    </div>
                  </div>
                </Content>
              </Layout>
            </div>
          </div>
          <FormulaModal initFmlVal={initFmlVal} />
          <HyperlinkModal
            initContentVal={initHylContentVal}
            initLinkVal={initHylLinkVal}
            setCellStyle={this.setCellStyle}
          />
        </Spin>
      </DndProvider>
    );
  }
}

const wrapperSpreadSheet = ({ connectDropTarget }) =>
  connectDropTarget(
    <div>
      <SpreadSheet />
    </div>,
  );

const targetSpec = {
  drop(props, monitor) {
    const { afterDrop } = props;
    const { dragInfo } = monitor.getItem();
    afterDrop(dragInfo);
  },
};

const WrapperDropContent = DropTarget('dragTitle', targetSpec, (connected, monitor) => ({
  connectDropTarget: connected.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(wrapperSpreadSheet);
