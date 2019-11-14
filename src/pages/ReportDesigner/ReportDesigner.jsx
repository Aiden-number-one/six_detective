import React, { PureComponent, Fragment } from 'react';
import { Layout } from 'antd';
import ToolBar from './components/ToolBar/index';
import SpreadSheet from '@/components/SpreadSheet';
// import EditBox from '../../components/editBox';
// import LeftTree from '../../components/leftTree';
// import Table from '../../components/table';
// import RightMenu from '../../components/rightMenu';
// import Condition from '../../components/condition';

const { Sider, Content } = Layout;
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

  setCellStyle = (property, value) => {
    const { setCellStyle, getCellStyle } = this.props;
    const result = getCellStyle(property);
    if (result === value) {
      setCellStyle(property, false);
    } else {
      setCellStyle(property, value);
      // const arr = [[0, 1], [2, 3], [4, 5]];
    }
  };

  editRowColumn = (type, opera) => {
    const { insertDeleteRowColumn } = this.props;
    insertDeleteRowColumn(type, opera);
  };

  render() {
    return (
      <Fragment>
        <ToolBar setCellStyle={this.setCellStyle} editRowColumn={this.editRowColumn} />
        <Layout>
          <Sider width={200} />
          <Content
            style={{
              overflow: 'auto',
              height: window.innerHeight - 100,
            }}
          >
            <SpreadSheet />
          </Content>
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
