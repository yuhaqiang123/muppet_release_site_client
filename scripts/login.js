document.write("<script language='javascript' src='scripts/util.js'></script>");
$(function(){
	$('#switch_qlogin').click(function(){
		$('#switch_login').removeClass("switch_btn_focus").addClass('switch_btn');
		$('#switch_qlogin').removeClass("switch_btn").addClass('switch_btn_focus');
		$('#switch_bottom').animate({left:'0px',width:'70px'});
		$('#qlogin').css('display','none');
		$('#web_qr_login').css('display','block');
		
		});
	$('#switch_login').click(function(){
		
		$('#switch_login').removeClass("switch_btn").addClass('switch_btn_focus');
		$('#switch_qlogin').removeClass("switch_btn_focus").addClass('switch_btn');
		$('#switch_bottom').animate({left:'154px',width:'70px'});
		
		$('#qlogin').css('display','block');
		$('#web_qr_login').css('display','none');
		});
	if(getParam("a")=='0')
	{
		$('#switch_login').trigger('click');
	}
	
	var registerEmailDefaultValue = "请输入邮箱";
	var registerPasswordDefaultValue = "6-10位,包含大小写"
	var registerConfirmPasswordDefaultValue = "请再输入一遍,确认密码";
	
	var passwordValidateSuccess = "密码格式正确";
	var passwordValidateFailed = "密码格式错误";
	
	var passwordConfirmPasswordSuccess = "已确认密码";
	var passwordConfirmPasswordFailed = "两次密码输入不一致";
	
	var validateCodeFailed = "验证码验证失败";
	var validateCodeSuccess = "验证码验证成功";
	
	
	$("#registerEmail").attr("placeholder",registerEmailDefaultValue);
	$("#registerPassword").attr("placeholder", registerPasswordDefaultValue);
	$("#registerConfirmPassword").attr("placeholder", registerConfirmPasswordDefaultValue);
	

	
	function applyValidateCode(){
		post("http://localhost:8080/web/user/apply/validatecode/"
				,{}
				, function(data){
					if(data.code == "1"){
						$("#code").text(data.result);
					}else{
						$("#code").text(data.msg);
					}
				});
	}
	
	function init(){
		$("#registerEmail").val("");
		$("#registerPassword").val("");
		$("#registerConfirmPassword").val("");
		
		applyValidateCode();
	}
	/**
	 * 初始化控件
	 */
	init();
	
	function emailValidateWithTip(email){
		var emailValue = email.val();
		var tip = $("#registerEmailTip");
		tip.text("");
		if(!emailValidate(emailValue)){
			$(this).css("border-color","red");
			tip.css("color", "red").attr("class", "0").html("请输入正确格式的email");
		}else{
			tip.attr("class", "1");
			//如果正确的邮箱格式,那么就发送请求验证邮箱是否存在
			post("http://localhost:8080/web/user/email/validate/unique"
					,{"email" : emailValue}
					, function(data){
						if(data.code == "1"){
							//如果不存在,即成功,那么返回正确信息
							email.css("border-color", "green");
							tip.css("color", "green").attr("class", "1").text(data.msg);
						}else{
							//如果不正确,加红输入框
							email.css("border-color","red");
							
							//tip 展示错误信息
							tip.css("color", "red").attr("class", "0").text(data.msg);
							
						}
					});
		}
		
		return function(){
			/**
			 * 如果tip class属性为1 那么说明 邮箱格式正确,但不代表 邮箱尚未被注册
			 */
			return tip.attr("class") == "1" ? true : false;
		};
	}
	
	
	/**
	 * 注册邮箱需要验证邮箱格式.验证邮箱是否已经被注册
	 */
	$("#registerEmail").blur(function(){
		emailValidateWithTip($(this));
	});
	/***********************************************/
	
	var password = $("#registerPassword");
	
	function passwordValidate(password){
		var passwordValue = password.val();
		var tip = $("#registerPasswordTip");
		if(validatePassword(passwordValue)){
			//tip以及输入框变成绿色
			tip.css("color", "green").text(passwordValidateSuccess);
			password.css("border-color", "green");
			return true;
		}else{
			//tip以及输入框变成红色
			tip.css("color", "red").text(passwordValidateFailed);
			password.css("border-color", "red");
			return false;
		}
	}
	
	/**
	 * 注册填写密码时,需要验证密码格式
	 */
	password.blur(function(){
		var password = $(this);
		passwordValidate(password);
	});
	/***********************************************/
	
	/**
	 * 确认密码验证
	 */
	function confirmPasswordValidate(confirm){
		var confirmValue = confirm.val();
		var passwordValue = password.val();
		var tip = $("#registerConfirmPasswordTip");
		
		if(confirmValue == passwordValue){
			tip.css("color", "green").text(passwordConfirmPasswordSuccess);
			confirm.css("border-color", "green");
			return true;
		}else{
			tip.css("color", "red").text(passwordConfirmPasswordFailed);
			confirm.css("border-color", "red");
			return false;
		}
	}
	
	
	/**
	 * 验证密码
	 */
	$("#registerConfirmPassword").blur(function(){
		var confirm = $(this);
		confirmPasswordValidate(confirm);
		
	});
	/************************************************/
	
	/**
	 * 验证密码
	 */
	function validateCodeWithTip(code){
		var tip = $("#registerValidateCodeTip");
		if(typeof code == "undefined" || code == null || code == undefined || code == ""){
			//tip.css("color", "green");
			tip.css("color", "red").text(validateCodeFailed);
			return false;
		}else{
			return true;
		}
	}
	
	$("#registerValidateCode").blur(function(){
		var validateCode = $(this);
		if(validateCodeWithTip(validateCode.val())){
			return true;
		}else{
			return false;
		}
	});
	
	$("#registerRefreshValidateCode").click(function(){
		var refresh = $(this);
		applyValidateCode();
	});
	
	
	/**
	* <p>登录时逻辑.包括验证注册参数
	* <p>首先检查所有输入框的验证逻辑,是否正确.
	* <p>如果正确向后台发送注册信息
	* <p>如果注册失败重新更新验证码.返回错误信息
	* 
	*/
	$("#registerBtn").click(function(){
		var email = $("#registerEmail");
		var password = $("#registerPassword");
		var confirmPassword = $("#registerConfirmPassword");
		var validateCode = $("#registerValidateCode");
		var emailResult = emailValidateWithTip(email);
		var passwordResult = passwordValidate(password);
		var confirmPasswordResult = confirmPasswordValidate(confirmPassword);
		var validateCodeResult = validateCodeWithTip(validateCode.val());
		emailResult = emailResult();
		
		if(!(emailResult == true && passwordResult == true && confirmPasswordResult == true && validateCodeResult== true)){
			
			return;
		}
		post("http://localhost:8080/web/user/register"
				,{"x.withCredentials": true,
					"email" : email.val()
					, "password" : password.val()
					, "clientCode" : validateCode.val()}
				,function(data){
					if(data.code == "2"){
						$("#registerValidateCodeTip").css("color", "red").text(data.msg);
						$("#code").text(data.result.validateCode);
					}else if(data.code == "0"){
						$("#code").text(data.result.validateCode);
						$("registerTip").css("color", "red").text(data.msg);
					}else{//注册成功
						alert(data.msg);
					}
					
		});//post
		
		
	});
	/**************************************************/

});
	
function validatePassword(password){
	if (password == "" || password == undefined || typeof password == "undefined") {
		return false;
	}
	if(password.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/)){
		return true;
	}else{
		return false;
	}
}


function logintab(){
	scrollTo(0);
	$('#switch_qlogin').removeClass("switch_btn_focus").addClass('switch_btn');
	$('#switch_login').removeClass("switch_btn").addClass('switch_btn_focus');
	$('#switch_bottom').animate({left:'154px',width:'96px'});
	$('#qlogin').css('display','none');
	$('#web_qr_login').css('display','block');
	
}


//根据参数名获得该参数 pname等于想要的参数名 
function getParam(pname) { 
    var params = location.search.substr(1); // 获取参数 平且去掉？ 
    var ArrParam = params.split('&'); 
    if (ArrParam.length == 1) { 
        //只有一个参数的情况 
        return params.split('=')[1]; 
    } 
    else { 
         //多个参数参数的情况 
        for (var i = 0; i < ArrParam.length; i++) { 
            if (ArrParam[i].split('=')[0] == pname) { 
                return ArrParam[i].split('=')[1]; 
            } 
        } 
    } 
}  

