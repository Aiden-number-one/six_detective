import React, { useState } from 'react';
import { Layout, Collapse, Icon, Form, Input, Select } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './index.less';

const { Content } = Layout;
const { Panel } = Collapse;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default props => {
  const [cellType, changeCellType] = useState('0');

  const { getFieldDecorator, cellPosition } = props;
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
              {getFieldDecorator('roleName', {})(
                <Select
                  onChange={e => {
                    changeCellType(e);
                  }}
                >
                  <Option value="0">插入文本(T)</Option>
                  <Option value="1">插入公式(F)</Option>
                  <Option value="2">插入列(D)</Option>
                </Select>,
              )}
            </Form.Item>
            {/* 插入文本 */}
            {/* 文本 */}
            {cellType === '0' && (
              <Form.Item label=" " {...formLayout}>
                {getFieldDecorator('cell', {})(<Input />)}
              </Form.Item>
            )}

            {/* 插入公式 */}
            {/* 文本 */}
            {cellType === '1' && (
              <Form.Item label=" " {...formLayout}>
                {getFieldDecorator('cell', {})(<Input />)}
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
                  {getFieldDecorator('roleName', {})(<Select />)}
                </Form.Item>
                {/* 数据列 */}
                <Form.Item
                  label={<FormattedMessage id="report-designer.datacolumn" />}
                  {...formLayout}
                >
                  {getFieldDecorator('roleName', {})(<Select />)}
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
              </>
            )}
          </Form>
        </Panel>
      </Collapse>
    </Content>
  );
};
