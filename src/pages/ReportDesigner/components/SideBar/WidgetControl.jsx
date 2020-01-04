import React from 'react';
import { Layout, Collapse, Icon, Form, Input, Select, Checkbox, Radio } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './index.less';

const { Content } = Layout;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default props => {
  const { getFieldDecorator } = props;
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
            {/* 控件类型 */}
            <Form.Item label={<FormattedMessage id="report-designer.widgettype" />} {...formLayout}>
              {getFieldDecorator(
                'widgettype',
                {},
              )(
                <Select onChange={}>
                  <Option value="input">Input</Option>
                  <Option value="inputnumber">Input Number</Option>
                  <Option value="datepickeryyyy">Date Picker(yyyy)</Option>
                  <Option value="datepickeryyyymm">Date Picker(yyyy-mm)</Option>
                  <Option value="datepickeryyyymmdd">Date Picker(yyyy-mm-dd)</Option>
                  <Option value="select">Select</Option>
                  <Option value="radio">Radio</Option>
                  <Option value="checkbox">Checkbox</Option>
                </Select>,
              )}
            </Form.Item>
            {/* 标签名称 */}
            <Form.Item label={<FormattedMessage id="report-designer.tag-name" />} {...formLayout}>
              <Form.Item style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('widgetname', {})(<Input />)}
              </Form.Item>
              <Form.Item style={{ display: 'inline-block', width: '50%', paddingLeft: 4 }}>
                <Checkbox>{<FormattedMessage id="report-designer.visible" />}</Checkbox>
              </Form.Item>
            </Form.Item>
            {/* 提示文字 */}
            <Form.Item label={<FormattedMessage id="report-designer.tooltip" />} {...formLayout}>
              {getFieldDecorator('roleName', {})(<Input />)}
            </Form.Item>
            {/* 描述信息 */}
            <Form.Item
              label={<FormattedMessage id="report-designer.description" />}
              {...formLayout}
            >
              {getFieldDecorator('roleName', {})(<TextArea rows={2} />)}
            </Form.Item>
            {/* 默认状态 */}
            <Form.Item
              label={<FormattedMessage id="report-designer.defaultstatus" />}
              {...formLayout}
            >
              {getFieldDecorator(
                'roleName',
                {},
              )(
                <Radio.Group defaultValue="a">
                  <Radio.Button value="a">
                    <FormattedMessage id="report-designer.normal" />
                  </Radio.Button>
                  <Radio.Button value="b">
                    <FormattedMessage id="report-designer.readyonly" />
                  </Radio.Button>
                  <Radio.Button value="c">
                    <FormattedMessage id="report-designer.hide" />
                  </Radio.Button>
                </Radio.Group>,
              )}
            </Form.Item>
            {/* 默认值 */}
            <Form.Item
              label={<FormattedMessage id="report-designer.defaultvalue" />}
              {...formLayout}
            >
              {getFieldDecorator('roleName', {})(<Input />)}
            </Form.Item>
            {/* 表字段 */}
            <Form.Item label={<FormattedMessage id="report-designer.field" />} {...formLayout}>
              {getFieldDecorator('roleName', {})(<Input />)}
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
      {/* 控件设置选项信息 */}
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        <Panel header={<FormattedMessage id="report-designer.option" />} key="1">
          <Form colon={false}>
            {/* 来源于 */}
            <Form.Item label={<FormattedMessage id="report-designer.from" />} {...formLayout}>
              {getFieldDecorator('roleName', {})(<Select />)}
            </Form.Item>
            {/* 数据源 */}
            <Form.Item label={<FormattedMessage id="report-designer.datasource" />} {...formLayout}>
              {getFieldDecorator('roleName', {})(<Select />)}
            </Form.Item>
            {/* 数据集 */}
            <Form.Item label={<FormattedMessage id="report-designer.dataset" />} {...formLayout}>
              {getFieldDecorator('roleName', {})(<Select />)}
            </Form.Item>
            {/* 数据字段 */}
            <Form.Item label={<FormattedMessage id="report-designer.datacolumn" />} {...formLayout}>
              {getFieldDecorator('roleName', {})(<Select />)}
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
      {/* 控件校验 */}
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
      >
        <Panel header={<FormattedMessage id="report-designer.check" />} key="1">
          <Form>
            {getFieldDecorator(
              'roleName',
              {},
            )(<Checkbox>{<FormattedMessage id="report-designer.allownull" />}</Checkbox>)}
          </Form>
        </Panel>
      </Collapse>
    </Content>
  );
};
