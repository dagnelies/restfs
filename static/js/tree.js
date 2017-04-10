

$.extend($.fn.tree.methods, {
	nav: function (jq, dir) {
		return jq.each(function () {
			var selected = $(this).tree('getSelected');
			if (!selected)
				return;
			var children = $(this).tree('getChildren');
			if (!children.length)
				return;
			
			console.debug(selected);

			if (dir == 'left') {
				if (!$(this).tree('isLeaf', selected.target) && selected.state == "open") {
					// collapse it
					$(this).tree('collapse', selected.target);
				}
				else {
					// move to parent
					var parent = $(this).tree('getParent', selected.target);
					if (parent)
						$(this).tree('select', parent.target);
				}
			} else if (dir == 'right') {
				if (!$(this).tree('isLeaf', selected.target))
					$(this).tree('expand', selected.target);
			} else {
				var index = 0;
				for (var i = 0; i < children.length; i++) {
					if (children[i].target == selected.target) {
						index = i; break;
					}
				}
				if (dir == 'down') {
					if (index == children.length - 1)
						index = 0;
					else while (index < children.length - 1) { 
						index++; 
						if ($(children[index].target).is(':visible'))
							break;
					}
				}
				else if (dir == 'up') {
					if (index == 0)
						index = children.length - 1;
					else while (index > 0) {
						index--;
						if ($(children[index].target).is(':visible'))
							break; 
					}
				}
				if ($(children[index].target).is(':visible')) $(this).tree('select', children[index].target);
			}
		});
	}
});


var dir_tree = null;

$(function() {
	dir_tree = $('#dir_tree').tree({

		loader: function(param, success, error) {
			console.log(">>>>>>>>>>loader");
			console.log(param);
			if( !param || !param.id ) {
				//param = {'id':'/'};
				success([{id:'/',text:'/',state:'closed'}]);
				
				var root = $(this).tree('find', '/').target;
				$(this).tree('select', root);
				$(this).tree('expand', root);
				
				return;
			}
			function parseDirs(data) {
				console.log(data);
				var files = data.files;
				var nodes = [];
				for(var i=0; i<files.length; i++) {
					var f = files[i];
					if( !f.is_directory )
						continue;
					
					var n = {
						id: window.escape(data.path + '/' + f.name),
						text: f.name,
						state: (f.is_directory ? "closed" : "open")
					};
					nodes.push(n);
				}
				success(nodes);
			}
			cache.get(window.unescape(param.id), parseDirs, error);
		},
		
		
		fit:true,		
		animate:true,
		
		onClick: function(e) {
			$(this).focus();
		},
		/*onDblClick: function(node){
			$(this).tree('beginEdit',node.target);
		},*/
		onSelect(node) {
			var path = window.unescape(node.id);
			onSelectTreeDir(path);
		},
		
		accept: '.datagrid-row,.tree-node',
		dropAccept: '.datagrid-row,.tree-node',
		
		dnd:true,
		
		onDragEnter: function(target, source) {
			console.log(target);
			return true;
			//return ( target && target.directory ); // accept drops for directories only
		},
		
		onDrop: function(target,source,point) {
			console.log('Dropping')
			console.log(source);
			console.log(target);
		},
		
		
		onLoadSuccess: function(node, data){
			console.log('dir_tree: onLoadSuccess');
			$(this).find('.tree-node').each(function(){
				var opts = $(this).droppable('options');
				opts.accept = '.tree-node,.datagrid-row';
				var onDragEnter = opts.onDragEnter;
				var onDragOver = opts.onDragOver;
				var onDragLeave = opts.onDragLeave;
				var onDrop = opts.onDrop;

				opts.onDragEnter = function(e,source){
					if ($(source).hasClass('tree-node')){
						onDragEnter.call(this, e, source);
					}
				};
				opts.onDragOver = function(e,source){
					if ($(source).hasClass('tree-node')){
						onDragOver.call(this, e, source);
					} else {
						allowDrop(source, true);
						$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
						$(this).addClass('tree-node-append');

					}
				};
				opts.onDragLeave = function(e,source){
					if ($(source).hasClass('tree-node')){
						onDragLeave.call(this, e, source);
					} else {
						allowDrop(source, false);
						$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
					}
				};
				opts.onDrop = function(e,source){
					if ($(source).hasClass('tree-node')){
						onDrop.call(this, e, source);
					} else {
						console.log(e)
						console.log(source)
						$("#file_list").datagrid('getSelections')
						// ...
					}
				};

				function allowDrop(source, allowed){
					var icon = $(source).draggable('proxy').find('span.tree-dnd-icon');
					icon.removeClass('tree-dnd-yes tree-dnd-no').addClass(allowed ? 'tree-dnd-yes' : 'tree-dnd-no');
				}
			})
		}
		
		
		
		
	});
	
	// addKeyNavigation( dir_tree );
	dir_tree.attr('tabindex', 1).bind('keydown', function (e) {
		console.log(e);
        var selected = dir_tree.tree('getSelected');
        switch (e.keyCode) {
            case 38: // up
                $(this).tree('nav', 'up');
                break;
            case 40: // down
                $(this).tree('nav', 'down');
                break;
            case 39: // right
                $(this).tree('nav', 'right');
                break;
            case 37: // left
                $(this).tree('nav', 'left');
                break;
        }
	});
	
});



