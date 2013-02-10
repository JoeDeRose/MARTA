<?php
ini_set('display_errors', 1);

require_once('/home2/joederos/private/connection.php');
$mysqli = new mysqli( "localhost", $MARTALogin, $MARTAPassword, $MARTADatabase );
if (!$mysqli) {
	die( "Could not connect: " . mysql_error() );
}
?>