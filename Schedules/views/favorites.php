<?php
// Fix the title to show (for example) "MARTA Route 1" or "MARTA Blue Line".
global $header_find, $header_replace;
$header_find["title"] = "/<title>.*?<\/title>/";
$title = "Update Favorites";
$header_replace["title"] = "<title>" . $title . "</title>";

$Route = $data["validated_route"];
$FavoriteAction = $data["validated_favoriteaction"];

UpdateFavorites( $FavoriteAction, $Route );
?>
<h1><?=$title?></h1>
<?php
switch ( $FavoriteAction ) :
	case "ADD":
?>
<p>You have added <strong>Route <?=$Route?></strong> to your favorites. It will now appear at the top of the Route List.</p>
<?php
		break;
	case "REMOVE":
?>
<p>You have removed <strong>Route <?=$Route?></strong> from your favorites. It will no longer appear at the top of the Route List.</p>
<?php
		break;
endswitch;
?>
<p>This favorites list is handled using browser cookies; please note the following about cookies:</p>
<ul>
	<li>Cookies are specific to the browser you are using. Therefore, if you update this list on Firefox (for example), you will not automatically see the same updates on Chrome (for example).</li>
	<li>Some browsers are capable of synching cookies on the various computers you use. If you have not set up this feature in your browser, or if your browser cannot do it, updates to your favorites list on this computer will not be visible on a different computer, even if you are using the same browser on that computer.</li>
	<li>If you clear your cookies, these favorites will be lost (although they can be re-created, of course).</li>
</ul>
