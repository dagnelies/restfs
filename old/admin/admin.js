/* global $ */
/* global ace */

var files_url = '/@files/';

var tree = null;

var listing = null;
var editor = null;
var preview = null;

var CWD = '/'; // current working directory

var modelist = ace.require("ace/ext/modelist");

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

function init() {
  tree = $('#filetree').jstree({
    core : {/*
      data: {
        url: function (node) {
          return files_url  + (node.id === '#' ? '' : node.id) + '?jstree=true';
        }
      },*/
      data: function(node, callback) {
        if( node.id === '#' ) {
          var root = {
              id: '/',
              text: '/',
              children: true,
              icon: getIconPath({'type': 'dir'})
            };
            callback([root]);
            return;
        }
        var path = node.id === '#' ? '' : node.id;
        var url = files_url + 'list?path=' + path;
        function files2nodes(files) {
          var nodes = [];
          for( var i=0; i<files.length; i++ ) {
            var f = files[i];
            var n = {
              id: path + '/' + f.name,
              text: f.name,
              children: (f.type === 'dir'),
              icon: getIconPath(f)
            };
            nodes.push(n);
          }
          callback(nodes);
        }
        $.get(url, null, files2nodes, 'json');
      },
      check_callback : function (operation, node, node_parent, node_position, more) {
        console.debug(operation);
        // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
        // in case of 'rename_node' node_position is filled with the new node name
        return operation === 'move_node' ? true : false;
      },
      
    },
    plugins : [ "dnd" ],
    dnd: {
      use_html5: true
    }
  });

  listing = document.getElementById('listing');
  editor = ace.edit('editor');
  preview = document.getElementById('preview');
  
  hideListing();
  hideEditor();
  hidePreview();
  
  
  /* global Split */
  Split(['#left_panel', '#center_panel'], {sizes: [20, 80]});
  
  tree.on('changed.jstree', onSelect);
  
}

$().ready(init);

function getExt(file) {
  if( file.type === 'dir' )
    return 'Directory';
  
  var ext = file.name.split('/').pop().split('.').pop();
  return ext.toLowerCase();
}

function getIconPath(file) {
  return '/ext/' + getExt(file) + '.png';
}

function getIconImg(file) {
  return '<img src="' + getIconPath(file) + '" />';
}



function onSelect(event, data) {
  console.debug(data);
  
  var is_leaf = data.instance.is_leaf(data.node); // it's crooky but I didn't made jstree's API
  
  hideListing();
  hidePreview();
  hideEditor();
  
  CWD = data.node.id;
  var url = '/@files/' + (is_leaf ? 'read' : 'list') + '?path=' + CWD;
  
  $.ajax({
    url: url,
    converters: null,
    dataFilter: null,
    dataType: 'text',
    success: function(res, a, xhr) {
      console.debug(xhr);
      if( is_leaf ) {
        var mime_type = xhr.getResponseHeader('content-type');
        showFile(url, mime_type, res);
      }
      else {
        var files = JSON.parse(res);
        showDir(files);
      }
    }
  });
}

function showFile(url, mime_type, data) {
  console.debug(url);
  console.debug(mime_type);
  console.debug(data);
  
  var h = getHandler(mime_type);
  
  if( h.preview )
    showPreview(url);
  
  if( h.editor )
    showEditor(url, data);
}


function showDir(files) {
  console.debug(files);
  showListing(files);
}

function showListing(files) {
  $('#listing-table').DataTable( {
        destroy: true, // erases content if already initialized
        data: files,
        paging: false,
        //searching: false,
        select: true,
        columns: [
            { orderable: false, render: function(data, type, row) { return getIconImg(row); } },
            { data: "name", title: "Name" },
            { title: "Type", render: function(data, type, row) { return getExt(row); }  },
            { data: "last_modified", title: "Last modified" },
            { data: "size", title: "Size"}
        ]
    } );
    listing.hidden = false;
}

function hideListing() {
  
  listing.hidden = true;
}

function hidePreview() {
  preview.hidden = true;
}

function showPreview(url) {
  preview.hidden = false;
  preview.src = url;
}

function hideEditor() {
  editor.setValue('', -1);
  editor.container.hidden = true;
}

function showEditor(path, content) {
  
  var mode = modelist.getModeForPath(path).mode;
  editor.session.setMode(mode);
  
  editor.container.hidden = false;
  editor.setValue(content, -1); // -1 to move the cursor at the start of file
}

function addDir() {
  var name = prompt("Dir name?");
  var url = files_url + 'mkdir?path=' + CWD + '/' + name;
  $.post(url);
}

function addFile() {
  var name = prompt("Dir name?");
  var url = files_url + 'write?path=' + CWD + '/' + name;
  $.post(url);
}


function update() {
  // update relative to CWD
  // updates tree
  // updates listing if shown
  // updates gallery if shown
}

/*
$('#filetree').on('drop', function(event) {
   //stop the browser from opening the file
   event.preventDefault();
   var files = event.originalEvent.dataTransfer.files;
})

var file_drop = document.body
file_drop.addEventListener(
  'dragover',
  function(evt) {
    evt.preventDefault()
    evt.dataTransfer.dropEffect = 'copy'
  }
)
file_drop.addEventListener(
  'drop',
  function(evt) {
    evt.preventDefault()
    var files = evt.dataTransfer.files  // FileList object.
    var file = files[0]                 // File     object.
    alert(file.name)
  }
)
*/