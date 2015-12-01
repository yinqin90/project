/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：企业中心 - 关爱体检通
 2. 页面名称：login (登录)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
require([
        "//cdn17.360guanai.com/bootstrap/3.3.4/js/bootstrap.min.js" ,
        "//cdn02.360guanai.com/apps/enterprise.360guanai.com/js/controller.min.js" ,
        "//cdn09.360guanai.com/guanaihui/js/util/jquery.cookie.min.js"
    ], function(){
    function LoginController() {    
        this.apiUrl = "" ;  //登录Ajax接口地址
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        继承于Controller基类
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        Controller.call(this) ;        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        表单提交处理
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.submitForm() ;
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    表单提交处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    LoginController.prototype.submitForm = function() {
        var classSelf = this ;
        require([
                this.utilStaticPrefix + "/jquery.ajaxsave.min.js"
            ], function(){
            $("form").ajaxsave({
                dataType : classSelf.apiDataType ,
                beforeSaveInterface : function() {
                    $("form").attr("action", classSelf.loginApiUrl) ;
                } ,
                onSavingInterface : function() {
                    classSelf.tips("正在进行处理，请稍等...", 3) ;                   
                } ,
                onErrorInterface : function() {
                    classSelf.tips("请求失败，请检查您的接口！", 3) ;                    
                } ,
                onSuccessInterface : function(result) {
                    for(key in result) {
                        if(result.hasOwnProperty(key)) {
                            if(result[key] === null || result[key] === "null") result[key] = "" ;
                        }
                    }
                    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    首先设置cookie
                    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                    $.cookie(classSelf.cookieKeyConf.userName, result.code, { path : "/", domain : classSelf.cookieDomain }) ;  //设置用户名cookie
                    $.cookie(classSelf.cookieKeyConf.userId, result.user_id, { path : "/", domain : classSelf.cookieDomain }) ;  //设置用户ID cookie
                    $.cookie(classSelf.cookieKeyConf.companyName, result.company_name, { path : "/", domain : classSelf.cookieDomain }) ;  //设置公司名称cookie
                    $.cookie(classSelf.cookieKeyConf.orderAmount, result.order_amount, { path : "/", domain : classSelf.cookieDomain }) ;  //设置订单数cookie
                    $.cookie(classSelf.cookieKeyConf.contact, result.contact, { path : "/", domain : classSelf.cookieDomain }) ;  //设置联系人 cookie
                    $.cookie(classSelf.cookieKeyConf.tel, result.tel, { path : "/", domain : classSelf.cookieDomain }) ;  //设置联系电话cookie
                    $.cookie(classSelf.cookieKeyConf.address, result.address, { path : "/", domain : classSelf.cookieDomain }) ;  //设置收货地址cookie
                    $.cookie(classSelf.cookieKeyConf.description, result.description, { path : "/", domain : classSelf.cookieDomain }) ;  //设置公司描述cookie
                    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                    再跳转页面
                    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                    window.location.href = classSelf.welcomeUrl ;
                } ,
                onExceptionInterface : function(message) {                     
                    classSelf.tips("<span class=\"text-danger\">" + message + "</span>", 5) ;
                }
            }) ;
        }) ;
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    类的初始化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $(document).ready(function(){
        new LoginController ;        
    }) ;
}) ;

