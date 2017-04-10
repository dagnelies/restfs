var cache = {}

cache.get = function(path, success, failure) {
	if(path in cache.internal) {
		console.log('Loading ' + path + ' from cache');
		var data = cache.internal[path];
		success(data);
	}
	else {
		console.log('Fetching ' + path + ' into cache');
		$.get('@files/list', {path: path}, function(data) {
			console.log(data);
			cache.internal[path] = data;
			success( data );
		});
	}
}


cache.internal = {}

cache.getId = function(path) {
	return window.escape(path);
}
