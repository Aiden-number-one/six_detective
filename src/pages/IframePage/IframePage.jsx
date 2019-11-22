import React, { useState, useEffect } from 'react';
import styles from './IframePage.less';

const ref = React.createRef();

const IframePage = props => {
  const [iFrameHeight, setIframeHeighet] = useState(800);

  useEffect(() => {
    const frame = ref.current;
    window.addEventListener('message', e => {
      frame.style.height = `${e.data.height}px`;
      frame.style.width = `${e.data.width}px`;
    });
  });

  const {
    location: {
      query: { iframeUrl },
    },
  } = props;

  return (
    <div style={{ margin: '-24px -30px -8px' }}>
      <iframe
        title="11111"
        className={styles.iframe}
        src={iframeUrl}
        ref={ref}
        height={iFrameHeight}
      />
    </div>
  );
};

export default IframePage;
