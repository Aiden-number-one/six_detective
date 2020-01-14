import React from 'react';
import classNames from 'classnames';
import { DragSource } from 'react-dnd';
import IconFont from '@/components/IconFont';
import styles from './index.less';

const InsertMenu = () => (
  <div className={classNames(styles.insertContent)}>
    <WrapperDragTarget iconType="iconTextboxx" type="input" title="Input" /> {/* 文字 */}
    <WrapperDragTarget
      iconType="iconiconicon_numbersx"
      type="inputnumber"
      title="Input Number"
    />{' '}
    {/* 数字 */}
    <div className={styles.divider}></div>
    <WrapperDragTarget
      iconType="iconicon_yyx"
      type="datepickeryyyy"
      title="Date Picker(Year)"
    />{' '}
    {/* 年 */}
    <WrapperDragTarget
      iconType="iconicon_yymmx"
      type="datepickeryyyymm"
      title="Date Picker(Month)"
    />{' '}
    {/* 年月 */}
    <WrapperDragTarget
      iconType="iconicon_calenderx"
      type="datepickeryyyymmdd"
      title="Date Picker(Day)"
    />{' '}
    {/* 年月日 */}
    <div className={styles.divider}></div>
    <WrapperDragTarget iconType="iconicon_xialadanxuanx" type="select" title="Select" />{' '}
    {/* 下拉单选 */}
    <WrapperDragTarget
      iconType="iconicon_xialaduoxuanx"
      type="selectmultiple"
      title="Multiple Select"
    />{' '}
    {/* 下拉多选 */}
    <div className={styles.divider}></div>
    <WrapperDragTarget iconType="iconicon_multiselectedx" type="radio" title="Radio" />{' '}
    {/* Radio */}
    <WrapperDragTarget
      iconType="iconicon_multiselectedkaobeix"
      type="checkbox"
      title="Checkbox"
    />{' '}
    {/* CheckBox */}
  </div>
);

const Widget = props => {
  const { iconType, connectDragSource, title } = props;
  return connectDragSource(
    <div>
      <IconFont type={iconType} title={title} />
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
