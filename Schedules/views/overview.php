<?php
// Load model components.
_load_model( 'routes');

$RouteList = get_routes();
?>
<h1>MARTA Routes</h1>

<p>Adherence Data</p>
<table class="RouteList">
	<tr>
		<th class="AdherenceUnknown">U</th>
		<td>No Information.</td>
	</tr>
	<tr>
		<th class="AdherenceOnTime">Y</th>
		<td>All buses are within 5 minutes of schedule.</td>
	</tr>
	<tr>
		<th class="AdherenceLate">N</th>
		<td>One or more buses is running 5+ minutes late.</td>
	</tr>
	<tr>
		<th class="NoRun">X</th>
		<td>No scheduled runs today.</td>
	</tr>
</table>
<p id="AJAXWaiting" class="alert" >Waiting for schedule adherence information on buses</p>
<hr />
	
<table class="RouteList">
<?php
while ( $row = $RouteList->fetch_assoc() ):
	if ( $row["RunsToday"] == 0 ) {
		$AdherenceClass = "NoRun";
		$AdherenceText = "X";
	} else {
		$AdherenceClass = "AdherenceUnknown";
		$AdherenceText = "U";
	}
?>
	<tr>
		<th id="Adherence<?=$row["route_short_name"]?>" class="<?=$AdherenceClass?>"><?=$AdherenceText?></th>
		<th><?=$row["route_short_name"]?></th>
		<td>
			<strong><?=$row["route_long_name"]?></strong><br />
			<a href="?action=currentinfo&route=<?=$row["route_short_name"]?>">Current Info.</a>
		</td>
	</tr>
<?php
endwhile;
?>
</table>

<script>
	$.ajax( {
		dataType: "json",
		url: "models/ajax/realtime-all.php",
		success: function( data ) {
			showData = JSON.stringify( data );	// Use only for diagnostics.
			for ( var i = 0; i < data.length; i++ ) {
				if ( data[i]["ADHERENCE"] >= -5 ) {
					$( "#Adherence" + data[i]["ROUTE"] + ".AdherenceUnknown" ).addClass( "AdherenceOnTime" ).removeClass( "AdherenceUnknown" );
				} else {
					$( "#Adherence" + data[i]["ROUTE"] ).addClass( "AdherenceLate" ).removeClass( "AdherenceUnknown" );
				}
			}
			$( ".AdherenceUnknown" ).html( "U" );
			$( ".AdherenceOnTime" ).html( "Y" );
			$( ".AdherenceLate" ).html( "N" );
			$( ".NoRun" ).html( "X" );
			$( "#AJAXWaiting" ).hide();
		}
	} );
</script>