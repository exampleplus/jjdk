//首页 		
var loan_index = {
	init:function(){
		this.rolling();//公告滚动
		this.fn();
	},
	//公告滚动
	rolling:function (){
		var h = $('.index_message ul').height();
		var el = $('.index_message li:eq(0)').clone();
	  	$('.index_message ul').append(el);
	  	var i =0;
	  	setInterval(function(){
	  		i=i-28;
	  		$('.index_message ul').css('transition','all 0.5s');
	  		$('.index_message ul').css('margin-top',(i+'px'));
	  		if(-i>=h){
	  			i=0;
	  			setTimeout(function(){
	  				$('.index_message ul').css('transition','all 0s');
	  				$('.index_message ul').css('margin-top',0);
	  			},500)
	  		}
	  	},3000)
	},
	fn:function(){
		$('a[tit]').click(function(){
			window.location.href= $(this).attr('tit');
		})
	}
};