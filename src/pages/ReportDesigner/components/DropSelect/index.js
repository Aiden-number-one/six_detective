import React, { Component } from 'react';
import { Icon, Spin } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export default class DropSelect extends Component {
  state = {
    id: '',
  };

  input = React.createRef();

  componentDidMount() {
    document.body.addEventListener('click', () => {
      this.setState({
        visible: false,
      });
    });
  }

  componentWillReceiveProps(nextprops) {
    const { value } = nextprops;
    this.setState({
      id: value,
    });
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', () => {});
  }

  onClick = id => {
    this.setState({
      id,
    });
  };

  onSearch = v => {};

  trigger = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    let { data = [] } = this.props;
    const { loading, addon, onChange, onRefresh, value } = this.props;
    const { id, visible, keyWord } = this.state;
    const arr = data.filter(item => (id || value) === item.id);
    const text = arr.length > 0 ? arr[0].text : '';
    if (keyWord) {
      data = data.filter(item => item.text.includes(keyWord)); // 关键字搜索
    }
    return (
      <div className={styles.edit}>
        <div
          className={styles.dropSelect}
          style={{
            width: visible ? '250px' : `calc(100% - ${addon ? '29px' : '0px'}) `,
            right: addon ? '30px' : '0px',
          }}
        >
          <div className={styles.valueBox} onClick={this.trigger} title={text}>
            {text} <Icon type="caret-down" />
          </div>
          <div className={styles.dropSelectMenu} style={{ display: visible ? 'block' : 'none' }}>
            <div className={styles.search} onClick={this.trigger}>
              <Icon type="search" />
              <input
                placeholder="请输入关键字搜索"
                onKeyUp={e => {
                  this.setState({
                    keyWord: e.target.value,
                  });
                }}
              />
            </div>
            <div className={styles.dropSelectBtns} onClick={this.trigger}>
              <span onClick={() => {}}>+ 添加数据集</span>
              <Icon className={styles.hover} type="reload" onClick={onRefresh} />
            </div>
            <Spin size="small" spinning={loading}>
              <div className={styles.items}>
                {data.length > 0 ? (
                  data.map(item => (
                    <div
                      className={classNames(styles.item, id === item.id && styles.active)}
                      key={item.id}
                      onClick={() => {
                        this.onClick(item.id);
                        onChange(item.id);
                      }}
                      title={item.text}
                    >
                      {item.text}
                    </div>
                  ))
                ) : (
                  <div className={styles.noData}>暂无数据</div>
                )}
              </div>
            </Spin>
          </div>
        </div>
        {addon && addon()}
      </div>
    );
  }
}
