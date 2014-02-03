chrome.runtime.sendMessage({action: "getOptions"}, function(options) {
	 $("#chk-autosize").prop('checked', options.autoSize).change(function(){
		 chrome.runtime.sendMessage({
			 action: 'setOption', key : 'autoSize', val : $(this).prop('checked') ? 1 : 0
		 });
	 });

	 $("#chk-hide-column").prop('checked', options.hideColumn).change(function(){
		 chrome.runtime.sendMessage({
			 action: 'setOption', key : 'hideColumn', val : $(this).prop('checked') ? 1 : 0
		 });
	 });
});