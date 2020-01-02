import { stringToNum } from '@/utils/utils';

/**
 * @description: 处理合并单元格相关
 * @param {array}  merges 合并单元格的原始数据
 * @return {array} 合并单元格的数组
 * @Author: mus
 * @Date: 2019-12-23 20:29:27
 */
export function mergeCell(merges) {
  const mergeMap = {};
  merges.forEach(merge => {
    const [start, end] = merge.split(':');
    const startCol = stringToNum(start.match(/([A-Z]+)([0-9]+)/)[1]) - 1;
    const startRow = start.match(/([A-Z]+)([0-9]+)/)[2] - 1;
    const endCol = stringToNum(end.match(/([A-Z]+)([0-9]+)/)[1]) - 1;
    const endRow = end.match(/([A-Z]+)([0-9]+)/)[2] - 1;
    mergeMap[startRow.toString() + startCol.toString()] = {
      currentCol: startCol,
      currentRow: startRow,
      colSpan: endCol - startCol + 1,
      rowSpan: endRow - startRow + 1,
    };
  });
  return mergeMap;
}

/**
 * @description: spreadSheetJSON转换
 * @param {object} spreadSheetData spreadsheet的原数据
 * @return {object} 转换后的sheet数据
 * @Author: mus
 * @Date: 2019-12-23 20:24:27
 */
export function generateJson(spreadSheetData) {
  // rows: 所有行,
  const { rows, cols, merges } = spreadSheetData;
  const rowLength = rows.len;
  const colLength = cols.len;

  // 获取处理后的合并单元格数据
  const processedMerges = mergeCell(merges);

  // 生成JSON所需的单元格数据
  const data = new Array(rowLength).fill([]).map(() => new Array(colLength).fill(''));

  // 生成JSON所需的cellAttrs，即单元格中的数据类型、style相关
  const cellAttrs = new Array(rowLength).fill([]).map(() =>
    new Array(colLength).fill({}).map(() => ({
      F: '1',
      cellDesc: '',
      cellType: 'text',
      style: {},
      sy: '0',
    })),
  );

  Object.keys(rows).forEach(rowIndex => {
    if (rowIndex === 'len') {
      return;
    }
    Object.keys(rows[rowIndex].cells).forEach(cellIndex => {
      // spreadSheet单元格的数据及属性
      const cellContent = rows[rowIndex].cells[cellIndex];
      // 把spreadShett单元格的数据赋值给后台表格的单元格中
      data[rowIndex][cellIndex] = cellContent.text;

      // TODO：设置宽度、高度

      // 后台表格单元格属性
      const currentCellProps = cellAttrs[rowIndex][cellIndex];

      // 设置colSpan、rowSpan
      const processedMerge = processedMerges[rowIndex.toString() + cellIndex.toString()];

      // 若改单元格不存在合并，则rowSpan为1，同理colSpan为1
      currentCellProps.rowSpan = processedMerge ? processedMerge.rowSpan : '1';
      currentCellProps.colSpan = processedMerge ? processedMerge.colSpan : '1';

      // 对cellType进行处理
      if (cellContent.cellProps.cellType === 'dataSet') {
        currentCellProps.cellType = 'DATASET';
      } else if (cellContent.cellProps.cellType === 'text') {
        currentCellProps.cellType = 'TEXT';
      }

      // 对样式进行处理
      if (cellContent.style) {
        Object.entries(cellContent.style).forEach(([singleStyle, singleStyleValue]) => {
          if (singleStyle === 'bgcolor') {
            // 背景颜色
            currentCellProps.style.background_color = singleStyleValue;
          }
          if (singleStyle === 'color') {
            // 字体颜色
            currentCellProps.style.color = singleStyleValue;
          }
          if (singleStyle === 'underline' && singleStyleValue) {
            // 下划线
            currentCellProps.style.text_decoration = ['underline'];
          }
          if (singleStyle === 'align') {
            // 水平对齐方式
            currentCellProps.style.text_align = singleStyleValue;
          }
          if (singleStyle === 'valign') {
            // 垂直对齐方式
            currentCellProps.style.vertical_align = singleStyleValue;
          }
          if (singleStyle === 'font') {
            // 字体相关
            Object.entries(cellContent.style[singleStyle]).forEach(
              ([fontStyle, fontStyleValue]) => {
                if (fontStyle === 'name') {
                  // 字体 font-family
                  currentCellProps.style.font_family = fontStyleValue;
                }
                if (fontStyle === 'size') {
                  // 字体 font-size
                  currentCellProps.style.font_size = fontStyleValue;
                }
                if (fontStyle === 'italic' && fontStyleValue) {
                  // 字体 斜体
                  currentCellProps.style.font_style = 'italic';
                }
                if (fontStyle === 'bold' && fontStyleValue) {
                  // 字体 加粗
                  currentCellProps.style.font_weight = 'bold';
                }
              },
            );
          }
          if (singleStyle === 'border') {
            // 边框相关样式
            Object.entries(cellContent.style[singleStyle]).forEach(
              ([borderStyle, borderStyleValue]) => {
                const [color = 'black'] = borderStyleValue;
                if (borderStyle === 'bottom') {
                  // 下边框
                  currentCellProps.style['border-bottom'] = `${'1px solid '}${color}`;
                  currentCellProps.style['border-bottom-color'] = color;
                  currentCellProps.style['border-bottom-type'] = 'solid';
                }
                if (borderStyle === 'top') {
                  // 上边框
                  currentCellProps.style['border-top'] = `${'1px solid '}${color}`;
                  currentCellProps.style['border-top-color'] = color;
                  currentCellProps.style['border-top-type'] = 'solid';
                }
                if (borderStyle === 'left') {
                  // 左边框
                  currentCellProps.style['border-left'] = `${'1px solid '}${color}`;
                  currentCellProps.style['border-left-color'] = color;
                  currentCellProps.style['border-left-type'] = 'solid';
                }
                if (borderStyle === 'right') {
                  // 有边框
                  currentCellProps.style['border-right'] = `${'1px solid '}${color}`;
                  currentCellProps.style['border-right-color'] = color;
                  currentCellProps.style['border-right-type'] = 'solid';
                }
              },
            );
          }
        });
      }
    });
  });
  const sheet = [];
  sheet.push({
    data,
    cellAttrs,
  });
  return sheet;
}
