/*
 * @Description: 图表
 * @Author: lan
 * @Date: 2019-10-21 17:02:36
 * @LastEditTime: 2019-10-22 09:43:13
 * @LastEditors: lan
 */
import React, { PureComponent } from 'react';
import G2 from '@antv/g2';
import { Title } from './Title/TitleBar';

export default class ScrollTable extends PureComponent {
  componentDidMount() {
    const { type } = this.props;
    const chart = new G2.Chart({
      container: type,
      width: 400,
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
      label: {
        textStyle: {
          textAlign: 'center', // 文本对齐方向，可取值为： start center end
          fill: '#999', // 文本的颜色
          fontSize: '14', // 文本大小
        },
      },
    });
    chart.axis('date', {
      line: {
        stroke: '#fff',
      },
      label: {
        textStyle: {
          textAlign: 'center', // 文本对齐方向，可取值为： start center end
          fill: '#999', // 文本的颜色
          fontSize: '14', // 文本大小
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
    const { type } = this.props;
    return (
      <div
        style={{
          border: '1px solid #fff',
          borderRadius: 10,
        }}
      >
        <Title test="Alert trend of recent 10 days" />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div id={type}></div>
        </div>
      </div>
    );
  }
}
