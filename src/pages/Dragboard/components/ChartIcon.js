import React, { Component, Fragment } from 'react';
import { Icon } from 'antd';
import { DragSource } from 'react-dnd';
import { connect } from 'dva';
import { getEmptyImage } from 'react-dnd-html5-backend';
import classNames from 'classnames';
import CustomDragLayer from './CustomDragLayer';
import styles from '../Dragboard.less';

// const imgType = {
//   // eslint-disable-next-line global-require
//   chart1: require('@/assets/logo.png'),
// };

@connect(({ chart, loading }) => ({
  charts: chart.charts,
  loading: loading.models.chart,
}))
export default class ChartIcon extends Component {
  state = {};

  render() {
    return (
      <Fragment>
        <div
          className={classNames(styles.box, styles.iconBox, 'chart-offset')}
          style={{ fontSize: 30 }}
        >
          <WrapperDropTarget type="chart1" {...this.props} />
          <WrapperDropTarget type="chart2" {...this.props} />
          <CustomDragLayer />
        </div>
      </Fragment>
    );
  }
}

class IconDrag extends Component {
  componentDidMount() {
    const { connectDragPreview } = this.props;
    connectDragPreview(getEmptyImage());
  }

  render() {
    const {
      // type,
      connectDragSource,
    } = this.props;
    return connectDragSource(
      <span>
        <Icon className={styles.singleIcon} type="plus" />
      </span>,
    );
  }
}

const sourceSpec = {
  beginDrag(props) {
    return {
      type: props.type,
    };
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      const { dispatch } = props;
      dispatch({
        type: 'chart/addChart',
        payload: props.type,
      });
    }
  },
};

const WrapperDropTarget = DragSource('charts', sourceSpec, (connected, monitor) => ({
  connectDragSource: connected.dragSource(),
  connectDragPreview: connected.dragPreview(),
  isDragging: monitor.isDragging(),
}))(IconDrag);
