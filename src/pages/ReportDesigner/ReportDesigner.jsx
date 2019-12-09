import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { setLocale } from 'umi/locale';
import SpreadSheet from '@/components/SpreadSheet';
import CustomSearchArea from './components/CustomSearchArea/index';
import ToolBar from './components/ToolBar/index';
import RigthSideBar from './components/SideBar/RigthSideBar';
import LeftSideBar from './components/SideBar/LeftSideBar';
import styles from './ReportDesigner.less';

@connect(({ reportDesigner }) => ({ reportDesigner }))
@SpreadSheet.createSpreadSheet
export default class ReportDesigner extends PureComponent {
  state = {
    display: false,
  };

  componentWillMount() {
    setLocale('en-US');
  }

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
          <div className={classNames(styles.left, styles.col)}>
            <LeftSideBar />
          </div>
          <div className={classNames(styles.right, styles.col, styles.rigthSideBar)}>
            <RigthSideBar />
          </div>
        </div>
      </Fragment>
    );
  }
}
