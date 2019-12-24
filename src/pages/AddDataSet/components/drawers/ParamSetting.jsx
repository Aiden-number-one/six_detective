import React, { PureComponent } from 'react';
import { Drawer, Row, Col, Input, Select, Icon, Button } from 'antd';
import styles from '../../AddDataSet.less';

const { Option } = Select;

const conditionData = [{}, {}, {}, {}];

export default class ParamSetting extends PureComponent {
  state = {};

  render() {
    const { visible, toggleModal } = this.props;
    return (
      <Drawer
        visible={visible}
        title="Params Setting"
        onClose={() => {
          toggleModal('paramSetting');
        }}
        width={600}
        className={styles.paramsDrawer}
      >
        <Button type="primary">
          <Icon type="download" />
          快速提取
        </Button>
        <ul style={{ padding: 0, marginTop: 10 }}>
          <li>
            <Row style={{ lineHeigh: '50px' }}>
              <Col span={12}>变量名</Col>
              <Col span={12}>变量类型</Col>
            </Row>
          </li>
          {conditionData.map(() => (
            <li>
              <Row style={{ lineHeigh: '50px' }}>
                <Col span={12}>
                  <Input disabled style={{ width: '90%' }} />
                </Col>
                <Col span={12}>
                  <Select defaultValue="lucy" style={{ width: '90%' }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </Col>
              </Row>
            </li>
          ))}
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button
              onClick={() => {
                toggleModal('paramSetting');
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </div>
        </ul>
      </Drawer>
    );
  }
}
