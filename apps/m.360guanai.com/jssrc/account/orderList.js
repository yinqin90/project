/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：OrderList(待支付订单列表，待发货订单列表，已完成订单列表)
 3. 作者：刘昌逵(liuchangkui@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function OrderListController() {       
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this) ;     
} ;

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function(){
    new OrderListController ;        
}) ;