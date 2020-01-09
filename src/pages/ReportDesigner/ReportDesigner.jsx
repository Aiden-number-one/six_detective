import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { setLocale, formatMessage } from 'umi/locale';
import { DndProvider, DropTarget } from 'react-dnd';
import { Layout, Drawer, Modal, Input, Button, Spin } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import { createCellPos } from '@/utils/utils';
import { setCellTypeAndValue, getCellStringByIndex } from './utils';
import SpreadSheet from './components/SpreadSheet';
import CustomSearchArea from './components/CustomSearchArea/index';
import ToolBar from './components/ToolBar/index';
import RightSideBar from './components/SideBar/RightSideBar';
import LeftSideBar from './components/SideBar/LeftSideBar';
import DatasetModify from './components/DatasetModify';
import styles from './ReportDesigner.less';

const { Sider, Content } = Layout;

// 公式集
const formularSet = [
  { name: 'SUM', type: 'Math and Tig', desc: 'SUM(number1, number2,...)' },
  { name: 'MAX', type: 'Math and Tig', desc: 'MAX(number1, number2,...)' },
  { name: 'AVERAGE', type: 'Statistical', desc: 'AVERAGE(number1, number2,...)' },
];

@connect(({ loading, reportDesigner }) => {
  const { showFmlModal, cellPosition } = reportDesigner;
  return {
    showFmlModal,
    cellPosition,
    loading:
      loading.effects['privateDataSetEdit/getField'] ||
      loading.effects['reportDesigner/packageTemplate'],
  };
})
@SpreadSheet.createSpreadSheet
export default class ReportDesigner extends PureComponent {
  constructor(props) {
    super(props);
    this.formulaInputRef = React.createRef();
  }

  state = {
    display: false, // 查询区域是否显示
    leftSideCollapse: false, // 左边sideBar展开收起
    rightSideCollapse: false, // 右边sideBar展开收起
    displayDraw: false, // 是否显示抽屉
    displayDropSelect: false, // 是否显示DropSelect
    displayDelete: false, // 是否显示私有删除框
    formularValue: '', // 输入公式以校验
    formularCheckLoading: false, // 校验公式格式时 loading
    formularSearchValue: '', // 输入公式以搜索
    fmlFormatErr: false, // 公式格式错误
    currFormulaArr: [], // 当前展示的公式集
    currFmlTypeIndex: -1, // 当前选中的公式类
    formularDesc: '', // 当前选中公式的描述
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
          // sheet的宽高
          height: () => window.innerHeight - 104 - 111,
          width: () => window.innerWidth - leftWidth,
        },
      },
      {
        afterSelection: this.afterSelection,
        afterDrop: this.afterDropSpreadSheet, // drop钩子函数
        calloutFormularPanel: this.calloutFormularPanel, // 调出编辑公式的模态框
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

  // 双击类型为公式的单元格，弹出公式处理模态框
  calloutFormularPanel = args => {
    // console.log('Reportdesigner -> ', args);
    const { text } = args;
    this.setState({ formularValue: text });
    this.showOrHideFormulaModal(true);
  };

  // react-dnd的拖拽区域
  afterDrop = dragInfo => {
    const { dispatch } = this.props;
    // 被拖动元素的
    const { ri, ci } = this.dropPosition;
    // eslint-disable-next-line no-underscore-dangle
    const { datasetName, fieldDataName } = dragInfo;
    // 设置当前单元格为数据集类型且设置其值
    setCellTypeAndValue('dataSet', `${datasetName}.${fieldDataName}`, getCellStringByIndex(ri, ci));
    dispatch({
      type: 'reportDesigner/modifyTemplateArea',
      payload: {
        dataSet: dragInfo,
        elementType: 'column',
      },
      cellPostion: createCellPos(ci) + (Number(ri) + 1),
    });
    // 进行刷新
    window.xsObj.instanceArray[0].sheet.toolbar.change();
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

  // 展示或收起右边SideBar
  changeRightSideBar = rightSideCollapse => {
    this.setState({
      rightSideCollapse,
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

  // 保存模板
  saveReportTemplate = () => {
    window.xsObj.instanceArray[0].sheet.toolbar.change();
    setTimeout(() => {
      const { dispatch } = this.props;
      dispatch({
        type: 'reportDesigner/packageTemplate',
      });
    });
  };

  // 显示或隐藏处理公式的模态框
  showOrHideFormulaModal = bool => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportDesigner/triggerFmlModal',
      payload: { showModalBool: bool },
    });
  };

  // 公式模态框：确认
  fmlConfirm = () => {
    const { cellPosition } = this.props;
    const { formularValue } = this.state;
    this.checkFormularFormat(() => {
      // 验证格式
      const fmlInputInst = this.formulaInputRef.current;
      const fmlFormatErr = fmlInputInst.props.className.includes(styles['formula-format-error']);
      const refineFmlValue = /^=/.test(formularValue) ? formularValue : `=${formularValue}`;
      // console.log('fmlConfirm -> ', refineFmlValue, cellPosition, fmlFormatErr);
      if (!fmlFormatErr) {
        this.showOrHideFormulaModal(false);
        setCellTypeAndValue('formula', refineFmlValue, cellPosition);
        this.setState({ formularValue: '', formularSearchValue: '' });
      }
    });
  };

  // 公式模态框：取消
  fmlCancel = () => {
    console.log('fmlCancel');
    this.showOrHideFormulaModal(false);
  };

  // 公式输入框
  formulaInputChange = ev => {
    const { value: formularValue } = ev.target;
    this.setState({ formularValue });
  };

  // 校验公式格式
  checkFormularFormat = callback => {
    const { formularValue } = this.state;
    const formulaRegExp = /^=?[A-Z]+\(.*\)$/; // 公式的整体校验正则
    this.setState({ formularCheckLoading: true }, () => {
      const bool = formulaRegExp.test(formularValue); // 格式校验结果
      // console.log('checkFormularFormat -> ', formularValue, bool);
      this.setState(
        {
          fmlFormatErr: !bool,
          formularCheckLoading: false,
        },
        () => {
          if (typeof callback === 'function') callback();
        },
      );
    });
  };

  // 输入搜索公式
  formularSearchInputChange = ev => {
    const { value } = ev.target;
    // console.log('formularSearchInputChange: ', value);
    const currFormulaArr = formularSet.filter(item => item.name.includes(value.toUpperCase()));

    this.setState({ currFormulaArr, formularSearchValue: value });
  };

  // 选择公式分类
  pickupFormularType = (type, index) => {
    const currFormulaArr = formularSet.filter(item => item.type === type);
    this.setState({
      currFormulaArr,
      currFmlTypeIndex: index,
    });
  };

  // 选择公式
  pickupFormular = (formularObj, index) => {
    const { name, desc } = formularObj;
    this.setState({
      currFmlIndex: index,
      formularDesc: desc,
      formularValue: `${name}()`,
    });
  };

  render() {
    const {
      display,
      leftSideCollapse,
      rightSideCollapse,
      displayDropSelect,
      displayDelete,
      formularValue,
      formularCheckLoading,
      formularSearchValue,
      fmlFormatErr,
      currFormulaArr,
      currFmlTypeIndex,
      currFmlIndex,
      formularDesc,
    } = this.state;
    const { setCellCallback, dispatch, setCellType, showFmlModal, loading = false } = this.props;
    // ToolBar的相关Props
    const toolBarProps = {
      saveReportTemplate: this.saveReportTemplate, // 保存报表模板
      displayArea: display, // 是否显示查询区域
      changeDisplaySearchArea: this.changeDisplaySearchArea, // 改变属否显示查询条件区域
      setCellStyle: this.setCellStyle, // 设置单元格样式
      editRowColumn: this.editRowColumn, // 编辑行与列
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
    // 数据集编辑的相关
    const datasetModifyProps = {
      currentSelectDataSetOtherInfo: this.currentSelectDataSetOtherInfo, // 编辑数据集所需要的参数
    };
    const formularTypeArr = [...new Set(formularSet.map(v => v.type))]; // 公式类型的数组
    return (
      <DndProvider backend={HTML5Backend}>
        <Spin spinning={loading}>
          <div
            onClick={() => {
              this.changedisplayDropSelect(false);
            }}
          >
            {/* 抽屉区域 */}
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
            <div className={styles.container} style={{ height: `${window.innerHeight - 104}px` }}>
              <Layout className={classNames(styles.layout)}>
                {/* 数据集区域 */}
                <Sider width={leftSideCollapse ? 300 : 30}>
                  <LeftSideBar {...leftSideBarProps} />
                </Sider>
                {/* 报表区域 */}
                <Content>
                  <div className={classNames(styles.main)}>
                    {display && <CustomSearchArea />}
                    <div>
                      <WrapperDropContent afterDrop={this.afterDrop} />
                    </div>
                  </div>
                </Content>
              </Layout>
              {/* 右侧区域 */}
              <div
                id="rigthSideBar"
                className={classNames(styles.right)}
                style={{ width: rightSideCollapse ? '300px' : '30px' }}
              >
                <RightSideBar
                  rightSideCollapse={rightSideCollapse}
                  changeRightSideBar={this.changeRightSideBar}
                />
              </div>
            </div>
          </div>
          <Modal
            width={423}
            closable={false}
            okText="Confirm"
            title="Inert Function"
            visible={showFmlModal}
            onOk={this.fmlConfirm}
            onCancel={this.fmlCancel}
            wrapClassName={styles['formula-modal']}
          >
            <div className={styles['formula-input-tip']}>
              Please Enter Formula into assigned column:
            </div>
            <div style={{ padding: '0 10px' }}>
              <div className={styles['formula-check-container']}>
                <Input
                  value={formularValue}
                  ref={this.formulaInputRef}
                  onChange={this.formulaInputChange}
                  className={`${fmlFormatErr ? styles['formula-format-error'] : ''} aaa bbb ccc`}
                />
                <Button
                  type="primary"
                  loading={formularCheckLoading}
                  onClick={this.checkFormularFormat}
                >
                  Check Validity
                </Button>
              </div>
              <div className={styles['formula-search-tip']}>Search Function (S):</div>
              <Input value={formularSearchValue} onChange={this.formularSearchInputChange} />
              <div style={{ marginTop: '5px' }}>
                <span className={styles['formula-type']}>Function Type:</span>
                <span className={styles['formula-name']}>Function Name:</span>
              </div>

              <div className={`${styles['formula-hub']} clearfix`}>
                <div className={styles['formula-hub-left']}>
                  <ul>
                    {formularTypeArr.map((formularType, i) => (
                      <li
                        key={formularType}
                        className={currFmlTypeIndex === i ? styles.curr : ''}
                        onClick={() => this.pickupFormularType(formularType, i)}
                      >
                        {formularType}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles['formula-hub-right']}>
                  <ul>
                    {currFormulaArr.map((item, i) => (
                      <li
                        key={item.name}
                        className={currFmlIndex === i ? styles.curr : ''}
                        onClick={() => this.pickupFormular(item, i)}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles['formula-desc']}>{formularDesc}</div>
            </div>
          </Modal>
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
