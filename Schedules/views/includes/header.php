<?php
global $FullScreen, $MenuItems;

if ( $FullScreen == false ) :
?>
<div id="NavHeader">
	<div class="VerticalGroup">
		<div id="NavExpandHolder">
			<div id="NavExpand" class="buttonEffect NavMinimized"><a href="#" onclick="NavHeaderToggle(); return false;">+</a></div>
		</div>
		<div id="LogoMenuHolder">
			<div id="LogoHolder">
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
			</div>
		</div>
	</div>
	<div id="NavHeaderMenu" class="VerticalGroup" style="display: none;">
		<div class="BlankDiv buttonEffect"></div>
		<div id="NavMenu" class="buttonEffect buttonMenu buttonEffectRoundedTRBR" >
<?php
if ( strpos( $data["MenuItems"], "(main)" ) !== false ) :
?>
			<div class="buttonMenuItem" onclick="NavHeaderToggle(); ButtonClick( '/' );">
				<a href="#" onclick="return false;">Main Menu</a>
			</div>
<?php
endif;
?>
<?php
if ( strpos( $data["MenuItems"], "(routes)" ) !== false ) :
?>
			<div class="buttonMenuItem" onclick="NavHeaderToggle(); ButtonClick( '?action=routes' );">
				<a href="#" onclick="return false;">Route List</a>
			</div>
<?php
endif;
?>
<?php
if ( strpos( $data["MenuItems"], "(fullscreen)" ) !== false ) :
?>
			<div class="buttonMenuItem" onclick="NavHeaderToggle(); ButtonClick( '?action=currentinfo&route=<?=$data["validated_route"]?>&fullscreen' );">
				<a href="#" onclick="return false;">View Map Full Screen</a>
			</div>
<?php
endif;
?>
<?php
if ( strpos( $data["MenuItems"], "(currentinfo)" ) !== false ) :
?>
			<div class="buttonMenuItem" onclick="NavHeaderToggle(); ButtonClick( '?action=currentinfo&route=<?=$data["validated_route"]?>' );">
				<a href="#" onclick="return false;">Current Information for This Route</a>
			</div>
<?php
endif;
?>
<?php
if ( strpos( $data["MenuItems"], "(map)" ) !== false ) :
?>
			<div class="buttonMenuItem" onclick="NavHeaderToggle(); ButtonClick( '?action=map&route=<?=$data["validated_route"]?>' );">
				<a href="#" onclick="return false;">Thumbnail Map for This Route</a>
			</div>
<?php
endif;
?>
		</div>
	</div>
</div>
<?php
endif;
?>
