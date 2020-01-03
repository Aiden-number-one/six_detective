import React, { PureComponent, Fragment } from 'react';
import { Transfer, Tree, Icon } from 'antd';
// import classNames from 'classnames';
import _ from 'lodash';
import { connect } from 'dva';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import IconFont from '@/components/IconFont';

import styles from './QuickMenu.less';

const { TreeNode } = Tree;

@connect(({ menu }) => ({
  menuData: menu.menuData,
}))
export default class QuickMenu extends PureComponent {
  state = {
    targetData: [],
    targetKeys: [],
  };

  componentDidMount() {}

  // 左边树
  generateLeftTree = (treeNodes = [], checkedKeys = []) =>
    treeNodes.map(({ children, ...props }) => {
      if (!children || children.length === 0) {
        return (
          <TreeNode
            {...props}
            disabled={checkedKeys.includes(props.key)}
            key={props.key}
            title={
              <TitleMessage
                nodeItem={props}
                onChange={this.onChange}
                operate={{ add: !checkedKeys.includes(props.key) }}
              />
            }
          />
        );
      }
      return (
        <TreeNode {...props} disabled={checkedKeys.includes(props.key)} key={props.key}>
          {this.generateLeftTree(children, checkedKeys)}
        </TreeNode>
      );
    });

  // 右侧树
  generateRightTree = (treeNodes = []) =>
    treeNodes.map(({ ...props }, index) => (
      <TreeNode
        {...props}
        key={props.key}
        title={
          <TitleMessage
            nodeItem={props}
            onChange={this.onChange}
            operate={{
              del: true,
              up: index !== 0,
              down: index !== treeNodes.length - 1,
            }}
            index={index}
          />
        }
      />
    ));

  // 新增删除操作
  onChange = (type, target) => {
    const { targetData, targetKeys } = this.state;
    if (type === 'add') {
      this.setState({
        targetData: [...targetData, target],
        targetKeys: [...targetKeys, target.key],
      });
    }
    if (type === 'del') {
      const index = targetData.findIndex(item => item.key === target.key);
      const newTargetData = [...targetData];
      const newTargetKeys = [...targetKeys];
      newTargetData.splice(index, 1);
      newTargetKeys.splice(index, 1);
      this.setState({
        targetData: newTargetData,
        targetKeys: newTargetKeys,
      });
    }
    if (type === 'up') {
      const index = targetData.findIndex(item => item.key === target.key);
      const newTargetData = [...targetData];
      const newTargetKeys = [...targetKeys];
      newTargetData.splice(index - 1, 0, target);
      newTargetData.splice(index + 1, 1);
      newTargetKeys.splice(index - 1, 0, target.key);
      newTargetKeys.splice(index + 1, 1);
      this.setState({
        targetData: newTargetData,
        targetKeys: newTargetKeys,
      });
    }
    if (type === 'down') {
      const index = targetData.findIndex(item => item.key === target.key);
      const newTargetData = [...targetData];
      const newTargetKeys = [...targetKeys];
      newTargetData.splice(index + 1, 0, target);
      newTargetData.splice(index - 1, 1);
      newTargetKeys.splice(index + 1, 0, target.key);
      newTargetKeys.splice(index - 1, 1);
      this.setState({
        targetData: newTargetData,
        targetKeys: newTargetKeys,
      });
    }
  };

  // 接口菜单数据转化为Ant Tree所需数据
  TreeFolderTrans = value => {
    const dataList = [];
    value.forEach(item => {
      if (item.children) {
        item.children = this.TreeFolderTrans(item.children);
      }
      const param = {
        key: item.menuid,
        value: item.menuid,
        title: item.menuname,
        children: item.children,
        ...item,
      };
      dataList.push(param);
    });
    return dataList;
  };

  render() {
    const { menuData } = this.props;

    const { targetKeys, targetData } = this.state;

    let menuSource = _.cloneDeep(menuData);
    menuSource = this.TreeFolderTrans(menuSource);

    // 树扁平化
    const transferDataSource = [];
    function flatten(list = []) {
      list.forEach(item => {
        if (!item.children || item.children.length === 0) {
          transferDataSource.push(item);
        }
        flatten(item.children);
      });
    }
    flatten(menuSource);

    return (
      <PageHeaderWrapper>
        <Transfer
          className={styles.quickMenu}
          targetKeys={targetKeys}
          dataSource={transferDataSource}
          showSelectAll={false}
        >
          {({ direction, selectedKeys }) => {
            if (direction === 'left') {
              const checkedKeys = [...selectedKeys, ...targetKeys];
              return (
                <Tree blockNode checkStrictly checkedKeys={checkedKeys}>
                  {this.generateLeftTree(menuSource, targetKeys)}
                </Tree>
              );
            }
            if (direction === 'right') {
              return (
                <Tree blockNode checkStrictly>
                  {this.generateRightTree(targetData)}
                </Tree>
              );
            }
            return null;
          }}
        </Transfer>
      </PageHeaderWrapper>
    );
  }
}

class TitleMessage extends PureComponent {
  state = {
    operaterTree: false,
  };

  onMouseEnter = () => {
    this.setState({
      operaterTree: true,
    });
  };

  onMouseLeave = () => {
    this.setState({
      operaterTree: false,
    });
  };

  render() {
    const { nodeItem, onChange, operate, index } = this.props;
    const { operaterTree } = this.state;
    return (
      <Fragment>
        <div
          className={styles.titleWraper}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <span className={styles.mainText}>
            {operate.del ? `${index + 1}.  ${nodeItem.title}` : nodeItem.title}
          </span>
          {operaterTree && (
            <HoverText nodeItem={nodeItem} onChange={onChange} operate={operate} index={index} />
          )}
        </div>
      </Fragment>
    );
  }
}

class HoverText extends PureComponent {
  state = {};

  addTree = (e, treeNode) => {
    e.stopPropagation();
    this.props.onChange('add', treeNode);
  };

  deleteTree = (e, treeNode) => {
    e.stopPropagation();
    this.props.onChange('del', treeNode);
  };

  upTree = (e, treeNode) => {
    e.stopPropagation();
    this.props.onChange('up', treeNode);
  };

  downTree = (e, treeNode) => {
    e.stopPropagation();
    this.props.onChange('down', treeNode);
  };

  render() {
    const { nodeItem, operate } = this.props;
    return (
      <Fragment>
        <span className={styles.hoverText}>
          {operate.add && <Icon type="plus-circle" onClick={e => this.addTree(e, nodeItem)} />}
          {operate.del && <Icon type="minus-circle" onClick={e => this.deleteTree(e, nodeItem)} />}
          {operate.up && <Icon type="up" onClick={e => this.upTree(e, nodeItem)} />}
          {operate.down && <Icon type="down" onClick={e => this.downTree(e, nodeItem)} />}
        </span>
      </Fragment>
    );
  }
}
