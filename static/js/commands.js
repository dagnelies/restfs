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

	current_selection = items;
	$('#status').html(items.length + ' files selected');
	
	$('#file_view').hide();
	$('#editor').hide();
	
	if( items.length == 1 ) {
		var item = items[0];
		var path = current_path + '/' + item.name;
		if(item.is_directory) {
			// show something?
		} 
		else if( getExt(item) == "txt" ) {
			editor.setValue("Loading...");
			$('#editor').show();
			editor.getSession().setMode("ace/mode/javascript");
			$.get('api/ftp/download?path=' + window.encodeURIComponent(path), function(res) {
				editor.setValue(res,  -1); // -1 to move the cursor at the start of file
			});
		}
		else {
			$('#file_view').attr('src', 'api/ftp/download?path=' + window.encodeURIComponent(path));
			$('#file_view').show();
		}
	}
}

function addDir() {
	
	var dir_tree = $('#dir_tree');
	var selected = dir_tree.tree('getSelected');
	var path = current_path;
	
	console.log('Adding directory to ' + path);
	
	$.messager.prompt('New directory', 'New directory name?', function(name){
        $.ajax({
        	url: '/api/ftp/new_dir?path=' + window.encodeURIComponent(path + '/' + name),
        	method: 'POST',
        	success: function(res) {
        		dir_tree.tree('append', {
        			parent: selected.target,
        			data: [{
        				id: window.escape(path + '/' + name),
        				text: name
        			}]
        		});
        	},
        	error: function(xhr, err, msg) {
        		$.messager.alert('Failed to create directory', msg + ' - ' + err, 'error');
        	}
        });
    });
}


function addFile() {
	
}

function refresh() {
	
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
	console.log(files);
	
	var filenames = {}
	for(var i=0;i<files.length;i++)
		filenames[ files[i].name ] = true;

	for(var i=0;i<current_files.length;i++) {
		var f = current_files[i];
		if(f.name in filenames) {
			console.log('Override existing file(s)?');
			/*
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
			*/
		}
	}
	$('#status').html('Uploading...');
	$.ajax({
        // Your server script to process the upload
        url: 'api/ftp/upload',
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
                    }
                } , false);
            }
            return myXhr;
        },
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

