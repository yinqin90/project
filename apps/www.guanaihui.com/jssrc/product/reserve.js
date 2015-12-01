/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. reserve-nmodule(预约module框)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

function Reserve(params) {
    this.sendSmsApiUrl = "/sendmsg"; //发送短信的接口
    this.reserveApiUrl = "/product/booking"; //提交预约信息接口
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    初始化日历控件
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.init();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    监测门店下拉列表变换
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.addListenerToStoreList();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    发送短信
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.sendSms();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    提交表单
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.submitForm();
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化日历控件
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Reserve.prototype.init = function() {
    var _this = this;
    var formDate = $("#datepicker").attr("data-date"),
        endDate = new Date(formDate).addMonths(+2).toString('M/d/yyyy');
    $('#datepicker').datepicker({
        format: 'mm/dd/yyyy',
        language: 'zh-CN',
        startDate: formDate,
        endDate: endDate
    });
    $('#datepicker').on("changeDate", function() {
        $('#hiddenDate').val(
            $('#datepicker').datepicker('getFormattedDate')
        );
    });

};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
监测门店下拉列表变换
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Reserve.prototype.addListenerToStoreList = function() {
    $("#storeId").val($(".selected-label").attr("data-id"));
    $("#module-reserve .dropdown-menu li").click(function() {
        var $this = $(this),
            data_id = $this.attr("data-id"),
            storeItem = $($this.find("a").html());
        $(".selected-label").attr("data-id", data_id).html(" ").append(storeItem);
        $("#storeId").val($(".selected-label").attr("data-id"));
    })
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
发送短信
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Reserve.prototype.sendSms = function() {
    var _this = this;
    $("form").validationEngine({
        promptPosition: 'topLeft',
        autoHidePrompt: true,
        autoHideDelay: 5000,
        showOneMessage: true,
        maxErrorsPerField: 1,
    });
    $("form #btnSendSms").on('click', function(e) {
        $("#vertifyCode").removeAttr("data-validation-engine")
        $("#vertifyCode").removeAttr("data-errormessage-value-missing");
        var time = 60;
        var $this = $(this);
        var $phoneInput = $("form input[name='phone']");
        var valid = $("form").validationEngine('validate');

        if (!valid) {
            return false;
        };

        if ($this.hasClass('.disabled')) {
            return false;
        }

        var data = {
            mobile: $.trim($phoneInput.val()),
            smsType: 0
        };

        var param = {
            apiDataType: "JSON",
            process: function(result) {
                $this.addClass('disabled');
                var t = window.setInterval(function() {
                    time = time - 1;
                    _this.html('重新发送(' + time + 's)');
                    if (time === 0) {
                        $this.html('发送验证码');
                        $this.removeClass('disabled')
                        window.clearInterval(t);
                    }
                }, 1000);
            },
            onExceptionInterface: function(code, messgae) {

            }
        };
        _this.request(_this.sendSmsApiUrl, data, param);
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
提交预约
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
Reserve.prototype.submitForm = function() {
    if ($("#btnReserve").size() === 0) return 0;
    var _this = this;
    //加减号的处理
    $(".add").click(function() {
        var pnum = parseInt($("input[name='pnum']").val());
        pnum <= 99 ? $("input[name='pnum']").val(pnum + 1) : " ";
    })
    $(".min").click(function() {
        var pnum = parseInt($("input[name='pnum']").val());
        pnum > 1 ? $("input[name='pnum']").val(pnum - 1) : " ";
    })
    $("#btnReserve").click(function() {
        var $this = $(this);
        if ($("#vertifyCode").attr('data-validation-engine') == undefined) {
            $("#vertifyCode").attr("data-validation-engine", "validate[required]")
            $("#vertifyCode").attr("data-errormessage-value-missing", "请输入验证码");
        }
        $("form").validationEngine({
            promptPosition: 'topLeft',
            autoHidePrompt: true,
            autoHideDelay: 5000,
            showOneMessage: true,
            maxErrorsPerField: 1,
        });
        var valid = $("form").validationEngine('validate');
        if (!valid) {
            return false;
        };
        var data = {
            "date": $.trim($("#hiddenDate").val()),
            "storeId": $.trim($("#storeId").val()),
            "phone": $.trim($("input[name='phone']").val()),
            "vertifyCode": $.trim($("#vertifyCode").val()),
            "pnum": $.trim($("input[name='pnum']").val()),
            "productId": $.trim($("#productId").val())
        };
        var param = {
            apiDataType: "JSON",
            // 成功调用预约接口回掉
            process: function(result) {
                window.location.href = "/";
            },
            onExceptionInterface: function(code, messgae) {
                console.log("error");
            }
        };
        _this.request(_this.reserveApiUrl, data, param);
    })
};
