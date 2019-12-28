import React, { useState, useEffect } from 'react';
import { Input, Form, Radio, Select } from 'antd';
import moment from 'moment';

// import styles from '../index.less';

const { TextArea } = Input;
const { Option } = Select;

function NewEP({ detailData, getFieldDecorator, isShowForm }) {
  return (
    <>
      <Form.Item label="Market" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('market', {
          initialValue: detailData.market,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="EP Code" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('epCode', {
          initialValue: detailData.epCode,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="EP Name" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('epName', {
          rules: [{ required: !!isShowForm, message: 'Please input epName!' }],
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
      <Form.Item label="Market" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('market', {
          initialValue: detailData.market,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="HKEX DCASS Code" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('HKEX DCASS Code', {
          initialValue: detailData.hkexDcassCode,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Is CA Code ?" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
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
      <Form.Item label="Product code" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('Product code', {
          initialValue: detailData.productCode,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Product Description" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('productDesc', {
          rules: [{ required: !!isShowForm, message: 'Please input Product Description!' }],
          initialValue: detailData.productDesc,
        })(<Input disabled={!isShowForm} />)}
      </Form.Item>
      <Form.Item label="Product Category" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('productCategory', {
          rules: [{ required: !!isShowForm, message: 'Please select your Product Category!' }],
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
      <Form.Item label="Futures or Option" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
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
      <Form.Item label="Product Group" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
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
      <Form.Item
        label="Template Code(Last Trade Day)"
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 12 }}
      >
        {getFieldDecorator('ltdTmplCode', {
          rules: [
            { required: !!isShowForm, message: 'Please select Template Code(Last Trade Day)' },
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
      <Form.Item
        label="Template Code(Position Limit)"
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 12 }}
      >
        {getFieldDecorator('plTmplCode', {
          rules: [
            { required: !!isShowForm, message: 'Please select Template Code(Position Limit)!' },
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
      <Form.Item
        label="Template Code(Reportable Limit)"
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 12 }}
      >
        {getFieldDecorator('rlTmplCode', {
          rules: [
            { required: !!isShowForm, message: 'Please select Template Code(Reportable Limit)!' },
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
      <Form.Item label="Is Calculate PD ?" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('isCalculatePd', {
          rules: [{ required: !!isShowForm }],
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
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('sizeFactor', {
              rules: [
                { required: !!isShowForm, message: 'Please input Size Factor for Calculate PD!' },
              ],
              initialValue: detailData.sizeFactor,
            })(<Input type="number" disabled={!isShowForm} />)}
          </Form.Item>
          <Form.Item
            label="Weighting Factor for Calculate PD"
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 12 }}
          >
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
        </>
      ) : null}
    </>
  );
}
function CaCode({ detailData, getFieldDecorator, setRadioCurrentValue, isShowForm }) {
  return (
    <>
      <Form.Item label="Market" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('market', {
          initialValue: detailData.market,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="HKEX DCASS Code" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('hkexDcassCode', {
          initialValue: detailData.hkexDcassCode,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Is CA Code ?" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
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
      <Form.Item label="Original Product code" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('originalProductCode', {
          initialValue: detailData.originalProductCode,
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Effective Date" labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('effectiveDate', {
          initialValue:
            detailData.effectiveDate &&
            moment(detailData.effectiveDate).format('DD-MMM-YYYY HH:mm:ss'),
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Expiry Date " labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('expiryDate', {
          initialValue:
            detailData.expiryDate && moment(detailData.expiryDate).format('DD-MMM-YYYY HH:mm:ss'),
        })(<Input disabled />)}
      </Form.Item>
      <Form.Item label="Remark " labelCol={{ span: 9 }} wrapperCol={{ span: 12 }}>
        {getFieldDecorator('remark', {
          rules: [{ required: !!isShowForm, message: 'Please input Remark!' }],
          initialValue: detailData.remark,
        })(isShowForm ? <TextArea /> : <Input disabled />)}
      </Form.Item>
    </>
  );
}

// function kk({detailData}) {
//   return (
//     <div className={styles.ListBox}>
//       <List
//         header={
//           detailData && (
//             <List.Item>
//               <div className={styles.ListItem}>
//                 <p></p>
//                 <p>New INFO</p>
//                 <p>Old INFO</p>
//               </div>
//             </List.Item>
//           )
//         }
//         bordered
//         dataSource={detailData}
//         renderItem={item => (
//           <List.Item>
//             <div className={styles.ListItem}>
//               <p>{item.key}</p>
//               <p>{item.newValue}</p>
//               <p>{item.oldValue}</p>
//             </div>
//           </List.Item>
//         )}
//       />
//     </div>
//   );
// }

function DetailForm({ form, detailItem, task }) {
  const { getFieldDecorator } = form;
  const [radioCurrentValue, setRadioCurrentValue] = useState('No');
  const [radioPdValue, setRadioPdValue] = useState('Yes');
  const detailList = task ? (detailItem && detailItem[0]) || {} : {};
  const alertType = detailList && detailList.alertType;

  const isShowForm = detailList && detailList.isStarter;
  const isEditing = detailList && detailList.isEditing;
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
              getFieldDecorator={getFieldDecorator}
              isShowForm={isEditing}
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
                isShowForm={isEditing}
              />
            ) : (
              <CaCode
                detailData={detailList}
                getFieldDecorator={getFieldDecorator}
                setRadioCurrentValue={setRadioCurrentValue}
                isShowForm={isEditing}
              />
            ))}
          {alertType === '303' &&
            (radioCurrentValue === 'Yes' ? (
              <CaCode
                detailData={detailList}
                getFieldDecorator={getFieldDecorator}
                setRadioCurrentValue={setRadioCurrentValue}
                isShowForm={isEditing}
              />
            ) : (
              <NewProduct
                detailData={detailList}
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
