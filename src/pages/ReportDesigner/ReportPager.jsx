/*
 * @Author: liangchaoshun
 * @Date: 2020-01-04 13:58:42
 * @Last Modified by: liangchaoshun
 * @Last Modified time: 2020-01-06 09:15:35
 * @Description: 报表设计器的分页组件
 *
 * ---------------------------------------
 * introduction:
 * showTotal: 是否显示所有记录
 * showPageSize: 是否显示每页条数
 * inlineBlock: 是否以行内块元素展示
 * ---------------------------------------
 *
 */

import React, { useState, useEffect } from 'react';
import { Input, Select, Icon } from 'antd';

import less from './ReportPager.less';

function ReportPager(props) {
  const { inlineBlock, showTotal, totalRecord = '--', totalPage = '--', showPageSize } = props;
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    // console.log('ReportPager effect: ', props);
  }, []);

  // 当前页码数改变时
  const onCurrPageChange = ev => {
    const { value } = ev.target;
    setCurrPage(value);
  };

  // 每页显示的条数改变时
  const onPageSizeChange = value => {
    console.log('pageSizeChange: ', value);
  };

  return (
    <div
      className={less['report-page']}
      style={{ display: inlineBlock ? 'inline-block' : 'block' }}
    >
      {showTotal ? (
        <div className={less['total-records']}>
          <span>Total Record: </span>
          <span style={{ marginRight: '10px' }}>{totalRecord}</span>
        </div>
      ) : null}
      {showPageSize ? (
        <Select defaultValue="10" onChange={onPageSizeChange}>
          <Select.Option value="10">10/Page</Select.Option>
          <Select.Option value="20">20/Page</Select.Option>
          <Select.Option value="30">30/Page</Select.Option>
        </Select>
      ) : null}
      <span className={`${less['step-icon']} ${less['step-home']}`} title="Home">
        <Icon type="vertical-right" />
      </span>
      <span className={`${less['step-icon']} ${less['prev-step']}`} title="Previous">
        <Icon type="left" />
      </span>
      <div className={less['page-num']}>
        <Input value={currPage} onChange={onCurrPageChange} />
        <span> / </span>
        <span>{totalPage}</span>
      </div>
      <span className={`${less['step-icon']} ${less['next-step']}`} title="Next">
        <Icon type="right" />
      </span>
      <span className={`${less['step-icon']} ${less['step-end']}`} title="End">
        <Icon type="vertical-left" />
      </span>
    </div>
  );
}

export default ReportPager;
