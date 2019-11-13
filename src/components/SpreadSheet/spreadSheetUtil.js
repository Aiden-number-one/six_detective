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

  Object.keys(rows).forEach(rowIndex => {});
};

export { generateJson };
