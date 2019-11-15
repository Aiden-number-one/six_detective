import React from 'react';
import styles from './index.less';
import kdTableTheme from './kdTableTheme';
import CGrid from './CGrid';
import CGridColumn from './CGridColumn';
// import CGridColumnGroup from './CGridColumnGroup';
import CGridButtonColumn from './CGridButtonColumn';

const KdTable = ({ dataSource }) => {
  function handleBtnClick(rec) {
    console.log(rec, 'click1111');
  }

  return (
    <div className={styles.container}>
      <CGrid data={dataSource} theme={kdTableTheme}>
        <CGridColumn
          width={80}
          field="personid"
          style={{
            textAlign: 'center',
          }}
          headerStyle={{
            textAlign: 'center',
            font: 'bold 16px microsoft yahei',
          }}
        >
          ID
        </CGridColumn>
        <CGridColumn
          field="fname"
          style={{
            textAlign: 'center',
          }}
          headerStyle={{
            textAlign: 'center',
            font: 'bold 16px microsoft yahei',
          }}
        >
          First Name
        </CGridColumn>
        <CGridColumn
          field="lname"
          style={{
            textAlign: 'center',
          }}
          headerStyle={{
            textAlign: 'center',
            font: 'bold 16px microsoft yahei',
          }}
        >
          Last Name
        </CGridColumn>
        <CGridColumn
          field="email"
          style={{
            textAlign: 'center',
          }}
          headerStyle={{
            textAlign: 'center',
            font: 'bold 16px microsoft yahei',
          }}
        >
          Email
        </CGridColumn>
        <CGridButtonColumn
          onClick={handleBtnClick}
          width={100}
          headerStyle={{
            textAlign: 'center',
            font: 'bold 16px microsoft yahei',
          }}
        >
          操作
        </CGridButtonColumn>
      </CGrid>
    </div>
  );
};

export default KdTable;
