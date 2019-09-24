import React, { PureComponent, Fragment } from 'react';
import { Button } from 'antd';
import SpreadSheet from '@/components/SpreadSheet';

@SpreadSheet.createSpreadSheet
class Sheet extends PureComponent {
  state = {
    cellStyle: {},
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
    setCellStyle(property, value);
  };

  render() {
    const { setCellStyle } = this;
    const { cellStyle } = this.state;
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
        <SpreadSheet />
      </Fragment>
    );
  }
}

export default Sheet;
