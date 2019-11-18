const generateJson = spreedSheetData => {
  // 默认cellProps
  const defaultCellProps = {
    F: '1',
    cellDesc: '',
    cellType: 'text',
    style: {},
    sy: '0',
  };
  // rows: 所有行,
  const { rows, cols } = spreedSheetData;
  const rowLength = rows.len;
  const colLength = cols.len;

  // 生成JSON所需的单元格数据
  const data = new Array(rowLength).fill([]).map(() => new Array(colLength).fill(''));

  // 生成JSON所需的cellAttrs，即单元格中的数据类型、style相关
  const cellAttrs = new Array(rowLength)
    .fill([])
    .map(() => new Array(colLength).fill(defaultCellProps));

  Object.keys(rows).forEach(rowIndex => {
    Object.keys(rows[rowIndex].cells).forEach(cellIndex => {
      // spreadSheet单元格的数据及属性
      const cellContent = rows[rowIndex].cells[cellIndex];

      // 把spreadShett单元格的数据赋值给后台表格的单元格中
      data[rowIndex][cellIndex] = cellContent.text;

      // 后台表格单元格属性
      const currentCellProps = cellAttrs[rowIndex][cellIndex];

      // 对样式进行处理
      if (cellContent.style) {
        Object.entity(cellContent.style).forEach(([singleStyle, singleStyleValue]) => {
          if (singleStyle === 'bgcolor') {
            // 背景颜色
            currentCellProps.style.bgc = singleStyleValue;
          }
          if (singleStyle === 'color') {
            // 字体颜色
            currentCellProps.style.c = singleStyleValue;
          }
          if (singleStyle === 'underline' && singleStyleValue) {
            // 下划线
            currentCellProps.style.tdc = 'underline';
          }
          if (singleStyle === 'align') {
            // 水平对齐方式
            if (singleStyleValue === 'center') {
              // 居中
              currentCellProps.style.bgc = 'c';
            }
            if (singleStyleValue === 'left') {
              // 居左
              currentCellProps.style.bgc = 's';
            }
            if (singleStyleValue === 'right') {
              // 居右
              currentCellProps.style.bgc = 'e';
            }
          }
          if (singleStyle === 'valign') {
            // 垂直对齐方式
            if (singleStyleValue === 'middle') {
              // 居中
              currentCellProps.style.bgc = 'c';
            }
            if (singleStyleValue === 'top') {
              // 居上
              currentCellProps.style.bgc = 'c';
            }
            if (singleStyleValue === 'bottom') {
              // 居下
              currentCellProps.style.bgc = 'c';
            }
          }
          if (singleStyle === 'font') {
            // 字体相关
            Object.entity(cellContent.style[singleStyle]).forEach(([fontStyle, fontStyleValue]) => {
              if (fontStyle === 'name') {
                // 字体 font-family
                currentCellProps.style.fa = fontStyleValue;
              }
              if (fontStyle === 'size') {
                // 字体 font-size
                currentCellProps.style.fs = fontStyleValue;
              }
              if (fontStyle === 'italic' && fontStyleValue) {
                // 字体 斜体
                currentCellProps.style.fst = 'italic';
              }
              if (fontStyle === 'bold' && fontStyleValue) {
                // 字体 加粗
                currentCellProps.style.fw = 'bold';
              }
            });
          }
        });
      }
      currentCellProps.style.bgc = cellContent.cellProps.style['background-color']; // 背景颜色
      currentCellProps.style.c = cellContent.style['background-color']; // 字体颜色
      cellAttrs[rowIndex][cellIndex].cellProps.style.bgc = cellContent;
    });
  });
};

export { generateJson };
