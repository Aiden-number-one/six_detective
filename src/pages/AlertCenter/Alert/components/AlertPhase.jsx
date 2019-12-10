import React, { useState } from 'react';
import { Popover, Button } from 'antd';
import styles from '@/pages/AlertCenter/index.less';

const PHASES = ['AA', 'BB', 'CC', 'DD'];

export default function({ postComment }) {
  const [phaseVisible, setPhaseVisible] = useState(false);
  function handlePhase(item) {
    setPhaseVisible(false);
    postComment(item);
  }

  return (
    <Popover
      visible={phaseVisible}
      placement="topLeft"
      trigger="click"
      content={
        <ul className={styles.phase}>
          {PHASES.map((item, index) => (
            <li key={item} onClick={() => handlePhase(item)}>
              {index + 1}. {item}
            </li>
          ))}
        </ul>
      }
    >
      <Button type="primary" onClick={() => setPhaseVisible(true)}>
        Phase
      </Button>
    </Popover>
  );
}
