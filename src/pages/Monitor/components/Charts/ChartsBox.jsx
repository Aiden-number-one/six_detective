import React, { Component } from 'react';
import { Title } from '../Title/TitleBar';
import styles from './ChartsBox.less';

export default class ChartsBox extends Component {
  state = {
    chartData: [
      {
        progress: '55%',
        text: 'LOP',
        color: '#e14952',
        id: 111,
      },
      {
        progress: '40%',
        text: 'Material',
        color: '#ff7575',
        id: 222,
      },
      {
        progress: '80%',
        text: 'Approach',
        color: '#FFB81C',
        id: 333,
      },
      {
        progress: '100%',
        text: 'Suspected',
        color: '#0066CC',
        id: 444,
      },
    ],
  };

  render() {
    const { chartData } = this.state;
    const { propstyles } = this.props;
    return (
      <div className={styles.ChartsBox} style={propstyles || {}}>
        <div className={styles.content}>
          <Title test="Alert level" />
          <div className={styles.listBox}>
            {chartData.map(item => (
              <div className={styles.itemBox} key={item.id}>
                <div className={styles.text}>{item.text}</div>
                <div className={styles.lineBox}>
                  <div
                    className={styles.line}
                    style={{ width: item.progress, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
