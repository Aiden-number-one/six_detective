import React from 'react';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';
import IconFont from '@/components/IconFont';
import styles from './index.less';

const InsertMenu = () => (
  <div className={classNames(styles.insertContent)}>
    <WrapperDragTarget iconType="iconTextboxx" type="input" /> {/* 文字 */}
    <WrapperDragTarget iconType="iconiconicon_numbersx" type="inputnumber" /> {/* 数字 */}
    <div className={styles.divider}></div>
    <WrapperDragTarget iconType="iconicon_yyx" type="datepickeryyyy" /> {/* 年 */}
    <WrapperDragTarget iconType="iconicon_yymmx" type="datepickeryyyymm" /> {/* 年月 */}
    <WrapperDragTarget iconType="iconicon_calenderx" type="datepickeryyyymmdd" /> {/* 年月日 */}
    <div className={styles.divider}></div>
    <WrapperDragTarget iconType="iconicon_xialadanxuanx" type="select" /> {/* 下拉单选 */}
    <WrapperDragTarget iconType="iconicon_xialaduoxuanx" type="selectmultiple" /> {/* 下拉多选 */}
    <div className={styles.divider}></div>
    <WrapperDragTarget iconType="iconicon_multiselectedx" type="radio" /> {/* Radio */}
    <WrapperDragTarget iconType="iconicon_multiselectedkaobeix" type="checkbox" /> {/* CheckBox */}
  </div>
);

const Widget = props => {
  const { iconType, connectDragSource } = props;
  return connectDragSource(
    <div>
      <IconFont type={iconType} />
    </div>,
  );
};

const sourceSpec = {
  beginDrag(
    props,
    // monitor,
    // component
  ) {
    return {
      type: props.type,
    };
  },
  endDrag() {
    // props可包含 ConnList的所有
  },
};

const WrapperDragTarget = DragSource('InsertMenu', sourceSpec, (connected, monitor) => ({
  connectDragSource: connected.dragSource(),
  connectDragPreview: connected.dragPreview(),
  isDragging: monitor.isDragging(),
}))(Widget);

export default InsertMenu;
