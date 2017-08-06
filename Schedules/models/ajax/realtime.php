<?php
if ( isset( $_GET["diagnostics"] ) ) {
    $DiagnosticMode = true;
} else {
    $DiagnosticMode = false;
}

if ( $DiagnosticMode == false ) {
    header('Content-type: application/json');
}

require_once('../includes/main.php');
require_once('../includes/validate.php');

$RouteSelected = _validate( "route" );
$ServiceID = _getServiceID();
$qTimePredictions = "";
$VehiclesWithMissingTripID = 0;

$RealTimeJSON = file_get_contents( "http://developer.itsmarta.com/BRDRestService/BRDRestService.svc/GetBusByRoute/" . $RouteSelected );
$RealTimeResult = json_decode( $RealTimeJSON );

foreach( $RealTimeResult as $arraykey => $arrayvalue ):

    if ( $arrayvalue -> TRIPID != "" && $arrayvalue -> TRIPID != "0" ) {

        $arrayvalue -> COORDINDATES = $arrayvalue -> LATITUDE . ',' . $arrayvalue -> LONGITUDE;
        $ThisTripID = $arrayvalue -> TRIPID;

// HEREDOC ------------------------------------------------------------------------
    $qClosestStop = <<<Q_CLOSEST_STOP

SELECT Q1.*
FROM
  (
    SELECT DISTINCT
      IFNULL( T.trip_headsign, CONCAT( 'Route ', R.route_short_name, ' ', R.route_long_name ) ) AS trip_headsign,
      T.direction_id,
      T.shape_id,
      ST.stop_sequence,
      ST.arrival_time,
      S.stop_code,
      S.stop_name,
      S.stop_lat,
      S.stop_lon,
      ABS( S.stop_lat - {$arrayvalue -> LATITUDE} ) + ABS ( S.stop_lon - {$arrayvalue -> LONGITUDE} ) AS dist
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
        $row = $ClosestStop -> fetch_assoc();    // One-row query, so I don't need a while(){} construct.
        $arrayvalue -> HEADSIGN = $row["trip_headsign"];
        $arrayvalue -> NEAREST_STOP_CODE = $row["stop_code"];
        $arrayvalue -> NEAREST_STOP_NAME = $row["stop_name"];
        $arrayvalue -> NEAREST_STOP_SEQUENCE = $row["stop_sequence"];
        $arrayvalue -> NEAREST_STOP_LATITUDE = $row["stop_lat"];
        $arrayvalue -> NEAREST_STOP_LONGITITUDE = $row["stop_lon"];
        $arrayvalue -> NEAREST_STOP_DIRECTIONID = $row["direction_id"];
    
        $AdherenceValue = intval( $arrayvalue -> ADHERENCE );
        $MessageTime = DateTime::createFromFormat( 'n/j/Y g:i:s a', $arrayvalue -> MSGTIME );
        $arrayvalue -> NEAREST_STOP_SCHEDULED_TIME = $row["arrival_time"];
        $NowDateTime = new DateTime();
        $NowDateTimeValue = $NowDateTime -> format( "G:i:s" );
        $arrayvalue -> NOW = $NowDateTimeValue;

// HEREDOC ------------------------------------------------------------------------
    $qNextStop = <<<Q_NEXT_STOP

SELECT *
FROM
  (
    SELECT
      ST.stop_sequence,
      S.stop_code,
      S.stop_name,
      S.stop_lat,
      S.stop_lon
    FROM trips T
      INNER JOIN stop_times ST
        ON T.trip_id = ST.trip_id
      INNER JOIN stops S
        ON ST.stop_id = S.stop_id
    WHERE
      T.trip_id = {$arrayvalue -> TRIPID}
      AND ST.stop_sequence >= {$arrayvalue -> NEAREST_STOP_SEQUENCE}
    ORDER BY ST.stop_sequence
    LIMIT 2
  ) Q1
ORDER BY stop_sequence DESC
LIMIT 1;

Q_NEXT_STOP;
// --------------------------------------------------------------------------------
        $NextStop = $mysqli -> query( $qNextStop );
        if ( $NextStop ) {
            $row2 = $NextStop -> fetch_assoc();    // One-row query, so I don't need a while(){} construct.
            $arrayvalue -> NEXT_STOP_SEQUENCE = $row2["stop_sequence"];
            $arrayvalue -> NEXT_STOP_CODE = $row2["stop_code"];
            $arrayvalue -> NEXT_STOP_NAME = $row2["stop_name"];
            $arrayvalue -> NEXT_STOP_LATITUDE = $row2["stop_lat"];
            $arrayvalue -> NEXT_STOP_LONGITUDE = $row2["stop_lon"];
            if ( $arrayvalue -> NEXT_STOP_SEQUENCE == $arrayvalue -> NEAREST_STOP_SEQUENCE ) {
                $arrayvalue -> BUS_BEARING_END_OF_LINE = "Y";
                $arrayvalue -> BUS_BEARING_ANGLE = 0;
            } else {
                $BearingLatitudeDifference = ( $arrayvalue -> NEAREST_STOP_LATITUDE - $row2["stop_lat"] ) * $haversineratio;
                $BearingAdjacentAngle = $row2["stop_lat"] - $arrayvalue -> NEAREST_STOP_LATITUDE;
                $BearingHypotenuse = sqrt( pow( $row2["stop_lat"] - $arrayvalue -> NEAREST_STOP_LATITUDE, 2 ) + pow( ( $row2["stop_lon"] - $arrayvalue -> NEAREST_STOP_LONGITITUDE ) * $haversineratio, 2 ) );
                $BearingSign = ( $row2["stop_lon"] - $arrayvalue -> NEAREST_STOP_LONGITITUDE < 0 ? -1 : 1 );
                $BearingAngle = rad2deg( acos( $BearingAdjacentAngle / $BearingHypotenuse ) ) * $BearingSign;
                $arrayvalue -> BUS_BEARING_END_OF_LINE = "N";
                $arrayvalue -> BUS_BEARING_ANGLE = $BearingAngle;
            }
        }

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
  T.trip_id = {$arrayvalue -> TRIPID}
  AND timediff( ST.arrival_time, '{$NowDateTimeValue}' ) >= 0

Q_TIMEPREDICTIONSINSERT;
// --------------------------------------------------------------------------------

        if ( $row["direction_id"] != "" && trim($row["stop_code"] ) != "" ) {
            $qTimePredictions .= $qTimePredictionsInsert;
        }

    } else {
        $VehiclesWithMissingTripID++;
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
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<h1>Source JSON</h1>
<p><a href="http://www.joederose.us/MARTA/Data/">MARTA Developer Resources</a></p>
<p><a href="http://developer.itsmarta.com/BRDRestService/BRDRestService.svc/GetBusByRoute/<?=$RouteSelected?>">Route <?=$RouteSelected?></a></p>
<p><a href="http://developer.itsmarta.com/BRDRestService/BRDRestService.svc/GetAllBus">All Routes</a></p>
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
$NumberOfVehicles = count( $RealTimeResult ) - $VehiclesWithMissingTripID;
$ThisVehicle = 0;
foreach( $RealTimeResult as $key => $value ):
    if ( $value -> TRIPID != "" && $value -> TRIPID != "0" ) :
        $ThisVehicle++;
        $Comma = ( $ThisVehicle == $NumberOfVehicles ) ? "" : ",";
        $ThisVehicleID = $value -> VEHICLE;
        if ( property_exists( $value, "BUS_BEARING_END_OF_LINE" ) )  {
            $ThisBusBearingEndOfLine = $value -> BUS_BEARING_END_OF_LINE;
        } else {
            $ThisBusBearingEndOfLine = "<span style=\"color: red; font-weight: bold;\" >TRIPID Not Found</span>";
        }
        if ( property_exists( $value, "BUS_BEARING_ANGLE" ) )  {
            $ThisBusBearingAngle = $value -> BUS_BEARING_ANGLE;
        } else {
            $ThisBusBearingAngle = "<span style=\"color: red; font-weight: bold;\" >TRIPID Not Found</span>";
        }
?>
            "<?=$ThisVehicleID?>" :
                {
                    "ADHERENCE" : "<?=$value -> ADHERENCE?>",
                    "DIRECTION" : "<?=$value -> DIRECTION?>",
                    "LATITUDE" : "<?=$value -> LATITUDE?>",
                    "LONGITUDE" : "<?=$value -> LONGITUDE?>",
                    "MSGTIME" : "<?=$value -> MSGTIME?>",
                    "HEADSIGN" : "<?=$value -> HEADSIGN?>",
                    "BUS_BEARING_END_OF_LINE" : "<?=$ThisBusBearingEndOfLine?>",
                    "BUS_BEARING_ANGLE" : "<?=$ThisBusBearingAngle?>"
                }<?=$Comma?> 
<?php
    endif;
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
</body>
</html>
<?php
endif;
?>
