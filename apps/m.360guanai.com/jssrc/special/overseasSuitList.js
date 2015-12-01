﻿/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：overseasSuitList(海外体检体检机构列表)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function OverseasSuitListController() {
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
    this.toggleContent();
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
是否需要header
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
OverseasSuitListController.prototype.toggleHeader = function () {
   require([this.utilStaticPrefix + "/url/url.min.js"], function(){
    var urlParam = $.url('?');
    if(urlParam && 'header' in urlParam){
      urlParam.header === 'true' ? $('header').show(): $('header').hide();
    }
   })
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
显示更多
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
OverseasSuitListController.prototype.toggleContent = function () {
    if ($(".show-more").size() === 0) return;
    $(".show-more").click(function () {
        var _this = $(this), num = _this.attr("data-num");
        _this.prev().find(".moreItem").slideToggle();
        _this.hasClass("active") ? _this.html("更多(<span class='arial'>" + num + "</span>)").removeClass("active") : _this.html("已显示全部").addClass("active")
    })
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function(){
    new OverseasSuitListController;
}) ;