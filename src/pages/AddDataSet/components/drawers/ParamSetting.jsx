import React, { PureComponent } from 'react';
import { Drawer, Row, Col, Input, Select, Icon } from 'antd';

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
        width={800}
      >
        <ul>
          {conditionData.map(() => (
            <li>
              <Row>
                <Col span={10}>
                  <Input disabled />
                </Col>
                <Col span={7}>
                  <Select defaultValue="lucy" style={{ width: 130 }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </Col>
                <Col span={7}>
                  <Icon
                    style={{
                      paddingLeft: 6,
                    }}
                    type="delete"
                  />
                </Col>
              </Row>
            </li>
          ))}
          {/* <Button type="primary" ghost icon="plus" style={{ marginLeft: 8, marginTop: 8 }}>
            新建数据集
          </Button> */}
        </ul>
      </Drawer>
    );
  }
}
