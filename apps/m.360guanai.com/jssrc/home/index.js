/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：index(首页)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function IndexController() {    
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this) ; 
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    banner的swiper滑动
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.swipeBanner() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    电话号码抽风似的动
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.flashTel() ;    
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
电话号码抽风似的动
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.flashTel = function() {
    window.setInterval(function(){
        $("#customize .tel").fadeTo("normal", .4).fadeTo("normal", 1) ;
    }, 2000) ;    
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
banner的swiper滑动
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
IndexController.prototype.swipeBanner = function() {
    require([this.utilStaticPrefix + "/swiper/dist/js/swiper.min.js"], function(){
        var swiper = new Swiper("#banner", {
            pagination : ".swiper-pagination" ,            
            paginationClickable : true ,
            spaceBetween : 30 ,
            centeredSlides : true ,
            autoplay : 5000 ,
            autoplayDisableOnInteraction : false
        }) ;
    }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function(){
    new IndexController ;        
}) ;