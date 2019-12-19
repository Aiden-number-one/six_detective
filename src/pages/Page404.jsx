// import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router'; // 这里应该使用 antd 的 404 result 组件，
import seperate from '@/assets/icon_seperate.svg';
import arrow from '@/assets/arrow.png';
import styles from '@/assets/css/index.less';
// 但是还没发布，先来个简单的。

const Page404 = () => (
  // <Result
  //   status="404"
  //   title="404"
  //   subTitle="Sorry, the page you visited does not exist."
  //   extra={
  //     <Button type="primary" onClick={() => router.push('/')}>
  //       Back Home
  //     </Button>
  //   }
  // ></Result>
  <div className={styles.page404}>
    <span className={styles.font404}>404</span>
    <img src={seperate} alt="" height="300" />
    <div className={styles.box}>
      <div>Sorry! We Lost the page, please try again later.</div>
      <span>Go To Home </span>
      <img src={arrow} alt="" width="14" onClick={() => router.push('/')} />
    </div>
  </div>
);

export default Page404;
