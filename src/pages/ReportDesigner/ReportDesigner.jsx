import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import { Layout } from 'antd';
import classNames from 'classnames';
import ToolBar from './components/ToolBar/index';
import SpreadSheet from '@/components/SpreadSheet';
import CustomSearchArea from './components/CustomSearchArea/index';
import styles from './ReportDesigner.less';
// import EditBox from '../../components/editBox';
// import LeftTree from '../../components/leftTree';
// import Table from '../../components/table';
// import RightMenu from '../../components/rightMenu';
// import Condition from '../../components/condition';

// const { Sider, Content } = Layout;
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
          <div className={classNames(styles.right, styles.col)}></div>
        </div>
      </Fragment>
    );
  }
}
