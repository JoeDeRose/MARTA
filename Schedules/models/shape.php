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
      T.trip_headsign,
      SH.shape_id,
      SH.shape_pt_sequence,
      SH.shape_pt_lat,
      SH.shape_pt_lon,
      CASE T.service_id
        WHEN {$ServiceID} THEN 1
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
		if ( isset( $shape_info[$row["shape_id"]] ) == false ) {
			$shape_info[$row["shape_id"]]["headsign"] = $row["trip_headsign"];
			$shape_info[$row["shape_id"]]["shape_id"] = $row["shape_id"];
			$shape_info[$row["shape_id"]]["RunsToday"] = $row["RunsToday"];
			$shape_info[$row["shape_id"]]["coordinates"] = array();
		}
		array_push( $shape_info[$row["shape_id"]]["coordinates"], "new google.maps.LatLng( " . $row["shape_pt_lat"] . ", ". $row["shape_pt_lon"] . " )" );
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
		"shape_info" => $shape_info
	);

	return $result;
}
?>