import React, { PureComponent } from 'react';
import { Checkbox, Button, Modal } from 'antd';
import styles from './index.less';

export default class StandardTable extends PureComponent {
  state = {};

  static defaultProps = {
    showSelect: false, // 是否显示全选按钮
    showEdit: false, // 是否宣誓编辑区
    deleteTableData: () => {}, // 删除数据
    editTableData: () => {}, // 编辑数据
    addTableData: () => {}, // 添加数据
  };

  render() {
    const { showEdit, showSelect, deleteTableData, editTableData, addTableData } = this.props;
    return (
      <>
        <div className={styles.tableHeader}>
          <Checkbox style={{ visibility: showSelect ? 'visible' : 'hidden' }} showSelect>
            Select All
          </Checkbox>
          {showEdit && (
            <div>
              <Button
                style={{ visibility: showEdit ? 'visible' : 'hidden' }}
                onClick={deleteTableData}
                size="small"
                type="danger"
                icon="delete"
                className="btn2"
              />
              <Button
                onClick={editTableData}
                size="small"
                type="primary"
                icon="edit"
                className="btn2"
              />
              <Button
                onClick={addTableData}
                size="small"
                type="primary"
                icon="plus"
                className="btn2"
              />
            </div>
          )}
        </div>
        {/* 删除弹出框 */}
        <Modal />
      </>
    );
  }
}
