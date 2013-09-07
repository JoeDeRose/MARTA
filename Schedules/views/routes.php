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
		$( "#" + Route ).addClass( "buttonEffectRoundedTLBL" );
		$( "#" + Route ).removeClass( "buttonEffectRoundedAll" );
		$( "#" + Route + " .buttonMenu" ).css( "left", ( $( "#" + Route ).outerWidth() - 2 ) + "px" );
		$( "#" + Route + " .buttonMenu" ).show();
	}
	
	function MinimizeButtonMenu( Route ) {
		$( "#" + Route ).addClass( "buttonEffectRoundedAll" );
		$( "#" + Route ).removeClass( "buttonEffectRoundedTLBL" );
		$( "#" + Route + " .buttonMenu" ).hide();
	}
	
	$( document ).on(
		"mouseover",
		".RouteNumExpandListener",
		function() {
			routeNumID = $( this ).children( ".RouteNumMainDiv" ).attr( "id" );
			ExpandButtonMenu( routeNumID );
		}
	);
	
	$( document ).on(
		"mouseout",
		".RouteNumExpandListener",
		function() {
			routeNumID = $( this ).children( ".RouteNumMainDiv" ).attr( "id" );
			MinimizeButtonMenu( routeNumID );
		}
	);
	
	$( document ).on(
		"click",
		"table.RouteList div.buttonMenuItemListener",
		function() {
			routeNumID = $( this ).parents( ".RouteNumMainDiv" ).attr( "id" );
			MinimizeButtonMenu( routeNumID );
		}
	);
	
</script>

<?php
$FavoritesCookie = GetFavorites();
$FavoriteRoutes = "";
$AllRoutes = "";

while ( $row = $RouteList->fetch_assoc() ):

	$RouteRow = <<<ROUTE_ROW
	<tr>
		<th class="RouteNumExpandListener" >
			<div id="button[RouteShortName][FavoriteFlag]" class="RouteNumMainDiv buttonEffect buttonEffectPadding buttonEffectRoundedAll" >
				<div class="buttonMenu buttonFlyout buttonEffectRoundedTRBLBR noWrap" style="display: none;">
					<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="?action=currentinfo&route=[RouteShortName]" >
						Current Information
					</div>
					<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="?action=currentinfo&fullscreen&route=[RouteShortName]" >
						Full Screen Map
					</div>
					<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="?action=favorites&favoriteaction=[FavoriteAction]&route=[RouteShortName]" >
						[FavoriteText] Favorites
					</div>
					<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="?action=map&route=[RouteShortName]" >
						Thumbnail Map
					</div>
					<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="models/ajax/realtime.php?route=[RouteShortName]&diagnostics" >
						Diagnostics
					</div>
				</div>
				<div class="buttonItem" >
					[RouteShortName]
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

