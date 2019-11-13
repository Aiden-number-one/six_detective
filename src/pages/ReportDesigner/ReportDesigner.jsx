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

  render() {
    return (
      <Fragment>
        <ToolBar />
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
