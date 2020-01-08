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

@connect(({ reportDesigner, formArea }) => ({
  cellPosition: reportDesigner.cellPosition,
  dataSetPrivateList: reportDesigner.dataSetPrivateList,
  spreadsheetOtherProps: reportDesigner.spreadsheetOtherProps,
  teamplateAreaObj: reportDesigner.teamplateAreaObj,
  customSearchData: formArea.customSearchData,
}))
@Form.create({
  onFieldsChange(props, changedFields, allFields) {
    const { dispatch } = props;
    // 便利得到result
    const result = {};
    Object.entries(allFields).forEach(([key, value]) => {
      result[key] = value.value;
    });
    // 若单元格设置区域，则进行以下操作
    if (allFields.cell) {
      // TODO：异步问题
      if (props.cellPosition !== allFields.cell.value) {
        return;
      }
      // 若修改form，则即使更新fields
      const { dataSetPrivateList, cellPosition } = props;
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
    }
    const { customSearchData } = props;
    if (allFields.widgetType && customSearchData.length > 0) {
      // 若单元格为控件设置的操作，则进行以下操作
      dispatch({
        type: 'formArea/changeCustomSearchData',
        payload: {
          index: customSearchData.find(value => value.active).i,
          props: result,
        },
      });
    }
  },
  // 若是控件设置区域，则进行下面的操作
})
export default class RightSideBar extends PureComponent {
  state = {
    siderBarType: 'cell',
  };

  // 修改数据集的自定义类型的中的value
  modifyCustomerType = (customList, modifyIndex, modifyValue) => {
    // 修改自定义数据集中的相关内容
    const { customSearchData, dispatch } = this.props;
    const currentCustom = [...customList];
    // eslint-disable-next-line no-param-reassign
    currentCustom[modifyIndex].value = modifyValue;
    dispatch({
      type: 'formArea/changeCustomSearchData',
      payload: {
        index: customSearchData.find(value => value.active).i,
        props: {
          customList: currentCustom,
        },
      },
    });
  };

  // 控制数据集的自定义类型
  addCustomerType = () => {
    // 新增自定义类型
    const { customSearchData, dispatch } = this.props;
    const current = customSearchData.find(value => value.active) || {};
    const currentCustom = current.custom || [];
    currentCustom.push({
      value: '',
    });
    dispatch({
      type: 'formArea/changeCustomSearchData',
      payload: {
        index: customSearchData.find(value => value.active).i,
        props: {
          customList: currentCustom,
        },
      },
    });
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
      teamplateAreaObj,
      customSearchData,
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
      text: teamplateAreaObj.length > 0 ? teamplateAreaObj[0].data[rowIndex][colIndex] : '',
    };
    // 控件的props
    const widgetProps = {
      currentWidge: customSearchData.find(value => value.active) || {},
      dataSetPrivateList, // 私有数据集，用于展示field
      modifyCustomerType: this.modifyCustomerType,
      addCustomerType: this.addCustomerType,
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
            {siderBarType === 'query' && <WidgetControl {...formProps} {...widgetProps} />}
            {siderBarType === 'global' && <CellProperty {...formProps} />}
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
