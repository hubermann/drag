//Guarda en LocalStorage la combinacion creada
function mapearseleccionados(){
	var items = [];
		$('#receptor').each(function(){

    		$(this).find('li').each(function(){
    		items.push( $(this).data('name') );
      		//console.log($(this).data('name'));
    	});
   	
   	console.log(items);
    });

	localStorage.setItem("proyecto", items);		
}

//limpia el receptor
function cleanProyect(){
	localStorage.clear();
}

if (localStorage.getItem("proyecto") ) { 
	//hay proyecto (se re-arma en base a LocalStorage)
	armar();
}else{
	//no hay proyecto previo
	localStorage.setItem("proyecto", "");
}

//Arma en base a localStorage
function armar(){
	var previos = localStorage.getItem("proyecto");
	var previos_array = previos.split(',');
	if(previos_array){
		previos_array.forEach(function(item) {
	    	$('#receptor').append('<li class="draggable ui-draggable-handle" data-name="'+item+'" style=""><img src="imgs/900/'+item+'.jpg" class="imagen ui-droppable"></li>');
		});
	}
	MedirAltoBloques();
}

if(localStorage.getItem("menulateral") == 0){
	
	$( "#ocultable" ).removeClass( "abierto" ).addClass( "cerrado" );
	$( "#contenido" ).removeClass( "contenidoabierto" ).addClass( "contenidocerrado" );
	localStorage.setItem("menulateral", 0);

}else if(localStorage.getItem("menulateral") == 1){
	$( "#ocultable" ).removeClass( "cerrado" ).addClass( "abierto" );
	$( "#contenido" ).removeClass( "contenidocerrado" ).addClass( "contenidoabierto" );
	localStorage.setItem("menulateral", 1);
}