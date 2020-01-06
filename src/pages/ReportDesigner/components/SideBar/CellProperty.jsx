import React, { useState } from 'react';
import { Layout, Collapse, Icon, Form, Input, Select, Radio } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './index.less';
import IconFont from '@/components/IconFont';

const { Content } = Layout;
const { Panel } = Collapse;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default props => {
  const { getFieldDecorator, cellPosition, dataSetPrivateList, otherProps } = props;
  // 当前被选择的数据集
  const [dataset, changeDataset] = useState(undefined);
  // 根据被选择的数据集得到想对应的列
  // TODO: 如果，树那边的数据集被删掉，则右边已经设置的单元格怎么办？
  const currentDatasetObj = dataSetPrivateList.find(value => value.dataset_id === dataset);
  const currentColumn = currentDatasetObj ? currentDatasetObj.fields : [];
  /**
   * 表单值汇总
   * cell: 单元格 elementType: 元素类型
   * text: 单元格内容
   * formula: 公式内容
   * dataset:数据集 datacolumn: 数据集所对应的列 dataSetting: 数据设置选择框 dataseting2: 数据设置选择框的副选择框 extension: 扩展方向
   */
  return (
    <Content className={styles.content}>
      {/* 控件设置基本信息 */}
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        <Panel header={<FormattedMessage id="report-designer.basic" />} key="1">
          <Form colon={false}>
            {/* 单元格 */}
            <Form.Item label={<FormattedMessage id="report-designer.cell" />} {...formLayout}>
              {getFieldDecorator('cell', {
                initialValue: cellPosition,
              })(<Input disabled />)}
            </Form.Item>
            {/* 插入元素类型 */}
            <Form.Item
              label={<FormattedMessage id="report-designer.insertelement" />}
              {...formLayout}
            >
              {getFieldDecorator('elementType', {
                initialValue: otherProps.elementType || 'text',
              })(
                <Select>
                  <Option value="text">Text</Option>
                  <Option value="formula">Formula</Option>
                  <Option value="column">Data Column</Option>
                </Select>,
              )}
            </Form.Item>
            {/* 插入文本 */}
            {/* 文本 */}
            {(otherProps.elementType === 'text' || otherProps.elementType === undefined) && (
              <Form.Item label=" " {...formLayout}>
                {getFieldDecorator('text', {})(<Input />)}
              </Form.Item>
            )}

            {/* 插入公式 */}
            {/* 公式 */}
            {otherProps.elementType === 'formula' && (
              <Form.Item label=" " {...formLayout}>
                {getFieldDecorator('formula', {})(<Input />)}
              </Form.Item>
            )}

            {/* 插入数据列 */}
            {/* 数据集 */}
            {otherProps.elementType === 'column' && (
              <>
                <Form.Item
                  label={<FormattedMessage id="report-designer.dataset" />}
                  {...formLayout}
                >
                  {getFieldDecorator('dataSet', {
                    initialValue: otherProps.dataSet.datasetId || undefined,
                  })(
                    <Select
                      placeholder="Please Select"
                      onChange={datasetValue => {
                        changeDataset(datasetValue);
                      }}
                    >
                      {dataSetPrivateList.map(value => (
                        <Option value={value.dataset_id}>{value.dataset_name}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
                {/* 数据列 */}
                <Form.Item
                  label={<FormattedMessage id="report-designer.datacolumn" />}
                  {...formLayout}
                >
                  {getFieldDecorator('dataColumn', {
                    initialValue: otherProps.dataSet.fieldDataName || undefined,
                  })(
                    <Select placeholder="Please Select">
                      {currentColumn.map(value => (
                        <Option value={value.field_data_name}>{value.field_data_name}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
                {/* 数据设置1 */}
                <Form.Item
                  label={<FormattedMessage id="report-designer.datasettings" />}
                  {...formLayout}
                >
                  {getFieldDecorator('dataSetting', {
                    initialValue: otherProps.dataSetting || 'group',
                  })(
                    <Select>
                      <Option value="group">
                        {<FormattedMessage id="report-designer.group" />}
                      </Option>
                      <Option value="list">{<FormattedMessage id="report-designer.list" />}</Option>
                      <Option value="sum">{<FormattedMessage id="report-designer.sum" />}</Option>
                    </Select>,
                  )}
                </Form.Item>
                {/* 数据设置2 */}
                {otherProps.dataSetting === 'group' && (
                  <Form.Item label=" " {...formLayout}>
                    {getFieldDecorator('groupSetting', {
                      initialValue: otherProps.groupSetting || 'normal',
                    })(
                      <Select>
                        <Option value="normal">Normal</Option>
                      </Select>,
                    )}
                  </Form.Item>
                )}
                {otherProps.dataSetting === 'sum' && (
                  <Form.Item label=" " {...formLayout}>
                    {getFieldDecorator('sumSetting', {
                      initialValue: otherProps.sumSetting || 'Sum',
                    })(
                      <Select>
                        <Option value="sum">Sum</Option>
                        <Option value="count">Count</Option>
                        <Option value="average">Average</Option>
                        <Option value="max">Max</Option>
                        <Option value="min">Min</Option>
                      </Select>,
                    )}
                  </Form.Item>
                )}
                {otherProps.dataSetting !== 'sum' && (
                  <Form.Item
                    label={<FormattedMessage id="report-designer.extension" />}
                    {...formLayout}
                  >
                    {getFieldDecorator('expendDirection', {
                      initialValue: otherProps.expendDirection || 'Down',
                    })(
                      <Radio.Group>
                        <Radio.Button value="None">
                          <IconFont type="icon-nodirection" />
                        </Radio.Button>
                        <Radio.Button value="Down">
                          <IconFont type="icon-zongxiang" />
                        </Radio.Button>
                        <Radio.Button value="Right">
                          <IconFont type="icon-hengxiang" />
                        </Radio.Button>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                )}
              </>
            )}
          </Form>
        </Panel>
      </Collapse>
    </Content>
  );
};
