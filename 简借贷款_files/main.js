//上拉加载公共
var iscrollAdd = {
	init:function(that){
		var _this = this;
		_this.iscrollGo(myScroll,that);
	},
	iscrollGo:function(Element,obj){
		var _this = this;
		var pullUpEl =$('#pullUp').get(0);
		var pullUpOffset =51;
		Element.on("scrollEnd",function(){
    		console.log(obj.param.page);
    		console.log(this.y);
    		console.log(this.maxScrollY);
    		if(this.y<this.maxScrollY+40){
		  		if(obj.param.page<obj.pageSum){
		  			if(obj.judge){
						obj.judge=false;
	    				obj.param.page++;
	    				console.log('加载');
		    			_this.upAjax(obj);
		  			}
		  		}
			}
		    
		});
	},
	upAjax:function (obj,num,fn){
		var _this = this;
		$.ajax({
			type:"post",
			url:obj.URL,
			async:true,
			dataType:'json',
			data:obj.param,
			success:function(resp){
				console.log(obj.param);
				console.log(resp);
				obj.judge=true;
				if(fn){
					fn()
				};
				if(num==0||num==1){
					obj.addhtml(resp,num);
				}else{
					obj.addhtml(resp);
				}
			},
			beforeSend:function(){
				
			},
		});
	},
};
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
//信用卡
var card ={
	param:{page:1},
	pageSum:0,
	judge:true,
	URL:'',
	init:function(){
		var _this =this;
		this.pageSum = totalPage;
		this.URL = _url;
		this.fn();
		loan_index.fn1();
		iscrollAdd.init(_this);
		
	},
	addhtml:function(resp,isflag){
		
		this.pageSum=resp.list.hotCreditTotal;
		if(this.pageSum-1>0){
				if(this.pageSum>this.param.page){
					$('.pullUp_zhanwei').show();
				}else{
					$('.pullUp_zhanwei').hide();
					
				}
		}else{
				$('.pullUp_zhanwei').hide();
				$('#pullUp').hide();
		};
		
		
		
		//以下 待做处理
		var arr = resp.list.hotCreditList;
		
		if(arr){
			var str='';
			for(var i=0;i<arr.length;i++){
				str += '<li><a href="javascript:;" tit="'+arr[i]['default_url']+'" needid="'+arr[i]['id']+'"><img src="'+arr[i]['logo']+'"/><div class="right"><p>'+arr[i].card_name
				+'</p><p>'+arr[i].desc+'</p><p><span>'+arr[i].click_num+'</span>人已申请</p></div></a></li>';
			}		
			
			$('#scroller ul').append(str);
			
			$('.g_load').hide();
			$('.capacity').show();
			myScroll.refresh();
		}
	},
	fn:function(){
				
		$('.bank_list').on('click','a',function(){
			
			var card_id=$(this).attr('needid');
			var gourl = $(this).attr('tit');
			$.ajax({
				type:"get",
				url:clickUrl,
				async:true,
				data:{card_id:card_id},
				success:function(){
					
				}
			});
			
			window.location.href=gourl;
			
		})
	}
};
// 征信列表页  上啦  加载
//预留   代码    推荐平台多个
var moreList= {
	param:{page:1},
	pageSum:0,
	judge:true,
	URL:'',
	init:function(){
		var _this =this;
		this.pageSum = totalPage;
		this.URL = _url;
		iscrollAdd.init(_this);
	},
	addhtml:function(resp){
		console.log(resp);
		var str = '';
		this.pageSum =resp.data.total_page;
		if(this.pageSum-1>0){
				if(this.pageSum-0>this.param.page-0){
					$('.pullUp_zhanwei').show();
				}else{
					$('.pullUp_zhanwei').hide();
				}
		}else{
				$('.pullUp_zhanwei').hide();
		};
		var arr = resp.data.list;
		for(var i=0;i<arr.length;i++){
			str+='<li><a href="'+arr[i].url+'"><div class="left"><img src="'+arr[i].logo+'"/></div><span class="title">'+arr[i].loanname+'</span><p>'+arr[i].limu_desc1+'</p><p>'+arr[i].limu_desc2+'</p></a></li>';
		};
		$('ul').append(str);
		myScroll.refresh();
	}
}
//详情 
var detail ={
	init:function(){
		//返回时  修改资金 回复到页面内
		if(sessionStorage['money'+ID]){
			$('header .left input').val(sessionStorage['money'+ID]);
			if($('header .left').hasClass('focus2')){
				$('header .left .chose span').attr('need_id',sessionStorage['money'+ID]);
				$('header .left .chose span').html(sessionStorage['money'+ID]);
			}
			sessionStorage.removeItem('money'+ID);
		};
		this.fn();
	},
	fn:function(){
		var _this;
		$('.capacity1 .right span').on('click',function(){
			_this = this;
			$('.selInfo_content .top1').show();
			$('.selInfo_content').show();
		});
		$('.selInfo_content .bottom').click(function(){
				$('.selInfo_content').hide();
				$('.selInfo_content .top').hide();
		});
		$('.selInfo_content .sel_cover').click(function(){
			$('.selInfo_content').hide();
			$('.selInfo_content .top').hide();
		});
		$('.selInfo_content .top p').click(function(){
			
			$(_this).html($(this).html());
			$(_this).attr('need_id',$(this).attr('need_id'));
			$('.selInfo_content').hide();
			$('.selInfo_content .top').hide();
		});
		$('.capacity1 .left span').on('click',function(){
			_this = this;
			$('.top2').show();
			$('.selInfo_content').show();
		});
		$('header .left input').on('input propertychange',function(){
			var num = $(this).val();
			if(num!=''){
				num = parseInt(num.replace(/\D/g, ''));
				if(num){
					$(this).val(num);
					
				}else{
					$(this).val('');
				}
			}
		});	
		
		$('.detail_btn_btn').click(function(){
			
			var Val = $('header .left input').val()-0;
			if($('header .left').hasClass('focus2')){
				Val = $('header .left .chose span').attr('need_id');
			}
			if(Val>=minNum&&Val<=maxNum){
				
			}else{
				POP_g('请输入借款金额('+minNum+'-'+maxNum+'元)',function(num){},['确定']);
				return false;
			}; 
			$.ajax({
				type:"post",
				url:URL1,
				async:true,
				data:{loan_id:loan_id,prod_id:ID},
				success:function(resp){
					
				}
			});
			var status = $('input[name=status]').val();			
			if(testState){
				if(userState){
					if(status==2){
						window.location.href= URL2+'?id='+ID;
					}else if(status==1){
						window.location.href= URL3+'?id='+ID;	
					}else{
						window.location.href= URL+'?id='+ID+'&loan_id='+loan_id+'&money='+Val+'&deadline_type='+deadline_type+'&deadline='+deadline+'&term='+$('header .right span').html()+'&need_id='+$('header .right span').attr('need_id')+'&minMoney='+minNum+'&maxMoney='+maxNum;		
					}
				}else{
						window.location.href= URL+'?id='+ID+'&loan_id='+loan_id+'&money='+Val+'&deadline_type='+deadline_type+'&deadline='+deadline+'&term='+$('header .right span').html()+'&need_id='+$('header .right span').attr('need_id')+'&minMoney='+minNum+'&maxMoney='+maxNum;		
					
				}
				
			}else{
				if(status==2){
					window.location.href= URL2+'?id='+ID;
				}else if(status==1){
					window.location.href= URL3+'?id='+ID;							
				}else{
					window.location.href= URL+'?id='+ID+'&loan_id='+loan_id+'&money='+Val+'&deadline_type='+deadline_type+'&deadline='+deadline+'&term='+$('header .right span').html()+'&need_id='+$('header .right span').attr('need_id')+'&minMoney='+minNum+'&maxMoney='+maxNum;	
				}
			}
			

			
			
		})
		
		
		
	},
}
//智能匹配
var intelligent ={
	param:{page:1,money:"",is_credit:"",repay_type:"",attr_id:"",order:'',recommend:'',cid:'',money_range:''},
	pageSum:0,
	judge:true,
	URL:'',
	arr:[],
	init:function(){
		var _this =this;
		loan_index.fn1();
		if(page_flag!=''){
			this.param.recommend=page_flag;
		}
		
		this.pageSum = 1;
		this.URL = _url;
		_this.param.money = sessionStorage.money;
		if(myMoney!=''){
			_this.param.money =myMoney;
			
		};
		if(myMoney=='a'){
			_this.param.money = '';
			sessionStorage.money='';

		};
		
		_this.param.cid = cid;

		
		if(cid=='0'){
			if(_this.param.money != ''){
				$('.capacity .left span').html(_this.param.money);
			};
		}else{
			if(_this.param.money_range != ''){
				$('.capacity .left span').html(_this.param.money_range);
			};
		}
		
		this.fn();
		this.fn1();
//		this.oth();
		if(sessionStorage.sort_flag){
			sessionStorage.removeItem('sort_flag');
			this.getLoS();
		}else{
			sessionStorage.removeItem('_money');
			sessionStorage.removeItem('is_credit');
			sessionStorage.removeItem('repay_type');
			sessionStorage.removeItem('attr_id');
			sessionStorage.removeItem('order');
			sessionStorage.removeItem('recommend');
			sessionStorage.removeItem('money_range');
		};
		
		
		
		
		iscrollAdd.upAjax(_this,1);
		iscrollAdd.init(_this);
	},
	loS:function(){
		sessionStorage._money = this.param.money;
		sessionStorage.is_credit = this.param.is_credit;
		sessionStorage.repay_type = this.param.repay_type;
		sessionStorage.attr_id = this.param.attr_id;
		sessionStorage.order = this.param.order;
		sessionStorage.recommend = this.param.recommend;
		sessionStorage.money_range = this.param.money_range;
	},
	getLoS:function(){
		if(sessionStorage._money){
			this.param.money = sessionStorage._money;
			this.param.is_credit = sessionStorage.is_credit;
			this.param.money_range = sessionStorage.money_range;
			if(this.param.is_credit==''){
				$('.capacity .sort>div:nth-of-type(1) span').html('<span>不限<i></i></span>');
				$('.chose1 li:eq(0)').addClass('focus').siblings().removeClass('focus'); 
			}else if(this.param.is_credit==1){
				$('.capacity .sort>div:nth-of-type(1) span').html('<span>有信用卡<i></i></span>');
				$('.chose1 li:eq(1)').addClass('focus').siblings().removeClass('focus'); 
				
			}else if(this.param.is_credit==0){
				$('.capacity .sort>div:nth-of-type(1) span').html('<span>无信用卡<i></i></span>');
				$('.chose1 li:eq(2)').addClass('focus').siblings().removeClass('focus'); 
				
			}
			
			this.param.repay_type = sessionStorage.repay_type;
			if(this.param.repay_type==''){
				$('.capacity .sort>div:nth-of-type(2) span').html('<span>不限<i></i></span>');
				$('.chose2 li:eq(0)').addClass('focus').siblings().removeClass('focus'); 
			}else if(this.param.repay_type==1){
				$('.capacity .sort>div:nth-of-type(2) span').html('<span>分期还款<i></i></span>');
				$('.chose2 li:eq(1)').addClass('focus').siblings().removeClass('focus'); 
				
			}else if(this.param.repay_type==0){
				$('.capacity .sort>div:nth-of-type(2) span').html('<span>到期还款<i></i></span>');
				$('.chose2 li:eq(2)').addClass('focus').siblings().removeClass('focus'); 
			}
			
			
			this.param.attr_id = sessionStorage.attr_id;
			if(this.param.attr_id!=''){
				var attr_idArr = this.param.attr_id.split(',');
				for(var i=0;i<attr_idArr.length;i++){
					$('[need_id='+attr_idArr[i]+']').addClass('focus').siblings().removeClass('focus');
					
				}
				if($('._content .top p.focus').html()!='不限'){
					$('.capacity .right span').html($('._content .top p.focus').html())
				}
				
				
			}
			this.param.order = sessionStorage.order;
			if(this.param.order==''){
				$('.capacity .sort>div:nth-of-type(3) span').html('<span>默认排序<i></i></span>');
				$('.chose3 li:eq(0)').addClass('focus').siblings().removeClass('focus'); 
			}else if(this.param.order==('pass_rate desc'||'rate')){
				$('.capacity .sort>div:nth-of-type(3) span').html('<span>通过率<i></i></span>');
				$('.chose3 li:eq(1)').addClass('focus').siblings().removeClass('focus'); 
				
			}else if(this.param.order==('orderby1 desc'||'lend_time')){
				$('.capacity .sort>div:nth-of-type(3) span').html('<span>放款速度<i></i></span>');
				$('.chose3 li:eq(2)').addClass('focus').siblings().removeClass('focus'); 
				
			}
			this.param.recommend = sessionStorage.recommend;
		}
	}
	,
	fn1:function(){
		var _self =this;
		$('.capacity .right span').on('click',function(){
			var _this = this;
			$('.selInfo_content1').show();
			$('.selInfo_content1 .bottom').click(function(){
				$('.selInfo_content1').hide();
			})
			$('.sel_cover').click(function(){
				$('.selInfo_content1').hide();
			})
			
		});
		$('.selInfo_content1 .top p').click(function(){
				$(this).addClass('focus').siblings().removeClass('focus');
				$('.capacity .right span').html($(this).html());
				$('.selInfo_content1').hide();
				_self.getID();
				_self.param.page=1;
				
				_self.loS();
				iscrollAdd.upAjax(_self,1);
				return false;
			})
		$('.capacity .left span').on('click',function(){
			var _this = this;
			$('.selInfo_content2').show();
			$('.selInfo_content2 .bottom').click(function(){
				$('.selInfo_content2').hide();
			})
			$('.sel_cover').click(function(){
				$('.selInfo_content2').hide();
			})
			
		});
		$('.selInfo_content2 .top p').click(function(){
				var g_num = $(this).html();
				$(this).addClass('focus').siblings().removeClass('focus');
				$('.capacity .left span').html(g_num);
				$('.selInfo_content2').hide();
				
				
				_self.getID();
				_self.param.page=1;
				
				if(cid!='0'){
					_self.param.money_range=$('.selInfo_content2 .top p.focus').attr('need_id');
					if(_self.param.money_range=='0'){
						_self.param.money_range='';
					}
				}else{
					if(g_num=='不限'){
						g_num=0;
					};
					_self.param.money=parseInt(g_num);
				};
				
				
				if(_self.param.money=='0'){
					_self.param.money='';
				}
				document.cookie=('money_value='+_self.param.money);
				_self.loS();
				iscrollAdd.upAjax(_self,1);
				return false;
			})
	},
	fn:function(){
		var _self = this;
		
		$('.sort .option').off('click');
		$('.sort ul.oth>li').off('click');
		$('ol li').off('click');
		$('.sort ul .cover').off('click');
		$('div.sort_btn .left').off('click');
		$('div.sort_btn .right').off('click');
		
		$('.sort .option').click(function(){
				var index = $(this).index();
				
				
				if($(this).hasClass('up')){
					$(this).removeClass('up');
					$('_show ul').hide();
					$('._show').hide();
				}else{
					if(index==3){
//						console.log(1)
					}else{
//						console.log(0)
					}
					$('._show ul').hide();
					$('._show ul').eq(index).show();
					$('._show').show();
					
					$(this).siblings('div').removeClass('up');
					$(this).addClass('up');
				}
				
			})
		
			$('.sort ul.oth>li').click(function(){
				var index = $(this).parent().index();
				$(this).addClass('focus').siblings('li').removeClass('focus');
				$('.sort>div').removeClass('up');
				$('.sort ._show ul').hide();
				$('.sort ._show').hide();
				
				if(index==0){
					_self.param.is_credit=$(this).attr('credit');
				}else if(index==1){
					_self.param.repay_type=$(this).attr('repayType');
				}else if(index==2){
					
					_self.param.order=$(this).attr('order');
//					if(cid==''){
//						if(_self.param.order=='rate SORT_DESC'){
//							_self.param.order='pass_rate desc';
//						}else if(_self.param.order=='lend_time SORT_DESC'){
//							_self.param.order='orderby1 desc';
//						}else if(_self.param.order==''){
//							_self.param.order='';
//						}
//					}
				}
				
				$('.sort .option:eq('+index+') span').html($(this).html());
				_self.param.page=1;
				_self.loS();
				iscrollAdd.upAjax(_self,1);
				return false;
			})
			$('ol li').click(function(){
				$(this).siblings().removeClass('focus');
				$(this).addClass('focus');
				return false;
			})
			$('.sort ul.oth .cover').click(function(){
				$('.sort ._show').hide();
				$('._show ul').hide();
				$('.sort>div').removeClass('up');
				
			})
			$('div.sort_btn .left').click(function(){
				$('.one li').removeClass('focus');
				$('.one li[need_id=0]').addClass('focus');
			})
			var g_flag = true;
			$('div.sort_btn .right').click(function(){
				if(g_flag){
					$(this).html('筛选中···');
					g_flag=false;
					_self.getID();
					_self.param.page=1;
					_self.loS();
					iscrollAdd.upAjax(_self,1,function(){
						$('._show').hide();
						$('.sort .option').removeClass('up');
						g_flag=true;
						$('div.sort_btn .right').html('完成');
					});
				}
				
				
			})
	},
	getID:function(){
		var str = $('.selInfo_content1 .top p.focus').attr('need_id')=='0'?'':$('.selInfo_content1 .top p.focus').attr('need_id');
		if(str!=''){
			str = str+','
		}
		$('.one li.focus').each(function(index,item){
			str+=($(item).attr('need_id')=='0'?'':($(item).attr('need_id')+','));
		});
		this.param.attr_id= str.substr(0,str.length-1);
	},
	addhtml:function(resp,isflag){
		this.pageSum=resp.total;
		if(this.pageSum-1>0){
				if(this.pageSum>this.param.page){
					$('.pullUp_zhanwei').show();
				}else{
					$('.pullUp_zhanwei').hide();
					
				}
		}else{
				$('.pullUp_zhanwei').hide();
				$('#pullUp').hide();
		}
		$('#pullUp').removeClass();
		$('.pullUpLabel').html('加载更多...');
		
		var need_money = $('.capacity .left input').val();
		var arr = resp.data;
		if(arr){
			var str='';
			for(var i=0;i<arr.length;i++){
				str += '<li><a href="'+arr[i].url+'"><img src="'+arr[i].logo+'"><div class="index_content_r"><p>'+arr[i].name+'</p><p>申请人数：<span class="sp1">'+
				arr[i].stat_pu+'人</span><span class="sp2">'+arr[i].rate+'<span>/'+arr[i].rate_type+'</span></span></p><p><span class="sp1">'+arr[i].tag+'</span><i></i>'+
				arr[i].loan_time+'放款<span class="sp2">可贷<span>'+arr[i].money+'</span>元</span></p></div></a></li>';
			}		
			if(!!isflag){
				$('#scroller ul').empty();
			}
			$('#scroller ul').append(str);
			
			$('.g_load').hide();
			$('.capacity').show();
			myScroll.refresh();
		}
	}
}

//indexFocus判断焦点所处位置
//param  需提交信息
			
var login = {
	sub_flag:true,
	flag1:false,
	timer:'',
	param:{code:'',phone:'',invitecode:'',passWord:''},
	indexFocus:0,
	init:function(){
		var _this = this;

		this.testNum();
		this.sub();
		$('.img_code_box img').on('click',function(){_this.changeImg()});
		
		
		$('.loginType>div').click(function(){
			if(!$(this).hasClass('focus')){
				$('input').val('');
				$(this).addClass('focus').siblings().removeClass('focus');
				if($(this).hasClass('code')){
					_this.indexFocus=0;
					$('.login .left').show();
					$('.login .right').hide();
				}else{
					_this.indexFocus=1;
					$('.login .left').hide();
					$('.login .right').show();
				}
			}
		});
		
	},
	testNum:function(){
		var _self=this;
		var flag = true;
		$('.countDown').click(function(){
			var _this =this;
			_self.fn();
			if(_self.flag1){
				return false;
			};
			_self.changeImg();
			$('input[name=imgCode]').val('');
			$('input').blur();
			$('.img_code_box').show();
		});
		
		$('.code_cover').click(function(){
			$('.img_code_box').hide();
		});

		$('.codebottom').click(function(){
			var _this = this;
			var imgCode = $('input[name=imgCode]').val();
			_self.fn();
			if(_self.flag1){
				return false;
			};
			if(imgCode==''){
				_self.tips('请填写图片中的内容');
				return false;
			}
			if(!flag){
				return false;
			}
			flag=false;
			$('.img_code_box').hide();
			
			// 倒计时
			var count = 60;		
			$('.countDown').addClass('focus');
			$('.countDown').html(count);
			var timer = setInterval(function(){
				count--;
				$('.countDown').html(count);
				if(count==0){
					flag=true;
					clearInterval(timer);
					$('.countDown').removeClass('focus');
					$('.countDown').html('获取验证码');
				}
			},1000)		
			
			$.ajax({
				type:"post",
				url:URL,
				async:true,
				dataType:'json',
				data:{phone:$('.left .phone').val(),img_code:imgCode,code_id:code_id,type:type},
				success:function(resp){
					if(resp.code!=0){
						flag=true;
						_self.tips(resp.msg);
					}
				},
				error:function(){
					flag=true;
					_self.tips('提交失败，请重新提交');
				}
			});
			
			return false;
		});
	},
	fn:function(){
		var _this = this;
		var reg =/^13[\d]{9}$|^14[0-9]{1}\d{8}$|^15[^4]{1}\d{8}$|^17[0-9]{1}\d{8}$|^18[\d]{9}$/;
		
		_this.param.phone = (_this.indexFocus==0?$('.left .phone').val():$('.right .phone').val());
		
		if(!reg.test(_this.param.phone)){
			_this.tips('请填写正确的手机号');
			_this.flag1 = true;
			return false;
		}else{
			_this.flag1 = false;

		}
	},
	sub:function(){
		
		var _this = this;
		var timer;
		if(_this.sub_flag){
			_this.sub_flag=false;
			$('.login_btn').click(function(){
//				var param={code:'',phone:'',invitecode:''};
				_this.fn();
				if(_this.flag1){
					_this.sub_flag=true;
					return false;
				}

			if(_this.indexFocus==0){
				_this.param.code =$('.testNum').val();
				if(_this.param.code==''){
					_this.tips('验证码不能为空');
					_this.sub_flag=true;
					
					return false;
				}
				
				_this.param.invitecode=$('.inv').val();
				_this.param.passWord='';
			}else{
				_this.param.passWord =$('.password').val();
				if(_this.param.passWord==''){
					_this.tips('密码不能为空');
					_this.sub_flag=true;
					return false;
				}
				var passflag = test.init([['Pass1',_this.param.passWord]])
				if(!passflag){
					return false;
				}
				_this.param.invitecode='';
				_this.param.code='';
			}
				
				_this.param.code_id=code_id; 
				if(_this.param.code_id==1){
					$('.login_btn').html('登录中···');
				}else{
					$('.login_btn').html('验证中···');
				}
				
				
				
				$.ajax({
					async:true,
					data:_this.param,
					type:'post',
					dataType:'json',
					url:URL1,
					success:function(resp){
						if(_this.param.code_id==1){
							if(resp.code==0){
								if(resp.user_info.is_set_pwd==1){
									window.location.href=setPass+'?user_id='+resp.user_info.user_id+'&invitecode='+resp.user_info.invitecode;
								}else{
									sessionStorage.is_login=1; 
									if(resp.url){
										location.replace(resp.url+'#'+Math.random());
									}else{
										window.history.go(-1);
									}
								}																
							}else{
								$('.login_btn').html('登录');
								
								_this.sub_flag=true;								
								_this.tips(resp.msg);
								
							}
						}else{
							if(resp.code==0){
								window.location.href=setURL+'?user_id='+resp.user_id;
							}else{
								$('.login_btn').html('验证');
								
								_this.sub_flag=true;								
								_this.tips(resp.msg);
								
							}
						}
						
						
					},
					error:function(){
						
						if(_this.param.code_id==1){
							$('.login_btn').html('登录');
							_this.tips('登录错误');
						}else{
							$('.login_btn').html('验证');
							_this.tips('验证错误');
						}
						_this.sub_flag=true;						
						
					}
				})			
			})
		}
	},
	tips:function(msg){
		var _this = this;
		$('.login .tip').html(msg).show();
		clearTimeout(_this.timer);
		_this.timer = setTimeout(function(){
			$('.login .tip').hide();
		},2000)
		_this.changeImg();
	},
	changeImg:function(){
		var src = $('.img_code img').attr('src');
		$('.img_code img').attr('src',src);
	}
}
//运营商查询
var operators= {
	requestNum:0,
	smsStyle:0,
	star:0,
	param:{},
	flag:true,
	flag1:true,
	smsMsg:'',
	timer:'',
	init:function(){
		
		this.fn();
//		this.getStatus();
	},
	fn:function(){
		var that = this;
		$('.operators').on('focus','input',function(){
			$(this).parent('label').addClass('focus');
		});
		$('.operators').on('blur','input',function(){
			$(this).parent('label').removeClass('focus');
		});


		$('.checkbox').click(function(){
			$(this).toggleClass('focus');
		});
		
		$('.step1 input[name=mobile]').on('change',function(){
			var _val = $(this).val();
			
			var flag =  test.init([['Phone',_val,'请输入正确手机号']]);
			if(!flag){
				return false;
			};
			that.getStatus(_val);
		});
		
		$('.step1 ._btn').click(function(){
			//arr1 二维数组
			//arr2  数组 对应的值;
			var param  ={};
			if(that.requestNum==3){
				test._tips('提交失败');
				setTimeout(function(){
					window.location.reload();
				},1000);
				return false;
			};
			var arr1=[];
			$('.step1 label input').each(function(index,item){
			
				var arr2=[];
				arr2[0] = $(item).attr('test')?$(item).attr('test'):'Empty';
				arr2[1] = $(item).val();							
				arr1.push(arr2);
				param[$(item).attr('name')] = $(item).val();
			});
			var flag = test.init(arr1);
			if(!flag){
				return false;
			//判断是否选中
			};
			if($('.checkbox').hasClass("focus")){
				test._tips('请同意服务协议');
				return false;
			};
			//提交参数	
			param.star = that.star;
			that.param = param;
			that.fn1Sub();
			return true;
		});
		
		$('.step2 ._btn').click(function(){
			var code = $('.step2 div.focus input').val();
			var flag =  test.init([['Empty',code,'请输入正确验证码']]);
			if(!flag){
				return false;
			};
			//提交验证码
			that.param.code=code;
			that.fn2Sub();
			return true;
		});			
		// 倒计时   激活
		$('.num').click(function(){
			if($(this).hasClass('focus')){
				$(this).removeClass('focus');
				that.fn1Sub();
			};
			return true;
		});
		
	},
	objHtml:{
		idCard:'<label class="idCard"><input type="text" name="identityCardNo" test="Card" placeholder="请输入身份证号码" /></label>',
		servicePass:'<label class="servicePass"><input type="password" test="Empty" name="kfpassword" placeholder="请输入客服密码" /></label>'
	},
	getStatus:function(num){
		var that =this;
		//第四次请求失败  直接flase;提交时给出错误提示
		if(that.requestNum==3){
			return false;
		};
		//提交手机号
		$.ajax({
            type: "get",
            url:mobileAreaUrl,
            data: {mobile:num},
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (resp) {
                //判断执行  fn1   fn2  fn3  那个？
                console.log(resp);
                if(resp.code==0){
                	that.smsStyle =resp.data.sms;
                	that.smsMsg=resp.data.smsMsg;
					that.fn1(resp.data.star);
                }else{
                	test._tips(resp.msg);
                }
            },
            error: function () {
//             console.log(msg);
				that.requestNum++;
				that.getStatus(num);	
            }
		 });
	},
	fn1:function(star){
		var that = this;
		//组合输入框
		var strhtml = '';
		that.star = star;
		if(star==1){
			strhtml = this.objHtml.idCard;
		}else if(star==2){
			strhtml = this.objHtml.servicePass;
		}else if(star==3){
			strhtml = this.objHtml.idCard+this.objHtml.servicePass;
		}

		$('.inp').append(strhtml);
	},
	fn1Sub:function(){
		var that =this;
		if(!that.flag){
			return false;
		};
		that.flag=false;
		
		if(!that.param.code){
			$('.g_load').show();
		};
		//提交手机号  身份证   验证结果
		delete that.param.code;
		
		$.ajax({
			type:"post",
			url:fn1SubUrl,
			data:that.param,
			async:true,
			dataType: "json",
			timeout : 120000, //超时时间设置，单位毫秒
			success:function(resp){
				that.flag=true;
				console.log(resp);
				$('.g_load').hide();
				if(resp.code==0){
					
					that.param.token=resp.token;
					if(resp.sms==0){
						that.smsStyle=3
					};
					that.fn2();
				}else{
					test._tips(resp.msg);
				}
			},
			error:function(resp){
				that.flag=true;
				console.log(resp);
				test._tips('请求失败');
				$('.g_load').hide();
			}
		});
	},
	fn2:function(){
		var that = this;
		$('.caution').html(that.param.smsMsg);
		if(that.smsStyle==0){
			$('.inp1').addClass('focus');
			$('.inp2').removeClass('focus');
			that.countDown();
		}else if(that.smsStyle==1){
			$('.inp2').addClass('focus');
			$('.inp1').removeClass('focus');
		}else{
			//直接去结果
			that.fn3();
			$('.g_load').hide();
			return true;
		}
		
		$('.step').hide();
		$('.step2').show();	
	},
	fn2Sub:function(){
		var that =this;
		if(!that.flag1){
			return false;
		};
		that.flag1=false;
		
		$('.g_load').show();
		//提交验证码   验证结果
		$.ajax({
			type:"post",
			url:fn2SbuUrl,
			data:that.param,
			async:true,
			timeout : 120000, //超时时间设置，单位毫秒
			dataType: "json",
			success:function(resp){
				that.flag1=true;
				
				console.log(resp);
				$('.g_load').hide();
				if(resp.code==0){
					that.fn3();
				}else{
					test._tips(resp.msg);
					that.subError();
				}
			},
			error:function(resp){
				$('.g_load').hide();
				that.flag1=true;				
				test._tips('请求失败，请重新获取验证码');
				that.subError();
			}
		});
	},
	fn3:function(){
		$('.step').hide();
		$('.step3').show();
		
	},
	countDown:function(){
		var that = this;
		clearInterval(that.timer);
		var that =this;
		var num = 60;
		$('.num').html(num);
		that.timer = setInterval(function(){
			num--;
			if(num==0){
				clearInterval(that.timer);
				$('.num').html('重新获取');
				$('.num').addClass('focus');
				return false;
			};
			$('.num').html(num);						
		},1000);
	},
	subError:function(){
		var that =this;
		clearInterval(that.timer);
		$('.num').html('重新获取');
		$('.num').addClass('focus');						
		$('.step2 div.focus input').val('');
	}
};
//上传身份证
var idCard ={
	param:{name:''},
	param1:{column_id:'',prod_id:'',step_id:''},
	flag:false,
	fn:function(){
		var that =this;
		that.param1.column_id=column_id;
		that.param1.prod_id=prod_id;
		that.param1.step_id=step_id;
		
		$('._btn').click(function(){
			if(that.flag){
				return false;
			}
			that.flag=true;
			var flag=false;
			$('.subStr').each(function(index,item){
				console.log(index);
				console.log(item);
				var name =$(this).attr('name');
				var pic =$(this).val();
				if(pic==''){
					that.flag=false;
					flag=true;
					return false;
				}
				that.param1[name]=pic;
				
			})
			if(flag){
				test._tips('请上传全部图片后提交！');
				return false;
			}
			$.ajax({
				type:"post",
				url:URL,
				async:true,
				data:that.param1,
				success:function(resp){
					that.flag=false;
					console.log(resp)
					if(resp.code==0){
						window.location.href=goURL+'?id='+prod_id;
					}else{
						test._tips(resp.msg);
					}
				},
				error:function(){
					that.flag=false;
				}
				
			});
			
		});
	},
	init:function(){
			var _this =this;
				 //    用于压缩图片的canvas
			_this.fn();
		  _this.canvas = document.createElement("canvas");
		  _this.ctx = _this.canvas.getContext('2d');
		  //    瓦片canvas
		  _this.tCanvas = document.createElement("canvas");
		  _this.tctx = _this.tCanvas.getContext("2d");
		  var maxsize = 100 * 1024;
		
		  $('input').change(function() {
//		  	_this.flag=true;
		  	var  that =this;
		  	$(that).parents('li').find('.idcardimg').hide();
		  	$(that).parents('li').find('.cardimg').attr('src',$('.load').val()).show();
		  	_this.param.name=$(this).attr('name');
		  	
		    if (!this.files.length) {
//		    	_this.flag=false;
		    	return;
		    }
		    var files = Array.prototype.slice.call(this.files);
		    
		    files.forEach(function(file, i) {
		      if (!/\/(?:jpeg|png|gif)/i.test(file.type)) {
//		  			_this.flag=false;
		      		return;
		      }
		      var reader = new FileReader();
		
		      reader.onload = function() {
		        var result = this.result;
		        var img = new Image();
		        img.src = result;
		//      $(li).css("background-image", "url(" + result + ")");/
		        
		        //如果图片大小小于100kb，则直接上传
		        if (result.length <= maxsize) {
		          img = null;
		          _this.upload(result, file.type);
//		          _this.flag=false;
		          return;
		        }
		//      图片加载完毕之后进行压缩，然后上传
		        if (img.complete) {
		          callback();
		        } else {
		          img.onload = callback;
		        }
		        function callback() {
		          var data = _this.compress(img);
		          _this.upload(data, file.type);
		          img = null;
		        }
		      };
		      reader.readAsDataURL(file);
		    })
		  });
		  //    使用canvas对大图片进行压缩
	},
	compress:function (img) {
		var _this =this;
	    var initSize = img.src.length;
	    var width = img.width;
	    var height = img.height;
	    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
	    var ratio;
	    if ((ratio = width * height / 4000000) > 1) {
	      ratio = Math.sqrt(ratio);
	      width /= ratio;
	      height /= ratio;
	    } else {
	      ratio = 1;
	    }
	   _this.canvas.width = width;
	    _this.canvas.height = height;
	//        铺底色
	    _this.ctx.fillStyle = "#fff";
	    _this.ctx.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
	    //如果图片像素大于100万则使用瓦片绘制
	    var count;
	    if ((count = width * height / 1000000) > 1) {
	      count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
	//            计算每块瓦片的宽和高
	      var nw = ~~(width / count);
	      var nh = ~~(height / count);
	      _this.tCanvas.width = nw;
	      _this.tCanvas.height = nh;
	      for (var i = 0; i < count; i++) {
	        for (var j = 0; j < count; j++) {
	          _this.tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
	          _this.ctx.drawImage(_this.tCanvas, i * nw, j * nh, nw, nh);
	        }
	      }
	    } else {
	      _this.ctx.drawImage(img, 0, 0, width, height);
	    }
	    //进行最小压缩
	    var ndata = _this.canvas.toDataURL('image/jpeg',0.2);
	    console.log('压缩前：' + initSize);
	    console.log('压缩后：' + ndata.length);
	    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
//	    console.log(ndata);
	    _this.tCanvas.width = _this.tCanvas.height = _this.canvas.width = _this.canvas.height = 0;
	    return ndata;
  },
   upload:function (basestr, type){
   	var that =this;
   	//ajax   提交数据
   	
  	var subName= that.param.name;
  	$.ajax({
  		type:"post",
  		url:URL1,
  		async:true,
  		data:{name:subName,img:basestr},
  		dataType:'json',
  		success:function(resp){
  			console.log(resp);
  			if(resp.code==0){
	  			$('.subStr[name='+resp.name+']').val(resp.path);
  				$('.'+resp.name).attr('src',resp.path);
  				$('.'+resp.name+'1').hide();
  				$('.'+resp.name).show();
  			}else{
  				test._tips(resp.msg);
  				$('.'+resp.name).hide();
  				$('.'+resp.name+'1').attr('src','');
  				$('.'+resp.name+'1').show();
  			}
  		},
  		error:function(){
  			test._tips('图片提交失败，请重新提交!');
  			
  		}
  	});
  }
}
var orderDetail ={
	init:function(){
		
	}
}
//芝麻分
var sesame ={
	param:{name:'',idCard:''},
	init:function(){
		this.param.name=$('input[name=realName]').val();
		this.param.idCard=$('input[name=Card]').val();
		this.judge();
		this.fn();
	},
	fn:function(){
		var that =this;
		var flag = false ;
		
		$('input[name=realName]').bind('input propertychange',function(){
			that.param.idCard=$('input[name=Card]').val();
			that.param.name = $(this).val();
			
			that.judge();
		});
		$('input[name=Card]').bind('input propertychange',function(){
			that.param.name=$('input[name=realName]').val();
			that.param.idCard = $(this).val();
			
			that.judge();
		});
		$('.sesamePoints ._btn').on('click',function(){
			if(flag){
				return false;
			};
			flag =true;
			if($(this).hasClass('focus')){
				var flag = test.init([['Card',that.param.idCard]]);
				if(!flag){	
					flag =false;
					return false;
				};
				$.ajax({
					type:"post",
					url:URL,
					data:that.param,
					async:true,
					dataType:'json',
					success:function(resp){
						flag =false;
                        if(resp.data.redirect_url) {
                            window.location.href = resp.data.redirect_url;
                        }
					},
					error:function(){
						test._tips('提交失败，重新提交');
						flag =false;
					}
				});
					
				
			};
		});
	},
	judge:function(){
		if(this.param.idCard==''){
			$('.sesamePoints ._btn').removeClass('focus');
			return false;
		};
		if(this.param.name==''){
			$('.sesamePoints ._btn').removeClass('focus');
			return false;
		}
		$('.sesamePoints ._btn').addClass('focus');
	}
};
//芝麻分
var sesameResult ={
	init:function(){
		window.onload = function () {
		  var canvas = document.getElementById('canvas'),
		  	tScale = window.devicePixelRatio,
		    tWidth = 240,
		    tHeight = 190;
		    canvas.style.width = tWidth + "px";
		    canvas.style.height = tHeight + "px";
		    canvas.width = tWidth * tScale;
		    canvas.height = tHeight * tScale;
		    
		   var ctx = canvas.getContext('2d');
		    
		    var  cWidth = canvas.width;
		    var  cHeight = canvas.height;
		    var  score = canvas.attributes['data-score'].value;
		    var  radius = 100*tScale;
		    var  deg0 = Math.PI / 9;
		      deg1 = Math.PI * 7 / 23;
		
		  if (score < 350 || score > 950) {
		    alert('信用分数区间：350~950');
		  } else {
		    var dot = new Dot(),
		        dotSpeed = 0.03,
		        textSpeed = Math.round(dotSpeed * 150 / deg1),
		        angle = 0,
		        credit = 350;
		
		    (function drawFrame() {
		
		      ctx.save();
		      ctx.clearRect(0, 0, cWidth, cHeight);
		      ctx.translate(cWidth / 2, 120*tScale);
		      ctx.rotate(8 * deg0);
		
		      dot.x = radius * Math.cos(angle);
		      dot.y = radius * Math.sin(angle);
		
		      var aim = (score - 350) * deg1 / 150;
		      if (angle < aim) {
		        angle += dotSpeed;
		      }
		      dot.draw(ctx);
		
		      if (credit < score - textSpeed) {
		        credit += textSpeed;
		      } else if (credit >= score - textSpeed && credit < score) {
		        credit += 1;
		      }
		      
		      //中间评分
		      text(credit);
		
		      //升高轨迹
		      ctx.save();
		      ctx.beginPath();
		      ctx.lineWidth = 3;
		      ctx.strokeStyle = '#fff';
		      ctx.arc(0, 0, radius, 0, angle, false);
		      ctx.stroke();
		      ctx.restore();
		
		      window.requestAnimationFrame(drawFrame);
		
		
		      ctx.save(); // 刻度线
		      for (var i = 0; i < 5; i++) {
		        ctx.beginPath();
		        ctx.lineWidth = 2*tScale;
		        ctx.strokeStyle = '#fff';
		        ctx.moveTo(95*tScale, 0);
		        ctx.lineTo(83*tScale, 0);
		        ctx.stroke();
		        ctx.rotate(deg1);
		      }
		      ctx.restore();
		
		      ctx.save(); // 细分刻度线
		      for (i = 0; i < 120; i++) {
		        if (i % 30 !== 0){
		          ctx.beginPath();
		          ctx.lineWidth = 2*tScale;
		          ctx.strokeStyle = '#fff';
		          ctx.moveTo(95*tScale, 0);
		          ctx.lineTo(87*tScale, 0);
		          ctx.stroke();
		        }
		        ctx.rotate(deg1 / 30);
		      }
		      ctx.restore();
		
		      ctx.save(); //信用分数
		      ctx.rotate(Math.PI / 2);
		      for (i = 0; i < 5; i++) {
		        ctx.fillStyle = '#fff';
		        ctx.font = (10*tScale+'px Microsoft yahei');
		        ctx.textAlign = 'center';
		        ctx.fillText(350 + 150 * i, 0, -70*tScale);
		        ctx.rotate(deg1);
		      }
		      ctx.restore();
		
		
		
		      ctx.save(); //信用阶段及评估时间文字
		      ctx.rotate(10 * deg0);
		      ctx.textAlign = 'center';
		      ctx.fillStyle = '#fff';
		      ctx.font =(10*tScale+'px Microsoft yahei');
		      ctx.fillText('评估时间：'+time, 0, 40*tScale);
		      ctx.restore();
		
		
		      // ctx.save(); //最外层轨道
		      ctx.beginPath();
		      ctx.strokeStyle = '#fff';
		      ctx.lineWidth = 3;
		      ctx.arc(0, 0, radius, 0, 11 * deg0, false);
		      ctx.stroke();
		      ctx.restore();
		
		    })();
		  }
		
		
		
		//点
			  function Dot() {
			    this.x = 0;
			    this.y = 0;
			    this.draw = function (ctx) {
			      ctx.save();
			      ctx.beginPath();
			      ctx.fillStyle = '#fff';
			      ctx.arc(this.x, this.y, 3*tScale, 0, Math.PI * 2, false);
			      ctx.fill();
			      ctx.restore();
			    };
			  }
		
		//  中间文字
			  function text(process) {
			    ctx.save();
			    ctx.rotate(10 * deg0);
			    ctx.fillStyle = '#fff';
			    ctx.font = (46*tScale+'px Microsoft yahei');
			    ctx.textAlign = 'center';
			    ctx.textBaseLine = 'top';
			    ctx.fillText(process, 0 ,10*tScale);
			    ctx.restore();
			  }
		};
	}
};
//认证页面
var verifyInfo={
	init:function(){
		this.fn();
	},
	fn:function(){
		$('.classify .first').click(function(){
			if($(this).hasClass('specialClassify')){
				POP_g('<p>请输入金额</p><input type="text" />',function(num){
					console.log(num)
				},['确定','取消']);
			}else{
				$('.selInfo_content .top').hide();					
				$('.classify1').show();
				$('.selInfo_content').show();
			};
			return false;
		});
		$('.classify .second').click(function(){
				$('.selInfo_content .top').hide();
				$('.classify2').show();
				$('.selInfo_content').show();
				return false;
		});
		$('.selInfo_content p').click(function(){
			var str = $(this).html();
			if($(this).hasClass('sel1')){
				$('.applyNum').html(str);
				$('.applyNum').attr('need_id',$(this).attr('need_id'));
			}else{
				$('.applyDeadline').html(str);
				$('.applyDeadline').attr('need_id',$(this).attr('need_id'));
			};
			hidePop();
		});
		$('.sel_cover').on('touchmove',function(){
			hidePop();
		});
		
		$('.sel_cover').on('click',function(){
			hidePop();
		});
		$('.selInfo_content .bottom').on('click',function(){
			hidePop();
		});
		function hidePop(){
			$('.selInfo_content .top').hide();	
			$('.selInfo_content').hide();
			return false;
		}
	}
};
var onlineLend ={
	data:{},
	Flag:true,
	integral_pay:'',
	weixin_pay:'',
	init:function(){
		this.fn();
		this.fn1();
	},
	fn:function(){
		var _this = this;
		$('.J2_btn').on('click',function(){
			if(_this.Flag){
				_this.Flag = false;
				
				var NAME=$('input[name=name]').val();
				var CARD = $('input[name=idCard]').val();
				var PHONE =$('input[name=phone]').val();
				var flag =test.init([
								['Empty',NAME,'请填入用户名'],
								['Card',CARD],
								['Phone',PHONE,'请填入正确手机号'],
		//						['Empty',$('input[name=code]').val(),'请填入验证码'],
							]);
		
				if(!flag){
					_this.Flag =true;
					return false;
				};
				if(!$('.oth input').prop('checked')){
					test._tips('您没有同意服务条款');
					return false;
				};
				$('.g_load').show();
				$(this).html('查询中····');
				$.ajax({
					type:"post",
					url:SeekURL,
					dataType: "json",
					data:{phone:PHONE,name:NAME,card:CARD},
					async:true,
					success:function(resp){
						console.log(resp);
						$('.g_load').hide();						
						_this.Flag =true;
						$('.J2_btn').html('查询');
						if(resp.code==0){
							$('.pay').show();
						}else{
							test._tips(resp.msg);
						}
					}
				});
			}	
		})
	},
	fn1:function(){
		var _this =this;
		//支付显示后的操作
		_this.integral_pay=integral_pay;
		_this.weixin_pay=weixin_pay;
//		$('.pay_btn1 span').html(_this.integral_pay);
//		$('.pay_btn2 span').html(_this.weixin_pay);
		
		
		$('.pay i').on('click',function(){
			$('.pay').hide();
		});
		//积分支付
		$('.pay_btn1').on('click',function(){
			$('.pay').hide();
			POP_g('您将消耗'+_this.integral_pay+'积分进行网贷查询',function(num){
				console.log(num);
				//取消==0
				//确定 ==1；
				if(num==1){	
					$('.g_load').show();
					$.ajax({
						type:'post',
						url:payURL1,
						dataType: "json",
						async:true,
						success:function(resp){
							console.log(resp)
							$('.g_load').hide();
							
							if(resp.code==402){
								//积分不足时 前往领积分页面
								_this.noIntegral();
							}else if(resp.code==0){
								window.location.href=goURL;
							}else{
								test._tips(resp.msg);
							}
						},
					})
				}
			},['取消','确定']);
		});
	},
	noIntegral:function (){
		POP_g('积分不足，点击确定立即前往领积分',function(num1){
			console.log(num1);
			//取消==0
			//确定 ==1；
			if(num1==1){
				window.location.href=goURL1;
			}
		},['取消','确定']);
	}
};
var lendResult ={
	init:function(){
		var _this=this;
		this.fn1();
		$('.btn_box .left').on('click',_this.fn);
		
	},
	fn:function(){
		$('.pay').show();
		onlineLend.fn1();
	},
	fn1:function(){
		$('.btn_box .right').on('click',function(){
			$('.invite_box').show();			
		});
		$('.invite_box').on('click',function(){
			$('.invite_box').hide();
		})
	}
}
var orderList ={
	param:{page:1},
	pageSum:0,
	judge:true,
	URL:'',
	init:function(){
		var _this =this;
		
		this.URL=URL;
		iscrollAdd.init(this);
		iscrollAdd.upAjax(_this,1);
	},
	fn:function(){
		var _this =this;
		$('.edit_btn').off();
		$('.edit2').off();
		$('.edit3').off();
		$('.edit_btn').click(function(){
			$('.orderList').toggleClass('focus');
			if($('.orderList').hasClass('focus')){
				$(this).html('完成');
			}else{
				$(this).html('编辑');
			};
			return false;
		});
		$('.edit2').click(function(){
			var that =this;
			var order_id = $(this).attr('order_id');
			POP_g('你确定要永久删除这个订单吗？',function(num){
				console.log(num);
				if(num==1){
//					$(that).parents('li').remove();
					_this.sub(order_id,$(that).parents('li'));
				};
			},['取消','确定']);
		});
		$('.edit3').click(function(){
			var that =this;
			var order_id = $(this).attr('order_id');
			
			POP_g('你确定要永久删除这个订单吗？',function(num){
				console.log(num);
				if(num==1){
//					.remove();
					_this.sub(order_id,$(that).parents('li'));
				};
			},['取消','确定']);
		});
		$('ul').on('click','.content',function(){
			window.location.href=goURL+'?id='+$(this).attr('prod_id')+'&order_id='+$(this).attr('order_id');
		})
	},
	sub:function (order_id,el){
		$.ajax({
			type:"post",
			url:subURL,
			dataType: "json",
			data:{order_id:order_id},
			async:true,
			success:function(resp){
				console.log(resp);
				if(resp.code==0){
					el.remove();
				}else{
					test._tips(resp.msg);
				}
			},
			error:function(){
				test._tips('删除失败');
			}
		});
	},
	addhtml:function(resp){
		console.log(resp)
		if(resp.code==101){
			$('._empty').show();
			$('.edit_btn').hide();
			$('ul').hide();
			$('.g_load').hide();
			$('.orderList').show();
			
		};
		if(resp.code!=0){
			return false;
		};
		this.pageSum = resp.total_page;
		var arr = resp['list'];
		var str ='';
		var state='1';
		var term_type='天';

		for(var i=0;i<arr.length;i++){
			if(arr[i]['state']==1012||arr[i]['state']==1018||arr[i]['state']==1019){
				state =3;
			}else if(arr[i]['state']==1017){
				state =2;
			}else{
				state =1;
			}
			if(arr[i]['term_type']==0){
				 term_type='天';
			}else if(arr[i]['term_type']==1){
				 term_type='个月';
			}
			str +='<li class="status'+state+'"><p class="title"><img src="'+arr[i]['logo']+'" /><span>'+arr[i]['prod_name']
			+'</span><time>'+arr[i]['update_time']+'</time><span class="detail_status"><i></i><span>'+arr[i]['status_name']
			+'</span></span><span class="edit edit'+state+'" order_id="'+arr[i]['id']+'">删除订单</span></p><div class="content" prod_id="'+arr[i]['prod_id']+'" order_id="'+arr[i]['id']+'"><p>金额：<span>'+arr[i]['money']
			+'元</span></p><p>期限：<span>'+arr[i]['term']+term_type+'</span></p><i></i></div></li>';
		};

		$('ul').append(str);
		$('.g_load').hide();
		$('.orderList').show();
		myScroll.refresh();
		this.fn();
	}
}
//问题列表
var question ={
	param:{page:1},
	pageSum:0,
	judge:true,
	URL:'',
	init:function(){
		var _this = this;
		_this.pageSum=pageSum;
		_this.URL=URL;

		iscrollAdd.init(_this);
		$('.top').on('click',function(){
			$(this).parent().siblings().find('.description').stop().slideUp(0);
			$(this).next().stop().slideToggle(0);	
		})
	},
	addhtml:function(resp){
		console.log(resp);
		var arr = resp['question'];
		var str = '';
		for(var i=0;i<arr.length;i++){
			str+='<li><div class="top clearfix"><span>'+arr[i].title+'</span><i class="i_R"></i></div><div class="description"><p>'+arr[i].answer+'</p></div></li>';
		}
		$('ul').append(str);
		myScroll.refresh();
	}
	
}
//设置页面
var setup = {
	init:function(){
		this.fn();
	},
	fn:function(){
		$('ul li').click(function(){
			var index = $(this).index();
			if(index ==1 ){
				pop.service();
				return true;
			}else if(index==2){
				pop.business();
				return true;
			}else{
				return true;
			}
		})
	}
}
//弹窗公共样式
var pop = {
	service:function(){
		var item = serviceTel.split('-');
		var num = item.join(''); 
		POP_g('<h3 style="text-align:center;font-weight:600;">客服热线</h3><p style="text-align:center;">'+serviceTel+'</p>',function(n){
				
			},['取消','<a href="tel:'+num+'" >呼叫</a>'])
	},
	business:function(){
		POP_g('<h3 style="text-align:center;font-weight:600;">商务合作</h3><p style="text-align:center;">'+businessTel+'</p>',function(n){
				
		},['确定'])
	}
}
//
var rewrite ={
	timer:'',
	init:function(){
		this.fn();
	},
	fn:function(){
		var that = this;
		var flag = true;
		$('.rewrite label input').on('input propertychange',function(){
			var str =$(this).val();
			
			if(str!=''){
				$('.rewrite label img').show();
			}else{
				$('.rewrite label img').hide();
			}
		})
		
		$('.rewrite label img').click(function(){
			$('.rewrite label input').val('');
			$(this).hide();
		})
		$('._btn').on('click',function(){
			var name = $('.rewrite label input').val();
			if(name==''){
				that.tips('请填写昵称');
				return false;
			}
			var len = that.getRealLen(name);
			if(len<4||len>16){
				that.tips('昵称为4-16个字符');
				return false;
			}
			if(name==$('.rewrite label input').attr('placeholder')){
				that.tips('设置成功');
				window.location.replace(_url);
				return false;
			}

			if(flag){
				flag=false;
				$('._btn').html('保存中···')
				$.ajax({
					type:"get",
					url:URL,
					data:{nick_name:name},
					async:true,
					success:function(resp){
						$('._btn').html('保存')
						if(resp.ret==200){
							that.tips('设置成功');
							window.location.replace(_url);
							
						}else if(resp.ret==401){
							flag=true;
							that.tips(resp.msg);
							
							
						}
						console.log(resp)
					}
				});
			}	
		})
	},
	tips:function(msg){
		clearTimeout(this.timer);
		$('.tip span').html(msg);
		$('.tip').show();
		this.timer=setTimeout(function(){
			$('.tip').hide();
		},2000)
	},
	getRealLen:function (str) {  
    	return str.replace(/[^\x00-\xff]/g, '__').length; 
	}  
}

	//extractMoney   提现页面
var extractMoney ={
	init:function(){
		this.fn();
	},
	fn:function(){
		var that =this;
		var flag = true;
		var timer;
		$('._btn').on('click',function(){
			var val = Math.floor($('.money').html());
			$('.sumMoney input').val(val);
		})
		$('.extract_btn').on('click',function(){
			var val1 = Math.floor($('.money').html());
			var val = $('input').val()-0;
			
			if(val<10||val>val1){
				POP_g('满十元可提现',function(num){},['确定'])
			}else{
				$('.moneyOk').show();	
			}
		})
		$('.money_cancel').click(function(){
			$('.moneyOk').hide();
			$('.moneyOk input').val('');
			clearInterval(timer);
			$('.getNum').removeClass('focus');
			$('.getNum').html('获取验证码');
			flag=true;
		})
		
		$('.getNum').on('click',function(){

			if(flag){
				flag=false;
				var count = 60;
				var _this = this;
				$(_this).addClass('focus');
				$(_this).html(count);
				$.ajax({
					async:true,
					data:{type:'2'},
					url:URL,
					type:'post',
					success:function(resp){
						
					}
				})
				timer = setInterval(function(){
					count--;
					$(_this).html(count);
					if(count==0){
						flag=true;
						clearInterval(timer);
						$(_this).removeClass('focus');
						$(_this).html('获取验证码');
					}
					
				},1000)				
			}
			return false;
		})
		var btn_flag = true;
		$('.pop_btn').click(function(){
			if(btn_flag){
				btn_flag = false;
				if($('input[name=name]').val()==''){
					that.pop('请输入姓名');
					btn_flag = true;
					return false;
				}
				if($('input[name=user]').val()==''){
					that.pop('请输入支付宝账号');
					btn_flag = true;
					return false;
				}
		
				if($('input[name=code]').val()==''){
					that.pop('请输入验证码');
					btn_flag = true;
					return false;
				}
				$('.pop_btn').html('提现中，请稍等！')
				$.ajax({
					async:true,
					type:'post',
					data:{price:$('.sumMoney input').val(),username:$('input[name=name]').val(),account:$('input[name=user]').val(),code:$('input[name=code]').val()},
					url:URL1,
					success:function(resp){
						btn_flag = true;
						if(resp.code=='401'){
							that.pop(resp.msg);
							$('.pop_btn').html('确认提现');
						}else if(resp.code=='102'){
							that.pop(resp.msg);
							$('.pop_btn').html('确认提现');
						}else{
							sessionStorage.extractMoney=2;
							window.location.reload();
						}
					}
				})
			
			}else{
				that.pop('请不要重复提交');
			}
			
		})
	},
	pop:function(msg){
		$('.oth_pop span').text(msg);
		$('.oth_pop').show();
		setTimeout(function(){
			$('.oth_pop').hide();
		},2000)
	}
	
}
var baseInfoSelect ={
	init:function(status){
		this.fn(status);
	},
	fn:function(status){
		$('input[name=money]').on('input propertychange',function(){
			var num = $(this).val();
			if(num!=''){
				num = parseInt(num.replace(/\D/g, ''));
				if(num){
					$(this).val(num);
				}else{
					$(this).val('');
				}
			}
		})
		$('input[name=idcard]').on('input propertychange',function(){
			var str = $(this).val();
			
			if(str.length>18){
				var str1 = str.replace(/\s*/g,'');
				str1=str1.substring(0,18);
				$(this).val(str1);
			}
			
		})
		if(status!=2){
			$('.selInfo').each(function(index,item){
				if($(item).html()!='请选择'){
					$(item).css('color','#4592ea')
				}
			});
		};
		
		
		$('.selInfo').on('click',function(){
			var _this = this;
			var _index = $(_this).attr('tit');
			$('.selInfo_content').show();
			$('.selInfo_content .top').hide();
			$('.'+_index).show();	
		});
		$('.selInfo_content p').click(function(){
			var that = $('[tit='+$(this).attr('titl')+']');
			if(status!=2){
				that.css('color','#4592ea');
			}			
			that.html($(this).html());
			that.attr('key',$(this).attr('key'));
			$('.selInfo_content').hide();
		});
		$('.bottom').click(function(){			
			$('.selInfo_content').hide();
		});
		$('.sel_cover').click(function(){
			$('.selInfo_content').hide();
		});
	}
}
var baseInfo = {
	status:0,
	init:function(status){
		this.status=status;
		if(status==1){
			$('input[name=money]').val(money);
			$('[tit=term]').attr('key',_need_id);
		}
		baseInfoSelect.init(status);
		this.fn();	
	},
	fn:function(){
		var _that =this;
		//如果  不是请选择   颜色为 #4592ea;
		var g_flag = true;
		$('.detail_btn_btn').click(function(){
			var param ={};
			var flag=false;
			$('input[name]').each(function(index,item){
				if($(item).val()==''){
					flag=true;
					return false;
				}
				var _name =$(item).attr('name');
				param[_name]=$(item).val();
				
			})
			if(!flag){
				$('span.selInfo').each(function(index,item){
					if($(item).html()=='请选择'){
						flag=true;
						return false;
					}
					param[$(item).attr('tit')]=$(item).html();
					if($(item).attr('tit')=='term'){
						param['term']=$(item).attr('key');
					};
				})
			}
			if(!flag){
				if(typeof($('input[name=idcard]').val())!="undefined"){
					var flagID = test.init([['Card',$('input[name=idcard]').val()]]);
					if(!flagID){	
						flag =true;
						return false;
					};
				}
				

			};
			if(flag){
				POP_g('请填写完整信息',function(num){},['确定'])
				return false;
			};
			
			if(_that.status==1){
				if(typeof($('input[name=money]').val())!="undefined"){
					if($('input[name=money]').val().length!=0){
						if(maxMoney!=''){
							minMoney = parseInt(minMoney);
							maxMoney = parseInt(maxMoney);
							var moneyNum = parseInt($('input[name=money]').val());
							if(minMoney){
								if(moneyNum>=minMoney&&moneyNum<=maxMoney){
									//符合条件   跳转页面 
									console.log('success')
								}else{
									POP_g('该平台借款金额('+minMoney+'-'+maxMoney+'元)',function(num){},['确定']);
									return false;
								}
							}
						};
					}
				}
				
			}
			if(_that.status==2){
				param.column_id=column_id;
				param.prod_id=prod_id;
				param.step_id=step_id;
			}
			
			if(g_flag){
				g_flag=false;
				$('.detail_btn_btn').html('提交中···');
				if(_that.status==1){
					param.deadline_type=deadline_type;
					param.loan_id=_loan_id;
					param.pid=ID;
				}
				
				$.ajax({
					type:"post",
					url:URL,
					data:param,
					async:true,
					dataType:'json',
					success:function(resp){
						if(_that.status==1){
							if(resp.code==0){
								if(resp.data){
									g_flag=true;
									test._tips('提交成功');							
									sessionStorage['money'+ID] =$('input[name=money]').val()?$('input[name=money]').val():money;
									$('.detail_btn_btn').html('立刻提交');
									if(resp.data.url==''){
										window.location.href=(_url+'/name/'+resp.data.loanname);
									}else{
										window.location.href=resp.data.url;
									}
								}else{
									g_flag=true;
									tip('提交成功');
									$('.detail_btn_btn').html('立刻提交');
								}
							}else{
								g_flag=true;
								$('.detail_btn_btn').html('立刻提交');
								POP_g('提交失败,请重新提交',function(num){},['确定'])
							}
						}else if(_that.status==2){
							g_flag=true;
							
							$('.detail_btn_btn').html('立刻提交');
							if(resp.code==0){
								test._tips('提交成功');	
								location.replace(goURL+'?id='+prod_id);
							}else{
								POP_g(resp.msg,function(num){},['确定'])
							}
							
							
						}else{
							if(resp.code==200){
								g_flag=true;
								test._tips('提交成功');
								window.history.go(-1);
								$('.detail_btn_btn').html('立刻提交');
							}else{
								g_flag=true;
								$('.detail_btn_btn').html('立刻提交');
								POP_g('提交失败,请重新提交',function(num){},['确定'])
							}
						}
					},
					error:function(){
						g_flag=true;
						$('.detail_btn_btn').html('立刻提交');
						POP_g('提交失败,请重新提交',function(num){},['确定'])
					}
				});
			}
		})
	}
}
//运营商
var sub_phone_info ={
	param:{},
	click_flag:false,
	init:function(){
		this.param.column_id=column_id;
		this.param.prod_id=prod_id;
		this.param.step_id=step_id;
		
		this.fn();
	},
	fn:function(){
		var that =this;
		$('.checkbox').click(function(){
			$(this).toggleClass('focus');
		});
		$('.step3 ._btn').click(function(){
			window.location.href=goURL+'?id='+prod_id;
		})
		$('.step1 ._btn').click(function(){
			//arr1 二维数组
			//arr2  数组 对应的值;
			if(that.click_flag){
				return false;
			};
			that.click_flag =true;
			
			var arr1=[];
			
			$('.step1 label input').each(function(index,item){
			
				var arr2=[];
				arr2[0] = $(item).attr('test')?$(item).attr('test'):'Empty';
				arr2[1] = $(item).val();							
				arr1.push(arr2);
				that.param[$(item).attr('name')] = $(item).val();
			});
			var flag = test.init(arr1);
			if(!flag){
				that.click_flag = false;
				return false;
			//判断是否选中
			};
			if($('.checkbox').hasClass("focus")){
				test._tips('请同意服务协议');
				that.click_flag = false;
				return false;
			};
			//提交参数	
			that.param.token=token;
			$('.g_load').show();
			delete that.param.captcha;
			that.subMsg();
			return true;
		});
	},
	getCode:function(){
		var that =this;
		$('.g_load').hide();
		POP_g('<p>请输入手机验证码</p><input type="text" name="captcha"/>',function(num){					
			if(num==1){
				var need_num =$('input[name=captcha]').val();
				if(need_num==''){
					test._tips('验证码不为空');
					return 'stop';
				};
				delete that.param.password;
				that.param.captcha=need_num;
				$('.g_load').show();
				that.subMsg();
			}else{
				that.click_flag = false;
			}
			
		},['取消','确定']);
	},
	subMsg:function(){
		var that =this;
		$.ajax({
			type:"post",
			url:URL,
			async:true,
			data:that.param,
			dataTypr:'json',
			success:function(resp){
				
				console.log(resp);
				if(resp.code==0){
					//去结果页
					$('.g_load').hide();
					that.click_flag = false;
					$('.step').hide();
					$('.step3').show();
				}else if(resp.code==12800){
					//传验证码
					that.getCode();
				}else{
					$('.g_load').hide();
					that.click_flag = false;
					test._tips(resp.msg);
				};
			},
			error:function(){
				$('.g_load').hide();
				that.click_flag = false;
				test._tips('提交失败，请重新提交');
			}
		});
	},
}
var exchangeList={
	param:{page:1},
	pageSum:2,
	judge:true,
	URL:'',
	init:function(){
		var _this =this;
		_this.pageSum=page_sum;
		_this.URL=URL;
		iscrollAdd.init(_this);
	},
	addhtml:function(resp){
		console.log(resp)
		var arr = resp.data.list;
		var str ='';
		for(var i=0;i<arr.length;i++){
			str+='<li><div class="tit clearfix"><time>'+arr[i].gmt_create
			+'</time><span class="succ">兑换成功</span></div><div class="content clearfix"><span class="down_left">'+arr[i].description
			+'</span><span class="down_right">-'+arr[i].credits
			+'积分</span></div></li>';
		}
		$('ul').append(str);
		myScroll.refresh();
	}
}