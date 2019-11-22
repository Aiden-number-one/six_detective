import React, { useEffect, useState } from 'react';
import { Chart, Guide, Legend, Coord, Geom } from 'bizcharts';
import styles from './index.less';

const { Text } = Guide;

export default function({ dataSource }) {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    if (dataSource.length > 0) {
      const data = dataSource.map(item => {
        const { successNum, errorNum, taskSum } = item;

        if (taskSum > 0) {
          const unExcuteNum = taskSum - successNum - errorNum;
          return {
            item,
            result: [
              { name: '执行成功', value: successNum },
              { name: '执行失败', value: errorNum },
              { name: '未执行', value: unExcuteNum },
            ],
          };
        }
        return {
          result: [{ name: '执行中', value: 0 }],
        };
      });
      setChartData(data);
    }
  }, [dataSource]);

  function handleClick(item) {
    console.log(item);
  }
  if (chartData.length === 0) {
    return '暂无数据';
  }

  return (
    <ul className={styles['chart-container']}>
      {chartData.map(({ result, item }) => (
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
