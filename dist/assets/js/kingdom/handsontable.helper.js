if (typeof jQuery === "undefined") {
    throw new Error("jquery.kingdom requires jQuery");
}



$.extend({
    handsontable: {
        valueExchange: function(v_cell){
            var tmpValue = '文本框';
            if(v_cell.cellType=='input'){
                switch (v_cell.inputType) {
                    case "text_255":
                        tmpValue ="文本（<255字符）";
                        break;
                    case "text_500":
                        tmpValue = "文本（<500字符）";
                        break;
                    case "text_1000":
                        tmpValue ="文本（<1000字符）";
                        break;
                    case "text_4000":
                        tmpValue = "文本（<4000字符）";
                        break;
                    case "text_clob":
                        tmpValue = "文本（>4000字符）";
                        break;
                    case "int":
                        tmpValue = "整数";
                        break;
                    case "number_2":
                        tmpValue = "金额（2位小数）";
                        break;
                    case "number_4":
                        tmpValue = "金额（4位小数）";
                        break;
                    case "ratio_1":
                        tmpValue = "百分比（x）％";
                        break;
                    case "ratio_100":
                        tmpValue = "百分比（x*100）％";
                        break;
                    case "ratio_1000":
                        tmpValue = "千分比（x*1000）‰";
                        break;
                    case "date":
                        tmpValue = "日期";
                        break;
                    case "select":
                        tmpValue = "下拉选择框";
                        break;
                    default:
                        tmpValue = "";
                        break;
                }
            }
            return tmpValue;
        },
        boxType: function(cellProperties,keyItem,dictItemObj){
            //格式控制inputType，inputTypeDict
            //格式控制inputType，inputTypeDict
            var inputType = keyItem.inputType;
            inputType = inputType.split('_');
            var str = inputType[0];
            
            switch(str){
                case ('text'):
                    cellProperties.type = 'text';
                    var exp = new RegExp("^.{0,"+inputType[1]+"}$");
                    cellProperties.validator = exp;
                    break;
                case ('number'):
                    cellProperties.type = 'numeric';
                    var precision = inputType[1];
                    if(!precision){
                        cellProperties.format = '0,0';
                        break;
                    }
                    var format = precision>0?'0,0':'0,0.';
                    for (var i = 0; i < precision; i++) {
                        format += '0';
                    }
                    cellProperties.format = format;
                    break;
                case ('ratio'):
                    cellProperties.type = 'numeric';
                    if(inputType[1]=='1'){
                        cellProperties.format = '0,0.00P';//1->1.00%
                    }else if(inputType[1]=='100'){
                        cellProperties.format = '0,0.00%';//1->100.00%
                    }else if(inputType[1]=='1000'){
                        cellProperties.format = '0,0.00‰';//1->1.00‰
                    }
                    break;
                case ('date'):
                    cellProperties.type = 'date';
                    cellProperties.dateFormat = 'YYYY-MM-DD';
                    cellProperties.correctFormat = true;
                    cellProperties.defaultDate = '';
                    cellProperties.datePickerConfig={
                        i18n: {
                          months        : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                          weekdays      : ['日','一','二','三','四','五','六'],
                          weekdaysShort : ['日','一','二','三','四','五','六']
                        }
                    }
                    break;
                case ('select'):
                    cellProperties.editor = 'select';
                    cellProperties.type = 'dropdown';
                    if(dictItemObj){
                        cellProperties.selectOptions = dictItemObj[keyItem.cellTableField];
                    }
                    //由于下拉选择和具体值不一致
                    // cellProperties.selectOptions = {'1':'其他','资产证券化产品':'2'};
                    break;
                default:
                    cellProperties.type = 'text';
                    break;
            }
            return cellProperties;
        },
        setReportData: function(items, reportData, requireParams, dictItems, cellpos) {
            var dataArrays = new Array();

            //数据保留key值
            var _rowHeights = [];
            var _colWidths = [];
            //模板设置的行高和列宽
            var rowHeights,colWidths;
            var sets = {
                tableType: requireParams.tableType
            };
            //台账业务表没有合计
            if (requireParams.tableType == 'list-business') {
                var mergeCells = new Array();
                var sumCol = 0,sumRow = 0;
                var rowHeightMap = {};
                var colWidthMap = {};
                var dataParam = {};
                dataParam.dataArray = new Array();
                

                if (reportData) {

                    //转义reportDate字典值
                    $.each(items, function(i, item) {
                        if (item.inputType == 'select') {
                            $.each(reportData, function(j, report) {
                                var filed = item.cellTableField;
                                if(dictItems && dictItems[filed]){
                                    report[filed] = dictItems[filed][report[filed]];
                                }
                            })
                        }
                    });

                    $.each(reportData, function(j, reportData) {
                        //获取字段数据
                        dataParam.dataArray.push(reportData);
                    })
                }

                var newItems = new Array();
                var newMap = {};
                // if(dataParam.dataArray.length>0){
                var rowdatas = dataParam.dataArray;
                var STARTROW = 0; //数据开始索引
                var ENDROW = 0; //数据结束索引
                //获取startRow
                $.each(items, function(i, item) {
                    if (item.cellType == 'input') {
                        requireParams.startRow = item.cellRow;
                        return false;
                    }
                });
                $.each(items, function(i, item) { //获取数据开始和结束索引
                    if (requireParams.startRow == item.cellRow) {
                        rowHeights = item.rowHeights;
                        colWidths = item.colWidths;
                        if (item.STARTROW == '1') STARTROW = i;
                        if (item.ENDROW == '1') ENDROW = i;
                    }else if(requireParams.startRow < item.cellRow){
                        return false;
                    }
                });
                // $.each(items, function(i, item) {
                var itemsLength = items.length;
                for (var i = 0; i < itemsLength;) {
                    var item = items[i];
                    if (item.cellRow < requireParams.startRow) {
                        newMap[item.cellRow + '|' + item.cellCol] = item;
                        newItems.push(item);
                        i++;
                    } else {
                        if (requireParams.startRow == item.cellRow) {
                            if (rowdatas && rowdatas.length > 0) {
                                //数据组装
                                for (var l = 0; l < rowdatas.length; l++) {
                                    for (var m = STARTROW; m <= ENDROW; m++) {
                                        var temp = $.extend({}, items[m]);
                                        temp.cellRow = temp.cellRow + l;
                                        if (m == STARTROW) {
                                            //数据行第一列增加rowid,表示这是修改，而不是新增
                                            newMap[temp.cellRow + '|' + temp.cellCol + 'rowId'] = rowdatas[l]['rowId'];
                                        }

                                        temp.cellTableValue = rowdatas[l][temp.cellTableField];
                                        newMap[temp.cellRow + '|' + temp.cellCol] = temp;
                                        newItems.push(temp);
                                    }
                                }
                                i = i + ENDROW - STARTROW + 1;
                            } else {
                                newMap[item.cellRow + '|' + item.cellCol] = item;
                                newItems.push(item);
                                i++;
                            }

                        } else if (item.cellRow > requireParams.startRow) {

                            if(rowdatas.length!=0){
                                item.cellRow = item.cellRow + rowdatas.length - 1;
                            }
                            newMap[item.cellRow + '|' + item.cellCol] = item;
                            newItems.push(item);
                            i++;
                        }
                    }
                };
                // }

                $.each(newItems, function(i, item) {
                    if(item['rowHeight']){
                        rowHeightMap[item.cellRow] = item['rowHeight']<24?24:item['rowHeight'];
                    }
                    if(item['colWidth']){
                        colWidthMap[item.cellCol] = item['colWidth'] * 1.33;
                    }
                    if (item.cellRow == 0) {
                        //总列数
                        sumCol = sumCol + (item.mergedColCount == 0 ? 1 : item.mergedColCount);
                    }

                    if (item.mergedRowCount > 1 || item.mergedColCount > 1) {
                        var cells = {};
                        cells.row = item.cellRow;
                        cells.col = item.cellCol;
                        cells.rowspan = item.mergedRowCount ? item.mergedRowCount : 1;
                        cells.colspan = item.mergedColCount ? item.mergedColCount : 1;
                        mergeCells.push(cells);
                    }
                    //行是从0开始
                    //流表加上几条数据行
                    sumRow = item.cellRow + (item.mergedRowCount?item.mergedRowCount:1);

                });
                // rowHeights,colWidths
                if(rowHeights){
                    _rowHeights = rowHeights.split(',');
                }else{
                    $.each(rowHeightMap, function(k, v) {
                        _rowHeights.push(v);
                    });
                }

                if(colWidths){
                    _colWidths = colWidths.split(',');
                }else{
                    $.each(colWidthMap, function(k, v) {
                        _colWidths.push(v);
                    });
                }
                

                // for(var i=0;i<sets.sumRow;i++){
                for (var i = 0; i < sumRow; i++) {
                    dataArrays[i] = new Array();
                    for (var j = 0; j < sumCol; j++) {
                        var mapItem = newMap[i + '|' + j];
                        if (mapItem) {
                            if (mapItem.cellType == 'show') {
                                dataArrays[i][j] = mapItem.fieldShowText;
                            } else {
                                if(requireParams.type=='templateSets'){
                                    dataArrays[i][j] = requireParams.inputTypeMap[mapItem.inputTypeDict];
                                }else {
                                    dataArrays[i][j] = mapItem.cellTableValue;
                                }
                            }
                        } else {
                            dataArrays[i][j] = '';
                        }
                    }
                }

                //数据起始行
                sets.newMap = newMap; //newMap[0|0]={...}单元格对象
                sets.dataStartRow = requireParams.startRow;
                if(dataParam.dataArray.length > 0){
                    var number = dataParam.dataArray.length;
                }else{
                    var number = 1;
                }
                sets.ishjRow = requireParams.startRow + number;//虽然没有合计行，但是为了插入操作
                sets.mergeCells = mergeCells;
                sets.sumCol = sumCol;
                sets.sumRow = sumRow;
                sets.dataArrays = dataArrays;
                sets.rowHeights = _rowHeights;
                sets.colWidths = _colWidths;
                return sets;
            } else if (requireParams.tableType == 'list') {
                var mergeCells = new Array();
                var formulaMap = {};//公式map集合{'f8':item}
                var sumCol = 0,sumRow = 0;
                var rowHeightMap = {};
                var colWidthMap = {};
                var dataParam = {};
                dataParam.dataArray = new Array();
                dataParam.hjdataArray;

                if (reportData) {
                    //转义reportDate字典值
                    $.each(items, function(i, item) {
                        if (item.inputType == 'select') {
                            $.each(reportData, function(j, report) {
                                var filed = item.cellTableField;
                                if(dictItems && dictItems[filed]){
                                    report[filed] = dictItems[filed][report[filed]];
                                }
                            })
                        }
                    });

                    $.each(reportData, function(i, item) {
                        if (item.ISHJ == '1') { //流表数据行
                            dataParam.hjdataArray = item;
                        } else { //流表合计行必须一行
                            dataParam.dataArray.push(item);
                        }
                        //获取字段数据
                        //dataParam.dataArray.push(reportData[i]);
                    });
                }

                var newItems = new Array();
                var newMap = {};
                // if(dataParam.dataArray.length>0){
                var rowdatas = dataParam.dataArray;
                var STARTROW = 0; //数据开始索引
                var ENDROW = 0; //数据结束索引

                if(!requireParams.startRow){//如果startRow为空
                    //获取startRow
                    $.each(items, function(i, item) {
                        if (item.cellType == 'input') {
                            requireParams.startRow = item.cellRow;
                            return false;
                        }
                    });
                }
                $.each(items, function(i, item) { //获取数据开始和结束索引
                    if (requireParams.startRow == item.cellRow) {
                        if (item.STARTROW == '1') STARTROW = i;
                        if (item.ENDROW == '1') ENDROW = i;
                        rowHeights = item.rowHeights;
                        colWidths = item.colWidths;
                        if(cellpos && cellpos[item.cellRow+'|'+item.cellCol]){
                            item.autoFormulaMap = cellpos[item.cellRow+'|'+item.cellCol];
                        }
                    }else if(requireParams.startRow+1 == item.cellRow){
                        //合计行的公式
                        if(cellpos && cellpos[item.cellRow+'|'+item.cellCol]){
                            item.autoFormulaMap = cellpos[item.cellRow+'|'+item.cellCol];
                        }
                    }else if(requireParams.startRow+1 < item.cellRow){
                        return false;
                    }
                });
                // $.each(items, function(i, item) {
                var itemsLength = items.length;
                for (var i = 0; i < itemsLength;) {
                    var item = items[i];
                    if (item.cellRow < requireParams.startRow) {
                        newMap[item.cellRow + '|' + item.cellCol] = item;
                        newItems.push(item);
                        i++;
                    } else {
                        //数据开始行开始，组装数据
                        if (requireParams.startRow == item.cellRow) {
                            if (rowdatas && rowdatas.length > 0) {
                                //数据组装
                                for (var l = 0; l < rowdatas.length; l++) {
                                    for (var m = STARTROW; m <= ENDROW; m++) {
                                        var temp = $.extend({}, items[m]);
                                        temp.cellRow = temp.cellRow + l;//增加行数
                                        if (m == STARTROW) {
                                            //数据行第一列增加rowid,表示这是修改，而不是新增
                                            newMap[temp.cellRow + '|' + temp.cellCol + 'rowId'] = rowdatas[l]['rowId'];
                                        }
                                        temp.cellTableValue = rowdatas[l][temp.cellTableField];
                                        newMap[temp.cellRow + '|' + temp.cellCol] = temp;
                                        newItems.push(temp);
                                        if(temp.fieldFormula){//加入公式map
                                            temp.resultCell = true;
                                            temp.borderStyle += 'background-color:#efdcdc !important;';
                                            formulaMap[temp.cellTableField] = temp;
                                        }
                                    }
                                }
                                i = i + ENDROW - STARTROW + 1;
                            } else {
                                if(item.fieldFormula){//加入公式map
                                    formulaMap[item.cellTableField] = item;
                                    item.resultCell = true;
                                    item.borderStyle += 'background-color:#efdcdc !important;'
                                }
                                newMap[item.cellRow + '|' + item.cellCol] = item;
                                newItems.push(item);
                                i++;
                            }

                        } else if (item.cellRow > requireParams.startRow) {
                            if(rowdatas.length!=0){
                                item.cellRow = item.cellRow + rowdatas.length - 1;
                            }

                            if(item.ishj=='1'){
                                sets.ishjRow = item.cellRow;
                                newMap[item.cellRow + '|0ishj'] = '1';
                                if(item.cellType == 'input'){
                                    if (dataParam.hjdataArray) {
                                        //合计组装
                                        //在数据行下一列就当做合计行处理
                                        newMap[item.cellRow + '|0rowId'] = dataParam.hjdataArray['rowId'];
                                        item.cellTableValue = dataParam.hjdataArray[item.cellTableField];
                                    }
                                    if(item.fieldFormula){//加入公式map
                                        formulaMap[item.cellRow + '|' + item.cellTableField] = item;
                                        item.resultCell = true;
                                        item.borderStyle += 'background-color:#efdcdc !important;'
                                    }
                                }
                                
                            }
                            
                            newMap[item.cellRow + '|' + item.cellCol] = item;
                            newItems.push(item);
                            i++;
                        }
                    }
                };
                // }

                console.log(newItems);

                $.each(newItems, function(i, item) {
                    if(item['rowHeight']){
                        rowHeightMap[item.cellRow] = item['rowHeight']<24?24:item['rowHeight'];
                    }
                    if(item['colWidth']){
                        colWidthMap[item.cellCol] = item['colWidth'] * 1.33;
                    }
                    if (item.cellRow == 0) {
                        //总列数
                        sumCol = sumCol + (item.mergedColCount == 0 ? 1 : item.mergedColCount);
                    }

                    if (item.mergedRowCount > 1 || item.mergedColCount > 1) {
                        var cells = {};
                        cells.row = item.cellRow;
                        cells.col = item.cellCol;
                        cells.rowspan = item.mergedRowCount ? item.mergedRowCount : 1;
                        cells.colspan = item.mergedColCount ? item.mergedColCount : 1;
                        mergeCells.push(cells);
                    }
                    //行是从0开始
                    //流表加上几条数据行
                    sumRow = item.cellRow + (item.mergedRowCount?item.mergedRowCount:1);

                });

                // rowHeights,colWidths
                if(rowHeights){
                    _rowHeights = rowHeights.split(',');
                }else{
                    $.each(rowHeightMap, function(k, v) {
                        _rowHeights.push(v);
                    });
                }

                if(colWidths){
                    _colWidths = colWidths.split(',');
                }else{
                    $.each(colWidthMap, function(k, v) {
                        _colWidths.push(v);
                    });
                }

                // for(var i=0;i<sets.sumRow;i++){
                for (var i = 0; i < sumRow; i++) {
                    dataArrays[i] = new Array();
                    for (var j = 0; j < sumCol; j++) {
                        var mapItem = newMap[i + '|' + j];
                        if (mapItem) {
                            if (mapItem.cellType == 'show') {
                                dataArrays[i][j] = mapItem.fieldShowText;
                            } else {
                                dataArrays[i][j] = mapItem.cellTableValue;
                                if(requireParams.type=='templateSets'){
                                    dataArrays[i][j] = requireParams.inputTypeMap[mapItem.inputTypeDict];
                                }else {
                                    dataArrays[i][j] = mapItem.cellTableValue;
                                }
                            }
                        } else {
                            dataArrays[i][j] = '';
                        }

                    }
                }

                //数据起始行
                sets.newMap = newMap; //newMap[0|0]={...}单元格对象
                sets.formulaMap = formulaMap;
                sets.dataStartRow = requireParams.startRow;
                //ishjRow不是一定就有合计行，而是表明流表的数据结束行
                sets.ishj = true;//,默认有合计行
                if(!sets.ishjRow){
                    sets.ishj = false;
                    if(dataParam.dataArray.length > 0){
                        var number = dataParam.dataArray.length;
                    }else{
                        var number = 1;
                    }
                    //没有合计行数据，但是需要保留数据行的下一行
                    sets.ishjRow = requireParams.startRow+number;
                }
                sets.mergeCells = mergeCells;
                sets.sumCol = sumCol;
                sets.sumRow = sumRow;
                sets.dataArrays = dataArrays;
                sets.rowHeights = _rowHeights;
                sets.colWidths = _colWidths;
                console.log(dataArrays);
                return sets;

            } else { //格表组装
                var dataArrays = new Array();
                var mergeCells = new Array();
                var newMap = {}; //显示{'0|0':item,'0|1':item}
                var cellFieldMap = {};//x显示{'a1':{row:0,col:0}}
                var formulaMap = {};//公式map集合{'f8':item}
                var sumCol = 0;
                var sumRow = 0;
                var rowHeightMap = {};
                var colWidthMap = {};
                //每条数据的下标位置



                if (reportData && reportData.length == 1) {
                    var rowdatas = reportData[0];
                    newMap['0|0rowId'] = rowdatas['rowId'];
                    //转义reportDate字典值
                    $.each(items, function(i, item) {
                        if (item.inputType == 'select') {
                            $.each(reportData, function(j, report) {
                                var filed = item.cellTableField;
                                if(dictItems && dictItems[filed]){
                                    report[filed] = dictItems[filed][report[filed]];
                                }
                            })
                        }
                    });
                }

                $.each(items, function(i, item) {
                    rowHeights = item.rowHeights;
                    colWidths = item.colWidths;
                    if(item['rowHeight']){
                        rowHeightMap[item.cellRow] = item['rowHeight']<24?24:item['rowHeight'];
                    }
                    if(item['colWidth']){
                        colWidthMap[item.cellCol] = item['colWidth'] * 1.33;
                    }

                    if (item.cellRow == 0) {
                        //总列数
                        sumCol = sumCol + (item.mergedColCount == 0 ? 1 : item.mergedColCount);
                    }
                    var cells = {};
                    if (item.mergedRowCount > 1 || item.mergedColCount > 1) {
                        cells.row = item.cellRow;
                        cells.col = item.cellCol;
                        cells.rowspan = item.mergedRowCount ? item.mergedRowCount : 1;
                        cells.colspan = item.mergedColCount ? item.mergedColCount : 1;
                        mergeCells.push(cells);
                    }
                    //key:value字段
                    var key = item.cellRow + '|' + item.cellCol;
                    if (item.cellType == 'input') {
                        cellFieldMap[item.cellTableField] = item;
                        if (reportData && reportData.length == 1) {
                            item.cellTableValue = rowdatas[item.cellTableField];
                        }
                        if(item.fieldFormula){//加入公式map
                            formulaMap[item.cellTableField] = item;
                            item.resultCell = true;
                            item.borderStyle += 'background-color:#efdcdc !important;'
                        }

                        if(cellpos && cellpos[key]){
                            item.autoFormulaMap = cellpos[key];
                        }
                    }
                    newMap[key] = item;
                    //行是从0开始
                    sumRow = item.cellRow + (item.mergedRowCount?item.mergedRowCount:1);

                });

                // rowHeights,colWidths
                if(rowHeights){
                    _rowHeights = rowHeights.split(',');
                }else{
                    $.each(rowHeightMap, function(k, v) {
                        _rowHeights.push(v);
                    });
                }

                if(colWidths){
                    _colWidths = colWidths.split(',');
                }else{
                    $.each(colWidthMap, function(k, v) {
                        _colWidths.push(v);
                    });
                }

                for (var i = 0; i < sumRow; i++) {
                    dataArrays[i] = new Array();
                    for (var j = 0; j < sumCol; j++) {
                        var mapItem = newMap[i + '|' + j];
                        if (mapItem) {
                            if (mapItem.cellType == 'show') {
                                dataArrays[i][j] = mapItem.fieldShowText;
                            } else {
                                if(requireParams.type=='templateSets'){
                                    dataArrays[i][j] = requireParams.inputTypeMap[mapItem.inputTypeDict];
                                }else {
                                    dataArrays[i][j] = mapItem.cellTableValue;
                                }
                            }
                        } else {
                            dataArrays[i][j] = '';
                        }
                    }
                }

                sets.newMap = newMap; //填充数据后的表结构
                sets.cellFieldMap = cellFieldMap;
                sets.formulaMap = formulaMap;
                sets.mergeCells = mergeCells;
                sets.sumCol = sumCol;
                sets.sumRow = sumRow;
                sets.dataArrays = dataArrays;
                sets.rowHeights = _rowHeights;
                sets.colWidths = _colWidths;
                return sets;
            }


        },
        getReportData: function(sets) {
            var dataMap = new Array();
            var dictItems = sets.TransferDictItems;
            if (sets.tableType == 'list-business') {
                var dataStartRow = sets.dataStartRow;
                var dataEndRow = hotInstance.countRows();//总行数8,其实只有到7列
                var ishjRow = sets.ishjRow;
                var dataItem;
                //此处必须以合计行结尾（不然会把填报说明的数据带过来）
                for (var i = dataStartRow; i < ishjRow; i++) {
                    var rowData = hotInstance.getDataAtRow(i);
                    //获取可视数据
                    var newRowDate = [];
                    dataItem = new Object();
                    for (var j = 0; j < rowData.length; j++) {
                        var cellMeta = hotInstance.getCellMeta(i, j);
                        var cellTableField = hotInstance.getCellMeta(i, j)['cellTableField'];
                        if(cellTableField){
                            if(rowData[j]){
                                //业务台账表格没有合计行，所以取消判断
                                // if(rowData[j]!='合计'&&rowData[j]!='-'){
                                    if(cellMeta.editor == 'select'){
                                        var dictItem = dictItems[cellTableField];
                                        dataItem[cellTableField] = dictItem[rowData[j]];
                                    }else{
                                        if(rowData[j] || rowData[j]==0){//排除null/undifined
                                            dataItem[cellTableField] = rowData[j];
                                        }
                                    }
                                // }
                            }else if(rowData[j]==0){
                                dataItem[cellTableField] = rowData[j];
                            }

                            // if(cellMeta.editor == 'select'){
                            //     var dictItem = dictItems[cellTableField];
                            //     dataItem[cellTableField] = dictItem[rowData[j]];
                            // }else{
                            //     if(rowData[j] || rowData[j]==0){//排除null/undifined
                            //         dataItem[cellTableField] = rowData[j];
                            //     }
                            // }
                        }
                    }
                    dataItem['rowId'] = hotInstance.getCellMeta(i, 0)['rowId'];
                    if(JSON.stringify(dataItem) != "{}"){//以免多余的行空
                        dataMap.push(dataItem);
                    }
                }
                return dataMap;
            } else if (sets.tableType == 'list') {
                var dataStartRow = sets.dataStartRow;
                //流表结构会变化，所以这个地方动态获取
                // var dataEndRow = hotInstance.countRows();//总行数8,其实只有到7列
                //sets.ishj有合计行的话，循环到合计下一行，否则就是标记的备注行
                var dataEndRow = sets.ishj?sets.ishjRow+1:sets.ishjRow;
                var dataItem;
                for (var i = dataStartRow; i < dataEndRow; i++) {
                    var row = i;
                    var ishj = hotInstance.getCellMeta(row, 0)['ishj'];
                    var rowData = hotInstance.getDataAtRow(i);
                    dataItem = new Object();
                    if(ishj==1){//合计行
                        //计算合计数据
                        for (var j = 0; j < rowData.length; j++) {
                            var cellTableField = hotInstance.getCellMeta(row, j)['cellTableField'];
                            
                            if(cellTableField){
                                if(rowData[j]){
                                    if(rowData[j]!='合计'&&rowData[j]!='-'){
                                        dataItem[cellTableField] = rowData[j];
                                    }
                                }else if(rowData[j]==0){
                                    dataItem[cellTableField] = rowData[j];
                                }
                            }
                        }
                        dataItem['rowId'] = hotInstance.getCellMeta(row, 0)['rowId'];
                        dataItem['ISHJ'] = '1';
                        dataMap.push(dataItem);
                        //有合计行直接结束？有问题。直接把cellTableField
                        //放到Cellmeta中
                        break;
                    }else{//数据行
                        for (var j = 0; j < rowData.length; j++) {
                            var cellMeta = hotInstance.getCellMeta(row, j);
                            var cellTableField = cellMeta['cellTableField'];
                            var cellType = cellMeta['editor'];
                            if(cellTableField){
                                if(rowData[j]){
                                    //合计行的合计字段才判断
                                    // if(rowData[j]!='合计'&&rowData[j]!='-'){
                                        if(cellType=='select'){
                                            var dictItem = dictItems[cellTableField];
                                            dataItem[cellTableField] = dictItem[rowData[j]];
                                        }else{
                                            dataItem[cellTableField] = rowData[j];
                                        }
                                    // }
                                }else if(rowData[j]==0){
                                    dataItem[cellTableField] = rowData[j];
                                }
                            }
                        }
                        dataItem['rowId'] = hotInstance.getCellMeta(row, 0)['rowId'];
                        if(JSON.stringify(dataItem) != "{}"){//以免多余的行空
                            dataMap.push(dataItem);
                        }
                    }
                }
                return dataMap;
            } else {
                var newMap = sets.newMap;
                var allData = hotInstance.getData();
                dataMapItem = new Object();
                $.each(newMap, function(i, item) {
                    if (item && item.cellType=='input') {
                        var row = item.cellRow;
                        var col = item.cellCol;
                        var dataItem = allData[row][col];
                        var cellType = hotInstance.getCellMeta(row,col)['editor'];
                        if(item.cellTableField&&dataItem||dataItem==0){
                            if(cellType=='select'){
                                var dictItem = dictItems[item.cellTableField];
                                dataMapItem[item.cellTableField] = dictItem[dataItem];
                            }else{
                                dataMapItem[item.cellTableField] = dataItem;
                            }
                        }
                    }
                });
                dataMapItem['rowId'] = hotInstance.getCellMeta(0, 0)['rowId'];
                dataMap.push(dataMapItem);
                return dataMap;
            }
        },
        getReportDataForBigData: function(sets, CurrentIndex) {
            var dataMap = new Array();
            var dictItems = sets.TransferDictItems;
            if (sets.tableType == 'list-business') {
                return null;
            } else if (sets.tableType == 'list') {
                var dataStartRow = sets.dataStartRow;
                //流表结构会变化，所以这个地方动态获取
                // var dataEndRow = hotInstance.countRows();//总行数8,其实只有到7列
                //sets.ishj有合计行的话，循环到合计下一行，否则就是标记的备注行
                var dataEndRow = sets.ishj?sets.ishjRow+1:sets.ishjRow;
                var dataItem;
                if(CurrentIndex<dataStartRow||CurrentIndex>=dataEndRow){
                    //在数据行外范围
                    return;
                }
                var i = CurrentIndex;
                var row = i;
                var ishj = hotInstance.getCellMeta(row, 0)['ishj'];
                var rowData = hotInstance.getDataAtRow(i);
                dataItem = new Object();
                dataItem.addRowIndex = (CurrentIndex-dataStartRow)+'';
                if(ishj==1){//合计行
                    //计算合计数据
                    for (var j = 0; j < rowData.length; j++) {
                        var cellTableField = hotInstance.getCellMeta(row, j)['cellTableField'];
                        
                        if(cellTableField){
                            if(rowData[j]){
                                if(rowData[j]!='合计'&&rowData[j]!='-'){
                                    dataItem[cellTableField] = rowData[j];
                                }
                            }else if(rowData[j]===0){
                                dataItem[cellTableField] = 0;
                            }
                        }
                    }
                    dataItem['rowId'] = hotInstance.getCellMeta(row, 0)['rowId'];
                    dataItem['ISHJ'] = '1';
                    dataMap.push(dataItem);
                    //有合计行直接结束？有问题。直接把cellTableField
                    //放到Cellmeta中
                }else{//数据行
                    for (var j = 0; j < rowData.length; j++) {
                        var cellMeta = hotInstance.getCellMeta(row, j);
                        var cellTableField = cellMeta['cellTableField'];
                        var cellType = cellMeta['editor'];
                        if(cellTableField){
                            if(rowData[j]){
                                //合计行的合计字段才判断
                                // if(rowData[j]!='合计'&&rowData[j]!='-'){
                                    if(cellType=='select'){
                                        var dictItem = dictItems[cellTableField];
                                        dataItem[cellTableField] = dictItem[rowData[j]];
                                    }else{
                                        dataItem[cellTableField] = rowData[j];
                                    }
                                // }
                            }else if(rowData[j]===0){
                                dataItem[cellTableField] = 0;
                            }
                        }
                    }
                    dataItem['rowId'] = hotInstance.getCellMeta(row, 0)['rowId'];
                    if(JSON.stringify(dataItem) != "{}"){//以免多余的行空
                        dataMap.push(dataItem);
                    }
                }
                return dataMap;
            } else {
                return null;
            }
        }
    }
});



//kingdom module wrapper =======================
if (seajs) {
    define(function(require, exports, module) {
        module.exports = jQuery.handsontable;
    });
}