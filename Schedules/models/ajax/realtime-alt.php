<?php
require_once('../includes/main.php');
require_once('../includes/validate.php');
	
$routeselected = _validate( "route" );
$serviceID = _getServiceID();
$query_timePredictions = "";

$realtimeJSON = file_get_contents( "http://developer.itsmarta.com/BRDRestService/BRDRestService.svc/GetBusByRoute/" . $routeselected );
$realtimeResult = json_decode( $realtimeJSON );
var_dump( $realtimeResult );

foreach( $realtimeResult as $arraykey => $arrayvalue ):

		$realtimeResult[$arraykey] -> COORDINDATES = $realtimeResult[$arraykey] -> LATITUDE . ',' . $realtimeResult[$arraykey] -> LONGITUDE;

// HEREDOC ------------------------------------------------------------------------
	$query_closest_stop = <<<QUERY_CLOSEST_STOP

SELECT Q1.*
FROM
  (
    SELECT DISTINCT
      T.trip_headsign,
      T.direction_id,
      JD.direction,
      T.shape_id,
      ST.stop_sequence,
      S.stop_code,
      S.stop_name,
      S.stop_lat,
      S.stop_lon,
      ABS( S.stop_lat - {$realtimeResult[$arraykey] -> LATITUDE} ) + ABS ( S.stop_lon - {$realtimeResult[$arraykey] -> LONGITUDE} ) AS dist
    FROM routes R
      INNER JOIN trips T
        ON R.route_id = T.route_id
      INNER JOIN stop_times ST
        ON T.trip_id = ST.trip_id
      INNER JOIN stops S
        ON ST.stop_id = S.stop_id
      INNER JOIN J_directions JD
        ON
          (
            T.direction_id = JD.direction_id
            AND R.route_short_name = JD.route_short_name
          )
    WHERE
      R.route_short_name = '{$routeselected}'
      AND JD.direction = '{$realtimeResult[$arraykey] -> DIRECTION}'
      AND T.service_id = {$serviceID}
    ORDER BY dist
  ) AS Q1
LIMIT 1;

QUERY_CLOSEST_STOP;
// --------------------------------------------------------------------------------
	$closest_stop = $mysqli -> query( $query_closest_stop );
	$row = $closest_stop -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
	$realtimeResult[$arraykey] -> NEAREST_STOP_CODE = $row["stop_code"];
	$realtimeResult[$arraykey] -> NEAREST_STOP_NAME = $row["stop_name"];
	$realtimeResult[$arraykey] -> NEAREST_STOP_SEQUENCE = $row["stop_sequence"];
	$realtimeResult[$arraykey] -> NEAREST_STOP_LATITUDE = $row["stop_lat"];
	$realtimeResult[$arraykey] -> NEAREST_STOP_LONGITITUDE = $row["stop_lon"];
	$realtimeResult[$arraykey] -> NEAREST_STOP_DIRECTIONID = $row["direction_id"];

	$adherenceValue = intval( $realtimeResult[$arraykey] -> ADHERENCE );
	$nearestStopScheduled = DateTime::createFromFormat( 'n/j/Y g:i:s a', $realtimeResult[$arraykey] -> MSGTIME );
	if ( $adherenceValue < 0 ) {
		$nearestStopScheduled -> sub( new DateInterval( "PT" . abs( $adherenceValue ) . "M" ) );
	} else {
		$nearestStopScheduled -> add( new DateInterval( "PT" . $adherenceValue . "M" ) );
	}
	$realtimeHour = $nearestStopScheduled -> format( "H" );
	$realtimeHour = $realtimeHour + ( $realtimeHour >= 3 ? 0 : 24 );
	$realtimetimeStamp = $realtimeHour . $nearestStopScheduled -> format( ":i:s" );
	$realtimeResult[$arraykey] -> NEAREST_STOP_SCHEDULED_TIME = $realtimetimeStamp;
	$nowDateTime = new DateTime();
	$nowDateTimeValue = $nowDateTime -> format( "G:i:s" );
	$realtimeResult[$arraykey] -> NOW = $nowDateTimeValue;
// HEREDOC ------------------------------------------------------------------------
		$query_timePredictionsInsert = <<<QUERY_TIMEPREDICTIONSINSERT
UNION SELECT
  T.trip_id,
  T.direction_id,
  ST.stop_sequence,
  ST.arrival_time,
  S.stop_code,
  S.stop_name,
  timediff( ST.arrival_time, '{$nowDateTimeValue}' ) AS MINSTOARRIVAL
FROM trips T
  INNER JOIN stop_times ST
    ON T.trip_id = ST.trip_id
  INNER JOIN stops S
    ON ST.stop_id = S.stop_id
WHERE T.trip_id =
  (
    SELECT Q1.trip_id
    FROM
      (
        SELECT
          T.trip_id
        FROM routes R
          INNER JOIN trips T
            ON R.route_id = T.route_id
          INNER JOIN stop_times ST
            ON T.trip_id = ST.trip_id
          INNER JOIN stops S
            ON ST.stop_id = S.stop_id
        WHERE
          R.route_short_name = '{$realtimeResult[$arraykey] -> ROUTE}'
          AND T.direction_id = {$row["direction_id"]}
          AND S.stop_code = {$row["stop_code"]}
        ORDER BY abs( timediff( ST.arrival_time, '{$realtimetimeStamp}' ) )
      ) AS Q1
    LIMIT 1
  )
  AND T.service_id = {$serviceID}
  AND timediff( ST.arrival_time, '{$nowDateTimeValue}' ) >= 0

QUERY_TIMEPREDICTIONSINSERT;
// --------------------------------------------------------------------------------
	if ( $row["direction_id"] != "" ) {
		$query_timePredictions .= $query_timePredictionsInsert;
	}
?>
<p>Vehicle: <?=$realtimeResult[$arraykey] -> VEHICLE?></p>
<p><?=$row["direction_id"]?></p>
<ul>
<?php
	foreach( $realtimeResult[$arraykey] as $tripkey => $tripvalue ):
?>
	<li><?=$tripkey?>:
<?php
		if ( gettype( $tripvalue ) == "object" ) {
			var_dump( $tripvalue );
		} else {
			echo( $tripvalue );
		}
?>
</li>
<?php
	endforeach;
?>
</ul>
<?php
endforeach;

$date = new DateTime();
$weekday = strtolower( $date -> format( "l" ) );
$datecode = $date -> format( "Ymd" );
echo( "[" . $weekday . "][" . $datecode . "]" );

$query_timePredictions = preg_replace( "/^UNION /", "", $query_timePredictions );
// HEREDOC ------------------------------------------------------------------------
	$query_timePredictions .= <<<QUERY_TIMEPREDICTIONS
ORDER BY
  trip_id,
  stop_sequence
  
QUERY_TIMEPREDICTIONS
// --------------------------------------------------------------------------------
?>
<pre>
<?=$query_timePredictions?>
</pre>
<?php
echo _getServiceID();
?>
