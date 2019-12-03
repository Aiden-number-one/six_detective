var CryptoAgent = "";
var CryptoClient = "";

/**
 * 下载控件
 */
 /*
window.onload=function Init_Crypto(){
	try {	
		if (navigator.appName.indexOf("Internet") >= 0
				|| navigator.appVersion.indexOf("Trident") >= 0) {
			if (window.navigator.cpuClass == "x86") {//71BB5253-EF2B-4C5B-85FF-1FD6A03C29A6\
				document.getElementById("FakeCryptoAgent").innerHTML = "<object id=\"CryptoAgent\" codebase=\"CryptoKit.CertEnrollment.Pro.x86.cab\" classid=\"clsid:71BB5253-EF2B-4C5B-85FF-1FD6A03C29A6\" ></object>";
			} else {
				document.getElementById("FakeCryptoAgent").innerHTML = "<object id=\"CryptoAgent\" codebase=\"CryptoKit.CertEnrollment.Pro.x64.cab\" classid=\"clsid:9E7B8F05-ADBE-4067-ABC6-28E0230A5C18\" ></object>";
			}
		} else {
			document.getElementById("FakeCryptoAgent").innerHTML = "<embed id=\"CryptoAgent\" type=\"application/npCryptoKit.CertEnrollment.Pro.x86\" style=\"height: 0px; width: 0px\">";
		}
		CryptoAgent = document.getElementById('CryptoAgent');
		
		if (navigator.appName.indexOf("Internet") >= 0
				|| navigator.appVersion.indexOf("Trident") >= 0) {
			if (window.navigator.cpuClass == "x86") {
				document.getElementById("eDiv").innerHTML = "<object id=\"CryptoClient\" codebase=\"CryptoKit.Ultimate.x86.cab\" classid=\"clsid:4C588282-7792-4E16-93CB-9744402E4E98\" ></object>";
			} else {
				document.getElementById("eDiv").innerHTML = "<object id=\"CryptoClient\" codebase=\"CryptoKit.Ultimate.x64.cab\" classid=\"clsid:B2F2D4D4-D808-43B3-B355-B671C0DE15D4\" ></object>";
			}
		} else {
			document.getElementById("eDiv").innerHTML = "<embed id=\"CryptoClient\" type=\"application/npCryptoKit.Ultimate.x86\" style=\"height: 0px; width: 0px\">";
		}
	     
		CryptoClient = document.getElementById("CryptoClient");
		
		
	} catch (e){
		//alert(e);
	} 	
 
	//alert(CryptoAgent);
   //SelectCertificateOnClick();
}
*/
window.onload=function Init_Crypto(){
	try {	
		if (navigator.appName.indexOf("Internet") >= 0
				|| navigator.appVersion.indexOf("Trident") >= 0) {
			if (window.navigator.cpuClass == "x86") {//71BB5253-EF2B-4C5B-85FF-1FD6A03C29A6\
				document.getElementById("FakeCryptoAgent").innerHTML = "<object id=\"CryptoAgent\"  classid=\"clsid:8B94580C-E88F-4E0B-88A4-37077DCE1E4B\" ></object>";
			} else {
				document.getElementById("FakeCryptoAgent").innerHTML = "<object id=\"CryptoAgent\"  classid=\"clsid:9D95C4CD-D34D-45F2-BF98-2C50B7144E24\" ></object>";
			}
		} else {
			document.getElementById("FakeCryptoAgent").innerHTML = "<embed id=\"CryptoAgent\" type=\"application/npCryptoKit.CertEnrollment.jtwd.x86\" style=\"height: 0px; width: 0px\">";
		}
		CryptoAgent = document.getElementById('CryptoAgent');
		
		if (navigator.appName.indexOf("Internet") >= 0
				|| navigator.appVersion.indexOf("Trident") >= 0) {
			if (window.navigator.cpuClass == "x86") {
				document.getElementById("eDiv").innerHTML = "<object id=\"CryptoClient\"  classid=\"clsid:51BAEA72-B6A9-487B-8D68-B32CE7251D9C\" ></object>";
			} else {
				document.getElementById("eDiv").innerHTML = "<object id=\"CryptoClient\"  classid=\"clsid:F989CBEB-F347-4BB9-AF28-44E9E81412D1\" ></object>";
			}
		} else {
			document.getElementById("eDiv").innerHTML = "<embed id=\"CryptoClient\" type=\"application/npCryptoKit.jtwd.x86\" style=\"height: 0px; width: 0px\">";
		}
	     
		CryptoClient = document.getElementById("CryptoClient");
		
		
	} catch (e){
		//alert(e);
	} 	
 
	//alert(CryptoAgent);
   //SelectCertificateOnClick();
}
function check_CFCA_cer(){
		//1、检测证书安装环境
		SelectCertificateOnClick_usb();
		//2、检查服务器接口证书
		//3、检测usb接口提供的证书
		//4、签名、验签
	}

/**
 * 验证该用户服务器是否有证书，和客户端是否有证书
 */
function SelectCertificateOnClick_usb() {
	var cert_status="";
	var serialNumFilter="";
	

	//接口参数说明username,cert_ip_domain = 127.0.0.1,cert_csptype = 1
	var username = $("#username").val();

	var params = {username:username}
	var url = kifpaction+"/cfca!checkUserCert.do?ajax=yes";

	var callback = function(result) {
		cert_status=result.result;
		if(cert_status=="1"){
			serialNo=result.message;
			var status=check_cert_usb(serialNo);
			if(status==true){
				SignMessageOnClick_usb(); //如过验证通过就去调用签名方法 直接调用接口
			};
		}else{
			$.kd.closeLoading();			
			$.kd.kdAlert(result.message, function() {
				$('#valid_code').val("");
				$('#password').val("").focus();
				$("#codeimg").click();
				$("input").attr("readonly", false).removeClass("kdValidform_readonly");
				$("#tellersubmit").attr("disabled", false);
			});
			return;
		}
	}
	
	$.post(url, params, callback, "json");
	
};

/**
 * 检查浏览器中是否有该用户的证书
 */
function check_cert_usb(serialNo){
	try {
		var subjectDNFilter = "";
		var issuerDNFilter = "";
		var serialNumFilter =serialNo;//证书编号
		var bSelectCertResult = CryptoClient.SelectCertificate(
				subjectDNFilter, issuerDNFilter, serialNumFilter);
		return true;
	}catch (e) {
		if(confirm("您的usb接口没有对应的证书，请先和管理员申请证书!")){
		window.location.href = "/index.html?action=await&_=" + new Date().getTime();
		}; 
	return false;
	}
}

/**
 * 客户端签名后，调用接口的步奏
 */
function SignMessageOnClick_usb() {
	var selectedAlg = "SHA-1";
	var username = $("#username").val();
	var password = $("#password").val();
	var serverid = "1";
	var exchangeid = "1";
	var openid = "null";
	var source= {"custId":username,"password":password,serverid:serverid,exchangeid:exchangeid,openid:openid};
	//source = $.base64.encode(source);
	source = JSON.stringify(source);
	var signature = "";

	//验签
	try {
		signature = CryptoClient.SignMsgPKCS7(source, selectedAlg, false);      
		alert(signature);
		if (!signature) {
			var errorDesc = "";
			errorDesc = CryptoClient.GetLastErrorDesc();
			alert(errorDesc);
			return;
		}
	} catch (e) {
		alert(e);
		alert("请安装证书");
		return;
	}
	var cfca_signature = signature;
	
	var cfca_certcode10011 = "10011";
	var cfca_sourcedata = source;
	
	var url = kifpaction+"/cfca!checkSignCert.do?ajax=yes";
	var data = {"signature":cfca_signature,"username":username,"cfca_certcode10011":cfca_certcode10011,
		"sourcedata":cfca_sourcedata};
	//参数说明:cfca_signature,username，cfca_certcode10011,cfca_sourcedata,kifpbexid

	var callback = function(data) {
		if(data.result == 1) {
				window.location.href = "/index.html?action=await&_=" + new Date().getTime();			
		} else {
			$.kd.closeLoading();
			$.kd.kdAlert(data.message, function() {
				$('#valid_code').val("");
				$('#password').val("").focus();
				$("#codeimg").click();
				$("input").attr("readonly", false).removeClass("kdValidform_readonly");
				$("#tellersubmit").attr("disabled", false);
			});
		}
	}
	
	$.post(url, data, callback, "json");	
}	

/**
 * 在申请证书之前，必须拿到控件中提供的P10值
 */
function PKCS10Requisition_SingleCert(csp_Name_value) {
	var keyAlgorithm = "RSA";
	var keyLength = 2048;
	var csp_Name =csp_Name_value;//"CFCA FOR UKEY CSP v1.1.0";//"Microsoft Enhanced Cryptographic Provider v1.0";
	alert("csp_Name:"+csp_Name);
	var res1 = CryptoAgent.CFCA_SetCSPInfo(keyLength, csp_Name);
	if (!res1) {
		var errorDesc = CryptoAgent.GetLastErrorDesc();
		alert(errorDesc);
		return;
	};
	var res2 = CryptoAgent.CFCA_SetKeyAlgorithm(keyAlgorithm);

	if (!res2) {
		var errorDesc = CryptoAgent.GetLastErrorDesc();
		alert(errorDesc);
		return;
	};
	var strSubjectDN ="CN=certRequisition,O=CFCA TEST CA,C=CN";
	var pkcs10Requisition = CryptoAgent.CFCA_PKCS10CertRequisition(
			strSubjectDN, 1, 0); //采用
	if (!pkcs10Requisition) {
		var errorDesc = CryptoAgent.GetLastErrorDesc();
		alert(errorDesc);
		return;
	};
	
	alert("pkcs10Requisition:"+pkcs10Requisition);
	document.getElementById("textareaP10RSASingleCert").value = pkcs10Requisition;
	var contianerName = CryptoAgent.CFCA_GetContainer();
	if (!contianerName) {
		var errorDesc = CryptoAgent.GetLastErrorDesc();
		alert(errorDesc);
		return;
	}
	document.getElementById("TextContianerName").value = contianerName;
    return pkcs10Requisition;
}
