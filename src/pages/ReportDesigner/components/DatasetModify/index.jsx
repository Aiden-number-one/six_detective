/* eslint-disable no-template-curly-in-string */
import React, { PureComponent } from 'react';
import { Row, Col, Button, Form, Input, Select, message } from 'antd';
import { connect } from 'dva';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import styles from './index.less';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/theme/ambiance.css';

const { Option } = Select;

const options = {
  lineNumbers: true, // 显示行号
  mode: { name: 'text/x-mysql' }, // 定义mode
  extraKeys: { Ctrl: 'autocomplete' }, // 自动提示配置
};

@Form.create()
@connect(
  ({ privateDataSetEdit }) => ({
    variableList: privateDataSetEdit.variableList,
    sql: privateDataSetEdit.sql,
  }),
  null,
  null,
  {
    pure: false,
  },
)
export default class DatasetModify extends PureComponent {
  componentDidMount() {
    const { dispatch, currentSelectDataSetOtherInfo = {} } = this.props;
    dispatch({
      type: 'privateDataSetEdit/setVariableList',
      payload: currentSelectDataSetOtherInfo.datasetParams || [],
    });
    dispatch({
      type: 'privateDataSetEdit/changeSql',
      payload: currentSelectDataSetOtherInfo.commandText,
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'privateDataSetEdit/clear',
    });
  }

  // 进行数据集编辑保存
  onSave = async e => {
    e.preventDefault();
    const {
      dispatch,
      variableList,
      form: { validateFieldsAndScroll },
      currentSelectDataSetOtherInfo,
      onClose,
    } = this.props;
    const fields = await dispatch({
      type: 'privateDataSetEdit/getField',
      payload: {
        commandText: this.sql,
        datasourceId: currentSelectDataSetOtherInfo.datasourceId,
      },
    });
    if (!Array.isArray(fields)) {
      message.warn(fields);
      return false;
    }
    validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      // 内部json保存完毕，进行保存接口
      dispatch({
        type: 'reportDesigner/modifyDataSetPrivate',
        payload: {
          dataSetId: currentSelectDataSetOtherInfo.datasetId,
          props: {
            dataset_name: values.datasetName,
            dataset_type: values.datasetType,
            fields,
            query: {
              parameters: variableList,
              command_text: this.sql,
            },
          },
        },
      });
      onClose();
    });
    return true;
  };

  // 获取参数设置
  getVariableList = () => {
    const { dispatch, currentSelectDataSetOtherInfo = {} } = this.props;
    dispatch({
      type: 'privateDataSetEdit/getVariable',
      payload: {
        scriptContent: this.sql || currentSelectDataSetOtherInfo.commandText,
      },
    });
  };

  // 进行参数格式化
  formatSQL = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'privateDataSetEdit/changeSql',
      payload: this.sql,
    });
    dispatch({
      type: 'privateDataSetEdit/sqlFormated',
      payload: {
        scriptContent: this.sql,
      },
    });
  };

  render() {
    const {
      sql,
      form: { getFieldDecorator },
      currentSelectDataSetOtherInfo = {},
      variableList = [],
      onClose,
    } = this.props;
    return (
      <div className={styles.modifyDataSet}>
        <Form>
          <Form.Item label="Name of Data Set" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('datasetName', {
              rules: [
                {
                  required: true,
                  message: 'Name of Data Set should not be empty',
                },
              ],
              initialValue: currentSelectDataSetOtherInfo.datasetName,
            })(<Input placeholder="Please Input Name of Data Set" />)}
          </Form.Item>
          <Form.Item label="Type of Data Set" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('datasetType', {
              rules: [
                {
                  required: true,
                  message: 'Name of Data Set should not be empty',
                },
              ],
              initialValue: currentSelectDataSetOtherInfo.datasetType,
            })(
              <Select placeholder="Please Input Name of Data Set">
                <Option value="SQL">SQL</Option>
                <Option value="PROCEDURE">Stored Procedure</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item
            label=" "
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            className={styles.codeMirrorStyle}
          >
            <CodeMirror
              value={sql}
              options={options}
              onChange={(editor, data, value) => {
                this.sql = value;
              }}
            />
            <div className={styles.tips}>
              <span className={styles.desSpan}>
                {
                  'Input ${abc} as a parameter, abc is a parameter name. For example: select * from table where id = ${abc}'
                }
              </span>
              <div className={styles.buttCollection}>
                <Button
                  type="button"
                  onClick={() => {
                    this.getVariableList();
                  }}
                >
                  Parameter Setting
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    this.formatSQL();
                  }}
                >
                  Format
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
        {/* 编辑数据集相关 */}
        {variableList.length > 0 && (
          <Form.Item label=" " labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <div className={styles.inputCollection}>
              <span className={styles.valueName}>Variable Name</span>
              <span className={styles.valueType}>Variable Type</span>
              <span className={styles.value}>Value</span>
            </div>
            {variableList.map(value => (
              <div className={styles.inputCollection}>
                <Input className={styles.valueName} value={value.parameter_name} disabled />
                <Input className={styles.valueType} value={value.parameter_type} disabled />
                <Input className={styles.value} value={value.parameter_value} />
              </div>
            ))}
          </Form.Item>
        )}

        <Row
          type="flex"
          justify="end"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Col>
            <Button onClick={onClose} style={{ marginRight: 10 }}>
              CANCEL
            </Button>
            <Button type="primary" onClick={this.onSave}>
              SAVE
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
