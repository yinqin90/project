/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：map(门店地址)
 3. 作者：赵华刚(liuchangkui@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function MapController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);

    // 初始化地图
    this.initMap();
};
MapController.prototype.initMap = function() {
    
        var longitude = $('#hdLong').val(); //yPoint
        var latitude = $('#hdLat').val(); //xPoint
        var tel = $('#hdTel').val(); //电话
        var name = $('#hdName').val(); //名称
        var address = $('#hdAddress').val(); //地址
       
        // 数据
        var data = {
                xpoint: latitude,
                ypoint: longitude,
                name: name,
                tel: tel,
                address: address
            }
            // 百度地图API
        var map = new BMap.Map("baiduMapContainer"); // 创建Map实例
        var point = new BMap.Point(data.xpoint, data.ypoint);
        map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别
        var marker = new BMap.Marker(point); // 在指定的经纬度地方打图钉 
        map.addOverlay(marker); // 将图钉添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
        var propStyle = "style='float:left;width:60px;font-weight:500;padding:3px 0px;'";
        var valueStyle = "style='margin-left:60px;padding:3px 0px;'";
        var infoWindow = new BMap.InfoWindow(
            "\
            <dl>\
                <dt " + propStyle + ">机构名称：</dt>\
                <dd " + valueStyle + ">" + data.name + "</dd>\
            </dl>\
            <dl>\
                <dt " + propStyle + ">联系方式：</dt>\
                <dd " + valueStyle + ">" + data.tel + "</dd>\
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

    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     类的初始化
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new MapController;
});