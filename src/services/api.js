/*
 * @Description: 接口文件
 * @Author: lan
 * @Date: 2019-08-06 17:31:58
 * @LastEditTime: 2019-12-17 15:33:41
 * @LastEditors: mus
 */
import common from './common'; // 公共
import dataSource from './dataSource';
import dataSet from './dataSet';
import reportDesign from './reportDesign';

export default {
  ...common,
  ...dataSource,
  ...dataSet,
  ...reportDesign,
};
