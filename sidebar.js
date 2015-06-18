var ocultable = document.getElementById( 'ocultable' ),
	showMenu= document.getElementById( 'showMenu' ),
	showLeftPush = document.getElementById( 'showLeftPush' ),
	body = document.body;
	
//Funciones menu (ocultar mostrar)
showMenu.onclick = function() {
	if ($('#ocultable').hasClass('abierto')) {
    	$( "#ocultable" ).removeClass( "abierto" ).addClass( "cerrado" );
		$( "#contenido" ).removeClass( "contenidoabierto" ).addClass( "contenidocerrado" );
		localStorage.setItem("menulateral", 0);
	}else{
		$( "#ocultable" ).removeClass( "cerrado" ).addClass( "abierto" );
		$( "#contenido" ).removeClass( "contenidocerrado" ).addClass( "contenidoabierto" );
		localStorage.setItem("menulateral", 1);
	}
};