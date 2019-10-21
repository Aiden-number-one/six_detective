/*
 * @Description: lan
 * @Author: lan
 * @Date: 2019-08-07 13:33:44
 * @LastEditTime: 2019-09-26 10:21:13
 * @LastEditors: mus
 */
const getDatas = (req, res) => {
  setTimeout(() => {
    res.json({
      bcjson: {
        code: '0',
        detail: '',
        flag: '1',
        items: [
          {
            key: 1,
            ROWNUM_: 1,
            ROWSCOUNT: 2,
            connectionId: 'DBE825E384A3E44645831213A41CAA9269',
            createdTime: '20190801165017',
            creator: null,
            fileImportTable_name: null,
            mdType: '表',
            mdTypeOri: 'T',
            modifiedTime: '20190801165017',
            modifieder: null,
            objectSize: '5.64KB',
            queryScript: null,
            recordCount: '84',
            schemName: 'ACL',
            status: '1',
            tableCat: 'retl',
            tableDesc: null,
            tableId: 'TABLEC551460FF84D4F7F929FE081C5825C21',
            tableName: 'ACL_ROLE',
          },
          {
            key: 2,
            ROWNUM_: 2,
            ROWSCOUNT: 2,
            connectionId: 'DBE825E384A3E44645831213A41CAA9269',
            createdTime: '20190801165016',
            creator: null,
            fileImportTable_name: null,
            mdType: '表',
            mdTypeOri: 'T',
            modifiedTime: '20190801165017',
            modifieder: null,
            objectSize: '13.56KB',
            queryScript: null,
            recordCount: '92',
            schemName: 'ACL',
            status: '1',
            tableCat: 'retl',
            tableDesc: null,
            tableId: 'TABLE3D059740307940C58911BEEA1FD81AEA',
            tableName: 'ACL_BRANCH',
          },
        ],
        len: 2,
        lengths: 2,
        msg: '查询成功',
        timeSpent: 0,
        totalCount: 2,
      },
    });
  }, 1000);
};

const delDatas = (req, res) => {
  res.json({
    bcjson: {
      code: '0',
      detail: '',
      flag: '1',
      len: 1,
      lengths: 1,
      msg: '删除成功',
      timeSpent: 0,
      totalCount: 1,
    },
  });
};

const getDataSourceList = (req, res) => {
  setTimeout(() => {
    res.json({
      bcjson: {
        code: '0',
        detail: '',
        flag: '1',
        items: [
          {
            active: true,
            closeCharacter: null,
            conType: null,
            connectWay: null,
            connectionDesc: null,
            connectionId: 'DB862A221E4DE149F588D02FF434085552',
            connectionName: '校验数据RETL',
            connectionType: 'Oracle',
            connectionTypeOri: 'DRIVERORACLE90e902db003152dc56f',
            conseparator: null,
            createdTime: '20190815191709',
            creator: null,
            dbDatabase: 'retldb',
            dbInstance: 'retldb',
            dbPassword: 'FDC0DD5D885F963A',
            dbPort: '1521',
            dbUser: 'retl',
            driverInfo: 'oracle.jdbc.driver.OracleDriver',
            driverLogo: 'oracle_name.jpg',
            fileCharset: null,
            fileExtName: null,
            filePath: null,
            fileType: null,
            ifData: null,
            jdbcFlag: null,
            jdbcString: 'jdbc:oracle:thin:@10.60.69.43:1521/retldb',
            maxConnectCount: null,
            modifiedTime: '20190815191709',
            modifieder: null,
            server: '10.60.69.43',
            stateFlag: 'T',
          },
          {
            active: false,
            closeCharacter: null,
            conType: null,
            connectWay: null,
            connectionDesc: null,
            connectionId: 'DBE825E384A3E44645831213A41CAA9269',
            connectionName: '48_trd',
            connectionType: 'Oracle',
            connectionTypeOri: 'DRIVERORACLE90e902db003152dc56f',
            conseparator: null,
            createdTime: '20190712143138',
            creator: null,
            dbDatabase: 'retl',
            dbInstance: 'retl',
            dbPassword: 'E53AEE9FC60E485E5A09F6D6B911712A',
            dbPort: '1521',
            dbUser: 'trd',
            driverInfo: 'oracle.jdbc.driver.OracleDriver',
            driverLogo: 'oracle_name.jpg',
            fileCharset: null,
            fileExtName: null,
            filePath: null,
            fileType: null,
            ifData: null,
            jdbcFlag: null,
            jdbcString: 'jdbc:oracle:thin:@10.60.69.48:1521/retl',
            maxConnectCount: null,
            modifiedTime: '20190712143138',
            modifieder: null,
            server: '10.60.69.48',
            stateFlag: 'T',
          },
        ],
        len: 2,
        lengths: 2,
        msg: '查询成功',
        timeSpent: 0,
        totalCount: 2,
      },
    });
  }, 1000);
};

export default {
  'POST /api/v2.0/kingdom.retl.getDatas.json': getDatas,
  'POST /api/v2.0/kingdom.retl.delDatas.json': delDatas,
  'POST /api/v2.0/kingdom.retl.getDataSourceList.json': getDataSourceList,
};
