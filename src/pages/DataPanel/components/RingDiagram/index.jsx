/*
 * @Description: 环状图
 * @Author: mus
 * @Date: 2019-08-30 14:22:07
 * @LastEditTime: 2019-08-30 17:19:22
 * @LastEditors: mus
 * @Email: mus@szkingdom.com
 */
import React, { PureComponent } from 'react';
import G2 from '@antv/g2';
import DataSet from '@antv/data-set';

export default class RingDiagram extends PureComponent {
  state = {};

  componentDidMount() {
    const data = [
      {
        type: '评估中',
        percent: 0.55,
      },
      {
        type: '设计中',
        percent: 0.45,
      },
    ];
    const sum = 500;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'map',
      callback: row => {
        const replaceRow = { ...row };
        replaceRow.value = parseInt(sum * row.percent, 10);
        return replaceRow;
      },
    });
    const chart = new G2.Chart({
      container: 'mountNode',
      forceFit: true,
      height: 100,
      padding: 'auto',
    });
    chart.source(dv);
    chart.tooltip(false);
    chart.legend(false);
    chart.coord('theta', {
      radius: 0.75,
      innerRadius: 0.9,
    });
    chart
      .intervalStack()
      .position('percent')
      .color('type', ['#ff245c', '#1b2732'])
      .opacity(1);
    chart.guide().html({
      position: ['50%', '50%'],
      html: '<p class="value" style="color: #85abc6;font-weight: bold;font-size: 20px;">500</p>',
    });
    chart.render();
  }

  render() {
    return <div id="mountNode" />;
  }
}
