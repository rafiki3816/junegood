$(document).ready(function(){
	
	$(".prev_arrow").click(function(){
		$(".thumbnails>li").eq(0).insertAfter(".thumbnails>li:last-child");
	});

	$(".next_arrow").click(function(){
		$(".thumbnails>li").eq(3).insertBefore(".thumbnails>li:first-child");
	});

	$(".thumbnails .s1").click(function(){
		$("iframe").removeClass("on");
		$("iframe.a1").addClass("on");
	});
	$(".thumbnails .s2").click(function(){
		$("iframe").removeClass("on");
		$("iframe.a2").addClass("on");
	});
	$(".thumbnails .s3").click(function(){
		$("iframe").removeClass("on");
		$("iframe.a3").addClass("on");
	});
	$(".thumbnails .s4").click(function(){
		$("iframe").removeClass("on");
		$("iframe.a4").addClass("on");
	});

	

	// homebutton 

	$("header>h1").on("mouseover",function(){
		$("header>h1>a>img").attr("src","images/logo1.png");
	});

	$("header>h1").on("mouseleave",function(){
		$("header>h1>a>img").attr("src","images/logo.png");
	});
	
	
});