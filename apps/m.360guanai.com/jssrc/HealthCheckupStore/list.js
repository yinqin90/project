/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：physicalStoreList(体检中心列表)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function ListController() {
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     继承于Controller基类
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    Controller.call(this);
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     每条记录默认显示3条套餐，有个开关来展开收起全部套餐
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.switchSuits();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    地区过滤条件的事件处理
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.switchDistrictSelectPanel();
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    上拉加载更多
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.loadingMore();
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
地区过滤条件的事件处理
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ListController.prototype.switchDistrictSelectPanel = function() {
    var self = this;

    require([
        self.appStaticPrefix + "/floatWindow.min.js"
    ], function() {
        var $floatWindow = $("#selectRegionWindow");
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        加载城市地区页面
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $floatWindow.find(".float-window-body").load($floatWindow.find(".float-window-body").attr("data-source"), function() {
            require([self.appStaticPrefix + "/home/district.min.js"], function() {
                var district = new District({
                    "floatWindows": $floatWindow,
                    "popTrigger": $("#filter-panel .region"),
                    "floatWindowsHeader":$('.float-window-header'),
                    "floatWindowBody":$('.float-window-body .city-district'),
                })
            });
        });

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        首先实例化一个查看地区的浮动窗口
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        var floatWindow = new FloatWindow({
            "popTrigger": $("#filter-panel .region"),
            "floatWindows": $floatWindow
        });
    });
};
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
每条记录默认显示3条套餐，有个开关来展开收起全部套餐
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ListController.prototype.switchSuits = function() {
    $("#listContainer").delegate('.suits .switcher', 'click', function(event) {
        $(this).find("i").toggleClass("icon-xiangxia2").toggleClass("icon-xiangshang3");
        $(this).siblings(".more-suit").toggle(100);
    });
};

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
上拉加载更多
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ListController.prototype.loadingMore = function() {
    var classSelf = this;
    var $ctlMorhospitls = $("#dataLoadStatus");
    var morehcsShowed = false;

    // require([this.utilStaticPrefix+'/jquery.pullload.min.js'], function() {
    //     $('.tabs-frame').pullload({
    //         apiUrl: classSelf.hcsListApiUrl,
    //         crossDomain: true,
    //         childElementSelector: 'ul.suits',
    //         callBack: classSelf.renderHcsList,
    //         countKey:'totalCount',
    //         requestPageKey:'pageIndex'
    //     });
    // });

    if ($ctlMorhospitls.length != 0 && $ctlMorhospitls != undefined) {
        $(window).on('scroll', function() {
            var offset = $(window).height() + $(window).scrollTop();
            if (offset > $ctlMorhospitls.offset().top) {
                if (!morehcsShowed) {
                    morehcsShowed = true;
                    classSelf.getHcsList()
                }
            } else {
                morehcsShowed = false;
            }
        });
    }
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
获取数据
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ListController.prototype.getHcsList = function() {
    var classSelf = this;

    var cityId = $('#lblArea').data('cityid');
    var districtId = $('#lblArea').data('districtid');
    var miId = $('#lblMI').data('id');
    var productGroupId = $('#lblProductGroup').data('id');
    var pageIndex = parseInt($('#dataLoadStatus').data('index'));
    var pageTotalCount = parseInt($('#dataLoadStatus').data('pagecount'));

    if (pageIndex < pageTotalCount) {
        var requestData = {
            CityId: cityId,
            DistId: districtId,
            MI_Id: miId,
            ProductGroupId: productGroupId,
            pageIndex: parseInt(pageIndex) + 1
        };

        this.request(this.hcsListApiUrl, requestData, {
            showLoadingTips: false,
            process: function(data) {
                classSelf.renderHcsList(data);

                $('#dataLoadStatus').data('index', parseInt(pageIndex) + 1);
            }
        });
    } else {
        $(window).off('scroll');
        $('#dataLoadStatus').html('已经是最后一页了');
    }

}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
生成Hcs List Html
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ListController.prototype.renderHcsList = function(param) {
    var $divContainer = $('.tabs-frame');
    if (param != undefined && param.result != undefined) {
        for (var i = 0; i < param.result.length; i++) {
            $(genHcsItem(param.result[i])).appendTo($divContainer);
        }
    }

    function genHcsItem(data) {
        var htmlTpl;
        var productTpl;
        var i;
        var storeId;

        if (data != undefined) {
            storeId = data.Id;
            htmlTpl = '<a href="' + data.DetailUrl + '">';

            htmlTpl += '<dl>';
            htmlTpl += '<dt><img src="' + data.ImageUrl + '" class="lazy"></dt>';
            htmlTpl += '<dd class="caption">' + data.Name + '</dd>';
            htmlTpl += '<dd>' + data.Address + '</dd>';
            htmlTpl += '<dd><i class="iconfont icon-dingxiang2"></i><span>' + data.NewDistanceDisplay + '</span></dd>';
            htmlTpl += '</dl>'
            htmlTpl += '</a>'

            if (data.SupportProducts != undefined) {
                productTpl = '<ul class="suits">';
                for (i = 0; i < data.SupportProducts.length; i++) {
                    if (i > 2) {
                        productTpl += '<li class="more-suit">';
                    } else {
                        productTpl += '<li>';
                    }

                    productTpl += '<span class="sn">' + (i + 1) + '</span>';
                    productTpl += '<a class="name" href="/product/Details?id=' + data.SupportProducts[i].Id + '">' + data.SupportProducts[i].Name + '</a>'
                    productTpl += '<span class="current-price">￥' + data.SupportProducts[i].SalesPriceDisplayName + '</span>';
                    productTpl += '<span class="original-price">￥' + data.SupportProducts[i].SRPDisplayName + '</span>';
                    productTpl += '<a href="/Booking/Product?pId=' + data.SupportProducts[i].Id + '&sId=' + storeId + '" class="btn btn-success btn-xs pull-right">预约</a>';
                    productTpl += '</li>';
                }

                if (i > 3) {
                    productTpl += '<li class="switcher"><i class="iconfont icon-xiangxia2"></i></li>'
                };

                productTpl += '</ul>';
            };

            htmlTpl += productTpl;

        };

        return htmlTpl;
    }
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
生成HCS List Item Html
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ListController.prototype.genHcsItem = function(data) {
    var htmlTpl;
    var productTpl;
    var i;
    var storeId;

    if (data != undefined) {
        storeId = data.Id;
        htmlTpl = '<a href="' + data.DetailUrl + '">';

        htmlTpl += '<dl>';
        htmlTpl += '<dt><img src="' + data.ImageUrl + '" class="lazy"></dt>';
        htmlTpl += '<dd class="caption">' + data.Name + '</dd>';
        htmlTpl += '<dd>' + data.Address + '</dd>';
        htmlTpl += '<dd><i class="iconfont icon-dingxiang2"></i><span>' + data.NewDistanceDisplay + '</span></dd>';
        htmlTpl += '</dl>'
        htmlTpl += '</a>'

        if (data.SupportProducts != undefined) {
            productTpl = '<ul class="suits">';
            for (i = 0; i < data.SupportProducts.length; i++) {
                if (i > 2) {
                    productTpl += '<li class="more-suit">';
                } else {
                    productTpl += '<li>';
                }

                productTpl += '<span class="sn">' + (i + 1) + '</span>';
                productTpl += '<a class="name" href="/product/Details?id=' + data.SupportProducts[i].Id + '">' + data.SupportProducts[i].Name + '</a>'
                productTpl += '<span class="current-price">￥' + data.SupportProducts[i].SalesPriceDisplayName + '</span>';
                productTpl += '<span class="original-price">￥' + data.SupportProducts[i].SRPDisplayName + '</span>';
                productTpl += '<a href="/Booking/Product?pId=' + data.SupportProducts[i].Id + '&sId=' + storeId + '" class="btn btn-success btn-xs pull-right">预约</a>';
                productTpl += '</li>';
            }

            if (i > 3) {
                productTpl += '<li class="switcher"><i class="iconfont icon-xiangxia2"></i></li>'
            };

            productTpl += '</ul>';
        };

        htmlTpl += productTpl;

    };

    return htmlTpl;
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 类的初始化
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ListController;
});