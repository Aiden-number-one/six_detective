/*
 * @Description: 环状图
 * @Author: mus
 * @Date: 2019-08-30 14:22:07
 * @LastEditTime: 2019-08-30 15:11:45
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
        percent: 0.23,
      },
      {
        type: '设计中',
        percent: 0.28,
      },
      {
        type: '正在开发',
        percent: 0.3,
      },
      {
        type: '已上线',
        percent: 0.19,
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
      innerRadius: 0.6,
    });
    chart
      .intervalStack()
      .position('percent')
      .color('type', ['#0a7aca', '#0a9afe', '#4cb9ff', '#8ed1ff'])
      .opacity(1);
    chart.render();
  }

  render() {
    return <div id="mountNode" />;
  }
}
