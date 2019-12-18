import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Form, DatePicker, Button, Checkbox, Select, Row, Col } from 'antd';
import { yesterday, today, dateFormat } from '../constants';
import styles from '../index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

function MarketLogFilterForm({ form, handleSearch }) {
  const { getFieldDecorator, validateFields } = form;

  function handleClick() {
    validateFields((err, values) => {
      if (!err) {
        const format = 'YYYYMMDD';
        const { tradeDate, market, ...rest } = values;

        let startTradeDate = '';
        let endTadeDate = '';

        if (tradeDate) {
          const [start, end] = tradeDate;
          startTradeDate = start && start.format(format);
          endTadeDate = end && end.format(format);
        }

        handleSearch({
          ...rest,
          market: market.toString(),
          tradeDateSt: startTradeDate,
          tradeDateEt: endTadeDate,
        });
      }
    });
  }
  return (
    <Form layout="vertical" className={styles.form}>
      <Row>
        <Col span={7}>
          <Form.Item label={<FormattedMessage id="data-import.market.trade-date" />}>
            {getFieldDecorator('tradeDate', {
              initialValue: [yesterday, today],
              rules: [
                {
                  required: false,
                  message: 'Please select trade date!',
                },
              ],
            })(<RangePicker format={dateFormat} />)}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item label={<FormattedMessage id="data-import.market.file-type" />}>
            {getFieldDecorator('fileType', {
              rules: [
                {
                  required: false,
                  message: 'Please select file type!',
                },
              ],
            })(
              <Select placeholder="please select file type" allowClear>
                <Option value="TP001">TP001</Option>
                <Option value="GREK020">GREK020</Option>
                <Option value="OMD">OMD</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={8} offset={1}>
          <Form.Item label={<FormattedMessage id="data-import.market.market" />}>
            {getFieldDecorator('market')(<Checkbox.Group options={['HKFE', 'SEHK']} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" justify="end">
        <Button type="primary" icon="search" onClick={handleClick} className={styles['no-margin']}>
          <FormattedMessage id="data-import.market.search" />
        </Button>
      </Row>
    </Form>
  );
}

export default Form.create()(MarketLogFilterForm);
