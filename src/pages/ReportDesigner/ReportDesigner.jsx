import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Layout, Collapse, Icon } from 'antd';
import classNames from 'classnames';
import ToolBar from './components/ToolBar/index';
import SpreadSheet from '@/components/SpreadSheet';
import ClassifyTree from '@/components/ClassifyTree';
import CustomSearchArea from './components/CustomSearchArea/index';
import styles from './ReportDesigner.less';
// import EditBox from '../../components/editBox';
// import LeftTree from '../../components/leftTree';
// import Table from '../../components/table';
// import RightMenu from '../../components/rightMenu';
// import Condition from '../../components/condition';

const { Sider, Content } = Layout;
const { Panel } = Collapse;

@connect(({ reportDesigner }) => ({ reportDesigner }))
@SpreadSheet.createSpreadSheet
export default class ReportDesigner extends PureComponent {
  state = {
    display: false,
  };

  componentDidMount() {
    const { initSheet } = this.props;
    initSheet({
      view: {
        height: () => window.innerHeight,
        width: () => window.innerWidth - 378,
      },
    });
    setTimeout(() => {
      this.setState({
        display: true,
      });
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
    const { display } = this.state;
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
        <div className={styles.container}>
          <div className={classNames(styles.main, styles.col)}>
            {display && <CustomSearchArea />}
            <div>
              <SpreadSheet />
            </div>
          </div>
          <div className={classNames(styles.left, styles.col)}></div>
          <div className={classNames(styles.right, styles.col, styles.rigthSideBar)}>
            <Layout className={styles.layout}>
              <div className={styles.header}>
                <div className={styles.title}>单元格属性</div>
                <div className={styles.icon}></div>
              </div>
              <Layout>
                <Content className={styles.content}>
                  <ClassifyTree
                    treeData={[
                      { menuname: 'parent', menuid: '-1' },
                      { menuname: 'test', menuid: 'test1', parentmenuid: '-1' },
                      { menuname: 'test2', menuid: 'test2', parentmenuid: '-1' },
                    ]}
                    treeKey={{
                      currentKey: 'menuid',
                      currentName: 'menuname',
                      parentKey: 'parentmenuid',
                    }}
                    onSelect={() => {}}
                  ></ClassifyTree>
                  <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    expandIconPosition="right"
                    expandIcon={({ isActive }) => (
                      <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                    )}
                  >
                    <Panel header="Basic" key="1">
                      111222333
                    </Panel>
                  </Collapse>
                </Content>
                <Sider width={30} className={styles.sider} />
              </Layout>
            </Layout>
          </div>
        </div>
      </Fragment>
    );
  }
}
