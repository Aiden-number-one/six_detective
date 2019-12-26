/*
 * @Des: Des
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-23 10:17:57
 * @LastEditors  : mus
 * @LastEditTime : 2019-12-26 16:33:49
 */
/*
 * @Des: 报表设计器的
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-21 14:48:15
 * @LastEditors  : mus
 * @LastEditTime : 2019-12-23 16:22:29
 */
import uuidv1 from 'uuid/v1';

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
    commandText,
    datasetId: originDatasetId,
    datasetParams: datasetParamsString,
    datasetFields: datasetFieldsString,
  } = dataSetItem;
  const datasetId = uuidv1();
  const parameters = JSON.parse(datasetParamsString || '[]');
  const fields = JSON.parse(datasetFieldsString || '[]');
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
      hostname: '', // reserved
      path: '', // reserved
      method: '', // reserved
      cate: '', // reserved
      node: '', // reserved
      page_type: '0', // reserved
      page_params: '', // reserved
      page_size_params: '', // reserved
      record_name: '', // reserved

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
    children: [
      // 字段
      {
        title: 'Fields',
        key: `${dataSet.dataset_id}Fields`,
        children: dataSet.fields.map(field => ({
          title: field.field_text_name,
          key: `${dataSet.dataset_id}${field.field_data_name}`,
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
 * @description: 转换报表内设置的JSON串
 * @param {object} contentDetail 表格相关信息
 * @param {object} originContentDetail 源数据
 * @return {object} 报表JSON串中的temaplateArea相关
 * @Author: mus
 * @Date: 2019-12-23 16:41:39
 */
export function getTemplateArea(contentDetail, originContentDetail) {
  const spreadSheetData = contentDetail[0].data;
  const spreadSheetStyle = contentDetail[0].cellAttrs;
  const needRowsCols = spreadSheetData.map((colsValue, colsIndex) => ({
    cols: colsValue.map((rowsValue, rowsIndex) => {
      const cellText = rowsValue;
      return {
        cell_expression: '', // 公式相关
        cell_default_value: '', // reserved
        cell_text: cellText, // text（=ds.reg_name|用户机构|$V{dian}|all）
        cell_input_type: 'input', // 类型相关 （input|select|date|file|text|checkbox）
        dict: '', // reserved
        link: '', // reserved
        frameid: '', // reserved
        width: '', // reserved
        colwidth: '', // reserved
        height: '', // reserved
        rowspan: '', // rowspan
        colspan: '', // colspan
        cell_style: spreadSheetStyle[colsIndex][rowsIndex].style,
      };
    }),
  }));
  return {
    page_order: '', // reserved
    page_size: '', // reserved
    max_row: '', // reserved
    max_column: '', // reserved
    rows: needRowsCols,
    originContentDetail,
  };
}
