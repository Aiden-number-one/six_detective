import React, { PureComponent, useState } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { Icon, Tree } from 'antd';
import { DragSource } from 'react-dnd';
import { FormattedMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import DropSelect from '../DropSelect';
import styles from './index.less';
import { dataSetTree } from '../../utils';

const { TreeNode } = Tree;

@connect(({ reportDesigner, loading }) => ({
  dataSetPublicList: reportDesigner.dataSetPublicList, // 公共数据集
  dataSetPrivateList: reportDesigner.dataSetPrivateList, // 私人数据集
  loading: loading.effects['reportDesigner/getPublicDataSet'],
}))
export default class LeftSideBar extends PureComponent {
  state = {};

  componentDidMount() {
    this.getPublicDataSet();
  }

  // 获取数据集
  getPublicDataSet = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportDesigner/getPublicDataSet',
      payload: {
        pageNumber: '1',
        pageSize: '999',
      },
    });
  };

  // 设置私有数据集
  setPrivateList = dataSetPrivateList => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportDesigner/setDataSetPrivateList',
      payload: dataSetPrivateList,
    });
  };

  // 渲染树结构
  generateTree = treeData => {
    const { displayDraw, displayDeletePrivate } = this.props;
    return treeData.map(item => {
      if (item.children) {
        return (
          <TreeNode
            key={item.key}
            title={
              <WrapperTitle
                title={item.title}
                isParent={item.otherInfo}
                isLeaf={item.isLeaf} // 是否是叶子节点
                displayDraw={() => {
                  displayDraw(item);
                }}
                deleteModal={() => {
                  displayDeletePrivate(true, item.key);
                }}
              />
            }
          >
            {this.generateTree(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.key}
          title={
            <WrapperTitle
              title={item.title} // title
              isLeaf={item.isLeaf} // 是否是叶子节点
              dragInfo={item.dragInfo}
            />
          }
        />
      );
    });
  };

  // 根据数据集的选择，来渲染出数据集的列与SqlParams
  // onChangeDataSet = dataSetId => {
  //   // const { dispatch } = this.props;
  // };

  render() {
    const {
      dataSetPublicList = [],
      dataSetPrivateList = [],
      loading,
      leftSideCollapse,
      changeLeftSideBar,
      displayDropSelect,
      changedisplayDropSelect,
    } = this.props;
    // 给予DropSelect的Props
    const dropSelectProps = {
      loading, // dropSelect的loading
      data: dataSetPublicList, // 公共数据集列表
      privateData: dataSetPrivateList, // 私有数据集
      getPublicDataSet: this.getPublicDataSet, // 刷新公有数据集
      setPrivateList: this.setPrivateList, // 设置私有数据集
      displayDropSelect, // 是否显示drop select
      changedisplayDropSelect, // 显示drop select
    };
    const dataSetPrivateListTree = dataSetTree(dataSetPrivateList);
    return (
      <div className={classNames(styles.layout, styles.sideBar, styles.left)}>
        <div className={styles.topList}>
          <div className={styles.header}>
            {leftSideCollapse && (
              <div className={styles.title}>
                {<FormattedMessage id="report-designer.dataset" />}
              </div>
            )}
            <IconFont
              type={leftSideCollapse ? 'iconleft' : 'iconright'}
              onClick={() => {
                changeLeftSideBar(!leftSideCollapse);
              }}
            />
          </div>
          {leftSideCollapse && (
            <>
              <DropSelect
                {...dropSelectProps}
                addon={() => (
                  <div className={styles.addon}>
                    <Icon type="form" />
                  </div>
                )}
              />
              <div className={styles.tree}>
                <Tree>{this.generateTree(dataSetPrivateListTree)}</Tree>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

function Title({ title, isLeaf, displayDraw, connectDragSource, isParent, deleteModal }) {
  const [hoverState, hoverAction] = useState(false);
  return (
    <div
      className={styles.treeTitle}
      onMouseEnter={e => {
        e.stopPropagation();
        hoverAction(true);
      }}
      onMouseLeave={e => {
        e.stopPropagation();
        hoverAction(false);
      }}
    >
      <div className={styles.hoverArea} />
      {hoverState && <div className={styles.hoverBlock} />}
      {connectDragSource(
        <span className={styles.title}>
          {/* 叶子不展示文件夹标志 */}
          {!isLeaf && (
            <>
              <span className="folder">
                <Icon type="folder" />
              </span>
              <span className="folderOpen">
                <Icon type="folder-open" />
              </span>
            </>
          )}
          <span style={{ marginLeft: '3.5px' }}>{title}</span>
        </span>,
      )}
      {hoverState && (
        <div className={styles.operationArea}>
          {isParent && (
            <>
              <IconFont
                type="icon-edit"
                onClick={() => {
                  displayDraw();
                }}
              />
              <IconFont
                type="icon-delete"
                onClick={() => {
                  deleteModal();
                }}
                style={{ marginLeft: 3 }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

const sourceSpec = {
  beginDrag(
    props,
    // monitor,
    // component
  ) {
    return {
      dragInfo: props.dragInfo,
    };
  },
  // endDrag(props) {
  //   // props可包含 ConnList的所有
  // },
};

const WrapperTitle = DragSource('dragTitle', sourceSpec, (connected, monitor) => ({
  connectDragSource: connected.dragSource(),
  connectDragPreview: connected.dragPreview(),
  isDragging: monitor.isDragging(),
}))(Title);
