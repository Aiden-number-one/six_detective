import React, { Component } from 'react';
import { Modal, Tree, Spin } from 'antd';
import { connect } from 'dva';
// import { formatMessage } from 'umi/locale';
import styles from '../AddDataSource.less';

const { TreeNode } = Tree;

// 文件夹弹框
@connect(({ dataSource, tableData, loading }) => ({
  metaData: tableData.metaData,
  activeCID: dataSource.activeCID,
  loading: loading.effects['dataSource/addMetaData'],
  fetchloading: loading.effects['dataSource/getMetaData'],
}))
class ImportMetaData extends Component {
  state = {
    checkedKeys: [],
  };

  componentWillReceiveProps(props) {
    const { metaData } = props;
    const checkedKeys = [];
    if (metaData.length > 0) {
      metaData[0].tableList.forEach(item => {
        if (item.isExist === 'Y') {
          checkedKeys.push(
            (metaData[0].schemaName ? `${metaData[0].schemaName}.` : '') + item.tableName,
          );
        }
      });
    }
    this.setState({
      checkedKeys,
    });
  }

  okHandle = () => {
    if (this.preventClick) {
      return false;
    }
    const { dispatch, activeCID, toggleModal } = this.props;
    const { checkedKeys } = this.state;
    const selectKey = checkedKeys
      .filter(value => value.indexOf('schemaParentFilter') === -1)
      .join(',');
    // 此处代码较慢，所以暂时阻止点击
    this.preventClick = true;
    dispatch({
      type: 'tableData/addMetaData',
      payload: {
        connectionId: activeCID,
        tablesInfo: selectKey,
      },
      callback: () => {
        // 调用完毕后，恢复preventClick
        this.preventClick = false;
        toggleModal('importMetaData');
        dispatch({
          type: 'tableData/getTableData',
          payload: {
            connection_id: activeCID,
            pageNumber: '1',
            pageSize: '10',
          },
        });
      },
    });
    return false;
  };

  renderTreeNodes = (data, schemaName) =>
    data.map(item => {
      if (item.tableList) {
        return (
          <TreeNode
            title={item.schemaName}
            key={`${item.schemaName}-schemaParentFilter`}
            dataRef={item}
          >
            {this.renderTreeNodes(item.tableList, item.schemaName)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.tableName}
          key={(schemaName ? `${schemaName}.` : '') + item.tableName}
        />
      );
    });

  render() {
    const { visible, toggleModal, metaData, loading = false, fetchloading = false } = this.props;
    const { okHandle } = this;
    const { checkedKeys } = this.state;
    return (
      <Modal
        destroyOnClose
        title="Import Mete Data"
        visible={visible}
        onOk={okHandle}
        onCancel={() => toggleModal('importMetaData')}
        wrapClassName="modal"
        okText="确定"
        cancelText="取消"
        style={{ top: 70 }}
      >
        <Spin tip={<span className={styles.spanTips}>加载中...</span>} spinning={loading}>
          <Spin tip={<span className={styles.spanTips}>加载中...</span>} spinning={fetchloading}>
            <div style={{ height: 400, overflow: 'auto' }}>
              {metaData.length > 0 && (
                <Tree
                  onCheck={Keys => {
                    this.setState({
                      checkedKeys: Keys,
                    });
                  }}
                  checkedKeys={checkedKeys}
                  checkable
                  defaultExpandAll
                >
                  {this.renderTreeNodes(metaData)}
                </Tree>
              )}
            </div>
          </Spin>
        </Spin>
      </Modal>
    );
  }
}

export default ImportMetaData;
