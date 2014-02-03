$("#chk-autosize").prop('checked', options.autoSize).change(function(){
	options.setVal('autoSize', $(this).prop('checked'));
});