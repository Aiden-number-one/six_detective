import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default class List extends PureComponent {
  state = {};

  static defaultProps = {
    title: 'List', // 标题
    currentId: 'id',
    chooseTab: () => {}, // 选择list item事件
  };

  render() {
    const { listData, chooseId, chooseTab, title, currentId } = this.props;
    return (
      <div className={styles.listBox}>
        <h2>{title}</h2>
        <ul>
          {listData.map(item => (
            <li
              key={item[currentId]}
              icon="copy"
              onClick={() => {
                chooseTab(item[currentId]);
              }}
              className={chooseId === item[currentId] ? styles.liActive : null}
            >
              <Icon type="copy" style={{ color: '#FFB81C', marginRight: '4px' }} />
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
