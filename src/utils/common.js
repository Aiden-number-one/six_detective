const Constant = {
  SUCFLAG: '1',
  FAILFLAG: '0',
  DFTERMSG: '服务器异常，请稍后重试',
  MSGTM: 60,
};

const Regep = {
  num: /^\d+$/,
  numx: /\d+/,
  abc: /^[a-zA-Z]+$/,
  abcLowerx: /[a-z]+/,
  abcUpperx: /[A-Z]+/,
  certificateno: /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/,
  mobile: /^1[34578]\d{9}$/,
  email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
  Taiwan: /^([0-9]{8}|[0-9]{10})$/,
  HongKongMacau: /^[a-zA-Z0-9]{6,10}$/,
  passport: /^[a-zA-Z0-9]{5,17}$/,
};

const rows = {
  gutter: {
    md: 8,
    lg: 12,
    xl: 16,
  },
};

// xs:<576px ,sm:≥576px ,md:≥768px ,lg:≥992px ,xl:≥1200px, xxl:≥1600px

// 左侧没有树
const colsWithoutTree = {
  xl: 6,
  lg: 8,
  md: 12,
  sm: 24,
};

// 左侧有树
const cols = {
  xl: 8,
  md: 12,
  sm: 24,
};

// 0成功 1失败 2未开始 3进行中 4警告
const status = {
  0: 'success',
  1: 'error',
  2: 'default',
  3: 'processing',
  4: 'warning',
};

// 0成功 1失败 2未开始 3进行中 4警告
const publishStatusMap = {
  0: 'default',
  1: 'success',
  2: 'success',
  4: 'error',
  5: 'processing',
  98: 'error',
  99: 'error',
};

// 0: "新建"
// 1: "已提交"
// 2: "已发布"
// 4: "已退回"
// 5: "待审核"
// 98: "删除"
// 99: "已下线"

const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];

// iframe 映射
const iframe = {
  // 数据连接
  '/etl-center/data-management/data-sourcemanagement': 'index.html#data-source-configuration',
  // 驱动管理
  '/etl-center/data-management/data-driver-management': 'index.html#data-driven',
  // 规则管理
  '/etl-center/task-management': 'index.html#task-config-setting',
  // 质量问题分析
  '/etl-center/job-management': 'index.html#report-table-info-manage',
  // 任务管理
  '/data-management/task-plan-setting': 'index.html#task-plan-setting',
  // 作业管理
  '/etl-center/schedule-management': 'index.html#perform-monitoring',
  // 执行日志
  '/data-management/log-query': 'index.html#log-query',
  // 数据源监控
  '/data-management/data-enquiry': 'index.html#datasource-change',
};

// const components = {
// };

const menuIcons = {
  // Homepage: 'icon-zhuxian',
  'Data Module': 'icon-zhuxian',
  'Account Module': 'icon-user',
  // 'ETL Center': 'icon-zhuxian',
  'Account Management': 'icon-user',
  Surveillance: 'icon-shipin',
  Report: 'icon-text',
  Analysis: 'icon-chartpie',
  'System Management': 'icon-diannao',
  'Alert Management': 'icon-jinggao',
};

// 数据类型
const typeMap = {
  1: 'input',
  2: 'select',
  3: 'radio',
  4: 'textarea',
};

export {
  Constant,
  Regep,
  rows,
  cols,
  colsWithoutTree,
  publishStatusMap,
  colors,
  status,
  iframe,
  // components,
  typeMap,
  menuIcons,
};
