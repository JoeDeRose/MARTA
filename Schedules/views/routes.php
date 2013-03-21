<?php
// Load model components.
_load_model( 'routes');

$RouteList = get_routes();
?>
<script>
	function ToggleButtonMenu( Route ) {
		if ( $( "#button" + Route ).attr( "class" ).indexOf( "buttonEffectRoundedAll" ) != -1 ) {
			ExpandButtonMenu( Route );
		} else {
			MinimizeButtonMenu( Route );
		}
	}

	function ExpandButtonMenu( Route ) {
		$( "#button" + Route ).addClass( "buttonEffectRoundedTLBL" );
		$( "#button" + Route ).removeClass( "buttonEffectRoundedAll" );
		$( "#button" + Route + " .buttonMenu" ).css( "left", ( $( "#button" + Route ).outerWidth() - 2 ) + "px" );
		$( "#button" + Route + " .buttonMenu" ).show();
	}
	
	function MinimizeButtonMenu( Route ) {
		$( "#button" + Route ).addClass( "buttonEffectRoundedAll" );
		$( "#button" + Route ).removeClass( "buttonEffectRoundedTLBL" );
		$( "#button" + Route + " .buttonMenu" ).hide();
	}
	
</script>

<?php
$FavoritesCookie = GetFavorites();
$FavoriteRoutes = "";
$AllRoutes = "";

while ( $row = $RouteList->fetch_assoc() ):

	$RouteRow = <<<ROUTE_ROW
	<tr>
		<th onmouseover="ExpandButtonMenu( '[RouteShortName][FavoriteFlag]' );" onmouseout="MinimizeButtonMenu( '[RouteShortName][FavoriteFlag]' );" >
			<div id="button[RouteShortName][FavoriteFlag]" class="buttonEffect buttonEffectPadding buttonEffectRoundedAll" >
				<div class="buttonMenu buttonFlyout buttonEffectRoundedTRBLBR noWrap" style="display: none;">
					<div class="buttonMenuItem" onclick="MinimizeButtonMenu( '[RouteShortName][FavoriteFlag]' ); ButtonClick( '?action=currentinfo&route=[RouteShortName]' );" >
						<a href="#" onclick="return false;">Current Information</a>
					</div>
					<div class="buttonMenuItem" onclick="MinimizeButtonMenu( '[RouteShortName][FavoriteFlag]' ); ButtonClick( '?action=favorites&favoriteaction=[FavoriteAction]&route=[RouteShortName]' );" >
						<a href="#" onclick="return false;">[FavoriteText] Favorites</a>
					</div>
					<div class="buttonMenuItem" onclick="MinimizeButtonMenu( '[RouteShortName][FavoriteFlag]' ); ButtonClick( '?action=map&route=[RouteShortName]' );" >
						<a href="#" onclick="return false;">Thumbnail Map</a>
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
			<h1>Favorite Routes</h1>
		</td>
	</tr>
<?=$FavoriteRoutes?>
	<tr>
		<td colspan="2">
			<h1>All Routes</h1>
		</td>
	</tr>
<?php
endif;
?>
<?=$AllRoutes?>
</table>

