import React, { PureComponent, Fragment } from 'react';
import { Button, Select, Dropdown } from 'antd';
import { SketchPicker } from 'react-color';
import SpreadSheet from '@/components/SpreadSheet';

const { Option } = Select;
const fontFamily = [
  { fontFamily: 'Arial' },
  { fontFamily: '宋体' },
  { fontFamily: '楷体' },
  { fontFamily: '仿宋' },
  { fontFamily: '微软雅黑' },
];
const fontSize = [
  { fontSize: '8' },
  { fontSize: '9' },
  { fontSize: '10' },
  { fontSize: '11' },
  { fontSize: '12' },
  { fontSize: '14' },
  { fontSize: '15' },
  { fontSize: '16' },
  { fontSize: '18' },
  { fontSize: '24' },
  { fontSize: '36' },
  { fontSize: '48' },
];

export default class Sheet extends PureComponent {
  state = {
    fontColor: '#000',
    bgColor: '#fff',
  };

  spreadSheetRef = React.createRef();

  componentDidMount() {}

  setCellStyle = (property, value) => {
    this.spreadSheetRef.current.setCellStyle(property, value);
  };

  render() {
    const { setCellStyle } = this;
    const { fontColor, bgColor } = this.state;
    return (
      <Fragment>
        <Button
          onClick={() => {
            setCellStyle('font-bold', true);
          }}
        >
          加粗
        </Button>

        <Button
          onClick={() => {
            setCellStyle('font-italic', true);
          }}
        >
          斜体
        </Button>

        <Select
          placeholder="请选择"
          onChange={value => {
            setCellStyle('font-name', value);
          }}
          style={{ width: 100 }}
        >
          {fontFamily.map(item => (
            <Option key={item.fontFamily} value={item.fontFamily}>
              {item.fontFamily}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="请选择"
          onChange={value => {
            setCellStyle('font-size', value);
          }}
          style={{ width: 100 }}
        >
          {fontSize.map(item => (
            <Option key={item.fontSize} value={item.fontSize}>
              {item.fontSize}
            </Option>
          ))}
        </Select>

        <Button
          onClick={() => {
            setCellStyle('underline', true);
          }}
        >
          下划线
        </Button>

        <Button
          onClick={() => {
            setCellStyle('strike', true);
          }}
        >
          删除线
        </Button>

        <Dropdown
          trigger={['click']}
          overlay={
            <SketchPicker
              color={fontColor}
              onChange={value => {
                this.setState({
                  fontColor: value.hex,
                });
                setCellStyle('color', value.hex);
              }}
            />
          }
          placement="bottomLeft"
        >
          <Button style={{ color: fontColor }}>字体颜色</Button>
        </Dropdown>

        <Dropdown
          trigger={['click']}
          overlay={
            <SketchPicker
              color={bgColor}
              onChange={value => {
                this.setState({
                  bgColor: value.hex,
                });
                setCellStyle('bgcolor', value.hex);
              }}
            />
          }
          placement="bottomLeft"
        >
          <Button style={{ backgroundColor: bgColor }}>填充颜色</Button>
        </Dropdown>

        <SpreadSheet ref={this.spreadSheetRef} />
      </Fragment>
    );
  }
}
