var ActivitiRest = {
	options: {},
	getProcessDefinitionByKey: function(processDefinitionKey, callback) {
		var url = Lang.sub(this.options.processDefinitionByKeyUrl, {
			processDefinitionKey: processDefinitionKey
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
						processDefinitionId: processDefinition.id
					});
				}
			}
		}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error) {
			console.error('Get diagram layout[' + processDefinitionKey + '] failure: ', textStatus, 'error: ', error, jqXHR);
		});
	},

	getProcessDefinition: function(processDefinitionId, callback) {
		var url = '/admin_api';
		var data = KISBPM.URL.getParams('kingdom.kbpm.get_kbpm_diagram_layout_pdid', 'v1.0', {
			processDefinitionId: processDefinitionId
		});
		$.ajax({
			type: "post",
			url: url,
			dataType: 'json',
			data: data,
			async: true
		}).done(function(data) {
			if (data.kdjson.flag == 0) {
				console.error("Process definition diagram layout '" + processDefinitionId + "' not found;MSG:" + data.kdjson.msg);
			}
			var processDefinitionDiagramLayout = data.kdjson.items[0];
			if (!processDefinitionDiagramLayout) {
				console.error("Process definition diagram layout '" + processDefinitionId + "' not found");
				return;
			} else {
				callback.apply({
					processDefinitionDiagramLayout: processDefinitionDiagramLayout
				});
				 //显示流程名称
				var height = $("#diagramHolder").height()+30;
				parent.showProcessName({name:processDefinitionDiagramLayout.processDefinition.name,UUID:processDefinitionId,height:height});				
			}
		});
	},

	getHighLights: function(processInstanceId, callback) {
		/*	var url = Lang.sub(this.options.processInstanceHighLightsUrl, {
				processInstanceId: processInstanceId
			});*/
		var url = '/admin_api';
		var data = KISBPM.URL.getParams('kingdom.kbpm.get_kbpm_diagram_layout_highlights', 'v1.0', {
			processInstanceId: processInstanceId
		});
		$.ajax({
			type: "post",
			url: url,
			dataType: 'json',
			data: data,
			async: true
		}).done(function(data) {
			if (data.kdjson.items) {
				var highLights = data.kdjson.items[0];
				callback.apply({
					highLights: highLights
				});
			} else {
				console.log("highLights not found");
			}
		});
	}
};