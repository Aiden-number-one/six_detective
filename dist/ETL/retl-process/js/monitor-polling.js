var jobId = decodeURIComponent(GetQueryString("jobId"));
var batchNo = decodeURIComponent(GetQueryString("batchNo"));
function init_graph(index) {
	$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_run_xml_info", "v4.0", {
		jobId: jobId,
		batchNo: batchNo
	}, function (data) {
		if (data.bcjson.flag === "1") {
			var jobXml = data.bcjson.items[0].xmlMsg;
			var xmls = [{ "XMLString": jobXml }];
			var xml_text = '';
			if (xmls) {
				if (xmls.length) {
					states_click = 1;
					xml_text = xmls[0].XMLString;
					graphic.xmlDoc = xml_text;
					graphic.reappearXmlDoc();
					graphic.initCanvas();
					graphic.update();
					if(window.setIntervalVarIframe){
						clearInterval(window.setIntervalVarIframe);
					}
					window.setIntervalVarIframe = setInterval(pollingSvg, 1000);
				} else {
					alert('请求全量xml为空');
				}
			} else {
				alert('请求全量xml出错');
			}
		} else {
		}
	});
}

function pollingSvg() {
	$.kingdom.doKoauthAdminAPI("bayconnect.superlop.get_job_run_xml_info", "v4.0", {
		batchNo: batchNo,
		jobId: jobId
	}, function (data) {
		if (data.bcjson.flag === "1") {
			var jobXml = data.bcjson.items[0].xmlMsg;
			var xmls = [{ "XMLString": jobXml }];
			var xml_text = '';
			if (xmls) {
				if (xmls.length) {
					states_click = 1;
					xml_text = xmls[0].XMLString;
					graphic.xmlDoc = xml_text;
					graphic.update();
				}
			}
		} else {
		}
	});
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

$(document).ready(function () {
	init_graph();
})
