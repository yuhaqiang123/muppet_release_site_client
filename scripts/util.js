

/***
 * 格式化日期
 * @param format
 * @returns
 */
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}

	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}

/**
 * 
 * alert(new Date().Format("yyyy年MM月dd日"));
 alert(new Date().Format("MM/dd/yyyy"));
 alert(new Date().Format("yyyyMMdd"));
 alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));
 * 
 */

/**
 *
 * log 打印输出
 * 
 */
function log(msg, time) {
	if (typeof debug == "undefined" || debug == true) {
		var logContainerClassName = "logmsg";
		var logContainer = "<div class='" + logContainerClassName + "'></div>";
		if (!$(".logmsg").length) {
			$("body").after(logContainer);
		}
		$(".logmsg:last").after(logContainer);
		if (msg.toString == Object.prototype.toString) {
			msg = (json2String(msg));
		} else {

		}
		$(".logmsg:last").text(msg).fadeOut(
				typeof time == "undefined" ? 5000 : time == -1 ? 1000000000
						: time);
	} else {
		console.debug(msg);
	}
}

function json2String(string) {
	try {
		return JSON.stringify(string);
	} catch (e) {
		return string;
	}
}

function emailValidate(email) {
	if (email == "" || email == undefined || typeof email == "undefined") {
		return false;
	} else if (! ("/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/".test(email) )) {
		return false;
	}
	return true;
}

function string2JSON(json) {
	return $.parseJSON(json);
}

function post(urlStr, params, handleData, async) {
	if (async === undefined) {
		async = true;
	}
	$.ajax({
		url : urlStr,
		type : "post",
		dataType : "json",
		data : params,
		async : async,
		xhrFields:{
		      withCredentials:true
		   },
		crossDomain: true,
		success : function(data) {
			handleData(data);
		},
		error : function() {
			alert("网络异常或数据处理故障");
		}
	});
}

function emailValidate(email) {
	if (email == "" || email == undefined || typeof email == "undefined") {
		return false;
	} else if ( !email.match(/^[a-z0-9]+([._]*[a-z0-9]+)*@[a-z0-9]+([_.][a-z0-9]+)+$/gi)) {
		return false;
	}
	return true;
}



//m.prototype.post = post;