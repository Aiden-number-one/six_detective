/*
 * @Description: This is based on i18n English internationalization.
 * @Author: dailinbo
 * @Date: 2019-11-01 10:40:21
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-11-21 17:57:17
 */
import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import common from './en-US/common';
import contents from './en-US/contents';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...common,
  ...contents,
};
