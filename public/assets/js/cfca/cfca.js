var url = "http://192.168.14.74:8080/koauth2/applyCfcaCert";
var CryptoAgent = "";
var CryptoClient = "";

/**
 * 下载控件
 */

function Init_Crypto() {
	try {
		if (navigator.appName.indexOf("Internet") >= 0 || navigator.appVersion.indexOf("Trident") >= 0) {
			if (window.navigator.cpuClass == "x86") {
				//71BB5253-EF2B-4C5B-85FF-1FD6A03C29A6\
				var obj = "<object id=\"CryptoAgent\" codebase=\"CryptoKit.CertEnrollment.Pro.x86.cab\" classid=\"clsid:71BB5253-EF2B-4C5B-85FF-1FD6A03C29A6\" ></object>";
				document.getElementById("FakeCryptoAgent").innerHTML = "<object id=\"CryptoAgent\" codebase=\"CryptoKit.CertEnrollment.Pro.x86.cab\" classid=\"clsid:71BB5253-EF2B-4C5B-85FF-1FD6A03C29A6\" ></object>";
			} else {
				document.getElementById("FakeCryptoAgent").innerHTML = "<object id=\"CryptoAgent\" codebase=\"CryptoKit.CertEnrollment.Pro.x64.cab\" classid=\"clsid:9E7B8F05-ADBE-4067-ABC6-28E0230A5C18\" ></object>";
			}
		} else {
			document.getElementById("FakeCryptoAgent").innerHTML = "<embed id=\"CryptoAgent\" type=\"application/npCryptoKit.CertEnrollment.Pro.x86\" style=\"height: 0px; width: 0px\">";
		}
		CryptoAgent = document.getElementById('CryptoAgent');

		if (navigator.appName.indexOf("Internet") >= 0 || navigator.appVersion.indexOf("Trident") >= 0) {
			if (window.navigator.cpuClass == "x86") {
				document.getElementById("eDiv").innerHTML = "<object id=\"CryptoClient\" codebase=\"CryptoKit.Ultimate.x86.cab\" classid=\"clsid:4C588282-7792-4E16-93CB-9744402E4E98\" ></object>";
			} else {
				document.getElementById("eDiv").innerHTML = "<object id=\"CryptoClient\" codebase=\"CryptoKit.Ultimate.x64.cab\" classid=\"clsid:B2F2D4D4-D808-43B3-B355-B671C0DE15D4\" ></object>";
			}
		} else {
			document.getElementById("eDiv").innerHTML = "<embed id=\"CryptoClient\" type=\"application/npCryptoKit.Ultimate.x86\" style=\"height: 0px; width: 0px\">";
		}

		CryptoClient = document.getElementById("CryptoClient");
	} catch (e) {}
	//alert(e);


	// alert(CryptoAgent);
	//SelectCertificateOnClick();
	getcsp_name();
}

/*
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
   getcsp_name();
   url = $("#url").val;
}
*/

/**
 * 获取私有的授权TOKEN  以备调用接口的时候用到
 */
//http://127.0.0.1:8090/koauth2/oauth/token?grant_type=password&client_id=kdmallwebnative&client_secret=secrets&username=leixr8&password=73D5409AAB18D82091DFC118E3E235D4
function getAccessToken() {
	var username = document.getElementById("userName").value;
	var password = document.getElementById("password").value;
	password = $.des.getDes(password, null);
	var token = "";
	$.post(url, {
		"grant_type": "password",
		"client_id": "243589cf6f4470f2387bcdb9d7f5eb6301f3f76243",
		"client_secret": "985607db7ca8a051efa40b6bf54b4af912cbb683954",
		"username": username,
		"password": password
	}, function (result) {
		alert(result.access_token);
		token = result.access_token;
		document.getElementById("access_token").value = token;
	}, "json");
	return token;
}

/**
 * 验证该用户服务器是否有证书，和客户端是否有证书
 */
function SelectCertificateOnClick() {
	var cert_status = "";
	var serialNumFilter = "";
	var access_token = document.getElementById("access_token").value;
	$.post("http://192.168.205.56:8090/koauth2/querryCfcaCert", {
		"access_token": access_token
	}, function (result) {
		cert_status = result.bcjson.flag;
		if (cert_status == "10002") {
			check_cert();
		} else if (cert_status == "1") {
			serialNo = result.bcjson.items.serialNo;
			var status = check_cert(); //假如服务器已经有用户证书，那么客户端浏览器中是否有证书
			if (status == true) {
				SignMessageOnClick(); //如过验证通过就去调用签名方法 直接调用接口
			};
		} else {
			alert(JSON.stringify(result)); //异常信息
		}
	}, "json");
};

/**
 * 客户端签名后，调用接口的步奏
 */
function SignMessageOnClick() {
	var selectedAlg = "SHA-1";
	//	var money ="";//document.getElementById("money").value; {"bankcode":""}
	///var source="{'bankcode':'"+money+"'}";
	var source = '{"bankcode":""}';
	var signature = "";
	var access_token = document.getElementById("access_token").value;
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
	$.post("http://192.168.205.56:8090/koauth2/rest.json", {
		"timestamp": "2014-10-13 17:33:16",
		"sign": "7DA80F2582CF4D5021866C9AC5724551",
		"v": "v1.0",
		"method": "kingdom.kifp.get_bank_info",
		"client_id": "243589cf6f4470f2387bcdb9d7f5eb6301f3f76243",
		"format": "json",
		"kingdom_param_json": source,
		"access_token": access_token,
		"cfca_signature": "10011"
	}, function (result) {
		alert(JSON.stringify(result));
	}, "json");
}

/**
 * 检查浏览器中是否有该用户的证书
 */
function check_cert() {
	try {
		var subjectDNFilter = "";
		var issuerDNFilter = "";
		var serialNumFilter = serialNo; //证书编号
		var bSelectCertResult = CryptoClient.SelectCertificate(subjectDNFilter, issuerDNFilter, serialNumFilter);
		return true;
	} catch (e) {
		if (confirm("您未下载证书？是否安装证书 ")) {
			http_Post(1);
		};
		return false;
	}
}
/**
 * 申请完证书后，将证书导入控件容器
 */
function CFCA_importSignCert_SingleCert() {
	var signatuerCert = document.getElementById("signatuerCert").value;
	var contianerName = document.getElementById("TextContianerName").value;
	var signCert = CryptoAgent.CFCA_ImportSignCert(1, signatuerCert, contianerName);
	if (true == signCert) {
		alert("证书导入成功");
	}
	return signCert;
}

/**
 * 申请证书接口
 */
function http_Post(index) {

	var status = false;
	var csp_Name = "";
	var cert_csptype = "";
	if (index == 0) {
		csp_Name = document.getElementById("csp_Name_usbkey").value;
		cert_csptype = "1";
	} else {
		csp_Name = document.getElementById("csp_Name").value;
		cert_csptype = "2";
	}
	var p10 = PKCS10Requisition_SingleCert(csp_Name);
	var pkcs10Requisition = p10;
	var access_token = document.getElementById("access_token").value;
	$.post(url, {
		"access_token": access_token,
		"cert_csptype": cert_csptype,
		"p10": pkcs10Requisition
	}, function (result) {
		if ("10001" != result.bcjson.flag) {
			alert(JSON.stringify(result));
		}
		document.getElementById("signatuerCert").value = result.bcjson.items.signatuerCert;
		status = CFCA_importSignCert_SingleCert();
		if (status == true) {
			SignMessageOnClick();
		}
	}, "json");
};

/**
 * 在申请证书之前，必须拿到控件中提供的P10值
 */
function PKCS10Requisition_SingleCert(csp_Name_value) {
	try {
		var keyAlgorithm = "RSA";
		var keyLength = 2048;
		var csp_Name = csp_Name_value; //"CFCA FOR UKEY CSP v1.1.0";//"Microsoft Enhanced Cryptographic Provider v1.0";
		//alert("csp_Name:"+csp_Name);
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
		var strSubjectDN = "CN=certRequisition,O=CFCA TEST CA,C=CN";

		var pkcs10Requisition = CryptoAgent.CFCA_PKCS10CertRequisition(strSubjectDN, 1, 0); //采用
		if (!pkcs10Requisition) {
			var errorDesc = CryptoAgent.GetLastErrorDesc();
			alert(errorDesc);
			return;
		};

		//alert("pkcs10Requisition:"+pkcs10Requisition);
		document.getElementById("textareaP10RSASingleCert").value = pkcs10Requisition;
		var contianerName = CryptoAgent.CFCA_GetContainer();
		if (!contianerName) {
			var errorDesc = CryptoAgent.GetLastErrorDesc();
			alert(errorDesc);
			return;
		}
		document.getElementById("TextContianerName").value = contianerName;
		return pkcs10Requisition;
	} catch (e) {
		var lastErrorDesc = CryptoAgent.GetLastErrorDesc();
		alert(lastErrorDesc);
	}
}

/**
* 获取usb接口名称
*/
function getcsp_name() {
	try {
		indexEnhanced = 0;
		var cryptprov = document.getElementById("individualorinstitution");

		if (!cryptprov) {
			return;
		}

		for (var i = 0; i < cryptprov.length; i++) {
			cryptprov.remove(i);
		}
		var cspInfo = CryptoAgent.CFCA_GetCSPInfo();
		if (!cspInfo) {
			var errorDesc = CryptoAgent.GetLastErrorDesc();
			alert(errorDesc);
			return;
		}
		var csps = cspInfo.split("||");

		/*
  if(cspInfo.indexOf('Microsoft Enhanced Cryptographic Provider v1.0') != -1)
  {
  	var opt = document.createElement("OPTION");
  	opt.value = "Microsoft Enhanced Cryptographic Provider v1.0";
  	opt.text = "Microsoft Enhanced Cryptographic Provider v1.0";
  	cryptprov.options.add(opt);
  }
  */

		for (var i = 0; i < csps.length; i++) {
			if (-1 == csps[i].indexOf("Microsoft")) {
				var opt = document.createElement("OPTION");
				opt.value = csps[i];
				opt.text = csps[i];
				cryptprov.options.add(opt);
			}
		}

		cryptprov.selectedIndex = indexEnhanced;
	} catch (e) {
		var lastErrorDesc = CryptoAgent.GetLastErrorDesc();
		if (!(-1 == lastErrorDesc.indexOf("0x00000000"))) {
			alert(e.number + e.message);
		} else {
			alert(lastErrorDesc);
		}
	}
}

/*
function GetCSPInfo() {
	try 
	{
		var cspNames = CryptoAgent.CFCA_GetCSPInfo();
		if (!cspNames) {
			var errorDesc = CryptoAgent.GetLastErrorDesc();
			alert(errorDesc);
			return;
		}
		document.getElementById("textareaCSPInfo").value = cspNames; 
	}
	catch (e)
	{
		var LastErrorDesc = CryptoAgent.GetLastErrorDesc();
		alert(LastErrorDesc);
	}
}
*/