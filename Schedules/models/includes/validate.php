<?php
// Constants
$haversineratio = 0.83;
// $TimeZoneOffset = New DateInterval( "PT2H" );      // 2-hour offset from Mountain Time (location of server) to Easter Time (Atlanta)
$TimeZoneOffset = "2 hours";        // 2-hour offset from Mountain Time (location of server) to Easter Time (Atlanta)
/*
	Atlanta is at approximately the following coordinates: 33.7°N, 84.2°W (= -84.2°).
	"Haversine ratio" is not (to my knowledge) a real scientific term. I am using it to describe the (approximate) ratio between:
	(1) The 0.2° longitudinal distance across Atlanta between 33.6°N and 33.8°N along the 84.2°W longitude line that bisects Atlanta (= 22.24 km);
	(2) The 0.2° latitudinal distance across Atlanta between 84.3°W and 84.1°W along the 33.7°N latitude line that bisects Atlanta (= 18.5 km).
	Thus, I am using a ratio of 0.83 (18.5 / 22.24 = 0.83) to compress horizontal distances, to make the maps seem less distorted.
	A perfect implementation would use the haversine formula (see http://en.wikipedia.org/wiki/Haversine_formula) to calculate the
	distance perfectly at every degree of latitude -- but the variation was so trivial across the footprint of the MARTA system
	that I judged this not to be worth the processing time.
*/


function _validate( $key ) {
	global $mysqli;
	switch ( $key ) {
		case "route":
// HEREDOC ------------------------------------------------------------------------
			$query = <<<QUERY

SELECT *
FROM routes

QUERY;
// --------------------------------------------------------------------------------
			$routelist = $mysqli -> query( $query );
			$route_selected = false;
			while ( $row = $routelist -> fetch_assoc() ) {
				if ( $row["route_short_name"] == strtoupper( $_GET["route"] ) ) {
					$route_selected = $row["route_short_name"];
				}
			}
			if ( $route_selected == false ) {
				exit( "Not a valid route." );
			} else {
				return $route_selected;
			}
			break;
		case "stopid":
			if ( isset(  $_GET["stopid"] ) && is_numeric( $_GET["stopid"] ) ) {
				return $_GET["stopid"];
			} else {
				exit( "Not a valid stop." );
			}
			break;
		case "size":
			if ( isset(  $_GET["size"] ) && preg_match( "/^\d+$/", $_GET["size"] ) == 1 ) {
				return $_GET["size"];
			} else {
				return 300;
			}
			break;
		case "scope":
			if ( isset( $_GET["scope"] ) && preg_match( "/^(all|rail|FP|route)$/i", $_GET["scope"] ) == 1 ) {
				return strtoupper( $_GET["scope"] );
			} else {
				return "ROUTE";
			}
			break;
		case "showstops":
			if ( isset( $_GET["showstops"] ) ) {
				return true;
			} else {
				return false;
			}
			break;
		case "highway":
			if ( isset( $_GET["highway"] ) ) {
				return true;
			} else {
				return false;
			}
			break;
		case "norail":
			if ( isset( $_GET["norail"] ) ) {
				return true;
			} else {
				return false;
			}
			break;
		case "favoriteaction":
			if ( isset( $_GET["favoriteaction"] ) && preg_match( "/^(add|remove)$/i", $_GET["favoriteaction"] ) == 1 ) {
				return strtoupper( $_GET["favoriteaction"] );
			} else {
				return "";
			}
			break;
	}
}

function _getServiceDate() {

	global $TimeZoneOffset;
    
    $now = new DateTime();
    $now -> modify( $TimeZoneOffset );
	
	$serviceDateArray = array();

	$serviceDateArray["G"] = $now -> format( "G" );		// Hour, without leading zeroes (0-23)
	$serviceDateArray["i"] = $now -> format( "i" );		// Minute, with leading zeroes (00-59)
	$serviceDateArray["s"] = $now -> format( "s" );		// Seconds, with leading zeroes (00-59)
	
	// Assumption is that 3:00 AM is the break-point between late runs belonging to the previous day's schedule and
	// new runs that belong to the current day's schedule.
	if ( $serviceDateArray["G"] < 3 ) {
		$now -> sub( new DateInterval( "P1D" ) );
		$serviceDateArray["G"] = $serviceDateArray["G"] + 24;
	}
	
	$serviceDateArray["Y"] = $now -> format( "Y" );		// Year, 4 digits
	$serviceDateArray["n"] = $now -> format( "n" );		// Month, without leading zeroes (1-12)
	$serviceDateArray["m"] = $now -> format( "m" );		// Month, with leading zeroes (01-12)
	$serviceDateArray["j"] = $now -> format( "j" );		// Day, without leading zeroes (1-31)
	$serviceDateArray["d"] = $now -> format( "d" );		// Day, with leading zeroes (01-31)
	$serviceDateArray["l"] = $now -> format( "l" );		// Weekday, spelled out
	
	return $serviceDateArray;
}

function _getServiceID() {
    /*
        This gets the ServiceID by querying the database based on today's date.
        The standard MARTA uses (which is hard-coded elsewhere by necessity) is:
            5 = Weekday
            3 = Saturday
            4 = Sunday
    */
	global $mysqli;
	$today = _getServiceDate();
	$todayWeekday = strtolower( $today["l"] );
	$todayYYYYMMDD = $today["Y"] . $today["m"] . $today["d"];
// HEREDOC ------------------------------------------------------------------------
	$query_calendar_dates = <<<QUERY_CALENDAR_DATES

SELECT *
FROM calendar_dates
WHERE
  date = '{$todayYYYYMMDD}'
  AND exception_type = 1

QUERY_CALENDAR_DATES;
// --------------------------------------------------------------------------------
// HEREDOC ------------------------------------------------------------------------
	$query_calendar = <<<QUERY_CALENDAR

SELECT *
FROM calendar
WHERE {$todayWeekday} = 1

QUERY_CALENDAR;
// --------------------------------------------------------------------------------
	$calendar_dates = $mysqli -> prepare( $query_calendar_dates );
	$calendar_dates -> execute();
	$calendar_dates -> store_result();
	if ( $calendar_dates -> num_rows == 0 ) {
		$queryForServiceID = $query_calendar;
	} else {
		$queryForServiceID = $query_calendar_dates;
	}
	$calendar = $mysqli -> query( $queryForServiceID );
	$row = $calendar -> fetch_assoc();	// One-row query, so I don't need a while(){} construct.
	return $row["service_id"];
}

function _capitalize_street_name( $street_name ) {
	
	$result = $street_name;
	
	// Get rid of multiple spaces.
	$result = preg_replace( "/\s+/", " ", $result );
	
	// Make it so that punctuation does not mess up capitalization by putting temporary spaces after punctuation marks.
	$result = preg_replace( "/([\/\-])/", "$1 ", $result );
	
	// Capitalize initial letter of each word.
	$result = strtolower( $result );
	$result = ucwords( $result );
	
	// Remove temporary spaces after punctuation.
	$result = preg_replace( "/([\/\-]) /", "$1", $result );
	
	// Specific known corrections:
	$result = preg_replace( "/\s+de\s*leon(\s+|$)/i", " de Leon$1", $result );
	
	return $result;
}

function _convert_time_from_Gis( $time_string ) {
	// "Gis" refers to the PHP date/time specifications: http://php.net/manual/en/function.date.php
	$hour = intval( preg_replace( "/(\d+):(\d+):(\d+)/", "$1", $time_string ) );
	$minute = preg_replace( "/(\d+):(\d+):(\d+)/", "$2", $time_string );
	
	$meridian = "AM";
	
	switch ( floor( $hour / 12 ) ) {
		case 0:
			break;
		case 1:
			$hour = $hour - 12;
			$meridian = "PM";
			break;
		case 2:
			$hour = $hour - 24;
	}
	
	if ( $hour == 0 ) {
		$hour = 12;
	}
	
	$result = $hour . ":" . $minute . " " . $meridian;
	switch ( $result ) {
		case "12:00 PM":
			$result = "12:00 N";
			break;
		case "12:00 AM":
			$result = "12:00 M";
			break;
	}
	
	return $result;
}

function _MARTA_time() {

	$now = _getServiceDate();
    
    $Result = $now["G"] . ":" . $now["i"] . ":" . $now["s"];
	$Result = ( ( strlen( $Result ) == 7 ) ? "0" : "" ) . $Result ;

	return $Result;

}

function _trim_headsign( $orig_headsign ) {
    $trimmed = $orig_headsign;
    $trimmed = preg_replace( "/ +/", " ", $trimmed );
    $trimmed = preg_replace( "/^Route /", "", $trimmed );
    $trimmed = preg_replace( "/(\d+[A-Za-z]?) \- (.+)/", "$1 $2", $trimmed );
    
    return $trimmed;
}

function _parse_timestamp( $orig_timestamp, $content = "all12" ) {
    $timestamp_array = explode( ":", $orig_timestamp );
    $hour_num = intval( $timestamp_array[0] );
    $hour24_num = $hour_num;
    $minute_num = $timestamp_array[1];
    if ( $hour_num < 12 ) {
        $hour12_num = $hour_num;
        $meridian = "AM";
    } elseif ( $hour_num == 12 ) {
        $hour12_num = 12;
        if ( $minute_num == "00" ) {
            $meridian = "N";
        } else {    
            $meridian = "PM";
        }
    } elseif ( $hour_num < 24 ) {
        $hour12_num = $hour_num - 12;
        $meridian = "PM";
    } elseif ( $hour_num == 24 ) {
        $hour12_num = 12;
        $hour24_num = 0;
        if ( $minute_num == "00" ) {
            $meridian = "M";
        } else {    
            $meridian = "AM";
        }
    } else {
        $hour12_num = $hour_num - 24;
        $hour24_num = $hour_num - 24;
        $meridian = "AM";
    }
    
    switch( $content ) {
        case "time12":
            return $hour12_num. ":" . $minute_num;
            break;
        case "time24":
            return $hour24_num. ":" . $minute_num;
            break;
        case "meridian":
            return $meridian;
            break;
    }
    return $hour12_num. ":" . $minute_num . " " . $meridian;
}
?>