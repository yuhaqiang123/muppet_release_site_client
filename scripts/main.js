/**
 * 
 */



function dateFormatTest(){
	var now = new Date();
	var nowStr = now.format("yyyy年MM月dd日");
	log(nowStr);
}

(function($){
	
	/*
	$.fn.extend(Object.prototype,{
		log:function(){
			if(this.toString == Object.prototype.toString){
				log(json2String($(this)));
			}else{
				log(this.toString());
			}
		}
	});*/
	
})(jQuery);

function register(){
	post("http://localhost:8080/web/user/register"
			,{"nickName" : "于海强"
			 ,"email" : "yuhaiqiangvip@sina.com"
			 ,"password" : "yuhaiqiang"}
			, function(data){
				log(data);
			});
}

function emailValidateUnique(){
	post("http://localhost:8080/web/user/email/validate/unique"
			,{"email" : "yuhaiqiangvip@sina.com"}
			, function(data){
				log(unescape(data.result));
			});
}


$(function() {
	debug = true;
	emailValidateUnique();
});
