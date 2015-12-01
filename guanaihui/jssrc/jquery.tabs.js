/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 插件名称：tabs
 2. 插件描述：标签页插件
 3. 版本：1.0
 4.  对其他插件的依赖：无
 5. 作者：zhaohuagang@guanaihui.com
 6. 未尽事宜：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
(function($) {
    $.fn.tabs = function(options) {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        将每个tabs加上对应的配置属性
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        var opts = $.extend({}, $.fn.tabs.defaults, options);
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         执行事件添加后返回
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        return this.each(function() {            
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
             先隐藏掉activeIndex之外的其他frame及handle
             -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            $.fn.tabs.switchTo(this, opts.handleClass, opts.activeHandleClass, opts.frameClass, opts.activeIndex, opts.effect, opts.duration);
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
             给handle的子元素赋予事件
             -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            var tabs = this;
            $(this).find("." + opts.handleClass).children().each(function(key, element) {
                $(element).on(opts.eventType, function() {
                    $.fn.tabs.switchTo(tabs, opts.handleClass, opts.activeHandleClass, opts.frameClass, key, opts.effect, opts.duration);
                });
            });

        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     定义切换到某一帧的方法
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $.fn.tabs.switchTo = function(tabs, handleClass, activeHandleClass, frameClass, index, effect, duration) {
        $(tabs).find("." + handleClass).children().removeClass(activeHandleClass);
        $(tabs).find("." + handleClass).children().eq(index).addClass(activeHandleClass);
        $(tabs).find("." + frameClass).hide();
        if(duration == "normal" || duration == "fast" || duration == "slow") eval("$(tabs).find('.' + frameClass).eq(index)." + effect + "('" + duration + "')");
        else eval("$(tabs).find('.' + frameClass).eq(index)." + effect + "(" + duration + ")") ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     tabs默认配置
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $.fn.tabs.defaults = {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         句柄容器的class名称
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        handleClass : "tabs-handle",
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         活动标签页需要加的class名称
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        activeHandleClass : "on",
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         每个标签卡内容的class名称
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        frameClass : "tabs-frame",
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         默认活动标签卡的index
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        activeIndex : 0,
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         切换的时间类型：
         1. click : 点击标签卡的时候切换
         2. mouseover : 鼠标放到标签卡上得时候切换
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        eventType : "mouseover",
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         切换效果设置，效果暂时设置为：
         1. slideDown : 向下拉下来
         2. fadeIn : 通过透明度的切换显示
         3. show : 普通显示
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        effect : "show" ,
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         切换动画持续时间，可以是整数，单位是毫秒，可以是：normal | fast | slow ，默认是""表示不需要持续时间参数
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        duration : 0
    };
})(jQuery);