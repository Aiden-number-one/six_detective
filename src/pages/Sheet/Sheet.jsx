import React, { PureComponent, Fragment } from 'react';
import { Button } from 'antd';
import SpreadSheet from '@/components/SpreadSheet';

export default class DataPanel extends PureComponent {
  state = {};

  spreadSheetRef = React.createRef();

  componentDidMount() {}

  setCellStyle = (property, value) => {
    this.spreadSheetRef.current.setCellStyle(property, value);
  };

  render() {
    const { setCellStyle } = this;
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
            setCellStyle('font-bold', true);
          }}
        >
          斜体
        </Button>
        <Button>下划线</Button>
        <Button>删除线</Button>
        <Button>颜色</Button>
        <SpreadSheet ref={this.spreadSheetRef} />
      </Fragment>
    );
  }
}
