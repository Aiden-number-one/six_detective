import React, { Component } from 'react';
import { Icon, Spin } from 'antd';
import classNames from 'classnames';
import { FormattedMessage } from 'umi/locale';
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

  componentWillUnmount() {
    document.body.removeEventListener('click', () => {});
  }

  onClick = id => {
    this.setState({
      id,
      visible: false,
    });
  };

  onSearch = (/* v  */) => {};

  trigger = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    let { data = [] } = this.props;
    const { loading, addon, getDataSet, value } = this.props;
    const { id, visible, keyWord } = this.state;
    let arr = data.filter(item => (id || value) === item.taskId);
    arr = arr.length > 0 ? arr : data;
    const text = arr.length > 0 ? arr[0].sqlName : '';
    if (keyWord) {
      data = data.filter(item => item.sqlName.includes(keyWord)); // 关键字搜索
    }
    return (
      <div className={styles.edit}>
        <div
          className={styles.dropSelect}
          style={{
            wth: `calc(100% - ${addon ? '29px' : '0px'}) `,
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
                placeholder="Please input keywords"
                onKeyUp={e => {
                  this.setState({
                    keyWord: e.target.value,
                  });
                }}
              />
            </div>
            <div className={styles.dropSelectBtns} onClick={this.trigger}>
              <span onClick={() => {}}>
                + <FormattedMessage id="report-designer.adddataset" />
              </span>
              <Icon className={styles.hover} type="reload" onClick={getDataSet} />
            </div>
            <Spin size="small" spinning={loading}>
              <div className={styles.items}>
                {data.length > 0 ? (
                  data.map(item => (
                    <div
                      className={classNames(styles.item)}
                      key={item.taskId}
                      onClick={() => {
                        this.onClick(item.taskId);
                        // onChange(item.taskId);
                      }}
                      title={item.sqlName}
                    >
                      {item.sqlName}
                    </div>
                  ))
                ) : (
                  <div className={styles.noData}>
                    <FormattedMessage id="report-designer.nodata" />
                  </div>
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
