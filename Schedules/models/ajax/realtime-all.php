<?php
header('Content-type: application/json');

$RealTimeJSON = file_get_contents( "http://developer.itsmarta.com/BRDRestService/BRDRestService.svc/GetAllBus" );

echo( $RealTimeJSON );
?>