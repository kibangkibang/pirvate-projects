$(document).ready(function(){
	$('.playlist').each(function(){
		if($(this).position().top+120<$(window).scrollTop()+$(window).height()){
			$(this).animate({opacity:1},'slow');
			var grade = $(this).find('.grade-gray').children('.grade').text();
			var wd = $(this).find('.grade-gray').width();
			$(this).find('.grade-blue').animate({'width':wd * (grade/10)},'slow');
			
		}
	});
	$(window).on('scroll',function(){
		$('.playlist').each(function(){
			if($(this).position().top+120<$(window).scrollTop()+$(window).height()){
				$(this).animate({opacity:1},'slow');
				var grade = $(this).find('.grade-gray').children('.grade').text();
				var wd = $(this).find('.grade-gray').width();
				$(this).find('.grade-blue').animate({'width':wd * (grade/10)},'slow');
			}
		});
	});
	$(window).on('scroll',function(){
		if($(window).scrollTop()+$(window).height() == 3418){
			$('.to-top-btn').fadeIn();
		}else{
			$('.to-top-btn').fadeOut();
		}
	});
	$('.to-top-btn').on('click',function(){
		$('html,body').animate({scrollTop:0},1000);
	});
	$('.reserve').each(function(){
		var name = $(this).attr('name');
		console.log(name);
		$(this).on('click',function(){
			location.href = '/reserve/' + name; 
		});
	});
});