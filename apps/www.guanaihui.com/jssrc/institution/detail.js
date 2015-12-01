/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：details(套餐列表)
 3. 作者：刘昌逵(liuchangkui@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function DetailsController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this) ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     页面顶部全部服务分类下拉
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.servicesCategory() ;

    this.rollImg();
	
	// 门店列表点击
	this.bindShopClick();
	
	// 地区过滤门店
    this.shopFilter();
} ;
// 图片轮播
DetailsController.prototype.rollImg = function(){
    var _this=this;
    require([_this.utilStaticPrefix + "/jquery.slide.min.js"],function(){
        // 初始化图片
        $(".viewer img").attr("src",$(".inst-img-box .content .item img").attr("src"));
        // 小图滚动
        $(".inst-img-box").slide({
            autoPlay : true ,
            effect : "leftLoop" ,
            interTime : 4000 ,
            vis : 4
        });
        // 点击小图显示大图
        $(".inst-img-box .content .item").click(function(){
            $(".viewer img").attr("src",$(this).find("img").attr("src"));
        });
    });
}
// 创建地图并标记
DetailsController.prototype.createMap = function(data){
    // 地图信息样式
    var propStyle = "style='float:left;width:60px;font-weight:500;padding:3px 0px;'";
    var valueStyle = "style='margin-left:60px;padding:3px 0px;'";
    point = new BMap.Point(data.ypoint, data.xpoint);
    map=new BMap.Map("baiduMapContainer"); //Map实例
    map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别

    marker = new BMap.Marker(point); // 在指定的经纬度地方打图钉
    map.addOverlay(marker); // 将图钉添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);

    var infoWindow = new BMap.InfoWindow(
        "\
        <dl>\
            <dt " + propStyle + ">机构名称：</dt>\
                <dd " + valueStyle + ">" + data.name + "</dd>\
            </dl>\
            <dl>\
                <dt " + propStyle + ">门店地址：</dt>\
                <dd " + valueStyle + ">" + data.address + "</dd>\
            </dl>\
            ", {
            padding: 10,
            width: 200
        }
    ); // 创建信息窗口对象

    marker.addEventListener("click", function() {
        this.openInfoWindow(infoWindow);
    });

    map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
    //map.setCurrentCity(city);          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(false); //开启鼠标滚轮缩放
    map.addControl(new BMap.NavigationControl());
    //var opts = {offset: new BMap.Size(150, 5)}
    //map.addControl(new BMap.ScaleControl(opts));
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl());

    map.panTo(point);
}

// 门店列表点击
DetailsController.prototype.bindShopClick = function(){
	var _t = this;
    var point; //坐标
    var marker; //图钉
    var map; // 百度地图实例

    $('#shopList li').on('click', function() {
        var _this = $(this);
		$('#shopList li.selected').removeClass("selected");
		_this.addClass("selected");
		// 更新地图
        var data = {};
        data.xpoint = _this.attr('lat');
        data.ypoint = _this.attr('long');
        data.name = _this.attr('name');
        data.address = _this.attr('address');
        _t.createMap(data);
		// 更新交通信息
		$("#spanParking").html(_this.find("#hidParking").val());
		$("#spanSubway").html(_this.find("#hidSubway").val());
		$("#spanBus").html(_this.find("#hidBus").val());
    });
	// 选中状态的门店更新地图和交通信息
	$('#shopList li.selected').click();
}

// 为门店列表项绑定事件
DetailsController.prototype.shopFilter = function() {
    var _t = this;
	// 地区筛选门店
	$("#area").change(function(){
		var companyId = $("#companyId").val();
		var areaId = $(this).val();
		$.post("/company/shop/data",{"companyId":companyId,"areaId":areaId},function(respData){
			$("#shopList").empty();
			// 更新门店数量
			$("#shopCount").html(respData.length);
			// 迭代门店列表
			if(respData.length>0){
				for(var i = 0;i<respData.length;i++){
					var shop = respData[i];
					var li = $("#shopTemplate").clone();
					$(li).attr("lat",shop.latitude);
					$(li).attr("long",shop.longitude);
					$(li).attr("address",shop.address);
					$(li).attr("name",shop.name);
					$(li).find("dl dt span").html(shop.businessHours);
					$(li).find("dl dd").html($("h1").html()+"（"+shop.name+"）");
					$(li).find("#hidParking").val(shop.parkingDetail);
					$(li).find("#hidSubway").val(shop.subwayTips);
					$(li).find("#hidBus").val(shop.busTips);
					$(li).find(".address").html(shop.address);
					$(li).removeClass("hidden");
					if(i==0){
						$(li).addClass("selected");
					}else{
						$(li).removeClass("selected");
					}
					$("#shopList").append($(li));
				}
				// 重新绑定门店点击事件
				_t.bindShopClick();
			}else{
				$("#shopList").append("<li>暂无门店</li>");
				$("#spanParking").html("暂无");
				$("#spanSubway").html("暂无");
				$("#spanBus").html("暂无");
			}
		},"json");	
	});
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function () {
    new DetailsController;
});