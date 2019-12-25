import React, { PureComponent } from 'react';
import { Row, Col, Button, Form, Input } from 'antd';
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
export default class DatasetModify extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.modifyDataSet}>
        <Form>
          <Form.Item label="Name of Data Set" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: 'Name of Data Set should not be empty',
                },
              ],
              initialValue: undefined,
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
              initialValue: undefined,
            })(<Input placeholder="Please Input Name of Data Set" />)}
          </Form.Item>
          <Form.Item
            label=" "
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            className={styles.codeMirrorStyle}
          >
            <CodeMirror
              value="select * from aaaaaa"
              options={options}
              onChange={(editor, data, value) => {
                this.sql = value;
                // dispatch({
                //   type: 'sqlKeydown/changeSql',
                //   payload: value,
                // });
              }}
            />
            <div className={styles.tips}></div>
          </Form.Item>
        </Form>

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
