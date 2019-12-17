import React from 'react';
import classNames from 'classnames';
import IconFont from '@/components/IconFont';
import styles from './index.less';

export default () => (
  <div className={classNames(styles.insertContent)}>
    <IconFont type="iconTextboxx" /> {/* 文字 */}
    <IconFont type="iconicon_numbersx" /> {/* 数字 */}
    <div className={styles.divider}></div>
    <IconFont type="iconicon_yyx" /> {/* 年 */}
    <IconFont type="iconicon_yymmx" /> {/* 年月 */}
    <IconFont type="iconicon_calenderx" /> {/* 年月日 */}
    <div className={styles.divider}></div>
    <IconFont type="iconicon_xialadanxuanx" /> {/* 下拉单选 */}
    <IconFont type="iconicon_xialaduoxuanx" /> {/* 下拉多选 */}
    <div className={styles.divider}></div>
    <IconFont type="iconicon_multiselectedx" /> {/* Radio */}
    <IconFont type="iconicon_multiselectedkaobeix" /> {/* CheckBox */}
  </div>
);
