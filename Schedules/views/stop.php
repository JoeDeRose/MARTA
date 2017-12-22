<?php
// Constants, This Page

// Retrieve contents from $data.
$stopid = $data["stopid"];

// Load model components.
_load_model( 'shape', $data );
_load_model( 'stop', $data );
$stop_info = get_stop_info( $stopid );
$stop_schedule = get_stop_schedule( $stopid );
$shape = get_shapes_serving_a_stop( $data );		// Uses same data content as that which was passed in.
$service_id_array = _getServiceIDArray();
$bus_list = array();

// Fix the title to show (for example) "MARTA Route 1" or "MARTA Blue Line".
global $header_find, $header_replace, $FullScreen, $FullScreenClass;
$header_find["title"] = "/<title>.*?<\/title>/";
$route_title = $stop_info[ "stop_name" ];
$header_replace["title"] = "<title>MARTA Stop - " . $route_title . "</title>";

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
?>
<h1><?=$route_title?></h1>

<!-- Deleting the following <div> causes a JavaScript error. Figure this out later. -->
<div id="map_canvas" class="<?=$FullScreenClass?>" ></div>

<h2>Bus Headsigns on This Route</h2>

<div id="SchedulesForBusStops" class="buttonEffect buttonMenu buttonEffectRoundedAll">
<?php
foreach ( $stop_schedule as $key_shape => $value_shape ):
    if ( in_array( $value_shape["RouteShortName"], $bus_list ) == false ) {
        array_push( $bus_list, $value_shape["RouteShortName"]  );
    }
    $HeadsignDisplay = _trim_headsign( $value_shape["Headsign"] );
?>
    <div class="buttonMenuHeader" >
        <?=$HeadsignDisplay?>
    </div>
<?php
    if ( $value_shape[ "IsArrivingSoon" ] == True ):
        $ArrivingSoonClass = "HeadsignListListener";
    else:
        $ArrivingSoonClass = "RunsTodayNo";
    endif;
// ----------------------------------------------------------------------
// Arriving Soon
// ----------------------------------------------------------------------
?>
    <div
        class="buttonMenuItem <?=$ArrivingSoonClass?>"
        data-shapeID="<?=$key_shape?>"
        data-schedule="ArrivingSoonTimes<?=$key_shape?>"
    >
        Arriving Soon
    </div>
<?php
        foreach ( $value_shape[ "Sched" ][ _getServiceID() ] as $key_time => $value_time ):
            if ( $value_time[ "ArrivingSoon" ] == 0 ):
                $ThisClassVisibility = "";
            else:
                $ThisClassVisibility = "DisplayWhenSelected";
            endif;
?>
    <div
        id="ArrivingSoon<?=$key_time?>"
        class="ArrivingSoonTimes<?=$key_shape?> buttonMenuItem buttonArrivalCell TimeSelectListener ScheduleTimes HideOnLoad <?=$ThisClassVisibility?>"
        data-tripID="<?=$key_time?>"
    >
        <div>
            <span id="<?=$stopid?>-<?=$key_time?>_ScheduleTime" ><?=_parse_timestamp( $value_time[ "Time" ], "time12" )?></span><span id="<?=$stopid?>-<?=$key_time?>_ScheduleTimeMeridian" class="smaller" > <?=_parse_timestamp( $value_time[ "Time" ], "meridian" )?></span>
            <span id="<?=$stopid?>-<?=$key_time?>_RealTime" class="realtimeGap" ></span><span class="smaller" ><span id="<?=$stopid?>-<?=$key_time?>_RealTimeMeridian" ></span></span>
        </div>
        <div id="<?=$stopid?>-<?=$key_time?>_RealTimeDescription" class="realtimeDescription" ></div>
    </div>
<?php
        endforeach;
// ----------------------------------------------------------------------
// Weekday, Saturday, Sunday (cycle through $service_id_array)
// ----------------------------------------------------------------------
    foreach ( $service_id_array as $service_id_key => $service_id_desc ):
        if ( count( $value_shape[ "Sched" ][ $service_id_key ] ) > 0 ):
?>
    <div class="buttonMenuItem HeadsignListListener" data-shapeID="<?=$key_shape?>" data-schedule="<?=$service_id_desc?>Times<?=$key_shape?>" >
        <?=$service_id_desc?> Schedule
    </div>
<?php
            foreach ( $value_shape[ "Sched" ][ $service_id_key ] as $key_time => $value_time ):
?>
    <div
        id="<?=$service_id_desc?><?=$key_time?>"
        class="<?=$service_id_desc?>Times<?=$key_shape?> buttonMenuItem buttonArrivalCell TimeSelectListener ScheduleTimes HideOnLoad DisplayWhenSelected"
        data-tripID="<?=$key_time?>"
    >
        <span><?=_parse_timestamp( $value_time[ "Time" ], "time12" )?></span><span class="smaller" > <?=_parse_timestamp( $value_time[ "Time" ], "meridian" )?></span>
    </div>
<?php
            endforeach;
        endif;
    endforeach;
endforeach;
?>
</div>

<script type="text/javascript">
	$( document ).ready( initialize() );
	
	var LocationMarker = {};
	var popup = {};
	var activepopup = null;
	
	// The following variables are assigned at the end of the initialize() function; it didn't work to assign values here.
	
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
foreach ( $shape["shape_info"] as $key => $value ):
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
endforeach;
?>
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
					rotation: parseFloat( BearingAngle ),
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
		"click",
		".HeadsignListListener",
		function() {
			ShapeID = $( this ).attr( "data-shapeID" );
            Schedule = $( this ).attr( "data-schedule" );
            UnhighlightAllRoutes();
			HighlightRoute( ShapeID );
            $( ".ScheduleTimes" ).hide();
            $( "." + Schedule + ".DisplayWhenSelected" ).show();
		}
	);

	function HighlightRoute( ShapeID ) {
		shapeNormal[ ShapeID ].setMap( null );
		shapeHighlight[ ShapeID ].setMap( map );
	}
	
	function UnhighlightAllRoutes() {
<?php
foreach ( $shape["shape_info"] as $key => $value ):
?>
		shapeHighlight[ "<?=$key?>" ].setMap( null );
		shapeNormal[ "<?=$key?>" ].setMap( map );
<?php
endforeach;
?>
	}
	
	function TempHighlightRoute( ShapeID ) {
		setTimeout(
			function() {
				UnhighlightAllRoutes();
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
	
</script>
