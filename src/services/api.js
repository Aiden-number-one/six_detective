/*
 * @Description: 接口文件
 * @Author: lan
 * @Date: 2019-08-06 17:31:58
 * @LastEditTime : 2020-01-02 14:57:58
 * @LastEditors  : lan
 */
import common from './common'; // 公共
import dataSource from './dataSource';
import dataSet from './dataSet';
import reportDesign from './reportDesign';
import homepage from './homepage';

export default {
  ...common,
  ...dataSource,
  ...dataSet,
  ...reportDesign,
  ...homepage,
};
