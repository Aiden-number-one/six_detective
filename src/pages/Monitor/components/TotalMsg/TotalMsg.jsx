import React from 'react';
import classNames from 'classnames';
import styles from './TotalMsg.less';

const { container, count } = styles;

export default function TotalMsg(props) {
  const { className, des } = props;

  return (
    <div className={classNames(container, className)}>
      <span>{des.text}</span>
      <div className={count}>
        <span>{des.total}</span>
      </div>
    </div>
  );
}
