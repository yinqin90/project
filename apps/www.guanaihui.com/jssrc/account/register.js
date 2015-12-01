/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：register.js(注册)
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function RegisterController(){
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
	继承于Controller基类
	-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	Controller.call(this);

	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
	登录
	-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	this.submitForm();

	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
	发送短信
	-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	this.sendSms();

	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
	更新验证码
	-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	this.refreshValidateCode();
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
登陆
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
RegisterController.prototype.submitForm = function() {
	var classSelf = this;
	require([classSelf.utilStaticPrefix + '/jquery.ajaxsave.min.js'], function() {
		var $validateCodeInput = $("form input[name='validateCode']");
		var $smsCode = $("form input[name='smsCode']");
		var $password=$("form input[name='password']");


		$('form').ajaxsave({
			dataType: classSelf.apiDataType,
			beforeSaveInterface: function() {
				if ($validateCodeInput.attr('data-validation-engine') == undefined) {
					$validateCodeInput.attr('data-validation-engine', 'validate[required]');
					$validateCodeInput.attr('data-errormessage-value-missing', '验证码不能为空');
					$smsCode.attr('data-validation-engine', 'validate[required]');
					$smsCode.attr('data-errormessage-value-missing', '短信动态码不能为空');
					$password.attr('data-validation-engine', 'validate[required,custom[onlyLetterNumber],minSize[6],maxSize[18]]');
					$password.attr('data-errormessage-value-missing', '密码不能为空');
					$password.attr('data-errormessage-value-error', '密码必须是6-18位大小写字母或数字');
					$password.attr('data-errormessage-range-overflow', '密码必须是6-18位大小写字母或数字');
					$password.attr('data-errormessage-range-underflow', '密码必须是6-18位大小写字母或数字');
					
				}
				$("form").attr("action", classSelf.loginApiUrl);
			},
			onSavingInterface: function() {
				classSelf.tips("正在进行处理，请稍等...", 3);
			},
			onErrorInterface: function() {
				classSelf.tips("请求失败，请检查您的接口！", 3);
			},
			onSuccessInterface: function(returnUrl) {
				/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
				首先设置cookie
				-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

				/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
				再跳转页面
				-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
				if (returnUrl != undefined && returnUrl != '') {
					window.location.href = returnUrl;
				} else {
					window.location.href = classSelf.welcomeUrl;
				}
			},
			onExceptionInterface: function(message) {
				classSelf.tips("<span class=\"text-danger\">" + message + "</span>", 5);
			}
		});
	});
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
发送短信
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
RegisterController.prototype.sendSms = function() {
	var classSelf = this;
	require([
		classSelf.utilStaticPrefix + "/validation/js/languages/jquery.validationEngine-zh_CN.js",
		classSelf.utilStaticPrefix + "/validation/js/jquery.validationEngine.js"
	], function() {
		$("form").validationEngine({
			promptPosition: 'topLeft',
			autoHidePrompt: true,
			autoHideDelay: 5000,
			showOneMessage: true,
			maxErrorsPerField: 1,
			validationEventTrigger: ''
		});

		$("#btnGetSmsCode").on('click', function(e) {
			var time = 60;
			var _this = $(this);
			var valid;
			var $mobileInput = $("form input[name='mobile']");
			var $validateCodeInput = $("form input[name='validateCode']");
			var $smsCode = $("form input[name='smsCode']");
			var $password=$("form input[name='password']");

			if ($validateCodeInput.attr("data-validation-engine") != undefined) {
				$validateCodeInput.removeAttr('data-validation-engine');
				$validateCodeInput.removeAttr('data-errormessage-value-missing');
				$smsCode.removeAttr('data-validation-engine');
				$smsCode.removeAttr('data-errormessage-value-missing');
				$password.removeAttr('data-validation-engine');
				$password.removeAttr('data-errormessage-value-missing');
				$password.removeAttr('data-errormessage-value-error');
				$password.removeAttr('data-errormessage-range-overflow');
				$password.removeAttr('data-errormessage-range-underflow');
			}

			valid = $("form").validationEngine('validate');

			if (!valid) {
				return false;
			};

			if (_this.hasClass('.disabled')) {
				return false;
			}

			var data = {
				mobile: $.trim($mobileInput.val()),
				smsType: 0
			};

			var param = {
				process: function(result) {
					_this.addClass('disabled');
					$validateCodeInput.attr('data-validation-engine', 'validate[required]');
					$validateCodeInput.attr('data-errormessage-value-missing', '验证码不能为空');
					$smsCode.attr('data-validation-engine', 'validate[required]');
					$smsCode.attr('data-errormessage-value-missing', '短信动态码不能为空');
					$password.attr('data-validation-engine', 'validate[required,custom[onlyLetterNumber],minSize[6],maxSize[18]]');
					$password.attr('data-errormessage-value-missing', '密码不能为空');
					$password.attr('data-errormessage-value-error', '密码必须是6-18位大小写字母或数字');
					$password.attr('data-errormessage-range-overflow', '密码必须是6-18位大小写字母或数字');
					$password.attr('data-errormessage-range-underflow', '密码必须是6-18位大小写字母或数字');

					var t = window.setInterval(function() {
						time = time - 1;
						_this.html('重新发送(' + time + 's)');
						if (time === 0) {
							_this.html('发送验证码');
							_this.removeClass('disabled')
							$validateCodeInput.removeAttr('data-validation-engine');
							$validateCodeInput.removeAttr('data-errormessage-value-missing');
							$smsCode.removeAttr('data-validation-engine');
							$smsCode.removeAttr('data-errormessage-value-missing');
							window.clearInterval(t);
						}
					}, 1000);
				},
				onExceptionInterface: function(code, message) {
					classSelf.tips("<span class=\"text-danger\">" + message + "</span>", 5);
				}
			};

			classSelf.request(classSelf.sendSmsApiUrl, data, param);

			e.preventDefault();
		});
	});
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
更新验证码
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
RegisterController.prototype.refreshValidateCode = function() {

}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
	new RegisterController;
});