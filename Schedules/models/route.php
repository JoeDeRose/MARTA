<?php
function update_URL( $removeRegEx, $addString ) {
	$thisURL = $_SERVER["REQUEST_URI"];
	if ( $removeRegEx != "" ) {
		$thisURL = preg_replace( "/&" . $removeRegEx . "/", "", $thisURL );
	}
	if ( $addString != "" ) {
		$thisURL = $thisURL . "&" . $addString;
	}
	return $thisURL;
}

function get_shape( $data ) {
	
	global $mysqli, $middle, $factor, $avg_y, $avg_x, $haversineratio;

	$size = $data["size"];
	$scope = $data["scope"];

// HEREDOC ------------------------------------------------------------------------
	$query_routeinfo = <<<QUERY_ROUTEINFO

SELECT *
FROM routes
WHERE route_short_name = '{$data["validated_route"]}'

QUERY_ROUTEINFO;
// --------------------------------------------------------------------------------
	$routeinfo = $mysqli -> query( $query_routeinfo );
	$row = $routeinfo -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
	$route_selected = $data["validated_route"];
	$route_long_name = $row["route_long_name"];
	$route_type = $row["route_type"];
	$route_color = $row["route_color"];

// HEREDOC ------------------------------------------------------------------------
	$query_span_all = <<<QUERY_SPAN_ALL

SELECT
	MIN(shape_pt_lat) AS MIN_VERT,
	MAX(shape_pt_lat) AS MAX_VERT,
	MIN(shape_pt_lon) AS MIN_HORIZ,
	MAX(shape_pt_lon) AS MAX_HORIZ
FROM shapes

QUERY_SPAN_ALL;
// --------------------------------------------------------------------------------
	$span_all = $mysqli -> query( $query_span_all );
	$row = $span_all -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
	$span_all_min_vert = $row["MIN_VERT"];
	$span_all_max_vert = $row["MAX_VERT"];
	$span_all_min_horiz = $row["MIN_HORIZ"];
	$span_all_max_horiz = $row["MAX_HORIZ"];
	
// HEREDOC ------------------------------------------------------------------------
	$query_shapeids = <<<QUERY_SHAPEIDS

SELECT DISTINCT T.shape_id
FROM routes R
	INNER JOIN trips T
		ON R.route_id = T.route_id
WHERE R.route_short_name = '{$route_selected}'
ORDER BY T.shape_id

QUERY_SHAPEIDS;
// --------------------------------------------------------------------------------
	$shapeids = $mysqli -> query( $query_shapeids );
	$routearray = array();
	unset( $span_route_min_vert );
	while ( $row = $shapeids -> fetch_assoc() ) {
// HEREDOC ------------------------------------------------------------------------
		$query_shapes = <<<QUERY_SHAPES

SELECT *
FROM shapes S
WHERE S.shape_id = {$row["shape_id"]}
ORDER BY
	S.shape_id,
	S.shape_pt_sequence

QUERY_SHAPES;
// --------------------------------------------------------------------------------
		array_push( $routearray, $mysqli -> query( $query_shapes ) );
// HEREDOC ------------------------------------------------------------------------
		$query_span_route = <<<QUERY_SPAN_ROUTE

SELECT
	MIN(shape_pt_lat) AS MIN_VERT,
	MAX(shape_pt_lat) AS MAX_VERT,
	MIN(shape_pt_lon) AS MIN_HORIZ,
	MAX(shape_pt_lon) AS MAX_HORIZ
FROM shapes S
WHERE S.shape_id = {$row["shape_id"]}
ORDER BY S.shape_id, S.shape_pt_sequence

QUERY_SPAN_ROUTE;
// --------------------------------------------------------------------------------
		$span_route = $mysqli -> query( $query_span_route );
		$row = $span_route -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
		if ( isset( $span_route_min_vert ) ) {
			$span_route_min_vert = min( $span_route_min_vert, $row["MIN_VERT"] );
			$span_route_max_vert = max( $span_route_max_vert, $row["MAX_VERT"] );
			$span_route_min_horiz = min( $span_route_min_horiz, $row["MIN_HORIZ"] );
			$span_route_max_horiz = max( $span_route_max_horiz, $row["MAX_HORIZ"] );
		} else {
			$span_route_min_vert = $row["MIN_VERT"];
			$span_route_max_vert = $row["MAX_VERT"];
			$span_route_min_horiz = $row["MIN_HORIZ"];
			$span_route_max_horiz = $row["MAX_HORIZ"];
		}
	}

// HEREDOC ------------------------------------------------------------------------
	$query_stopids = <<<QUERY_STOPIDS

SELECT DISTINCT
	stop_code,
	stop_name,
	stop_lat,
	stop_lon
FROM all_runs
WHERE
	route_short_name = '{$data["validated_route"]}'

QUERY_STOPIDS;
// --------------------------------------------------------------------------------
	$stopids = $mysqli -> query( $query_stopids );

// HEREDOC ------------------------------------------------------------------------
	$query_rail_names = <<<QUERY_RAIL_NAMES

SELECT DISTINCT route_short_name
FROM J_rail_stations

QUERY_RAIL_NAMES;
// --------------------------------------------------------------------------------
	$rail_names = $mysqli -> query( $query_rail_names );
	$raillinearray = array();
	while ( $row = $rail_names -> fetch_assoc() ) {
// HEREDOC ------------------------------------------------------------------------
		$query_rail_shapes = <<<QUERY_RAIL_SHAPES

SELECT
	JRS.*,
	S.stop_name,
	S.stop_lat,
	S.stop_lon
FROM J_rail_stations JRS
	INNER JOIN stops S
	ON JRS.stop_code = S.stop_code
WHERE JRS.route_short_name = '{$row["route_short_name"]}'
ORDER BY JRS.stop_sequence

QUERY_RAIL_SHAPES;
// --------------------------------------------------------------------------------
		array_push( $raillinearray, $mysqli -> query( $query_rail_shapes ) );
	}
// HEREDOC ------------------------------------------------------------------------
	$query_span_rail = <<<QUERY_SPAN_RAIL

SELECT
	MIN(S.stop_lat) AS MIN_VERT,
	MAX(S.stop_lat) AS MAX_VERT,
	MIN(S.stop_lon) AS MIN_HORIZ,
	MAX(S.stop_lon) AS MAX_HORIZ
FROM J_rail_stations JRS
	INNER JOIN stops S
	ON JRS.stop_code = S.stop_code
ORDER BY JRS.stop_sequence

QUERY_SPAN_RAIL;
// --------------------------------------------------------------------------------
	$span_rail = $mysqli -> query( $query_span_rail );
	$row = $span_rail -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
	$span_rail_min_vert = $row["MIN_VERT"];
	$span_rail_max_vert = $row["MAX_VERT"];
	$span_rail_min_horiz = $row["MIN_HORIZ"];
	$span_rail_max_horiz = $row["MAX_HORIZ"];
// HEREDOC ------------------------------------------------------------------------
	$query_span_FP = <<<QUERY_SPAN_FP

SELECT
	stop_lat,
	stop_lon
FROM stops
WHERE stop_code = 797

QUERY_SPAN_FP;
// --------------------------------------------------------------------------------
	$span_FP = $mysqli -> query( $query_span_FP );
	$row = $span_FP -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
	$span_FP_vert = $row["stop_lat"];
	$span_FP_horiz = $row["stop_lon"];

// HEREDOC ------------------------------------------------------------------------
	$query_highway_names = <<<QUERY_HIGHWAY_NAMES

SELECT DISTINCT route
FROM J_highways

QUERY_HIGHWAY_NAMES;
// --------------------------------------------------------------------------------
	$highway_names = $mysqli -> query( $query_highway_names );
	$highwayarray = array();
	while ( $row = $highway_names -> fetch_assoc() ) {
// HEREDOC ------------------------------------------------------------------------
		$query_highway_shapes = <<<QUERY_HIGHWAY_SHAPES

SELECT *
FROM J_highways
WHERE route = '{$row["route"]}'
ORDER BY sequence

QUERY_HIGHWAY_SHAPES;
// --------------------------------------------------------------------------------
		array_push( $highwayarray, $mysqli -> query( $query_highway_shapes ) );
	}

	switch ( $scope ) {
		case "ALL":
			// all: span covers all MARTA routes
			$min_vert = $span_all_min_vert;
			$max_vert = $span_all_max_vert;
			$min_horiz = $span_all_min_horiz;
			$max_horiz = $span_all_max_horiz;
			break;
		case "RAIL":
			// rail: span covers selected route plus the MARTA rail system
			$min_vert = min( $span_route_min_vert, $span_rail_min_vert );
			$max_vert = max( $span_route_max_vert, $span_rail_max_vert );
			$min_horiz = min( $span_route_min_horiz, $span_rail_min_horiz );
			$max_horiz = max( $span_route_max_horiz, $span_rail_max_horiz );
			break;
		case "FP":
			// FP: span covers selected route plus the Five Points Station
			// (which should be enough to give the user a sense of the location in relation to the rail system)
			$min_vert = min( $span_route_min_vert, $span_FP_vert );
			$max_vert = max( $span_route_max_vert, $span_FP_vert );
			$min_horiz = min( $span_route_min_horiz, $span_FP_horiz );
			$max_horiz = max( $span_route_max_horiz, $span_FP_horiz );
			break;
		case "ROUTE":
			// route: span covers only the selected route
			$min_vert = $span_route_min_vert;
			$max_vert = $span_route_max_vert;
			$min_horiz = $span_route_min_horiz;
			$max_horiz = $span_route_max_horiz;
			break;
	}

	$avg_vert = ( $min_vert + $max_vert ) / 2;
	$avg_horiz = ( $min_horiz + $max_horiz ) / 2;
	$max_span = max( $max_vert - $min_vert, $max_horiz - $min_horiz );
	$middle = $size / 2;
	$avg_y = $avg_vert;
	$avg_x = $avg_horiz;
	$factor = ( $size / $max_span ) * 0.95;
	
	function calculate_coordinates( $value_x, $value_y ) {
		global $middle, $factor, $avg_y, $avg_x, $haversineratio;
		$return_value = floor( $middle + ( ( $value_x - $avg_x ) * $factor * $haversineratio ) ) . ',' . floor( $middle - ( ( $value_y - $avg_y ) * $factor ) );
		return $return_value;
	}

	$routepolylines = array();
	foreach( $routearray as $value ) {
		$thispolyline = "";
		while ( $row = $value -> fetch_assoc() ) {
			$thispolyline .= calculate_coordinates( $row["shape_pt_lon"], $row["shape_pt_lat"] ) . ' ';
		}
		array_push( $routepolylines, $thispolyline );
	}

	$railpolylines = array();
	$railstations = array();
	$rail_min_x = false;
	foreach( $raillinearray as $value ) {
		$thispolyline = "";
		while ( $row = $value -> fetch_assoc() ) {
			$thiscoordinates = calculate_coordinates( $row["stop_lon"], $row["stop_lat"] );
			$thispolyline .= $thiscoordinates . ' ';
			$value_x = preg_replace( "/,-?\d+$/", "", $thiscoordinates );
			$value_y = preg_replace( "/^-?\d+,/", "", $thiscoordinates );
			array_push(
				$railstations,
				array(
					"value_x" => $value_x,
					"value_y" => $value_y,
					"stop_name" => $row["stop_name"]
				)
			);
			if ( $rail_min_x == false ) {
				$rail_min_x = $value_x;
				$rail_max_x = $value_x;
				$rail_min_y = $value_y;
				$rail_max_y = $value_y;
			} else {
				$rail_min_x = min( $rail_min_x, $value_x );
				$rail_max_x = max( $rail_max_x, $value_x );
				$rail_min_y = min( $rail_min_y, $value_y );
				$rail_max_y = max( $rail_max_y, $value_y );
			}
		}
		array_push( $railpolylines, $thispolyline );
	}

	$busstoplocations = array();
	while ( $row = $stopids -> fetch_assoc() ) {
		$thiscoordinates = calculate_coordinates( $row["stop_lon"], $row["stop_lat"] );
		$value_x = preg_replace( "/,-?\d+$/", "", $thiscoordinates );
		$value_y = preg_replace( "/^-?\d+,/", "", $thiscoordinates );
		array_push(
			$busstoplocations,
			array(
				"value_x" => $value_x,
				"value_y" => $value_y,
				"stop_code" => $row["stop_code"],
				"stop_name" => $row["stop_name"]
			)
		);
	}

	$highwaypolylines = array();
	foreach( $highwayarray as $value ) {
		$thispolyline = "";
		while ( $row = $value -> fetch_assoc() ) {
			$thispolyline .= calculate_coordinates( $row["longitude"], $row["latitude"] ) . ' ';
		}
		array_push( $highwaypolylines, $thispolyline );
	}

	$stroke_width_route = max( 2, floor( $size / 300 ) );
	$stroke_width_rail = max( 3, floor( max( $rail_max_x - $rail_min_x, $rail_max_y - $rail_min_y ) * 0.005 ) );
	$radius_rail_station = $stroke_width_rail;

	$shapeinfo = array(
		"haversineratio" => $haversineratio,
		"validated_route" => $route_selected,
		"route_long_name" => $route_long_name,
		"route_type" => $route_type,
		"size" => $size,
		"highway" => $data["highway"],
		"norail" => $data["norail"],
		"showstops" => $data["showstops"],
		"route_color" => $route_color,
		"stroke_width_route" => $stroke_width_route,
		"stroke_width_rail" => $stroke_width_rail,
		"radius_rail_station" => $radius_rail_station,
		"routepolylines" => $routepolylines,
		"railpolylines" => $railpolylines,
		"highwaypolylines" => $highwaypolylines,
		"railstations" => $railstations,
		"busstoplocations" => $busstoplocations
	);
	
	return $shapeinfo;

}

function get_nearby_schedule( $route ) {
	// In the context of this function, "nearby" relates to time, not distance.
	// A route is considered "nearby" if any portion of its scheduled run takes place within a half-hour
	// of the current time. The $nearby_time variable frames the time period.
	// 13000 = 1.5 hours; 10000 = 1 hour; 4500 = 45 minutes; 3000 = 30 minutes; 1500 = 15 minutes
	$nearby_time_past = "1500";
	$nearby_time_future = "13000";

	global $mysqli;

	// $route is passed in so that it doesn't have to get validated a second time.
	// The other parameters are calculated here.
	$time_now = _getServiceDate();
	$time_now_text = $time_now["G"] . ":" . $time_now["i"] . ":" . $time_now["s"];
	$service_id = _getServiceID();
// HEREDOC ------------------------------------------------------------------------
	$query_nearby = <<<QUERY_NEARBY

SELECT
  R.route_short_name,
  T.trip_id,
  T.direction_id,
  JD.direction,
  T.shape_id,
  IFNULL( T.trip_headsign, CONCAT( 'Route ', R.route_short_name, ' ', R.route_long_name ) ) AS trip_headsign,
  ST.arrival_time,
  ST.stop_sequence,
  S.stop_code,
  S.stop_name
FROM
  (
    SELECT
      Q1.trip_id,
      min( timediff( ST2.arrival_time, '0:00:00' ) + 0 ) AS run_start
    FROM
      (
        SELECT DISTINCT T1.trip_id
        FROM routes R1
          INNER JOIN trips T1
            ON R1.route_id = T1.route_id
          INNER JOIN stop_times ST1
            ON T1.trip_id = ST1.trip_id
        WHERE
          R1.route_short_name = '{$route}'
          AND T1.service_id = {$service_id}
          AND timediff( ST1.arrival_time, '{$time_now_text}' ) + 0 BETWEEN -{$nearby_time_past} and {$nearby_time_future}
      ) AS Q1
      INNER JOIN stop_times ST2
        ON Q1.trip_id = ST2.trip_id
      GROUP by Q1.trip_id
  ) AS Q2
  INNER JOIN trips T
    ON Q2.trip_id = T.trip_id
  INNER JOIN routes R
    ON T.route_id = R.route_id
  INNER JOIN J_directions JD
    ON
      (
        R.route_short_name = JD.route_short_name
        AND T.direction_id = JD.direction_id
      )
  INNER JOIN stop_times ST
    ON T.trip_id = ST.trip_id
  INNER JOIN stops S
    ON ST.stop_id = S.stop_id
ORDER BY
  T.direction_id,
  T.shape_id,
  Q2.run_start,
  ST.stop_sequence

QUERY_NEARBY;
// --------------------------------------------------------------------------------
	$nearby = $mysqli -> query( $query_nearby );
	$nearbyarray = array();
	$stoparray = array();
	$prev_direction_id = -1;
	$prev_shape_id = -1;
	$prev_trip_id = -1;
	while ( $row = $nearby -> fetch_assoc() ) {
		if ( $row["direction_id"] != $prev_direction_id ) {
			$nearbyarray[$row["direction_id"]] = array();
			$nearbyarray[$row["direction_id"]]["Direction"] = $row["direction"];
			$nearbyarray[$row["direction_id"]]["Shapes"] = array();
			$prev_shape_id = -1;		// to ensure that a new shape is registered in the unlikely case that the direction changed but the shape didn't.
			$prev_direction_id = $row["direction_id"];
		}
		if ( $row["shape_id"] != $prev_shape_id ) {
			$nearbyarray[$row["direction_id"]]["Shapes"][$row["shape_id"]] = array();
			$nearbyarray[$row["direction_id"]]["Shapes"][$row["shape_id"]]["Headsign"] = "";
			$nearbyarray[$row["direction_id"]]["Shapes"][$row["shape_id"]]["Trips"] = array();
			$nearbyarray[$row["direction_id"]]["Shapes"][$row["shape_id"]]["Stops"] = array();
			$prev_shape_id = $row["shape_id"];
		}
		if ( $row["trip_id"] != $prev_trip_id ) {
			array_push( $nearbyarray[$row["direction_id"]]["Shapes"][$row["shape_id"]]["Trips"], $row["trip_id"] );
			$prev_trip_id = $row["trip_id"];
		}
		if ( strpos( $nearbyarray[$row["direction_id"]]["Shapes"][$row["shape_id"]]["Headsign"], "(" . $row["trip_headsign"] . ")" ) === false ) {
			$nearbyarray[$row["direction_id"]]["Shapes"][$row["shape_id"]]["Headsign"] .= "(" . $row["trip_headsign"] . ")";
		}
		$nearbyarray[$row["direction_id"]]["Shapes"][$row["shape_id"]]["Stops"][$row["stop_sequence"]]["Code"] = $row["stop_code"];
		$nearbyarray[$row["direction_id"]]["Shapes"][$row["shape_id"]]["Stops"][$row["stop_sequence"]]["Name"] = $row["stop_name"];
		$stoparray[$row["stop_code"] . "-" . $row["trip_id"]] = $row["arrival_time"];
	}

	$result["nearbyarray"] = $nearbyarray;
	$result["stoparray"] = $stoparray;
	
	return $result;
}
?>