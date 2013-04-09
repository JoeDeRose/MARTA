$( document ).on(
	"click",
	".NavHeaderToggleListener",
	function() {
		if ( $( "#NavExpand" ).html() == "+" ) {
			$( "#NavExpandHolder" ).addClass( "buttonEffect" );
			$( "#NavHeaderMenu" ).show();
			$( "#NavExpand" ).html( "&ndash;" );
		} else {
			$( "#NavExpandHolder" ).removeClass( "buttonEffect" );
			$( "#NavHeaderMenu" ).hide();
			$( "#NavExpand" ).html( "+" );
		}
	}
);

$( document ).on(
	"click",
	".buttonMenuItemListener",
	function() {
		buttonTarget = $( this ).attr( "data-buttonTarget" );
		$( "#loading" ).show();
		window.location.href = buttonTarget;
	}
);

