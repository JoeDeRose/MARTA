<?php
	if ( isset( $_GET["route"] ) ) {
		$URL = "http://developer.itsmarta.com/BRDRestService/BRDRestService.svc/GetBusByRoute/" . $_GET["route"];
	} else {
		$URL = "http://developer.itsmarta.com/BRDRestService/BRDRestService.svc/GetAllBus";
	}
	$content = file_get_contents( $URL );
	echo $content;
?>