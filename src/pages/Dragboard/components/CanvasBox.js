import React, { Component } from 'react';
import WrapperDropContent from './WrapperDropContent';

export default class CanvasBox extends Component {
  state = {
    height: this.props.height,
    width: this.props.width,
  };

  changeHeight = height => {
    this.setState({
      height,
    });
  };

  changeWidth = width => {
    this.setState({
      width,
    });
  };

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: 500,
          position: 'relative',
          background: '#fff',
        }}
      >
        <WrapperDropContent
          {...this.props}
          {...this.state}
          changeHeight={this.changeHeight}
          changeWidth={this.changeWidth}
        />
      </div>
    );
  }
}
