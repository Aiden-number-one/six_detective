/* eslint-disable */
parent.showProcessName = function (obj) {
	$(".page-audit-search #J_processName").val(obj.name);
	$(".page-audit-search #FrameID").css("height", obj.height);
	$(".page-audit-search #J_processName").attr('processUuid', obj.UUID)
}
var ActivitiRest = {
  options: {},
  getProcessDefinitionByKey: function(processDefinitionKey, callback) {
    var url = Lang.sub(this.options.processDefinitionByKeyUrl, {
      processDefinitionKey: processDefinitionKey,
    });
    $.ajax({
      url: url,
      dataType: 'jsonp',
      cache: false,
      async: true,
      success: function(data, textStatus) {
        var processDefinition = data;
        if (!processDefinition) {
          console.error("Process definition '" + processDefinitionKey + "' not found");
        } else {
          callback.apply({
            processDefinitionId: processDefinition.id,
          });
        }
      },
    })
      .done(function(data, textStatus) {
        console.log('ajax done');
      })
      .fail(function(jqXHR, textStatus, error) {
        console.error(
          'Get diagram layout[' + processDefinitionKey + '] failure: ',
          textStatus,
          'error: ',
          error,
          jqXHR,
        );
      });
  },

  getProcessDefinition: function(processDefinitionId, callback) {
    const V = 'v2.0'; // 版本号
    const N = 'bayconnect.superlop.get_diagram_layout'; // 接口名
    const P = {
		processDefinitionId: processDefinitionId,
    }; // 参数
    const S = new Date().getTime(); // 时间戳
    var dataAndHeader = KISBPM.URL.getParams({ N, V, P, S });
    const data = dataAndHeader.param;
    const header = dataAndHeader.header;
    // var url = '/admin_api';
    // var data = KISBPM.URL.getParams('kingdom.kbpm.get_kbpm_diagram_layout_pdid', 'v1.0', {
    //   processDefinitionId: processDefinitionId,
    // });
    $.ajax({
      type: 'post',
      url: '/api/' + V + '/' + N + '.json',
      dataType: 'json',
      data: data,
	  async: true,
	  headers:header
    }).done(function(data) {
      if (data.bcjson.flag == 0) {
        console.error(
          "Process definition diagram layout '" +
            processDefinitionId +
            "' not found;MSG:" +
            data.bcjson.msg,
        );
      }
      var processDefinitionDiagramLayout = data.bcjson.items;
      if (!processDefinitionDiagramLayout) {
        console.error("Process definition diagram layout '" + processDefinitionId + "' not found");
        return;
      } else {
        callback.apply({
          processDefinitionDiagramLayout: processDefinitionDiagramLayout,
        });
        //显示流程名称
		var height = $('#diagramHolder').height() + 30;
		console.log('parent------->',parent)
        parent.showProcessName({
          name: processDefinitionDiagramLayout.processDefinition.name,
          UUID: processDefinitionId,
          height: height,
        });
      }
    });
  },

  getHighLights: function(processInstanceId, callback) {
    /*	var url = Lang.sub(this.options.processInstanceHighLightsUrl, {
				processInstanceId: processInstanceId
			});*/
    // var url = '/admin_api';
    // var data = KISBPM.URL.getParams('kingdom.kbpm.get_kbpm_diagram_layout_highlights', 'v1.0', {
    //   processInstanceId: processInstanceId,
	// });
	const V = 'v2.0'; // 版本号
    const N = 'bayconnect.superlop.get_diagram_layout_highlight'; // 接口名
    const P = {
		processInstanceId: processInstanceId,
    }; // 参数
    const S = new Date().getTime(); // 时间戳
    var dataAndHeader = KISBPM.URL.getParams({ N, V, P, S });
    const data = dataAndHeader.param;
    const header = dataAndHeader.header;
    $.ajax({
      type: 'post',
      url: '/api/' + V + '/' + N + '.json',
      dataType: 'json',
      data: data,
	  async: true,
	  headers:header
    }).done(function(data) {
      if (data.bcjson.items) {
        var highLights = data.bcjson.items;
        callback.apply({
          highLights: highLights,
        });
      } else {
        console.log('highLights not found');
      }
    });
  },
};
