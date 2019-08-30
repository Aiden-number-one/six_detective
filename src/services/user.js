/*
 * @Description: lan
 * @Author: lan
 * @Date: 2019-08-06 17:31:58
 * @LastEditTime: 2019-08-28 17:02:21
 * @LastEditors: lan
 */
import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}
export async function queryDatas() {
  return request('/api/getDatas');
}
export async function delDatas() {
  return request('/api/delDatas');
}
export async function getDataSourceList() {
  return request('/api/getDataSourceList');
}
