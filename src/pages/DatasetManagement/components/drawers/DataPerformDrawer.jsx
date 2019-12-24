/*
 * @Description: 数据预览
 * @Author: lan
 * @Date: 2019-12-11 20:54:21
 * @LastEditTime : 2019-12-23 11:16:31
 * @LastEditors  : lan
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

  perfectColumn = () => {
    const { column } = this.props;
    return (
      column &&
      column.map(valueV => {
        const { value, type } = valueV;
        return {
          title: value,
          dataIndex: value,
          key: value,
          align: type === 'dimension' ? 'left' : 'right',
          render: text => {
            // eslint-disable-next-line no-restricted-globals
            if (!isNaN(Number(text))) {
              return <span>{text && text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}</span>;
            }
            return <span>{text}</span>;
          },
        };
      })
    );
  };

  render() {
    const { toggleDrawer, visible, tableData } = this.props;
    const renderColumn = this.perfectColumn();
    return (
      <Drawer
        title="Data Perform"
        width={800}
        visible={visible}
        onClose={() => {
          const { dispatch } = this.props;
          dispatch({
            type: 'dataSet/clear',
          });
          toggleDrawer('dataPerform');
        }}
        destroyOnClose
      >
        <Table columns={renderColumn} dataSource={tableData} scroll={{ x: 'max-content' }} />
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
              const { dispatch } = this.props;
              dispatch({
                type: 'dataSet/clear',
              });
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
