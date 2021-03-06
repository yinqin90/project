/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：Controller (每个页面的类都继承于这个控制器基类)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：对api的依赖：jQuery
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function Controller() {
    this.environment = "production" ;  //环境定义，可以是：test | production；分别表示测试环境和生产环境
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    一些关于静态资源地址的配置
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.staticDomainPrefix = (this.environment === "test") ? "static" : "cdn" ;
    this.staticDomain = "//" + this.staticDomainPrefix + "01.360guanai.com";
    this.utilStaticPrefix = this.staticDomain + "/guanaihui/js/util";
    this.appStaticPrefix = this.staticDomain + "/apps/m.360guanai.com/js";
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    一些关于cookie参数的配置
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.cookieDomain = ".360guanai.com"; //整个app用来设置和取得cookie的域名
    this.cookieKeyPrefix = "M_"; //cookie的key值前缀，用来区分哪个模块的cookie，比如M_表示M站
    this.cookieKeyConf = {
        //一些关于cookie参数名称的配置
        "userName": this.cookieKeyPrefix + "userName",
        "userId": this.cookieKeyPrefix + "userId",
        "companyName": this.cookieKeyPrefix + "companyName",
        "orderAmount": this.cookieKeyPrefix + "orderAmount",
        "contact": this.cookieKeyPrefix + "contact",
        "tel": this.cookieKeyPrefix + "tel",
        "address": this.cookieKeyPrefix + "address",
        "description": this.cookieKeyPrefix + "description"
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    一些关于dialog | tips | confirm 参数的配置
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.tipsDialogId = "guanaihui-tips"; //整个应用通用的tips框的id值
    this.confirmDialogId = "guanaihui-confirm"; //整个应用通用的confirm框的id值  

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    整个应用Ajax请求的时候的数据类型，是json还是jsonp
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.apiDataType = (this.environment === "test") ? "jsonp" : "json" ;    
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    接口的地址
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.apiPrefix = (this.environment === "test") ? "//mtest.360guanai.com" : "//m.360guanai.com" ; //api接口地址前缀
    this.sendSmsApiUrl = this.apiPrefix + "/Common/SendSms" ; //发送短信的接口
    this.loginApiUrl = this.apiPrefix + "/Account/Login" ; //登录的接口
    this.hcsListApiUrl=this.apiPrefix + "/HealthCheckupStore/GetHcsList"; //门店列表的接口
    this.productListApiUrl=this.apiPrefix+"/Product/GetProductList"; //套餐列表的接口地址
    this.cardListApiUrl=this.apiPrefix+"/Card/GetCardList"; //体检卡列表的接口地址
    this.shoppingCardAddApiUrl=this.apiPrefix+"/Cart/AddItem"; //体检卡列表的接口地址
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    如果通过geolocation无法取到经纬度信息，就用上海的经纬度来请求数据，这里用来设置默认经纬度信息
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.defaultLongitude = 120.51 ;
    this.defaultLatitude = 122.12 ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   CDN域名序列随机化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.randomDomainSn = function() {
        var sn = parseInt(Math.random() * 20 + 1, 10).toString();
        if (sn.length < 2) sn = "0" + sn;
        return sn;
    } ;  
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    登录以后跳转的地址
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.welcomeUrl = "/Home";
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    登出以后跳转的地址
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.logoutRedirectUrl = "/Account/loginOut";
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    登出以后跳转的地址
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.shoppingCardUrl="/Cart";

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    新增模态框的公共方法，是下面的this.dialog和this.tips两个方法的基础方法
    1. 使用方法：
        this.createModalDialog({
            "type" : "dialog" ,  //模态框类型，值为：dialog | tips
            "id" : "my-modal-dialog" ,  //模态框ID值，type为dialog，新增的模态框id为参数给出的id，否则id就是"ttpaicrm-tips" ,
            "effect" : true ,  //弹出dialog的时候是否需要fade效果
            "tabindex" : 1  //模态框的tabindex值
        }) ;
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.createModalDialog = function(params) {
        var type = (params === null || params.type === null || params.type === undefined) ? "dialog" : params.type;
        var id = params.id;
        if (type === "tips") id = this.tipsDialogId;
        else if (type === "confirm") id = this.confirmDialogId;
        var tabindex = (params === null || params.tabindex === null || params.tabindex === undefined) ? null : params.tabindex;
        var modal = $(document.createElement("DIV")).attr("id", id).attr("role", "dialog").attr("aria-labelledby", "myModalLabel").addClass("modal fade");
        if (tabindex) $(modal).attr("tabindex", tabindex);
        var modalDialog = $(document.createElement("DIV")).attr("role", "document").addClass("modal-dialog").append($(document.createElement("DIV")).addClass("modal-content"));
        $(modal).append(modalDialog);
        $("body").prepend(modal);
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    弹出普通的内容为某个url的html结构的模态框，始终都是先干掉先前如果存在的同样ID的模态框再新增
    备注：这个方法只能打开同域名下的页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.dialog = function(params) {
        var tabindex = (params === null || params.tabindex === null || params.tabindex === undefined) ? null : params.tabindex;
        if ($("#" + params.id).size() > 0) $("#" + params.id).remove();
        this.createModalDialog({
            "type": "dialog",
            "id": params.id,
            "tabindex": tabindex
        });
        $("#" + params.id).modal({
            remote: params.url
        });
        $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    弹出tips提示框，参数：
    @content：提示的html信息
    @time：表示多少秒之后关闭，如果为0表示不关闭，单位为秒
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.tips = function(content, time, callback) {
        var classSelf = this;
        if ($("#" + this.tipsDialogId).size() > 0) {
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            如果提示框html结构已经存在，就改变内容再显示
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            $("#" + this.tipsDialogId + " .modal-tips").html(content);
            $("#" + this.tipsDialogId).modal("show");
        } else {
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            如果先前页面都没有提示过就先创建模态框
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            this.createModalDialog({
                "type": "tips"
            });
            $("#" + this.tipsDialogId).addClass("bs-example-modal-sm");
            $("#" + this.tipsDialogId + " .modal-dialog").addClass("modal-sm");
            $("#" + this.tipsDialogId + " .modal-content").append($(document.createElement("DIV")).addClass("modal-tips").html(content));
            $("#" + this.tipsDialogId).modal({
                "keyboard": true
            });
        }
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        最后根据需要决定是否关闭
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if (time) {
            window.setTimeout(function() {
                $("#" + classSelf.tipsDialogId).modal("hide");
                if (callback) callback();
            }, time * 1000);
        }
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    确认框
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.confirm = function(params) {
        var classSelf = this;
        var title = (params === null || params.title === null || params.title === undefined) ? "系统确认" : params.title ;
        var content = (params === null || params.content === null || params.content === undefined) ? "" : params.content ;
        var showConfirmBtn = (params === null || params.showConfirmBtn === null || params.showConfirmBtn === undefined) ? true : params.showConfirmBtn ;
        var confirmLabel = (params === null || params.confirmLabel === null || params.confirmLabel === undefined) ? "确认" : params.confirmLabel ;
        var showCancelBtn = (params === null || params.showCancelBtn === null || params.showCancelBtn === undefined) ? true : params.showCancelBtn ;
        var cancelLabel = (params === null || params.cancelLabel === null || params.cancelLabel === undefined) ? "取消" : params.cancelLabel;
        var confirmInterface = (params === null || params.confirmInterface === null || params.confirmInterface === undefined) ? null : params.confirmInterface;
        var cancelInterface = (params === null || params.cancelInterface === null || params.cancelInterface === undefined) ? null : params.cancelInterface;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        如果先前有这个dialog就删除
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if ($("#" + this.confirmDialogId).size() > 0) $("#" + this.confirmDialogId).remove();
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        先创建一个dialog
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.createModalDialog({
            "type": "confirm"
        });
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        再将节点贴进去
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $("#" + this.confirmDialogId + " .modal-content").append($(document.createElement("DIV")).addClass("modal-header").append("<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\">" + title + "</h4>"));
        $("#" + this.confirmDialogId + " .modal-content").append($(document.createElement("DIV")).addClass("modal-confirm").html(content));
        var confirmFooter = $(document.createElement("DIV")).addClass("modal-footer") ;
        if(showConfirmBtn) {
            var confirmBtn = $(document.createElement("BUTTON")).attr("type", "button").addClass("btn btn-primary btn-sm").text(confirmLabel);
            $(confirmBtn).click(function() {
                if (confirmInterface) confirmInterface() ;
                $("#" + classSelf.confirmDialogId).modal("hide") ;
            });
            $(confirmFooter).append(confirmBtn) ;
        }
        if(showCancelBtn) {
            var cancelBtn = $(document.createElement("BUTTON")).attr("type", "button").addClass("btn btn-default btn-sm").attr("data-dismiss", "modal").text(cancelLabel);
            $(cancelBtn).click(function() {
                if (cancelInterface) cancelInterface();
            });
            $(confirmFooter).append(cancelBtn);
        }       
        $("#" + this.confirmDialogId + " .modal-content").append(confirmFooter);
        $("#" + this.confirmDialogId).modal({
            "keyboard": true
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    发送Ajax请求的方法：
    @apiUrl：请求的url地址
    @data：请求附带发送的参数数据
    @params：{
        @type：请求的类型，可以是：GET|POST，但是如果apiDataType参数指为jsonp的话，这里设置为POST有没有任何意义，因为jsonp只能是GET
        @apiDataType：接口数据类型，可以是：json|jsonp|script等
        @showLoadingTips：加载过程中是否显示提示信息，可以为null，默认显示，如果要关闭，请设置值为 false
        @loadingTips：加载过程中显示的提示信息内容，默认为："正在加载数据，请稍等..."
        @process：code==200的时候的回调接口方法
        @onExceptionInterface：发生错误的时候的回调接口方法
    }    
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.request = function(apiUrl, data, params) {
        var classSelf = this;
        var type = (params === null || params.type === null || params.type === undefined) ? "GET" : params.type;
        var process = (params === null || params.process === null || params.process === undefined) ? null : params.process;
        var showLoadingTips = (params === null || params.showLoadingTips === null || params.showLoadingTips === undefined) ? true : params.showLoadingTips ;
        var loadingTips = (params === null || params.loadingTips === null || params.loadingTips === undefined) ? "正在加载数据，请稍等..." : params.loadingTips ;
        var apiDataType = (params === null || params.apiDataType === null || params.apiDataType === undefined) ? this.apiDataType : params.apiDataType;
        var onExceptionInterface = (params === null || params.onExceptionInterface === null || params.onExceptionInterface === undefined) ? null : params.onExceptionInterface;
        if(this.showLoadingTips) this.tips(loadingTips);
        try {
            $.ajax({
                url: apiUrl,
                type: type,
                data: data,
                dataType: apiDataType,
                error: function(e) {
                    classSelf.tips("调用数据接口失败！请测试您的数据接口！", 3);
                },
                success: function(data) {
                    $("#" + classSelf.tipsDialogId).modal("hide");
                    if (data.code.toString() === "301") classSelf.clearCookieRedirect();
                    else if (data.code.toString() === "200") {
                        if (process) process(data); //一切没有问题，就处理数据
                    } else {
                        classSelf.tips(data.message, 3);
                        if (onExceptionInterface) onExceptionInterface(data.code, data.message);
                    }
                }
            });
        } catch (e) {
            classSelf.tips("错误名称：" + e.name + "\n错误描述：" + e.message, 3);
        }
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        整个try-catch块结束
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    回到顶部按钮事件绑定，相应插件已经合并到app.min.js
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.scrollUp = function() {        
        require([this.utilStaticPrefix + "/jquery.scrollup.min.js"], function() {
            $("#floater .scroll-up").scrollup({
                topDistance: 100
            });
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    图片延迟加载，相应插件已经合并到app.min.js
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.lazyload = function() {
        require([this.utilStaticPrefix + "/jquery.lazyload.min.js"], function() {
            $(".lazy").lazyload();
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    点击搜索按钮切换搜索条的显示与隐藏
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.switchSearcher = function() {        
        $("header .assistant-tools .search").click(function() {
            $("#searcher").toggle("normal");
            $(this).toggleClass("active");
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    点击导航按钮切换导航条的显示与隐藏
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.switchNav = function() {        
        $("header .assistant-tools .nav").click(function() {
            $("nav").toggle("normal");
            $(this).toggleClass("active");
        });
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    使用html5的GEOLocation来获取手机的位置信息并执行相应的回调方法，使用范例：
    this.requestGeolocation({
        process : function(longitude, latitude){
            //使用经度和纬度干的活
            console.log("longitude : " + longitude + " , latitude : " + latitude) ;
        }
    }) ;
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.requestGeolocation = function(params) {
        var classSelf = this ;
        var process = (params === null || params.process === null || params.process === undefined) ? null : params.process ;
        if( ! navigator.geolocation) {
            /*
            this.tips("因您的浏览器不支持定位功能，无法获取您的手机当前位置！", 3) ;
            return ;
            */
           if(process) process(this.defaultLongitude, this.defaultLatitude) ;
           return ;
        }
        navigator.geolocation.getCurrentPosition(function(position){
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            位置获取成功后的回调函数，以经度和纬度作为参数来处理
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            if(process) process(position.coords.longitude, position.coords.latitude) ;
            
        }, function(error){
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            位置获取失败后的回调函数
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            /*
            switch(error.code) {  
                case error.TIMEOUT:  
                    classSelf.tips("获取位置信息超时，请刷新浏览器重试！", 3);  
                    break;  
                case error.POSITION_UNAVAILABLE:  
                    classSelf.tips("因为浏览器的一些不可知原因，我们无法获取道您的位置！", 3);  
                    break;  
                case error.PERMISSION_DENIED:  
                    classSelf.tips("请允许浏览器共享您的位置！", 3);  
                    break;  
                case error.UNKNOWN_ERROR:  
                    classSelf.tips("发生了一个不可知的错误！", 3);  
                    break;  
            }
            */
           if(process) process(classSelf.defaultLongitude, classSelf.defaultLatitude) ;           
        }, {  
            // 指示浏览器获取高精度的位置，默认为false  
            enableHighAcuracy : true ,
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒  
            timeout : 5000 ,
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。  
            maximumAge : 3000  
        }) ;
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    对cms系统出来的图片进行去除style节点和加img-responsive这个类的处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.cmsImageProcess = function() {        
        $(".cms img").removeAttr("style").addClass("img-responsive") ;
        $(".fixed-toolbar").css({ "width" : "100%" }) ;
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面加载的时候执行的公共逻辑
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.onload = function() {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        回到顶部按钮事件绑定，相应插件已经合并到app.min.js
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.scrollUp();
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        图片延迟加载，相应插件已经合并到app.min.js
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.lazyload();
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        点击搜索按钮切换搜索条的显示与隐藏
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.switchSearcher();
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        点击导航按钮切换导航条的显示与隐藏
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.switchNav() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        对cms系统出来的图片进行去除style节点和加img-responsive这个类的处理
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.cmsImageProcess() ;
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    整个基类逻辑结束
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.onload() ;
};