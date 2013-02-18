<?php
$DiagnosticMode = false;

if ( $DiagnosticMode == false ) {
	header('Content-type: application/json');
}

require_once('../includes/main.php');
require_once('../includes/validate.php');

$RouteSelected = _validate( "route" );
$ServiceID = _getServiceID();
$qTimePredictions = "";

$RealTimeJSON = file_get_contents( "http://developer.itsmarta.com/BRDRestService/BRDRestService.svc/GetBusByRoute/" . $RouteSelected );
$RealTimeResult = json_decode( $RealTimeJSON );

foreach( $RealTimeResult as $arraykey => $arrayvalue ):

	try {

		$RealTimeResult[$arraykey] -> COORDINDATES = $RealTimeResult[$arraykey] -> LATITUDE . ',' . $RealTimeResult[$arraykey] -> LONGITUDE;
		// Sometimes TRIPID is blank; recover gracefully when this happens.
		$ThisTripID = ( $RealTimeResult[$arraykey] -> TRIPID == "" ) ? 0 : $RealTimeResult[$arraykey] -> TRIPID;

// HEREDOC ------------------------------------------------------------------------
	$qClosestStop = <<<Q_CLOSEST_STOP

SELECT Q1.*
FROM
  (
    SELECT DISTINCT
      T.trip_headsign,
      T.direction_id,
      T.shape_id,
      ST.stop_sequence,
      ST.arrival_time,
      S.stop_code,
      S.stop_name,
      S.stop_lat,
      S.stop_lon,
      ABS( S.stop_lat - {$RealTimeResult[$arraykey] -> LATITUDE} ) + ABS ( S.stop_lon - {$RealTimeResult[$arraykey] -> LONGITUDE} ) AS dist
    FROM routes R
      INNER JOIN trips T
        ON R.route_id = T.route_id
      INNER JOIN stop_times ST
        ON T.trip_id = ST.trip_id
      INNER JOIN stops S
        ON ST.stop_id = S.stop_id
    WHERE
      T.trip_id = {$ThisTripID}
    ORDER BY dist
  ) AS Q1
LIMIT 1;

Q_CLOSEST_STOP;
// --------------------------------------------------------------------------------

		$ClosestStop = $mysqli -> query( $qClosestStop );
		$row = $ClosestStop -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
		$RealTimeResult[$arraykey] -> HEADSIGN = $row["trip_headsign"];
		$RealTimeResult[$arraykey] -> NEAREST_STOP_CODE = $row["stop_code"];
		$RealTimeResult[$arraykey] -> NEAREST_STOP_NAME = $row["stop_name"];
		$RealTimeResult[$arraykey] -> NEAREST_STOP_SEQUENCE = $row["stop_sequence"];
		$RealTimeResult[$arraykey] -> NEAREST_STOP_LATITUDE = $row["stop_lat"];
		$RealTimeResult[$arraykey] -> NEAREST_STOP_LONGITITUDE = $row["stop_lon"];
		$RealTimeResult[$arraykey] -> NEAREST_STOP_DIRECTIONID = $row["direction_id"];
	
		$AdherenceValue = intval( $RealTimeResult[$arraykey] -> ADHERENCE );
		$MessageTime = DateTime::createFromFormat( 'n/j/Y g:i:s a', $RealTimeResult[$arraykey] -> MSGTIME );
		$RealTimeResult[$arraykey] -> NEAREST_STOP_SCHEDULED_TIME = $row["arrival_time"];
		$NowDateTime = new DateTime();
		$NowDateTimeValue = $NowDateTime -> format( "G:i:s" );
		$RealTimeResult[$arraykey] -> NOW = $NowDateTimeValue;
		$MessageAge = $MessageTime -> diff( $NowDateTime );
		$MessageAgeText = $MessageAge -> i;
		$RealTimeResult[$arraykey] -> MESSAGE_AGE = $MessageAgeText;
		$MessageAgeDiff = $MessageAgeText * 100;

// The Following prediction content was based on the (incorrect) assumption that the MSGTIME value
// in the MARTA JSON response was the time that the bus location was last updated.
/*
// HEREDOC ------------------------------------------------------------------------
	$qPredictionStop = <<<Q_PREDICTION_STOP

SELECT Q1.*
FROM
  (
    SELECT
      ST.*,
      S.stop_code,
      S.stop_name,
	  S.stop_lon,
	  S.stop_lat,
      abs( timediff( ST.arrival_time, '{$row["arrival_time"]}' ) - {$MessageAgeDiff} ) AS DIFF
    FROM stop_times ST
      INNER JOIN stops S
        ON ST.stop_id = S.stop_id
    WHERE
      ST.trip_id = {$RealTimeResult[$arraykey] -> TRIPID}
      AND ST.stop_sequence >= {$row["stop_sequence"]}
    ORDER BY
      DIFF,
      ST.stop_sequence
  ) Q1
LIMIT 1;

Q_PREDICTION_STOP;
// --------------------------------------------------------------------------------
		$PredictionStop = $mysqli -> query( $qPredictionStop );
		$row1 = $PredictionStop -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
		$RealTimeResult[$arraykey] -> PREDICTION_LATITUDE = $row1["stop_lat"];
		$RealTimeResult[$arraykey] -> PREDICTION_LONGITUDE = $row1["stop_lon"];
		$RealTimeResult[$arraykey] -> PREDICTION_CODE = $row1["stop_code"];
		$RealTimeResult[$arraykey] -> PREDICTION_NAME = $row1["stop_name"];
*/

// The Following prediction content is based on the (revised) understanding that the MSGTIME value
// in the MARTA JSON response is the time that the bus last reached a timepoint stop.
// HEREDOC ------------------------------------------------------------------------
	$qPredictionStop = <<<Q_PREDICTION_STOP

SELECT Q1.*
FROM
  (
    SELECT
      ST.*,
      S.stop_code,
      S.stop_name,
  	  S.stop_lon,
  	  S.stop_lat,
      abs
        (
          timediff
            (
              ST.arrival_time,
                (
                  SELECT ST1.arrival_time
                  FROM stop_times ST1
                    INNER JOIN stops S1
                      ON ST1.stop_id = S1.stop_id
                  WHERE
                    ST1.trip_id = {$RealTimeResult[$arraykey] -> TRIPID}
                    AND S1.stop_code = {$RealTimeResult[$arraykey] -> STOPID}
                )
            ) - {$MessageAgeDiff}
        ) AS DIFF
    FROM stop_times ST
      INNER JOIN stops S
        ON ST.stop_id = S.stop_id
    WHERE
      ST.trip_id = {$RealTimeResult[$arraykey] -> TRIPID}
    ORDER BY
      DIFF,
      ST.stop_sequence
  ) Q1
LIMIT 1;

Q_PREDICTION_STOP;
// --------------------------------------------------------------------------------
		$PredictionStop = $mysqli -> query( $qPredictionStop );
		$row1 = $PredictionStop -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
		$RealTimeResult[$arraykey] -> PREDICTION_LATITUDE = $row1["stop_lat"];
		$RealTimeResult[$arraykey] -> PREDICTION_LONGITUDE = $row1["stop_lon"];
		$RealTimeResult[$arraykey] -> PREDICTION_CODE = $row1["stop_code"];
		$RealTimeResult[$arraykey] -> PREDICTION_NAME = $row1["stop_name"];
		$RealTimeResult[$arraykey] -> PREDICTION_SEQUENCE = $row1["stop_sequence"];

// HEREDOC ------------------------------------------------------------------------
		$qTimePredictionsInsert = <<<Q_TIMEPREDICTIONSINSERT
UNION SELECT
  T.trip_id,
  T.direction_id,
  ST.stop_sequence,
  ST.arrival_time,
  S.stop_code,
  S.stop_name,
  timediff( ST.arrival_time, '{$NowDateTimeValue}' ) AS MINSTOARRIVAL
FROM trips T
  INNER JOIN stop_times ST
    ON T.trip_id = ST.trip_id
  INNER JOIN stops S
    ON ST.stop_id = S.stop_id
WHERE
  T.trip_id = {$RealTimeResult[$arraykey] -> TRIPID}
  AND timediff( ST.arrival_time, '{$NowDateTimeValue}' ) >= 0

Q_TIMEPREDICTIONSINSERT;
// --------------------------------------------------------------------------------

		if ( $row["direction_id"] != "" && trim($row["stop_code"] ) != "" ) {
			$qTimePredictions .= $qTimePredictionsInsert;
		}

	} catch ( Exception $e ) {
		// Just move forward gracefully without crashing the program.
	}

endforeach;

$date = new DateTime();
$weekday = strtolower( $date -> format( "l" ) );
$datecode = $date -> format( "Ymd" );

// HEREDOC ------------------------------------------------------------------------
	$qTimePredictionsInsert = <<<Q_TIMEPREDICTIONSINSERT
ORDER BY
  trip_id,
  stop_sequence
  
Q_TIMEPREDICTIONSINSERT;
// --------------------------------------------------------------------------------
if ( $qTimePredictions != "" ) {
	$qTimePredictions = preg_replace( "/^UNION /", "", $qTimePredictions );
	$qTimePredictions .= $qTimePredictionsInsert;
}

if ( $DiagnosticMode == true ) :
?>
<h1>JSON from MARTA</h1>
<?=$RealTimeJSON?>
<h1><code>$qTimePredictions</code> Query (Dynamically-Built Query for Prediction of Arrival Times on Active Runs)</h1>
<pre>
<?=$qTimePredictions?>
</pre>
<h1><code>$RealTimeResult</code> (Built from JSON from MARTA, with Additional Fields for Active Runs)</h1>
<pre>
<?
print_r( $RealTimeResult );
?>
</pre>
<h1>Output JSON</h1>
<pre>
<?php
endif;
?>
{
	"Vehicles" :
		{
<?php
$NumberOfVehicles = count( $RealTimeResult );
$ThisVehicle = 0;
foreach( $RealTimeResult as $key => $value ):
	$ThisVehicle++;
	$Comma = ( $ThisVehicle == $NumberOfVehicles ) ? "" : ",";
?>
			"<?=$value -> VEHICLE?>" :
				{
					"ADHERENCE" : "<?=$value -> ADHERENCE?>",
					"DIRECTION" : "<?=$value -> DIRECTION?>",
					"LATITUDE" : "<?=$value -> LATITUDE?>",
					"LONGITUDE" : "<?=$value -> LONGITUDE?>",
					"MSGTIME" : "<?=$value -> MSGTIME?>",
					"MESSAGE_AGE" : "<?=$value -> MESSAGE_AGE?>",
					"PREDICTION_LATITUDE" : "<?=$value -> PREDICTION_LATITUDE?>",
					"PREDICTION_LONGITUDE" : "<?=$value -> PREDICTION_LONGITUDE?>",
					"HEADSIGN" : "<?=$value -> HEADSIGN?>"
				}<?=$Comma?> 
<?php
endforeach;
?>
		},
	"Predictions" :
		{
<?php
if ( $qTimePredictions != "" ):
	$TimePredictions = $mysqli -> query( $qTimePredictions );
	$NumberOfRows = $TimePredictions -> num_rows;
	$ThisRow = 0;
	while ( $row = $TimePredictions -> fetch_assoc() ) :
		$ThisRow++;
		$ThisStopTrip = $row["stop_code"] . "-" . $row["trip_id"];
		$ThisMinsToArrival = preg_replace( "/(\d+:\d+):\d+/", "$1", $row["MINSTOARRIVAL"] );
		$Comma = ( $ThisRow == $NumberOfRows ) ? "" : ",";
?>
			"<?=$ThisStopTrip?>" : "<?=$ThisMinsToArrival?>"<?=$Comma?> 
<?php
	endwhile;
endif;
?>
		}
}
<?php
if ( $DiagnosticMode == true ) :
?>
<pre>
<?php
endif;
?>
