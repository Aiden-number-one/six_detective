const funcData = [
  {
    func: 'SUM',
    text: 'SUM(表达式)',
    des: '返回表达式中所有值的总和。SUM 只能用于数字字段。',
    example: 'SUM([销售额])',
  },

  {
    func: 'AVG',
    text: 'AVG(表达式)',
    des: '返回表达式中所有值的平均值。AVG 只能用于数字字段。',
    example: 'AVG([成本])。',
  },

  {
    func: 'COUNT',
    text: 'COUNT(表达式)',
    des: '返回组中的项目数。',
    example: 'COUNT([客户名称])。',
  },

  {
    func: 'COUNTD',
    text: 'COUNTD(表达式)',
    des: '返回组中的不同项目数。',
    example: 'COUNTD([产品名称])',
  },

  {
    func: 'MEDIAN',
    text: 'MEDIAN(表达式)',
    des: '返回表达式中所有值的中位数。MEDIAN 只能用于数字字段。',
    example: 'MEDIAN([利润]) 当前数据源不支持此函数"',
  },

  {
    func: 'PERCENTILE',
    text: 'PERCENTILE(表达式, 百分位)',
    des: '返回表达式中所有值的百分位数。PERCENTILE 只能用于数字字段。',
    example: 'PERCENTILE([利润], 75) 当前数据源不支持此函数',
  },

  {
    func: 'MAX',
    text: 'MAX(表达式)',
    des: '返回表达式在所有记录中的最大值。MAX只能用于数字、日期、日期时间字段。',
    example: 'MAX([访问量])',
  },

  {
    func: 'MIN',
    text: 'MIN(表达式)',
    des: '返回表达式在所有记录中的最小值。MIN只能用于数字、日期、日期时间字段。',
    example: 'MIN([访问量])',
  },
];

const changeActive = data =>
  data.map(item => {
    item.visible = true;
    item.active = false;
    if (item.children) {
      item.children = changeActive(item.children);
    }
    return item;
  });

export { funcData, changeActive };
