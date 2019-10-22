import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import styles from './Monitor.less';
import ScrollTable from './components/scrollTable';
import AreaChart from './components/AreaChart';
import LevelBox from './components/Level/LevelBox';
import ChartsBox from './components/Charts/ChartsBox';
import TotalMsg from './components/TotalMsg/TotalMsg';

const mockData = [
  { text: 'for lop', total: 18 },
  { text: 'for mma', total: 8 },
  { text: 'for lopso', total: 80 },
];

export default class Monitor extends PureComponent {
  componentDidMount() {
    const scale = document.getElementById('pageWidth').offsetWidth / 1920;
    document.getElementById('scaleDiv').style.transform = `scale(${scale})`;
  }

  componentDidUpdate() {
    setTimeout(() => {
      const scale = document.getElementById('pageWidth').offsetWidth / 1920;
      document.getElementById('scaleDiv').style.transform = `scale(${scale})`;
    }, 300);
  }

  render() {
    return (
      <Fragment>
        {/* 背景 */}
        <div className={styles.monitor}></div>
        {/* 用于计算页面宽度 */}
        <div
          id="pageWidth"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <div
            id="scaleDiv"
            style={{
              transformOrigin: '0 0',
              width: 1920,
            }}
          >
            <div
              id="monitor"
              style={{
                position: 'relative',
                width: '100%',
                height: 100,
                color: '#fff',
                lineHeight: '100px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  marginRight: 10,
                }}
              >
                Surveillance Overview
              </span>
              <span
                style={{
                  fontSize: 20,
                  color: 'rgb(244, 183, 56)',
                }}
              >
                Trade Date: 20190824
              </span>
            </div>
            <div className={classNames(styles.content)}>
              <div className={styles.alert_msg}>
                {mockData.map((v, i) => (
                  <TotalMsg
                    className={classNames(styles.item, i === 1 && styles.middle)}
                    des={v}
                    key={v.text}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div
                style={{
                  width: 495,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <LevelBox />
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ChartsBox />
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <AreaChart type="chart1" />
                </div>
              </div>
              <div
                style={{
                  width: 990,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <LevelBox propstyles={{ width: 520, height: 190, marginRight: 30 }} len={3} />
                  </div>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ChartsBox />
                  </div>
                </div>
                <div style={{ width: '100%', height: 418 }}>
                  <ScrollTable />
                </div>
              </div>
              <div
                style={{
                  width: 495,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <LevelBox />
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ChartsBox />
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <AreaChart type="chart2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
