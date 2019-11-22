/*
 * @Description: This is based on i18n Chinese internationalization.
 * @Author: dailinbo
 * @Date: 2019-11-01 10:40:21
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-11-21 17:57:52
 */
import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import common from './zh-CN/common';
import contents from './zh-CN/contents';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.preview.down.block': '下载此页面到本地项目',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...common,
  ...contents,
};
