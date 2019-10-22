import React, { Component } from 'react';
import { Title } from '../Title/TitleBar';
import styles from './LevelBox.less';

export default class LevelBox extends Component {
  state = {
    chartData: [
      {
        progress: '100%',
        rank: 1,
        text: 'LOP reporting error',
        id: 111,
      },
      {
        progress: '80%',
        rank: 2,
        text: 'Material drop in LOP',
        id: 222,
      },
      {
        progress: '72%',
        rank: 3,
        text: 'Approach of Position Limit',
        id: 333,
      },
      {
        progress: '50%',
        rank: 4,
        text: 'Suspected under reporting',
        id: 444,
      },
      {
        progress: '40%',
        rank: 5,
        text: 'Breach of Position Limit',
        id: 555,
      },
    ],
    chartData1: [
      {
        progress: '100%',
        rank: 1,
        text: 'LOP reporting error',
        id: 111,
      },
      {
        progress: '80%',
        rank: 2,
        text: 'Material drop in LOP',
        id: 222,
      },
      {
        progress: '72%',
        rank: 3,
        text: 'Approach of Position Limit',
        id: 333,
      },
    ],
  };

  render() {
    const { chartData, chartData1 } = this.state;
    const { propstyles, len } = this.props;
    return (
      <div className={styles.LevelBox} style={propstyles || {}}>
        <div className={styles.content}>
          <Title test="Alert type" />
          <div className={styles.listBox}>
            {len
              ? chartData1.map(item => (
                  <div className={styles.itemBox} key={item.id}>
                    <div className={styles.text}>
                      <span>{`NO.${item.rank}`}</span>
                      <p>{item.text}</p>
                    </div>
                    <div className={styles.lineBox}>
                      <div className={styles.line} style={{ width: item.progress }}></div>
                    </div>
                  </div>
                ))
              : chartData.map(item => (
                  <div className={styles.itemBox} key={item.id}>
                    <div className={styles.text}>
                      <span>{`NO.${item.rank}`}</span>
                      <p>{item.text}</p>
                    </div>
                    <div className={styles.lineBox}>
                      <div className={styles.line} style={{ width: item.progress }}></div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  }
}
