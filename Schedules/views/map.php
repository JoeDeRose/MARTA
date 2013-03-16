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
<?=$display["svg"]?>

<p>Notes:

<ul>
	<li>These are not intended to be street-level maps, as such maps are already available on Google Maps. Rather, this system is designed to produce thumbnails that can inform riders of the general location of a bus or rail line.</li>
	<li>This page is pulling the map in real time from a copy of the MARTA GTFS feed.</li>
	<li>At the bottom of this document is the <code>&lt;style&gt;</code> and <code>&lt;svg&gt;</code> markup that can be used to reproduce this image elsewhere; it changes dynamically based on the parameters you select.</li>
	<li>The route colors come from the MARTA GTFS specification, and match the line colors as displayed in Google Maps.</li>
</ul>

<p>Following are the parameters that can be added to the web address for different effects:</p>

<p><strong>?action=map</strong> (required)</p>
<blockquote>
	<p>this is how the controller knows to display this page; it cannot be omitted.</p>
</blockquote>

<p><strong>&amp;route=</strong> (required)</p>
<blockquote>
	<p>This is how you select the route for which a map is displayed; it can either be the number of a bus route or the color of a rail line, as in the following examples:</p>
	<table class="mapexample">
		<thead>
			<tr>
				<th>Parameter</th>
				<th>Result</th>
				<th>Example</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th>&amp;route=110</th>
				<td>Bus Route 110</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=110">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=110</a></td>
			</tr>
			<tr>
				<th>&amp;route=blue</th>
				<td>Blue Rail Line</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=blue">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=blue</a></td>
			</tr>
		</tbody>
	</table>
</blockquote>

<p><strong>&amp;scope=</strong> (required)</p>
<blockquote>
	<p>This controls how you zoom in on the map; four options are available, and they are best illustrated on a route far from the center, such as the 120:</p>
	<table class="mapexample">
		<thead>
			<tr>
				<th>Parameter</th>
				<th>Result</th>
				<th>Example</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th>&amp;scope=route</th>
				<td>(Default) Zooms in to the selected route.</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=120&scope=route">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=120&amp;scope=route</a></td>
			</tr>
			<tr>
				<th>&amp;scope=FP</th>
				<td>Ensures that the Five Points Station is always in the frame, which is probably sufficient for most people who are familiar with the system to get their bearings.</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=120&scope=FP">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=120&amp;scope=FP</a></td>
			</tr>
			<tr>
				<th>&amp;scope=rail</th>
				<td>Zooms out so that the entire rail system is always in the frame.</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=120&scope=rail">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=120&amp;scope=rail</a></td>
			</tr>
			<tr>
				<th>&amp;scope=all</th>
				<td>Zooms farther out so that any line on the system can be displayed within the frame.</td>
				<td>
					<strong>Route 120</strong> (as compared to the examples above):<br />
					<a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=120&scope=all">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=120&amp;scope=all</a>
					<br /><br />
					<strong>Route 180</strong> (southernmost and westernmost service):<br />
					<a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=180&scope=all">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=180&amp;scope=all</a>
					<br /><br />
					<strong>Route 143</strong> (northernmost service):<br />
					<a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=143&scope=all">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=143&amp;scope=all</a>
					<br /><br />
					<strong>Route 116</strong> (easternmost service):<br />
					<a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=116&scope=all">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=116&amp;scope=all</a>
				</td>
			</tr>
		</tbody>
	</table>
</blockquote>

<p><strong>&amp;size=</strong></p>
<blockquote>
	<p>Lets you select the size of the frame. It can be followed by any number, but following are some examples:</p>
	<table class="mapexample">
		<thead>
			<tr>
				<th>Parameter</th>
				<th>Result</th>
				<th>Example</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th>&amp;size=300</th>
				<td>(Default) 300 pixels</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=110&size=300">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=110&amp;size=300</a></td>
			</tr>
			<tr>
				<th>&amp;size=200</th>
				<td>200 pixels</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=110&size=200">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=110&amp;size=200</a></td>
			</tr>
			<tr>
				<th>&amp;size=600</th>
				<td>600 pixels</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=110&size=600">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=110&amp;size=600</a></td>
			</tr>
			<tr>
				<th>&amp;size=900</th>
				<td>900 pixels</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=110&size=900">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=110&amp;size=900</a></td>
			</tr>
		</tbody>
	</table>
</blockquote>

<p><strong>&amp;showstops</strong></p>
<blockquote>
	<p>Shows bus stops or rail stations as small red dots; pointing the mouse at
		a stop will show the stop name:</p>
	<table class="mapexample">
		<thead>
			<tr>
				<th>Parameter</th>
				<th>Result</th>
				<th>Example</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th>&amp;showstops</th>
				<td>Shows stops or stations</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=27&showstops">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=27&amp;showstops</a></td>
			</tr>
		</tbody>
	</table>
</blockquote>

<p><strong>&amp;highway</strong> and <strong>&amp;norail</strong></p>
<blockquote>
	<p>My personal opinion is that it is better to frame MARTA routes against the rail system than against the highway system for the following reasons:</p>
	<ul>
		<li>Most Atlantans are familiar with the MARTA rail footprint, and find it just as intuitive as the highway system.</li>
		<li>Most riders will be connecting to a bus line from a rail line, and display of the rail system helps then conceptualize a trip better than the highway system.</li>
		<li>If the goal is to get more people on public transit, then the transit system, rather than the highway system, should be our focus.</li>
	</ul>
	<p>Nonetheless, MARTA has historically produced these thumbnail images against the highway map rather than the rail map, so I devised a system for (separately) turning on highways and turning off rail lines:</p>
	<table class="mapexample">
		<thead>
			<tr>
				<th>Parameter</th>
				<th>Result</th>
				<th>Example</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>(no selection)</td>
				<td>Default: Shows rail and hides highways</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=110">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=110</a></td>
			</tr>
			<tr>
				<th>&amp;highway</th>
				<td>Keeps default selection of showing rail and also shows highways</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=110&highway">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=110&amp;highway</a></td>
			</tr>
			<tr>
				<th>&amp;norail</th>
				<td>Hides both rail and highways: Overrides default selection for rails,
					thus making them hidden; no effect on highways, which were
					already hidden</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=110&norail">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=110&amp;norail</a></td>
			</tr>
			<tr>
				<th>&amp;highway&amp;norail</th>
				<td>Overrides both defaults: Shows highways and hides rail</td>
				<td><a href="http://www.joederose.us/MARTA/Schedules/?action=map&route=110&highway&norail">http://www.joederose.us/MARTA/Schedules/?action=map&amp;route=110&amp;highway&amp;norail</a></td>
			</tr>
		</tbody>
	</table>
</blockquote>

<hr />
<pre>
&lt;style&gt;
<?=$display["style"]?>
&lt;/style&gt;

<?=$pre_display["svg"]?>
</pre>

