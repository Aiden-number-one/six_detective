/*
 * @Description: 删除数据集
 * @Author: lan
 * @Date: 2019-12-11 20:54:21
 * @LastEditTime : 2020-01-16 15:38:13
 * @LastEditors  : lan
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Drawer } from 'antd';

export default class DeleteDataSetDrawer extends PureComponent {
  static propTypes = {
    handleDeleteDataSet: PropTypes.func,
    toggleDrawer: PropTypes.func,
    clearRecord: PropTypes.func,
  };

  static defaultProps = {
    handleDeleteDataSet: () => {},
    toggleDrawer: () => {},
    clearRecord: () => {},
  };

  render() {
    const { toggleDrawer, clearRecord, visible } = this.props;
    return (
      <Drawer
        title="Delete DataSet"
        width={370}
        visible={visible}
        onClose={() => {
          clearRecord();
          toggleDrawer('deleteDataSet');
        }}
        destroyOnClose
      >
        <div>Please Confirm to delete</div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            // borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button
            onClick={() => {
              clearRecord();
              toggleDrawer('deleteDataSet');
            }}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const { handleDeleteDataSet } = this.props;
              handleDeleteDataSet();
            }}
            type="primary"
          >
            Submit
          </Button>
        </div>
      </Drawer>
    );
  }
}
