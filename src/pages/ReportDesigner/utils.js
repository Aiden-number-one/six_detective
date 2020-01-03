/*
 * @Des: 报表设计器的
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-21 14:48:15
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-03 19:06:00
 */
import uuidv1 from 'uuid/v1';
import { stringToNum, createCellPos } from '@/utils/utils';

// 单元格初始化高
export const INITHEIGHT = 23;

// 单元格初始化宽
export const INITWIDTH = 180;

/**
 * @description: 根据公有数据集列表字段生成所JSON中的数据集字段
 * @param {object} dataSetItem 公有数据集字段
 * @return {object} JSON中的数据集字段
 * @Author: mus
 * @Date: 2019-12-21 16:05:41
 */
export function dataSetTransform(dataSetItem) {
  const {
    datasetName,
    datasetIsDict,
    datasetType,
    datasourceId,
    datasourceName,
    dbUser,
    dbSecretWord,
    commandText,
    jdbcString,
    driverInfo,
    datasetId: originDatasetId,
    datasetParams: datasetParamsString,
    datasetFields: datasetFieldsString,
  } = dataSetItem;
  const datasetId = uuidv1();
  const parameters = datasetParamsString;
  const fields = datasetFieldsString;
  return {
    dataset_cat: 'user-define|public', // reserved
    dataset_name: datasetName, // 数据集名称
    dataset_id: datasetId, // 数据集ID
    dataset_is_dict: datasetIsDict === 'N' ? 'false' : 'true', // 是否为字典数据集
    dataset_type: datasetType, // 数据集类型 "SQL|PROCEDURE"
    dataset_private: '1', // 判断改数据集是否为私有数据集
    origin_datasetId: originDatasetId, // 该私有数据集来源于哪个公共数据集id
    query: {
      datasource_name: datasourceName, // 数据源名称
      datasource_id: datasourceId, // 数据源ID
      command_text: commandText, // SQL
      username: dbUser, // 数据源的用户名
      password: dbSecretWord, // 数据源的密码
      url: jdbcString, // jdbcString
      driver: driverInfo, // 驱动
      // SQL参数格式
      // [
      //   {
      //     "parameter_name”: ”due_no”， // 参数名
      //     "parameter_type": "number|string", // 参数类型
      //     "parameter_value": "". // 实际值
      //   }
      // ]
      parameters,
    },

    // 数据集字段
    // {
    //   "field_text_name":"field2", // 字段名
    //   "field_data_name":"reg_name", // 字段显示名称
    //   "field_data_type":"VARCHAR", // 字段数据库名称
    //   "column_comments":"", //字段备注
    //   "column_auto":"" // reserved
    // },
    fields,
  };
}

/**
 * @description: 根据JSON中的数据集字段生成相应的数据集树所需要的数据结构
 * @param {array} dataSets 私有数据集
 * @return {array} 左侧数据集树结构
 * @Author: mus
 * @Date: 2019-12-21 16:13:32
 */
export function dataSetTree(dataSets) {
  return dataSets.map(dataSet => ({
    title: dataSet.dataset_name,
    key: dataSet.dataset_id,
    otherInfo: {
      datasourceId: dataSet.query.datasource_id, // 数据源ID
      commandText: dataSet.query.command_text, // SQL串
      datasetType: dataSet.dataset_type, // 数据集类型
      datasetName: dataSet.dataset_name, // 数据集名字
    },
    children: [
      // 字段
      {
        title: 'Fields',
        key: `${dataSet.dataset_id}Fields`,
        children: dataSet.fields.map(field => ({
          title: field.field_data_name,
          key: `${dataSet.dataset_id}${field.field_data_name}`,
          dragInfo: `${dataSet.dataset_name}.${field.field_data_name}`,
          isLeaf: true,
        })),
        isLeaf: dataSet.fields.length === 0,
      },
      // 参数
      {
        title: 'Parameters',
        key: `${dataSet.dataset_id}Parameters`,
        children: dataSet.query.parameters.map(field => ({
          title: field.parameter_name,
          key: `${dataSet.dataset_id}${field.parameter_name}`,
          isLeaf: true,
        })),
        isLeaf: dataSet.query.parameters.length === 0,
      },
    ],
  }));
}

/**
 * @description: 生成xml部分的宽高部分
 * @param {type} param
 * @return: return
 * @Author: mus
 * @Date: 2020-01-02 21:32:58
 */
export function getColColumnXml(contentDetail) {
  let colColumnCel = '';
  const { rowArray, columnArray } = contentDetail[0];
  rowArray.forEach((value, index) => {
    colColumnCel += `<row row-number="${(index + 1).toString()}" height="${value.toString()}"/>`;
  });
  columnArray.forEach((value, index) => {
    colColumnCel += `<column col-number="${(index + 1).toString()}" width="${value.toString()}"/>`;
  });
  return colColumnCel;
}

/**
 * @description: 根据数据集生成数据集的xml
 * @param {type} param
 * @return: return
 * @Author: mus
 * @Date: 2020-01-03 10:55:58
 */
export function getDataSetXml(contentDetail) {
  const dataSourceMap = {};
  contentDetail.forEach(value => {
    const currentDataSet = dataSourceMap[value.query.datasource_id];
    if (currentDataSet) {
      currentDataSet.push(value);
      return;
    }
    dataSourceMap[value.query.datasource_id] = [value];
  });
  let dataSetXml = '';
  Object.entries(dataSourceMap).forEach(([datasourceId, datasourceValue]) => {
    const { query = {} } = datasourceValue[0];
    const {
      datasource_name: datasourceName,
      username,
      password,
      url,
      driver,
      command_text: commandText,
    } = query;
    dataSetXml += `<datasource datasourceid="${datasourceId}" name="${datasourceName}" type="jdbc" username="${username}" password="${password}" url="${url}" driver="${driver}">`;
    datasourceValue.forEach(dataset => {
      const { dataset_name: datasetName, dataset_type: type, fields = [] } = dataset;
      dataSetXml += ` <dataset name="${datasetName}" type="${type.toLocaleLowerCase()}">`;
      if (type === 'SQL') {
        dataSetXml += ` <sql><![CDATA[${commandText}]]></sql>`;
      }
      fields.forEach(field => {
        const { field_data_name: name } = field;
        dataSetXml += `<field name="${name}"/>`;
      });
      dataSetXml += '</dataset>';
    });
    dataSetXml += '</datasource>';
  });
  return dataSetXml;
}

/**
 * @description: 生成xml部分的单元格部分
 * @param {type} param
 * @return: return
 * @Author: mus
 * @Date: 2020-01-02 17:25:52
 */
export function getTemplateAreaCellPartXml(contentDetail) {
  let cellxml = '';
  const spreadSheetData = contentDetail[0].data;
  const spreadSheetProps = contentDetail[0].cellAttrs;
  spreadSheetData.forEach((colsValue, colsIndex) => {
    colsValue.forEach((rowsValue, rowsIndex) => {
      const cellText = rowsValue;
      const { cellType, style } = spreadSheetProps[colsIndex][rowsIndex];
      const {
        bgcolor,
        forecolor,
        underline,
        align = 'center',
        valign = 'middle',
        fontFamily,
        italic,
        bold,
        fontSize = '10',
        borderBottom,
        borderBottomColor,
        borderBottomType,
        borderBottomWidth,
        borderTop,
        borderTopColor,
        borderTopType,
        borderTopWidth,
        borderLeft,
        borderLeftColor,
        borderLeftType,
        bordeLeftWidth,
        borderRight,
        borderRightColor,
        borderRightType,
        borderRightWidth,
      } = style;
      // 生成
      cellxml += `<cell expand="Down" name="${createCellPos(colsIndex) +
        (rowsIndex + 1).toString()}" row="${rowsIndex + 1}" col="${colsIndex + 1}">
        <cell-style font-size="${fontSize}" align="${align}" valign="${valign}" ${bgcolor &&
        `bgcolor="${bgcolor}"`} ${forecolor && `bgcolor="${forecolor}"`} ${underline &&
        `underline="${underline}"`} ${fontFamily && `font-family="${fontFamily}"`} ${italic &&
        `italic="${italic}"`} ${bold && `italic="${bold}"`} ${borderBottom &&
        `<bottom-border width=${borderBottomWidth} style=${borderBottomType} color=${borderBottomColor}`} ${borderTop &&
        `<top-border width=${borderTopWidth} style=${borderTopType} color=${borderTopColor}`} ${borderLeft &&
        `<left-border width=${bordeLeftWidth} style=${borderLeftType} color=${borderLeftColor}`} ${borderRight &&
        `<right-border width=${borderRightWidth} style=${borderRightType} color=${borderRightColor}`}></cell-style>`;
      // 去除undefined
      cellxml = cellxml.replace(/ undefined/g, '');
      // 生成value相关元素
      if (cellType === 'TEXT') {
        cellxml += `<simple-value><![CDATA[${cellText}]]></simple-value>`;
      } else if (cellType === 'DATASET') {
        const datasetName = cellText.split('.')[0];
        const property = cellText.split('.')[1];
        cellxml += `<dataset-value dataset-name="${datasetName}" property="${property}" aggregate="group" order="none" mapping-type="simple"></dataset-value>`;
      } else {
        cellxml += '<simple-value><![CDATA[]]></simple-value>';
      }
      cellxml += '</cell>';
    });
  });
  return cellxml;
}

/**
 * @description: 修改TemplateArea内的type
 * @param {object}  object 分别为：原始的TemplateArea、需要修改的key值、改为的value值、修改单元格的position
 * @return {object} 新的TemplateArea
 * @Author: mus
 * @Date: 2019-12-23 16:41:39
 */
export function modifyTemplateAreaInside({ originTemplateArea, type, value, position }) {
  const colIndex = stringToNum(position.match(/([A-Z]+)([0-9]+)/)[1]) - 1;
  const rowIndex = position.match(/([A-Z]+)([0-9]+)/)[2] - 1;
  const content = originTemplateArea.rows[rowIndex].cols[colIndex];
  content[type] = value;
  return { ...originTemplateArea };
}
