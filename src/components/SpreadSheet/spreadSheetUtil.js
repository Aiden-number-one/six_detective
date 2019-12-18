const generateJson = (spreedSheetData, saveCallback) => {
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
    if (rowIndex === 'len') {
      return;
    }
    Object.keys(rows[rowIndex].cells).forEach(cellIndex => {
      // spreadSheet单元格的数据及属性
      const cellContent = rows[rowIndex].cells[cellIndex];

      // 把spreadShett单元格的数据赋值给后台表格的单元格中
      data[rowIndex][cellIndex] = cellContent.text;

      // 后台表格单元格属性
      const currentCellProps = cellAttrs[rowIndex][cellIndex];

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
                const [color] = borderStyleValue;
                if (borderStyle === 'bottom') {
                  // 下边框
                  currentCellProps.style.border_bottom = `${'1px solid'}${color}`;
                  currentCellProps.style.border_bottom_color = color;
                  currentCellProps.style.border_bottom_type = 'SOLID';
                }
                if (borderStyle === 'top') {
                  // 上边框
                  currentCellProps.style.border_top = `${'1px solid'}${color}`;
                  currentCellProps.style.border_top_color = color;
                  currentCellProps.style.border_top_type = 'SOLID';
                }
                if (borderStyle === 'left') {
                  // 左边框
                  currentCellProps.style.border_left = `${'1px solid'}${color}`;
                  currentCellProps.style.border_left_color = color;
                  currentCellProps.style.border_left_type = 'SOLID';
                }
                if (borderStyle === 'rigth') {
                  // 有边框
                  currentCellProps.style.border_right = `${'1px solid'}${color}`;
                  currentCellProps.style.border_right_color = color;
                  currentCellProps.style.border_right_type = 'SOLID';
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
  saveCallback(JSON.stringify(sheet));
};

export { generateJson };
