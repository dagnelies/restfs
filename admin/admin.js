/* global $ */
/* global ace */

var files_url = '/@files/'
var views_url = '/@files/'
var editor = null
//var editor_container = $('#editor_container')
var preview = null
var tree = null

var modelist = ace.require("ace/ext/modelist")

var DEFAULT_HANDLER = {
  "editor": false,
  "preview": false
}

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
}

function getHandler(mime_type) {
  mime_type = mime_type.split(';')[0]
  if( mime_type in handlers )
    return handlers[mime_type]
    
  mime_type = mime_type.split('/')[0]
  if( mime_type in handlers )
    return handlers[mime_type]
  
  return DEFAULT_HANDLER
}

function init() {
  tree = $('#filetree').jstree({
    core : {
      data: {
        url: function (node) {
          return files_url  + (node.id === '#' ? '' : node.id) + '?jstree=true';
        }
      },
      check_callback : function (operation, node, node_parent, node_position, more) {
        console.log(operation)
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

  
  editor = ace.edit("editor");
  preview = document.getElementById('preview')
  
  tree.on('changed.jstree', onSelect)
  
}

$().ready(init)

function getExt(path) {
  return path.split('/').pop().split('.').pop()
}

var text = []
var binary = ['png']

function onSelect(event, data) {
  console.debug(data)
  
  hidePreview()
  hideEditor()
  
  var path = data.node.id
  var url = '/@files/' + path
  
  
  function onSuccess(res, a, xhr) {
    console.debug(xhr)
    showFile(url, xhr.getResponseHeader('content-type'), res)
  }

  $.ajax({
    url: url,
    converters: null,
    dataFilter: null,
    dataType: 'text',
    success: onSuccess
  })
}

function showFile(url, mime_type, data) {
  console.debug(url)
  console.debug(mime_type)
  console.debug(text)
  
  var h = getHandler(mime_type)
  
  if( h.preview )
    showPreview(url)
  
  if( h.editor )
    showEditor(url, data)
}

function hidePreview() {
  preview.hidden = true //.hide()
}

function showPreview(url) {
  preview.hidden = false //.show()
  preview.src = url //prop('src', url)
}

function hideEditor() {
  editor.setValue('', -1)
  //editor_container.hide()
  //editor.container.style.display = "none" 
  editor.container.hidden = true
}

function showEditor(path, content) {
  
  var mode = modelist.getModeForPath(path).mode
  editor.session.setMode(mode)
  
  //editor.container.style.display = "block" //show()
  editor.container.hidden = false
  editor.setValue(content, -1) // -1 to move the cursor at the start of file
  
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