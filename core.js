$(function(e) {

var opcionesDeOrden = { 
		opacity:0.75,
		placeholder: "placeholder",
		revert:300,
		distance: 10,
		refreshPositions: true,
		start: function(event, ui){
			$('.placeholder').height(ui.item.context.clientHeight);
			MedirAltoBloques();
		},
		out: function( event, ui ){
			setTimeout(function(){
				MedirAltoBloques();
			},50);
		},
		over: function( event, ui ){
			MedirAltoBloques();
		},
		stop: function( event, ui ){
			if (window.droppedData){
				$(ui.item).attr('style','').find('img').attr('src',$(ui.item).attr('style','').find('img').attr('src').replace('180','900'));
			}
		}
	};
    $("#receptor").sortable(opcionesDeOrden).on( "sortstop", function( event, ui ) {
	
		MedirAltoBloques();
		mapearseleccionados();
	});
	
	//Items arrastrables
	var opcionesDeArrastrables = {
		connectToSortable: "#receptor",
		addClasses: false,
		scope: "#receptor",
		helper: "clone",
		appendTo: 'body',
		distance: 50,
		drag: function(event, ui){
			setTimeout(function(){
				$('#receptor li.placeholder').attr('style','height:140px');
			},50);
			$(window).mousemove(function( event ) {
				var windowY = event.pageY - $(window).scrollTop();
				var windowX = event.pageX;
				
				$('.ui-draggable-dragging').css('top',$(window).scrollTop() + windowY - 50).css('left',windowX-50).css('width','100px!important');
				//var precentage = windowX / $(window).width();
			});
		},
		start: function(event, ui){
			
        	window.droppedData = 'dragStart';
			draggingElement = $('.ui-draggable-dragging img');
			if (draggingElement.height() > 140)
				draggingElement.height('140px');
			
		},
		stop: function(event, ui){
			setTimeout (function(){
	        	window.droppedData = '';
			},500);
			
			$('.placeholder').height($('.ui-draggable-dragging img').attr('src',draggingElement.attr('src').replace('180','900')).removeAttr('style').height());
			
			mapearseleccionados();
		}
    };
	$('img').on('dragstart', function(event) { event.preventDefault(); });

	$( "#ocultable .draggable" ).draggable(opcionesDeArrastrables).click(function(){
		
	});
	 
	/* Eliminar items  */
	$('#ocultable').droppable({
		accept: "#receptor li",
		activeClass: "active",
		hoverClass: "hovered",
		tolerance: "touch",
		drop: function(event, ui) {
			$(ui.draggable).remove();
			$('.placeholder').animate({height:0,opacity:0,borderWidth:0}, 250);
			mapearseleccionados();
        }
    });
	
	$('#ocultable img').droppable({
		drop: function( event, ui ) {
			$( this ).siblings( ".placeholder" ).remove();
			$( "<li></li>" ).text( ui.draggable.text() ).insertAfter( this );
		}
	});

 }); //end init function

//Ajustar el wrapper al alto de los bloques
function MedirAltoBloques(){
	if ($("#receptor li").length){
		$('#receptor').removeClass('empty');
		$('#receptorWrapp').removeClass('hide-ui');
	} else {
		$('#receptor').addClass('empty');
		$('#receptorWrapp').addClass('hide-ui');
	}	
}