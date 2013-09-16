var Player = new Class({
	trackSliderSteps: 30,	
	trackCurrent: 1,	
	playerSliding: 0,	
	playerExpanded: 0,	
	playerHidden: 1,	
	
	initialize: function(trackList){	
		var p = this;	

		this.tracksEnd = $('title-album-end');	
		this.trackList = this.getTrackList(trackList);	
		this.trackName = $('player-trackname');	
		this.trackSliderArea = $('track-lyrics-conveyor');
		this.trackSliderBar = $('slider');
		this.trackSliderHeight = parseInt(this.trackSliderArea.getParent().getStyle('height'));	
		this.trackLyrics = this.trackSliderArea.getFirst();	
		this.animation = $('title-animation-wrapper');	
		this.playerWrapper = $('audio-menu-wrapper');
		this.loading = $('player-loading');
	
		this.bar = $('player-bar');		
		this.barFrame = $('player-barframe');		
		this.barWidth = parseInt(this.barFrame.getParent().getStyle('width'));		

		this.button = {};
		this.button.playInitial = $('initial-play');
		this.button.play = $('player-play');
		this.button.replay = $('title-replay');
		//this.button.volume = $('player-volume');
		this.button.next = $('player-next');
		this.button.previous = $('player-previous');
		this.button.expander = $('audio-expand');
		this.button.tracks = $$('#player-tracks > a');	

		this.duration = $('player-duration');
		this.current = $('player-current');
		this.currentOffset = parseInt(this.current.getStyle('left'));
		this.titlesAnimation = $$('.titles-animation');
		this.titleImage = $$('.titles-image');
		this.titlesWrapper = $$('.titles-wrapper');
		this.mozTitlesAnimation = $$('#firefox-animation > .titles-animation');
		if ($('ie-animation')) {
			this.ieTitlesAnimation = $('ie-animation');
		}
		this.share = $('share');
		
		this.position = {};
		this.position.hidden = -1 * parseInt(this.playerWrapper.getStyle('height'))
		this.position.base = parseInt($('player-wrapper').getStyle('height')) + this.position.hidden;
		this.position.expanded = 0;
		this.position.current = parseInt(this.playerWrapper.getStyle('bottom'));	
		
		this.bar.addEvent('click', function(e){			
			var position = e.client.x - p.bar.getPosition().x;		
	
			p.audio.currentTime = (e.client.x - p.bar.getPosition().x) / p.barWidth * p.audio.duration;			
			p.updateBar(position);		
		});				
		
		this.trackSlider = new Slider(this.trackSliderBar, this.trackSliderBar.getFirst(), {		  	
			range: [0, this.trackSliderSteps],		  	
			mode: 'vertical',	    
			onChange: function(n){
				p.trackSliderArea.setStyle('top', -1 * (parseInt(p.trackSliderArea.getStyle('height')) - p.trackSliderHeight) / p.trackSliderSteps * n);		    
			}	
		});	
	
		this.trackSliderArea.addEvent('mousewheel', function(e){
			p.trackSlider.set(p.trackSlider.step - e.wheel * 2);
		});		
		
		$(document.body).addEvent('mousemove', function(){			
			if ( ! p.playerSliding && p.playerHidden) {			
				p.playerBase();			
			}						
			
			clearTimeout(p.playerDelay);			
			p.startHideTimer();		
		});			
		
		this.playerSlider = new Fx.Tween(this.playerWrapper, {		    
			duration: 300,		    
			transition: 'linear',		    
			link: 'cancel',		    
			property: 'bottom',		    
			onStart: function(){		    	
				p.playerSliding = 1;		    
			},		    
			onComplete: function(){ 		    	
				p.position.current = parseInt(p.playerWrapper.getStyle('bottom'));	
				p.playerSliding = 0;			
			} 		
		});				
		
		this.addButtonEvents();
		this.startHideTimer();
		
		if (document.location.hash) {	
			this.trackHash = (document.location.hash).substring(1);		
	
			this.trackList.each(function(el){				
				if (el.uri == p.trackHash) {				
					p.trackCurrent = parseInt(el.sort);		
					p.loadTrack(p.trackCurrent, true);		
				}			
			})		
		}
	},
	
	startHideTimer: function(){		
		this.playerDelay = this.playerHide.delay(6000, this);	
	},	
	
	playerHide: function(){		
		if ( ! this.playerExpanded) {			
			this.playerSlider.start(this.position.current, this.position.hidden);		
			this.playerHidden = 1;		
		}	
	},		
	
	playerBase: function(){		
		this.playerSlider.start(this.position.hidden, this.position.base);		
		this.playerHidden = 0;		
	},			
	
	toggleExpanded: function(initial){
		if (initial) {
			this.playerSlider.start(this.position.hidden, this.position.expanded);			
			this.button.expander.addClass('expanded');    		
			this.playerExpanded = 1;    	
		}
		else {				
			if (this.playerExpanded){			
				this.playerSlider.start(this.position.expanded, this.position.base);			
				this.button.expander.removeClass('expanded');    		
				this.playerExpanded = 0;    	
			}    	
			else {			
				this.playerSlider.start(this.position.base, this.position.expanded);			
				this.button.expander.addClass('expanded');    		
				this.playerExpanded = 1;    	
			}
		}    	    	
		
		this.playerHidden = 0;	
	},		
	
	timeFormat: function(totalSecs){		
		var mins = Math.floor(totalSecs / 60);		
		var secs = Math.floor(totalSecs) % 60;		
		return mins + ':' + (secs < 10 ? '0' + secs : secs);	
	},		
	
	addButtonEvents: function(){
		var p = this;
		
		this.button.play.addEvent('click', function(){
			if (p.audio.paused){	
				p.audio.play();			
			}			
			else {				
				p.audio.pause();			
			}		
		});				
		
/*		this.button.volume.addEvent('click', function(){			
			if (p.audio.volume == 0){				
				p.audio.volume = 1;				
				p.volume.removeClass('muted');			
			}			
			else {				
				p.audio.volume = 0;				
				p.volume.addClass('muted');			
			}		
		});*/	
		
		this.showButton(this.button.next, 'next');
		this.showButton(this.button.previous, 'previous');
		
		this.button.playInitial.addEvent('click', function(){
			p.loadTrack(101, true);
		});
		
		this.button.replay.addEvent('click', function(){			
			p.loadTrack(101);			
			p.animation.setStyle('display', 'block');			
			p.tracksEnd.setStyle('display', 'none');		
		});
		
		this.button.expander.addEvent('click', function(){ 			
			p.toggleExpanded();		
		});
		
		this.button.tracks.addEvent('click', function(){	
      console.log('rel' + this.getProperty('rel'));
			p.loadTrack(this.getProperty('rel'), false);		
		});		
	},
	
	addAudioEvents: function(){		
		var p = this;		
		this.audio.addEventListener('loadedmetadata', function(){		
			p.duration.setProperty('html', p.timeFormat(this.duration) + ')');			
			p.current.setProperty('html', '(0:00 /');		
		}, false);				
		
/*		this.audio.addEventListener('canplaythrough', function(){
			p.button.play.setStyle('display', 'block');
			p.loading.setStyle('display', 'none');
			p.audio.play();		
		}, false);*/
		
		this.audio.addEventListener('timeupdate', function(){			
			p.updateBar(Math.round(p.audio.currentTime * p.barWidth / p.audio.duration));		
		}, false);				
		
		this.audio.addEventListener('play', function(){			
			p.button.play.removeClass('paused');		
		}, false);				
		
		this.audio.addEventListener('pause', function(){			
			p.button.play.addClass('paused');		
		}, false);				
		
		this.audio.addEventListener('ended', function(){			
			if (p.trackCurrent == p.trackCount) {				
				p.animation.setStyle('display', 'none');		
				p.tracksEnd.setStyle('display', 'block');		
			}			
			else {				
				p.loadTrack(p.trackCurrent + 1);			
			}		
		}, false);	
	},		
	
	getTrackList: function(t){		
		var trackList = Array();		
		var count = 0;				
		t.each(function(el){			
			trackList[el.sort] = el;			
			count++;		
		});				
		
		this.trackCount = 111;				
		return trackList;	
	},
	
	hideButton: function(button){
		button.removeClass('shown');
		button.removeEvents('click');
	},
	
	showButton: function(button, which){
		if ( ! button.hasClass('shown')) {
			var p = this;
			button.addClass('shown');
			
			if (which == 'next') {
				button.addEvent('click', function(){			
					p.loadTrack(p.trackCurrent + 1);		
				});
			} else {				
				button.addEvent('click', function(){			
					p.loadTrack(p.trackCurrent - 1);		
				});
			}
		}	
	},
	
	loadTrack: function(id, initial){
		this.showButton(this.button.next, 'next');
		this.showButton(this.button.previous, 'previous');
		this.tracksEnd.setStyle('display', 'none');
	  console.log('trackcount' + this.trackCount);	
		if (id <= 101) {			
			id = 101;			
			this.hideButton(this.button.previous);
		}		
		else if (id >= this.trackCount) {			
			id = this.trackCount;			
			this.hideButton(this.button.next);		
		}
	console.log('id' + id );	
		this.trackCurrent = parseInt(id);	
    console.log('current' + this.trackCurrent);
		var track = this.trackList[this.trackCurrent];				
		
		if ( ! initial){			
			this.audio.pause();			
			this.audio.destroy();			
			$('title-animation-wrapper').setStyle('display', 'block');	
		}		
		else {			
			$('title-track-list').destroy();
			this.animation.setStyle('display', 'block');			
			this.playerWrapper.setStyles({display: 'block', bottom: - 300});			
			this.toggleExpanded(true);		
		}					
		
		this.audio = new Audio();
		this.addAudioEvents();
		this.audio.grab(new Element('source', {src: 'https://s3.amazonaws.com/hundred-waters/albums/' + track.path_mp3, type: 'audio/mp3'}));		
		this.audio.grab(new Element('source', {src: 'https://s3.amazonaws.com/hundred-waters/albums/' + track.path_ogg, type: 'audio/ogg'}));		
		this.trackName.setProperty('html', track.title);
		this.trackLyrics.setProperty('html', track.lyrics);		
		this.trackSlider.set(0);
		this.updateBar(0);
		this.button.play.setStyle('display', 'none');
		this.loading.setStyle('display', 'block');
		document.location.hash = track.uri;		
		this.share.set('onclick', 'window.open("http://www.facebook.com/sharer.php?t=Hundred Waters - ' + track.title + '&u=' + encodeURIComponent('http://hundredwaters.studiosyndicate.org/#' + track.uri) + '","sharer","toolbar=0,status=0,width=800,height=500");');
		this.button.tracks.removeClass('selected').each(function(track){
			if (track.getProperty('rel') == id) {
				track.addClass('selected');
			}
		});	
	   console.log('track uri' +	track.uri);

		var titleAdjustments = {
			sonnet: {mb: 25, mt: 15, h: 43, w: 349, iew: 359, mozw: 360, mozh: 51, moztop: -8, mozleft: -8, shal: -3, shax: 0, shay: 0},
			visitor: {mb: 25, mt: 15, h: 43, w: 360, iew: 370, mozw: 371, mozh: 51, moztop: -8, mozleft: -8, shal: -3, shax: 0, shay: -50},
			me_and_anodyne: {mb: 25, mt: 15, h: 43, w: 694, iew: 704, mozw: 705, mozh: 51, moztop: -8, mozleft: -8, shal: -3, shax: 0, shay: -100},
			theia: {mb: 25, mt: 15, h: 43, w: 257, iew: 267, mozw: 268, mozh: 51, moztop: -8, mozleft:-8, shal: -3, shax: 0, shay: -400},
			wonderboom: {mb: 25, mt: 15, h: 43, w: 647, iew: 657, mozw: 659, mozh: 51, moztop: -8, mozleft: -8, shal: -3, shax: 0, shay: -350},	
			boreal: {mb: 25, mt: 15, h: 43, w: 330, iew: 340, mozw: 341, mozh: 51, moztop: -8, mozleft: -8, shal: -3, shax: 0, shay: -300},	
			sos: {mb: 25, mt: 28, h: 13, w: 484, iew: 494, mozw: 495, mozh: 58, moztop: -24, mozleft: -8, shal: -3, shax: 0, shay: -250},	
			caverns: {mb: 25, mt: 15, h: 43, w: 393, iew: 403, mozw: 404, mozh: 51, moztop: -8, mozleft: -8, shal: -3, shax: 0, shay: -200},	
			thistle: {mb: 25, mt: 15, h: 43, w: 350, iew: 360, mozw: 361, mozh: 51, moztop: -8, mozleft: -8, shal: -3, shax: 0, shay: -150},	
			gather: {mb: 25, mt: 15, h: 43, w: 337, iew: 347, mozw: 348, mozh: 51, moztop: -8, mozleft: -8, shal: -3, shax: 0, shay: -525},	
			areor: {mb: 12, mt: 15, h: 49, w: 330, iew: 340, mozw: 343, mozh: 61, moztop: -8, mozleft: -8, shal: -3, shax: 0, shay: -450}	
		};
			
		this.titlesAnimation.set('style', '-webkit-mask-image: url(./images/clipping/clip_' + track.uri + '.png); clip-path: url(./clipping.svg#' + track.uri + ');');	
		
		this.titleImage.setStyles({
			left: titleAdjustments[track.uri].shal,
			backgroundPosition: titleAdjustments[track.uri].shax + 'px ' + titleAdjustments[track.uri].shay +'px'
		});
 		this.titlesAnimation.setStyles({
			width: titleAdjustments[track.uri].w,
			height: titleAdjustments[track.uri].h
		});
		
		this.titlesWrapper.setStyles({
			marginTop: titleAdjustments[track.uri].mt,
			marginBottom: titleAdjustments[track.uri].mb,	
			height: titleAdjustments[track.uri].h,
			width: titleAdjustments[track.uri].w
		});
						
		this.mozTitlesAnimation.setStyles({
			width: titleAdjustments[track.uri].mozw,
			height: titleAdjustments[track.uri].mozh,
			left: titleAdjustments[track.uri].mozleft,
			top: titleAdjustments[track.uri].moztop	
		});
		
		if (typeof(this.ieTitlesAnimation) != 'undefined') {		
			this.ieTitlesAnimation.setStyle('width', titleAdjustments[track.uri].iew);
		}
		
		if (parseInt($('track-lyrics-conveyor').getStyle('height')) <= parseInt($('track-lyrics-wrapper').getStyle('height'))) {
			$('slider').setStyle('display', 'none');
		}	
		else {
			$('slider').setStyle('display', 'block');
		}
		
		//experimental
		this.duration.setProperty('html', '0:00)');			
		this.current.setProperty('html', '(0:00 /');		
		this.button.play.setStyle('display', 'block');
		this.loading.setStyle('display', 'none');
		this.audio.play();			
	},	 	
	
	updateBar: function(position){	
		this.barFrame.setStyle('left',  position - 400);		
		this.current.setProperty('html', '(' + this.timeFormat(this.audio.currentTime) + ' /');
	}
});
