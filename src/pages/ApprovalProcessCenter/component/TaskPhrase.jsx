import React, { useState } from 'react';
import { Popover, Button } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from '../index.less';
import { PHRASES } from '../constants';

export default function({ postComment }) {
  const [phraseVisible, setPhraseVisible] = useState(false);
  function handlePhrase(item) {
    setPhraseVisible(false);
    postComment(item);
  }

  return (
    <Popover
      visible={phraseVisible}
      onVisibleChange={v => setPhraseVisible(v)}
      overlayClassName={styles['phases-container']}
      placement="topRight"
      trigger="click"
      content={
        <ul className={styles.phase}>
          {PHRASES.map((item, index) => (
            <li key={item} onClick={() => handlePhrase(item)}>
              {index + 1}. {item}
            </li>
          ))}
        </ul>
      }
    >
      <Button
        type="primary"
        onClick={() => setPhraseVisible(true)}
        className={styles['phrase-btn']}
      >
        <FormattedMessage id="alert-center.phrases" />
      </Button>
    </Popover>
  );
}
