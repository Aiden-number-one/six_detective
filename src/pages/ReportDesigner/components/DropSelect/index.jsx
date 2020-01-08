import React, { Component } from 'react';
import { Icon, Spin } from 'antd';
import classNames from 'classnames';
import { FormattedMessage } from 'umi/locale';
import styles from './index.less';
import { dataSetTransform } from '../../utils';

export default class DropSelect extends Component {
  input = React.createRef();

  state = {};

  onClick = item => {
    const { privateData, setPrivateList } = this.props;
    // 是否是私有数据集（datasetPrivate === '1'），若不是，则需要转为私有数据集
    // const { dataset_private: datasetPrivate } = item;
    setPrivateList([...privateData, dataSetTransform(item)]);
  };

  render() {
    let { data = [] } = this.props;
    const {
      loading,
      addon,
      getPublicDataSet,
      privateData = [],
      displayDropSelect,
      changedisplayDropSelect,
    } = this.props;
    const { keyWord } = this.state;
    // TODO
    const text = '';
    // 关键词搜索数据集
    if (keyWord) {
      data = data.filter(item => item.datasetName.includes(keyWord)); // 关键字搜索
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
          <div
            className={styles.valueBox}
            onClick={e => {
              e.stopPropagation();
              changedisplayDropSelect(!displayDropSelect);
            }}
            title={text}
          >
            {text} {displayDropSelect ? <Icon type="caret-up" /> : <Icon type="caret-down" />}
          </div>
          <div
            className={styles.dropSelectMenu}
            style={{ display: displayDropSelect ? 'block' : 'none' }}
          >
            <div className={styles.search}>
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
            <div className={styles.dropSelectBtns}>
              <span onClick={() => {}}>
                <Icon type="plus" style={{ fontSize: 12 }} />
                &nbsp;
                <FormattedMessage id="report-designer.adddataset" />
              </span>
              <Icon className={styles.hover} type="reload" onClick={getPublicDataSet} />
            </div>
            <Spin size="small" spinning={loading}>
              <div className={styles.items}>
                {data.length > 0 ? (
                  data.map(item => {
                    // 是否是私有数据集（目前是通过名字去判断，需要沟通！）
                    const active = privateData
                      .map(activeItem => activeItem.origin_datasetId)
                      .includes(item.datasetId);
                    return (
                      <div
                        className={classNames(styles.item)}
                        key={item.datasetName + item.createDatatime}
                        onClick={e => {
                          e.stopPropagation();
                          this.onClick(item);
                        }}
                        title={item.datasetName}
                      >
                        <Icon
                          style={{ fontSize: 12, color: active ? '#0d87d4' : 'transparent' }}
                          type="check"
                        />
                        &nbsp;{item.datasetName}
                      </div>
                    );
                  })
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
