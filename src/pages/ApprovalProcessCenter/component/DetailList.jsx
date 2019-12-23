import React, { useState, useEffect } from 'react';
import { Input, Form, Radio, Select } from 'antd';

// import styles from '../index.less';

const { TextArea } = Input;
const { Option } = Select;

function NewEP({ detailData, getFieldDecorator, isShowForm }) {
  return (
    <>
      <Form.Item label="Market" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('market', {
          initialValue: detailData.market,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="EP Code" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('epCode', {
          initialValue: detailData.epCode,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="EP Name" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('epName', {
          initialValue: detailData.epName,
        })(<Input disabled={!isShowForm} />)}
      </Form.Item>
    </>
  );
}
function NewProduct({
  detailData,
  getFieldDecorator,
  setRadioCurrentValue,
  radioPdValue,
  setRadioPdValue,
  isShowForm,
}) {
  return (
    <>
      <Form.Item label="Market" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('market', {
          initialValue: detailData.market,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="HKEX DCASS Code" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('HKEX DCASS Code', {
          initialValue: detailData.originalProductCode,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Is CA Code ?" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('isCaCode', {
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
      <Form.Item label="Product code" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('Product code', {
          initialValue: detailData.productCode,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Product Description" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('productDesc', {
          initialValue: detailData.productDesc,
        })(<Input disabled={!isShowForm} />)}
      </Form.Item>
      <Form.Item label="Product Category" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('productCategory', {
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
      <Form.Item label="Futures or Option" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('contractNature', {
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
      <Form.Item label="Product Group" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('productGroup', {
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
      <Form.Item
        label="Template Code(Last Trade Day)"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
      >
        {getFieldDecorator('ltdTmplCode', {
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
      <Form.Item
        label="Template Code(Position Limit)"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
      >
        {getFieldDecorator('plTmplCode', {
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
      <Form.Item
        label="Template Code(Reportable Limit)"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
      >
        {getFieldDecorator('rlTmplCode', {
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
      <Form.Item label="Is Calculate PD ?" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('isCalculatePd', {
          initialValue: detailData.isCalculatePd,
        })(
          isShowForm ? (
            <Radio.Group onChange={e => setRadioPdValue(e.target.value)} disabled={!isShowForm}>
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
      {radioPdValue === 'Yes' ? (
        <>
          <Form.Item
            label="Size Factor for Calculate PD"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('sizeFactor', {
              initialValue: detailData.sizeFactor,
            })(<Input disabled={!isShowForm} />)}
          </Form.Item>
          <Form.Item
            label="Weighting Factor for Calculate PD"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('weightFactor', {
              initialValue: detailData.weightFactor,
            })(<Input disabled={!isShowForm} />)}
          </Form.Item>
        </>
      ) : null}
    </>
  );
}
function CaCode({ detailData, getFieldDecorator, setRadioCurrentValue, isShowForm }) {
  return (
    <>
      <Form.Item label="Market" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('market', {
          initialValue: detailData.market,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="HKEX DCASS Code" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('hkexDcassCode', {
          initialValue: detailData.hkexDcassCode,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Is CA Code ?" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('isCaCode', {
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
      <Form.Item label="Original Product code" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('originalProductCode', {
          initialValue: detailData.originalProductCode,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Effective Date" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('effectiveDate', {
          initialValue: detailData.effectiveDate,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Expiry Date " labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('expiryDate', {
          initialValue: detailData.expiryDate,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Remark " labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('remark', {
          initialValue: detailData.remark,
        })(isShowForm ? <TextArea /> : <Input disabled />)}
      </Form.Item>
    </>
  );
}
function DetailForm({ form, detailItem, task }) {
  const { getFieldDecorator } = form;
  const [radioCurrentValue, setRadioCurrentValue] = useState('No');
  const [radioPdValue, setRadioPdValue] = useState('Yes');
  const detailList = task ? (detailItem && detailItem[0]) || {} : {};
  //   const newProductList = task ? (detailItem.data && detailItem.data.newProduct) || [] : [];
  //   console.log('newProductList---->', newProductList);
  //   const caCodetList = task ? (detailItem.data && detailItem.data.caCode) || [] : [];
  const alertType = detailList && detailList.alertType;

  const isShowForm = detailList && detailList.isStarter;
  console.log('alertType---->', alertType, detailList, isShowForm);

  console.log('radioCurrentValue---->', radioCurrentValue);
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
              getFieldDecorator={getFieldDecorator}
              isShowForm={isShowForm}
            />
          )}
          {alertType === '302' &&
            (radioCurrentValue === 'No' ? (
              <NewProduct
                detailData={detailList}
                getFieldDecorator={getFieldDecorator}
                setRadioCurrentValue={setRadioCurrentValue}
                radioPdValue={radioPdValue}
                setRadioPdValue={setRadioPdValue}
                isShowForm={isShowForm}
              />
            ) : (
              <CaCode
                detailData={detailList}
                getFieldDecorator={getFieldDecorator}
                setRadioCurrentValue={setRadioCurrentValue}
                isShowForm={isShowForm}
              />
            ))}
          {alertType === '303' &&
            (radioCurrentValue === 'Yes' ? (
              <CaCode
                detailData={detailList}
                getFieldDecorator={getFieldDecorator}
                setRadioCurrentValue={setRadioCurrentValue}
                isShowForm={isShowForm}
              />
            ) : (
              <NewProduct
                detailData={detailList}
                getFieldDecorator={getFieldDecorator}
                setRadioCurrentValue={setRadioCurrentValue}
                radioPdValue={radioPdValue}
                setRadioPdValue={setRadioPdValue}
                isShowForm={isShowForm}
              />
            ))}
        </Form>
      )}
    </>
  );
}

export default Form.create()(DetailForm);
