$(document).ready(function(){
	if(!/https:\/\/bbs.sjtu.edu.cn\/bbsfdoc2/.test(document.location.href)) return;
	
	$('td > a').each(function(){
			var href = $(this).attr("href");
			if(/jpeg$|jpg$|png$|gif$/.test(href.toLowerCase())){		
				$("<br>").appendTo($(this).parent());
				$("<img></img>").attr("src", href).appendTo($(this).parent());
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