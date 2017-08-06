<?php
function get_shape( $data ) {
	
	// Global variables
	global $mysqli;

	// Retrieve contents from $data.
	$validated_route = $data["validated_route"];
	
	$ServiceID = _getServiceID();

	// HEREDOC ------------------------------------------------------------------------
	$query_route_info = <<<QUERY_ROUTE_INFO

SELECT *
FROM routes
WHERE route_short_name = '{$validated_route}';

QUERY_ROUTE_INFO;
	// --------------------------------------------------------------------------------
	$route_info = $mysqli -> query( $query_route_info );
	$row = $route_info -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
	$route_long_name = $row["route_long_name"];
	$route_type = $row["route_type"];
	$route_color = $row["route_color"];

	// HEREDOC ------------------------------------------------------------------------
	$query_route_frame = <<<QUERY_ROUTE_FRAME

SELECT
	MIN(shape_pt_lat) AS MIN_LAT,
	MAX(shape_pt_lat) AS MAX_LAT,
	MIN(shape_pt_lon) AS MIN_LON,
	MAX(shape_pt_lon) AS MAX_LON
FROM routes R
  INNER JOIN trips T
    ON R.route_id = T.route_id
  INNER JOIN shapes SH
    ON T.shape_id = SH.shape_id
WHERE R.route_short_name = '{$validated_route}'

QUERY_ROUTE_FRAME;
// --------------------------------------------------------------------------------
	$route_frame = $mysqli -> query( $query_route_frame );
	$row = $route_frame -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
	$route_min_lat = $row["MIN_LAT"];
	$route_max_lat = $row["MAX_LAT"];
	$route_avg_lat = ( $route_min_lat + $route_max_lat ) / 2;
	$route_span_lat = $route_max_lat - $route_min_lat;
	$route_min_lon = $row["MIN_LON"];
	$route_max_lon = $row["MAX_LON"];
	$route_avg_lon = ( $route_min_lon + $route_max_lon ) / 2;
	$route_span_lon = $route_max_lon - $route_min_lon;
	$MARTA_Time = _MARTA_time();

	// HEREDOC ------------------------------------------------------------------------
	$query_route_shapes = <<<QUERY_ROUTE_SHAPES

SELECT
  Q1.direction_id,
  Q1.trip_headsign,
  Q1.shape_id,
  Q1.shape_pt_sequence,
  Q1.shape_pt_lat,
  Q1.shape_pt_lon,
  MAX( Q1.RunsToday ) AS RunsToday
FROM
  (
    SELECT
      T.direction_id,
      IFNULL( T.trip_headsign, CONCAT( 'Route ', R.route_short_name, ' ', R.route_long_name ) ) AS trip_headsign,
      SH.shape_id,
      SH.shape_pt_sequence,
      SH.shape_pt_lat,
      SH.shape_pt_lon,
      CASE T.service_id
        WHEN {$ServiceID} THEN
          CASE
            WHEN 
              (
                SELECT MAX( timediff( ST1.arrival_time, '{$MARTA_Time}' ) + 0 )
                FROM stop_times ST1
                WHERE ST1.trip_id = T.trip_id
              ) > 0 THEN 2
            ELSE 1
          END
        ELSE 0
      END AS RunsToday
    FROM routes R
      INNER JOIN trips T
        ON R.route_id = T.route_id
      INNER JOIN shapes SH
        ON T.shape_id = SH.shape_id
    WHERE R.route_short_name = '{$validated_route}'
  ) Q1
GROUP BY
  Q1.direction_id,
  Q1.trip_headsign,
  Q1.shape_id,
  Q1.shape_pt_sequence,
  Q1.shape_pt_lat,
  Q1.shape_pt_lon
ORDER BY
  Q1.direction_id,
  Q1.trip_headsign,
  Q1.shape_id,
  Q1.shape_pt_sequence;
  
QUERY_ROUTE_SHAPES;
	// --------------------------------------------------------------------------------
	$route_shapes = $mysqli -> query( $query_route_shapes );
	$shape_info = array();
	while ( $row = $route_shapes -> fetch_assoc() ) {
        $ThisShape = $row["shape_id"];
        $ThisTripHeadsign = $row["trip_headsign"];
        $ThisRunsToday = $row["RunsToday"];
        $ThisShapePtLat = $row["shape_pt_lat"];
        $ThisShapePtLon = $row["shape_pt_lon"];
		if ( isset( $shape_info[$ThisShape] ) == false ) {
            if ( $ThisTripHeadsign == "" ) {
                $shape_info[$ThisShape]["headsign"] = "Route " . $validated_route;
            } else {
                $shape_info[$ThisShape]["headsign"] = $ThisTripHeadsign;
            }
			$shape_info[$ThisShape]["shape_id"] = $ThisShape;
			$shape_info[$ThisShape]["RunsToday"] = $ThisRunsToday;
			$shape_info[$ThisShape]["coordinates"] = array();
		}
		array_push( $shape_info[$ThisShape]["coordinates"], "new google.maps.LatLng( " . $ThisShapePtLat . ", ". $ThisShapePtLon . " )" );
	}

	// HEREDOC ------------------------------------------------------------------------
	$query_route_stops_by_shape = <<<QUERY_ROUTE_STOPS_BY_SHAPE

SELECT DISTINCT
  R.route_short_name,
  T.shape_id,
  ST.stop_sequence,
  S.stop_name,
  S.stop_id
FROM routes R
  INNER JOIN trips T
    ON T.route_id = R.route_id
  INNER JOIN stop_times ST
    ON ST.trip_id = T.trip_id
  INNER JOIN stops S
    ON S.stop_id = ST.stop_id
WHERE R.route_short_name = '{$validated_route}'
ORDER BY
  R.route_short_name,
  T.shape_id,
  ST.stop_sequence;
  
QUERY_ROUTE_STOPS_BY_SHAPE;
	// --------------------------------------------------------------------------------

	$route_stops_by_shape = $mysqli -> query( $query_route_stops_by_shape );
	$stops_by_shape = array();
	while ( $row = $route_stops_by_shape -> fetch_assoc() ) {
        $ThisShape = $row["shape_id"];
        $ThisStopSequence = $row["stop_sequence"];
        $ThisStopName = $row["stop_name"];
        $ThisStopID = $row["stop_id"];
		if ( isset( $stops_by_shape[$ThisShape] ) == false ) {
			$stops_by_shape[$ThisShape]["shape_id"] = $ThisShape;
			$stops_by_shape[$ThisShape]["stops"] = array();
		}
        $stops_by_shape[$ThisShape]["stops"][$ThisStopSequence]["StopName"] = $ThisStopName;
        $stops_by_shape[$ThisShape]["stops"][$ThisStopSequence]["StopID"] = $ThisStopID;
	}

	$result = array(
		"route_long_name" => $route_long_name,
		"route_type" => $route_type,
		"route_color" => $route_color,
		"route_min_lat" => $route_min_lat,
		"route_max_lat" => $route_max_lat,
		"route_avg_lat" => $route_avg_lat,
		"route_span_lat" => $route_span_lat,
		"route_min_lon" => $route_min_lon,
		"route_max_lon" => $route_max_lon,
		"route_avg_lon" => $route_avg_lon,
		"route_span_lon" => $route_span_lon,
		"shape_info" => $shape_info,
        "stops_by_shape" => $stops_by_shape
	);

	return $result;
}

function get_shapes_serving_a_stop( $data ) {
	
	// Global variables
	global $mysqli;

	// Retrieve contents from $data.
    $stopid = $data[ "stopid" ];
	
	$ServiceID = _getServiceID();

	// HEREDOC ------------------------------------------------------------------------
	$query_route_frame = <<<QUERY_ROUTE_FRAME

SELECT
	MIN(shape_pt_lat) AS MIN_LAT,
	MAX(shape_pt_lat) AS MAX_LAT,
	MIN(shape_pt_lon) AS MIN_LON,
	MAX(shape_pt_lon) AS MAX_LON
FROM stop_times ST
  INNER JOIN trips T
    ON T.trip_id = ST.trip_id
  INNER JOIN routes R
    ON R.route_id = T.route_id
  INNER JOIN shapes SH
    ON SH.shape_id = T.shape_id
WHERE ST.stop_id = '{$stopid}'

QUERY_ROUTE_FRAME;
// --------------------------------------------------------------------------------
	$route_frame = $mysqli -> query( $query_route_frame );
	$row = $route_frame -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
	$route_min_lat = $row["MIN_LAT"];
	$route_max_lat = $row["MAX_LAT"];
	$route_avg_lat = ( $route_min_lat + $route_max_lat ) / 2;
	$route_span_lat = $route_max_lat - $route_min_lat;
	$route_min_lon = $row["MIN_LON"];
	$route_max_lon = $row["MAX_LON"];
	$route_avg_lon = ( $route_min_lon + $route_max_lon ) / 2;
	$route_span_lon = $route_max_lon - $route_min_lon;
	$MARTA_Time = _MARTA_time();

	// HEREDOC ------------------------------------------------------------------------
	$query_route_shapes = <<<QUERY_ROUTE_SHAPES

SELECT
  Q1.direction_id,
  Q1.trip_headsign,
  Q1.shape_id,
  Q1.shape_pt_sequence,
  Q1.shape_pt_lat,
  Q1.shape_pt_lon,
  MAX( Q1.RunsToday ) AS RunsToday
FROM
  (
    SELECT
      T.direction_id,
      IFNULL( T.trip_headsign, CONCAT( 'Route ', R.route_short_name, ' ', R.route_long_name ) ) AS trip_headsign,
      SH.shape_id,
      SH.shape_pt_sequence,
      SH.shape_pt_lat,
      SH.shape_pt_lon,
      CASE T.service_id
        WHEN {$ServiceID} THEN
          CASE
            WHEN 
              (
                SELECT MAX( timediff( ST1.arrival_time, '{$MARTA_Time}' ) + 0 )
                FROM stop_times ST1
                WHERE ST1.trip_id = T.trip_id
              ) > 0 THEN 2
            ELSE 1
          END
        ELSE 0
      END AS RunsToday
    FROM stop_times ST
      INNER JOIN trips T
        ON T.trip_id = ST.trip_id
      INNER JOIN routes R
        ON R.route_id = T.route_id
      INNER JOIN shapes SH
        ON SH.shape_id = T.shape_id
    WHERE ST.stop_id = '{$stopid}'
  ) Q1
GROUP BY
  Q1.direction_id,
  Q1.trip_headsign,
  Q1.shape_id,
  Q1.shape_pt_sequence,
  Q1.shape_pt_lat,
  Q1.shape_pt_lon
ORDER BY
  Q1.direction_id,
  Q1.trip_headsign,
  Q1.shape_id,
  Q1.shape_pt_sequence;

  
QUERY_ROUTE_SHAPES;
	// --------------------------------------------------------------------------------
	$route_shapes = $mysqli -> query( $query_route_shapes );
	$shape_info = array();
	while ( $row = $route_shapes -> fetch_assoc() ) {
        $ThisShape = $row["shape_id"];
        $ThisTripHeadsign = $row["trip_headsign"];
        $ThisRunsToday = $row["RunsToday"];
        $ThisShapePtLat = $row["shape_pt_lat"];
        $ThisShapePtLon = $row["shape_pt_lon"];
		if ( isset( $shape_info[$ThisShape] ) == false ) {
            $shape_info[$ThisShape]["headsign"] = $ThisTripHeadsign;
			$shape_info[$ThisShape]["shape_id"] = $ThisShape;
			$shape_info[$ThisShape]["RunsToday"] = $ThisRunsToday;
			$shape_info[$ThisShape]["coordinates"] = array();
		}
		array_push( $shape_info[$ThisShape]["coordinates"], "new google.maps.LatLng( " . $ThisShapePtLat . ", ". $ThisShapePtLon . " )" );
	}

	// HEREDOC ------------------------------------------------------------------------
	$query_route_stops_by_shape = <<<QUERY_ROUTE_STOPS_BY_SHAPE

SELECT DISTINCT
  R.route_short_name,
  T.shape_id,
  ST.stop_sequence,
  S.stop_name,
  S.stop_id
FROM trips T
  INNER JOIN routes R 
    ON R.route_id = T.route_id
  INNER JOIN stop_times ST
    ON ST.trip_id = T.trip_id
  INNER JOIN stops S
    ON S.stop_id = ST.stop_id
WHERE T.shape_id IN
  (
    SELECT DISTINCT T.shape_id
    FROM stop_times ST
      INNER JOIN trips T
        ON T.trip_id = ST.trip_id
    WHERE ST.stop_id = '901843'
    --                      {$stopid}
  )
ORDER BY
  R.route_short_name,
  T.shape_id,
  ST.stop_sequence;
  
QUERY_ROUTE_STOPS_BY_SHAPE;
	// --------------------------------------------------------------------------------

	$route_stops_by_shape = $mysqli -> query( $query_route_stops_by_shape );
	$stops_by_shape = array();
	while ( $row = $route_stops_by_shape -> fetch_assoc() ) {
        $ThisShape = $row["shape_id"];
        $ThisStopSequence = $row["stop_sequence"];
        $ThisStopName = $row["stop_name"];
        $ThisStopID = $row["stop_id"];
		if ( isset( $stops_by_shape[$ThisShape] ) == false ) {
			$stops_by_shape[$ThisShape]["shape_id"] = $ThisShape;
			$stops_by_shape[$ThisShape]["stops"] = array();
		}
        $stops_by_shape[$ThisShape]["stops"][$ThisStopSequence]["StopName"] = $ThisStopName;
        $stops_by_shape[$ThisShape]["stops"][$ThisStopSequence]["StopID"] = $ThisStopID;
	}

	$result = array(
		"route_min_lat" => $route_min_lat,
		"route_max_lat" => $route_max_lat,
		"route_avg_lat" => $route_avg_lat,
		"route_span_lat" => $route_span_lat,
		"route_min_lon" => $route_min_lon,
		"route_max_lon" => $route_max_lon,
		"route_avg_lon" => $route_avg_lon,
		"route_span_lon" => $route_span_lon,
		"shape_info" => $shape_info,
        "stops_by_shape" => $stops_by_shape
	);

	return $result;
}

?>