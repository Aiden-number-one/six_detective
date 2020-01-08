import React from 'react';
import { Layout, Collapse, Icon, Form, Input, Select, Checkbox, Radio } from 'antd';
import { FormattedMessage } from 'umi/locale';
import _ from 'lodash';
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
  const {
    getFieldDecorator,
    currentWidge = {},
    dataSetPrivateList,
    modifyCustomerType,
    addCustomerType,
  } = props;
  const params = _.flattenDeep(dataSetPrivateList.map(value => value.query.parameters || []));
  const { customList = [] } = currentWidge;
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
              {getFieldDecorator('widgetType', {
                initialValue: currentWidge.widgetType,
              })(
                <Select>
                  <Option value="input">Input</Option>
                  <Option value="inputnumber">Input Number</Option>
                  <Option value="datepickeryyyy">Date Picker(yyyy)</Option>
                  <Option value="datepickeryyyymm">Date Picker(yyyy-mm)</Option>
                  <Option value="datepickeryyyymmdd">Date Picker(yyyy-mm-dd)</Option>
                  <Option value="select">Select</Option>
                  <Option value="selectmultiple">Multiple selection</Option>
                  <Option value="radio">Radio</Option>
                  <Option value="checkbox">Checkbox</Option>
                </Select>,
              )}
            </Form.Item>
            {/* 标签名称 */}
            <Form.Item label={<FormattedMessage id="report-designer.tag-name" />} {...formLayout}>
              <Form.Item style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('widgetName', {
                  initialValue: currentWidge.widgetName,
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ display: 'inline-block', width: '50%', paddingLeft: 4 }}>
                {getFieldDecorator('widgetNameVisible', {
                  initialValue: currentWidge.widgetNameVisible,
                })(<Checkbox>{<FormattedMessage id="report-designer.visible" />}</Checkbox>)}
              </Form.Item>
            </Form.Item>
            {/* 提示文字 */}
            <Form.Item label={<FormattedMessage id="report-designer.tooltip" />} {...formLayout}>
              {getFieldDecorator('widgetPlaceholder', {
                initialValue: currentWidge.widgetPlaceholder,
              })(<Input />)}
            </Form.Item>
            {/* 描述信息 */}
            <Form.Item
              label={<FormattedMessage id="report-designer.description" />}
              {...formLayout}
            >
              {getFieldDecorator('widgetDes', {
                initialValue: currentWidge.widgetDes,
              })(<TextArea rows={2} />)}
            </Form.Item>
            {/* 默认状态 */}
            <Form.Item
              label={<FormattedMessage id="report-designer.defaultstatus" />}
              {...formLayout}
            >
              {getFieldDecorator('widgetStatus', {
                initialValue: currentWidge.widgetStatus || 'normal',
              })(
                <Radio.Group>
                  <Radio.Button value="normal">
                    <FormattedMessage id="report-designer.normal" />
                  </Radio.Button>
                  <Radio.Button value="readyonly">
                    <FormattedMessage id="report-designer.readyonly" />
                  </Radio.Button>
                  <Radio.Button value="hide">
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
              {getFieldDecorator('widgetDefault', {})(<Input />)}
            </Form.Item>
            {/* 表字段 */}
            <Form.Item label={<FormattedMessage id="report-designer.field" />} {...formLayout}>
              {getFieldDecorator(
                'widgetKey',
                {},
              )(
                <Select>
                  {params.map(value => (
                    <Option key={value.field_data_name}>{value.field_data_name}</Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
      {/* 控件设置选项信息 */}
      {/* 此内容只在单选、多选、radio、checkbox中显示 */}
      {(currentWidge.widgetType === 'select' ||
        currentWidge.widgetType === 'selectmultiple' ||
        currentWidge.widgetType === 'radio' ||
        currentWidge.widgetType === 'checkbox') && (
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
                {getFieldDecorator(
                  'sourceType',
                  {},
                )(
                  <Select>
                    <Option value="dataset">Data Set</Option>
                    <Option value="custom">Custom</Option>
                    <Option value="table">Table</Option>
                  </Select>,
                )}
              </Form.Item>
              {currentWidge.sourceType === 'table' && (
                <>
                  {/* 数据源 */}
                  <Form.Item
                    label={<FormattedMessage id="report-designer.datasource" />}
                    {...formLayout}
                  >
                    {getFieldDecorator('datasource', {})(<Select />)}
                  </Form.Item>
                  {/* 数据集 */}
                  <Form.Item
                    label={<FormattedMessage id="report-designer.dataset" />}
                    {...formLayout}
                  >
                    {getFieldDecorator('dataset', {})(<Select />)}
                  </Form.Item>
                  {/* 数据字段 */}
                  <Form.Item
                    label={<FormattedMessage id="report-designer.datacolumn" />}
                    {...formLayout}
                  >
                    {getFieldDecorator('datacolumn', {})(<Select />)}
                  </Form.Item>
                </>
              )}
              {currentWidge.sourceType === 'dataset' && (
                <>
                  {/* 数据集 */}
                  <Form.Item
                    label={<FormattedMessage id="report-designer.dataset" />}
                    {...formLayout}
                  >
                    {getFieldDecorator('dataset', {})(<Select />)}
                  </Form.Item>
                  {/* 数据字段 */}
                  <Form.Item
                    label={<FormattedMessage id="report-designer.datacolumn" />}
                    {...formLayout}
                  >
                    {getFieldDecorator('datacolumn', {})(<Select />)}
                  </Form.Item>
                </>
              )}
              {currentWidge.sourceType === 'custom' &&
                customList.map((value, index) => (
                  <Input
                    value={value.value}
                    onChange={e => {
                      modifyCustomerType(customList, index, e.target.value);
                    }}
                  />
                ))}
            </Form>
          </Panel>
        </Collapse>
      )}
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
// export default connect(({ formArea }) => ({
//   // customSearchData: formArea.customSearchData,
// }))(WidgetControl);
