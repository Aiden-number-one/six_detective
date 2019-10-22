import React, { PureComponent, Fragment } from 'react';
import styles from './Monitor.less';
import ScrollTable from './components/ScrollTable';
import AreaChart from './components/AreaChart';
import LevelBox from './components/Level/LevelBox';
import ChartsBox from './components/Charts/ChartsBox';

export default class Monitor extends PureComponent {
  componentDidMount() {
    const scale = document.getElementById('pageWidth').offsetWidth / 1960;
    document.getElementById('scaleDiv').style.transform = `scale(${scale})`;
  }

  componentDidUpdate() {
    setTimeout(() => {
      const scale = document.getElementById('pageWidth').offsetWidth / 1960;
      document.getElementById('scaleDiv').style.transform = `scale(${scale})`;
    }, 100);
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
          }}
        >
          <div
            id="scaleDiv"
            style={{
              transformOrigin: '0 0',
              width: 1960,
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
                <div style={{ width: '100%', height: 300 }}>
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
                <div style={{ width: '100%', height: 300 }}>
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
