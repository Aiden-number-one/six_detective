import React, { useState, useEffect } from 'react';
import { Input, Form, Radio, Select, List, Table, DatePicker } from 'antd';
import moment from 'moment';
import { timestampFormat } from '@/pages/DataImportLog/constants';

import styles from '../index.less';

const { TextArea } = Input;
const { Option } = Select;
const { Column } = Table;

/*
 * @detailData:NewEP任务详情显示的数据
 * @oldValueList:原始值
 * @isShowForm:是否可编辑
 * @getFieldDecorator:表单控件
 */
function NewEP({ detailData, oldValueList, isShowForm, getFieldDecorator }) {
  return (
    <div className={styles.ListBox}>
      <List key="NewEP" split={false}>
        <List.Item>
          <div className={styles.ListItem}>
            <p></p>
            <p>New INFO</p>
            <p>Old INFO</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Market</p>
            <p>{detailData.market}</p>
            <p>{oldValueList.market}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>EP Code</p>
            <p>{detailData.epCode}</p>
            <p>{oldValueList.epCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="EP Name">
                {getFieldDecorator('epName', {
                  rules: [{ required: !!isShowForm, message: 'EP Name is missing!' }],
                  initialValue: detailData.epName,
                })(<Input disabled={!isShowForm} />)}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.epName}</div>
          </div>
        </List.Item>
      </List>
    </div>
  );
}

/*
 * @detailData:NewProduct任务详情显示的数据
 * @oldValueList:原始值
 * @isShowForm:是否可编辑
 * @getFieldDecorator:表单控件
 * @setRadioCurrentValue:设置Is CA Code，Yes或者No
 * @radioPdValue:Is Calculate PD的值，Yes or No
 * @setRadioPdValue:设置Is Calculate PD,Yes或者No
 */
function NewProduct({
  detailData,
  oldValueList,
  getFieldDecorator,
  setRadioCurrentValue,
  radioPdValue,
  setRadioPdValue,
  isShowForm,
}) {
  return (
    <div className={styles.ListBox}>
      <List key="NewProduct" split={false}>
        <List.Item>
          <div className={styles.ListItem}>
            <p></p>
            <p>New INFO</p>
            <p>Old INFO</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Market</p>
            <p>{detailData.market}</p>
            <p>{oldValueList.market}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>HKEX DCASS Code</p>
            <p>{detailData.hkexDcassCode}</p>
            <p>{oldValueList.hkexDcassCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Is CA Code ?">
                {getFieldDecorator('isCaCode', {
                  rules: [{ required: !!isShowForm }],
                  initialValue: detailData.isCaCode,
                })(
                  isShowForm ? (
                    <Radio.Group onChange={e => setRadioCurrentValue(e.target.value)}>
                      <Radio style={{ display: 'inline' }} value="Yes">
                        yes
                      </Radio>
                      <Radio style={{ display: 'inline' }} value="No">
                        no
                      </Radio>
                    </Radio.Group>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.isCaCode}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Product code</p>
            <p>{detailData.productCode}</p>
            <p>{oldValueList.productCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Product Description">
                {getFieldDecorator('productDesc', {
                  rules: [{ required: !!isShowForm, message: 'Product Description is missing!' }],
                  initialValue: detailData.productDesc,
                })(<Input disabled={!isShowForm} />)}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.productDesc}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Product Category" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('productCategory', {
                  rules: [{ required: !!isShowForm, message: 'Product Category is missing!' }],
                  initialValue: detailData.productCategory,
                })(
                  isShowForm ? (
                    <Select optionLabelProp="label">
                      {detailData.productCategoryInit.map(item => (
                        <Option
                          value={item.productCategory}
                          label={item.productCategoryName}
                          key={item.productCategory}
                        >
                          {item.productCategoryName}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div>{oldValueList.productCategory}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Futures or Option" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('contractNature', {
                  rules: [{ required: !!isShowForm, message: 'Futures or Option is missing!' }],
                  initialValue: detailData.contractNature,
                })(
                  isShowForm ? (
                    <Select>
                      {detailData.contractNatureInit.split(',').map(item => (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.contractNature}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Product Group">
                {getFieldDecorator('productGroup', {
                  rules: [{ required: !!isShowForm, message: 'Product Group is missing!' }],
                  initialValue: detailData.productGroup,
                })(
                  isShowForm ? (
                    <Select>
                      {detailData.productGroupInit.map(item => (
                        <Option
                          value={item.productGroup}
                          label={item.productGroupName}
                          key={item.productGroup}
                        >
                          {item.productGroupName}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.productGroup}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item
                label="Template Code(Last Trade Day)"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('ltdTmplCode', {
                  rules: [
                    {
                      required: !!isShowForm,
                      message: 'Template Code(Last Trade Day) is missing!',
                    },
                  ],
                  initialValue: detailData.ltdTmplCode,
                })(
                  isShowForm ? (
                    <Select>
                      {detailData.ltdTmplCodeInit.map(item => (
                        <Option
                          value={item.ltdTmplCode}
                          label={item.ltdTmplName}
                          key={item.ltdTmplCode}
                        >
                          {item.ltdTmplName}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.ltdTmplCode}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item
                label="Template Code(Position Limit)"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('plTmplCode', {
                  rules: [
                    {
                      required: !!isShowForm,
                      message: 'Template Code(Position Limit) is missing!',
                    },
                  ],
                  initialValue: detailData.plTmplCode,
                })(
                  isShowForm ? (
                    <Select>
                      {detailData.plTmplCodeInit.map(item => (
                        <Option
                          value={item.plTmplCode}
                          label={item.plTmplName}
                          key={item.plTmplCode}
                        >
                          {item.plTmplName}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.plTmplCode}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item
                label="Template Code(Reportable Limit)"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('rlTmplCode', {
                  rules: [
                    {
                      required: !!isShowForm,
                      message: 'Template Code(Reportable Limit) is missing!',
                    },
                  ],
                  initialValue: detailData.rlTmplCode,
                })(
                  isShowForm ? (
                    <Select>
                      {detailData.rlTmplCodeInit.map(item => (
                        <Option
                          value={item.rlTmplCode}
                          label={item.rlTmplName}
                          key={item.rlTmplCode}
                        >
                          {item.rlTmplName}
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.rlTmplCode}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Is Calculate PD ?" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('isCalculatePd', {
                  rules: [{ required: !!isShowForm }],
                  initialValue: detailData.isCalculatePd,
                })(
                  isShowForm ? (
                    <Radio.Group
                      onChange={e => setRadioPdValue(e.target.value)}
                      disabled={!isShowForm}
                    >
                      <Radio style={{ display: 'inline' }} value="Yes">
                        yes
                      </Radio>
                      <Radio style={{ display: 'inline' }} value="No">
                        no
                      </Radio>
                    </Radio.Group>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.isCalculatePd}</div>
          </div>
        </List.Item>
        {radioPdValue === 'Yes' ? (
          <>
            <List.Item>
              <div className={styles.ListItem}>
                <div className={styles.formBox}>
                  <Form.Item
                    label="Size Factor for Calculate PD"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('sizeFactor', {
                      rules: [
                        {
                          required: !!isShowForm,
                          message: 'Size Factor for Calculate PD is missing!',
                        },
                      ],
                      initialValue: detailData.sizeFactor,
                    })(<Input type="number" disabled={!isShowForm} />)}
                  </Form.Item>
                </div>
                <div className={styles.oldValueBox}>{oldValueList.sizeFactor}</div>
              </div>
            </List.Item>
            <List.Item>
              <div className={styles.ListItem}>
                <div className={styles.formBox}>
                  <Form.Item
                    label="Weighting Factor for Calculate PD"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('weightFactor', {
                      rules: [
                        {
                          required: !!isShowForm,
                          message: 'Weighting Factor for Calculate PD is missing!',
                        },
                      ],
                      initialValue: detailData.weightFactor,
                    })(<Input type="number" disabled={!isShowForm} />)}
                  </Form.Item>
                </div>
                <div className={styles.oldValueBox}>{oldValueList.weightFactor}</div>
              </div>
            </List.Item>
          </>
        ) : null}
      </List>
    </div>
  );
}

/*
 * @detailData:CaCode任务详情显示的数据
 * @oldValueList:原始值
 * @isShowForm:是否可编辑
 * @getFieldDecorator:表单控件
 * @setRadioCurrentValue:设置Is CA Code，Yes或者No
 */
function CaCode({ detailData, oldValueList, getFieldDecorator, setRadioCurrentValue, isShowForm }) {
  return (
    <div className={styles.ListBox}>
      <List key="CaCode" split={false}>
        <List.Item>
          <div className={styles.ListItem}>
            <p></p>
            <p>New INFO</p>
            <p>Old INFO</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Market</p>
            <p>{detailData.market}</p>
            <p>{oldValueList.market}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>HKEX DCASS Code</p>
            <p>{detailData.hkexDcassCode}</p>
            <p>{oldValueList.hkexDcassCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Is CA Code ?">
                {getFieldDecorator('isCaCode', {
                  rules: [{ required: !!isShowForm }],
                  initialValue: detailData.isCaCode,
                })(
                  isShowForm ? (
                    <Radio.Group onChange={e => setRadioCurrentValue(e.target.value)}>
                      <Radio style={{ display: 'inline' }} value="Yes">
                        yes
                      </Radio>
                      <Radio style={{ display: 'inline' }} value="No">
                        no
                      </Radio>
                    </Radio.Group>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.isCaCode}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Original Product code</p>
            <p>{detailData.originalProductCode}</p>
            <p>{oldValueList.originalProductCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            {/* <p>Effective Date</p> */}
            {/* <p>
              {detailData.effectiveDate &&
                moment(detailData.effectiveDate).format('DD-MMM-YYYY HH:mm:ss')}
            </p> */}
            <div className={styles.formBox}>
              <Form.Item label="Effective Date">
                {getFieldDecorator('effectiveDate', {
                  rules: [{ required: !!isShowForm, message: 'Effective Date is missing!' }],
                  initialValue: isShowForm
                    ? detailData.effectiveDate && moment(detailData.effectiveDate)
                    : detailData.effectiveDate &&
                      moment(detailData.effectiveDate).format('DD-MMM-YYYY'),
                })(isShowForm ? <DatePicker format="DD-MMM-YYYY" /> : <Input disabled />)}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.effectiveDate}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            {/* <p>Expiry Date</p>
            <p>
              {detailData.expiryDate &&
                moment(detailData.expiryDate).format('DD-MMM-YYYY HH:mm:ss')}
            </p> */}
            <div className={styles.formBox}>
              <Form.Item label="Expiry Date">
                {getFieldDecorator('expiryDate', {
                  rules: [{ required: !!isShowForm, message: 'Expiry Date is missing!' }],
                  initialValue: isShowForm
                    ? detailData.expiryDate && moment(detailData.expiryDate)
                    : detailData.expiryDate && moment(detailData.expiryDate).format('DD-MMM-YYYY'),
                })(isShowForm ? <DatePicker format="DD-MMM-YYYY" /> : <Input disabled />)}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.expiryDate}</div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Remark">
                {getFieldDecorator('remark', {
                  rules: [{ required: !!isShowForm, message: 'Remark is missing!' }],
                  initialValue: detailData.remark,
                })(isShowForm ? <TextArea autoSize={{ minRows: 2 }} /> : <Input disabled />)}
              </Form.Item>
            </div>
            <div className={styles.oldValueBox}>{oldValueList.remark}</div>
          </div>
        </List.Item>
      </List>
    </div>
  );
}

/*
 * @detailData:CaCode任务详情显示的数据
 * @isShowForm:是否可编辑
 * @getFieldDecorator:表单控件
 * @onChangeConfirmedToValue:ConfirmedTo变化的回调
 * @onChangeConfirmedBiValue:ConfirmedBi变化的回调
 */
function NewAccound({
  detailData,
  isShowForm,
  getFieldDecorator,
  onChangeConfirmedToValue,
  onChangeConfirmedBiValue,
}) {
  return (
    <div className={styles.ListBox}>
      <List key="NewAccound" split={false}>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Market</p>
            <p>{detailData.market}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Submitter Code</p>
            <p>{detailData.submitterCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Submitter Name</p>
            <p>{detailData.submitterName}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>EP/TO Code </p>
            <p>{detailData.epToCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>LOP Account No</p>
            <p>{detailData.lopAccountNo}</p>
          </div>
        </List.Item>

        <List.Item>
          <div className={styles.ListItem}>
            <p>Previous BI Code</p>
            <p>{detailData.previousBiCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Previous BI Name</p>
            <p>{detailData.previousBiName}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Previous TO Code</p>
            <p>{detailData.previousToCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Previous TO Name</p>
            <p>{detailData.previousToName}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Report History</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.reportHistory}>
            <Table
              bordered
              dataSource={detailData.reportHistory}
              rowKey="reportHistory"
              pagination={false}
            >
              <Column
                align="center"
                dataIndex="reportedTime"
                title="Reported Time"
                render={(text, record) =>
                  record.reportedTime && moment(record.reportedTime).format(timestampFormat)
                }
              />
              <Column
                align="center"
                dataIndex="reportedAccountName"
                title="Reported Account Name"
              />
              <Column align="center" dataIndex="reportedBiName" title="Reported BI Name" />
              <Column align="center" dataIndex="reportedToName" title="Reported TO Name" />
            </Table>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Received Answer</p>
            <p>{detailData.receivedAnswer}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Answer History</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.reportHistory}>
            <Table
              bordered
              dataSource={detailData.answerHistory}
              rowKey="answerHistory"
              pagination={false}
            >
              <Column
                align="center"
                dataIndex="answeredTime"
                title="Answered Time"
                render={(text, record) =>
                  record.answeredTime && moment(record.answeredTime).format(timestampFormat)
                }
              />
              <Column align="center" dataIndex="answeredFullBiName" title="Answered Full BI Name" />
              <Column align="center" dataIndex="answeredCategory" title="Answered Category" />
              <Column align="center" dataIndex="matchedBiCode" title="Matched BI Code" />
              <Column align="center" dataIndex="matchedOmnCode" title="Matched OMN Code" />
              <Column align="center" dataIndex="answeredFullToName" title="Answered Full TO Name" />
              <Column align="center" dataIndex="matchedTo" title="Matched TO" />
            </Table>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem} style={{ marginTop: '10px' }}>
            <div className={styles.formBox}>
              <Form.Item label="Confirmed BI">
                {getFieldDecorator('confirmBiCode', {
                  rules: [{ required: !!isShowForm, message: 'Confirmed BI is missing' }],
                  initialValue: detailData.confirmBiCode,
                })(
                  isShowForm ? (
                    <Select
                      onChange={(value, name) => onChangeConfirmedBiValue(value, name)}
                      optionLabelProp="value"
                      allowClear
                    >
                      {detailData.biCategoryList.map(item => (
                        <Option
                          value={item.confirmBiCode}
                          label={item.confirmBiName}
                          key={item.confirmBiCategory}
                        >
                          <span
                            title={item.confirmBiCode}
                            style={{
                              float: 'left',
                              width: '50%',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.confirmBiCode}
                          </span>
                          <span
                            title={item.confirmBiName}
                            style={{
                              float: 'right',
                              width: '50%',
                              textAlign: 'right',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.confirmBiName}
                          </span>
                        </Option>
                      ))}
                    </Select>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div className={styles.confirmBiToBox}>
              <Form.Item label="">
                {getFieldDecorator('confirmBiName', {
                  rules: [{ required: !!isShowForm, message: 'Confirmed BI is missing' }],
                  initialValue: detailData.confirmBiName,
                })(<Input disabled={!isShowForm} />)}
              </Form.Item>
            </div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Confirmed TO">
                {getFieldDecorator('confirmToCode', {
                  rules: [{ required: !!isShowForm, message: 'Confirmed TO is missing' }],
                  initialValue: detailData.confirmToCode,
                })(
                  isShowForm ? (
                    <Select
                      onChange={(value, name) => onChangeConfirmedToValue(value, name)}
                      optionLabelProp="value"
                      allowClear
                    >
                      {detailData.toCategoryList &&
                        detailData.toCategoryList.map(item => (
                          <Option
                            value={item.confirmToCode}
                            label={item.confirmToName}
                            key={item.confirmToCategory}
                          >
                            <span
                              title={item.confirmToCode}
                              style={{
                                float: 'left',
                                width: '50%',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.confirmToCode}
                            </span>
                            <span
                              title={item.confirmToName}
                              style={{
                                float: 'right',
                                width: '50%',
                                textAlign: 'right',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.confirmToName}
                            </span>
                          </Option>
                        ))}
                    </Select>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
            <div className={styles.confirmBiToBox}>
              <Form.Item label="">
                {getFieldDecorator('confirmToName', {
                  rules: [{ required: !!isShowForm, message: 'Confirmed TO is missing' }],
                  initialValue: detailData.confirmToName,
                })(<Input disabled={!isShowForm} />)}
              </Form.Item>
            </div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Report Any Position">
                {getFieldDecorator('reportAnyPosition', {
                  rules: [{ required: !!isShowForm, message: 'Report Any Position is missing' }],
                  initialValue: detailData.reportAnyPosition,
                })(
                  isShowForm ? (
                    <Radio.Group>
                      <Radio style={{ display: 'inline' }} value="Yes">
                        yes
                      </Radio>
                      <Radio style={{ display: 'inline' }} value="No">
                        no
                      </Radio>
                    </Radio.Group>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Watch">
                {getFieldDecorator('watch', {
                  rules: [{ required: !!isShowForm, message: 'Watch is missing' }],
                  initialValue: detailData.watch,
                })(
                  isShowForm ? (
                    <Radio.Group>
                      <Radio style={{ display: 'inline' }} value="Yes">
                        yes
                      </Radio>
                      <Radio style={{ display: 'inline' }} value="No">
                        no
                      </Radio>
                    </Radio.Group>
                  ) : (
                    <Input disabled />
                  ),
                )}
              </Form.Item>
            </div>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <div className={styles.formBox}>
              <Form.Item label="Remark">
                {getFieldDecorator('remark', {
                  rules: [{ required: !!isShowForm, message: 'remark is missing' }],
                  initialValue: detailData.remark,
                })(<TextArea disabled={!isShowForm} autoSize={{ minRows: 2 }} />)}
              </Form.Item>
            </div>
          </div>
        </List.Item>
      </List>
    </div>
  );
}

/*
 * @detailItem:任务详情data
 * @task:当前列表选中的内容
 * @form:表单控件
 * @saveConfirmToCategory:保存confirmToCategory值
 * @saveConfirmBiCategory:保存confirmBiCategory值
 */
function DetailForm({ form, task, detailItem, saveConfirmToCategory, saveConfirmBiCategory }) {
  const { getFieldDecorator } = form;
  const [radioCurrentValue, setRadioCurrentValue] = useState('No');
  const [radioPdValue, setRadioPdValue] = useState('Yes');
  // const task = true;
  // const detailItem = [
  //   {
  //     newValue: {
  //       previousBiCode: 'UNC_00345',
  //       confirmToCode: null,
  //       previousBiName: 'BPSS OMNIBUS ACC HKCC',
  //       previousToName: null,
  //       lopAccountNo: 'Z_BPSS SG',
  //       previousToCode: null,
  //       toCategoryList: [
  //         {
  //           confirmToCode: 'NULL8',
  //           confirmToName: 'NULL',
  //           confirmToCategory: '888',
  //         },
  //         {
  //           confirmToCode: 'jay',
  //           confirmToName: 'kebi',
  //           confirmToCategory: '999',
  //         },
  //       ],
  //       answerHistory: [],
  //       reportHistory: [
  //         {
  //           reportedTime: 1578143715844,
  //           reportedAccountName: 'BPSS OMNIBUS ACC HKCC',
  //           reportedBiName: 'BPSS OMNIBUS ACC HKCC',
  //           reportedToName: null,
  //         },
  //       ],
  //       market: 'HKFE',
  //       confirmBiCode: null,
  //       epToCode: 'BNP',
  //       confirmBiName: null,
  //       confirmToName: null,
  //       biCategoryList: [
  //         {
  //           confirmBiCode: 'kaxi',
  //           confirmBiName: 'ouwen',
  //           confirmBiCategory: '111',
  //         },
  //         {
  //           confirmBiCode: 'kd',
  //           confirmBiName: 'james',
  //           confirmBiCategory: '333',
  //         },
  //       ],
  //       submitterName: 'BNP Paribas Securities (Asia) Ltd',
  //       submitterCode: '00BNP',
  //       receivedAnswer: 'Unreceived Yet',
  //     },
  //     alertType: '322',
  //     isEditing: true,
  //     isStarter: false,
  //     oldValue: {},
  //     ownerId: null,
  //   },
  // ];
  const detailData = task ? (detailItem && detailItem[0]) || {} : {};
  const detailList = task ? (detailItem && detailItem[0] && detailItem[0].newValue) || {} : {};
  const oldValueList = task ? (detailItem && detailItem[0] && detailItem[0].oldValue) || {} : {};
  const alertType = detailData && detailData.alertType;

  // const isShowForm = detailData && detailData.isStarter;
  const isEditing = detailData && detailData.isEditing;
  // const isEditing = true;
  // console.log('alertType---->', alertType, detailList, isShowForm);
  // console.log('detailList----->', detailList);
  useEffect(() => {
    setRadioCurrentValue(detailList.isCaCode);
  }, [detailList.isCaCode]);
  useEffect(() => {
    setRadioPdValue(detailList.isCalculatePd);
  }, [detailList.isCalculatePd]);

  function onChangeConfirmedToValue(value, name) {
    if (name) {
      form.setFieldsValue({
        confirmToName: name.props.label,
      });
      saveConfirmToCategory(name.key);
    }
  }
  function onChangeConfirmedBiValue(value, name) {
    if (name) {
      form.setFieldsValue({
        confirmBiName: name.props.label,
      });
      saveConfirmBiCategory(name.key);
    }
  }

  return (
    <>
      {detailList && (
        <Form>
          {alertType === '301' && (
            <NewEP
              detailData={detailList}
              oldValueList={oldValueList}
              getFieldDecorator={getFieldDecorator}
              isShowForm={isEditing}
            />
          )}
          {alertType === '302' &&
            (radioCurrentValue === 'No' ? (
              <NewProduct
                detailData={detailList}
                oldValueList={oldValueList}
                getFieldDecorator={getFieldDecorator}
                setRadioCurrentValue={setRadioCurrentValue}
                radioPdValue={radioPdValue}
                setRadioPdValue={setRadioPdValue}
                isShowForm={isEditing}
              />
            ) : (
              <CaCode
                detailData={detailList}
                oldValueList={oldValueList}
                getFieldDecorator={getFieldDecorator}
                setRadioCurrentValue={setRadioCurrentValue}
                isShowForm={isEditing}
              />
            ))}
          {alertType === '303' &&
            (radioCurrentValue === 'Yes' ? (
              <CaCode
                detailData={detailList}
                oldValueList={oldValueList}
                getFieldDecorator={getFieldDecorator}
                setRadioCurrentValue={setRadioCurrentValue}
                isShowForm={isEditing}
              />
            ) : (
              <NewProduct
                detailData={detailList}
                oldValueList={oldValueList}
                getFieldDecorator={getFieldDecorator}
                setRadioCurrentValue={setRadioCurrentValue}
                radioPdValue={radioPdValue}
                setRadioPdValue={setRadioPdValue}
                isShowForm={isEditing}
              />
            ))}
          {alertType === '321' ||
          alertType === '322' ||
          alertType === '323' ||
          alertType === '324' ? (
            <NewAccound
              detailData={detailList}
              getFieldDecorator={getFieldDecorator}
              onChangeConfirmedToValue={onChangeConfirmedToValue}
              onChangeConfirmedBiValue={onChangeConfirmedBiValue}
              isShowForm={isEditing}
            />
          ) : null}
          {/* <NewAccound
            detailData={detailList}
            getFieldDecorator={getFieldDecorator}
            isShowForm={isEditing}
          /> */}
        </Form>
      )}
    </>
  );
}

export default Form.create()(DetailForm);
