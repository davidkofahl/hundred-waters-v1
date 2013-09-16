window.addEvent('domready', function(){
	
	var overlay = $('overlay');
	var grid = $('grid');
	var purchase = $('purchase')
	
	window.addEvent('load', function() {
		adjustBack()
	})
	
	//watermark	
	purchase.addEvent('mouseenter', function(){
		adjust();
		$$('.watermark').setStyle('border-right-color','#9b99ab')
	})	
	   	
	
	purchase.addEvent('mouseleave', function(){
		adjustBack();
		$$('.watermark').setStyle('border-right-color','#6c6a76')
		})	

	storeHeight();
	
	function storeHeight(){
		$$('.watermark').each(function(el){
			el.store('originalHeight', el.getStyle('height'));
			el.setStyle('height',50);
		})
	}
	
	function adjust(){
		$$('.watermark').each(function(el){
			var heights = el.retrieve('originalHeight');
			el.tween('height', heights, 50);	
			
		})
	}
	
	function adjustBack(){
		$$('.watermark').each(function(el){
			var heights = el.retrieve('originalHeight');
			el.tween('height', 50, heights);		
			
		})
	}
	
	function setYOverlay(){
		var winY = window.getSize().y
		overlay.setStyle('height', winY);
		grid.setStyle('height', winY);
	}	
	

	window.addEvent('resize', function(){
		setYOverlay();
	
	})	

	setYOverlay();
	
	/*$('purchase-button').addEvent('click', function(){
		window.open('http://www.windishagency.com/artists/hundred_waters','name=_blank');
	
	})	
	$('download-button').addEvent('click', function(){
		window.open('mailto:kathryn@biz3.net,mike@subversiveinc.com');
	
	})	*/
	$('purchase').addEvent('click', function(){
		window.open('http://studiosyndicate.org','name=_blank');
	
	})	
	//title animation
	var initialSlide;
	var titleSlide;
	
	function startInitialSlide(){
				if ($('initial-animation-image')) {	
							initialSlide.start(-831, 0);		}	
							}	function startTitleSlide(){	
									if ($('title-animation-image'))
									 {			titleSlide.start(-831, 0);		}	}
									 
	initialSlide = new Fx.Tween('initial-animation-image', {	  
		  duration: 85000,	
		      transition: 'linear',	  
		        link: 'cancel',	
		            property: 'margin-left',	
		                onComplete: function(){ startInitialSlide() }	});	
		                	titleSlide = new Fx.Tween('title-animation-image', {	 
		                		   duration: 85000,	    transition: 'linear',	 
		                		      link: 'cancel',	    property: 'margin-left',	 
		                		         onComplete: function(){ startTitleSlide() }	});	
		                		         	startInitialSlide();    startTitleSlide();});



