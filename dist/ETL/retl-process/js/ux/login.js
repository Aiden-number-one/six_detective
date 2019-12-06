$package('Peony.login');
Peony.login = function(){
	return {
		toLogin:function(){
			try{
				var form = $("#loginForm");
				if(form.form('validate')){
					Peony.progress('请稍候','加载中...');
					Peony.submitForm(form,function(data){
						Peony.closeProgress();
						if(data.success){
					 		window.location= "index";
				        }else{
				       	   Peony.alert('提示',data.msg,'error');  
				        }
				        Peony.login.loadVrifyCode();//刷新验证码
					});
				}
			}catch(e){
				
			}
			return false;
		},
		loadVrifyCode:function(){//刷新验证码
			var _url = "ImageServlet?time="+new Date().getTime();
			$(".vc-pic").attr('src',_url);
		},
		init:function(){
			if(window.top != window.self){
				window.top.location =  window.self.location;
			}
			$(".validatebox-tip").remove();
			$(".validatebox-invalid").removeClass("validatebox-invalid");
			//验证码图片绑定点击事件
			$(".vc-pic").click(Peony.login.loadVrifyCode);
			
			var form = $("#loginForm");
			form.submit(Peony.login.toLogin);
		}
	}
}();

$(function(){
	Peony.login.init();
});		