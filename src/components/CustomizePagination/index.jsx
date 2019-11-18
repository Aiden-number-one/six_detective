import React, { Component, Fragment } from 'react';
import { Pagination } from 'antd';

export default class CustomizePagination extends Component {
  static defaultPorps = {
    table: false, // 默认不启用table内嵌模式的分页
    pageSize: '10', // 每页默认10条
    total: '0', // 总条数默认0
    showSizeChanger: false, // 是否可以改变 pageSize 默认false
    onChange: () => {}, // change pagination
  };

  state = {
    _total: null,
    _pageSize: null,
    _showSizeChanger: false,
  };

  static getDerivedStateFromProps(props) {
    const { pagination } = props;
    let total = null;
    let pageSize = null;
    let showSizeChanger = false;
    if (pagination) {
      total = pagination && pagination.total;
      pageSize = pagination && pagination.pageSize;
      showSizeChanger = pagination && pagination.showSizeChanger;
    }
    return {
      _total: total,
      _pageSize: pageSize,
      _showSizeChanger: showSizeChanger,
    };
  }

  render() {
    const { table, pageSize, total, showSizeChanger, onChange } = this.props;
    const { _total, _pageSize, _showSizeChanger } = this.state;
    return (
      <Fragment>
        <Pagination
          pageSize={_pageSize || pageSize}
          total={_total || total}
          showSizeChanger={_showSizeChanger || showSizeChanger}
          onChange={
            table
              ? (current, ps) => onChange({ current, pageSize: ps })
              : (current, ps) => onChange(current, ps)
          }
          onShowSizeChange={
            table
              ? (current, ps) => onChange({ current, pageSize: ps })
              : (current, ps) => onChange(current, ps)
          }
        />
      </Fragment>
    );
  }
}
