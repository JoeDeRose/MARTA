<?php
require_once('models/includes/main.php');
require_once('models/includes/validate.php');
require_once('models/favorites.php' );

function callback( $buffer ) {
	global $header_find, $header_replace;
	foreach( $header_find as $key => $value ) {
		$buffer = preg_replace( $value, $header_replace[$key], $buffer );
	}
	return $buffer;
}

ob_start("callback");
$header_find = array();
$header_replace = array();

if ( isset( $_GET["fullscreen"] ) ) {
	$FullScreen = true;
	$FullScreenClass = "FullScreen";
} else {
	$FullScreen = false;
	$FullScreenClass = "Normal";
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MARTA At Your Fingertips</title>

<!-- CSS -->
<link rel="stylesheet" type="text/css" media="all" href="includes/main.css" />

<!-- Icons -->
<link rel="shortcut icon" href="favicon.ico" />
<link rel="apple-touch-icon" sizes="57x57" href="http://marta-ayf.com/views/images/unprotected/apple-touch-icon.png" />
<link rel="apple-touch-icon" sizes="72x72" href="http://marta-ayf.com/views/images/unprotected/apple-touch-icon-72x72.png" />
<link rel="apple-touch-icon" sizes="114x114" href="http://marta-ayf.com/views/images/unprotected/apple-touch-icon-114x114.png" />
<link rel="apple-touch-icon" sizes="144x144" href="http://marta-ayf.com/views/images/unprotected/apple-touch-icon-144x144.png" />

<style></style>

</head>

<body class="<?=$FullScreenClass?>">

<!-- Google Analytics -->
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-37469097-1']);
  _gaq.push(['_setDomainName', 'joederose.us']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>

<!-- Google Maps -->
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCF2hkVUVY70uZdaxiQfYwlh7f3P4CNVKw&sensor=false"></script>

<!-- jQuery -->
<script src="includes/jquery-min.js"></script>

<!-- This App -->
<script src="includes/main.js"></script>
<script>
	// Probably will delete this.
	function ReturnToRouteList() {
		window.location.href = "?action=routes";
	}
</script>
<?php
$action = isset( $_GET['action'] ) ? $_GET['action'] : "routes" ;

function _load_view( $viewname, $data = null ) {
	require( 'views/includes/header.php' );
	require( 'views/'.$viewname.'.php' );
}

function _load_model( $modelname, $data = null ) {
	require_once( 'models/'.$modelname.'.php' );
}

function routes() {
	$data["MenuItems"] = "(main)";
	_load_view( 'routes', $data ); 
}

function route() {
	// This page needs to be dropped or completely rewritten; not currently used.
	$data = array();
	$data["route"] = _validate( "route" );
	$data["scope"] = _validate( "scope" );
	$data["size"] = _validate( "size" );
	$data["showstops"] = _validate( "showstops" );
	$data["highway"] = _validate( "highway" );
	$data["norail"] = _validate( "norail" );
	$data["MenuItems"] = "(main)";
	_load_model( 'route' );
	_load_view( 'route', get_shape( $data ) ); 
}

function map() {
	$data = array();
	$data["validated_route"] = _validate( "route" );
	$data["scope"] = _validate( "scope" );
	$data["size"] = _validate( "size" );
	$data["showstops"] = _validate( "showstops" );
	$data["highway"] = _validate( "highway" );
	$data["norail"] = _validate( "norail" );
	$data["MenuItems"] = "(main)(routes)(currentinfo)";
	_load_model( 'route' );
	_load_view( 'map', $data ); 
}

function currentinfo() {
	$data = array();
	$data["validated_route"] = _validate( "route" );
	$data["MenuItems"] = "(main)(routes)(fullscreen)(map)";
	_load_view( 'currentinfo', $data ); 
}

function diagnostics() {
	_load_view( 'diagnostics' ); 
}

function favorites() {
	$data = array();
	$data["validated_route"] = _validate( "route" );
	$data["validated_favoriteaction"] = _validate( "favoriteaction" );
	$data["MenuItems"] = "(main)";
	_load_view( 'favorites', $data ); 
}

function list_timingpoints() {
	_load_view( 'list_timingpoints' ); 
}

if( function_exists($action) == 1 && substr( $action, 0, 1 ) != "_" ) {
	//The check for the first character is done, because we are going to make some methods that we don't want users to access.
	$action();     //call the requested function if it exists
} else {
	echo "<h1>404 Page Not Found</h1><p>The page you requested could not be found</p>";
}

?>
</body>
</html>
<?php
ob_end_flush();
?>