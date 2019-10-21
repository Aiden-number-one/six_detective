import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import G2 from '@antv/g2';

// 此值保证鼠标在图面的水平方向中间(在放置图片的时候也需要用到)
const deviationX = 180;
// 调整鼠标在图面的下方一点点(在放置图片的时候也需要用到)
const deviationY = 20;

function getItemStyles(props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentOffset;

  const chartIconOffsetTop = document.getElementsByClassName('chart-offset')[0].offsetTop;
  const chartIconOffsetLeft = document.getElementsByClassName('chart-offset')[0].offsetLeft;
  const transform = `translate(${x - chartIconOffsetLeft - deviationX}px, ${y -
    chartIconOffsetTop -
    deviationY}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

class CustomDragLayer extends Component {
  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (prevProps.itemType !== this.props.itemType && this.props.isDragging) {
      const chart = new G2.Chart({
        container: 'chart2',
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
      chart.line().position('genre*sold');
      chart.render();
      if (this.props.item.type === 'chart1') {
        chart.line().position('genre*sold');
        chart.repaint();
      } else if (this.props.item.type === 'chart2') {
        chart.interval().position('genre*sold');
        chart.repaint();
      }
    }
  }

  render() {
    // const imgType = {
    //   // eslint-disable-next-line global-require
    //   chart1: require('@/assets/logo.png'),
    // }
    // const source = this.props.item && imgType[this.props.item.type];

    let display;
    // 此组件仅在拖动时生效
    const { isDragging } = this.props;
    if (!isDragging || !this.props.item) {
      display = { display: 'none' };
    } else {
      display = { display: 'block' };
    }

    // 若无source则隐藏此img
    // if (!source) {
    //   return null;
    // }

    return (
      <div style={{ zIndex: 100, position: 'relative', width: '100%', height: 0 }}>
        <div style={getItemStyles(this.props)}>
          {/* <img src={source} alt="" /> */}
          <div id="chart2" style={display}></div>
        </div>
      </div>
    );
  }
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  };
}

const DragLayerWrapper = DragLayer(collect)(CustomDragLayer);

export { DragLayerWrapper as default, deviationX, deviationY };
