define(function (require, exports, module) {
  var showContent = {};
  showContent._load = function () {
    showContent.getSingleDatasourceList();
  }
  function formart1(name, executeFlag) {
    var color;
    if (executeFlag === 'B') {
        color = '#ed6b75'
    } else if (executeFlag === "R") {
        color = '#659be0'
    } else if (executeFlag === "S") {
        color = '#3fc9d5'
    } else if (executeFlag === "F") {
        color = '#F1C40F'
    } else if (executeFlag === "N") {
        color = '#bac3d0'
    }
    return `<span style="color:${color}">${name}</span>`
}

function formart3(nodeName, executeFlag, executeMsg) {
    return `<span style="margin-right: 10px;" title='${nodeName}' >${nodeName}${"F,B".includes(executeFlag) ? `<i class='fa fa-info-circle' title='${executeMsg.substring(0,100)}'></i>` : "" }</span>`
}
function formart2(executeMsg) {
    return `<span class="execute-error-msg" msg='${executeMsg.replace(/\'/g, "\"")}' style="color:#3fc9d5;cursor:pointer;">${executeMsg.substring(0,100)}</span>`
}
    // 将数据格式转化成tabletree需要的数据
    function gene(items) {
      for (let item of items) {
          if (!item.parentMonitorId) {
              let data = [{
                  id: item.monitorId,
                  pId: "-1",
                  columns: {
                      "序号":item.orderNo,
                      "节点":{
                          formatter: function() {
                              return formart3(item.nodeName,item.executeFlag,item.executeMsg);
                          }
                      },
                      "任务名称":item.jobName,
                      "任务类型": item.memberTypeName,
                      "删除": item.deleteNum,
                      "插入": item.insertNum,
                      "开始时间": $.kingdom.toDateTime(item.startTime),
                      "结束时间":$.kingdom.toDateTime(item.endTime),
                      "执行时长": $.kingdom.formatMillisecond(item.duration),
                      "执行状态": {
                          formatter: function() {
                              return formart1(item.executeFlagName, item.executeFlag);
                          }
                      },
                      "执行信息(点击显示全部信息)": {
                          formatter: function() {
                              return formart2(item.executeMsg);
                          }
                      }
                  },
                  children: []
              }];
              for (let item1 of items) {
                  if (item1.parentMonitorId === item.monitorId) {
                      let obj = {
                          id: item1.monitorId,
                          pId: item1.parentMonitorId,
                          attr: {
                              obj: JSON.stringify(item1),
                          },
                          columns: {
                            "序号":item1.orderNo,
                            "节点":{
                                formatter: function() {
                                    return formart3(item1.nodeName,item1.executeFlag,item1.executeMsg);
                                }
                            },
                            "任务名称":item1.jobName,
                            "任务类型": item1.memberTypeName,
                            "删除": item1.deleteNum,
                            "插入": item1.insertNum,
                            "开始时间": $.kingdom.toDateTime(item1.startTime),
                            "结束时间":$.kingdom.toDateTime(item1.endTime),
                            "执行时长": $.kingdom.formatMillisecond(item1.duration),
                            "执行状态": {
                                formatter: function() {
                                    return formart1(item1.executeFlagName, item1.executeFlag);
                                }
                            },
                            "执行信息(点击显示全部信息)": {
                                formatter: function() {
                                    return formart2(item1.executeMsg);
                                }
                            }
                        },
                          children: [],
                      };
                      data[0].children.push(obj);
                  }
              }
              let children = data[0].children;
              for (let i = 0, len = children.length; i < len; i++) {
              for(let item2 of items){            
                  if (item2.parentMonitorId === children[i].id) {
                      let obj = {
                          id: item2.monitorId,
                          pId: item2.parentMonitorId,
                          attr: {
                              obj: JSON.stringify(item2),
                          },
                          columns: {
                            "序号":item2.orderNo,
                            "节点":{
                                formatter: function() {
                                    return formart3(item2.nodeName,item2.executeFlag,item2.executeMsg);
                                }
                            },
                            "任务名称":item2.jobName,
                            "任务类型": item2.memberTypeName,
                            "删除": item2.deleteNum,
                            "插入": item2.insertNum,
                            "开始时间": $.kingdom.toDateTime(item2.startTime),
                            "结束时间":$.kingdom.toDateTime(item2.endTime),
                            "执行时长": $.kingdom.formatMillisecond(item2.duration),
                            "执行状态": {
                                formatter: function() {
                                    return formart1(item2.executeFlagName, item2.executeFlag);
                                }
                            },
                            "执行信息(点击显示全部信息)": {
                                formatter: function() {
                                    return formart2(item2.executeMsg);
                                }
                            }
                        },
                          children: [],
                      };
                      data[0].children[i].children.push(obj); 
                 
                  }
              }
               /**
                   * @description: 第四级数据
                   * @param {type} 
                   * @return: 
                   * @Author: xiaojun
                   * @Date: 2019-06-25 14:57:00
                   */
                  let children1 = data[0].children[i].children;                
                  for(let item3 of items){
                      for (let j = 0, len = children1.length; j < len; j++) {
                          if (item3.parentMonitorId === children1[j].id) {
                              let obj = {
                                  id: item3.monitorId,
                                  pId: item3.parentMonitorId,
                                  attr: {
                                      obj: JSON.stringify(item3),
                                  },
                                  columns: {
                                    "序号":item3.orderNo,
                                    "节点":{
                                        formatter: function() {
                                            return formart3(item3.nodeName,item3.executeFlag,item3.executeMsg);
                                        }
                                    },
                                    "任务名称":item3.jobName,
                                    "任务类型": item3.memberTypeName,
                                    "删除": item3.deleteNum,
                                    "插入": item3.insertNum,
                                    "开始时间": $.kingdom.toDateTime(item3.startTime),
                                    "结束时间":$.kingdom.toDateTime(item3.endTime),
                                    "执行时长": $.kingdom.formatMillisecond(item3.duration),
                                    "执行状态": {
                                        formatter: function() {
                                            return formart1(item3.executeFlagName, item3.executeFlag);
                                        }
                                    },
                                    "执行信息(点击显示全部信息)": {
                                        formatter: function() {
                                            return formart2(item3.executeMsg);
                                        }
                                    }
                                },
                                  children: [],
                              };
                              data[0].children[i].children[j].children.push(obj);        
                          }
                      }
                  }
                  
          }              
              return data;
          }
      }
  }
  // 查询列表
  showContent.getSingleDatasourceList = function (paramsPage) {
    var jobId = $("#local-data").data("params").jobId;
    var batchNo = $("#local-data").data("params").batchNo;
    var params = { jobId: jobId,batchNo:batchNo,pageNumber:1000,pageSize:1}
    var params = $.extend(params,paramsPage);
    // $.kingdom.getList({
    //   apiName: "kingdom.retl.get_monitor_log_detail_info",
    //   apiVision: "v4.0",
    //   params: params,
    //   tableId: "J_sjl_single_job_log_table",
    //   pageId: "J_sjl_single_job_log_page",
    //   template: "common-page/template/single-job-log-list.handlebars",
    //   cb: showContent.getSingleDatasourceList,
    // });
    showContent.getTableData1(params);
  }
  showContent.getTableData1 = function(params) {
    $('#right-content-table').show();
    var paramsMap = $.extend({}, params);
    $.kingdom.doKoauthAdminAPI("kingdom.retl.get_monitor_log_detail_info", "v4.0", paramsMap, function(data) {
        // console.log(data);
        var items = data.bcjson.items || data.bcjson;
        if (data.bcjson.flag == "1") {
            $("#J_tableList").jstree('destroy');
            if (items.length > 0) {
                showContent.currentMsgCollection = {};
                //存放错误信息
                $.each(items, function(index, item) {
                    showContent.currentMsgCollection[index] = item.executeMsg;
                    item['errorIndex'] = index;
                });
                let data_ = gene(items);
                $("#single-job-log-table-tree").tableTree({
                    data: data_
                });
                var a = $("#single-job-log-table-tree").tableTree({
                    widthScale: 2,
                    data: data_
                })
                a.openNode($('[pkey="-1"]').attr('key'));
                // if (executeFlag === "R") {

                //     showContent.preTableData = [];

                //     //执行中状态，所有的叶子节点，若无执行结果的状态则，给与display none
                //     if ($("#single-job-log-table-tree .jstree-leaf").length > 1) {
                //         $("#single-job-log-table-tree .jstree-leaf").css("display", "none");
                //     }

                //     showContent.updateTableData(paramsMap);
                //     showContent.setInterval = setInterval(function() {
                //         showContent.updateTableData(paramsMap);
                //     }, 3000)
                // }
            } else {
                $('#J_tableList').html("<image src='assets/img/nonedata.png'/>").css('text-align', "center");
            }
        } else {
            toastr.error(data.bcjson.msg);
        }
    });
}
  module.exports = showContent;
})