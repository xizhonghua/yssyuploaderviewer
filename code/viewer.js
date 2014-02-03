chrome.runtime.sendMessage({action: "getOptions"}, function(options) {
	if(!/https:\/\/bbs\.sjtu\.edu\.cn\/bbsfdoc2\?/.test(window.location.href)
	&& !/https:\/\/bbs\.sjtu\.cn\/bbsfdoc2\?/.test(window.location.href)) return;
	
	if(options.autoSize)
		$('table').width($(window).width() - 60);
	
	if(options.hideColumn)
	{
		$('td:nth-child(1)').hide();
		$('td:nth-child(5)').hide();
		$('td:nth-child(6)').hide();
		$('td:nth-child(7)').hide();
	}
	
	$('td > a').each(function(){
			var href = $(this).attr("href");
			if(!/jpeg$|jpg$|png$|gif$/.test(href.toLowerCase())) return;
					
			$div = $('<div></div>').appendTo($(this).parent());
			$a = $('<a href="' + href + '" target="_blank">').appendTo($div);
			var $img = $("<img></img>").attr("src", href);
			if(options.autoSize) 
				$img.load(function(){
					if(this.width > $(window).width() - 360){ this.width =  $(window).width() - 360; };
				});
			$img.appendTo($a);
			$(this).remove();
	});
	
	$("a:contains('上一页')").text("上一页 ← ");
	$("a:contains('下一页')").text("下一页 → ");
	
	$(window).keydown(function(event){
		 var ele;
		 switch(event.keyCode)
		 {	 
			 case 37: // <-				
				 ele = $("a:contains('上一页')")[0];
				 break;
			 case 39: // ->
				 ele = $("a:contains('下一页')")[0];				
				 break;
		 }			
		 if(!ele) return;
		 
		 var e = document.createEvent('MouseEvents');
		 e.initEvent( 'click', true, true );
		 ele.dispatchEvent(e);	 
   });
});