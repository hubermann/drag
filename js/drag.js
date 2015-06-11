$(document).ready(function(){
	$('li').draggable({ containment: 'document', revert: true, 
		start: function(){
		contenido = $(this).data('name');

		}
	});

	$('#receptor').droppable({ hoverClass: 'recibiendo', accept: '.item', drop: function(){
		$('#receptor').append( contenido );
		console.log(contenido);
	}});
});