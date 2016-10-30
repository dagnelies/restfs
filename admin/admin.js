var files_url = '/@files/'
var views_url = '/@files/'
var editor = null
var tree = null

var modelist = ace.require("ace/ext/modelist")

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
  editor.setValue('')
  
  var path = data.node.id
  var mode = modelist.getModeForPath(path).mode
  var ext = getExt(path)
  
  
  editor.session.setMode(mode)
  
  $.ajax({
    url: '/@files/' + data.node.id,
    converters: null,
    dataFilter: null,
    dataType: 'text',
    success: updateEditor
  })
  $('#view').prop('src', views_url + data.node.id)
  //var modelist = ace.require("ace/ext/modelist")
  //var mode = modelist.getModeForPath(data.node.text).mode
  //editor.session.setMode(mode)
}

function updateEditor(res, a, xhr) {
  console.debug(res)
  console.debug(xhr)
  var type = xhr.getResponseHeader('content-type')
  console.debug(type)
  if( type )
    type = type.split('/')[0]
  
  if( ['text', 'application', 'message'].indexOf(type) >= 0 ) {
    editor.setValue(res, -1) // -1 to move the cursor at the start of file
  }
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