/*
 * @Des: 查询控件区域
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-16 10:50:25
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import uuidv1 from 'uuid/v1';
import { DropTarget } from 'react-dnd';
import RGL, { WidthProvider } from 'react-grid-layout';
import IconFont from '@/components/IconFont';
import styles from './index.less';

const ResponsiveReactGridLayout = WidthProvider(RGL);

const iconMap = {
  input: 'iconTextboxx',
  inputnumber: 'iconiconicon_numbersx',
  datepickeryyyy: 'iconicon_yyx',
  datepickeryyyymm: 'iconicon_yymmx',
  datepickeryyyymmdd: 'iconicon_calenderx',
  select: 'iconicon_xialadanxuanx',
  selectmultiple: 'iconicon_xialaduoxuanx',
  radio: 'radio',
  checkbox: 'checkbox',
};

const titleMap = {
  input: 'Input',
  inputnumber: 'Input Number',
  datepickeryyyy: 'Date Picker(Year)',
  datepickeryyyymm: 'Date Picker(Month)',
  datepickeryyyymmdd: 'Date Picker(Day)',
  select: 'Select',
  selectmultiple: 'Multiple Select',
  radio: 'Radio',
  checkbox: 'Checkbox',
};

class CustomSearchArea extends PureComponent {
  static defaultProps = {
    rowHeight: 35,
  };

  // 改变查询查询条件的active的状态
  changeActive = i => {
    const { dispatch, queryWakeUp, changeRightSideBar } = this.props;
    dispatch({
      type: 'formArea/changeCustomSearchData',
      payload: { index: i },
    });
    queryWakeUp('query');
    changeRightSideBar(true);
  };

  generateDOM = () => {
    const { customSearchData } = this.props;
    return customSearchData.map(el => (
      <div
        key={el.i}
        onClick={() => {
          this.changeActive(el.i);
        }}
      >
        <div
          className={classNames(styles.bulk, el.active && styles.active)}
          title={titleMap[el.widgetType]}
        >
          <div className={styles.left}>
            <div>{el.widgetName}</div>
          </div>
          <div className={styles.rigth}>
            <IconFont type={iconMap[el.widgetType]} />
          </div>
        </div>
      </div>
    ));
  };

  /**
   * @description: 往控件区添加控件
   * @param {string} type 控件的类型
   * @return:
   * @Author: mus
   * @Date: 2019-12-05 10:46:07
   */
  // addWidgetArea = type => {
  //   // const { dispatch, customSearchData } = this.props;
  //   // const value = ;
  //   // dispatch({
  //   //   type: 'formArea/changeCustomSearchData',
  //   //   payload: [...customSearchData, value],
  //   // });
  // };

  render() {
    // const widgetAreaAction = {
    //   addWidgetArea: this.addWidgetArea,
    // };
    const { customSearchData, connectDropTarget, dispatch } = this.props;
    return connectDropTarget(
      <div className={styles.customSearchArea}>
        <ResponsiveReactGridLayout
          layout={customSearchData}
          onLayoutChange={layout => {
            dispatch({
              type: 'formArea/changeAllCustomSearchData',
              payload: customSearchData.map(value => {
                const layoutItem = layout.find(v => v.i === value.i);
                return { ...value, ...layoutItem };
              }),
            });
          }}
          {...this.props}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
        {/* <WidgetArea {...widgetAreaAction} /> */}
      </div>,
    );
  }
}

const targetSpec = {
  drop(props, monitor) {
    const { dispatch, customSearchData } = props;
    const { type: widgetType } = monitor.getItem();
    const newSearchData = {
      widgetType, // 控件类型
      widgetName: 'Untitled', // 控件名称
      widgetNameVisible: true, // 标签名称是否可见
      widgetPlaceholder: '', // 控件placeholder
      widgetDes: '', // 控件描述
      widgetStatus: 'normal', // 标签状态
      field: '', // 控件字段名称
      isNull: false, // 控件是否为空
      maxLength: Infinity, // 最大长度
      minLength: 0, // 最小长度
      maxNumber: Infinity, // 最大值
      minNumber: -Infinity, // 最小值
      displayState: 'normal', // 展示控件状态
      initialValue: undefined, // 初始值
      // grid-layout相关
      i: uuidv1(),
      x: (customSearchData.length * 2) % 12,
      y: Infinity,
      w: 2,
      h: 1,
    };
    if (customSearchData.length === 0) {
      newSearchData.active = true;
    }
    dispatch({
      type: 'formArea/addCustomSearchData',
      payload: newSearchData,
    });
  },
};

const WrapperDropContent = DropTarget('InsertMenu', targetSpec, (connected, monitor) => ({
  connectDropTarget: connected.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(CustomSearchArea);

export default connect(({ formArea }) => ({
  customSearchData: formArea.customSearchData,
}))(WrapperDropContent);

// function WidgetArea({ addWidgetArea }) {
//   return (
//     <div className={styles.widgetArea}>
//       <div className={styles.editArea}>
//         <Icon
//           type="plus"
//           onClick={() => {
//             addWidgetArea('input');
//           }}
//         />
//       </div>
//       <div className={styles.closeArea}>Close</div>
//     </div>
//   );
// }
