<?php
// Load model components.
_load_model( 'routes');

$RouteList = get_routes();
?>
<script>
	function ToggleButtonMenu( Route ) {
		if ( $( "#button" + Route ).attr( "class" ).indexOf( "buttonEffectMinimized" ) != -1 ) {
			ExpandButtonMenu( Route );
		} else {
			MinimizeButtonMenu( Route );
		}
	}

	function ExpandButtonMenu( Route ) {
		$( "#button" + Route ).addClass( "buttonEffectExpanded" );
		$( "#button" + Route ).removeClass( "buttonEffectMinimized" );
		$( "#button" + Route + " .buttonMenu" ).css( "left", ( $( "#button" + Route ).outerWidth() - 2 ) + "px" );
		$( "#button" + Route + " .buttonMenu" ).show();
	}
	
	function MinimizeButtonMenu( Route ) {
		$( "#button" + Route ).addClass( "buttonEffectMinimized" );
		$( "#button" + Route ).removeClass( "buttonEffectExpanded" );
		$( "#button" + Route + " .buttonMenu" ).hide();
	}
	
	function openCurrentInfo( Route ) {
		window.location.href = "?action=currentinfo&route=" + Route;
	}
	
	function openFavorites( FavoriteAction, Route ) {
		window.location.href = "?action=favorites&favoriteaction=" + FavoriteAction + "&route=" + Route;
	}
	
	function openMap( Route ) {
		window.location.href = "?action=map&route=" + Route;
	}
	
</script>

<h1>MARTA Routes</h1>

<?php
$FavoritesCookie = GetFavorites();
$FavoriteRoutes = "";
$AllRoutes = "";

while ( $row = $RouteList->fetch_assoc() ):

	$RouteRow = <<<ROUTE_ROW
	<tr>
		<th onmouseover="ExpandButtonMenu( '[RouteShortName][FavoriteFlag]' );" onmouseout="MinimizeButtonMenu( '[RouteShortName][FavoriteFlag]' );" >
			<div id="button[RouteShortName][FavoriteFlag]" class="buttonEffect buttonEffectMinimized" >
				<div class="buttonMenu noWrap" style="display: none;">
					<div class="buttonMenuItem" onclick="openCurrentInfo( '[RouteShortName]' );" >
						<a href="#" onclick="return false;">Current Information</a>
					</div>
					<div class="buttonMenuItem" onclick="openFavorites( '[FavoriteAction]', '[RouteShortName]' );" >
						<a href="#" onclick="return false;">[FavoriteText] Favorites</a>
					</div>
					<div class="buttonMenuItem" onclick="openMap( '[RouteShortName]' );" >
						<a href="#" onclick="return false;">Map</a>
					</div>
				</div>
				<div class="buttonItem" >
					<a href="#" onclick="return false;">[RouteShortName]</a>
				</div>
			</div>
		</th>
		<td>
			<strong>[RouteLongName]</strong><br />
		</td>
	</tr>
ROUTE_ROW;

	$RouteRow = str_replace( "[RouteShortName]", $row["route_short_name"], $RouteRow );
	$RouteRow = str_replace( "[RouteLongName]", $row["route_long_name"], $RouteRow );
	if ( strpos( $FavoritesCookie, "(" . $row["route_short_name"] . ")" ) === false ) {
		$RouteRow = str_replace( "[FavoriteAction]", "add", $RouteRow );
		$RouteRow = str_replace( "[FavoriteText]", "Add to", $RouteRow );
	} else {
		$RouteRow = str_replace( "[FavoriteAction]", "remove", $RouteRow );
		$RouteRow = str_replace( "[FavoriteText]", "Remove from", $RouteRow );
		$FavoriteRow = $RouteRow;
		$FavoriteRow = str_replace( "[FavoriteFlag]", "F", $FavoriteRow );
		$FavoriteRoutes .= $FavoriteRow;
	}
	$RouteRow = str_replace( "[FavoriteFlag]", "", $RouteRow );
	$AllRoutes .= $RouteRow;

endwhile;
?>
<table class="RouteList">
<?php
if ( $FavoriteRoutes != "" ) :
?>
	<tr>
		<td colspan="2">
			<h2>Favorite Routes</h2>
		</td>
	</tr>
<?=$FavoriteRoutes?>
	<tr>
		<td colspan="2">
			<h2>All Routes</h2>
		</td>
	</tr>
<?php
endif;
?>
<?=$AllRoutes?>
</table>

