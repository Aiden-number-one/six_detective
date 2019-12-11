import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Dropdown } from 'antd';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { DropTarget } from 'react-dnd';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/theme/ambiance.css';

const options = {
  lineNumbers: true, // 显示行号
  mode: { name: 'text/x-mysql' }, // 定义mode
  extraKeys: { Ctrl: 'autocomplete' }, // 自动提示配置
};

class CodeMirrorComponent extends Component {
  render() {
    const { sql, dispatch, connectDropTarget, visible, sqlItem } = this.props;
    const menu = (
      <Menu
        onClick={e => {
          let insertSql = '';
          if (e.key === '1') {
            insertSql = sqlItem.name;
            dispatch({
              type: 'sqlKeydown/changeSql',
              payload: sql + insertSql,
            });
          } else {
            dispatch({
              type: 'sqlKeydown/querySql',
              payload: {
                tableId: sqlItem.id,
              },
            });
          }
          dispatch({
            type: 'sqlKeydown/changeSqlDropDown',
            payload: false,
          });
        }}
      >
        <Menu.Item key="1">Name</Menu.Item>
        <Menu.Item key="2">Select</Menu.Item>
      </Menu>
    );
    return connectDropTarget(
      <div
        style={{ position: 'relative' }}
        onClick={() => {
          if (visible) {
            dispatch({
              type: 'sqlKeydown/changeSqlDropDown',
              payload: false,
            });
          }
        }}
      >
        {!sql && (
          <span
            style={{
              position: 'absolute',
              left: 30,
              top: 5,
              zIndex: 100,
              color: 'rgba(0, 0, 0, 0.25)',
              fontSize: 14,
            }}
          >
            请从此处开始编写SQL
          </span>
        )}
        <Dropdown overlay={menu} onVisibleChange={() => {}} visible={visible}>
          <div style={{ visibility: 'hidden', position: 'absolute', top: 50, left: 70 }} />
        </Dropdown>
        <CodeMirror
          value={sql}
          options={options}
          onChange={(editor, data, value) => {
            dispatch({
              type: 'sqlKeydown/changeSql',
              payload: value,
            });
          }}
        />
      </div>,
    );
  }
}

const targetSpec = {
  drop(props, monitor) {
    const { dispatch } = props;
    const { item } = monitor.getItem();
    dispatch({
      type: 'sqlKeydown/changeSqlDropDown',
      payload: true,
    });
    dispatch({
      type: 'sqlKeydown/changeSqlItem',
      payload: item,
    });
  },
};

const WrapperDropContent = DropTarget('sqlAdd', targetSpec, (connected, monitor) => ({
  connectDropTarget: connected.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(CodeMirrorComponent);

export default connect(({ sqlKeydown }) => ({
  sql: sqlKeydown.sql,
  visible: sqlKeydown.visible,
  sqlItem: sqlKeydown.sqlItem,
}))(WrapperDropContent);
