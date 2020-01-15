// import { Button, Result } from 'antd';
import React from 'react';

const NoAccess = () => (
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
  <div>
    <span>No Access</span>
    <div>
      <div>Sorry! We has the page, please try authorization again later.</div>
      <span>Go To Home </span>
    </div>
  </div>
);

export default NoAccess;
