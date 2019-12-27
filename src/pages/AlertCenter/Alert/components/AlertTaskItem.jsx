import React from 'react';
import { Descriptions } from 'antd';
// import { FormattedMessage } from 'umi/locale';
// import moment from 'moment';
// import { dateFormat, timestampFormat } from '@/pages/DataImportLog/constants';

const isCACodeMap = {
  0: 'No',
  1: 'Yes',
};

const ContractMap = {
  F: 'Future',
  O: 'Option',
};

export function EpTaskItem({ task: { MARKET, ALERT_ITEM_ID, EP_CODE, EP_NAME } }) {
  return (
    <Descriptions column={1}>
      <Descriptions.Item label="alert item id *">{ALERT_ITEM_ID}</Descriptions.Item>
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
    IS_CA_CODE,
    EXTERNAL_PRODUCT_CODE,
    EFFECTIVE_DATE,
    CA_PRODUCT_CODE,
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
      <Descriptions.Item label="Effective Date *">{EFFECTIVE_DATE}</Descriptions.Item>
      <Descriptions.Item label="Expiry Date *">{EXPIRY_DATE}</Descriptions.Item>
      <Descriptions.Item label="Remark *">{REMARK}</Descriptions.Item>
    </Descriptions>
  );
}
