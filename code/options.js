var defaultOptions = {
	autoSize : true
};

var options = {};

function saveOptions() {
	localStorage.setItem('options', JSON.stringify(options));
}

if(localStorage.getItem('options'))
	options = JSON.parse(localStorage.getItem('options'));

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