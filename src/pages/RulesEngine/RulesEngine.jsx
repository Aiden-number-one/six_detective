import React, { PureComponent, Fragment, Component } from 'react';
import { Select, Icon, Modal, List, Radio, Input } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import styles from './RulesEngine.less';

const { Option } = Select;
const opMap = {
  '>=': '大于或等于',
  '>': '大于',
  '=': '等于',
  '<': '小于',
  '<=': '小于或等于',
};
const typeData = ['年龄', '性别', '婚否'];
const judgeData = ['>=', '>', '=', '<', '<='];
@connect(state => ({
  rulesEngine: state.rulesEngine,
}))
export default class RulesEngine extends PureComponent {
  state = {
    visible: false,
    chooseData: [],
    childData: {},
    chooseType: '',
    isShowRadio: false,
    radioValue: 'select',
    inputValue: '',
  };

  componentDidMount() {}

  // 添加节点
  modifyData = children => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesEngine/addNode',
      payload: { children },
    });
  };

  // 删除节点
  deleteData = (deleteChildren, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesEngine/deleteNode',
      payload: {
        deleteDom: deleteChildren,
        place: index,
      },
    });
  };

  // 改变radio类型
  onChange = e => {
    const { childData } = this.state;
    if (e.target.value === 'select' && !childData.valueEnum) {
      childData.valueEnum = ['是', '否'];
      this.setState({
        chooseData: childData.valueEnum,
      });
    }
    childData.valueType = e.target.value;
    this.setState({
      radioValue: e.target.value,
      chooseType: e.target.value,
    });
  };

  // 选择类型 keyField: 'car'
  chooseCar = (child, type) => {
    this.chooseType(child, type);
  };

  // 选择类型 opType: 'judge'
  judge = (child, type) => {
    this.chooseType(child, type);
  };

  // 选择类型 value: 'valueType'
  chooseValue = (child, type) => {
    this.chooseType(child, type);
  };

  // 选择类型
  chooseType = (child, type) => {
    const { keyField, valueType, valueEnum } = child;
    switch (type) {
      case valueType:
        this.setState({
          chooseData: valueEnum,
          chooseType: type,
          isShowRadio: true,
          radioValue: type,
        });
        break;
      case keyField:
        this.setState({
          chooseData: typeData,
          chooseType: type,
          isShowRadio: false,
        });
        break;
      default:
        this.setState({
          chooseData: judgeData,
          chooseType: type,
          isShowRadio: false,
        });
    }
    this.setState({
      childData: child,
    });
    this.showModal();
  };

  // 选择列表项内容
  chooseItem = item => {
    const { childData, chooseType } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesEngine/selectItem',
      payload: {
        chooseType,
        item,
        childData,
      },
    });
    this.handleOk();
  };

  // 展示弹窗
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  // 弹窗确认
  handleOk = () => {
    const { childData, inputValue, chooseType } = this.state;
    if (chooseType === 'input') {
      childData.value = inputValue;
    }
    this.setState({
      visible: false,
    });
  };

  // 取消弹窗
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 获取input输入框的值
  onChangeValue = e => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  render() {
    const { rulesEngine } = this.props;
    const { ruleData } = rulesEngine;
    const { visible, chooseData, radioValue, isShowRadio } = this.state;
    const isShowList = radioValue === 'select';
    return (
      <Fragment>
        <Node
          data={ruleData}
          modifyData={this.modifyData}
          deleteData={this.deleteData}
          chooseCar={this.chooseCar}
          judge={this.judge}
          chooseValue={this.chooseValue}
        />
        <Modal
          title="请选择选项"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {isShowRadio ? (
            <Radio.Group onChange={this.onChange} value={radioValue}>
              <Radio value="select">下拉选项</Radio>
              <Radio value="input">输入框</Radio>
            </Radio.Group>
          ) : null}

          {!isShowRadio || (isShowRadio && isShowList) ? (
            <List
              size="small"
              bordered
              dataSource={chooseData}
              renderItem={item => (
                <List.Item
                  onClick={() => {
                    this.chooseItem(item);
                  }}
                >
                  {item}
                </List.Item>
              )}
            />
          ) : (
            <Input placeholder="请输入值" onChange={this.onChangeValue} />
          )}
        </Modal>
      </Fragment>
    );
  }
}

class Node extends Component {
  render() {
    const {
      data,
      modifyData,
      deleteData,
      chooseCar,
      judge,
      chooseValue,
      index: indexProps,
      length,
    } = this.props;
    const { op, children } = data;
    return (
      <div className={styles.rulesEngine}>
        {indexProps && <JoinLine index={indexProps} length={length} needFill />}
        <Select ref={this.selectRef} defaultValue={op} className={styles.conditionSelect}>
          <Option value="and">并且</Option>
          <Option value="or">或者</Option>
        </Select>
        <div className={styles.contentCollection}>
          {children.map((child, index) => {
            if (child.actionType === 'set') {
              return (
                <Node
                  data={child}
                  modifyData={modifyData}
                  deleteData={deleteData}
                  index={index}
                  length={children.length}
                  chooseCar={chooseCar}
                  judge={judge}
                  chooseValue={chooseValue}
                />
              );
            }
            const left = `${child.keyEntityName}.${child.keyFiledName}`;
            const { op: childOp, value } = child;
            return (
              <Content
                left={left}
                op={childOp}
                right={value}
                index={index}
                length={children.length}
                chooseData={child}
                chooseCar={chooseCar}
                judge={judge}
                chooseValue={chooseValue}
                childrenData={children}
                deleteData={deleteData}
              />
            );
          })}
          <Icon
            type="plus-circle"
            style={{ fontSize: 16 }}
            onClick={() => {
              modifyData(children);
            }}
          />
        </div>
      </div>
    );
  }
}

function Content({
  left,
  op,
  right,
  index,
  length,
  deleteData,
  childrenData,
  chooseData,
  chooseCar,
  judge,
  chooseValue,
}) {
  return (
    <div className={styles.content}>
      <JoinLine index={index} length={length} />
      <span
        className={styles.item}
        style={{ color: 'blue' }}
        onClick={() => {
          chooseCar(chooseData, chooseData.keyField);
        }}
      >
        {left}
      </span>
      <span
        className={styles.item}
        style={{ color: 'red' }}
        onClick={() => {
          judge(chooseData, chooseData.opType);
        }}
      >
        {opMap[op]}
      </span>
      <span
        className={styles.item}
        style={{ color: '#4B0091' }}
        onClick={() => {
          chooseValue(chooseData, chooseData.valueType);
        }}
      >
        {right}
      </span>
      <Icon
        type="delete"
        onClick={() => {
          deleteData(childrenData, index);
        }}
      />
    </div>
  );
}

function JoinLine({ index, needFill }) {
  const first = index === 0;
  return (
    <Fragment>
      <div className={classNames(first ? styles.noRadius : styles.radius)} />
      {needFill && <div className={styles.fillLine}></div>}
    </Fragment>
  );
}
