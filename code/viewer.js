$(document).ready(function(){
	if(!/https:\/\/bbs.sjtu.edu.cn\/bbsfdoc2/.test(document.location.href)) return;
	
	if(options.autoSize)
		$('table').width($(window).width() - 40);
	
	$('td > a').each(function(){
			var href = $(this).attr("href");
			if(/jpeg$|jpg$|png$|gif$/.test(href.toLowerCase())){		
				$("<br>").appendTo($(this).parent());
				var $img = $("<img></img>").attr("src", href);
				if(options.autoSize) 
					$img.load(function(){
						if(this.width > $(window).width() - 360){ this.width =  $(window).width() - 360; };
					});
				$img.appendTo($(this).parent());
			}
	});
	
	$(window).keydown(function(event){
		 var ele;
		 switch(event.keyCode)
		 {	 
			 case 219: // [				
				 ele = $("a:contains('上一页')")[0];
				 break;
			 case 221: // ]
				 ele = $("a:contains('下一页')")[0];				
				 break;
		 }			
		 if(!ele) return;
		 
		 var e = document.createEvent('MouseEvents');
		 e.initEvent( 'click', true, true );
		 ele.dispatchEvent(e);	 
   });
});