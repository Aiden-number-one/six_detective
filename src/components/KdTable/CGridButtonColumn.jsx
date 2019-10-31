import React from 'react';
import { cheetahGrid } from './utils';

function setButtonColumnProps(props) {
  const { caption, disabled, onClick } = props;
  const action = new cheetahGrid.columns.action.ButtonAction({
    action: args => {
      /**
       * Fired when a click on cell.
       */
      onClick(args);
    },
    disabled,
  });
  return {
    columnType: new cheetahGrid.columns.type.ButtonColumn({
      caption,
    }),
    action,
    ...props,
  };
}

const CGridButtonColumn = ({ children }) => <div className="c-grid-button-column">{children}</div>;
CGridButtonColumn.createColumn = setButtonColumnProps;

export default CGridButtonColumn;
