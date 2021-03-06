﻿/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：familyHome(关爱家人首页)
 3. 作者：刘昌逵(liuchangkui@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function FamilyHomeController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   是否显示头部header
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.toggleHeader();
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
是否需要header
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
FamilyHomeController.prototype.toggleHeader = function () {
   require([this.utilStaticPrefix + "/url/url.min.js"], function(){
    var urlParam = $.url('?');
    if(urlParam && 'header' in urlParam){
      urlParam.header === 'true' ? $('header').show(): $('header').hide();
    }
   })
  
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function(){
    new FamilyHomeController;
}) ;