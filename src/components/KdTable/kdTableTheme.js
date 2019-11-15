/*
 * @Des: theme config for KdTable
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-10-24 16:15:55
 * @LastEditors: iron
 * @LastEditTime: 2019-11-15 09:20:00
 */

export default {
  header: {
    sortArrowColor: '#333',
  },

  // 表头配置项
  frozenRowsColor: '#10416c',
  frozenRowsBgColor: '#f1f6f8',
  frozenRowsBorderColor: '',
  underlayBackgroundColor: 'transparent',
  color: '#10416c',
  defaultBgColor(args) {
    return args.row % 2 === 0 ? '#f1f6f8' : '#fff';
  },
  // 单元格选中背景颜色
  selectionBgColor: '',
  // 单元格选中边框颜色
  highlightBorderColor: '',
  borderColor() {
    return 'transparent';
  },
  checkbox: {
    uncheckBgColor: '#FDD',
    checkBgColor: 'rgb(255, 73, 72)',
    borderColor: '',
  },
  button: {
    color: '#10416c',
    bgColor: 'transparent',
  },
  // font: '14px microsoft yahei',
};
