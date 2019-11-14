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
      const cellContent = rows[rowIndex].cells[cellIndex];

      // 处理单元格内的内容
      data[rowIndex][cellIndex] = cellContent.text;

      // 对样式进行处理
      const currentCellProps = cellAttrs[rowIndex][cellIndex].cellProps;
      currentCellProps.style.bgc = cellContent.style['background-color']; // 背景颜色
      cellAttrs[rowIndex][cellIndex].cellProps.style.bgc = cellContent;
    });
  });
};

export { generateJson };
