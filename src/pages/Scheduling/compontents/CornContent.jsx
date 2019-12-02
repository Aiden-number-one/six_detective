import React, { PureComponent } from 'react';
import { Tabs, Radio, InputNumber, Checkbox, Row, Col } from 'antd';

const { TabPane } = Tabs;
// const { Group } = Radio;

export default class CornContent extends PureComponent {
  componentDidMount() {
    //
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '50px',
      lineHeight: '50px',
    };
    return (
      <>
        <Tabs>
          {/* 秒 */}
          <TabPane tab="秒" key="0">
            <Radio.Group onChange={this.onChange}>
              <Radio style={radioStyle} value={1}>
                每秒 允许的通配符[, - * /]
              </Radio>
              <Radio style={radioStyle} value={2}>
                周期从&nbsp;
                <InputNumber />
                &nbsp;-&nbsp;
                <InputNumber />
                &nbsp;秒
              </Radio>
              <Radio style={radioStyle} value={3}>
                从&nbsp;
                <InputNumber />
                &nbsp; 秒开始，每&nbsp;
                <InputNumber />
                &nbsp; 秒执行一次&nbsp;
              </Radio>
              <Radio style={radioStyle} value={4}>
                指定
              </Radio>
            </Radio.Group>
            <DateCheckBox amount={60} />
          </TabPane>
          {/* 分钟 */}
          <TabPane tab="分钟" key="1">
            <Radio.Group onChange={this.onChange}>
              <Radio style={radioStyle} value={1}>
                每分钟 允许的通配符[, - * /]
              </Radio>
              <Radio style={radioStyle} value={2}>
                周期从&nbsp;
                <InputNumber />
                &nbsp;-&nbsp;
                <InputNumber />
                &nbsp;分
              </Radio>
              <Radio style={radioStyle} value={3}>
                从&nbsp;
                <InputNumber />
                &nbsp; 分开始，每&nbsp;
                <InputNumber />
                &nbsp; 分执行一次&nbsp;
              </Radio>
              <Radio style={radioStyle} value={4}>
                指定
              </Radio>
            </Radio.Group>
            <DateCheckBox amount={60} />
          </TabPane>
          <TabPane tab="小时" key="2">
            <Radio.Group onChange={this.onChange}>
              <Radio style={radioStyle} value={1}>
                每小时 允许的通配符[, - * /]
              </Radio>
              <Radio style={radioStyle} value={2}>
                周期从&nbsp;
                <InputNumber />
                &nbsp;-&nbsp;
                <InputNumber />
                &nbsp;小时
              </Radio>
              <Radio style={radioStyle} value={3}>
                从&nbsp;
                <InputNumber />
                &nbsp; 小时开始，每&nbsp;
                <InputNumber />
                &nbsp; 小时执行一次&nbsp;
              </Radio>
              <Radio style={radioStyle} value={4}>
                指定
              </Radio>
            </Radio.Group>
            <DateCheckBox amount={24} />
          </TabPane>
          <TabPane tab="日" key="3">
            <Radio.Group onChange={this.onChange}>
              <Radio style={radioStyle} value={1}>
                每日 允许的通配符[, - * /]
              </Radio>
              <Radio style={radioStyle} value={2}>
                周期从&nbsp;
                <InputNumber />
                &nbsp;-&nbsp;
                <InputNumber />
                &nbsp;日
              </Radio>
              <Radio style={radioStyle} value={3}>
                从&nbsp;
                <InputNumber />
                &nbsp; 日开始，每&nbsp;
                <InputNumber />
                &nbsp; 日执行一次&nbsp;
              </Radio>
              <Radio style={radioStyle} value={4}>
                每月&nbsp;
                <InputNumber />
                &nbsp; 号最近的那个工作日
              </Radio>
              <Radio style={radioStyle} value={5}>
                指定
              </Radio>
            </Radio.Group>
            <DateCheckBox amount={24} />
          </TabPane>
          <TabPane tab="月" key="4">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="周" key="5">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="年" key="6">
            Content of Tab Pane 1
          </TabPane>
        </Tabs>
      </>
    );
  }
}

function DateCheckBox(props) {
  const { amount } = props;
  const data = new Array(amount).fill({});
  return (
    <Checkbox.Group style={{ width: '100%' }}>
      <Row>
        {data.map((value, index) => (
          <Col span={4}>
            <Checkbox value={index}>{index}</Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  );
}
