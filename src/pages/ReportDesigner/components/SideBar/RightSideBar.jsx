import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Form } from 'antd';
import classNames from 'classnames';
import { FormattedMessage } from 'umi/locale';
import { getColIndexRowIndex, setCellTypeAndValue } from '../../utils';
import IconFont from '@/components/IconFont';
import WidgetControl from './WidgetControl';
import CellProperty from './CellProperty';
import styles from './index.less';

const { Sider } = Layout;

@connect(({ reportDesigner }) => ({
  cellPosition: reportDesigner.cellPosition,
  dataSetPrivateList: reportDesigner.dataSetPrivateList,
  spreadsheetOtherProps: reportDesigner.spreadsheetOtherProps,
}))
@Form.create({
  onFieldsChange(props, changedFields, allFields) {
    // TODO：异步问题
    if (props.cellPosition !== allFields.cell.value) {
      return;
    }
    // 若修改form，则即使更新fields
    const { dispatch, dataSetPrivateList, cellPosition } = props;
    const result = {};
    Object.entries(allFields).forEach(([key, value]) => {
      result[key] = value.value;
    });
    const { dataSet, dataColumn, ...otherProps } = result;
    otherProps.dataSet = {
      datasetId: dataSet,
      datasetName: dataSetPrivateList.find(value => value.dataset_id === dataSet)
        ? dataSetPrivateList.find(value => value.dataset_id === dataSet).dataset_name
        : undefined,
      fieldDataName: dataColumn,
    };
    // 若此单元格为数据集类型，且数据集与数据集字段都有，则为此单元格设置元素
    if (
      otherProps.dataSet.datasetName &&
      otherProps.dataSet.fieldDataName &&
      otherProps.elementType
    ) {
      setCellTypeAndValue(
        'dataSet',
        `${otherProps.dataSet.datasetName}.${otherProps.dataSet.fieldDataName}`,
        cellPosition,
      );
    }
    dispatch({
      type: 'reportDesigner/modifyTemplateArea',
      payload: otherProps,
    });
  },
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

  // 去判断属否是重新渲染组建（这样做有风险，后期优化）
  resetFields = () => {
    const {
      form: { resetFields },
    } = this.props;
    if (this.cellPosition !== this.props.cellPosition && this.cellPosition) {
      resetFields();
    }
    this.cellPosition = this.props.cellPosition;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      cellPosition,
      rightSideCollapse,
      changeRightSideBar,
      dataSetPrivateList,
      dispatch,
      spreadsheetOtherProps,
    } = this.props;
    this.resetFields();
    const { siderBarType } = this.state;
    const formattedMessageMap = {
      cell: 'cellproperty',
      query: 'widgetcontrol',
    };
    const [rowIndex, colIndex] = getColIndexRowIndex(cellPosition);
    // 单元格的props
    const cellProps = {
      cellPosition, // 单元格位置
      dataSetPrivateList, // 私有数据集
      otherProps: spreadsheetOtherProps.length > 0 ? spreadsheetOtherProps[rowIndex][colIndex] : {},
    };
    // 表单的props
    const formProps = {
      getFieldDecorator,
      dispatch,
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
