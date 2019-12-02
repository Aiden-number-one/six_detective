import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import ToolBar from './components/ToolBar/index';
import SpreadSheet from '@/components/SpreadSheet';
import CustomSearchArea from './components/CustomSearchArea/index';
// import EditBox from '../../components/editBox';
// import LeftTree from '../../components/leftTree';
// import Table from '../../components/table';
// import RightMenu from '../../components/rightMenu';
// import Condition from '../../components/condition';

const { Sider, Content } = Layout;
@connect(({ reportDesigner }) => ({}))
@SpreadSheet.createSpreadSheet
export default class ReportDesigner extends PureComponent {
  componentDidMount() {
    const { initSheet } = this.props;
    initSheet({
      view: {
        height: () => window.innerHeight - 100,
        width: () => window.innerWidth - 400,
      },
    });
  }

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

  render() {
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
      <Fragment>
        <ToolBar {...toolBarProps} />
        <Layout>
          {/* 数据集部分 */}
          <Sider width={200} />
          <Content
            style={{
              overflow: 'auto',
              height: window.innerHeight - 100,
            }}
          >
            {/* 自定义查询条件区域 */}
            <CustomSearchArea />
            <SpreadSheet />
          </Content>
          {/* 单元格属性部分 */}
          <Sider width={200} />
        </Layout>
        {/* <EditBox />
        <Layout>
          <Sider
            width={200}
            style={{
              backgroundColor: '#f1f1f1',
              borderRight: '1px solid #cbcbcb',
              paddingRight: '24px',
              overflow: 'hidden',
            }}
          >
            <LeftTree />
          </Sider>
          <Content
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '-1px',
              marginTop: '-1px',
            }}
          >
            <Condition />
            <Table />
          </Content>
        </Layout> */}
      </Fragment>
    );
  }
}
