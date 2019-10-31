import React from 'react';

// 获取内部列 props
function getPropsObjectInternal(elements) {
  return {
    columns: React.Children.map(elements, item => {
      const { props } = item;
      return {
        caption: props.children,
        ...props,
      };
    }),
  };
}

function createColumn(props) {
  return props;
}

const CGridColumnGroup = ({ children }) => <div className="c-grid-column-group">{children}</div>;

CGridColumnGroup.createColumn = createColumn;
CGridColumnGroup.getPropsObjectInternal = getPropsObjectInternal;

export default CGridColumnGroup;
