/*
 * @Description: 修改数据集名称
 * @Author: lan
 * @Date: 2019-12-11 20:54:21
 * @LastEditTime : 2019-12-23 13:18:49
 * @LastEditors  : lan
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Drawer } from 'antd';

import ClassifyTree from '@/components/ClassifyTree';

export default class MoveDataSetDrawer extends PureComponent {
  static propTypes = {
    classifyTree: PropTypes.array,
    handleMove: PropTypes.func,
    toggleDrawer: PropTypes.func,
    clearRecord: PropTypes.func,
  };

  static defaultProps = {
    classifyTree: [],
    handleMove: () => {},
    toggleDrawer: () => {},
    clearRecord: () => {},
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handleMove } = this.props;
    handleMove();
  };

  // TreeFolderTrans = value => {
  //   const dataList = [];
  //   value.forEach(item => {
  //     if (item.children) {
  //       item.children = this.TreeFolderTrans(item.children);
  //     }
  //     const param = {
  //       key: item.classId,
  //       value: item.classId,
  //       title: item.className,
  //       children: item.children,
  //     };
  //     dataList.push(param);
  //   });
  //   return dataList;
  // };

  render() {
    const { classifyTree, toggleDrawer, clearRecord, visible, changeActiveFolderId } = this.props;
    return (
      <Drawer
        title="Move To"
        width={370}
        visible={visible}
        onClose={() => {
          clearRecord();
          toggleDrawer('move');
        }}
        destroyOnClose
      >
        <ClassifyTree
          treeData={classifyTree}
          treeKey={{
            currentKey: 'classId',
            currentName: 'className',
          }}
          showSearch={false}
          onSelect={value => {
            changeActiveFolderId(value);
          }}
        />
        {/* // <TreeSelect
          //   treeData={classifyTree}
          //   placeholder="Please select"
          //   // treeDefaultExpandAll
          // />, */}
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
              clearRecord();
              toggleDrawer('move');
            }}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} type="primary">
            Submit
          </Button>
        </div>
      </Drawer>
    );
  }
}
