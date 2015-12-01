/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：suitList(套餐列表)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function ListController() {
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
	继承于Controller基类
	-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	Controller.call(this);

	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
	上拉加载更多
	-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
	this.loadingMore()
};


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
上拉加载更多
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ListController.prototype.loadingMore = function() {
	var classSelf = this;
	var $ctlMorhospitls = $("#dataLoadStatus");
	var morehcsShowed = false;

	if ($ctlMorhospitls.length != 0 && $ctlMorhospitls != undefined) {
		$(window).on('scroll', function() {
			var offset = $(window).height() + $(window).scrollTop() - 100;
			if (offset > $ctlMorhospitls.offset().top) {
				if (!morehcsShowed) {
					morehcsShowed = true;
					classSelf.getProductList();
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
ListController.prototype.getProductList = function() {
	var classSelf = this;

	var versionId = $('#lblVersion').data('id');
	var cardGroupId = $('#lblCardGroup').data('id');
	var orderBy = $('#lblOrder').data('id');
	var pageIndex = parseInt($('#dataLoadStatus').data('index'));
	var pageTotalCount = parseInt($('#dataLoadStatus').data('pagecount'));

	if (pageIndex < pageTotalCount) {
		var requestData = {
			Version: versionId,
			CardGroupId: cardGroupId,
			OrderBy: orderBy,
			pageIndex: parseInt(pageIndex) + 1
		};

		this.request(this.productListApiUrl, requestData, {
			showLoadingTips: false,
			process: function(data) {
				classSelf.renderProductList(data);

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
ListController.prototype.renderProductList = function(param) {
	var classSelf = this;

	var $divContainer = $('.tabs-frame');
	if (param != undefined && param.result != undefined) {
		for (var i = 0; i < param.result.length; i++) {
			$(classSelf.genProdcutItem(param.result[i])).appendTo($divContainer);
		}
	}
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
生成HCS List Item Html
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ListController.prototype.genProdcutItem = function(data) {
		var htmlTpl;
		var productTpl;
		var i;

		if (data != undefined) {
			htmlTpl = '<a href="/Product/Detail?Id=' + data.Id + '">';

			htmlTpl += '<dl>';

			htmlTpl += '<dt><img src="' + data.ListImageUrl + '"></dt>';
			htmlTpl += '<dd class="caption">' + data.Name + '</dd>';

			htmlTpl += '<dd>';
			htmlTpl += '<span class="current-price">￥' + data.SalesPriceDisplayName + '</span>';
			htmlTpl += '<span class="original-price">|￥' + data.SRPDisplayName + '</span>';
			htmlTpl += '</dd>';

			htmlTpl += '<dd><i class="iconfont icon-biaoqian"></i> <span class="text-success">' + data.TagDisplayName + '</span></dd>';
			htmlTpl += '<dd>本月已有 <span class="arial text-danger">' + data.Quantity + '</span> 人购买</dd>';

			htmlTpl += '</dl>'

			htmlTpl += '</a>'
		};

		return htmlTpl;
	}
	/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
	类的初始化
	-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
	new ListController;
});