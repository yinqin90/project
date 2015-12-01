/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：m.360guanai.com
 2. 页面名称：城市区域选择
 3. 作者：俞晓晨(yuxiaochen@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

function District(params) {
	this.floatWindows = params.floatWindows;
	this.popTrigger = params.popTrigger;
	this.floatWindowsHeader = params.floatWindowsHeader;
	this.floatWindowBody = params.floatWindowBody;

	this.bind();
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
事件绑定
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
District.prototype.bind = function() {
	var self = this;
	var selector, top;
	var $firstCity;
	var $wordIndexLis = $('.city-index a');
	var $cityLis = $('.city-list');

	//初始化scrollWindow 的height
	$(self.floatWindowBody).height($(self.floatWindows).height() - $(self.floatWindowsHeader).height() - 10);


	$wordIndexLis.on('click', function() {
		var _this = $(this);
		$(self.floatWindowBody).scrollTop(0); //clear scrollTop;
		seletor = "li[data-href='" + _this.data('href') + "']";
		$firstCity = $($cityLis.find(seletor)[0]);
		if ($firstCity != undefined) {
			top = $firstCity.offset().top - $(self.floatWindowBody).height() + 100;
			$(self.floatWindowBody).animate({
				scrollTop: top
			}, 300);
		};
	});

	$(self.popTrigger).click(function(event) {
		var _this = $(this);
		$(self.floatWindowBody).scrollTop(0);
		selector = "li[data-id='" + _this.data('cityid') + "']";
		$firstCity = $($cityLis.find(selector)[0]);
		if ($firstCity != undefined) {
			top = $firstCity.offset().top - $(self.floatWindowBody).height() + 100;
			$(self.floatWindowBody).scrollTop(top)
		};
	});

	$('#selectRegionWindow').find('ul.city-list,.hot-city').find("a[data-href]").on('click', function() {
		$(self.floatWindows).animate({
			left: "-100%"
		}, 200);
		$(document.body).css({
			"overflow": "auto"
		});

		window.location.href = $(this).data('href');
	});

}