<?php
global $header_find, $header_replace;
$header_find["title"] = "/<title>.*?<\/title>/";
if ( is_numeric( $data["validated_route"] ) ) {
	$header_replace["title"] = "<title>MARTA Route " . $data["validated_route"] . "</title>";
} else {
	$header_replace["title"] = "<title>MARTA " . $data["validated_route"] . " Line</title>";
}

require( 'includes/busmap.php' );

$display = show_map( get_shape( $data ) );

$pre_display = $display;
$pre_display = preg_replace( "/&/", "&amp;", $pre_display );
$pre_display = preg_replace( "/</", "&lt;", $pre_display );
$pre_display = preg_replace( "/>/", "&gt;", $pre_display );
?>

<h1>Thumbnail Map</h1>

<?=$display["svg"]?>

<p>Notes:

<ul>
	<li>This page is pulling the map in real time from a copy of the MARTA GTFS feed.</li>
	<li>At the bottom of this document is the <code>&lt;style&gt;</code> and <code>&lt;svg&gt;</code> markup that can be used to reproduce this image elsewhere; it changes dynamically based on the parameters you select.</li>
	<li>The route colors come from the MARTA GTFS specification, and match the line colors as displayed in Google Maps.</li>
</ul>

<p>Following are the available settings. View the URL for details about how the parameters are applied.</p>

<h2>Scope</h2>

<div class="buttonEffect buttonMenu buttonEffectRoundedAll">
	<?
		$thisAction = update_URL( "scope=[^&]+", "scope=route" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >Zoom to Route (default)</div>
	<?
		$thisAction = update_URL( "scope=[^&]+", "scope=FP" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >Keep Five Points Station in Frame</div>
	<?
		$thisAction = update_URL( "scope=[^&]+", "scope=rail" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >Keep Rail System in Frame</div>
	<?
		$thisAction = update_URL( "scope=[^&]+", "scope=all" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >Keep Entire System in Frame</div>
</div>

<h2>Size</h2>

<div class="buttonEffect buttonMenu buttonEffectRoundedAll">
	<?
		$thisAction = update_URL( "size=\d+", "size=200" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >200 pixels&#x00B2;</div>
	<?
		$thisAction = update_URL( "size=\d+", "size=300" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >300 pixels&#x00B2; (default)</div>
	<?
		$thisAction = update_URL( "size=\d+", "size=600" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >600 pixels&#x00B2;</div>
	<?
		$thisAction = update_URL( "size=\d+", "size=900" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >900 pixels&#x00B2;</div>
</div>

<h2>Bus Stops</h2>

<div class="buttonEffect buttonMenu buttonEffectRoundedAll">
	<?
		$thisAction = update_URL( "showstops", "showstops" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >Show Bus Stops</div>
	<?
		$thisAction = update_URL( "showstops", "" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >Hide Bus Stops (default)</div>
</div>

<h2>Rail System</h2>

<div class="buttonEffect buttonMenu buttonEffectRoundedAll">
	<?
		$thisAction = update_URL( "norail", "" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >Show Rail System (default)</div>
	<?
		$thisAction = update_URL( "norail", "norail" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >Hide Rail System</div>
</div>

<h2>Highways</h2>

<div class="buttonEffect buttonMenu buttonEffectRoundedAll">
	<?
		$thisAction = update_URL( "highway", "highway" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >Show Highways</div>
	<?
		$thisAction = update_URL( "highway", "" )
	?>
		<div class="buttonMenuItem buttonMenuItemListener" data-buttonTarget="<?=$thisAction?>" >Hide Highways (default)</div>
</div>

<h1>SVG Code</h1>

<p>For map at top of page as generated with the current settings.</p>

<pre>
&lt;style&gt;
<?=$display["style"]?>
&lt;/style&gt;

<?=$pre_display["svg"]?>
</pre>

