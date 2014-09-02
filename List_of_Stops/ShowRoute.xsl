<?xml version="1.0" encoding="utf-8"?><!-- DWXMLSource="Route99NB.xml" -->
<!DOCTYPE xsl:stylesheet  [
	<!ENTITY nbsp   "&#160;">
	<!ENTITY copy   "&#169;">
	<!ENTITY reg    "&#174;">
	<!ENTITY trade  "&#8482;">
	<!ENTITY mdash  "&#8212;">
	<!ENTITY ldquo  "&#8220;">
	<!ENTITY rdquo  "&#8221;"> 
	<!ENTITY pound  "&#163;">
	<!ENTITY yen    "&#165;">
	<!ENTITY euro   "&#8364;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="utf-8" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>
<xsl:template match="/">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Untitled Document</title>
</head>

<body>
<style>
	table
		{
			border-collapse:collapse;
		}
	
	td
		{
			vertical-align:top;
		}
	
	ul
		{
			margin-top:0;
			margin-bottom:0;
		}
	
	.LineTop
		{
			border-top:1px #000 solid;
		}
	
	.HiddenLine
		{
			color:#FFF;
		}
	
	.HighlightRow
		{
			background-color:#FF9;
		}
	
	.HighlightServiceStreet
		{
			color:#999;
		}
	
	.AlignRight
		{
			text-align:right;
		}
	
	.PadLeft
		{
			padding-left:1em;
		}
</style>



<script src="jquery.min.js"></script>
<script>
	function Highlight(RowID)
		{
			$( '.Row' + RowID ).addClass( 'HighlightRow' );
			$( '.Row' + RowID + ' .HiddenLine' ).addClass( 'HighlightServiceStreet' );
		}

	function Unhighlight(RowID)
		{
			$( '.Row' + RowID ).removeClass( 'HighlightRow' );
			$( '.Row' + RowID + ' .HiddenLine' ).removeClass( 'HighlightServiceStreet' );
		}
</script>

<p>&nbsp;</p>
<table>
	<thead>
		<tr>
			<th>&nbsp;</th>
			<th>Service Street</th>
			<th>&nbsp;</th>
			<th>Cross Street</th>
			<th colspan="3">Amenities</th>
			<th>At or Near This Stop</th>
		</tr>
	</thead>
	<tbody>
		<xsl:for-each select="Route/Stops/Stop">
			<tr>
				<xsl:attribute name="class">
					<xsl:value-of select="StopType"/> Row<xsl:value-of select="StopID"/>
				</xsl:attribute>
				<xsl:attribute name="onmouseover">Highlight('<xsl:value-of select="StopID"/>')</xsl:attribute>
				<xsl:attribute name="onmouseout">Unhighlight('<xsl:value-of select="StopID"/>')</xsl:attribute>
				<td>
					<xsl:choose>
						<xsl:when test="preceding-sibling::Stop[1]/ServiceStreet = ServiceStreet">
							<xsl:attribute name="class">HiddenLine</xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
							<xsl:attribute name="class">LineTop</xsl:attribute>
						</xsl:otherwise>
					</xsl:choose>
					<input class="form-checkbox" onClick="return setStops();" type="checkbox">
						<xsl:attribute name="name">
							<xsl:value-of select="concat('STOP', StopID)"/>
						</xsl:attribute>
						<xsl:attribute name="value">
							<xsl:value-of select="StopID"/>
						</xsl:attribute>
					</input>&nbsp;
				</td>
				<td>
					<xsl:choose>
						<xsl:when test="preceding-sibling::Stop[1]/ServiceStreet = ServiceStreet">
							<xsl:attribute name="class">AlignRight HiddenLine</xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
							<xsl:attribute name="class">AlignRight LineTop</xsl:attribute>
						</xsl:otherwise>
					</xsl:choose>
					<strong><xsl:value-of select="ServiceStreet"/></strong>
				</td>
				<td class="LineTop">&nbsp;@&nbsp;</td>
				<td class="LineTop"><xsl:value-of select="CrossStreet"/></td>
				<td class="LineTop">
					<xsl:if test="Wheelchair='Y'">
						<img src="99WeekdayNB_files/access.gif" alt="This stop is wheelchair accessible." title="This stop is wheelchair accessible." />
					</xsl:if>
				</td>
				<td class="LineTop">
					<xsl:if test="Shelter!='N'">
						<img src="99WeekdayNB_files/BusStop.png" alt="">
							<xsl:attribute name="alt">
								<xsl:value-of select="concat('This stop is sheltered: ', Shelter, '.')"/>
							</xsl:attribute>
							<xsl:attribute name="title">
								<xsl:value-of select="concat('This stop is sheltered: ', Shelter, '.')"/>
							</xsl:attribute>
						</img>
					</xsl:if>
				</td>
				<td class="LineTop">
					<xsl:if test="StopType='node'">
						<img src="99WeekdayNB_files/TimingPoint.gif" alt="This is a timing point stop." title="This is a timing point stop." />
					</xsl:if>
				</td>
				<td class="LineTop">
					<span class="PadLeft">
						Map and Details for This Stop:
						<a target="_blank">
							<xsl:attribute name="href">
								<xsl:value-of select="concat('http://mycommute.itsmarta.com/hiwire?.a=iStopLookupDetails&amp;StopAbbr=', StopNum)"/>
							</xsl:attribute>
							<xsl:value-of select="StopNum"/>
						</a>
					</span>
					<ul>
						<xsl:for-each select="POIs/POI">
							<li>
								<xsl:choose>
									<xsl:when test="POIItem/@LinkType='station'">
										<a target="_blank">
											<xsl:attribute name="href">
												<xsl:value-of select="concat('http://www.itsmarta.com/', POIItem/@Route, '-overview.aspx')"/>
											</xsl:attribute>
											<xsl:value-of select="POIItem"/>
										</a>
									</xsl:when>
									<xsl:when test="POIItem/@LinkType='rail'">
										<a target="_blank">
											<xsl:attribute name="href">
												<xsl:value-of select="concat('http://www.itsmarta.com/', POIItem/@Route, '-overview.aspx')"/>
											</xsl:attribute>
											<xsl:value-of select="POIItem"/>
										</a>
									</xsl:when>
									<xsl:when test="POIItem/@LinkType='bus'">
										<a target="_blank">
											<xsl:attribute name="href">
												<xsl:value-of select="concat('http://www.itsmarta.com/', POIItem/@Route, '-w.aspx')"/>
											</xsl:attribute>
											<xsl:value-of select="POIItem"/>
										</a>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="POIItem"/>
									</xsl:otherwise>
								</xsl:choose>
							</li>
						</xsl:for-each>
					</ul>
				</td>
			</tr>
		</xsl:for-each>
		<td colspan="8" class="LineTop">&nbsp;</td>
	</tbody>
</table>

</body>
</html>

</xsl:template>
</xsl:stylesheet>