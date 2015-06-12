$(document).ready(function(){
	$('li').draggable({ containment: 'document', revert: true, placeholder:'separar', 
		start: function(){
		contenido = $(this).data('name');
		//$('.recibido').addClass('separar'); // leagrego un margen para que sea comodo poner en medio 
		}
	});

	$('#receptor').droppable({placeholder:'separar',accept: '.item', drop: function(){
		$('.recibido').removeClass('separar'); //quito el margen que mostraba para agregar un item
		$('#receptor').append( '<li class="recibido"><img src="imgs/'+contenido+'.jpg" width="100%" /></li>' );
		console.log(contenido);
	}});

});

function recontar(){
	var itemsrecibidos = [];
	$.map($("#receptor").children('li'), function(el){
		console.log( $(el).data('name') );
		//allBlocks.push($(el).data('id')+':'+$(el).data('number'));
	});
}