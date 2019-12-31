import React, { useState, useEffect } from 'react';
import { Input, Form, Radio, Select, List } from 'antd';
import moment from 'moment';

import styles from '../index.less';

const { TextArea } = Input;
const { Option } = Select;

function NewEP({ detailData, oldValueList, isShowForm, getFieldDecorator }) {
  return (
    <div className={styles.ListBox}>
      <List key="NewEP">
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
            <p>EP Name</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('epName', {
                  rules: [{ required: !!isShowForm, message: 'Please input epName!' }],
                  initialValue: detailData.epName,
                })(<Input disabled={!isShowForm} />)}
              </Form.Item>
            </p>
            <p>{oldValueList.epName}</p>
          </div>
        </List.Item>
      </List>
    </div>
  );
}
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
      <List key="NewProduct">
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
            <p>Is CA Code ?</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
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
            </p>
            <p>{oldValueList.isCaCode}</p>
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
            <p>Product Description</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('productDesc', {
                  rules: [{ required: !!isShowForm, message: 'Please input Product Description!' }],
                  initialValue: detailData.productDesc,
                })(<Input disabled={!isShowForm} />)}
              </Form.Item>
            </p>
            <p>{oldValueList.productDesc}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Product Category</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('productCategory', {
                  rules: [
                    { required: !!isShowForm, message: 'Please select your Product Category!' },
                  ],
                  initialValue: detailData.productCategory,
                })(
                  isShowForm ? (
                    <Select>
                      {detailData.productCategoryInit.split(',').map(item => (
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
            </p>
            <p>{oldValueList.productCategory}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Futures or Option</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('contractNature', {
                  rules: [{ required: !!isShowForm, message: 'Please select Futures or Option!' }],
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
            </p>
            <p>{oldValueList.contractNature}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Product Group</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('productGroup', {
                  rules: [{ required: !!isShowForm, message: 'Please select Product Group!' }],
                  initialValue: detailData.productGroup,
                })(
                  isShowForm ? (
                    <Select>
                      {detailData.productGroupInit.split(',').map(item => (
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
            </p>
            <p>{oldValueList.productGroup}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Template Code(Last Trade Day)</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('ltdTmplCode', {
                  rules: [
                    {
                      required: !!isShowForm,
                      message: 'Please select Template Code(Last Trade Day)',
                    },
                  ],
                  initialValue: detailData.ltdTmplCode,
                })(
                  isShowForm ? (
                    <Select>
                      {detailData.ltdTmplCodeInit.split(',').map(item => (
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
            </p>
            <p>{oldValueList.ltdTmplCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Template Code(Position Limit)</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('plTmplCode', {
                  rules: [
                    {
                      required: !!isShowForm,
                      message: 'Please select Template Code(Position Limit)!',
                    },
                  ],
                  initialValue: detailData.plTmplCode,
                })(
                  isShowForm ? (
                    <Select>
                      {detailData.plTmplCodeInit.split(',').map(item => (
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
            </p>
            <p>{oldValueList.plTmplCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Template Code(Reportable Limit)</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('rlTmplCode', {
                  rules: [
                    {
                      required: !!isShowForm,
                      message: 'Please select Template Code(Reportable Limit)!',
                    },
                  ],
                  initialValue: detailData.rlTmplCode,
                })(
                  isShowForm ? (
                    <Select>
                      {detailData.rlTmplCodeInit.split(',').map(item => (
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
            </p>
            <p>{oldValueList.rlTmplCode}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Is Calculate PD ?</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
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
            </p>
            <p>{oldValueList.isCalculatePd}</p>
          </div>
        </List.Item>
        {radioPdValue === 'Yes' ? (
          <>
            <List.Item>
              <div className={styles.ListItem}>
                <p>Size Factor for Calculate PD</p>
                <p>
                  <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('sizeFactor', {
                      rules: [
                        {
                          required: !!isShowForm,
                          message: 'Please input Size Factor for Calculate PD!',
                        },
                      ],
                      initialValue: detailData.sizeFactor,
                    })(<Input type="number" disabled={!isShowForm} />)}
                  </Form.Item>
                </p>
                <p>{oldValueList.sizeFactor}</p>
              </div>
            </List.Item>
            <List.Item>
              <div className={styles.ListItem}>
                <p>Weighting Factor for Calculate PD</p>
                <p>
                  <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                    {getFieldDecorator('weightFactor', {
                      rules: [
                        {
                          required: !!isShowForm,
                          message: 'Please input Weighting Factor for Calculate PD!',
                        },
                      ],
                      initialValue: detailData.weightFactor,
                    })(<Input type="number" disabled={!isShowForm} />)}
                  </Form.Item>
                </p>
                <p>{oldValueList.weightFactor}</p>
              </div>
            </List.Item>
          </>
        ) : null}
      </List>
    </div>
  );
}
function CaCode({ detailData, oldValueList, getFieldDecorator, setRadioCurrentValue, isShowForm }) {
  return (
    <div className={styles.ListBox}>
      <List key="CaCode">
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
            <p>Is CA Code ?</p>
            <p>
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
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
            </p>
            <p>{oldValueList.isCaCode}</p>
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
            <p>Effective Date</p>
            <p>
              {detailData.effectiveDate &&
                moment(detailData.effectiveDate).format('DD-MMM-YYYY HH:mm:ss')}
            </p>
            <p>{oldValueList.effectiveDate}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Expiry Date</p>
            <p>
              {detailData.expiryDate &&
                moment(detailData.expiryDate).format('DD-MMM-YYYY HH:mm:ss')}
            </p>
            <p>{oldValueList.expiryDate}</p>
          </div>
        </List.Item>
        <List.Item>
          <div className={styles.ListItem}>
            <p>Remark</p>
            <p>
              {' '}
              <Form.Item label="" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('remark', {
                  rules: [{ required: !!isShowForm, message: 'Please input Remark!' }],
                  initialValue: detailData.remark,
                })(isShowForm ? <TextArea /> : <Input disabled />)}
              </Form.Item>
            </p>
            <p>{oldValueList.remark}</p>
          </div>
        </List.Item>
      </List>
    </div>
  );
}

function DetailForm({ form, detailItem, task }) {
  const { getFieldDecorator } = form;
  const [radioCurrentValue, setRadioCurrentValue] = useState('No');
  const [radioPdValue, setRadioPdValue] = useState('Yes');
  const detailData = task ? (detailItem && detailItem[0]) || {} : {};
  const detailList = task ? (detailItem && detailItem[0] && detailItem[0].newValue) || {} : {};
  const oldValueList = task ? (detailItem && detailItem[0] && detailItem[0].oldValue) || {} : {};
  const alertType = detailData && detailData.alertType;

  const isShowForm = detailData && detailData.isStarter;
  const isEditing = detailData && detailData.isEditing;
  console.log('alertType---->', alertType, detailList, isShowForm);
  useEffect(() => {
    setRadioCurrentValue(detailList.isCaCode);
  }, [detailList.isCaCode]);
  useEffect(() => {
    setRadioPdValue(detailList.isCalculatePd);
  }, [detailList.isCalculatePd]);
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
        </Form>
      )}
    </>
  );
}

export default Form.create()(DetailForm);
