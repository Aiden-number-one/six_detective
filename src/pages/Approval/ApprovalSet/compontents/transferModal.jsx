/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { Modal, Tree, Transfer } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
// import styles from './ApprovalSet.less';
const { TreeNode } = Tree;
const isChecked = (selectedKeys, eventKey) => selectedKeys.indexOf(eventKey) !== -1;

const generateTree = (treeNodes = [], checkedKeys = []) =>
  treeNodes.map(({ childRole, ...props }) => (
    <TreeNode
      {...props}
      disabled={checkedKeys.includes(childRole ? props.groupId : props.roleId)}
      key={childRole ? props.groupId : props.roleId}
      title={childRole ? props.groupName : props.roleName}
    >
      {generateTree(childRole, checkedKeys)}
    </TreeNode>
  ));
const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach(item => {
      if (item.roleId) {
        item.key = item.roleId;
      }
      transferDataSource.push(item);
      flatten(item.childRole);
    });
  }
  flatten(dataSource);
  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={item => item.roleName}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              checkedKeys={checkedKeys}
              onCheck={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
              }}
              onSelect={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
              }}
            >
              {generateTree(dataSource, targetKeys)}
            </Tree>
          );
        }
        return null;
      }}
    </Transfer>
  );
};

@connect(({ approvalSet, loading }) => ({
  loading: loading.effects['approvalSet/approvalConfigDatas'],
  approvalConfigList: approvalSet.data,
  deployedModelDatas: approvalSet.deployedModelDatas,
  processDefinitionId: approvalSet.processDefinitionId,
  roleGroupTree: approvalSet.roleGroupDatas,
}))
class TransferModal extends PureComponent {
  state = {
    // targetKeys: [],
    // auditInfo: [],
    // allChooseObj: {},
  };

  componentDidMount() {}

  render() {
    const {
      visible,
      closeTransferModal,
      roleGroupTree,
      handleTransferOk,
      onTransferChange,
      targetKeys,
    } = this.props;
    // const { targetKeys } = this.state;
    // console.log('roleGroupTree-----',roleGroupTree,targetKeys)
    return (
      <div>
        <Modal
          title="审核人设置"
          visible={visible}
          closable={false}
          width={600}
          height={600}
          onCancel={closeTransferModal}
          onOk={handleTransferOk}
        >
          <TreeTransfer
            dataSource={roleGroupTree}
            targetKeys={targetKeys}
            onChange={onTransferChange}
          />
        </Modal>
      </div>
    );
  }
}
export default TransferModal;
