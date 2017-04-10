var preview = {
  "application": null,
  "application/json": "code",
  "application/xml": "code",
  "application/pdf": "iframe",
  "audio": "iframe",
  "image": "img",
  "message": "mail",
  "multipart": null,
  "text": "code",
  "text/html": "code",
  "video": "video"
};

function getExt(file) {
  if( file.is_directory )
    return 'Directory';
  
  var ext = file.name.split('/').pop().split('.').pop();
  return ext.toLowerCase();
}

function getIconPath(file) {
  return 'img/ext/' + getExt(file) + '.png';
}

function getIconImg(id, file) {
  return '<img src="' + getIconPath(file) + '" />';
}
