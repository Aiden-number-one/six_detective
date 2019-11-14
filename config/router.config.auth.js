/*
 * @Des: Please Modify First
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-10-31 19:08:46
 * @LastEditors: iron
 * @LastEditTime: 2019-11-13 19:22:56
 */
export default [
  {
    path: 'depart-maintenance',
    name: 'departMaintenance',
    authority: ['admin'],
    component: './AuthManagement/Department/Department',
  },
  {
    path: 'auth-maintenance',
    name: 'authMaintenance',
    component: './AuthManagement/Auth/Auth',
  },
];
