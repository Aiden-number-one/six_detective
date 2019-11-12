import React, { Component } from 'react';
import { Tree, Input } from 'antd';

const { TreeNode } = Tree;
const { Search } = Input;

const dataList = [];
let searchValue = '';

const getParentKey = (folderId, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.folderId === folderId)) {
        parentKey = node.folderId;
      } else if (getParentKey(folderId, node.children)) {
        parentKey = getParentKey(folderId, node.children);
      }
    }
  }
  return parentKey;
};

function pregQuote(str) {
  return str.replace(/([\\.+*?[^]$(){}=!<>|:])/g, '\\$1');
}

function loop(orgsTree) {
  return (
    orgsTree &&
    orgsTree.map(item => {
      const { children, folderId, folderName, parentId } = item;
      let index = -1;
      if (searchValue) {
        index = item.folderName.indexOf(searchValue);
      }
      let lineTitle = `<span>${item.folderName.replace(
        new RegExp(`(${pregQuote(searchValue)})`, 'gi'),
        "<span style='color:#f00'>$1</span>",
      )}</span>`;
      // eslint-disable-next-line react/no-danger
      lineTitle = <div dangerouslySetInnerHTML={{ __html: lineTitle }} />;
      const showTitle = index > -1 ? lineTitle : item.folderName;
      if (children && showTitle) {
        return (
          <TreeNode key={folderId} title={showTitle} parentId={parentId}>
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
    initData: [],
    expandedKeys: [],
    autoExpandParent: true,
  };

  static getDerivedStateFromProps(props) {
    const items = props.getFolderMenuListData && props.getFolderMenuListData.items;
    return {
      initData: items,
    };
  }

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  generateList = data => {
    for (let i = 0; i < data.length; i += 1) {
      const node = data[i];
      const { folderId, folderName } = node;
      dataList.push({ folderId, folderName });
      if (node.children) {
        this.generateList(node.children);
      }
    }
  };

  onChange = e => {
    const { value } = e.target;
    searchValue = value;
    if (!value) {
      this.setState({
        autoExpandParent: false,
      });
      return;
    }
    const expandedKeys = dataList.map(item => {
      if (item.folderName.indexOf(value) > -1) {
        return getParentKey(item.folderId, this.state.initData);
      }
      return null;
    });

    this.setState({
      expandedKeys,
      autoExpandParent: true,
    });
  };

  render() {
    const { expandedKeys, autoExpandParent } = this.state;
    const { getFolderMenuListData } = this.props;
    if (getFolderMenuListData.items) {
      this.generateList(getFolderMenuListData.items);
    }
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
