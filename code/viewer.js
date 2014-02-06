chrome.runtime.sendMessage({action: "getOptions"}, function(options) {
	if(!/https:\/\/bbs\.sjtu\.edu\.cn\/bbsfdoc2\?/.test(window.location.href)
	&& !/https:\/\/bbs\.sjtu\.cn\/bbsfdoc2\?/.test(window.location.href)) return;

	var state  = {
		timeout : -1,
		currentImgIndex : -1,
		lastPrev : -1,
		lastNext : -1,
		windowHeight : $(window).height(),
		windowWidth : $(window).width(),
		imgDivs : [],
		imgMargin : options.hideColumn ? 240 : 360,
	};
	
	state.imgWrapperWidth = state.windowWidth - state.imgMargin;

	function clickElement(ele) {
		var e = document.createEvent('MouseEvents');
		e.initEvent('click', true, true );
		ele.dispatchEvent(e);
	}
	
	function scrollToImg() {
		if(state.imgDivs.length == 0) return;
		$('html, body').animate({
    		scrollTop: (state.imgDivs[state.currentImgIndex].first().offset().top)
		}, 150);
	}
	
	function nextPage() {
		var ele = $("a:contains('下一页')")[0];
		if(ele) {
			clickElement(ele);
			showHint('Loading next page...');
		}
		else {
			showHint('No more pages...');
		}
	}
	
	function prevPage() {
		var ele = $("a:contains('上一页')")[0];
		if(ele) {
			clickElement(ele);
			showHint('Loading previous page...');
		}
		else {
			showHint('No more pages...');
		}
	}
	
	function prevImg() {
		if(state.currentImgIndex > 0) {
			state.currentImgIndex --;
			scrollToImg();
		} else {
			var n = new Date().getTime();
			if(n - state.lastPrev < 2000) {
				nextPage();
			} else {
				showHint("Press K to load more...");
			}
			state.lastPrev = n;
		}
	}
	
	function nextImg() {
		if(state.currentImgIndex < state.imgDivs.length - 1) {
			state.currentImgIndex++;
			scrollToImg();
		} else {
			var n = new Date().getTime();
			if(n - state.lastNext < 2000) {
				prevPage();
			} else {
				showHint("Press J to load more...");
			}
			state.lastNext = n;
		}
	}
	
	$(window).keydown(function(event){
		var ele, img;
		switch(event.keyCode)
		{	 
			case 37:	// <- : previous page
			case 72:	// h  : previous page
				prevPage();
				break;
			case 39:	// -> : next page
			case 76:	// l  : next page
				nextPage();
				break;
			case 75:	// k : previous image
				prevImg();
				break;
			case 74:	// j : next image
				nextImg();
				break;
			case 84:	// t : test
				showHint('testing...');
				break;
		}
	});
	
	function showHint(msg) {
		$hint.html(msg).css({'margin-right' : -$hint.width()/2 + 'px'}).show();
		clearTimeout(state.timeout);
		state.timeout = setTimeout(function() {
			$hint.slideUp();
		}, 2000);
	}
	
	
	var $hint = $('<div></div>').addClass('hint').text('hint').appendTo($("body")).hide();
	
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
			
			var $div = $('<div></div>').appendTo($(this).parent());
				
			if(options.centerImage) {
				$div.addClass('img-wrapper').css({'height': state.windowHeight, 'width' : state.imgWrapperWidth})
			}
				
			var $a = $('<a href="' + href + '" target="_blank">').appendTo($div);
			var $img = $("<img></img>").attr("src", href).appendTo($a);
			if(options.autoSize) 
				$img.css({'max-width' : state.imgWrapperWidth, 'max-height' : state.windowHeight});
			$(this).remove();
			state.imgDivs.push($div);
	});
	
	$("a:contains('上一页')").text("上一页 ← ");
	$("a:contains('下一页')").text("下一页 → ");
	
	if(state.imgDivs.length > 0) {
		nextImg();
	}
	
});