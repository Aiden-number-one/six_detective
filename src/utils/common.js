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

const components = {
  '/login': './User/Login',
  '/': './DataSource/DataSource',
  '/datapanel': './DataPanel/DataPanel',
  '/sheet': './Sheet/Sheet',
};

const menuIcons = {};

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
  components,
  typeMap,
  menuIcons,
};
