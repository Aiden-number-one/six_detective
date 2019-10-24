import React from 'react';
import classNames from 'classnames';
import styles from './TotalMsg.less';

const { container, countWithTitle } = styles;

export default function TotalMsgWithTit(props) {
  const { className, des, propstyle } = props;

  return (
    <div className={classNames(container, className)} style={propstyle}>
      <span>| {des.text}</span>
      <div className={countWithTitle}>
        <p>{des.title}</p>
        <span style={{ color: '#10416c' }}>{des.total}</span>
      </div>
      <div className={countWithTitle}>
        <p>{des.title1}</p>
        <span style={{ color: 'rgb(255, 184, 28)' }}>{des.total1}</span>
      </div>
      <div className={countWithTitle}>
        <p>{des.title2}</p>
        <span style={{ color: 'rgb(245, 34, 45)' }}>{des.total2}</span>
      </div>
      <div className={countWithTitle}>
        <p>{des.title3}</p>
        <span style={{ color: 'rgb(105, 186, 109)' }}>{des.total3}</span>
      </div>
    </div>
  );
}
