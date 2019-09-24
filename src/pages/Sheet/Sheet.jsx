import React, { PureComponent, Fragment } from 'react';
import { Button, Select, Dropdown } from 'antd';
import { SketchPicker } from 'react-color';
import SpreadSheet from '@/components/SpreadSheet';
import styles from './Sheet.less';

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

@SpreadSheet.createSpreadSheet
class Sheet extends PureComponent {
  state = {
    cellStyle: {},
    fontColor: '#000',
    bgColor: '#fff',
  };

  spreadSheetRef = React.createRef();

  componentDidMount() {
    const { setCellCallback } = this.props;
    setCellCallback(cellStyle => {
      this.setState({
        cellStyle,
      });
    });
  }

  setCellStyle = (property, value) => {
    const { setCellStyle, getCellStyle } = this.props;
    const result = getCellStyle(property);
    if (result === value) {
      setCellStyle(property, false);
    } else {
      setCellStyle(property, value);
    }
  };

  render() {
    const { setCellStyle } = this;
    const { fontColor, bgColor, cellStyle } = this.state;
    return (
      <Fragment>
        <Button
          className={styles.marginRight5}
          onClick={() => {
            setCellStyle('font-bold', true);
          }}
        >
          加粗
        </Button>

        <Button
          className={styles.marginRight5}
          onClick={() => {
            setCellStyle('font-italic', true);
          }}
        >
          斜体
        </Button>

        <Select
          className={styles.marginRight5}
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
          className={styles.marginRight5}
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
          className={styles.marginRight5}
          onClick={() => {
            setCellStyle('underline', true);
          }}
        >
          下划线
        </Button>

        <Button
          className={styles.marginRight5}
          onClick={() => {
            setCellStyle('strike', true);
          }}
        >
          删除线
        </Button>

        <Dropdown
          className={styles.marginRight5}
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
          className={styles.marginRight5}
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

        <Select
          className={styles.marginRight5}
          placeholder="水平对齐方式"
          onChange={value => {
            setCellStyle('align', value);
          }}
          value="left"
          style={{ width: 140 }}
        >
          <Option value="left">左对齐</Option>
          <Option value="center">居中对齐</Option>
          <Option value="right">右对齐</Option>
        </Select>

        <Select
          className={styles.marginRight5}
          placeholder="垂直对齐方式"
          onChange={value => {
            setCellStyle('valign', value);
          }}
          value="middle"
          style={{ width: 140 }}
        >
          <Option value="top">顶部对齐</Option>
          <Option value="middle">居中对齐</Option>
          <Option value="bottom">底部对齐</Option>
        </Select>

        <Button
          className={styles.marginRight5}
          onClick={() => {
            setCellStyle('textwrap', true);
          }}
        >
          自动换行
        </Button>

        <Button
          className={styles.marginRight5}
          onClick={() => {
            setCellStyle('merge', true);
          }}
        >
          合并单元格
        </Button>

        <SpreadSheet />
      </Fragment>
    );
  }
}

export default Sheet;
