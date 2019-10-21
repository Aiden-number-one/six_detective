/*
 * @Description: 图表
 * @Author: lan
 * @Date: 2019-10-21 17:02:36
 * @LastEditTime: 2019-10-21 19:31:41
 * @LastEditors: lan
 */
import React, { PureComponent } from 'react';
import G2 from '@antv/g2';
import styles from '../Monitor.less';

export default class ScrollTable extends PureComponent {
  componentDidMount() {
    const chart = new G2.Chart({
      container: 'area',
      width: 350,
      height: 200,
      padding: [10, 0, 20, 20],
      // forceFit: true,
      color: '#fff',
    });
    const data = [
      { date: '08/19', num: 5 },
      { date: '08/20', num: 4 },
      { date: '08/21', num: 8 },
      { date: '08/22', num: 3 },
      { date: '08/23', num: 0 },
      { date: '08/24', num: 2 },
      { date: '08/25', num: 6 },
      { date: '08/26', num: 7 },
      { date: '08/27', num: 3 },
      { date: '08/28', num: 2 },
    ];
    chart.scale('num', {
      min: 0,
      max: 10,
      tickCount: 0,
    });
    chart.axis('num', {
      line: {
        stroke: '#fff',
      },
      label: {},
    });
    chart.axis('date', {
      line: {
        stroke: '#fff',
      },
      label: {
        textStyle: {
          textAlign: 'center', // 文本对齐方向，可取值为： start center end
          fill: '#404040', // 文本的颜色
          fontSize: '12', // 文本大小
        },
      },
    });
    chart.source(data);
    chart
      .area()
      .position('date*num')
      .shape('smooth');
    chart
      .line()
      .position('date*num')
      .shape('smooth');
    chart
      .point()
      .position('date*num')
      .size(2);
    chart.render();
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div id="area"></div>
      </div>
    );
  }
}
