﻿/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：overseasSuitList(海外体检体检机构列表)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function OverseasSuitDetailController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   是否显示头部header
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.toggleHeader();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   显示更多
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.swapTabs();
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
是否需要header
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
OverseasSuitDetailController.prototype.toggleHeader = function () {
   require([this.utilStaticPrefix + "/url/url.min.js"], function(){
    var urlParam = $.url('?');
      if(urlParam && 'header' in urlParam){
      urlParam.header === 'true' ? $('header').show(): $('header').hide();
    }
   })
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
tab内容切换
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
OverseasSuitDetailController.prototype.swapTabs = function() {
    require([this.utilStaticPrefix + "/jquery.tabs.min.js"], function(){
        $(".tabs").tabs({
            "eventType" : "click" ,
            "effect" : "slideDown" ,
            "duration" : 200 
        });
    })
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function(){
    new OverseasSuitDetailController;
}) ;