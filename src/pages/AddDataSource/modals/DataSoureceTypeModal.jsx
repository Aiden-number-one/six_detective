import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import styles from '../AddDataSource.less';

// 数据连接弹框
export default class DataSoureceTypeModal extends PureComponent {
  state = {
    drivenArray: [{ name: 'Mysql', active: false }, { name: 'DB2', active: false }],
  };

  chooseType = index => {
    const { toggleModal, setAddDataSourceTitle } = this.props;
    const { drivenArray } = this.state;
    toggleModal('dataSourceType');
    const { name } = drivenArray[index];
    setAddDataSourceTitle(name);
    setTimeout(() => {
      toggleModal('dataSource');
    }, 0);
  };

  render() {
    const { visible, toggleModal } = this.props;
    const { drivenArray } = this.state;
    return (
      <Modal
        visible={visible}
        wrapClassName="modal"
        title="Choose Data Source Type"
        footer={null}
        onCancel={() => {
          toggleModal('dataSourceType');
        }}
      >
        <div className={styles.winbd}>
          <ul>
            {drivenArray.map((value, index) => (
              <li
                onClick={() => {
                  this.chooseType(index);
                }}
              >
                <div className={styles[value.name.toLowerCase()]}></div>
                <div className={styles.txt}>{value.name}</div>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    );
  }
}
