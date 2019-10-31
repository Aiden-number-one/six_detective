/**
 *
 * des: theme config for KdTable
 * author: iron
 * email: chenggang@szkingdom.com
 * date: 2019/10/24
 */
export default {
  header: {
    sortArrowColor: '#333',
  },
  color: 'rgba(0, 0, 0, 0.65)',
  defaultBgColor: '#f0f2f5',
  // 表头配置项
  frozenRowsColor: 'rgba(0, 0, 0, 0.85)',
  frozenRowsBgColor: '#fff',
  frozenRowsBorderColor: ['', '', '#e8e8e8', ''],
  underlayBackgroundColor: '#fff',
  // 单元格选中背景颜色
  selectionBgColor: '#10416c',
  // 单元格选中边框颜色
  highlightBorderColor: '#10416c',
  borderColor() {
    return ['', '', '#e8e8e8', ''];
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
  font: '14px sans-serif',
};
