import React, {
  useState,
  // useEffect,
} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './IframePage.less';

const ref = React.createRef();

const IframePage = props => {
  const [iFrameHeight] = useState(710);

  // useEffect(() => {
  //   const frame = ref.current;
  //   window.addEventListener('message', e => {
  //     frame.style.height = `${e.data.height}px`;
  //     frame.style.width = `${e.data.width}px`;
  //   });
  // });

  const {
    location: {
      query: { iframeUrl },
    },
  } = props;

  return (
    <PageHeaderWrapper>
      <div>
        <iframe
          title="ETL"
          className={styles.iframe}
          src={iframeUrl}
          ref={ref}
          height={iFrameHeight}
        />
      </div>
    </PageHeaderWrapper>
  );
};

export default IframePage;
