import React, { PureComponent, Fragment } from 'react';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Layout, Card, Icon } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './Monitor.less';
import ScrollTable from './components/ScrollTable';
import AreaChart from './components/AreaChart';

const { Content, Sider } = Layout;

@connect(({ api }) => ({}))
export default class Monitor extends PureComponent {
  componentDidMount() {
    const scale = document.getElementById('x').offsetWidth / 1980;
    document.getElementById('scalcDiv').style.transform = `scale(${scale})`;
  }

  componentDidUpdate() {
    setTimeout(() => {
      const scale = document.getElementById('x').offsetWidth / 1980;
      document.getElementById('scalcDiv').style.transform = `scale(${scale})`;
    }, 100);
  }

  render() {
    return (
      <Fragment>
        <div className={styles.monitor}></div>

        <div
          id="x"
          style={{
            width: '100%',
          }}
        >
          <div
            id="scalcDiv"
            style={{
              transformOrigin: '0 0',
              width: 1980,
              // display: 'flex',
              flexDirection: 'column',
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
                <div style={{ width: '100%', height: 200 }}>
                  <AreaChart />
                </div>
              </div>
              <div
                style={{
                  width: 990,
                }}
              >
                <div style={{ width: '100%', height: 418 }}>
                  <ScrollTable />
                </div>
              </div>
              <div
                style={{
                  width: 495,
                }}
              >
                <div style={{ width: '100%', height: 244 }}></div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
