/*
 * @Description: 滚动文字
 * @Author: lan
 * @Date: 2019-08-30 16:11:16
 * @LastEditTime: 2019-08-30 16:37:22
 * @LastEditors: lan
 */

import React, { PureComponent } from 'react';
import styles from './SlideText.less';

export default class SlideText extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    return (
      <div className={styles.absolute}>
        <div className={styles.wraper}>
          <div className={styles.bigCon}>
            <div className={styles.content}>
              12：35
              <br />
              北京朝阳区成交一单 无异常
              <br />
              13:16
              <br />
              内蒙古呼和浩特市成交一单 无异常
              <br />
              14：06
              <br />
              吉林长春成交一单 无异常
              <br />
              15：17
              <br />
              广西北海成交一单无异常
            </div>
            <div className={styles.content}>
              12：35
              <br />
              北京朝阳区成交一单 无异常
              <br />
              13:16
              <br />
              内蒙古呼和浩特市成交一单 无异常
              <br />
              14：06
              <br />
              吉林长春成交一单 无异常
              <br />
              15：17
              <br />
              广西北海成交一单无异常
            </div>
          </div>
        </div>
      </div>
    );
  }
}
