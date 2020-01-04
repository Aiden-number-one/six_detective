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
@Form.create({
  // onFieldsChange(props, changedFields, allFields) {
  //   // 若修改form，则即使更新fields
  //   console.log(allFields);
  //   // const { dispatch } = props;
  //   // dispatch({
  //   //   type: '',
  //   // });
  // },
})
export default class RightSideBar extends PureComponent {
  state = {
    siderBarType: 'cell',
  };

  // 切换rightSiderBar
  changeSiderBarType = siderBarType => {
    this.setState({
      siderBarType,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      cellPosition,
      rightSideCollapse,
      changeRightSideBar,
      dataSetPrivateList,
      dispatch,
    } = this.props;
    const formProps = {
      getFieldDecorator,
      dispatch,
    };
    const { siderBarType } = this.state;
    // 单元格的props
    const cellProps = {
      cellPosition, // 单元格位置
      dataSetPrivateList, // 私有数据集
    };
    const formattedMessageMap = {
      cell: 'cellproperty',
      query: 'widgetcontrol',
    };
    return (
      <Layout className={classNames(styles.layout, styles.sideBar)}>
        <div className={styles.header}>
          {rightSideCollapse && (
            <div className={styles.title}>
              {<FormattedMessage id={`report-designer.${formattedMessageMap[siderBarType]}`} />}
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
            {siderBarType === 'cell' && <CellProperty {...formProps} {...cellProps} />}
            {siderBarType === 'query' && <WidgetControl {...formProps} />}
            {siderBarType === 'global' && <CellProperty {...formProps} {...cellProps} />}
            <Sider width={30} className={styles.sider}>
              <IconFont
                type="iconbiaoge2"
                className={siderBarType === 'cell' && 'active'}
                onClick={() => {
                  this.changeSiderBarType('cell');
                }}
              />
              <IconFont
                type="iconshitujuzhen"
                className={siderBarType === 'query' && 'active'}
                onClick={() => {
                  this.changeSiderBarType('query');
                }}
              />
              <IconFont
                type="icon-data"
                className={siderBarType === 'global' && 'active'}
                onClick={() => {
                  this.changeSiderBarType('global');
                }}
              />
            </Sider>
          </Layout>
        )}
      </Layout>
    );
  }
}
