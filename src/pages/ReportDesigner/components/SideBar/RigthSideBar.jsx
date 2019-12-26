import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Form } from 'antd';
import classNames from 'classnames';
import { FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import WidgetControl from './WidgetControl';
import CellProperty from './CellProperty';
import styles from './index.less';

const { Sider } = Layout;

@connect(({ formArea, reportDesigner }) => ({
  cellPosition: formArea.cellPosition,
  dataSetPrivateList: reportDesigner.dataSetPrivateList,
}))
@Form.create()
export default class RigthSideBar extends PureComponent {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { cellPosition, rightSideCollapse, changeRightSideBar, dataSetPrivateList } = this.props;
    const formProps = {
      getFieldDecorator,
    };
    // 单元格的props
    const cellProps = {
      cellPosition, // 单元格位置
      dataSetPrivateList, // 私有数据集
    };
    const typeArray = ['cellproperty', 'widgetcontrol'];
    const type = typeArray[0];
    return (
      <Layout className={classNames(styles.layout, styles.sideBar)}>
        <div className={styles.header}>
          {rightSideCollapse && (
            <div className={styles.title}>
              {<FormattedMessage id={`report-designer.${type}`} />}
            </div>
          )}
          <IconFont
            type={rightSideCollapse ? 'iconright' : 'iconleft'}
            onClick={() => {
              changeRightSideBar(!rightSideCollapse);
            }}
          />
        </div>
        {rightSideCollapse && (
          <Layout>
            {type === 'widgetcontrol' && <WidgetControl {...formProps} />}
            {type === 'cellproperty' && <CellProperty {...formProps} {...cellProps} />}
            <Sider width={30} className={styles.sider} />
          </Layout>
        )}
      </Layout>
    );
  }
}
