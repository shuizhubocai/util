$(function() {
	
	//弹出窗的显示与隐藏
     $(".btn-service").click(function(){
     	 $(this).css("display","none");
     	 $(".doyoo_mon_mobile").css("display","block");
     	 return false;
     });
    $(".doyoo_mon_mobile .doyoo_mon_closer").click(function(){
    		$(".btn-service").css("display","block");
    	$(".doyoo_mon_mobile").css("display","none");
    	return false;
    });
    
    	//返回顶部
//  	$("html,body").animate({scrollTop: '0px'}, 800);
 	$(".to-top").css('bottom',($('.cz').height()+$('footer').height()+($(".to-top").height()/1.5))+'px');
    	$(window).scroll(function(){
    		
		var scrolltop=$(window).scrollTop();
		if(scrolltop>60){
			$(".to-top").fadeIn(400);
		}else{
			$(".to-top").fadeOut(400);
		}
	});
	
    $(".to-top").click(function(){
		$("html,body").animate({scrollTop: '0px'}, 800);
	});
	
	//底部菜单
     var element = $('.cz-inner');
     var win = $(window);
      element.css({'position':'fixed','left':'0','bottom':'0'});
        win.scroll(function() {
//      	console.log($('.cz').offset().top)
//      console.log($(document).scrollTop())
	 if ($(document).scrollTop() < $('.cz').offset().top-$(window).height() ) {
	 		element.css({'position':'fixed','left':'0','bottom':'0'});
	 	}else{
	 		element.css({'position':'relative','left':'auto','bottom':'auto'});
	 	}
        });
        
     //图片缩小
     
     $(".sub-sty .sty a").click(function(){
     	
     	var img = $(this).find("img");
     	img.css('border','1px solid #f00;');
//   	var wValue=0.8 * img.width(); 
//		var hValue=0.8 * img.height(); 
//		img.animate({
//			width: wValue,
//			height: hValue, 
////			left:(""+(0.2 * $(this).width())/2), 
////			top:(""+(0.2 * $(this).height())/2)
//});
     });
     
     
     
});

