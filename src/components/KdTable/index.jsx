import React from 'react';
import styles from './index.less';
import kdTableTheme from './kdTableTheme';
import CGrid from './CGrid';
import CGridColumn from './CGridColumn';
import CGridColumnGroup from './CGridColumnGroup';
import CGridButtonColumn from './CGridButtonColumn';

const KdTable = ({ dataSource }) => {
  function handleBtnClick(rec) {
    console.log(rec, 'click1111');
  }

  return (
    <div className={styles.container}>
      <CGrid data={dataSource} theme={kdTableTheme}>
        <CGridColumn
          field="personid"
          style={{
            textAlign: 'center',
          }}
          headerStyle={{
            textAlign: 'center',
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
          }}
        >
          Email
        </CGridColumn>
        <CGridColumnGroup
          caption="name"
          headerStyle={{
            textAlign: 'center',
          }}
        >
          <CGridColumn
            field="fname"
            style={{
              textAlign: 'center',
            }}
            headerStyle={{
              textAlign: 'center',
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
            }}
          >
            Last Name
          </CGridColumn>
        </CGridColumnGroup>
        <CGridButtonColumn
          onClick={handleBtnClick}
          headerStyle={{
            textAlign: 'center',
          }}
        >
          修改
        </CGridButtonColumn>
      </CGrid>
    </div>
  );
};

export default KdTable;
