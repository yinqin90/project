/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：登陆页(首页)
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function IndexController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Login Form Submit
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.submitForm();

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Send Message
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.SendSms();

};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
发送短信
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.SendSms = function() {
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

        $("#btnSendSms").on('click', function(e) {
            var time = 60;
            var _this = $(this);
            var valid;
            var $mobileInput = $("form input[name='mobile']");
            var $validateCodeInput = $("form input[name='validateCode']");

            if ($validateCodeInput.attr("data-validation-engine") != undefined) {
                $validateCodeInput.removeAttr('data-validation-engine');
                $validateCodeInput.removeAttr('data-errormessage-value-missing');
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
                    var t = window.setInterval(function() {
                        time = time - 1;
                        _this.html('重新发送(' + time + 's)');
                        if (time === 0) {
                            _this.html('发送验证码');
                            _this.removeClass('disabled')
                            $validateCodeInput.removeAttr('data-validation-engine');
                            $validateCodeInput.removeAttr('data-errormessage-value-missing');
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
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
登陆
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.submitForm = function() {
    var classSelf = this;
    require(['//cdn01.360guanai.com/guanaihui/jssrc/jquery.ajaxsave.js'], function() {
        var $validateCodeInput = $("form input[name='validateCode']");

        $('form').ajaxsave({
            dataType: classSelf.apiDataType,
            beforeSaveInterface: function() {
                if ($validateCodeInput.attr('data-validation-engine') == undefined) {
                    $validateCodeInput.attr('data-validation-engine', 'validate[required]');
                    $validateCodeInput.attr('data-errormessage-value-missing', '验证码不能为空');
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
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new IndexController;
});