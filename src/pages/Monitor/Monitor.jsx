import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import styles from './Monitor.less';
import TableScroll from './components/TableScroll';
import AreaChart from './components/AreaChart';
import LevelBox from './components/Level/LevelBox';
import ChartsBox from './components/Charts/ChartsBox';
import TotalMsg from './components/TotalMsg/TotalMsg';
import TotalMsgWithTit from './components/TotalMsg/TotalMsgWithTit';
// import CustomizeSelectLang from '@/components/CustomizeSelectLang';

const mockData = [
  { text: 'Number of alerts for lop', total: 18 },
  { text: 'Number of alerts for mma', total: 8 },
  { text: 'Number of alerts for lopso', total: 80 },
];

const mockData1 = {
  text: 'Alert processing status',
  total: 4,
  total1: 2,
  total2: 3,
  total3: 4,
  title: 'Pending',
  title1: 'Processing',
  title2: 'Overdue',
  title3: 'Completed',
};

export default class Monitor extends PureComponent {
  componentDidMount() {
    // document.getElementsByClassName('ant-layout-header')[0].style.position = 'absolute';
    // document.getElementsByClassName('ant-layout-header')[0].style.background = 'transparent';
    // document.getElementsByClassName('ant-layout-header')[0].style.width = '';
    const scale = document.getElementById('pageWidth').offsetWidth / 1920;
    document.getElementById('scaleDiv').style.transform = `scale(${scale})`;
    const height = document.getElementById('scaleDiv').offsetHeight * scale;
    document.getElementById('pageWidth').style.height = `${height}px`;
  }

  componentDidUpdate() {
    setTimeout(() => {
      if (document.getElementById('pageWidth')) {
        const scale = document.getElementById('pageWidth').offsetWidth / 1920;
        document.getElementById('scaleDiv').style.transform = `scale(${scale})`;
        const height = document.getElementById('scaleDiv').offsetHeight * scale;
        document.getElementById('pageWidth').style.height = `${height}px`;
      }
    }, 300);
  }

  // componentWillUnmount() {
  //   document.getElementsByClassName('ant-layout-header')[0].style.position = '';
  //   document.getElementsByClassName('ant-layout-header')[0].style.background = '';
  //   document.getElementsByClassName('ant-layout-header')[0].style.width = '100%';
  // }

  render() {
    return (
      <Fragment>
        {/* 用于计算页面宽度 */}
        <div id="pageWidth" className={styles.pageWidth}>
          {/* 缩放的页面 */}
          <div id="scaleDiv" className={styles.scaleDiv}>
            <div className={styles.title}>
              <span className={styles.firstTitle}>Surveillance Overview</span>
              <span className={styles.secondTitle}>Trade Date: 20190824</span>
              {/* <CustomizeSelectLang /> */}
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
            <div className={styles.mainContent}>
              <div className={styles.left}>
                <div className={styles.flexDiv}>
                  <LevelBox />
                </div>
                <div className={styles.flexDiv}>
                  <ChartsBox />
                </div>
                <div className={styles.flexDiv}>
                  <AreaChart type="chart1" />
                </div>
              </div>
              <div className={styles.middle}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div className={styles.flexDiv}>
                    <LevelBox propstyles={{ width: 570, height: 200, marginRight: 30 }} len={3} />
                  </div>
                  <div className={styles.flexDiv}>
                    <ChartsBox propstyles={{ width: 440, height: 200 }} />
                  </div>
                </div>
                <div style={{ width: '100%', height: 418 }}>
                  <TableScroll />
                </div>
                <div style={{ width: '100%', height: 130, marginTop: 40 }}>
                  <TotalMsgWithTit
                    des={mockData1}
                    key={mockData1.text}
                    propstyle={{ width: '100%', alignItems: 'flex-start' }}
                  />
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.flexDiv}>
                  <LevelBox />
                </div>
                <div className={styles.flexDiv}>
                  <ChartsBox />
                </div>
                <div className={styles.flexDiv}>
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
