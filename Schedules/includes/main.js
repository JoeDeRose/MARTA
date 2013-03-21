function NavHeaderToggle() {
	if ( $( "#NavExpand a" ).html() == "+" ) {
		$( "#NavExpandHolder" ).addClass( "buttonEffect" );
		$( "#NavHeaderMenu" ).show();
		$( "#NavExpand a" ).html( "&ndash;" );
	} else {
		$( "#NavExpandHolder" ).removeClass( "buttonEffect" );
		$( "#NavHeaderMenu" ).hide();
		$( "#NavExpand a" ).html( "+" );
	}
}

function ButtonClick( ButtonTarget ) {
	$( "#loading" ).show();
	window.location.href = ButtonTarget;
}
