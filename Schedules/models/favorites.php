<?php
define( "DefaultExpiration", 60*60*24*365*5 ); // 60 seconds * 60 minutes * 24 hours * 365 days * 5 years

function GetFavorites( $CookieExpiration = DefaultExpiration ) {
	if ( isset( $_COOKIE["Favorites"] ) ) {
		$Result = $_COOKIE["Favorites"];
		setcookie( "Favorites", $Result, time() + $CookieExpiration );
	} else {
		$Result = "";
	}
	return $Result;
}

function UpdateFavorites( $FavoriteAction, $Route, $CookieExpiration = DefaultExpiration ) {
	$CookieValue = ( isset( $_COOKIE["Favorites"] ) == true ) ? $_COOKIE["Favorites"] : "";
	$CookieValue = preg_replace( "/\(" . $Route . "\)/", "", $CookieValue );
	if ( $FavoriteAction == "ADD" ) {
		$CookieValue = $CookieValue . "(" . $Route . ")";
	}
	setcookie( "Favorites", $CookieValue, time() + $CookieExpiration );
}
?>