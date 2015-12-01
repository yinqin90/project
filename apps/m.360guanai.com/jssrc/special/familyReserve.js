﻿/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：FamilyReserve(关爱家人体检预约页面)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function FamilyReserveController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   是否显示头部header
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.toggleHeader();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   是否显示头部header
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.toggleHeader();
  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   提交结果提示框
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.reserveResult();
} ;

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
是否需要header
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
FamilyReserveController.prototype.toggleHeader = function () {
   require([this.utilStaticPrefix + "/url/url.min.js"], function(){
    var urlParam = $.url('?');
   if(urlParam && 'header' in urlParam){
      urlParam.header === 'true' ? $('header').show(): $('header').hide();
    }
   })
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
提交结果提示框
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
FamilyReserveController.prototype.reserveResult = function(){
  var _this = this;
  $("#btnSsubmit").click(function(){
    _this.confirm({
      "title" : "系统提示" ,
      "content" : "<i class=\"iconfont icon-zhengque1\"></i>预约成功" ,
      "showConfirmBtn" : false ,
      "cancelLabel" : "我知道了"
      }) ;
  })
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function(){
    new OverseasReserveController;
}) ;