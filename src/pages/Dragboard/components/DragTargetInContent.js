import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import G2 from '@antv/g2';

class DragTargetInContent extends Component {
  componentDidUpdate() {
    const chart = new G2.Chart({
      container: 'chart1',
      width: 400,
      height: 200,
    });
    const data = [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Other', sold: 150 },
    ];
    chart.source(data);
    if (this.props.value === 'chart1') {
      chart.line().position('genre*sold');
      chart.render();
    } else if (this.props.value === 'chart2') {
      chart.interval().position('genre*sold');
      chart.render();
    }
  }

  render() {
    const {
      currentPosition,
      // value,
      index,
      connectDragSource,
      isDragging,
    } = this.props;
    if (isDragging) {
      return null;
    }
    return connectDragSource(
      // <img src={value} alt=""
      //   style={{ position: 'absolute',
      // left: currentPosition[index].x, top: currentPosition[index].y }}
      // />,
      <div
        id="chart1"
        style={{
          position: 'absolute',
          left: currentPosition[index].x,
          top: currentPosition[index].y,
          width: 400,
          height: 200,
        }}
      ></div>,
    );
  }
}

const boxSource = {
  beginDrag(props) {
    const { currentPosition, index } = props;
    return {
      index,
      left: currentPosition[index].x,
      top: currentPosition[index].y,
      type: 'contentInsideMove', // DropContent内部移动的标识
    };
  },
};

export default DragSource('charts', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DragTargetInContent);
