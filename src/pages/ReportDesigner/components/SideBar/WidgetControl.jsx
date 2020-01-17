import React from 'react';
import {
  Layout,
  Collapse,
  Icon,
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  Button,
  InputNumber,
  DatePicker,
} from 'antd';
import { FormattedMessage } from 'umi/locale';
import _ from 'lodash';
import moment from 'moment';
import IconFont from '@/components/IconFont';
import styles from './index.less';

const { Content } = Layout;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const { MonthPicker } = DatePicker;

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default props => {
  const {
    getFieldDecorator,
    currentWidge = {},
    dataSetPrivateList,
    addCustomerType,
    deleteOrModifyCustomerType,
    dataSetPublicList,
    dispatch,
    defaultValueDatasetType,
    dataSourceList = [], // 数据源列表
    tableList = [], // 数据源列表下的所有表
    tableColumnList = [], // 获取所有表下的字段
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
                  valuePropName: 'checked',
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
              <>
                {/* 若类型为Input类型 */}
                {currentWidge.widgetType === 'input' &&
                  getFieldDecorator('widgetDefault', {
                    initialValue: currentWidge.widgetDefault,
                  })(<Input />)}
                {/* 若类型为Select/MutiSelect/Radio/CheckBox类型 */}
                {(currentWidge.widgetType === 'select' ||
                  currentWidge.widgetType === 'selectmultiple' ||
                  currentWidge.widgetType === 'radio' ||
                  currentWidge.widgetType === 'checkbox') &&
                  (() => {
                    if (currentWidge.sourceType === 'custom') {
                      return getFieldDecorator('widgetDefault', {
                        initialValue: currentWidge.widgetDefault,
                      })(
                        <Select
                          mode={
                            (currentWidge.widgetType === 'selectmultiple' ||
                              currentWidge.widgetType === 'checkbox') &&
                            'multiple'
                          }
                        >
                          {customList.map(optionData => (
                            <Option key={optionData.key}>{optionData.value}</Option>
                          ))}
                        </Select>,
                      );
                    }
                    if (
                      currentWidge.sourceType === 'dataset' ||
                      currentWidge.sourceType === 'table'
                    ) {
                      return getFieldDecorator('widgetDefault', {
                        initialValue: currentWidge.widgetDefault,
                      })(
                        <Select
                          mode={
                            (currentWidge.widgetType === 'selectmultiple' ||
                              currentWidge.widgetType === 'checkbox') &&
                            'multiple'
                          }
                        >
                          {(
                            defaultValueDatasetType[
                              currentWidge.sourceType === 'dataset'
                                ? currentWidge.datacolumn
                                : currentWidge.tablecolumn
                            ] || []
                          ).map(data => (
                            <Option key={data}>{data}</Option>
                          ))}
                        </Select>,
                      );
                    }
                    return <Select />;
                  })()}
                {/* 若类型为年类型 */}
                {currentWidge.widgetType === 'datepickeryyyy' &&
                  getFieldDecorator('widgetDefault', {
                    initialValue: currentWidge.widgetDefault
                      ? currentWidge.widgetDefault
                      : undefined,
                  })(
                    <Select>
                      {_.range(1990, 2099).map(year => (
                        <Option key={year}>{year}</Option>
                      ))}
                    </Select>,
                  )}
                {/* 若类型为月类型 */}
                {currentWidge.widgetType === 'datepickeryyyymm' &&
                  getFieldDecorator('widgetDefault', {
                    initialValue: currentWidge.widgetDefault
                      ? moment(currentWidge.widgetDefault, 'YYYY-MM')
                      : undefined,
                  })(<MonthPicker />)}
                {/* 若类型为日类型 */}
                {currentWidge.widgetType === 'datepickeryyyymmdd' &&
                  getFieldDecorator('widgetDefault', {
                    initialValue: currentWidge.widgetDefault
                      ? moment(currentWidge.widgetDefault, 'YYYY-MM-DD')
                      : undefined,
                  })(<MonthPicker />)}
              </>
              ,
            </Form.Item>
            {/* 表字段 */}
            <Form.Item label={<FormattedMessage id="report-designer.field" />} {...formLayout}>
              {getFieldDecorator('widgetKey', {
                initialValue: currentWidge.widgetKey,
              })(
                <Select>
                  {params.map(value => (
                    <Option key={value.parameter_name}>{value.parameter_name}</Option>
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
                {getFieldDecorator('sourceType', {
                  initialValue: currentWidge.sourceType,
                })(
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
                    {getFieldDecorator('datasource', {
                      initialValue: currentWidge.datasource,
                    })(
                      <Select
                        onChange={value => {
                          currentWidge.table = undefined;
                          currentWidge.currentWidge = undefined;
                          currentWidge.widgetDefault = undefined;
                          // 获取数据源下所有的表
                          dispatch({
                            type: 'formArea/getDataSourceTable',
                            payload: {
                              pageNumber: '1',
                              pageSize: '9999',
                              connection_id: value,
                            },
                          });
                        }}
                      >
                        {dataSourceList.map(value => (
                          <Option value={value.connectionId}>{value.connectionName}</Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                  {/* 数据集 */}
                  <Form.Item
                    label={<FormattedMessage id="report-designer.table" />}
                    {...formLayout}
                  >
                    {getFieldDecorator('table', {
                      initialValue: currentWidge.table,
                    })(
                      <Select
                        onChange={value => {
                          currentWidge.tablecolumn = undefined;
                          currentWidge.widgetDefault = undefined;
                          dispatch({
                            type: 'formArea/getTableColumnValue',
                            payload: {
                              table_id: value.split('.').length === 3 ? value.split('.')[2] : '',
                            },
                          });
                        }}
                      >
                        {tableList.map(value => (
                          <Option value={`${value.schemName}.${value.tableName}.${value.tableId}`}>
                            {value.tableName}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                  {/* 数据字段 */}
                  <Form.Item
                    label={<FormattedMessage id="report-designer.datacolumn" />}
                    {...formLayout}
                  >
                    {getFieldDecorator('tablecolumn', {
                      initialValue: currentWidge.tablecolumn,
                    })(
                      <Select
                        onChange={value => {
                          currentWidge.widgetDefault = undefined;
                          // 获取完毕字段后，得到相对应的字段相对应的值
                          dispatch({
                            type: 'formArea/getDataSetColumnValue',
                            payload: {
                              datasourceId: currentWidge.datasource,
                              fieldName: value,
                              tableName:
                                currentWidge.table.split('.').length === 3
                                  ? `${currentWidge.table.split('.')[0]}.${
                                      currentWidge.table.split('.')[1]
                                    }`
                                  : '',
                            },
                          });
                        }}
                      >
                        {tableColumnList.map(value => (
                          <Option value={value.columnName}>{value.columnName}</Option>
                        ))}
                      </Select>,
                    )}
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
                    {getFieldDecorator('datasetName', {
                      initialValue: currentWidge.datasetName,
                    })(
                      <Select
                        onChange={() => {
                          // TODO: 后期优化
                          currentWidge.datacolumn = undefined;
                          currentWidge.widgetDefault = undefined;
                        }}
                      >
                        {dataSetPublicList.map(value => (
                          <Option key={value.datasetId}>{value.datasetName}</Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                  {/* 数据字段 */}
                  <Form.Item
                    label={<FormattedMessage id="report-designer.datacolumn" />}
                    {...formLayout}
                  >
                    {getFieldDecorator('datacolumn', {
                      initialValue: currentWidge.datacolumn,
                    })(
                      <Select
                        onChange={value => {
                          dispatch({
                            type: 'formArea/getDataSetColumnValue',
                            payload: {
                              datasetId: currentWidge.datasetName,
                              fieldName: value,
                            },
                          });
                        }}
                      >
                        {(dataSetPublicList.find(
                          value => value.datasetId === currentWidge.datasetName,
                        )
                          ? dataSetPublicList.find(
                              value => value.datasetId === currentWidge.datasetName,
                            ).datasetFields
                          : []
                        ).map(value => (
                          <Option key={value.field_data_name}>{value.field_data_name}</Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </>
              )}
              {currentWidge.sourceType === 'custom' && (
                <div className={styles.customerButt}>
                  {customList.map((value, index) => (
                    <div key={value.key}>
                      <Input
                        value={value.value}
                        onChange={e => {
                          deleteOrModifyCustomerType(index, 'modify', e.target.value);
                        }}
                      />
                      <IconFont
                        type="icon-delete"
                        onClick={() => {
                          deleteOrModifyCustomerType(index, 'delete');
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    className={styles.dash}
                    type="dashed"
                    icon="plus"
                    onClick={addCustomerType}
                  />
                </div>
              )}
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
          <Form colon={false}>
            <Form.Item label={<FormattedMessage id="report-designer.allownull" />} {...formLayout}>
              {getFieldDecorator('widgetIsNull', {
                initialValue: true,
                valuePropName: 'checked',
              })(<Checkbox />)}
            </Form.Item>
            {currentWidge.widgetType === 'input' && (
              <>
                <Form.Item label="Max Length" {...formLayout}>
                  {getFieldDecorator('maxLength', {
                    initialValue: currentWidge.maxLength,
                  })(<InputNumber precision={0} min={1} />)}
                </Form.Item>
                <Form.Item label="Min Length" {...formLayout}>
                  {getFieldDecorator('minLength', {
                    initialValue: currentWidge.minLength,
                  })(<InputNumber precision={0} min={1} />)}
                </Form.Item>
              </>
            )}
            {currentWidge.widgetType === 'inputnumber' && (
              <>
                <Form.Item label="Max" {...formLayout}>
                  {getFieldDecorator('maxNumber', {
                    initialValue: currentWidge.maxLength,
                  })(<InputNumber />)}
                </Form.Item>
                <Form.Item label="Min" {...formLayout}>
                  {getFieldDecorator('minNumber', {
                    initialValue: currentWidge.maxLength,
                  })(<InputNumber />)}
                </Form.Item>
              </>
            )}
          </Form>
        </Panel>
      </Collapse>
    </Content>
  );
};
// export default connect(({ formArea }) => ({
//   // customSearchData: formArea.customSearchData,
// }))(WidgetControl);
