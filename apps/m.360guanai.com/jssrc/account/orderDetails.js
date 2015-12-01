/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：waitPayOrderDetails,waitSendOrderDetails,completeOrderDetails(订单详情)
 3. 作者：刘昌逵(liuchangkui@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function OrderDetailsController() {       
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this) ;     
	
	// 收货人信息
	this.panelHandler("#panelPersonInfoStartUp","#panelPersonInfo");
	
	// 商品信息
	this.panelHandler("#panelProdInfoStartUp","#panelProdInfo");
	
} ;

// 展示和隐藏信息的处理器函数
OrderDetailsController.prototype.panelHandler=function(eStart,ePanel){
	var upClass = "icon-xiangshang3";
	var downClass = "icon-xiangxia2";
	$(eStart).click(function(){
			var $icon = $(this).find(".iconfont");
			$icon.hasClass(upClass) ? $icon.removeClass(upClass).addClass(downClass) : $icon.removeClass(downClass).addClass(upClass);
			$(ePanel).slideToggle();
	});
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function(){
    new OrderDetailsController ; 
}) ;