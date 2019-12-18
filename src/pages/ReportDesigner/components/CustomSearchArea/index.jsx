/*
 * @Des: 查询控件区域
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors  : mus
 * @LastEditTime : 2019-12-18 14:22:14
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Icon } from 'antd';
import { DropTarget } from 'react-dnd';
import RGL, { WidthProvider } from 'react-grid-layout';
import styles from './index.less';

const ResponsiveReactGridLayout = WidthProvider(RGL);

class CustomSearchArea extends PureComponent {
  static defaultProps = {
    rowHeight: 25,
  };

  generateDOM = () => {
    const { customSearchData } = this.props;
    return customSearchData.map(el => (
      <div key={el.i}>
        <div className={styles.bulk}></div>
        {/* <Input /> */}
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
    const { customSearchData, connectDropTarget } = this.props;
    return connectDropTarget(
      <div className={styles.customSearchArea}>
        <ResponsiveReactGridLayout layout={customSearchData} {...this.props}>
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
    const { type } = monitor.getItem();
    const newSearchData = {
      type, // 控件类型
      name: '', // 控件名称
      placeholder: '', // 控件placeholder
      des: '', // 控件描述
      field: '', // 控件字段名称
      isNull: false, // 控件是否为空
      validation: {
        maxLength: Infinity, // 最大长度
        minLength: 0, // 最小长度
        max: Infinity, // 最大值
        min: -Infinity, // 最小值
      },
      displayState: 'normal', // 展示控件状态
      initialValue: undefined, // 初始值
      // grid-layout相关
      i: customSearchData.length.toString(),
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    };
    dispatch({
      type: 'formArea/changeCustomSearchData',
      payload: [...customSearchData, newSearchData],
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
