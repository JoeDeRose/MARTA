<?php
function get_stop_info( $stopid ) {

	global $mysqli;

// HEREDOC ------------------------------------------------------------------------
	$query_stop_info = <<<QUERY_STOP_INFO

SELECT *
FROM stops
WHERE stop_id = '{$stopid}'

QUERY_STOP_INFO;
// --------------------------------------------------------------------------------
	$stopinfo = $mysqli -> query( $query_stop_info );
    $row = $stopinfo -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
	$stopinfoarray = array();
    $stopinfoarray[ "stop_id" ] = $stopid;
    $stopinfoarray[ "stop_name" ] = $row[ "stop_name" ];
    $stopinfoarray[ "stop_lat" ] = $row[ "stop_lat" ];
    $stopinfoarray[ "stop_lon" ] = $row[ "stop_lon" ];
    
	$result = $stopinfoarray;
	
	return $result;
}

function get_stop_schedule( $stopid ) {
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
	$query_stop_schedule = <<<QUERY_STOP_SCHEDULE

SELECT DISTINCT
  T.trip_id,
  R.route_short_name,
  C.service_id,
  CASE C.service_id
    WHEN 5 THEN "Weekday"
    WHEN 3 THEN "Saturday"
    WHEN 4 then "Sunday"
    ELSE "Error"
  END AS ServiceDay,
  IFNULL( T.trip_headsign, CONCAT( 'Route ', R.route_short_name, ' ', R.route_long_name ) ) AS trip_headsign,
  T.shape_id,
  ST.stop_sequence,
  ST.arrival_time,
  S.stop_name,
  CASE
    WHEN C.service_id <> '{$service_id}' THEN 0
    WHEN timediff( ST.arrival_time, '{$time_now_text}' ) + 0 BETWEEN -{$nearby_time_past} and {$nearby_time_future} THEN 1
    ELSE 0
  END AS IsArrivingSoon
FROM routes R
  INNER JOIN trips T
    ON T.route_id = R.route_id
  INNER JOIN calendar C
    ON C.service_id = T.service_id
  INNER JOIN stop_times ST
    ON ST.trip_id = T.trip_id
  INNER JOIN stops S
    ON ( S.stop_id = ST.stop_id AND S.stop_id = '{$stopid}' )
ORDER BY
  CONVERT( R.route_short_name, UNSIGNED INTEGER ),
  CASE C.service_id
    WHEN 5 THEN 1  /* Weekday */
    WHEN 3 THEN 2  /* Saturday */
    WHEN 4 then 3  /* Sunday */
    ELSE 4         /* Error */
  END,
  T.trip_headsign,
  C.service_id,
  T.shape_id,
  ST.arrival_time
    
QUERY_STOP_SCHEDULE;
// --------------------------------------------------------------------------------
// return "[" . $service_id . "][" . $time_now_text . "][" . $nearby_time_past . "][" . $nearby_time_future . "][" . $stopid . "]";
// return $query_stop_schedule;
	$stopschedule = $mysqli -> query( $query_stop_schedule );
	$stopschedulearray = array();
	while ( $row = $stopschedule -> fetch_assoc() ) {
        
        $ThisTripID = $row[ "trip_id" ];
        $ThisRouteShortName = $row[ "route_short_name" ];
        $ThisServiceID = $row[ "service_id" ];
        $ThisServiceDay = $row[ "ServiceDay" ];
        $ThisTripHeadsign = $row[ "trip_headsign" ];
        $ThisShapeID = $row[ "shape_id" ];
        $ThisStopSequence = $row[ "stop_sequence" ];
        $ThisArrivalTime = $row[ "arrival_time" ];
        $ThisStopName = $row[ "stop_name" ];
        $ThisIsArrivingSoon = $row[ "IsArrivingSoon" ];
        
        if ( isset( $stopschedulearray[ $ThisShapeID ] ) == false ) {
            
            $stopschedulearray[ $ThisShapeID ][ "RouteShortName" ] = $ThisRouteShortName;
            $stopschedulearray[ $ThisShapeID ][ "Headsign" ] = $ThisTripHeadsign;
            $stopschedulearray[ $ThisShapeID ][ "StopSequence" ] = $ThisStopSequence;
            $stopschedulearray[ $ThisShapeID ][ "IsArrivingSoon" ] = False;
            $stopschedulearray[ $ThisShapeID ][ "Sched" ][ 5 ] = array();
            $stopschedulearray[ $ThisShapeID ][ "Sched" ][ 3 ] = array();
            $stopschedulearray[ $ThisShapeID ][ "Sched" ][ 4 ] = array();
            
        }
        
        if ( $ThisIsArrivingSoon == 1 ) {
            $stopschedulearray[ $ThisShapeID ][ "IsArrivingSoon" ] = True;
        }
        $stopschedulearray[ $ThisShapeID ][ "SchedDescription" ][ $ThisServiceID ] = $ThisServiceDay;
        $stopschedulearray[ $ThisShapeID ][ "Sched" ][ $ThisServiceID ][ $ThisTripID ][ "Time" ] = $ThisArrivalTime;
        $stopschedulearray[ $ThisShapeID ][ "Sched" ][ $ThisServiceID ][ $ThisTripID ][ "ArrivingSoon" ] = $ThisIsArrivingSoon;

	}

	$result = $stopschedulearray;
	
	return $result;
}
?>