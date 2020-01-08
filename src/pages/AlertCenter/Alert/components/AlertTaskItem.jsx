import React, { useState, useEffect, useMemo } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { dateFormat, timestampFormat } from '@/pages/DataImportLog/constants';
import { GrDescriptions } from './index';

const { Column } = Table;

const isCACodeMap = {
  0: 'No',
  1: 'Yes',
};

const ContractMap = {
  F: 'Future',
  O: 'Option',
};

export function EpTaskItem({ task: { MARKET, EP_CODE, EP_NAME } }) {
  return (
    <GrDescriptions>
      <GrDescriptions.Item label="Market *">{MARKET}</GrDescriptions.Item>
      <GrDescriptions.Item label="EP Code *">{EP_CODE}</GrDescriptions.Item>
      <GrDescriptions.Item label="EP Name *">{EP_NAME}</GrDescriptions.Item>
    </GrDescriptions>
  );
}
export function ProductTaskItem({
  task: {
    MARKET,
    EXTERNAL_PRODUCT_CODE,
    IS_CA_CODE,
    PRODUCT_CODE,
    PRODUCT_DESC,
    PRODUCT_CATEGROY,
    CONTRACT_NATURE,
    LTD_TMPL_CODE,
    PRODUCT_GROUP,
    PL_TMPL_CODE,
    RL_TMPL_CODE,
    PD_CALCULATE_FLAG,
    SIZE_FACTOR,
    WEIGHT_FACTOR,
  },
}) {
  return (
    <GrDescriptions labelWidth="33%">
      <GrDescriptions.Item label="Market *">{MARKET}</GrDescriptions.Item>
      <GrDescriptions.Item label="HKEX DCASS Code *">{EXTERNAL_PRODUCT_CODE}</GrDescriptions.Item>
      <GrDescriptions.Item label="Is CA Code? *">{isCACodeMap[+IS_CA_CODE]}</GrDescriptions.Item>
      <GrDescriptions.Item label="Product Description *">{PRODUCT_DESC}</GrDescriptions.Item>
      <GrDescriptions.Item label="Product Category *">{PRODUCT_CATEGROY}</GrDescriptions.Item>
      <GrDescriptions.Item label="Product Code *">{PRODUCT_CODE}</GrDescriptions.Item>
      <GrDescriptions.Item label="Futures or Option *">
        {ContractMap[CONTRACT_NATURE]}
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Product Group *">{PRODUCT_GROUP}</GrDescriptions.Item>
      <GrDescriptions.Item label="Template Code(Last Trade Day) *">
        {LTD_TMPL_CODE}
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Template Code(Position Limit) *">
        {PL_TMPL_CODE}
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Template Code(Reportable Limit) *">
        {RL_TMPL_CODE}
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Is Calculate PD? *">{PD_CALCULATE_FLAG}</GrDescriptions.Item>
      <GrDescriptions.Item label="Weighting Factor for Calculate PD *">
        {SIZE_FACTOR}
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Size Factor for Calculate PD *">
        {WEIGHT_FACTOR}
      </GrDescriptions.Item>
    </GrDescriptions>
  );
}
export function CaCodeTaskItem({
  task: {
    MARKET,
    EXTERNAL_PRODUCT_CODE,
    IS_CA_CODE,
    CA_PRODUCT_CODE,
    EFFECTIVE_DATE,
    EXPIRY_DATE,
    REMARK,
  },
}) {
  return (
    <GrDescriptions labelWidth="25%">
      <GrDescriptions.Item label="Market *">{MARKET}</GrDescriptions.Item>
      <GrDescriptions.Item label="HKEX DCASS Code *">{EXTERNAL_PRODUCT_CODE}</GrDescriptions.Item>
      <GrDescriptions.Item label="Is CA Code? *">{isCACodeMap[+IS_CA_CODE]}</GrDescriptions.Item>
      <GrDescriptions.Item label="Original Product Code *">{CA_PRODUCT_CODE}</GrDescriptions.Item>
      <GrDescriptions.Item label="Effective Date *">
        {moment(EFFECTIVE_DATE).format(dateFormat)}
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Expiry Date *">
        {moment(EXPIRY_DATE).format(dateFormat)}
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Remark *">{REMARK}</GrDescriptions.Item>
    </GrDescriptions>
  );
}
export function NewAccountTaskItem({ task, taskHistory = {}, onHistory }) {
  const {
    TASK_ID,
    MARKET,
    SUBMITTER_CODE,
    SUBMITTER_NAME,
    EP_CODE,
    ACCOUNT_NO,
    PREV_BI_CODE,
    PREV_BI_NAME,
    PREV_TO_CODE,
    PREV_TO_NAME,
    ANSWER_STATUS,
    CONFIRM_BI_CODE,
    CONFIRM_BI_NAME,
    CONFIRM_TO_CODE,
    CONFIRM_TO_NAME,
    PREV_IS_REPORT_ANY_POSITION,
    CONFIRM_IS_WATCH,
    REMARK,
  } = task;

  const [reportHistory, setReportHistory] = useState([]);
  const [answerHistory, setAnswerHistory] = useState([]);
  useEffect(() => {
    onHistory(TASK_ID);
  }, []);

  useEffect(() => {
    if (taskHistory.reportHistory) {
      setReportHistory(reportHistory.length ? reportHistory : []);
    }
    if (answerHistory.reportHistory) {
      setAnswerHistory(answerHistory.length ? answerHistory : []);
    }
  }, [taskHistory]);

  console.log(taskHistory);

  return (
    <GrDescriptions labelWidth="25%">
      <GrDescriptions.Item label="Market *">{MARKET}</GrDescriptions.Item>
      <GrDescriptions.Item label="Submitter Code *">{SUBMITTER_CODE}</GrDescriptions.Item>
      <GrDescriptions.Item label="Submitter Name *">{SUBMITTER_NAME}</GrDescriptions.Item>
      <GrDescriptions.Item label="EP/TO Name *">{EP_CODE}</GrDescriptions.Item>
      <GrDescriptions.Item label="LOP Account No *">{ACCOUNT_NO}</GrDescriptions.Item>
      <GrDescriptions.Item label="Previous BI Code *">{PREV_BI_CODE}</GrDescriptions.Item>
      <GrDescriptions.Item label="Previous BI Name *">{PREV_BI_NAME}</GrDescriptions.Item>
      <GrDescriptions.Item label="Previous TO Code *">{PREV_TO_CODE}</GrDescriptions.Item>
      <GrDescriptions.Item label="Previous TO Name *">{PREV_TO_NAME}</GrDescriptions.Item>
      <GrDescriptions.Item label="Report History *">
        <Table dataSource={reportHistory} rowKey="ACCOUNT_NAME" bordered>
          <Column
            align="center"
            dataIndex="reportedTime"
            title="Reported Time"
            render={text => moment(text).format(timestampFormat)}
          />
          <Column align="center" dataIndex="reportedAccountName" title="Reported Account Name" />
          <Column align="center" dataIndex="reportedBiName" title="Reported BI Name" />
          <Column align="center" dataIndex="reportedToName" title="Reported TO Name" />
        </Table>
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Received Answer *">{ANSWER_STATUS}</GrDescriptions.Item>
      <GrDescriptions.Item label="Answer History *">
        <Table dataSource={answerHistory} rowKey="ANSWERED_FULL_BI_NAME" bordered>
          <Column align="center" dataIndex="ANSWERED_TIME" title="Answered Time" />
          <Column align="center" dataIndex="ANSWERED_FULL_BI_NAME" title="Answered Full BI Name" />
          <Column align="center" dataIndex="ANSWERED_Bi_CATEGORY" title="Answered BI Category" />
          <Column align="center" dataIndex="MATCHED_BI_CODE" title="Matched BI Code" />
          <Column align="center" dataIndex="MATCHED_OMN_CODE" title="Matched OMN Code" />
          <Column align="center" dataIndex="ANSWERED_FULL_TO_NAME" title="Answered Full TO Name" />
          <Column align="center" dataIndex="MATCHED_TO" title="Matched TO" />
        </Table>
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Confirmed BI *">
        <span style={{ marginRight: 20 }}>{CONFIRM_BI_CODE}</span>
        <span>{CONFIRM_BI_NAME}</span>
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Confirmed TO *">
        <span style={{ marginRight: 20 }}>{CONFIRM_TO_CODE}</span>
        <span>{CONFIRM_TO_NAME}</span>
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Report Any Position *">
        {PREV_IS_REPORT_ANY_POSITION}
      </GrDescriptions.Item>
      <GrDescriptions.Item label="Watch *">{CONFIRM_IS_WATCH}</GrDescriptions.Item>
      <GrDescriptions.Item label="Remark *">{REMARK}</GrDescriptions.Item>
    </GrDescriptions>
  );
}
