/* eslint-disable no-param-reassign */
import React from 'react';
import { columnType } from './types';

function setColumnProps(props) {
  return props;
}
const CGridColumn = ({ children }) => <div className="c-grid-column">{children}</div>;

CGridColumn.propTypes = columnType;
CGridColumn.createColumn = setColumnProps;
export default CGridColumn;
