import React from 'react';
import { Chart, Guide, Legend, Coord, Geom } from 'bizcharts';
import styles from './index.less';

const { Text } = Guide;

export default function({ dataSource, getEachBatch }) {
  function handleClick(item) {
    getEachBatch(item);
  }

  if (dataSource.length === 0) {
    return '暂无数据';
  }

  return (
    <ul className={styles['chart-container']}>
      {dataSource.map(({ result, ...item }) => (
        <li onClick={() => handleClick(item)}>
          <Chart width="240" height="140" data={result} padding={[10, 'auto']}>
            <Coord type="theta" radius={0.8} innerRadius={0.7} />
            <Legend position="left-center" />
            <Guide>
              <Text
                position={['50%', '5%']}
                content={item.errorNum}
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                }}
              />
              <Text
                position={['50%', '50%']}
                content={item.successNum}
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                }}
              />
              <Text
                position={['50%', '100%']}
                content={item.batchNo}
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                }}
              />
            </Guide>

            <Geom
              type="intervalStack"
              position="value"
              color={['name', ['#60c4bb', '#ea6b74', '#cccccc']]}
              size={8}
            />
          </Chart>
        </li>
      ))}
    </ul>
  );
}
