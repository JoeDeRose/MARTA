<h1>MARTA Timing Points</h1>

<?php
$postdata = http_build_query(
	array(
		".a" => "iHeadwaySheet",
		".s" => "a2af4d41",
		"LineAbbr" => "6",
		"DirectionName" => "Southbound",
		"Date" => "01-30-2013",
		"FromTime" => "5:00",
		"ToTime" => "4:59",
		"FromMeridiem" => "a",
		"ToMeridiem" => "a",
		"StopDisplay" => "Nodes"
	)
);

$opts = array( 'http' =>
	array(
		'method' => 'POST',
		'header' => 'Content-type: application/x-www-form-urlencoded',
		'content' => $postdata
	)
);

$context  = stream_context_create($opts);

$result = file_get_contents('http://mycommute.itsmarta.com/hiwire', false, $context);

// Build on this to extract all of the timing points listed.
preg_match( "/Stop Number: \d+/", $result, $matches, PREG_OFFSET_CAPTURE, 13198 );
print_r( $matches );
?>

<textarea cols="80" rows="25">
<?=$result?>
</textarea>