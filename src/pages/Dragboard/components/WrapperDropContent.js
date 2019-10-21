import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { deviationX, deviationY } from './CustomDragLayer';
import DragTargetInContent from './DragTargetInContent';

class DropContent extends Component {
  modifyPostion = (index, postion) => {
    this.props.modifyPostion(index, postion);
  };

  render() {
    const { connectDropTarget, currentPosition } = this.props;
    return connectDropTarget(
      <div
        className="drop-content-offset"
        style={{ position: 'absolute', width: '100%', height: this.props.height }}
      >
        {// 此index对应的为footer下面的sheet序号index
        this.props.charts[0] &&
          currentPosition[0] &&
          this.props.charts.map((value, index) => {
            const childProps = { value, index, currentPosition };
            return <DragTargetInContent {...childProps} />;
          })}
      </div>,
    );
  }
}

const targetSpec = {
  drop(props, monitor, component) {
    // 当前canvas的长度、宽度
    const currentWidth = props.width;
    const currentHeight = props.height;

    const item = monitor.getItem();
    // 判断是否为content内部移动
    if (item.type === 'contentInsideMove') {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      if (top > currentHeight - 300) {
        props.changeHeight(currentHeight + 300);
      }
      if (left > currentWidth - 300) {
        props.changeWidth(currentWidth + 300);
      }
      component.modifyPostion(item.index, { x: left, y: top });
    } else {
      // 得出dropTarget针对浏览器的偏移量left
      const leftOffset =
        document.getElementsByClassName('drop-content-offset')[0].offsetParent.offsetLeft +
        document.getElementsByClassName('drop-content-offset')[0].offsetLeft;
      // 得出dropTarget针对浏览器的偏移量Top
      const topOffset =
        document.getElementsByClassName('drop-content-offset')[0].offsetParent.offsetTop +
        document.getElementsByClassName('drop-content-offset')[0].offsetTop;
      const adjustPostion = {
        x: monitor.getClientOffset().x - leftOffset - deviationX,
        y: monitor.getClientOffset().y - topOffset + deviationY / 2,
      };
      props.addPostion(adjustPostion);
    }
  },
};

const WrapperDropContent = DropTarget('charts', targetSpec, (connected, monitor) => ({
  connectDropTarget: connected.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(DropContent);

export default WrapperDropContent;
