/*
 * @Description: This is store for Info.
 * @Author: dailinbo
 * @Date: 2020-01-07 09:44:14
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-07 10:02:13
 */
import { validatenull } from './validate';
/**
 * 存储localStorage
 */
export const setStore = params => {
  const {
    name,
    content,
    type,
    // datetime
  } = params;
  const obj = {
    dataType: typeof content,
    content,
    type,
    datetime: new Date().getTime(),
  };
  if (type) window.sessionStorage.setItem(name, JSON.stringify(obj));
  else window.localStorage.setItem(name, JSON.stringify(obj));
};
/**
 * 获取localStorage
 */
export const getStore = name => {
  let obj = {};
  let newContent;
  obj = window.localStorage.getItem(name);
  if (validatenull(obj)) obj = window.sessionStorage.getItem(name);
  if (validatenull(obj)) return;
  obj = JSON.parse(obj);
  if (obj.dataType === 'string') {
    newContent = obj.content;
  } else if (obj.dataType === 'number') {
    newContent = Number(obj.content);
  } else if (obj.dataType === 'boolean') {
    /* eslint-disable */
    newContent = eval(obj.content);
  } else if (obj.dataType === 'object') {
    newContent = obj.content;
  }
  return newContent;
};
