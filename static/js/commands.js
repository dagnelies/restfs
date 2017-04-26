var current_path = "/";
var current_selection = [];

// when selecting a diretory in the tree
function onSelectTreeDir(path) {
	current_path = path;
	selectItems([]);
	$('#status').html(path);
	cache.get(path, function(data) {
		console.debug(data);
		var content =  {
			total: data.files.length,
			rows: data.files
		};
		$('#file_list').datagrid('loadData', content);
		$('#icons_list').datagrid('loadData', content);
		
	});
}

function showContextMenu(e, node) {
	console.log(e);
	e.preventDefault();
	//$(???).tree('select', node.target);
	$('#mm').menu('show', {
		left: e.pageX,
		top: e.pageY
	});
}

// when double clicking on a directory in the list/icons view
function onOpenListDir(name) {
	console.log("Opening directory: " + current_path + "/" + name);
	
	selectItems([]);
	$('#status').html('Opening ' + current_path + '/' + name + '...');
	
	var id = window.escape(current_path + "/" + name);
	var sel = dir_tree.tree('getSelected');
	dir_tree.tree('expand', sel.target);
	dir_tree.tree('select', dir_tree.tree('find', id).target);
	
}

function openFile(name) {
	//console.log("Opening directory: " + current_path + "/" + name);
	
}

function selectItems(items) {

	$("#save-button").removeClass("c6");
	$("#save-button").prop('disabled', true);
	
	current_selection = items;
	$('#status').html(items.length + ' files selected');
	
	$('#file_view').hide();
	$('#editor').hide();
	
	if( items.length == 1 ) {
		var item = items[0];
		var path = current_path + '/' + item.name;
		if(item.type == 'dir') {
			// show something?
			return;
		} 
		var url = '/@api/read?path=' + window.encodeURIComponent(path);
		$.ajax({
			url: url,
			converters: null,
			dataFilter: null,
			dataType: 'text',
			success: function(res, a, xhr) {
				console.debug(xhr);
				var mime_type = xhr.getResponseHeader('content-type');
				showFile(url, mime_type, res);
			}
		});
		/*
		else if( getExt(item) == "txt" ) {
			editor.setValue("Loading...");
			$('#editor').show();
			editor.getSession().setMode("ace/mode/javascript");
			$.get('/@api/download?path=' + window.encodeURIComponent(path), function(res) {
				editor.setValue(res,  -1); // -1 to move the cursor at the start of file
			});
		}
		else {
			$('#file_view').attr('src', '/@api/download?path=' + window.encodeURIComponent(path));
			$('#file_view').show();
		}
		*/
	}
}




var DEFAULT_HANDLER = {
  "editor": false,
  "preview": false
};

var handlers = {
  "application": {
    "editor": true,
    "preview": false
  },
  "application/json": {
    "editor": true,
    "preview": false
  },
  "application/xml": {
    "editor": true,
    "preview": false
  },
  "application/pdf": {
    "editor": false,
    "preview": true
  },
  "audio": {
    "editor": false,
    "preview": true
  },
  "example": {
    "editor": false,
    "preview": false
  },
  "image": {
    "editor": false,
    "preview": true
  },
  "message": {
    "editor": false,
    "preview": true
  },
  "multipart": {
    "editor": false,
    "preview": false
  },
  "text": {
    "editor": true,
    "preview": false
  },
  "text/html": {
    "editor": true,
    "preview": true
  },
  "video": {
    "editor": false,
    "preview": true
  }
};

function getHandler(mime_type) {
  mime_type = mime_type.split(';')[0];
  if( mime_type in handlers )
    return handlers[mime_type];
    
  mime_type = mime_type.split('/')[0];
  if( mime_type in handlers )
    return handlers[mime_type];
  
  return DEFAULT_HANDLER;
}



function showFile(url, mime_type, data) {
	console.debug(url);
	console.debug(mime_type);
	//console.debug(data);

	var h = getHandler(mime_type);

	if( h.editor ) {
		editor.setValue("Loading...",  -1); // -1 to move the cursor at the start of file
		$('#editor').show();
		var mode = modelist.getModeForPath(url).mode;
		editor.session.setMode(mode);
		editor.setValue(data,  -1); // -1 to move the cursor at the start of file
	}
	else if( h.preview ) {
		$('#file_view').attr('src', url);
		$('#file_view').show();
	}

}

function addDir() {
	
	//var dir_tree = $('#dir_tree');
	//var selected = dir_tree.tree('getSelected');
	//var path = current_path;
	
	console.log('Adding directory to ' + current_path);
	
	$.messager.prompt('New directory', 'New directory name?', function(name){
        $.ajax({
        	url: '/@api/mkdir?path=' + window.encodeURIComponent(current_path + '/' + name),
        	method: 'POST',
        	success: function(res) {
        		/*dir_tree.tree('append', {
        			parent: selected.target,
        			data: [{
        				id: window.escape(path + '/' + name),
        				text: name
        			}]
        		});*/
				refresh();
        	},
        	error: function(xhr, err, msg) {
        		$.messager.alert('Failed to create directory', msg + ' - ' + err, 'error');
        	}
        });
    });
}


function addFile() {
	console.log('Adding file to ' + current_path);
	
	$.messager.prompt('New file', 'New file name?', function(name){
        $.ajax({
        	url: '/@api/mkfile?path=' + window.encodeURIComponent(current_path + '/' + name),
        	method: 'POST',
        	success: function(res) {
        		/*dir_tree.tree('append', {
        			parent: selected.target,
        			data: [{
        				id: window.escape(path + '/' + name),
        				text: name
        			}]
        		});*/
				refresh();
        	},
        	error: function(xhr, err, msg) {
        		$.messager.alert('Failed to create directory', msg + ' - ' + err, 'error');
        	}
        });
    });
}

function refresh() {
	var selected = dir_tree.tree('getSelected');
	cache.get(current_path, function() {
		dir_tree.tree('toggle', selected.target);
		dir_tree.tree('toggle', selected.target);
	}, null, true);
}


function rename() {
	
}


// invoked through drag & drop
function move() {
	
}

function cut() {
	
}


function copy() {
	
}


function paste() {
	
}

function download() {
	
}

function upload() {
	$('#upload-input').click()
}

function do_upload(files) {
	console.log('Uploading...');
	console.log(files);
	
	var filenames = {}
	for(var i=0;i<files.length;i++)
		filenames[ files[i].name ] = true;
	/*
	for(var i=0;i<current_files.length;i++) {
		var f = current_files[i];
		if(f.name in filenames) {
			console.log('Override existing file(s)?');
			
			$.messager.confirm('Confirm','Override existing file(s)?', function(res){
				if(res){
					console.log('Proceed with upload');
					break;
				}
				else {
					console.log('Abord upload');
					return;
				}
			});
			
		}
	}
	*/
	$('#status').html('Uploading...');
	$('#upload-dlg').window('open');
	$.ajax({
        // Your server script to process the upload
        url: '@api/upload?path=' + window.encodeURIComponent(current_path),
        type: 'POST',

        // Form data
        data: new FormData($('#upload-form')[0]),

        // Tell jQuery not to process data or worry about content-type
        // You *must* include these options!
        cache: false,
        contentType: false,
        processData: false,

        // Custom XMLHttpRequest
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                // For handling the progress of the upload
                myXhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
						var p = Math.floor(100 * e.loaded / e.total);
						$('#status').html('Uploading... ' + p + '%' + ' (' + e.loaded + '/' + e.total + ')');
						$('#upload-progress').progressbar('setValue', p);
                    }
                } , false);
            }
            return myXhr;
        },
		success: function(res) {
			$('#upload-dlg').window('close');
		},
		error: function(xhr, err, msg) {
			$('#upload-dlg').window('close');
		}
    });
}


function read() {
	
}

function write() {
	
}


function remove() {
	
}


function logout() {
	
}

