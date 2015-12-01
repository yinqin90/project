﻿/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：cancerMenuGene(关爱家人首页)
 3. 作者：刘昌逵(liuchangkui@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function CancerMenuGeneController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   是否显示头部header
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.toggleHeader();
	
	this.swapTabs();
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
是否需要header
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
CancerMenuGeneController.prototype.toggleHeader = function () {
   require([this.utilStaticPrefix + "/url/url.min.js"], function(){
    var urlParam = $.url('?');
    if(urlParam && 'header' in urlParam){
      urlParam.header === 'true' ? $('header').show(): $('header').hide();
    }
   })
}
CancerMenuGeneController.prototype.swapTabs = function() {
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
    new CancerMenuGeneController;
}) ;