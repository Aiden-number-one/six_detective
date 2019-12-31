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
  const { getFieldDecorator, cellPosition, dataSetPrivateList } = props;
  // 单元格类型
  const [cellType, changeCellType] = useState('0');
  // 当前被选择的数据集
  const [dataset, changeDataset] = useState(undefined);
  // 根据被选择的数据集得到想对应的列
  // TODO: 如果，树那边的数据集被删掉，则右边已经设置的单元格怎么办？
  const currentDatasetObj = dataSetPrivateList.find(value => value.dataset_id === dataset);
  const currentColumn = currentDatasetObj ? currentDatasetObj.fields : [];
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
              {getFieldDecorator('roleName', {
                initialValue: '0',
              })(
                <Select
                  onChange={e => {
                    changeCellType(e);
                  }}
                >
                  <Option value="0">Text</Option>
                  <Option value="1">Formula</Option>
                  <Option value="2">Data Column</Option>
                </Select>,
              )}
            </Form.Item>
            {/* 插入文本 */}
            {/* 文本 */}
            {cellType === '0' && (
              <Form.Item label=" " {...formLayout}>
                {getFieldDecorator('text', {})(<Input />)}
              </Form.Item>
            )}

            {/* 插入公式 */}
            {/* 公式 */}
            {cellType === '1' && (
              <Form.Item label=" " {...formLayout}>
                {getFieldDecorator('formula', {})(<Input />)}
              </Form.Item>
            )}

            {/* 插入数据列 */}
            {/* 数据集 */}
            {cellType === '2' && (
              <>
                <Form.Item
                  label={<FormattedMessage id="report-designer.dataset" />}
                  {...formLayout}
                >
                  {getFieldDecorator(
                    'dataset',
                    {},
                  )(
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
                  {getFieldDecorator(
                    'datacolumn',
                    {},
                  )(
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
                  {getFieldDecorator('roleName', {})(<Select />)}
                </Form.Item>
                {/* 数据设置2 */}
                <Form.Item label=" " {...formLayout}>
                  {getFieldDecorator('roleName', {})(<Select />)}
                </Form.Item>
                <Form.Item
                  label={<FormattedMessage id="report-designer.extension" />}
                  {...formLayout}
                >
                  {getFieldDecorator(
                    'roleName',
                    {},
                  )(
                    <Radio.Group defaultValue="a">
                      <Radio.Button value="a">
                        <IconFont type="icon-nodirection" />
                      </Radio.Button>
                      <Radio.Button value="b">
                        <IconFont type="icon-zongxiang" />
                      </Radio.Button>
                      <Radio.Button value="c">
                        <IconFont type="icon-hengxiang" />
                      </Radio.Button>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </>
            )}
          </Form>
        </Panel>
      </Collapse>
    </Content>
  );
};
