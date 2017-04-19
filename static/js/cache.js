var cache = {}

cache.get = function(path, success, failure, refresh) {
	if(!refresh && path in cache.internal) {
		console.log('Loading ' + path + ' from cache');
		var data = cache.internal[path];
		success(data);
	}
	else {
		console.log('Fetching ' + path + ' into cache');
		$.get('@api/list', {path: path}).then( function(data) {
			console.log(data);
			cache.internal[path] = data;
			success( data );
		}, function(xhr, err, msg) {
			console.warn(err + ' ' + msg);
			$.messager.alert('Confirm', err + ' ' + msg);
		});
	}
}


cache.internal = {}

cache.getId = function(path) {
	return window.escape(path);
}
