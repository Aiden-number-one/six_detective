import React, { PureComponent } from 'react';
import L7 from '@antv/l7';
import className from 'classnames';
import RingDiagram from './components/RingDiagram';
import styles from './DataPanel.less';

export default class DataPanel extends PureComponent {
  state = {};

  componentDidMount() {
    const scene = new L7.Scene({
      id: 'map',
      mapStyle: 'dark', // 样式URL
      center: [104.838088, 34.075889],
      pitch: 0,
      zoom: 3.5,
    });
    scene.on('loaded', () => {
      const colors = ['#3E3A7F', '#6C3567', '#1A2357', '#AE2262', '#AB296C', '#730D1C', '#00131C'];
      // 获取地区经纬度
      const areaFetch = fetch('./100000_full.json', {
        method: 'GET',
      }).then(response => response.json());
      // 获取线的属性
      const lineFetch = fetch('./line.txt', {
        method: 'GET',
      }).then(response => response.text());
      Promise.all([areaFetch, lineFetch]).then(([arrData, lineData]) => {
        scene
          .PolygonLayer()
          .source(arrData)
          .color('childrenNum', p => {
            if (p > 20) {
              return colors[5];
            }
            if (p > 18) {
              return colors[4];
            }
            if (p > 16) {
              return colors[3];
            }
            if (p > 14) {
              return colors[2];
            }
            if (p > 12) {
              return colors[1];
            }
            return colors[0];
          })
          .shape('fill')
          .style({
            opacity: 0.4,
          })
          .render();
        scene
          .LineLayer({
            zIndex: 2,
          })
          .source(lineData, {
            parser: {
              type: 'csv',
              x: 'lng1',
              y: 'lat1',
              x1: 'lng2',
              y1: 'lat2',
            },
          })
          .shape('greatCircle')
          .size(0.8)
          .color('rgb(13,64,140)')
          .animate({
            enable: true,
            interval: 1,
            duration: 2,
            trailLength: 0.8,
          })
          .style({
            opacity: 0.6,
          })
          .render();
      });
    });
  }

  render() {
    return (
      <div className={className(styles.container)}>
        <div className={className(styles.mainPic)} />
        <div className={className(styles.map)} id="map" />
        <div className={className(styles.rd1)}>
          <RingDiagram />
        </div>
      </div>
    );
  }
}
