//首页 		
var loan_index = {
	init:function(){
		this.rolling();//公告滚动
//		this.fn();
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
//	fn:function(){
//		$('a[tit]').click(function(){
//			window.location.href= $(this).attr('tit');
//		})
//	}
};
//贷款大全
	  var uid="";
	  var mobilePhone=sessionStorage.getItem("mobilePhone");
	var money="";
	var creditType=0;
	var order=0;
	var data={
	   	 page:1,
	   	 money:money,
	   	 creditType:creditType,
	   	 order:order
	   }
	
var morelist=$(".morelist");
	upajax();//获取数据
	
function upajax(){
	$.ajax({
		type:"post",
		async:false,
		dataType:"json",
        	contentType: "application/json; charset=UTF-8",
        	data:JSON.stringify(data),
		url:host+"userDiversion/home",
		success:function(res){
			uid=sessionStorage.getItem("uid");
			morelist.html("")
			let list=res.data.list;
			$(list).each(function(index){
        			let val=list[index];
        			let creditTypeId=val.creditTypeId;
        			let creditType='';
        			if(creditTypeId == 0){
        				creditType="所有贷款类型"
        			}
        			if(creditTypeId == 1){
        				creditType="小额极速贷"
        			}
        			let $li=$('<li>'+
                        '<a href="'+val.url+"&uid="+uid+"&mobilePhone="+mobilePhone+'">'+
                           '<img src="'+val.picPath+'">'+
                           '<div class="index_content_r">'+
                                '<p>'+val.title+'</p>'+
                                '<p>'+'<span class="sp2">'+val.creditInterestRate+'<span>/月</span></span>'+'</p>'+
                                '<p>'+
                                '<span class="sp1">'+"下款时间"+'</span>'+
                               '<i>'+'</i>'+val.creditLendSpeed+
                                    '<span class="sp2">可贷<span>'+val.ed+'</span>'+
                                '</p>'+
                           		 '<p class="sologan">'+val.slogan+
                           		 '</p>'+
                            '</div>'+
                        '</a>'+
                    '</li>')
						morelist.append($li)
				        		});
						}
				})
}
var intelligent ={
	init:function(){
		this.fn();
		this.fn1();
	},
	fn1:function(){
		
	},
	fn:function(){
		var _self = this;
		$('.sort .option').off('click');
		$('.sort ul.oth>li').off('click');
		$('ol li').off('click');
		$('.sort ul .cover').off('click');
		$('div.sort_btn .left').off('click');
		$('div.sort_btn .right').off('click');
		//点击筛选时 筛选信息显示和隐藏
		$('.sort .option').click(function(){
				var index = $(this).index();
				if($(this).hasClass('up')){
					$(this).removeClass('up');
					$('._show ul').hide();
					$('._show').hide();
				}else{
					$('._show ul').hide();
					$('._show ul').eq(index).show();
					$('._show').show();
					$(this).siblings('div').removeClass('up');
					$(this).addClass('up');
				}
			})
			//点击筛选时的筛选信息显示和隐藏  end
			//点击某个筛选条件进行排序  start
			$('.sort ul.oth>li').click(function(){
				var index = $(this).parent().index();
				$(this).addClass('focus').siblings('li').removeClass('focus');//选中添加对号
				$('.sort>div').removeClass('up');
				$('.sort ._show ul').hide();
				$('.sort ._show').hide();
				if(index==0){
					  money = $(this).attr('money');
				}else if(index==1){
					 creditType=$(this).attr('creditType');
				}else if(index==2){
					 order=$(this).attr('order');
				}
				$('.sort .option:eq('+index+') span').html($(this).html());
					data={
						page:1,
						money:money,
						creditType:creditType,
						order:order
					}
					upajax();
				return false;
				
			})
			//点击某个筛选条件进行排序  end
			
			//点击屏幕隐藏筛选条件
			$('.sort ul.oth .cover').click(function(){
				$('.sort ._show').hide();
				$('._show ul').hide();
				$('.sort>div').removeClass('up');
				
			})
			$('div.sort_btn .left').click(function(){
				$('.one li').removeClass('focus');
				$('.one li[need_id=0]').addClass('focus');
			})
	},
	
}
