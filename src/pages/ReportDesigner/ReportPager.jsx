/*
 * @Author: liangchaoshun
 * @Date: 2020-01-04 13:58:42
 * @Last Modified by: liangchaoshun
 * @Last Modified time: 2020-01-07 17:17:10
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
import { Input, Select, Icon, message } from 'antd';
import classNames from 'classnames';

import less from './ReportPager.less';

// 当前组件的常量
const pagerConst = {
  VALUE_DEFAULT: '--',
  SETP_HOME: 'step-home',
  SETP_PREV: 'step-prev',
  SETP_NEXT: 'step-next',
  SETP_END: 'step-end',
};

function ReportPager(props) {
  const { VALUE_DEFAULT, SETP_HOME, SETP_PREV, SETP_NEXT, SETP_END } = pagerConst;
  // 父组件传入的属性和方法
  const {
    inlineBlock, // 是否为行内块元素
    showTotal, // 是否显示总记录数
    totalPage: tpage, // 总页数，【字符串]
    totalRecord = VALUE_DEFAULT, // 总记录数
    showPageSize, // 是否显示每页条数选项
    pageChageCallback, // 页码|每页条数 改变后的回调
    pageSizeArr = [10, 20, 30], // 每页条数选项
    paging, // 是否分页
  } = props;

  const totalPage = parseInt(tpage, 10) || VALUE_DEFAULT; // 总页数，【数字】

  const [currPage, setCurrPage] = useState(1); // 当前页码，默认 1
  const [pageSize, setPageSize] = useState(10); // 每页条数，默认 10
  const [isDiablePAH, setIsDiablePAH] = useState(true); // 是否禁用按钮： 上一页 和 首页
  const [isDiableNAE, setIsDiableNAE] = useState(false); // 是否禁用按钮： 下一页 和 尾页

  // componentDidMount
  useEffect(() => {
    // console.log('reportPager DidMount effect: ', currPage, pageSize);
    if (totalPage === VALUE_DEFAULT || +totalPage === 1) {
      setIsDiableNAE(true); // 如果没数据或者只有一页时，禁用 下一页 和 尾页 按钮
    }
  }, []);

  // componentDidUpdate
  useEffect(() => {
    // console.log('reportPager DidUpdate effect: ', currPage, pageSize);

    // 处理按钮状态：禁用 | 开启
    if (totalPage === VALUE_DEFAULT || totalPage === 1) {
      setIsDiablePAH(true); // 都禁用
      setIsDiableNAE(true); // 都禁用
    } else if (currPage === 1) {
      setIsDiablePAH(true); // 禁用前两个按钮
      setIsDiableNAE(false); // 开启后两个按钮
    } else if (currPage === totalPage) {
      setIsDiablePAH(false); // 开启前两个按钮
      setIsDiableNAE(true); // 禁用后两个按钮
    }

    // 如果用户配置了：不分页，禁用 首页/尾页 上一页 下一页 当前页 页面大小
    if (!paging) {
      setIsDiablePAH(true);
      setIsDiableNAE(true);
    }

    // 处理回调：比如，父组件重新请求数据 TODO: FIXME: 为什么首次进来就会执行？？？
    if (currPage) {
      // 不为空
      if (/^[1-9]+$/.test(currPage)) {
        pageChageCallback({ pageSize: `${pageSize}`, pageNumber: `${currPage}` }); // callback
      } else {
        message.error(
          <span style={{ color: '#f4374c' }}>
            Page format error, please enter a number greater than 0
          </span>,
        );
      }
    }
  }, [currPage, pageSize]);

  // 当前页码数改变时
  const currPageInputChage = ev => {
    const { value } = ev.target;
    setCurrPage(value);
  };

  // 每页显示的条数改变时
  const onPageSizeChange = value => {
    // console.log('pageSizeChange: ', value);
    setCurrPage(1); // 重置为 第一页
    setPageSize(value);
  };

  // 当前页码改变时，统一处理函数
  const pageNumChangeHandler = (action, ev) => {
    // console.log('pageNumChangeHandler: ', action);
    const tar = ev.currentTarget;
    if (tar.classList.contains(less['step-disable'])) return;
    // eslint-disable-next-line default-case
    switch (action) {
      case SETP_HOME:
        if (currPage !== 1) {
          setCurrPage(1);
          // console.log('currPage home -> ', currPage);
        }
        break;
      case SETP_PREV:
        if (currPage > 1) {
          setCurrPage(currPage - 1);
          // console.log('currPage prev -> ', currPage);
        }
        break;
      case SETP_NEXT:
        if (currPage < totalPage) {
          setCurrPage(currPage + 1);
          // console.log('currPage next -> ', currPage);
        }
        break;
      case SETP_END:
        if (currPage !== totalPage) {
          setCurrPage(totalPage);
          // console.log('currPage end -> ', currPage);
        }
        break;
    }
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
        <Select defaultValue={pageSizeArr[0]} onChange={onPageSizeChange} disabled={!paging}>
          {pageSizeArr.map(value => (
            <Select.Option key={value} value={value}>
              {value}/Page
            </Select.Option>
          ))}
        </Select>
      ) : null}
      <span
        title="Home"
        onClick={ev => pageNumChangeHandler(SETP_HOME, ev)}
        className={classNames(less['step-icon'], less['step-home'], {
          [less['step-disable']]: isDiablePAH,
        })}
      >
        <Icon type="vertical-right" />
      </span>
      <span
        title="Prev"
        onClick={ev => pageNumChangeHandler(SETP_PREV, ev)}
        className={classNames(less['step-icon'], less['step-prev'], {
          [less['step-disable']]: isDiablePAH,
        })}
      >
        <Icon type="left" />
      </span>
      <div className={less['page-num']}>
        <Input value={currPage} onChange={currPageInputChage} disabled={!paging} />
        <span> / </span>
        <span>{totalPage}</span>
      </div>
      <span
        title="Next"
        onClick={ev => pageNumChangeHandler(SETP_NEXT, ev)}
        className={classNames(less['step-icon'], less['step-next'], {
          [less['step-disable']]: isDiableNAE,
        })}
      >
        <Icon type="right" />
      </span>
      <span
        title="End"
        onClick={ev => pageNumChangeHandler(SETP_END, ev)}
        className={classNames(less['step-icon'], less['step-end'], {
          [less['step-disable']]: isDiableNAE,
        })}
      >
        <Icon type="vertical-left" />
      </span>
    </div>
  );
}

export default ReportPager;
