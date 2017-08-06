<?php
// Constants, This Page

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
?>
<h1>
	<?=$route_title?><br />
	<?=$shape["route_long_name"]?>
</h1>

<!-- Deleting the following <div> causes a JavaScript error. Figure this out later. -->
<div id="map_canvas" class="<?=$FullScreenClass?>" ></div>

<h2>Bus Headsigns on This Route</h2>

<div class="buttonEffect buttonMenu buttonEffectRoundedAll">
<?php
foreach ( $shape["shape_info"] as $key => $value ):
    $HeadsignDisplay = _trim_headsign( $value["headsign"] );
?>
	<div class="buttonMenuItem HeadsignListListener" data-shapeID="<?=$key?>" ><?=$HeadsignDisplay?></div>
<?php
endforeach;
?>
</div>

<?php
foreach ( $shape["shape_info"] as $key => $value ):
    $HeadsignDisplay = ( $value["headsign"] == "" ) ? "<i>(Headsign for shape " . $value["shape_id"] . " missing in MARTA database)</i>" : $value["headsign"];
?>
	<div id="ListOfStopsForShape<?=$key?>" class="ListOfStops HideOnLoad" >
        <h1 id="h1_<?=$key?>" ><?=$HeadsignDisplay?></h1>
        <div class="buttonEffect buttonMenu buttonEffectRoundedAll">
<?php
    $PrevDisplayStopA = "";
    foreach ( $shape["stops_by_shape"][$key]["stops"] as $key1 => $value1 ):
        $DisplayValue = $value1["StopName"];
        $DisplayValue = preg_replace( "/\s*@\s*/", " @ ", $DisplayValue );
        $DisplayValue = preg_replace( "/\s+/", " ", $DisplayValue );
        $DisplayValue = preg_replace( "/ (NE|NW|SE|SW) @/", " @", $DisplayValue );
        $DisplayValue = preg_replace( "/ (NE|NW|SE|SW) ?$/", "", $DisplayValue );
        $StopID = $value1["StopID"];
        if ( strpos( $DisplayValue, " @ " ) === false ) :
            $PrevDisplayStopA = "";
?>
            <div class="buttonMenuItem" >
                <a class="buttonMenuItemListener" href="?action=stop&stopid=<?=$StopID?>" >
                    <?=$DisplayValue?>
                </a>
            </div>
<?php
        else :
            $DisplayStopA = preg_replace( "/(.* @ )(.*)/", "$1", $DisplayValue );
            $DisplayStopB = preg_replace( "/(.* @ )(.*)/", "$2", $DisplayValue );
            if ( $DisplayStopA != $PrevDisplayStopA ) :
                $PrevDisplayStopA = $DisplayStopA;
?>
            <div class="buttonMenuHeader" ><?=$DisplayStopA?></div>
<?php
            endif;
?>
            <div class="buttonMenuItem ButtonMenuIndent" >
                <a class="buttonMenuItemListener" href="?action=stop&stopid=<?=$StopID?>" >
                    <?=$DisplayStopB?>
                </a>
            </div>
<?php
        endif;
?>
<?php
    endforeach;
?>
        </div>
    </div>
<?php
endforeach;
?>

<script type="text/javascript">
	$( document ).ready( initialize() );
	
	var LocationMarker = {};
	var popup = {};
	var activepopup = null;
    var ShapeSelected = "";
	
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
		"mouseover",
		".HeadsignListListener",
		function() {
            ShapeID = $( this ).attr( "data-shapeID" );
            UnhighlightAllRoutes();
            HighlightRoute( ShapeID );
		}
	);

	$( document ).on(
		"mouseout",
		".HeadsignListListener",
		function() {
            ShapeID = $( this ).attr( "data-shapeID" );
            UnhighlightAllRoutes();
            if ( ShapeSelected != "" ) {
                HighlightRoute( ShapeSelected );
            }
		}
	);

	$( document ).on(
		"click",
		".HeadsignListListener",
		function() {
			ShapeID = $( this ).attr( "data-shapeID" );
            UnhighlightAllRoutes();
			HighlightRoute( ShapeID );
            ShapeSelected = ShapeID;
            $( ".ListOfStops" ).hide();
            $( "#ListOfStopsForShape" + ShapeID ).show();
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
