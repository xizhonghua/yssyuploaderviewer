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
	
	var imgMargin = options.hideColumn ? 240 : 360;
	
	var imgs = [];
	var currentImgIndex = -1;
	
	$('td > a').each(function(){
			var href = $(this).attr("href");
			if(!/jpeg$|jpg$|png$|gif$/.test(href.toLowerCase())) return;
			
			var $div = $('<div></div>').appendTo($(this).parent());
			var $a = $('<a href="' + href + '" target="_blank">').appendTo($div);
			var $img = $("<img></img>").attr("src", href).appendTo($a);
			if(options.autoSize) 
				$img.css({'max-width' : $(window).width() - imgMargin, 'max-height' : $(window).height()});
			$(this).remove();
			imgs.push($img);
	});
	
	$("a:contains('上一页')").text("上一页 ← ");
	$("a:contains('下一页')").text("下一页 → ");
	
	function clickElement(ele) {
		var e = document.createEvent('MouseEvents');
		e.initEvent('click', true, true );
		ele.dispatchEvent(e);
	}
	
	function scrollToImg() {
		if(imgs.length == 0) return;
		$('html, body').animate({
    		scrollTop: (imgs[currentImgIndex].first().offset().top)
		},150);
	}
	
	$(window).keydown(function(event){
		var ele, img;
		switch(event.keyCode)
		{	 
			case 37:	// <- : previous page
			case 72:	// h  : previous page
				ele = $("a:contains('上一页')")[0];
				break;
			case 39:	// -> : next page
			case 76:	// l  : next page
				ele = $("a:contains('下一页')")[0];				
				break;
			case 75:	// k : previous image
				if(currentImgIndex > 0) currentImgIndex --;
				scrollToImg();
				break;
			case 74:	// j : next image
				if(currentImgIndex < imgs.length - 1) currentImgIndex++;
				scrollToImg();
				break;
		}			
		
		if(ele) clickElement(ele); 
   });
});