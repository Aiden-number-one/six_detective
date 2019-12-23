import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { setLocale } from 'umi/locale';
import { DndProvider } from 'react-dnd';
import { Layout } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import SpreadSheet from '@/components/SpreadSheet';
import CustomSearchArea from './components/CustomSearchArea/index';
import ToolBar from './components/ToolBar/index';
import RigthSideBar from './components/SideBar/RigthSideBar';
import LeftSideBar from './components/SideBar/LeftSideBar';
import styles from './ReportDesigner.less';

const { Sider, Content } = Layout;
@connect(({ reportDesigner }) => ({ reportDesigner }))
@SpreadSheet.createSpreadSheet
export default class ReportDesigner extends PureComponent {
  state = {
    display: false,
    leftSideCollapse: false, // 左边sideBar展开收起
    rightSideCollapse: false, // 右边sideBar展开收起
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
    setTimeout(() => {
      this.setState({
        display: true,
      });
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

  render() {
    const { display, leftSideCollapse, rightSideCollapse } = this.state;
    const { setCellCallback, dispatch, setCellType } = this.props;
    // ToolBar的相关Props
    const toolBarProps = {
      setCellStyle: this.setCellStyle, // 设置单元格样式
      editRowColumn: this.editRowColumn, // 编辑行与列
      setCellType, // 设置单元格的数据类型
      setCellCallback,
      dispatch,
    };
    return (
      <DndProvider backend={HTML5Backend}>
        <Fragment>
          <ToolBar {...toolBarProps} />
          <div className={styles.container} style={{ height: `${window.innerHeight - 104}px` }}>
            <Layout>
              <Sider width={leftSideCollapse ? 300 : 30}>
                <LeftSideBar
                  changeLeftSideBar={this.changeLeftSideBar}
                  leftSideCollapse={leftSideCollapse}
                />
              </Sider>
              <Content>
                <div className={classNames(styles.main)}>
                  {display && <CustomSearchArea />}
                  <div>
                    <SpreadSheet />
                  </div>
                </div>
              </Content>
            </Layout>
            <div
              id="rigthSideBar"
              className={classNames(styles.right)}
              style={{ width: rightSideCollapse ? '300px' : '30px' }}
            >
              <RigthSideBar
                rightSideCollapse={rightSideCollapse}
                changeRightSideBar={this.changeRightSideBar}
              />
            </div>
          </div>
        </Fragment>
      </DndProvider>
    );
  }
}
