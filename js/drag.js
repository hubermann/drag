

function recontar(){
	var itemsrecibidos = [];
	$.map($("#receptor").children('li'), function(el){
		console.log( $(el).data('name') );
		
	});
}