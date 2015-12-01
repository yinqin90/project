/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：www.guanaihui.com
 2. 页面名称：components - > servicesCategory(页面组件 -> 服务类别)
 3. 作者：赵华刚(zhaohuagang@guanaihui.com)
 4. 备注：
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
function ServicesCategory(params) {
    this.mode = (params === null || params.mode === null || params.mode === undefined) ? "hover" : params.mode ;  //下拉出菜单的模式，hover | auto ，默认为悬停下拉，如果是auto，就表示像首页这样，固定显示在页面中    
    if(this.mode === "hover") this.drop() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    鼠标悬停在分类上，内容的切换
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.swapCategory() ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    "全部服务分类"鼠标悬停下拉出菜单
     -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    this.keepVisible() ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
"全部服务分类"鼠标悬停下拉出菜单
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ServicesCategory.prototype.drop = function() {
    $(".navigator-bar dl dt").mouseover(function(){
        $(this).find(".services-category").css({ "visibility" : "visible" }) ;
    }) ;
    $(".navigator-bar dl dt").mouseout(function(){
        $(this).find(".services-category").css({ "visibility" : "hidden" }) ;
    }) ;  
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
鼠标悬停在分类上，内容的切换
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ServicesCategory.prototype.swapCategory = function() {   
   var classSelf = this ;
    $(".services-category>li>a").each(function(index, element){
        $(element).mouseover(function(){            
            $(".services-category>li>a").removeClass("on") ;
            $(this).addClass("on") ;            
            var className = $(this).find(".icon-24").attr("class").replace("white", "color") ;
            $(this).find(".icon-24").attr("class", className) ;
            $(".services-category-children").css({ "visibility" : "visible" }).height($(".services-category").height()) ;
            $(".services-category-children .tabs-frame").hide() ;
            $(".services-category-children .tabs-frame").eq(index).show() ;
        }) ;
        $(element).mouseout(function(){           
           $(this).removeClass("on") ;
            var className = $(this).find(".icon-24").attr("class").replace("color", "white") ;
           $(this).find(".icon-24").attr("class", className) ;
           $(".services-category-children").css({ "visibility" : "hidden" }) ;
        }) ;
   }) ;
} ;
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
鼠标悬停到子菜单容器上，相应第一级菜单不能隐藏，还要让相应一级菜单保持鼠标压在上面状态
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
ServicesCategory.prototype.keepVisible = function() {
    var classSelf = this ;
    $(".services-category-children").mouseover(function(){
        $(this).css({ "visibility" : "visible" }) ;
        $(".services-category").css({ "visibility" : "visible" }) ;
        var hoverIndex = null ;
        $(this).find(".tabs-frame").each(function(index, element){
            if($(this).is(":visible")) hoverIndex = index ;
        }) ;
        $(".services-category>li>a").eq(hoverIndex).trigger("mouseover") ;
    }) ;
    $(".services-category-children").mouseout(function(){
        $(this).css({ "visibility" : "hidden" }) ;
        if(classSelf.mode === "hover") $(".services-category").css({ "visibility" : "hidden" }) ;        
    }) ;
} ;