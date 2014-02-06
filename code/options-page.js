$.getJSON('manifest.json', function(manifest) {
	$("#version").html(manifest.version);
});

chrome.runtime.sendMessage({action: "getOptions"}, function(options) {
	 $("#chk-autosize").prop('checked', options.autoSize).change(function(){
		 chrome.runtime.sendMessage({
			 action: 'setOption', key : 'autoSize', val : $(this).prop('checked')
		 });
	 });
	 
	 $("#chk-center-image").prop('checked', options.centerImage).change(function(){
		 chrome.runtime.sendMessage({
			 action: 'setOption', key : 'centerImage', val : $(this).prop('checked')
		 });
	 });
	 
	  $("#chk-hide-column").prop('checked', options.hideColumn).change(function(){
		 chrome.runtime.sendMessage({
			 action: 'setOption', key : 'hideColumn', val : $(this).prop('checked')
		 });
	 });
	 
	  $("#chk-hide-table").prop('checked', options.hideTable).change(function(){
		 chrome.runtime.sendMessage({
			 action: 'setOption', key : 'hideTable', val : $(this).prop('checked')
		 });
	 });
	 
	 $("#chk-progress-bar").prop('checked', options.progressBar).change(function(){
		 chrome.runtime.sendMessage({
			 action: 'setOption', key : 'progressBar', val : $(this).prop('checked')
		 });
	 });
});