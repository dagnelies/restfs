function keepAlive() {
	$.get('api/ftp/alive');
}


function showDonation() {
	$('#donation-dlg').dialog('show');
	alert('If you like it, consider a small donation! ...and get rid of this annoying ad. Thanks.');
};

window.setInterval(keepAlive, 1000 * 60);

//window.setInterval(showDonation, 1000 * 600);

var editor = null;

$(function() {
	console.log('Initializing editor...')
    editor = ace.edit("editor");
    //editor.setTheme("ace/theme/monokai");
    
})