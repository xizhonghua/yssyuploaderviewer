$("body").hide();
chrome.runtime.sendMessage({action: "getOptions"}, function(options) {
	var state  = {
		inited : false,
		timeout : -1,
		currentImgIndex : -1,
		lastPrev : -1,
		lastNext : -1,
		windowHeight : $(window).height(),
		windowWidth : $(window).width(),
		imgDivs : [],
		imgRightMargin : options.hideColumn ? 240 : 360,
		imgTopDownMargin : 20,
		scrolling : false,
		scrollingIndex : -1
	};
	
	if(options.hideTable)
		state.imgRightMargin = 40;
		
	state.imgWrapperWidth = state.windowWidth - state.imgRightMargin;
	state.imgHeight = state.windowHeight - 2*state.imgTopDownMargin;

	state.$progressBar = $('<div></div>').addClass('progress-bar').appendTo($("body"));

	if(options.reverseOrder) {
		var trs = [];
		$("tr").each(function(index){ if(index != 0) trs.push($(this));});
 		for(var i=trs.length-1;i>=0;i--) { $("table").append(trs[i]); }
    }

	function setBackgroundColor() {
		var date = new Date();
		var y = Math.round((1 - Math.abs(date.getHours() - 12)/12.0)*15);
		var c = y.toString(16);
		var t = (y > 7 ? 0 : 15).toString(16);
		$("body").css({'background-color' : '#' + c + c + c, 'color' : '#' + t + t + t});
	}
	
	function clickElement(ele) {
		var e = document.createEvent('MouseEvents');
		e.initEvent('click', true, true );
		ele.dispatchEvent(e);
	}
	
	function updateProgressBar() {
		if(!options.progressBar) return;
		var percentage = (state.currentImgIndex + 1) * 100.0 / state.imgDivs.length;
		state.$progressBar.show().animate({'width' : percentage + '%'}, 125);
	}
	
	function scrollToImg(immediate) {
		if(state.imgDivs.length == 0) return;
		$hint.hide();
		updateProgressBar();
		state.scrolling = true;
		state.scrollingIndex = state.currentImgIndex;
		
		var doScroll = function(index) {
			$('html, body').animate({
				scrollTop: (state.imgDivs[index].first().offset().top)
			}, immediate ? 0 : 125, "swing", function(){
				if(index == state.scrollingIndex)
					state.scrolling = false;
			});
		}
		
		doScroll(state.scrollingIndex);
	}
	
	function nextPage() {
		var ele = $("a:contains('下一页')")[0];
		if(ele) {
			clickElement(ele);
			showHint('Loading newer ones...', 256*256);
		}
		else {
			showHint('No newer ones...');
		}
	}
	
	function prevPage() {
		var ele = $("a:contains('上一页')")[0];
		if(ele) {
			clickElement(ele);
			showHint('Loading older ones...', 256*256);
		}
		else {
			showHint('No older ones...');
		}
	}
	
	function prevImg() {
		if(state.currentImgIndex > 0) {
			state.currentImgIndex --;
			scrollToImg();
		} else {
			var n = new Date().getTime();
			if(n - state.lastPrev < 2000 && n - state.lastPrev > 250) {
				nextPage();
			} else {
				showHint("Press K to load newer ones...");
			}
			state.lastPrev = n;
		}
	}
	
	function nextImg(immediate) {
		if(state.currentImgIndex < state.imgDivs.length - 1) {
			state.currentImgIndex++;
			scrollToImg(immediate);
		} else {
			var n = new Date().getTime();
			if(n - state.lastNext < 2000 && n - state.lastPrev > 250) {
				prevPage();
			} else {
				showHint("Press J to load older ones...");
			}
			state.lastNext = n;
		}
	}
	
	
	
	function showHint(msg, duration) {
		$hint.html(msg).css({'margin-right' : -$hint.width()/2 + 'px'}).show();
		clearTimeout(state.timeout);
		state.timeout = setTimeout(function() {
			$hint.slideUp();
		}, duration ? duration : 2000);
	}
	
	
	var $hint = $('<div></div>').addClass('hint').text('hint').appendTo($("body")).hide();
	
	if(options.autoSize)
		$('table').width($(window).width() - 60);
	
	
	function showColumns(cols) {
		for(var i=0;i<cols.length;i++)
			$('td:nth-child(' + cols[i] + ')').show();
	}
	
	function hideColumns(cols) {
		for(var i=0;i<cols.length;i++)
			$('td:nth-child(' + cols[i] + ')').hide();
	}
	
	function showRows(rows) {
		for(var i=0;i<rows.length;i++)
			$('tr:nth-child(' + rows[i] + ')').show();
	}

	
	function hideRows(rows) {
		for(var i=0;i<rows.length;i++)
			$('tr:nth-child(' + rows[i] + ')').hide();
	}
	
	function toggleColumn() {
		var cols = [1,5,6,7];
		if(options.hideColumn)
		{
			hideColumns(cols);
		} else {
			showColumns(cols);
		}
	}
	
	function toggleTable() {
		var rows = [1];
		var cols = [1,3,4,5,6,7,8,9];
		if(options.hideTable) {
			hideRows(rows);
			hideColumns(cols);	
			$('table').attr('old-border', $('table').attr('border')).attr('border', '0');
			setBackgroundColor();
		} else {
			showRows(rows);
			showColumns(cols);	
			var oldBorder = $('table').attr('old-border');
			if(oldBorder) $('table').attr('border', oldBorder);
		}
	}
	
	
	
	$('td > a').each(function(){
			var href = $(this).attr("href");
			if(!/jpeg$|jpg$|png$|gif$/.test(href.toLowerCase())) return;
			
			var $div = $('<div></div>').appendTo($(this).parent());
			
			state.imgDivs.push($div);
				
			if(options.centerImage) {
				$div.addClass('img-wrapper').css({'height': state.windowHeight, 'width' : state.imgWrapperWidth})
			}
				
			var $a = $('<a href="' + href + '" target="_blank">').appendTo($div);
			var $img = $("<img></img>").attr("src", href).appendTo($a);
			if(options.autoSize) 
				$img.css({'max-width' : state.imgWrapperWidth, 'max-height' : state.imgHeight});
			if(options.hideTable) {
				$img.css({'box-shadow' : '0 0 20px rgba(0, 0, 0, .8)'});
			}
				
			$(this).remove();
			
	});
	
	$(window).keyup(function(event){
		if(!state.inited) return;
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
				//toggleTable();
				break;
		}
	});
	
	$(window).scroll(function(event){
		if(state.scrolling) return;
		
		var top = $(this).scrollTop();
		var index = -1;
		for(var i=0;i<state.imgDivs.length;i++)
		{
			var imgBottom = state.imgDivs[i].position().top + state.imgDivs[i].outerHeight(true);
			if(top > imgBottom) { index = i; }
		}
		
		if(state.currentImgIndex != index+1)
		{
			state.currentImgIndex = index+1;
			updateProgressBar();
		}
	});
	
	$("a:contains('上一页')").text("上一页 ← ");
	$("a:contains('下一页')").text("下一页 → ");
	
	
	state.inited = true;
	
	toggleColumn();
	toggleTable();
	
	
	$("body").show();
		
	if(state.imgDivs.length > 0) {
		nextImg(true);
	}
});