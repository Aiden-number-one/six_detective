import React, { PureComponent } from 'react';
import { Table, Row, Col } from 'antd';
import IconFont from '@/components/IconFont';
import styles from './index.less';

export default class CustomizeTable extends PureComponent {
  state = {};

  componentDidMount() {
    // 判断Table中的column是否是JSX模式还是Props模式
  }

  render() {
    const { ...otherTableProps } = this.props;
    return (
      <>
        <Row type="flex" justify="end">
          <Col>
            <span onClick={() => {}}>
              <span className={styles.customizeDisplay}>Customize Display</span>
              <IconFont type="icon-setting" className={styles['btn-icon']} />
            </span>
          </Col>
        </Row>
        <Table {...otherTableProps} />
      </>
    );
  }
}
