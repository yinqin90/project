/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：editAddress(修改收货地址)
 3. 作者：尹芹(yinqin@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function EditAddressController() {       
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    继承于Controller基类
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this) ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    初始化bootstrap switch
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.initBootstrapSwitch();
} ;

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
初始化bootstrap switch
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
EditAddressController.prototype.initBootstrapSwitch = function () {
   // require([
           // this.staticDomain + "bootstrap/plugins/bootstrap-switch/dist/js/bootstrap-switch.js"
       // ], function() {
            $('[type="checkbox"]').bootstrapSwitch();
       // })
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function(){
    new EditAddressController;
}) ;