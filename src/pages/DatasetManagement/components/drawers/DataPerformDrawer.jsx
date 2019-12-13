/*
 * @Description: 数据预览
 * @Author: lan
 * @Date: 2019-12-11 20:54:21
 * @LastEditTime: 2019-12-12 10:06:45
 * @LastEditors: lan
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Drawer } from 'antd';

export default class DeleteDataSetDrawer extends PureComponent {
  static propTypes = {
    column: PropTypes.array,
    tableData: PropTypes.array,
    visible: PropTypes.bool,
    toggleDrawer: PropTypes.func,
  };

  static defaultProps = {
    column: [],
    tableData: [],
    visible: false,
    toggleDrawer: () => {},
  };

  render() {
    const { toggleDrawer, visible, column, tableData } = this.props;
    return (
      <Drawer
        title="Data Perform"
        width={800}
        visible={visible}
        onClose={() => {
          toggleDrawer('dataPerform');
        }}
        destroyOnClose
      >
        <Table columns={column} dataSource={tableData} />
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button
            onClick={() => {
              toggleDrawer('dataPerform');
            }}
            type="primary"
          >
            OK
          </Button>
        </div>
      </Drawer>
    );
  }
}
