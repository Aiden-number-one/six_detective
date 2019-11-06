import React from 'react';
import { Checkbox, Button } from 'antd';
import styles from './index.less';

export default ({
  showSelect = false, // 是否显示全选
  showEdit = false, // 是否显示
  selectAll = () => {}, // 全选事件
  addTableData = () => {}, // 添加表格数据
  deleteTableData = () => {}, // 删除表格数据
  editTableData = () => {}, // 编辑表格数据
}) => (
  <div className={styles.tableHeader}>
    {showSelect && <Checkbox onChange={selectAll}>Select All</Checkbox>}
    {showEdit && (
      <div>
        <Button
          onClick={deleteTableData}
          size="small"
          type="danger"
          icon="delete"
          className="btn2"
        />
        <Button onClick={editTableData} size="small" type="primary" icon="edit" className="btn2" />
        <Button onClick={addTableData} size="small" type="primary" icon="plus" className="btn2" />
      </div>
    )}
  </div>
);
