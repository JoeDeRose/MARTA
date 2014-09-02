<?php
function show_map( $shapeinfo ) {
	$size = $shapeinfo["size"];
	$route_color = $shapeinfo["route_color"];
	$stroke_width_route = $shapeinfo["stroke_width_route"];
	$stroke_width_rail = $shapeinfo["stroke_width_rail"];
	$radius_rail_station = $shapeinfo["radius_rail_station"];

	global $header_find, $header_replace;
	
	$style_replace = "";
	$style_replace .= <<<STYLEREPLACE
    .SVGbackground
        {
            fill: darkgray;
        }
	.borderrect
		{
            fill: none;
            stroke: black;
            stroke-width: 1px;
		}
    .routeline
        {
            fill: none;
            stroke: #{$route_color};
            stroke-width: {$stroke_width_route}px;
        }
	.busstop
		{
			fill: red;
			stroke: red;
			stroke-width: 1px;
		}

STYLEREPLACE;
	if ( $shapeinfo["norail"] == false ) {
		$style_replace .= <<<STYLEREPLACERAIL
    .railline
        {
            fill: none;
            stroke: white;
            stroke-width: {$stroke_width_rail}px;
        }
    .railstation
        {
            fill: white;
            stroke: white;
            stroke-width: 1px;
        }

STYLEREPLACERAIL;
	}
	if ( $shapeinfo["highway"] == true ) {
		$style_replace .= <<<STYLEREPLACEHIGHWAY
    .highwayline
        {
            fill: none;
            stroke: black;
            stroke-width: {$stroke_width_rail}px;
        }

STYLEREPLACEHIGHWAY;
	}

	$header_find["style"] = "/(<style>.*?)(<\/style>)/";
	$header_replace["style"] = "$1" . $style_replace . "$2";

	$output = array();
	$output["style"] = $style_replace;
	
	$svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" width=\"" . $size . "\" height=\"" . $size . "\" >\n";
	$svg .= "    <rect class=\"SVGbackground\" x=\"0\" y=\"0\" width=\"" . $size . "\" height=\"" . $size . "\" />\n";
	if ( $shapeinfo["highway"] == true ) {
		// Draw highways.
		foreach( $shapeinfo["highwaypolylines"] as $value ) {
			$svg .= "    <polyline class=\"highwayline\" points=\"" . trim($value) . "\" />\n";
		}
	}
	if ( $shapeinfo["norail"] == false ) {
		// Draw rail lines.
		foreach( $shapeinfo["railpolylines"] as $value ) {
			$svg .= "    <polyline class=\"railline\" points=\"" . trim($value) . "\" />\n";
		}
		// Draw rail stations.
		foreach( $shapeinfo["railstations"] as $value ) {
			$svg .= "    <g>\n";
			$svg .= "        <title class=\"railstationtitle\">" . $value["stop_name"] . "</title>\n";
			$svg .= "        <circle class=\"railstation\" cx=\"" . $value["value_x"] . "\" cy=\"" . $value["value_y"] . "\" r=\"" . $radius_rail_station . "\" />\n";
			$svg .= "    </g>\n";
		}
	}
	// Draw route lines.
	foreach( $shapeinfo["routepolylines"] as $value ) {
		$svg .= "    <polyline class=\"routeline\" points=\"" . trim($value) . "\" />\n";
	}
	if ( $shapeinfo["showstops"] == true ) {
		// Draw bus stops.
		foreach( $shapeinfo["busstoplocations"] as $value ) {
			$svg .= "    <g>\n";
			$svg .= "        <title class=\"showstopstitle\">" . $value["stop_name"] . " (" . $value["stop_code"] . ")</title>\n";
			$svg .= "        <circle class=\"busstop\" cx=\"" . $value["value_x"] . "\" cy=\"" . $value["value_y"] . "\" r=\"1.5\" />\n";
			$svg .= "    </g>\n";
		}
	}
	$svg .= "    <rect class=\"borderrect\" width=\"" . $size . "\" height=\"" . $size . "\">\n";
	$svg .= "</svg>";
	$output["svg"] = $svg;
	
	return $output;
}
?>
