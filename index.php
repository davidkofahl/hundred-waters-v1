<?	$tracks = array();

 $services = getenv("VCAP_SERVICES");
 $services_json = json_decode($services,true);
 $mysql_config = $services_json["mysql-5.1"][0]["credentials"]; 

	mysql_connect( $mysql_config["hostname"], $mysql_config["user"], $mysql_config["password"] );
  mysql_select_db($mysql_config["name"]);

	$result = mysql_query('select * from tracks where album="hundred-waters" order by sort asc');	while ($track = mysql_fetch_assoc($result)){		$tracks[] = $track;		}
	mysql_close();
	function get_tracks($tracks){		$out = '';		foreach ($tracks as $track) {			$out .= "<a href='#{$track['uri']}' id='id-{$track['uri']}' tabindex='-1' rel='{$track['sort']}'>{$track['title']}</a>";		}
		return $out;	}
	function get_tracks_json($tracks){		return json_encode($tracks);	}
	$agent = $_SERVER['HTTP_USER_AGENT'];	$browser = FALSE;
	if (stripos($agent, 'Firefox') !== FALSE) {  		$browser = 'FIREFOX';	}	elseif (stripos($agent, 'MSIE') !== FALSE) {		$browser = 'IE';	}	elseif (stripos($agent, 'WebKit') !== FALSE) {		$browser = 'WEBKIT';	}?>


<!doctype html><html><head>	
	<meta property="og:title" content="Hundred Waters Music" />
	<meta property="og:type" content="musician" />
	<meta property="og:url" content="http://hundredwatersmusic.elestialsound.com" />
	<meta property="og:image" content="http://elestialsound.com/wp-content/uploads/2012/02/Hwaters.cover_.wspine-300x270.jpg" />
	<meta property="og:site_name" content="Hundred Waters" />
	<meta property="og:description" content="Hundred Waters was woven together under the spell of a viscous Floridian summer, from a home on its own in the woods amidst a city. The album was composed, recorded, torn apart, reshaped, spat on, shined, and tucked in at their Gainesville home through a method of remote collaboration and thoughtful solitude, reconvening at the helm to gather their threads into rope, and pull"/>
	<meta property="fb:admins" content="2008866" />
	<link rel='stylesheet' type='text/css' href='css/template.css'/>
	<script type='text/javascript' src='js/mootools.js'></script>
	<script type='text/javascript' src='js/mootools-more.js'></script>
	<script type='text/javascript' src='js/template.js'></script>
    <script type='text/javascript' src='js/player.js'></script>
    	<script type='text/javascript'>
		if (Browser.ie && Browser.version >= 9 ||
			Browser.firefox && Browser.version >= 3.6 ||
			Browser.safari && Browser.version >= 5 ||
			Browser.chrome && Browser.version >= 6) {
			window.addEvent('domready', function(){
        HundredWaters = new Player(<?=get_tracks_json($tracks)?>);
        console.log(<?=get_tracks_json($tracks)?>);
			}); 
		}
		else {
			window.addEvent('domready', function(){
				$('initial-play').setStyle('display', 'none');
				$('initial-browser-problem').setStyle('display', 'block');
			});
		}
	</script>		
	<link href='http://fonts.googleapis.com/css?family=Quicksand' rel='stylesheet' type='text/css'>
	<title>Hundred Waters</title>
	<script type="text/javascript">
	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-29537411-1']);
	  _gaq.push(['_trackPageview']);
	
	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	
	</script>
</head>

<body>
			<div id="bg-video">	
				<img src="images/bg_template.jpg" />
				</div>	<div id="grid"></div>
				<div id="link-out-buttons">	
					<div id="purchase">	
						<div class="watermark" id="line-1"></div>
						<div class="watermark" id="line-2"></div>
						<div class="watermark" id="line-3"></div>
						<div class="watermark" id="line-4"></div>
						<div class="watermark" id="line-5"></div>
						<div class="watermark" id="line-6"></div>
						<div class="watermark" id="line-7"></div>
				</div>	
						
							<div id="sm">	
								<a id="shows-button" class="shows-button" href="http://www.hundred-waters.com#shows" target="_blank"></a>
								
										<a id="share" class="sm-button" href="http://www.facebook.com/100waters" target="_blank"></a>		
							<a id="tweet" class="sm-button" href="http://twitter.com/100waters" target="_blank"></a>		
							
							</div>	</div>	<div id="overlay">		<div id="header">			<div id="title-wrapper">				<div id='title-track-list'>				<?if ($browser == 'FIREFOX'):?>    
									  			<div id="initial-wrapper">		   
									  				   					<img id="moz-initial" class="initial-image" src="images/clipping/initial_noodles_shadows.png" />		
									  				   				<div class="initial-animation frame" style="clip-path: url(clipping.svg#initial);">        	 				<img id="initial-animation-image" src="images/bg_title_animation_a.png" />      					</div>					</div>
				<?elseif ($browser == 'WEBKIT'):?>	
									<div id="initial-wrapper">								<img class="initial-image" src="images/clipping/initial_noodles_shadows.png" />						<div class="initial-animation frame" style="-webkit-mask: url('images/clipping/initial_noodles.png') no-repeat 0px 0px; -webkit-mask-repeat:no-repeat">    	    	 			<img id="initial-animation-image" src="images/bg_title_animation_a.png" />      					</div>					</div>      		
										<?elseif ($browser == 'IE'):?>
										<div id="initial-wrapper">		
																	<img class="initial-image" src="images/clipping/initial_noodles_shadows.png" />		
												</div>      		
									
      			<?endif?>
					<div id="initial-logo">						<img src="images/initial_logo.png" />					</div>
					<div class="track-selection">									</div>
											
					<div id='initial-play'></div>
					<div id='initial-browser-problem'>Sorry, this site requires HTML5, which your browser does not fully support. Alas, lest you feel discouraged, <br/>you can listen the album here:<br/><a href='http://soundcloud.com/hundredwaters'>http://soundcloud.com/hundredwaters</a></div>
				</div>
					
				<div id='title-album-end'>
					<div id="initial-logo">
						<img src="images/initial_logo.png" />	
					</div>
					<div class="track-selection"></div>
					<div id="title-replay"></div>
				</div>
				
				<div id='title-animation-wrapper'>
					<div id="tentacles">
						<img src="images/tentacles.png" />		
					</div>
				<?if ($browser == 'FIREFOX'):?>      		      			
				<div id="firefox-animation" class="titles-wrapper">		
					<div class="titles-image"></div>	
					<div class="titles-animation" class="frame">     
						<img id="title-animation-image" src="images/bg_title_animation_a.png" />      				</div>				</div>
						
				<?elseif ($browser == 'WEBKIT'):?>	
				<div id="webkit-animation" class="titles-wrapper">		
					<div class="titles-image"></div>
					<div class="titles-animation" class="frame">
        	 			<img id="title-animation-image" src="images/bg_title_animation_a.png" />
      				</div>
				</div>
      			<?elseif ($browser == 'IE'):?>
      			<div id="ie-animation" class="titles-wrapper">		
					<div class="titles-image"></div>
				</div>
      			<?endif?>
      			<div style="display:none" id="header-logo">
					<img src="images/logo_header.png" />
				</div>
      		</div>
		</div>
			
		
		</div>

		<div id="audio-menu-wrapper">
			<div id="bg-trans">	
				<div id='player-wrapper'>
					<div id='player-top'>							
						<div id='player-trackname' class="track-title"></div>
						<div id='player-current'>(0:00 /</div>
						<div id='player-duration'>0:00)</div>
					</div>
					
					<div id='player-bottom'>
						<div id='player-buttons-left'>
							<a onclick='javascript:void(0)' id="audio-expand"></a>								
							<a onclick='javascript:void(0)' id='player-play' class='paused'></a>
							<div id='player-loading'></div>						
						</div>
					
						<div id='player-bar-wrapper'>
							<div id='player-bar'>
								<div id='player-barframe'>
									<div id='player-bar-bg'></div>
									<div id='player-bar-edge'></div>
								</div>
							</div>
						</div>
						
						<div id='player-buttons-right'>
							<a onclick='javascript:void(0)' id="player-previous"></a>
							<a onclick='javascript:void(0)' id="player-next"></a>
						</div>
					</div>
				</div>
					
				<div id="track-info-wrapper">
					<div id="menu-logo">
						<img src="images/logo_menu.png" />
					</div>
					
					<div id='player-tracks'>
						<?=get_tracks($tracks);?>
					</div>
				
					<div id="track-lyrics-wrapper">
						<div id="track-lyrics-conveyor">
							<p></p>
						</div>
					</div>
					<div id="slide-wrapper">
						<div id="slider" class="slider">
							<div class="knob"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
