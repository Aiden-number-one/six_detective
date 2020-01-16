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
    const {
      sql,
      dispatch,
      connectDropTarget,
      visible,
      sqlItem,
      datasetType,
      inputSql,
      alterInputSql,
      dbConnection,
    } = this.props;
    const menu = (
      <Menu
        onClick={e => {
          let insertSql = '';
          if (e.key === '1') {
            insertSql = sqlItem.name;
            dispatch({
              type: 'sqlKeydown/changeSql',
              payload: inputSql + insertSql,
            });
            alterInputSql(inputSql + insertSql);
          } else {
            dispatch({
              type: 'sqlKeydown/querySql',
              payload: {
                tableId: sqlItem.id,
              },
              callback: value => {
                dispatch({
                  type: 'sqlKeydown/changeSql',
                  payload: inputSql + value,
                });
                alterInputSql(inputSql + value);
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
    const proMenu = (
      <Menu
        onClick={() => {
          const procedureName = sqlItem.name;
          dispatch({
            type: 'sqlDataSource/getProcStatement',
            payload: {
              dbConnection,
              procedureName,
              procType: '2',
            },
            callback: value => {
              const params = value.map(item => {
                if (item.IN_OUT === 'IN') {
                  return `\${${item.ARGUMENT_NAME}}`;
                }
                return '?';
              });
              const insertProceduce = `CALL ${procedureName}(${params.join(',\n')})`;
              dispatch({
                type: 'sqlKeydown/changeSql',
                payload: inputSql + insertProceduce,
              });
              alterInputSql(inputSql + insertProceduce);
            },
          });
          dispatch({
            type: 'sqlKeydown/changeSqlDropDown',
            payload: false,
          });
        }}
      >
        <Menu.Item key="1">Call</Menu.Item>
      </Menu>
    );
    let placeHolder;
    if (datasetType === 'SQL') {
      placeHolder = `  Please Input ${datasetType}, Input $[abc] as a parameter, abc is a parameter name. For example: select * from table where id = $[abc]`
        .replace('[', '{')
        .replace(']', '}');
    } else {
      placeHolder = `  Please Input ${datasetType}, Input $[abc] as a parameter, abc is a parameter name. For example: call db2.api($[abc])`
        .replace('[', '{')
        .replace(']', '}');
    }
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
        {!inputSql && !sql && (
          <span
            style={{
              position: 'absolute',
              left: 40,
              top: 5,
              color: 'rgba(0, 0, 0, 0.25)',
              fontSize: 14,
            }}
          >
            {placeHolder}
          </span>
        )}
        <Dropdown
          overlay={datasetType === 'SQL' ? menu : proMenu}
          onVisibleChange={() => {}}
          visible={visible}
        >
          <div style={{ visibility: 'hidden', position: 'absolute', top: 50, left: 70 }} />
        </Dropdown>
        <CodeMirror
          value={sql}
          options={options}
          onChange={(editor, data, value) => {
            alterInputSql(value);
            dispatch({
              type: 'sqlDataSource/setVariableList',
              payload: [],
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
