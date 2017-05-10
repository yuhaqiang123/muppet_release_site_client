
var host = "http://localhost:8080/web";
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
	var registerPasswordDefaultValue = "6-10位,包含字母和数字"
	var registerConfirmPasswordDefaultValue = "请再输入一遍,确认密码";
	
	var passwordValidateSuccess = "密码格式正确";
	var passwordValidateFailed = "密码格式错误";
	
	var loginPasswordEmpty = "密码为空,请输入密码";
	
	var passwordConfirmPasswordSuccess = "已确认密码";
	var passwordConfirmPasswordFailed = "两次密码输入不一致";
	
	var validateCodeFailed = "验证失败";
	var validateCodeSuccess = "验证成功";
	
	
	var loginEmailDefaultValue = registerEmailDefaultValue;
	var loginPasswordDefaultValue=registerPasswordDefaultValue;
	
	
	
	
	$("#registerEmail").attr("placeholder",registerEmailDefaultValue);
	$("#registerPassword").attr("placeholder", registerPasswordDefaultValue);
	$("#registerConfirmPassword").attr("placeholder", registerConfirmPasswordDefaultValue);
	
	$("#loginEmail").attr("placeholder", loginEmailDefaultValue);
	$("#loginPassword").attr("placeholder", loginPasswordDefaultValue);
	
	
	
	function applyValidateCode(){
		post(host + "/user/apply/validatecode/"
				,{}
				, function(data){
					if(data.code == "1"){
						$(".code").text(data.result);
					}else{
						$(".code").text(data.msg);
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
	
	/***
	 * @see #emailValidateWithTip
	 * 登录时验证邮箱.不向后台请求
	 */
	function emailLoginValidateWithTip(email, tip){
		var emailValue = email.val();
		tip.text("");
		if(!emailValidate(emailValue)){
			$(this).css("border-color","red");
			tip.css("color", "red").attr("class", "0").html("请输入正确格式的email");
		}else{
			tip.attr("class", "1");
		}
			/**
			 * 如果tip class属性为1 那么说明 邮箱格式正确,但不代表 邮箱尚未被注册
			 */
			return tip.attr("class") == "1" ? true : false;
	}
	
	/***
	 * 注册时校验邮箱,需要后台验证此邮箱是否被注册
	 */
	function emailValidateWithTip(email, tip){
		var emailValue = email.val();
		tip.text("");
		if(!emailValidate(emailValue)){
			email.css("border-color","red");
			tip.css("color", "red").attr("class", "0").html("请输入正确格式的email");
		}else{
			tip.attr("class", "1");
			//如果正确的邮箱格式,那么就发送请求验证邮箱是否存在
			post(host + "/user/email/validate/unique"
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
	
	/***
	 * 登录输入邮箱后,失去焦点时校验
	 */
	$("#loginEmail").blur(function(){
		var tip = $("#loginEmailTip");
		emailLoginValidateWithTip($(this), tip);
	});
	/************************************************/
	/**
	 * 
	 */
	function loginPasswordValidate(loginPassword,tip){
		if(loginPassword.val() == null || loginPassword.val() == "" ){
			tip.css("color", "red").text(loginPasswordEmpty);
			$(this).css("border-color", "red");
			return false;
		}
		return true;
	}
	
	/**
	 * 登录时密码框离开时触发,如果密码为空,那么提示
	 */
	$("#loginPassword").blur(function(){
		var tip = $("#loginPasswordTip");
		tip.text("");
		loginPasswordValidate($(this), tip);
	});
	
	
	
	
	$("#loginBtn").click(function(){
		var loginEmail = $("#loginEmail");
		var loginEmailTip = $("#loginEmailTip");
		var loginPassword = $("#loginPassword");
		var loginPasswordTip = $("#loginPasswordTip");
		var loginValidateCode = $("#loginValidateCode");
		var loginValidateCodeTip = $(".validateCodeTip");
		
		var loginBtnTip = $("#loginBtnTip");
		
		var emailResult = emailLoginValidateWithTip(loginEmail, loginEmailTip);
		var passwordResult = loginPasswordValidate(loginPassword, loginPasswordTip);
		var validateCodeResult = validateCodeWithTip(loginValidateCode.val(), loginValidateCodeTip);
		if(!(emailResult == true && passwordResult == true && validateCodeResult == true)){
			return false;
		}else{
			post( host+"/user/login"
					,{"email" : loginEmail.val()
				      ,"password" : loginPassword.val()
				      ,"clientCode" : loginValidateCode.val()}
			, function(data){
				if(data.code == "2"){
					loginValidateCodeTip.css("color", "red").text(data.msg);
					$(".code").text(data.result.validateCode);
				}else if(data.code == "0"){
					//loginValidateCodeTip.css("color", "red").text(data.msg);
					loginBtnTip.css("color", "red").text(data.msg);
					$(".code").text(data.result.validateCode);
				}else if(data.code == "1"){
					alert(data.msg);
				}
			});
		}
	});
	
	
	/**
	 * 注册邮箱需要验证邮箱格式.验证邮箱是否已经被注册
	 */
	$("#registerEmail").blur(function(){
		var tip = $("#registerEmailTip");
		emailValidateWithTip($(this), tip);
	});
	/***********************************************/
	
	var password = $("#registerPassword");
	
	function passwordValidate(password, tip){
		var passwordValue = password.val();
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
		var tip = $("#registerPasswordTip");
		passwordValidate(password, tip);
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
	function validateCodeWithTip(code, tip){
		if(typeof code == "undefined" || code == null || code == undefined || code == ""){
			//tip.css("color", "green");
			tip.css("color", "red").text(validateCodeFailed);
			return false;
		}else{
			tip.text("");
			return true;
		}
	}
	
	$("#validateCode").blur(function(){
		var validateCode = $(this);
		var tip = $(".validateCodeTip");
		if(validateCodeWithTip(validateCode.val(), tip)){
			return true;
		}else{
			return false;
		}
	});
	
	$(".refreshValidateCode").click(function(){
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
		var emailResult = emailValidateWithTip(email, $("#registerEmailTip"));
		var passwordResult = passwordValidate(password , $("#registerEmailTip"));
		var confirmPasswordResult = confirmPasswordValidate(confirmPassword);
		var validateCodeResult = validateCodeWithTip(validateCode.val(), $("#registerValidateCodeTip"));
		emailResult = emailResult();
		
		if(!(emailResult == true && passwordResult == true && confirmPasswordResult == true && validateCodeResult== true)){			
			return;
		}
		post(host + "/user/register"
				,{"email" : email.val()
					, "password" : password.val()
					, "clientCode" : validateCode.val()}
				,function(data){
					if(data.code == "2"){
						//alert($("validateCodeTip").text());
						$(".validateCodeTip").css("color", "red").text(data.msg);
						$(".code").text(data.result.validateCode);
					}else if(data.code == "0"){
						$(".code").text(data.result.validateCode);
						$("#registerTip").css("color", "red").text(data.msg);
					}else if(data.code == "1"){//注册成功
						alert(data.msg);
					}else if(data.code == "3"){
						$(".code").text(data.result.validateCode);
						$("#registerTip").css("color", "red").text(data.msg);
						emailValidateWithTip(email, $("#registerEmailTip"));
					}
					//console.log(data);
					
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

