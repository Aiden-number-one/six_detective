import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import DropSelect from '../DropSelect/index';
import styles from './index.less';

@connect(({ reportDesigner, loading }) => ({
  reportDesigner,
  loading: loading.effects['reportDesigner/getDataSet'],
}))
export default class LeftSideBar extends PureComponent {
  state = {};

  componentDidMount() {
    this.getDataSet();
  }

  // 获取数据集
  getDataSet = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportDesigner/getDataSet',
      payload: {
        sqlName: '',
      },
    });
  };

  // 根据数据集的选择，来渲染出数据集的列与SqlParams
  onChangeDataSet = dataSetId => {
    const { dispatch } = this.props;
    // 获取列
    dispatch({
      type: 'reportDesigner/getDataSetColumn',
      payload: { dataSetId },
    });

    // 获取SqlParams
    dispatch({
      type: 'reportDesigner/getDataSetSqlParams',
      payload: { dataSetId },
    });
  };

  render() {
    const {
      dataSetList = [],
      dataSetListColumn = [],
      dataSetListSqlParams = [],
    } = this.props.reportDesigner;
    const { loading } = this.props;
    const dropSelectProps = {
      loading, // dropSelect的loading
      data: dataSetList, // 数据集列表
      getDataSet: this.getDataSet, // 刷新庶几集
    };
    return (
      <div className={classNames(styles.layout, styles.sideBar, styles.left)}>
        <div className={styles.topList}>
          <div className={styles.header}>
            <div className={styles.title}>{<FormattedMessage id="report-designer.dataset" />}</div>
          </div>
          <DropSelect
            {...dropSelectProps}
            addon={() => (
              <div className={styles.addon}>
                <Icon type="form" />
              </div>
            )}
          />
          <ul className={styles.list}>
            {dataSetListColumn.map(() => (
              <ListItem color="blue" />
            ))}
          </ul>
        </div>
        <div className={styles.divider} />
        <div className={styles.bottomList}>
          <div className={styles.treeParent}>
            <Icon type="caret-right" />
            <IconFont type="iconwenjianjia" className={styles.iconwenjianjia} />
            SQL Param
          </div>
          <ul className={styles.list}>
            {dataSetListSqlParams.map(() => (
              <ListItem color="orange" />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

function ListItem({ color }) {
  return (
    <li className={styles[color]}>
      <IconFont type="iconicon-str" className={classNames(styles.icon, styles[color])} />
      <span>Type</span>
    </li>
  );
}
