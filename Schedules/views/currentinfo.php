<?php
// Constants, This Page
$CountdownTimerTotalSeconds = 15;
$CountdownTimerUpdateFrequencySeconds = .25;

// Retrieve contents from $data.
$validated_route = $data["validated_route"];

// Load model components.
_load_model( 'shape', $data );
$shape = get_shape( $data );		// Uses same data content as that which was passed in.

// Fix the title to show (for example) "MARTA Route 1" or "MARTA Blue Line".
global $header_find, $header_replace, $FullScreen, $FullScreenClass;
$header_find["title"] = "/<title>.*?<\/title>/";
if ( is_numeric( $validated_route ) ) {
	$route_title = "Route " . $validated_route;
} else {
	$route_title = $data["route"] . " Line";
}
$header_replace["title"] = "<title>MARTA " . $route_title . "</title>";

// Calculate the zoom
if ( max( $shape["route_span_lat"], $shape["route_span_lon"] ) <= 0.04 ) {
	$zoom = 13;
} else if ( max( $shape["route_span_lat"], $shape["route_span_lon"] ) <= 0.09 ) {
	$zoom = 12;
} else if ( max( $shape["route_span_lat"], $shape["route_span_lon"] ) <= 0.16 ) {
	$zoom = 11;
} else {
	$zoom = 10;		// default
}

if ( $FullScreen == false ) :
?>
<h1>
	<?=$route_title?><br />
	<?=$shape["route_long_name"]?>
</h1>

<div class="countdownTimer buttonContainer" >
	<div class="buttonEffect buttonEffectPadding buttonEffectRoundedAll refreshListener" >
		<div id="CountdownTimerRefresh" style="display: none;" >Refresh&nbsp;Now</div>
		<span id="CountdownTimerWaiting" >Waiting for Update</span>
	</div>
</div>
<?php
endif;
?>
<div id="map_canvas" class="<?=$FullScreenClass?>"></div>
<?php
if ( $FullScreen == false ) :
?>
<p id="NoRealTimeAlert" class="alert" style="display:none;" ><strong>Alert:</strong> MARTA is not currently providing real-time data for this route.</p>

<h2>Bus Headsigns on This Route</h2>
<p>Hover over (or tap) a headsign to see the portion and direction it describes.</p>
<ul class="HeadsignList">
<?php
	$RunTodayClass["0"] = "RunsTodayNo";
	$RunTodayClass["1"] = "RunsTodayEarlier";
	$RunTodayClass["2"] = "RunsTodayYes";
	
	$AllRoutesRunToday = true;
	
	foreach ( $shape["shape_info"] as $key => $value ):
		if ( $value["RunsToday"] == 0 ) {
			$AllRoutesRunToday = false;
		}
		$HeadsignDisplay = ( $value["headsign"] == "" ) ? "<i>(Headsign for shape " . $value["shape_id"] . " missing in MARTA database)</i>" : $value["headsign"];
?>
	<li class="<?=$RunTodayClass[$value["RunsToday"]]?> HeadsignListListener" id="HeadsignList<?=$key?>" data-shapeID="<?=$key?>"><?=$HeadsignDisplay?></li>
<?php
	endforeach;
?>
</ul>
<?php
	if ( $AllRoutesRunToday == false ) :
?>
<p>Black lines show active routes today; routes for other days are shown by gray lines.</p>
<?php
	endif;

endif;
?>
<script type="text/javascript">
	$( document ).ready( initialize() );
	
	var LocationMarker = {};
	var popup = {};
	var activepopup = null;
	
	// The following variables are assigned at the end of the initialize() function; it didn't work to assign values here.
	var CountdownTimerRemaining;
	var CountdownTimerTotalSeconds;
	var CountdownTimerUpdateFrequencySeconds;
	var CountdownTimerCSSWidth;
	var CountdownTimerRefreshInProgress;
	
	DirectionColors = 
		{
			"Northbound" :
				{
					"ColorName" : "violet",
					"RGB" : "EE82EE"			// Polyline can't accept color names.
				},
			"Southbound" :
				{
					"ColorName" : "turquoise",
					"RGB" : "40E0D0"			// Polyline can't accept color names.
				},
			"Westbound" :
				{
					"ColorName" : "violet",
					"RGB" : "EE82EE"			// Polyline can't accept color names.
				},
			"Eastbound" :
				{
					"ColorName" : "turquoise",
					"RGB" : "40E0D0"			// Polyline can't accept color names.
				}
		};

	imgDirection =
		{
			"Northbound" :
				{
					path: 'm -7,0 7,-7 7,7 0,7 -14,0 z',
					fillColor: DirectionColors["Northbound"]["ColorName"],
					strokeColor: "black",
					fillOpacity: 1.0,
					scale: 1,
					strokeWeight: 2
				},
			"Southbound" :
				{
					path: 'm 7,0 -7,7 -7,-7 0,-7 14,0 z',
					fillColor: DirectionColors["Southbound"]["ColorName"],
					strokeColor: "black",
					fillOpacity: 1.0,
					scale: 1,
					strokeWeight: 2
				},
			"Westbound" :
				{
					path: 'm -7,7 -7,-7 7,-7 7,0 0,14 z',
					fillColor: DirectionColors["Westbound"]["ColorName"],
					strokeColor: "black",
					fillOpacity: 1.0,
					scale: 1,
					strokeWeight: 2
				},
			"Eastbound" :
				{
					path: 'm 7,-7 7,7 -7,7 -7,0 0,-14 z',
					fillColor: DirectionColors["Eastbound"]["ColorName"],
					strokeColor: "black",
					fillOpacity: 1.0,
					scale: 1,
					strokeWeight: 2
				}
		}
	markersArray = new Array();

	function initialize() {
		mapOptions = {
			center: new google.maps.LatLng( <?=$shape["route_avg_lat"]?>, <?=$shape["route_avg_lon"]?> ),
			zoom: <?=$zoom?>,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		// Some zoom level must be provided, but it must be expanded or contracted to display the optimum size for the selected route.
		map = new google.maps.Map( document.getElementById( "map_canvas" ), mapOptions );
		shapeNormal = {};
		shapeHighlight = {};
		
<?php
// RunsTodayNo
foreach ( $shape["shape_info"] as $key => $value ):
	if ( $value["RunsToday"] == 0 ):
		$coordinates = implode( ",", $value["coordinates"] );
?>
		shape<?=$key?>Coordinates = [ <?=$coordinates?> ];
		shapeNormal["<?=$key?>"] = new google.maps.Polyline(
			{
				path: shape<?=$key?>Coordinates,
				strokeColor: "#999",
				strokeOpacity: 1.0,
				strokeWeight: 2
			}
		);
		shapeHighlight["<?=$key?>"] = new google.maps.Polyline(
			{
				path: shape<?=$key?>Coordinates,
				strokeColor: "#F00",
				strokeOpacity: 1.0,
				strokeWeight: 2,
				icons:
					[
						{
							repeat: '20px', //CHANGE THIS VALUE TO CHANGE THE DISTANCE BETWEEN ARROWS
							icon: 
								{
									path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
								},
							offset: '100%'
						}
					]
			}
		);
		shapeNormal["<?=$key?>"].setMap( map );
<?php
	endif;
endforeach;

// RunsTodayEarlier
foreach ( $shape["shape_info"] as $key => $value ):
	if ( $value["RunsToday"] == 1 ):
		$coordinates = implode( ",", $value["coordinates"] );
?>
		shape<?=$key?>Coordinates = [ <?=$coordinates?> ];
		shapeNormal["<?=$key?>"] = new google.maps.Polyline(
			{
				path: shape<?=$key?>Coordinates,
				strokeColor: "#999",
				strokeOpacity: 1.0,
				strokeWeight: 2
			}
		);
		shapeHighlight["<?=$key?>"] = new google.maps.Polyline(
			{
				path: shape<?=$key?>Coordinates,
				strokeColor: "#F00",
				strokeOpacity: 1.0,
				strokeWeight: 2,
				icons:
					[
						{
							repeat: '20px', //CHANGE THIS VALUE TO CHANGE THE DISTANCE BETWEEN ARROWS
							icon: 
								{
									path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
								},
							offset: '100%'
						}
					]
			}
		);
		shapeNormal["<?=$key?>"].setMap( map );
<?php
	endif;
endforeach;

// RunsTodayYes
foreach ( $shape["shape_info"] as $key => $value ):
	if ( $value["RunsToday"] == 2 ):
		$coordinates = implode( ",", $value["coordinates"] );
?>
		shape<?=$key?>Coordinates = [ <?=$coordinates?> ];
		shapeNormal["<?=$key?>"] = new google.maps.Polyline(
			{
				path: shape<?=$key?>Coordinates,
				strokeColor: "#000",
				strokeOpacity: 1.0,
				strokeWeight: 2
			}
		);
		shapeHighlight["<?=$key?>"] = new google.maps.Polyline(
			{
				path: shape<?=$key?>Coordinates,
				strokeColor: "#F00",
				strokeOpacity: 1.0,
				strokeWeight: 2,
				icons:
					[
						{
							repeat: '20px', //CHANGE THIS VALUE TO CHANGE THE DISTANCE BETWEEN ARROWS
							icon: 
								{
									path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
								},
							offset: '100%'
						}
					]
			}
		);
		shapeNormal["<?=$key?>"].setMap( map );
<?php
	endif;
endforeach;
?>
		CountdownTimerRemaining = 0;
		CountdownTimerTotalSeconds = <?=$CountdownTimerTotalSeconds?>;
		CountdownTimerUpdateFrequencySeconds = <?=$CountdownTimerUpdateFrequencySeconds?>;
		CountdownTimerRefreshInProgress = false;
		setInterval(
			function() {
				CountdownTimer();
			},
			CountdownTimerUpdateFrequencySeconds * 1000
		);
	}
	
	function ShowMarker( Latitude, Longitude, Direction, BusID, Adherence, Headsign, NearestStopSequence, EndOfLine, BearingAngle ) {
		// Draw the prediction line first, so it will be behind the marker.
		// This prediction line doesn't seem to be necessary.
		/*
		PredicationLineCoordinates = [
			new google.maps.LatLng( Latitude, Longitude ),
			new google.maps.LatLng( PredictionLatitude, PredictionLongitude )
		];
		if ( PredictionSequence > NearestStopSequence ) {
			PredicationLine = new google.maps.Polyline(
				{
					path: PredicationLineCoordinates,
					strokeColor: DirectionColors[Direction]["RGB"],
					strokeOpacity: 0.6,
					strokeWeight: 6
				}
			);
			PredicationLine.setMap( map );
			markersArray.push( PredicationLine );
		}
		*/
		// Then draw the marker.
		var myLatLng = new google.maps.LatLng( Latitude, Longitude );
		if ( EndOfLine == "Y" ) {
			var thisIcon = google.maps.SymbolPath.CIRCLE;
			var thisScale = 6;
		} else {
			var thisIcon = google.maps.SymbolPath.FORWARD_CLOSED_ARROW;
			var thisScale = 4;
		}
		LocationMarker[BusID] = new google.maps.Marker( {
			position: myLatLng,
			map: map,
			icon:
				{
					path: thisIcon,
					fillColor: DirectionColors[Direction]["ColorName"],
					strokeColor: "black",
					fillOpacity: 1.0,
					scale: thisScale,
					rotation: BearingAngle,
					strokeWeight: 2
				}
		} );
		PopUpContent = "<div class=\"PopUpContent\">";
		PopUpContent += "<strong>" + Headsign + "</strong><br />";
		PopUpContent += "<strong>Bus:</strong> " + BusID + "<br />";
		PopUpContent += "<strong>Direction:</strong> " + Direction + "<br />";
		if ( Adherence == 0 ) {
			PopUpContent += "<strong>Running:</strong> On time<br />";
		} else if ( Adherence < 0 ) {
			PopUpContent += "<strong>Running:</strong> " + Math.abs( Adherence ) + " min. late<br />";
		} else {
			PopUpContent += "<strong>Running:</strong> " + Math.abs( Adherence ) + " min. early<br />";
		}
		PopUpContent += "</div>";
		popup[BusID] = PopUpContent;
		google.maps.event.addListener(
			LocationMarker[BusID],
			'click',
			function() {
				ShowPopUp( BusID );
			}
		);
		markersArray.push( LocationMarker[BusID] );
	}
	
	function ShowPopUp( BusID ) {
		// This doesn't work.
		if ( activepopup ) {
			activepopup.close();
		}
		activepopup = new google.maps.InfoWindow(
			{
				content: popup[BusID]
			}
		);
		activepopup.open( map, LocationMarker[BusID] );
	}
	
	function RemoveMarkers() {
		for (i=0; i < markersArray.length; i++) {
			markersArray[i].setMap(null);
		}
		markersArray.length = 0;
	}

	$( document ).on(
		"mouseover",
		".HeadsignListListener",
		function() {
			ShapeID = $( this ).attr( "data-shapeID" );
			HighlightRoute( ShapeID );
		}
	);

	$( document ).on(
		"mouseout",
		".HeadsignListListener",
		function() {
			ShapeID = $( this ).attr( "data-shapeID" );
			UnhighlightRoute( ShapeID );
		}
	);

	$( document ).on(
		"click",
		".HeadsignListListener",
		function() {
			ShapeID = $( this ).attr( "data-shapeID" );
			TempHighlightRoute( ShapeID );
		}
	);

	function HighlightRoute( ShapeID ) {
		shapeNormal[ ShapeID ].setMap( null );
		shapeHighlight[ ShapeID ].setMap( map );
		$( "#HeadsignList" + ShapeID ).addClass( "HighlightYellow" );
	}
	
	function UnhighlightRoute( ShapeID ) {
		shapeHighlight[ ShapeID ].setMap( null );
		shapeNormal[ ShapeID ].setMap( map );
		$( "#HeadsignList" + ShapeID ).removeClass( "HighlightYellow" );
	}
	
	function TempHighlightRoute( ShapeID ) {
		setTimeout(
			function() {
				UnhighlightRoute( ShapeID );
			},
			3000
		);
		HighlightRoute( ShapeID );
	}

	$( document ).on(
		"click",
		".refreshListener",
		function() {
			RefreshNow();
		}
	);
	
	function CountdownTimer() {
		CountdownTimerRemaining = CountdownTimerRemaining - CountdownTimerUpdateFrequencySeconds;
		if ( CountdownTimerRemaining <= 0 ) {
			if ( CountdownTimerRefreshInProgress == false ) {
				RefreshNow();
			}
		} else {
			$( "#CountdownTimerRefresh" ).css( "width", ( ( CountdownTimerRemaining / CountdownTimerTotalSeconds ) * 100 ) + "%" );
			$( "#CountdownTimerRefresh" ).show();
			$( "#CountdownTimerWaiting" ).hide();
		}
		$( "#showCountdown" ).html( ( ( CountdownTimerRemaining / CountdownTimerTotalSeconds ) * 100 ) + "%" );
	}

	function RefreshNow() {
		CountdownTimerRemaining = 0;
		$( "#CountdownTimerRefresh" ).hide();
		$( "#CountdownTimerWaiting" ).show();
		CountdownTimerRefreshInProgress = true;
		GetRealtime();
	}

	function GetRealtime() {
		$.ajax( {
			dataType: "json",
			url: "models/ajax/realtime.php?route=<?=$validated_route?>",
			success: function( data ) {
				showData = JSON.stringify( data );	// Use only for diagnostics.
				RemoveMarkers();
				Count = 0;
				VehicleList = data["Vehicles"];
				for ( var key in VehicleList ) {
					if ( VehicleList.hasOwnProperty( key ) ) {
						Count++;
						ShowMarker(
							VehicleList[key]["LATITUDE"],
							VehicleList[key]["LONGITUDE"],
							VehicleList[key]["DIRECTION"],
							key,
							VehicleList[key]["ADHERENCE"],
							VehicleList[key]["HEADSIGN"],
							VehicleList[key]["NEAREST_STOP_SEQUENCE"],
							VehicleList[key]["BUS_BEARING_END_OF_LINE"],
							VehicleList[key]["BUS_BEARING_ANGLE"]
						);
					}
				}
				if ( Count == 0 ) {
					$( "#NoRealTimeAlert" ).show();
				} else {
					$( "#NoRealTimeAlert" ).hide();
				}
				CountdownTimerRemaining = CountdownTimerTotalSeconds;
				$( "#CountdownTimerRefresh" ).css( "width", "100%" );
				CountdownTimerRefreshInProgress = false;
				CountdownTimer();
			}
		} );
	}

</script>
