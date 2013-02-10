<?php
global $header_find, $header_replace;
$header_find["title"] = "/<title>.*?<\/title>/";
if ( is_numeric( $data["route"] ) ) {
	$route_title = "MARTA Route " . $data["route"];
} else {
	$route_title = "MARTA " . $data["route"] . " Line";
}
$header_replace["title"] = "<title>" . $route_title . "</title>";

require( 'includes/busmap.php' );

$route = $data["route"];
$display = show_map( $data );

$nearby_schedule = get_nearby_schedule( $route );
?>
<h1><?=$route_title?></h1>
<?=$display["svg"]?>

<!-- BEGIN DIAGNOSTICS -->
<script>
$.ajax( {
	dataType: "json",
	url: "models/ajax/realtime.php?route=<?=$route?>",
	success: function(data) {
		var realtimeoutput = "";
		var objDirections = {
			"Eastbound" : {},
			"Westbound" : {},
			"Northbound" : {},
			"Southbound" : {}
		};
		for ( var i = 0; i < data.length; i++ ) {
			realtimeoutput += "<p>";
			var tripinfo = data[i];
			for ( var key in tripinfo ) {
				if ( tripinfo.hasOwnProperty(key) ) {
					realtimeoutput += key + ": " + tripinfo[key] + "<br />";
				}
// This is overwriting existing values. Consider an array.
			objDirections[tripinfo["DIRECTION"]]["Adherence"] = tripinfo["ADHERENCE"];
			objDirections[tripinfo["DIRECTION"]]["Latitude"] = tripinfo["LATITUDE"];
			objDirections[tripinfo["DIRECTION"]]["Longitude"] = tripinfo["LONGITUDE"];
			objDirections[tripinfo["DIRECTION"]]["MessageDateTime"] = tripinfo["MSGTIME"];
			objDirections[tripinfo["DIRECTION"]]["NextTimePoint"] = tripinfo["STOPID"];
			objDirections[tripinfo["DIRECTION"]]["Vehicle"] = tripinfo["VEHICLE"];
			}
			realtimeoutput += "Location: " + tripinfo["LATITUDE"] + " " + tripinfo["LONGITUDE"] + "<br />";
			var ScheduleDateTimeValues = {
				"month": parseInt( tripinfo["MSGTIME"].replace( /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) ([AP]M)/, "$1" ) ),
				"date": parseInt( tripinfo["MSGTIME"].replace( /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) ([AP]M)/, "$2" ) ),
				"year": parseInt( tripinfo["MSGTIME"].replace( /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) ([AP]M)/, "$3" ) ),
				"hour": parseInt( tripinfo["MSGTIME"].replace( /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) ([AP]M)/, "$4" ) ),
				"minute": parseInt( tripinfo["MSGTIME"].replace( /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) ([AP]M)/, "$5" ) ),
				"second": parseInt( tripinfo["MSGTIME"].replace( /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) ([AP]M)/, "$6" ) ),
				"meridian": parseInt( tripinfo["MSGTIME"].replace( /(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) ([AP]M)/, "$7" ) )
			};
			if ( ScheduleDateTimeValues["meridian"] == "PM" && ScheduleDateTimeValues["hour"] != 12 ) {
				ScheduleDateTimeValues["hour"] = ScheduleDateTimeValues["hour"] + 12;
			}
			ScheduleDateTimeValues["month"] = ScheduleDateTimeValues["month"] - 1;
			ScheduleDateTimeValues["minute"] = ScheduleDateTimeValues["minute"] + parseInt( tripinfo["ADHERENCE"] );
			ScheduleDateTime = new Date( ScheduleDateTimeValues["year"], ScheduleDateTimeValues["month"], ScheduleDateTimeValues["date"], ScheduleDateTimeValues["hour"], ScheduleDateTimeValues["minute"], ScheduleDateTimeValues["second"], 0 );
			ScheduleDateTimeText = ScheduleDateTime.getFullYear() + "/" + ( ScheduleDateTime.getMonth() + 1 ) + "/" + ScheduleDateTime.getDate() + " " + ScheduleDateTime.getHours() + ":" + ScheduleDateTime.getMinutes() + ":" + ScheduleDateTime.getSeconds();
			realtimeoutput += "Scheduled Time: " + ScheduleDateTimeText + "<br />";
			realtimeoutput += "</p>";
		}
		for ( var key in objDirections ) {
			if ( objDirections.hasOwnProperty(key) ) {
				realtimeoutput += "<p>";
				for ( var key1 in objDirections[key] ) {
					if ( objDirections[key].hasOwnProperty(key1) ) {
						realtimeoutput += objDirections[key][key1] + "|";
					}
				}
				realtimeoutput += "</p>";
			}
		}
		$( "#realtimeoutput" ).html( realtimeoutput );
	}
} );
</script>
<div id="realtimeoutput"></div>
<p>Service ID: <?=_getServiceID()?></p>
<!-- END DIAGNOSTICS -->

<?php
foreach( $nearby_schedule["nearbyarray"] as $direction_key => $direction_value ):
?>
<h2><?=$direction_value["Direction"]?></h2>
<?php
	foreach( $nearby_schedule["nearbyarray"][$direction_key]["Shapes"] as $shape_key => $shape_value ):
		$headsign = $shape_value["Headsign"];
		$headsign = preg_replace( "/\)\(/", "<br />", $headsign );
		$headsign = preg_replace( "/^\(|\)$/", "", $headsign );
?>
<h3><?=$headsign?></h3>
<table>
	<thead>
		<tr>
			<th class="noBorder noShade noBold alignRight">Vehicle ID</th>
<?php
		$this_offset = -1;
		foreach( $nearby_schedule["nearbyarray"][$direction_key]["Shapes"][$shape_key]["Trips"] as $trip_key => $trip_value ):
			$this_offset = -$this_offset;
			$this_offset_class = "";
			if ( $this_offset == 1 ) {
				$this_offset_class = "offset";
			}
?>
			<th id="Vehicle_<?=$trip_value?>" class="<?=$this_offset_class?>" colspan="2">&nbsp;</th>
<?php
		endforeach;
?>
		</tr>
		<tr>
			<th class="noBorder noShade noBold alignRight">Most Recent Vehicle Update</th>
<?php
		$this_offset = -1;
		foreach( $nearby_schedule["nearbyarray"][$direction_key]["Shapes"][$shape_key]["Trips"] as $trip_key => $trip_value ):
			$this_offset = -$this_offset;
			$this_offset_class = "";
			if ( $this_offset == 1 ) {
				$this_offset_class = "offset";
			}
?>
			<th id="Update_<?=$trip_value?>" class="<?=$this_offset_class?>" colspan="2">&nbsp;</th>
<?php
		endforeach;
?>
		</tr>
		<tr>
			<th class="noBorder noShade noBold alignRight">Minutes Late/Early</th>
<?php
		$this_offset = -1;
		foreach( $nearby_schedule["nearbyarray"][$direction_key]["Shapes"][$shape_key]["Trips"] as $trip_key => $trip_value ):
			$this_offset = -$this_offset;
			$this_offset_class = "";
			if ( $this_offset == 1 ) {
				$this_offset_class = "offset";
			}
?>
			<th id="Adherence_<?=$trip_value?>" class="<?=$this_offset_class?>" colspan="2">&nbsp;</th>
<?php
		endforeach;
?>
		</tr>
		<tr>
			<th>Stop</th>
<?php
		$this_offset = -1;
		foreach( $nearby_schedule["nearbyarray"][$direction_key]["Shapes"][$shape_key]["Trips"] as $trip_key => $trip_value ):
			$this_offset = -$this_offset;
			$this_offset_class = "";
			if ( $this_offset == 1 ) {
				$this_offset_class = "offset";
			}
?>
			<th class="<?=$this_offset_class?>">Sched.</th>
			<th class="<?=$this_offset_class?>">Actual</th>
<?php
		endforeach;
?>
		</tr>
	</thead>
	<tbody>
<?php
		$prev_modified_name_1 = "";
		foreach( $nearby_schedule["nearbyarray"][$direction_key]["Shapes"][$shape_key]["Stops"] as $stop_key => $stop_value ):
			$modified_name = $stop_value["Name"];
			$modified_name = preg_replace( "/\s+[NS][EW]?\s*@/", "@", $modified_name );
			$modified_name = preg_replace( "/\s+[NS][EW]?\s*$/", "", $modified_name );
			$modified_name = preg_replace( "/\s*@\s*/", "@", $modified_name );
			if ( strpos( $modified_name, "@" ) === false ) {
				$modified_name_1 = $modified_name;
				$modified_name_2 = "";
			} else {
				$modified_name_1 = preg_replace( "/@.*$/", "", $modified_name );
				$modified_name_2 = preg_replace( "/^.*@/", "", $modified_name );
			}
			$modified_name_1 = _capitalize_street_name( $modified_name_1 );
			if ( $modified_name_2 != "" ) {
				$modified_name_2 = "@" . _capitalize_street_name( $modified_name_2 );
			}
			$modified_class_1 = "";
			if ( $modified_name_1 == $prev_modified_name_1 ) {
				$modified_class_1 = "duplicateName";
			}
			$prev_modified_name_1 = $modified_name_1;
?>
		<tr>
			<td class="alignLeft"><strong><span class="<?=$modified_class_1?>"><?=$modified_name_1?></span></strong><?=$modified_name_2?></td>
<?php
			$this_offset = -1;
			foreach( $nearby_schedule["nearbyarray"][$direction_key]["Shapes"][$shape_key]["Trips"] as $trip_key => $trip_value ):
				$this_offset = -$this_offset;
				$this_offset_class = "";
				if ( $this_offset == 1 ) {
					$this_offset_class = "offset";
				}
				$this_stop_trip = $stop_value["Code"] . "-" . $trip_value;
				if ( isset( $nearby_schedule["stoparray"][$this_stop_trip] ) ) {
					$this_arrival_time = $nearby_schedule["stoparray"][$this_stop_trip];
					$this_arrival_time = _convert_time_from_Gis( $this_arrival_time );
				} else {
					$this_arrival_time = "&nbsp;";
				}
?>
			<td class="<?=$this_offset_class?>"><?=$this_arrival_time?></td>
			<td id="RT-<?=$this_stop_trip?>" class="RT <?=$this_offset_class?>">&nbsp;</td>
<?php
			endforeach;
?>
		</tr>
<?php
		endforeach;
?>
	</tbody>
</table>
<?php
	endforeach;
?>
<?php
endforeach;
?>

<pre>
<?php
print_r ( $nearby_schedule );
?>
</pre>