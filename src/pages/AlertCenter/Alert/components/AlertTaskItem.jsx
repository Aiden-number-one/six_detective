import React from 'react';
import { Descriptions } from 'antd';
// import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { dateFormat } from '@/pages/DataImportLog/constants';

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
    <Descriptions column={1}>
      <Descriptions.Item label="Market *">{MARKET}</Descriptions.Item>
      <Descriptions.Item label="EP Code *">{EP_CODE}</Descriptions.Item>
      <Descriptions.Item label="EP Name *">{EP_NAME}</Descriptions.Item>
    </Descriptions>
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
    <Descriptions column={1}>
      <Descriptions.Item label="Market *">{MARKET}</Descriptions.Item>
      <Descriptions.Item label="HKEX DCASS Code *">{EXTERNAL_PRODUCT_CODE}</Descriptions.Item>
      <Descriptions.Item label="Is CA Code? *">{isCACodeMap[+IS_CA_CODE]}</Descriptions.Item>
      <Descriptions.Item label="Product Description *">{PRODUCT_DESC}</Descriptions.Item>
      <Descriptions.Item label="Product Category *">{PRODUCT_CATEGROY}</Descriptions.Item>
      <Descriptions.Item label="Product Code *">{PRODUCT_CODE}</Descriptions.Item>
      <Descriptions.Item label="Futures or Option *">
        {ContractMap[CONTRACT_NATURE]}
      </Descriptions.Item>
      <Descriptions.Item label="Product Group *">{PRODUCT_GROUP}</Descriptions.Item>
      <Descriptions.Item label="Template Code(Last Trade Day) *">{LTD_TMPL_CODE}</Descriptions.Item>
      <Descriptions.Item label="Template Code(Position Limit) *">{PL_TMPL_CODE}</Descriptions.Item>
      <Descriptions.Item label="Template Code(Reportable Limit) *">
        {RL_TMPL_CODE}
      </Descriptions.Item>
      <Descriptions.Item label="Is Calculate PD? *">{PD_CALCULATE_FLAG}</Descriptions.Item>
      <Descriptions.Item label="Weighting Factor for Calculate PD *">
        {SIZE_FACTOR}
      </Descriptions.Item>
      <Descriptions.Item label="Size Factor for Calculate PD *">{WEIGHT_FACTOR}</Descriptions.Item>
    </Descriptions>
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
    <Descriptions column={1}>
      <Descriptions.Item label="Market *">{MARKET}</Descriptions.Item>
      <Descriptions.Item label="HKEX DCASS Code *">{EXTERNAL_PRODUCT_CODE}</Descriptions.Item>
      <Descriptions.Item label="Is CA Code? *">{isCACodeMap[+IS_CA_CODE]}</Descriptions.Item>
      <Descriptions.Item label="Original Product Code *">{CA_PRODUCT_CODE}</Descriptions.Item>
      <Descriptions.Item label="Effective Date *">
        {moment(EFFECTIVE_DATE).format(dateFormat)}
      </Descriptions.Item>
      <Descriptions.Item label="Expiry Date *">
        {moment(EXPIRY_DATE).format(dateFormat)}
      </Descriptions.Item>
      <Descriptions.Item label="Remark *">{REMARK}</Descriptions.Item>
    </Descriptions>
  );
}

function NewAccountTaskItem(
  {
    task: {
      MARKET,
      EP_CODE,
      SUBMITTER_CODE,
      SUBMITTER_NAME,
      ACCOUNT_NO,
      ACCOUNT_NAME,
      REPORT_BI_NAME,
      REPORTE_TO_NAME,
      REMARK,
    },
  },
  render,
) {
  return (
    <Descriptions column={1}>
      <Descriptions.Item label="Market *">{MARKET}</Descriptions.Item>
      <Descriptions.Item label="Submitter Code *">{SUBMITTER_CODE}</Descriptions.Item>
      <Descriptions.Item label="Submitter Name *">{SUBMITTER_NAME}</Descriptions.Item>
      <Descriptions.Item label="EP Code *">{EP_CODE}</Descriptions.Item>
      <Descriptions.Item label="LOP Account No. *">{ACCOUNT_NO}</Descriptions.Item>
      <Descriptions.Item label="Account Name">{ACCOUNT_NAME}</Descriptions.Item>
      <Descriptions.Item label="Reported BI Name *">{REPORT_BI_NAME}</Descriptions.Item>
      <Descriptions.Item label="Reported TO Name">{REPORTE_TO_NAME}</Descriptions.Item>
      {render()}
      <Descriptions.Item label="Assigned TO Name">{REMARK}</Descriptions.Item>
      <Descriptions.Item label="Creation Date *">{REMARK}</Descriptions.Item>
      <Descriptions.Item label="Remark">{REMARK}</Descriptions.Item>
    </Descriptions>
  );
}

export function NewAccountTaskItemV1({ task }) {
  const { TO_CODE, REMARK } = task;
  return (
    <NewAccountTaskItem
      task={task}
      render={() => (
        <>
          <Descriptions.Item label="BI/Omni Code *">{REMARK}</Descriptions.Item>
          <Descriptions.Item label="Assigned BI/Omni Name *">{REMARK}</Descriptions.Item>
          <Descriptions.Item label="Parent BI/Omni Code">{REMARK}</Descriptions.Item>
          <Descriptions.Item label="Assigned Parent BI/Omni Name">{REMARK}</Descriptions.Item>
          <Descriptions.Item label="TO Code">{TO_CODE}</Descriptions.Item>
        </>
      )}
    />
  );
}

export function NewAccountTaskItemV2({ task }) {
  const { PREV_OMN_BI_CODE, PREV_OMN_BI_NAME, CONFIRM_TO_CODE, REMARK } = task;
  return (
    <NewAccountTaskItem
      task={task}
      render={() => (
        <>
          <Descriptions.Item label="Pre-BI/Omni Code *">{PREV_OMN_BI_CODE}</Descriptions.Item>
          <Descriptions.Item label="Pre-Assigned BI/Omni Name *">
            {PREV_OMN_BI_NAME}
          </Descriptions.Item>
          <Descriptions.Item label="Pre-TO Code">{REMARK}</Descriptions.Item>
          <Descriptions.Item label="Pre-Assigned TO Name">{REMARK}</Descriptions.Item>
          <Descriptions.Item label="Received Confirmation">{REMARK}</Descriptions.Item>
          <Descriptions.Item label="Comfirmed BI/Omni Code *">{REMARK}</Descriptions.Item>
          <Descriptions.Item label="Assigned BI/Omni Name *">{REMARK}</Descriptions.Item>
          <Descriptions.Item label="Confirmed TO Code">{CONFIRM_TO_CODE}</Descriptions.Item>
        </>
      )}
    />
  );
}
