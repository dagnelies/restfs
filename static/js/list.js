function timestamp2date(ts) {
	var d = new Date(ts);
	return d.toLocaleString();
}

var list_options = {
	/*url:"mock_api/files.json",
	method: "get",
	loadFilter: function(data) { // this is called each time client side sorting happens too!
		if( data.rows )
			return data; 
		return {
			total: data.files.length,
			rows: data.files
		};
	},
	
	showFooter: true,
	*/
	singleSelect: false,
	ctrlSelect:true,
	remoteSort:false,
	
	onClickRow: function(index, row) {
		$(this).datagrid('getPanel').panel('panel').focus();
	},
	onSelect: function(index, row) {
		var rows = $(this).datagrid('getSelections');
		selectItems(rows);
	},
	
	bodyCls:'without-side-borders',
	striped:true,
	fit:true,
	fitColumns:true,
	border:false,
	
	//autoSave: true,
	//onkeypress: function(e){console.log(e);},
	
	onDblClickRow: function(index, row) {
		if( row.is_directory )
			onOpenListDir(row.name);
		else
			openFile(row.name);
	},
	
	dragSelection: true,
	onRowContextMenu: showContextMenu,
	onLoadSuccess: function (data) {
		console.log('Hey!');
		console.log(data);
		$(this).datagrid('enableDnd');
    },
	onDragEnter: acceptDrop,
	onDragEnter: acceptDrop,

	dropAccept: '.datagrid-row,.tree-node',
	onDrop: function(target,source,point) {
		console.log('Dropping')
		console.log(source);
		console.log(target);
	}
};

$(function() {
	var dg = $('#file_list').datagrid(list_options);
	// when double click a cell, begin editing and make the editor get focus
	/*dg.datagrid({
		onDblClickCell: function(index,field,value){
			$(this).datagrid('beginEdit', index);
			var ed = $(this).datagrid('getEditor', {index:index,field:field});
			$(ed.target).focus();
		}
	});
	*/
	addKeyNavigation( dg );
	
	list_options.showHeader = false;
	list_options.striped = false;
	list_options.rowStyler = function(index,row){ return {'class':'tile'}; };
	var il = $('#icons_list').datagrid(list_options);
	
	addKeyNavigation( il );
	
});

function addKeyNavigation(dg) {
	dg.datagrid('getPanel').panel('panel').attr('tabindex',2).bind('keydown',function(e){
		var selected = dg.datagrid('getSelected');
		if (!selected)
			return;
		var index = dg.datagrid('getRowIndex', selected);
		var total = dg.datagrid('getRows').length;
		
		switch(e.keyCode){
			case 38:	// up
				if(index == 0)
					return;
				dg.datagrid('unselectAll');
				dg.datagrid('selectRow', index-1);
				break;
			case 40:	// down
				if(index == total - 1)
					return;
				dg.datagrid('unselectAll');
				dg.datagrid('selectRow', index+1);
				break;
			case 13:	// enter
			case 113:	// F2
				dg.datagrid('beginEdit', index);
				break;
		}
	});
}


function acceptDrop( target, source ) {
	return (target && target.is_directory);
}