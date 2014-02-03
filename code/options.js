var defaultOptions = {
	autoSize : 1,
	hideColumn : 1
};

var options = {};

function saveOptions() {
	localStorage.setItem('options', JSON.stringify(options));
}

if(localStorage.getItem('options')) {
	optionsString = localStorage.getItem('options');
	options = JSON.parse(optionsString);
}

options.setVal = function(key, val) {
	options[key] = val;
	saveOptions();
}

for(var key in defaultOptions) {
	if(options[key] === undefined) {
		options[key] = defaultOptions[key];
		console.log('new option added, key = ' + key + ' value = ' + options[key]);
	}
}

saveOptions();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "getOptions")
      sendResponse(options);
    if (request.action == "setOption")   {
    	options.setVal(request.key, request.val);
    }
  });