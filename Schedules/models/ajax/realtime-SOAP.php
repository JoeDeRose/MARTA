<?php
$request = <<<SOAPXML
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetBRDJSON xmlns="http://tempuri.org/">
      <routeabbr>39</routeabbr>
    </GetBRDJSON>
  </soap:Body>
</soap:Envelope>
SOAPXML;
?>
<?php
/*
POST /BRDWebService/BRDWebService.asmx HTTP/1.1
Host: developer.itsmarta.com
Content-Type: text/xml; charset=utf-8
Content-Length: length
SOAPAction: "http://tempuri.org/GetBRDJSON"

<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetBRDJSON xmlns="http://tempuri.org/">
      <routeabbr>int</routeabbr>
    </GetBRDJSON>
  </soap:Body>
</soap:Envelope>
*/
$requestlength = strlen( $request );

$http_req = "POST /BRDWebService/BRDWebService.asmx HTTP/1.1\r\n";
$http_req .= "Host: developer.itsmarta.com\r\n";
$http_req .= "Content-Type: text/xml; charset=utf-8\r\n";
$http_req .= "Content-Length: " . $requestlength . "\r\n";
$http_req .= "SOAPAction: \"http://tempuri.org/GetBRDJSON\"\r\n";
$http_req .= "\r\n";
$http_req .= $request;
//$socket = fsockopen( "http://developer.itsmarta.com/BRDWebService/BRDWebService.asmx?WSDL", 80 );
//fwrite( $socket, $http_req );
//stream_set_blocking( $socket, false );
//$response = '';
//$stop = microtime(true) + 20;
//while (!feof($socket)) {
//	$response .= fread( $socket, 20000 );
//	if (microtime(true) > $stop) 	{
//		throw new SoapFault('Client', 'HTTP timeout');
//	}
//}

// THIS WORKED (AS FAR AS IT WENT)
$client = new SoapClient(
	"http://developer.itsmarta.com/BRDWebService/BRDWebService.asmx?WSDL",
	array(
		"trace" => true
	)
);
$clientmethods = get_class_methods( $client );
$client -> __soapCall( "GetBRD", array( "routeabbr" => "39" ) );
$response = $client -> __getLastResponse();
//$response = $client -> __doRequest ( $http_req, "http://developer.itsmarta.com/BRDWebService/BRDWebService.asmx?WSDL", "http://tempuri.org/GetBRDJSON", "1.1" );
//$client -> GetBRD( array( "routeabbr" => "39" ) );

//$result = SoapClient => _doRequest( $request, "http://developer.itsmarta.com/BRDWebService/BRDWebService.asmx?WSDL", "http://tempuri.org/GetBRDJSON", "1.1" );

//$client = new SoapClient( "http://developer.itsmarta.com/BRDWebService/BRDWebService.asmx?WSDL" );

/*
$client = new SoapClient(
	"http://developer.itsmarta.com/BRDWebService/BRDWebService.asmx?WSDL",
	array(
		"POST /BRDWebService/BRDWebService.asmx HTTP/1.1",
		"Host: developer.itsmarta.com",
		"Content-Type: text/xml; charset=utf-8",
		"Content-Length: " . strlen( $request ),
		"SOAPAction: \"http://tempuri.org/GetBRDJSON\""
	)
);
$response = $client->GetBRDJSON($requestParams);
*/
//print_r( $response );
?>
<textarea rows="15" cols="80">
<?=$response?>
</textarea>
<pre>
<?php
print_r( $clientmethods );
?>
</pre>