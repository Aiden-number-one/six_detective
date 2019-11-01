/*
 * @Description: 表单控件
 * @Author: lan
 * @Date: 2019-10-25 13:42:35
 * @LastEditTime: 2019-11-01 15:44:52
 * @LastEditors: lan
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Form,
  Button,
  Input,
  Checkbox,
  Select,
  DatePicker,
  Row,
  Col,
  Radio,
  Collapse,
  Icon,
  Typography,
} from 'antd';
import styles from './FormItem.less';

const { Panel } = Collapse;
const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    md: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    md: { span: 14 },
  },
};

@Form.create()
export default class FormItem extends Component {
  state = {};

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <PageHeaderWrapper>
        <div className={styles.buttonGroup}>
          <Button>CANCEL</Button>
          <Button type="primary">SAVE</Button>
        </div>
        <Form className={['form-item']} {...formItemLayout}>
          <Title className={styles.mainTitle}>
            Transaction Originator Section Lop Input Form 2
          </Title>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="Trade Data" required>
                {getFieldDecorator('tradeData', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<DatePicker style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="EP Code">
                {getFieldDecorator('epCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Submitter Code">
                {getFieldDecorator('submitterCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Submitter Name">
                {getFieldDecorator('submitterName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="TO Code">
                {getFieldDecorator('toCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="TO Name">
                {getFieldDecorator('toName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="LOP A/C NO.">
                {getFieldDecorator('phoneNO', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="A/C Name">
                {getFieldDecorator('acName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Reported BI Name" labelCol={{ md: 5 }}>
                {getFieldDecorator('RBIName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Reported TO Name" labelCol={{ md: 5 }}>
                {getFieldDecorator('RTOName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Type of Account" labelCol={{ md: 5 }}>
                {getFieldDecorator('accountType', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: 'house',
                })(
                  <Radio.Group>
                    <Radio value="house">House</Radio>
                    <Radio value="client">Cilent</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Nature of Account" labelCol={{ md: 5 }}>
                {getFieldDecorator('accountNature', {
                  rules: [{ required: false }],
                  initialValue: undefined,
                })(
                  <Checkbox.Group>
                    <Checkbox onChange={() => {}} value="Hedge">
                      Hedge
                    </Checkbox>
                    <Checkbox onChange={() => {}} value="Trading">
                      Trading
                    </Checkbox>
                    <Checkbox onChange={() => {}} value="Arbitrage">
                      Arbitrage
                    </Checkbox>
                  </Checkbox.Group>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Title level={2}>Option Series</Title>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="Option Class*">
                {getFieldDecorator('optionClass*', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="Stike">
                {getFieldDecorator('Stike', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Optiom Type" labelCol={{ md: 5 }}>
                {getFieldDecorator('accountType', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: 'call',
                })(
                  <Radio.Group>
                    <Radio value="call">Call</Radio>
                    <Radio value="put">Put</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Title>BI/Omni Section Lop Input Form 2</Title>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="Trade Date">
                {getFieldDecorator('tradeDate', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="Submitter Code">
                {getFieldDecorator('submitterCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="submitter Name" labelCol={{ md: 5 }}>
                {getFieldDecorator('submitterCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="EP Code">
                {getFieldDecorator('epCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="EP Name">
                {getFieldDecorator('epName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Collapse
          className="normalCollapse"
          defaultActiveKey={['1', '2', '3']}
          expandIconPosition="right"
          expandIcon={panelProps => <Icon type={panelProps.isActive ? 'minus' : 'plus'} />}
        >
          <Panel header="PARTICIPANT INFOMATION" key="1">
            <Row type="flex" justify="start">
              <Col className={styles.informationKey}>Participant Name</Col>
              <Col>ABC Inc.</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className={styles.informationKey}>Participant ID</Col>
              <Col>C00999</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className={styles.informationKey}>Clearin g House</Col>
              <Col>HKSCC</Col>
            </Row>
          </Panel>
          <Panel header="STOCK INFOMATION" key="2">
            <Row type="flex" justify="start">
              <Col className={styles.informationKey}>Stock Name</Col>
              <Col>ABC Inc.</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className={styles.informationKey}>Stock Code</Col>
              <Col>C00999</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className={styles.informationKey}>Certificate Dispatch Date</Col>
              <Col>######</Col>
            </Row>
          </Panel>
          <Panel header="CONTACT INFOMATION" key="3">
            <Row type="flex" justify="start">
              <Col className={styles.informationKey}>Name of Contact Person</Col>
              <Col>John Applebee</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className={styles.informationKey}>Position</Col>
              <Col>Vice President</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className={styles.informationKey}>Email Address</Col>
              <Col>john.applebee@abc.com.hk</Col>
            </Row>
            <Row type="flex" justify="start">
              <Col className={styles.informationKey}>Email Address</Col>
              <Col>john.applebee@abc.com.hk</Col>
            </Row>
          </Panel>
        </Collapse>
        <Collapse
          defaultActiveKey={['1', '3']}
          expandIconPosition="right"
          expandIcon={panelProps => <Icon type={panelProps.isActive ? 'minus' : 'plus'} />}
        >
          <Panel header="How did HKEX develop into its existing framework?" key="1">
            <p>
              Exchange Ltd (HKFE) and the Hong Kong Securities Clearing Co Ltd (HKSCC) merged on 6
              March 2000 into a single controlling company known as Hong Kong Exchanges and Clearing
              Limited (HKEX). HKEX listed on SEHK on 27 June 2000. In December 2012, HKEX acquired
              the London Metal Exchange (LME), the worlds premier metal exchange.In May 2012, OTC
              Clearing Hong Kong Limited (OTC Clear) was incorporated as the clearing house of
              clearing OTC Derivatives in Hong Kong.
            </p>
            <p>
              With SEHK, HKFE, HKSCC, LME and OTC Clear as subsidiaries, HKEX is composed of various
              business functions each led by the management and the board of directors. The board of
              directors, as the highest decision-making unit, lays down HKEXs objectives missions,
              strategies, policies and business plans, and oversees execution by the management.
            </p>
          </Panel>
          <Panel header="How did HKEX develop into its existing framework?" key="2">
            <p>
              Exchange Ltd (HKFE) and the Hong Kong Securities Clearing Co Ltd (HKSCC) merged on 6
              March 2000 into a single controlling company known as Hong Kong Exchanges and Clearing
              Limited (HKEX). HKEX listed on SEHK on 27 June 2000. In December 2012, HKEX acquired
              the London Metal Exchange (LME), the worlds premier metal exchange.In May 2012, OTC
              Clearing Hong Kong Limited (OTC Clear) was incorporated as the clearing house of
              clearing OTC Derivatives in Hong Kong.
            </p>
            <p>
              With SEHK, HKFE, HKSCC, LME and OTC Clear as subsidiaries, HKEX is composed of various
              business functions each led by the management and the board of directors. The board of
              directors, as the highest decision-making unit, lays down HKEXs objectives missions,
              strategies, policies and business plans, and oversees execution by the management.
            </p>
          </Panel>
          <Panel
            header="What are the procedures for a visit to the Exchante Exhibition Hall?"
            key="3"
          >
            <div className={styles.bgColor}>
              <div>
                We hereby request HKCAS to procure HKSCC to upon completion of debiting our stock
                account with CCASS, (i) confirm the debit entry of the Units/Shares and (ii) send a
                copy of the confirmation in respect of the debit entry [to the Registrar to arrange
                the immediate cancellation of the Units with the Registrar/to the Receiving Agent
                and the Manager/to the Registrar through the Hong Kong Transfer Agent/Hong Kong
                Administrative Agent with the Registrar to arrange the immediate transfer of the
                legal title in the Units/Shares
              </div>
              <div>
                In consideration of HKCAS and HKSCC agreeing to the above, we hereby agree to
                indemnify HKCAS and HKSCC, their respective holding companies, subsidiaries,
                associate companies and/or affiliate companies and to hold each of them harmless
                against all actions, claims, proceedings, damages, costs and expenses (including
                legal costs on a full indemnity basis) which may be brought against any of the
                aforesaid companies or suffered or incurred by any of them as a result of or in
                connection with the above debiting of the Units/Shares.
              </div>
              <div>
                <Checkbox onChange={() => {}} value="Hedge">
                  We Confirm that We Understand the above terms and conditions
                </Checkbox>
              </div>
            </div>
          </Panel>
        </Collapse>
      </PageHeaderWrapper>
    );
  }
}
