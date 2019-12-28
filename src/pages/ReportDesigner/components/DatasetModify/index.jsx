/* eslint-disable no-template-curly-in-string */
import React, { PureComponent } from 'react';
import { Row, Col, Button, Form, Input } from 'antd';
import { connect } from 'dva';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import styles from './index.less';
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

@Form.create()
@connect(() => ({}))
export default class DatasetModify extends PureComponent {
  onSave = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: ''
    // });
  };

  render() {
    const {
      form: { getFieldDecorator },
      currentSelectDataSetOtherInfo = {},
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
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: 'Name of Data Set should not be empty',
                },
              ],
              initialValue: currentSelectDataSetOtherInfo.datasetType,
            })(<Input placeholder="Please Input Name of Data Set" />)}
          </Form.Item>
          <Form.Item
            label=" "
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            className={styles.codeMirrorStyle}
          >
            <CodeMirror
              value={currentSelectDataSetOtherInfo.commandText}
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
                <button type="button">Parameter Setting</button>
                <button type="button">Format</button>
              </div>
            </div>
          </Form.Item>
        </Form>
        {/* 编辑数据集相关 */}
        <Form.Item label=" " labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <div className={styles.inputCollection}>
            <span className={styles.valueName}>Variable Name</span>
            <span className={styles.valueType}>Variable Type</span>
            <span className={styles.value}>Value</span>
          </div>
          <div className={styles.inputCollection}>
            <Input className={styles.valueName} />
            <Input className={styles.valueType} />
            <Input className={styles.value} />
          </div>
        </Form.Item>
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
            <Button onClick={this.onCancel}>CANCEL</Button>
            <Button type="primary" onClick={this.onSave}>
              SAVE
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
