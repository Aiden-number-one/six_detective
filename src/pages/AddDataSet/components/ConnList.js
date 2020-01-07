/*
 * @Author: Sean Mu
 * @Date: 2019-04-25 16:42:00
 * @Last Modified by: Sean Mu
 * @Last Modified time: 2019-06-03 16:22:23
 */
import React, { PureComponent, Component } from 'react';
import { connect } from 'dva';
import { DragSource, DndProvider } from 'react-dnd';
import IconFont from '@/components/IconFont';
import styles from '../AddDataSet.less';

@connect(({ sqlDataSource }) => ({
  activeKey: sqlDataSource.activeKey,
}))
class ConnList extends PureComponent {
  changeActiveKey(activeKey) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sqlDataSource/changeActive',
      payload: activeKey,
    });
  }

  render() {
    const { data, loadMore, activeKey } = this.props;
    return (
      <ul
        id="sqlDataSetList"
        className={styles.list}
        onScroll={() => {
          const top = document.getElementById('sqlDataSetList').scrollTop;
          const height = document.getElementById('sqlDataSetList').scrollHeight;
          const { clientHeight } = document.getElementById('sqlDataSetList');
          if (height - top <= clientHeight) {
            loadMore();
          }
        }}
      >
        {data && data[0] ? (
          data.map((item, index) => (
            <DndProvider>
              <WrapperDropTarget
                key={`${item.id + index}`}
                item={item}
                activeKey={activeKey}
                changeActiveKey={activeKeys => {
                  this.changeActiveKey(activeKeys);
                }}
              />
            </DndProvider>
          ))
        ) : (
          <div
            style={{
              textAlign: 'center',
              marginTop: 30,
              color: '#10416c',
            }}
          >
            No Data
          </div>
        )}
      </ul>
    );
  }
}

class DragLi extends Component {
  render() {
    const { item, activeKey, changeActiveKey, connectDragSource } = this.props;
    return connectDragSource(
      <li
        className={activeKey === item.id ? styles.active : ''}
        title={item.name}
        onClick={() => changeActiveKey(item.id)}
      >
        <IconFont type={item.icon} />
        {item.name}
      </li>,
    );
  }
}

const sourceSpec = {
  beginDrag(
    props,
    // monitor,
    // component
  ) {
    return {
      item: props.item,
    };
  },
  endDrag() {
    // props可包含 ConnList的所有
  },
};

const WrapperDropTarget = DragSource('sqlAdd', sourceSpec, (connected, monitor) => ({
  connectDragSource: connected.dragSource(),
  connectDragPreview: connected.dragPreview(),
  isDragging: monitor.isDragging(),
}))(DragLi);

export default ConnList;
