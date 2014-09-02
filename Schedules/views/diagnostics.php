<?php
global $header_find, $header_replace;
$header_find["title"] = "/<title>.*?<\/title>/";
$header_replace["title"] = "<title>Diagnositcs</title>";

// Load model components.
_load_model( 'diagnostics' );
$data = get_diagnostics();		// Uses same data content as that which was passed in.
?>

<h1>Diagnostics</h1>

<h2>General</h2>

<table class="GridTable">
	<thead>
		<tr>
			<th>Environment</th>
			<th>Version</th>
			<th>Date/Time</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>PHP</th>
			<td><?=$data["PHP_Version"]?></td>
			<td><?=$data["PHP_DateTime"]?></td>
		</tr>
		<tr>
			<th>MySQL</th>
			<td><?=$data["MySQL_Version"]?></td>
			<td><?=$data["MySQL_DateTime"]?></td>
		</tr>
		<tr>
			<th>MARTA</th>
			<td>&nbsp;</td>
			<td style="text-align: right;"><?=$data["MARTA_Time"]?></td>
		</tr>
	</tbody>
</table>

<h2>PHP</h2>

<h3><code>$_SERVER</code></h3>

<pre>
<?php
print_r( $data["PHP_Server"] );
?>
</pre>

<h3><code>phpinfo()</code></h3>

<?php
phpinfo();
?>

<h2>MySQL</h2>

<h3><code>INFORMATION_SCHEMA.GLOBAL_STATUS</code></h3>

<table class="GridTable">
	<thead>
		<tr>
			<th>VARIABLE_NAME</th>
			<th>VARIABLE_VALUE</th>
		</tr>
	</thead>
	<tbody>
<?php
	while ( $row = $data["MySQL_Status"] -> fetch_assoc() ) :
?>
		<tr>
			<td><?=$row["VARIABLE_NAME"]?></td>
			<td><?=$row["VARIABLE_VALUE"]?></td>
		</tr>
<?php
	endwhile;
?>
	</tbody>
</table>
