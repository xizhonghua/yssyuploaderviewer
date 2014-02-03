var defaultOptions = {
	autoSize : true,
	hideColumn : true
};

var options = {
	setVal : function(key, val) {
		options[key] = val;
		options.save();
		return this;
	},
	save : function() {
		localStorage.setItem('options', JSON.stringify(options));
		return this;
	},
	load : function() {
		var optionsString = localStorage.getItem('options');
		if(optionsString) {
			var op = JSON.parse(optionsString);
			options.updateWith(op);
		}
		return this;
	},
	updateWith : function(op) {
		for(var key in op) {
		   if(options[key] === undefined) {
			   options[key] = op[key];
		   }
	   }
	   return this;
	}
};

options.load().updateWith(defaultOptions).save();

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == "getOptions")
			sendResponse(options);
		if (request.action == "setOption")
			options.setVal(request.key, request.val);
});