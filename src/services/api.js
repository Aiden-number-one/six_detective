/*
 * @Description: 接口文件
 * @Author: lan
 * @Date: 2019-08-06 17:31:58
 * @LastEditTime: 2019-11-28 14:25:45
 * @LastEditors: lan
 */
import common from './common'; // 公共
import dataSource from './dataSource';
import dataSet from './dataSet';

export default {
  ...common,
  ...dataSource,
  ...dataSet,
};
