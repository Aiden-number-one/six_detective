import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { setLocale } from 'umi/locale';
import { DndProvider } from 'react-dnd';
import { Layout, Drawer } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import SpreadSheet from './components/SpreadSheet';
import CustomSearchArea from './components/CustomSearchArea/index';
import ToolBar from './components/ToolBar/index';
import RigthSideBar from './components/SideBar/RigthSideBar';
import LeftSideBar from './components/SideBar/LeftSideBar';
import DatasetModify from './components/DatasetModify';
import styles from './ReportDesigner.less';

const { Sider, Content } = Layout;
@connect(({ reportDesigner }) => ({ reportDesigner }))
@SpreadSheet.createSpreadSheet
export default class ReportDesigner extends PureComponent {
  state = {
    display: false, // 查询区域是否显示
    leftSideCollapse: false, // 左边sideBar展开收起
    rightSideCollapse: false, // 右边sideBar展开收起
    displayDraw: false, // 是否显示抽屉
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
      },
    );
    // 若有reportId，则调用接口查询报表设计器相关信息
    const {
      dispatch,
      location: {
        query: { reportId },
      },
    } = this.props;
    dispatch({
      type: 'reportDesigner/getReportTemplateContent',
      payload: {
        reportId,
      },
    });
  }

  // 单元格选择后
  afterSelection = (rowIndex, columnIndex) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'formArea/changeCellPosition',
      payload: {
        rowIndex,
        columnIndex,
      },
    });
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
  displayDraw = () => {
    this.setState(preState => ({
      displayDraw: !preState.displayDraw,
    }));
  };

  // 保存模板
  saveReportTemplate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportDesigner/packageTemplate',
    });
  };

  render() {
    const { display, leftSideCollapse, rightSideCollapse } = this.state;
    const { setCellCallback, dispatch, setCellType } = this.props;
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
    };
    return (
      <DndProvider backend={HTML5Backend}>
        <Fragment>
          {/* 抽屉区域 */}
          <Drawer
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
            <DatasetModify />
          </Drawer>
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
                    <SpreadSheet />
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
              <RigthSideBar />
            </div>
          </div>
        </Fragment>
      </DndProvider>
    );
  }
}
