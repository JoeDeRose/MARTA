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
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MARTA Routes and Schedules</title>

<link rel="stylesheet" type="text/css" media="all" href="includes/main.css" />
<style></style>

</head>

<body>

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

<!-- jQuery Mobile
<link rel="stylesheet" href="http://code.jquery.com/mobile/1.3.0-rc.1/jquery.mobile-1.3.0-rc.1.min.css" />
<script src="http://code.jquery.com/mobile/1.3.0-rc.1/jquery.mobile-1.3.0-rc.1.min.js"></script>
<script src="http://code.jquery.com/jquery-1.9.0.min.js"></script>
-->
<script src="includes/jquery-min.js"></script>

<!-- This App -->
<script>
	function ReturnToRouteList() {
		window.location.href = "?action=routes";
	}
</script>
<p>
<div>
<?php
require_once('views/images/logo.svg');
?>
</div>
	<div id="logo">
		<span style="background-color: #3E78DA;">A</span>t
		<span style="background-color: #F7CD30;">Y</span>our
		<span style="background-color: #EA7D09;">F</span>ingertips
	</div>
</p>
<?php
if ( $_SERVER["QUERY_STRING"] != "" && $_SERVER["QUERY_STRING"] != "action=routes" ):
?>
<a href="#" class="buttonEffect buttonEffectMinimized buttonItem" onclick="ReturnToRouteList(); return false;">
	Return to Route List
</a>
<?php
endif;
?>

<?php
$action = isset( $_GET['action'] ) ? $_GET['action'] : "routes" ;

function _load_view( $viewname, $data = null ) {
	require( 'views/'.$viewname.'.php' );
}

function _load_model( $modelname, $data = null ) {
	require_once( 'models/'.$modelname.'.php' );
}

function routes() {
	_load_view( 'routes' ); 
}

function route() {
	$data = array();
	$data["route"] = _validate( "route" );
	$data["scope"] = _validate( "scope" );
	$data["size"] = _validate( "size" );
	$data["showstops"] = _validate( "showstops" );
	$data["highway"] = _validate( "highway" );
	$data["norail"] = _validate( "norail" );
	_load_model( 'route' );
	_load_view( 'route', get_shape( $data ) ); 
}

function map() {
	$data = array();
	$data["route"] = _validate( "route" );
	$data["scope"] = _validate( "scope" );
	$data["size"] = _validate( "size" );
	$data["showstops"] = _validate( "showstops" );
	$data["highway"] = _validate( "highway" );
	$data["norail"] = _validate( "norail" );
	_load_model( 'route' );
	_load_view( 'map', get_shape( $data ) ); 
}

function currentinfo() {
	$data = array();
	$data["validated_route"] = _validate( "route" );
	_load_view( 'currentinfo', $data ); 
}

function diagnostics() {
	_load_view( 'diagnostics' ); 
}

function favorites() {
	$data = array();
	$data["validated_route"] = _validate( "route" );
	$data["validated_favoriteaction"] = _validate( "favoriteaction" );
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