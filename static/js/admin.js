var editor = null;
var modelist = null;

var api = {
	base: "/@api",
	list: "/list",
	
}


$(function() {
	console.log('Initializing editor...')
	editor = ace.edit("editor");
	//editor.setTheme("ace/theme/monokai");
	modelist = ace.require("ace/ext/modelist");
	editor.getSession().on('change', function(e) {
		$("#save-button").addClass("c6");
		$("#save-button").prop('disabled', false);
	});
	changeTheme('black');
});



function keepAlive() {
	$.get('@api/alive');
}


function showDonation() {
	$('#donation-dlg').dialog('show');
	alert('If you like it, consider a small donation! ...and get rid of this annoying ad. Thanks.');
};

window.setInterval(keepAlive, 1000 * 60);

//window.setInterval(showDonation, 1000 * 600);


function changeTheme(theme){
	console.log('Changing theme: ' + theme);
	var link = $('head').find('link:first');
	link.attr('href', 'libs/easyui/themes/' + theme + '/easyui.css');
}