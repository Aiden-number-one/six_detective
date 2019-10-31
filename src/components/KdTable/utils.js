/* eslint-disable no-param-reassign */
import cheetahGrid from 'cheetah-grid';

export { cheetahGrid };

export function normalizeColumnType(columnType) {
  if (columnType && typeof columnType !== 'string') {
    if (typeof columnType === 'function') {
      columnType = columnType();
    }
    if (typeof columnType.typeName === 'string') {
      columnType = new cheetahGrid.columns.type[columnType.typeName](columnType.option);
    }
  }
  return columnType;
}
export function normalizeAction(action) {
  if (action && typeof action !== 'string') {
    if (typeof action === 'function') {
      action = new cheetahGrid.columns.action.Action({
        action,
      });
    } else if (typeof action.actionName === 'string') {
      action = new cheetahGrid.columns.action[action.actionName](action.option);
    }
  }
  return action;
}
