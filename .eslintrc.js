/*
 * @Description: eslint 配置
 * @Author: mus
 * @Date: 2019-08-30 16:09:36
 * @LastEditTime: 2019-09-19 10:27:54
 * @LastEditors: mus
 * @Email: mus@szkingdom.com
 */
const { strictEslint } = require('@umijs/fabric');

// umi 提供的规则
const umiOptions = {
  ...strictEslint,
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
};

// 自定义规则，写这里
const customRules = {
  "@typescript-eslint/no-unused-vars": "warn"
}

// 合并规则
umiOptions.rules = {
  ...strictEslint.rules,
  ...customRules
}

// 输出
module.exports = umiOptions;
