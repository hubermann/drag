//code
$(document).ready(function(e) {
	
	//SETTINGS
	var blocks = 	[
					{"id":"0","type":"header","count":"22","name":"Headers"}, 
					{"id":"1","type":"content","count":"37","name":"Content"}, 
					{"id":"2","type":"price","count":"4","name":"Price Tables"}, 
					{"id":"3","type":"projects","count":"3","name":"Projects"}, 
					{"id":"4","type":"contacts","count":"4","name":"Contacts"}, 
					{"id":"5","type":"crew","count":"3","name":"Crew"}, 
					{"id":"6","type":"blog","count":"4","name":"Blogs"}, 
					{"id":"7","type":"footer","count":"14","name":"Footer"}
					];
					
	
	var maxBlocks = 30;
		
	//Check URL's Hash
	var urlHash = window.location.hash.substring(1);
	if (urlHash){
		addSample();
	}
	
	//Create Submenu From Array	
	blocks.forEach(function(element){
		$('#subMenu').append('<ul id="'+element.type+'"></ul>');
		var blocksRows = [];
		for (i = 0; i <= element.count; i++){
			var elNum = i + 1;
			blocksRows.push('<li data-id="'+element.id+'" data-name="'+element.type+'" data-number="'+elNum+'"><span>'+element.type+' #'+elNum+'</span><img src="components/270/'+element.type+'-'+elNum+'.jpg"></li>');
		}
		$('#subMenu ul#'+element.type).append(blocksRows.join('\n\n'));
	});
	blocksRows = []; //clear array
	
	// Add Sample by String
	function addSample(string){
		
		if (!string) {
			var params = $.getUrlVars();
			var structure = params.structure;
		
			if (params.name){
				var projectName = params.name.split('_').join(' ');
				$('#project').val(projectName.substring(0,maxLetters));	
			}
		}
		
		//should be like
		
		if (structure){
			var parts = structure.split(',').slice(0,maxBlocks);
			parts.forEach(function(block){
				var types = block.split(':');
				if ($.isArray(types)){
					var id = types[0];
					if (blocks[id]  !== undefined ) {
						var name = blocks[id].type;
						var number = types[1];
						if($.isNumeric(number, name)) {
							$('#blocks').removeClass('empty').append('<li data-id="'+id+'" data-name="'+name+'" data-number="'+number+'"><span>'+name+' #'+number+'</span><img src="components/900/'+name+'-'+number+'.jpg"></li>');
						}
					}
				}
			});
		}
		
		$("#sortable").sortable("refresh");
		checkBlocksHeight();
		updateHash();
	}
	
	//Update asd
	function updateHash(){
		
		var urlParts = []

		//get structure
		var blocks = [];
		$.map($("#blocks").children('li'), function(el){
			blocks.push( $(el).data('id') + ':' + $(el).data('number') );
		});
		
		if (blocks.length > 0) {
			var hashURL = "structure=" + blocks.join(',');
		}
		
		if (hashURL) {
			
			urlParts.push(hashURL);
		
			//get name
			var projectName = $('#project').val().trim();
			if (projectName) {
				projectName = encodeURIComponent( projectName.split(' ').join('_') );
				projectName = "name="+projectName;	
				urlParts.push(projectName)
			}
			
			window.location.hash = urlParts.join('&');
		} else {
			window.location.hash = "";
		}
	}	
	
	//SORT AND DRAG
	//Make Blocks Sotrable
	var sortableParams = {
		opacity:0.75,
		placeholder: "placeholder",
		revert:300,
		distance: 10,
		refreshPositions: true,
		start: function(event, ui){
			$('.placeholder').height(ui.item.context.clientHeight);
			checkBlocksHeight();
		},
		out: function( event, ui ){
			setTimeout(function(){
				checkBlocksHeight();
			},50);
		},
		over: function( event, ui ){
			checkBlocksHeight();
		},
		stop: function( event, ui ){
			if (window.droppedData){
				$(ui.item).attr('style','').find('img').attr('src',$(ui.item).attr('style','').find('img').attr('src').replace('270','900'));
			}
		}
	};
    $("#blocks").sortable(sortableParams).on( "sortstop", function( event, ui ) {
		updateHash();
		checkBlocksHeight();
	});
	
	//Make Menu Items Draggable	
	var draggableParams = {
		connectToSortable: "#blocks",
		addClasses: false,
		scope: "#blocks",
		helper: "clone",
		appendTo: 'body',
		distance: 50,
		drag: function(event, ui){
			setTimeout(function(){
				$('#blocksHolder #blocks li.placeholder').attr('style','height:100px');
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
			if (draggingElement.height() > 100)
				draggingElement.height('100px');
			
		},
		stop: function(event, ui){
			setTimeout (function(){
	        	window.droppedData = '';
			},500);
			
			$('.placeholder').height($('.ui-draggable-dragging img').attr('src',draggingElement.attr('src').replace('270','900')).removeAttr('style').height());
			
			checkMaxSize();
		}
    };
	$('img').on('dragstart', function(event) { event.preventDefault(); });
	
	$( "#subMenu li" ).draggable(draggableParams).click(function(){
		//Clickable
		if ($("#blocks li").size() < maxBlocks) {
		
			var newElement = $(this).clone().appendTo($('#blocks')).find('img').attr('src',$(this).attr('style','').find('img').attr('src').replace('270','900'));
			newElement.load(function(e) {
				setTimeout(function(){
					var position = $('#blocks li:last-child').position();
					$('body').finish().animate({scrollTop: position.top},500);
				}, 250);
			});
			
			$("#sortable").sortable("refresh");
			checkBlocksHeight();
			updateHash();
			checkMaxSize();
		}
	});
	
	//Trash Objects
	$('#sideMenu').droppable({
		accept: "#blocks li",
		activeClass: "active",
		hoverClass: "hovered",
		tolerance: "touch",
		drop: function(event, ui) {
			$(ui.draggable).remove();
			$('.placeholder').animate({height:0,opacity:0,borderWidth:0}, 250);
			checkMaxSize();
        }
    });
	
	$('#sideMenu img').droppable({
		drop: function( event, ui ) {
			$( this ).siblings( ".placeholder" ).remove();
			$( "<li></li>" ).text( ui.draggable.text() ).insertAfter( this );
		}
	});
	
	//Change Size of Blocks Holder
	function checkBlocksHeight(){
		if ($("#blocks li").length){
			$('#blocks').removeClass('empty');
			$('#blocksHolder').removeClass('hide-ui');
			$('.footer').addClass('hidden');
		} else {
			$('#blocks').addClass('empty');
			$('#blocksHolder').addClass('hide-ui');
			$('.footer').removeClass('hidden');
		}	
	}
	
	//Max Size
	function checkMaxSize(){
		if ($("#blocks li:not(.placeholder)").size() < maxBlocks) {
			$('#sideMenu').removeClass('disabled');
		} else {
			$('#sideMenu').addClass('disabled');
		}
	}
	
	checkBlocksHeight();
	checkMaxSize();
	
	
	//Ajax Share 
	$('#share').mousedown(function() {
		var signature = $(this).data('signature');
		var timestamp = $(this).data('timestamp');
		
		var url = "http://dsm.am/yourls-api.php?timestamp="+timestamp+"&signature="+signature+"&action=shorturl&format=jsonp&url="+encodeURIComponent(window.location.href);
		
		$.ajax({
			type: "GET",
			crossDomain : true,
			dataType: 'jsonp',
			url: url
		})
		.done(function(data) {
			$('#shareurl').attr('value',data.shorturl).removeClass('notgenerated');
			
			$('#twitter').unbind().click(function(){
				var text = "Check out my project that I’ve created with Generator for Startup Framework! ";
				openWindow('https://twitter.com/intent/tweet?source=webclient&text=' + text + data.shorturl,630,360);
			});
			$('#facebook').unbind().click(function(){
				openWindow('http://www.facebook.com/sharer.php?u='+data.shorturl,630,360);
			});
			$('#google').unbind().click(function(){
				openWindow('https://plus.google.com/share?url='+data.shorturl,630,360);
			});
			
			var mailSubject = encodeURIComponent("Check out the project!");
			var mailBody = encodeURIComponent("Hey,\n\nDid you see Generator for Startup Framework? We can use it for our project. Check this out: ");
			
			
			$('#email').attr('href','mailto:?Subject=' + mailSubject + '&Body=' + mailBody + data.shorturl);
		});
		
		$('#sharewindow').removeAttr('style').removeClass('hidden');
		$('body').addClass('noscroll');
	});
	
	$('.twitter').click(function(){
		url = "http://designmodo.com/generator/";
		var text = "Generator for Startup Framework: Easy way to make a landing page for your startup ";
		openWindow('https://twitter.com/intent/tweet?source=webclient&text=' + text + url,630,360);
	});
	
	$('.facebook').click(function(){
		url = "http://designmodo.com/generator/";
		openWindow('http://www.facebook.com/sharer.php?u='+url,630,360);
	});
	
	//Export
	$('.download').click(function(event) {
		
		if (!$('.download').hasClass('preloader')) {
		
			var allBlocks = [];
			$.map($("#blocks").children('li'), function(el){
				allBlocks.push($(el).data('id')+':'+$(el).data('number'));
			});
			
			allBlocks = allBlocks.join(',');
			
			var projectName = $('#project').val();
			
			if (!projectName) { projectName == 'untitled';}
			
			if (allBlocks){
				$('.download').addClass('preloader').text('Working...').append('<span class="progress"></span>');
				$.post('generator.php', {
					structure: allBlocks,
					name: projectName
				}, function(data) {
					if (data.error) {
						$('.download').removeClass('preloader').text('Export HTML/CSS');
						if (data.error.code == 763424){
							$('#loginwindow').removeAttr('style').removeClass('hidden');
							$('body').addClass('noscroll');
							$('#loginwindow .videobg').get(0).play();
						} else if (data.error.code == 373845){
							$('#promowindow').removeAttr('style').removeClass('hidden');
							$('body').addClass('noscroll');
							$('#promowindow .videobg').get(0).play(); 
						} else if (data.error.code == 499259){
							$('#addlicensewindow').removeAttr('style').removeClass('hidden');
							$('body').addClass('noscroll');
						}
					} else if (data.result){
						window.location = data.result;
						$('.download').removeClass('preloader').text('Done!');
					}
				}, 'json').done(function(){
					setTimeout(function(){
						$('.download').removeClass('preloader').text('Export HTML/CSS');
					},2000);
				});
			}
		}
	});
	
	$('.window .loginform').hover(function(){ 
		$(this).removeClass('collapsed');
		$('.window .promo').addClass('collapsed');
	}, function(){
	});
	
	$('.window .promo').hover(function(){ 
		$(this).removeClass('collapsed');
		$('.window .loginform').addClass('collapsed');
	}, function(){
		
	});
	
	//Ajax Login 
	$('#loginform').ajaxForm({ 
		url: "../wp-admin/admin-ajax.php?action=dm_startup_login",
		success: function(data){
			data = JSON.parse(data);
			if(data.success == true){
				$('#loginwindow').hide().addClass('hidden');
				$('.download').click();
			} else {
				
				if ($('.errors div').exists()){
					$('.errors div').remove();
					clearTimeout(window.removeInterval);
				}
				if (data.error == 100){
					$('.errors').append('<div class="red e100">Incorrect Username or Password</span></div>');
					$('#password').val('');
				} else if (data.error == 200){
					$('.errors').append('<div class="red e200>Invalid Username</span></div>');
					$('#login').val('').focus();
				} else if (data.error == 300){
					$('.errors').append('<div class="red e300">Password Required</span></div>');
					$('#password').focus();
				} else if (data.error == 400){
					$('.errors').append('<div class="red e400">Username Required</span></div>');
					$('#login').focus();
				} else if (data.error == 500){
					$('.errors').append('<div class="red e500">Username & Password Required</span></div>');
					$('#login').focus();
				}
				
				window.removeInterval = setTimeout(function(){
					$('.errors div').addClass('hide');
					setTimeout(function(){
						$('.errors').empty();
					},250);
				},4000);
			}
		}
	});
	
	//add button
	var url = "../wp-admin/admin-ajax.php?action=dm_startup_api";
		
	$.ajax({
		type: "GET",dataType: 'json',url: url
	})
	.done(function(data) {
		if(data.status == 'purchased') $('.aboutMenu ul').append('<li class="getsf"><a target="_blank" href="/startup/?add-to-cart=109981">Add License</a></li>');
	});
	
	//Name for Project
	var maxLetters = 35;
	$('#project').bind('keyup keydown resize',function() {
		if ($('#project').val().length > maxLetters) $('#project').val($('#project').val().substring(0,maxLetters));
		updateHash();
	});
	
	//New Project
	$('.clear').click(function() {
		setTimeout(function(){
			if (confirm('You are about to start a new project. Continue?')){
				$("#blocks").empty();
				$("#project").val('').focus();
				
				checkBlocksHeight();
				checkMaxSize();
				updateHash();
				
				$('body').removeClass('preview');	
				setTimeout(function(){
					$('#subMenu').removeClass('hidden');
					$('#header').addClass('visible');
					$('#sideMenu ul li:first-child').addClass('selected');
				},500);
			}
		},250);
	});
	
	//UX STUFF
	//Hide any window on click
	$('.overlay').click(function(event) {
		if (!$(event.target).closest('.window, .errors').length) {
			$(this).hide().addClass('hidden');
			$('body').removeClass('noscroll');
			$('.window').addClass('slideDown')
			$('.videobg').each(function(index, element) {
				element.pause();
			});
		}
	});
	
	//Bind ESC key
	$(document).keyup(function(e){
		if(e.keyCode === 27) $('.overlay').click();
	});
	
	//Empty URL input on hide
	$('#hideShare').click(function(){
		$('#sharewindow').hide();
		$('body').removeClass('noscroll');
			$('#shareurl').addClass('notgenerated');
	});
	
	//Show/Hide menu on empty
	$('#blocks').click(function(){
		if ($(this).hasClass('empty')){
			if ($('body').hasClass('preview')){
				$('.toggle').click();
			}
			$('#subMenu').removeClass('hidden');
			$('#header').addClass('visible');
			$('#sideMenu ul li:first-child').addClass('selected');
			
		}
	});
	
	//hide menu on bodyclick
	$(document).click(function(event) {	
		if (!$(event.target).closest('#blocks, #menu').length) {
			$("#subMenu, #menu").addClass('hidden');
			$("#sideMenu li.selected").removeClass('selected');
		};
	});

	//Menu Here
	$("#menu").on( "mouseleave", function() {
		$("#subMenu, #menu").addClass('hidden');
		$("#sideMenu li.selected").removeClass('selected');
	});
	
	$('#sideMenu > ul').menuAim({
		activate: function(event){
			if (!$('#sideMenu').hasClass('disabled')){
				$("#subMenu, #menu").removeClass('hidden');
				$("#sideMenu li.selected").removeClass('selected');
				$(event).addClass('selected');
					
				var currentItem = $(event).data('menu-item');
				
				$('#subMenu').scrollTop(0);
				$('#subMenu ul.visible').removeClass('visible');
				$('#subMenu ul#'+currentItem).addClass('visible');
			}
		},
		exitMenu: function() {
			return true;
		}
	});
	
	//Toggle sidebar
	$('.toggle').click(function(){
		$('body').toggleClass('preview');
		if ($('body').hasClass('preview')){
			$.cookie('toggle','preview', { expires: 1 });
		} else {
			$.cookie('toggle','normal', { expires: 1 });
		}
	});
	
	//Bind ESC to hide Overlays
	$(document).keydown(function(event){
		if (!$(".overlay").not('.hidden').exists()){
			var code = event.keyCode || event.which;
			if (code == '9') {
				$('.toggle').click();
				event.preventDefault();
			}
		}
	});
	
});

// additional functions
$.fn.preload = function() { this.each(function(){ $('<img/>')[0].src = this; }); }
$.fn.exists = function(){return this.length>0;}
//extend for draggable
var oldMouseStart = $.ui.draggable.prototype._mouseStart;
$.ui.draggable.prototype._mouseStart = function (event, overrideHandle, noActivation) {
    this._trigger("beforeStart", event, this._uiHash());
    oldMouseStart.apply(this, [event, overrideHandle, noActivation]);
};

function openWindow(theURL, w, h) {
	var winName, scrollbars;
	LeftPosition = (screen.width) ? (screen.width - w) / 2 : 100;
	TopPosition = (screen.height) ? (screen.height - h) / 2 : 100;
	settings = 'width=' + w + ',height=' + h + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=' + scrollbars + ',location=no,directories=no,status=0,menubar=no,toolbar=no,resizable=no';
	URL = theURL;
	window.open(URL, winName, settings);
}







/////////////////////////////////////////////////////////////////////////////////