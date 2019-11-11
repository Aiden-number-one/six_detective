import React, { Component } from 'react';
import { Tree, Input } from 'antd';

const { TreeNode } = Tree;
const { Search } = Input;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i += 1) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
  return true;
};
generateData(z);

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i += 1) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

function loop(orgsTree) {
  return (
    orgsTree &&
    orgsTree.map(item => {
      const { children, folderId, folderName, parentId } = item;
      if (children) {
        return (
          <TreeNode key={folderId} title={folderName} parentId={parentId}>
            {loop(children)}
          </TreeNode>
        );
      }
      return <TreeNode key={folderId} title={folderName} parentId={parentId} />;
    })
  );
}
class LeftClassifyTree extends Component {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = e => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      autoExpandParent: true,
    });
  };

  render() {
    const { expandedKeys, autoExpandParent } = this.state;
    const { getFolderMenuListData } = this.props;
    // const loop = data =>
    //   data.map(item => {
    //     const index = item.title.indexOf(searchValue);
    //     const beforeStr = item.title.substr(0, index);
    //     const afterStr = item.title.substr(index + searchValue.length);
    //     debugger
    //     const title =
    //       index > -1 ? (
    //         <span>
    //           {beforeStr}
    //           <span style={{ color: '#f50' }}>{searchValue}</span>
    //           {afterStr}
    //         </span>
    //       ) : (
    //         <span>{item.title}</span>
    //       );
    //     if (item.children) {
    //       return (
    //         <TreeNode key={item.key} title={title}>
    //           {loop(item.children)}
    //         </TreeNode>
    //       );
    //     }
    //     return <TreeNode key={item.key} title={title} />;
    //   });

    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
        <Tree
          showLine
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        >
          {loop(getFolderMenuListData.items)}
        </Tree>
      </div>
    );
  }
}

export default LeftClassifyTree;
