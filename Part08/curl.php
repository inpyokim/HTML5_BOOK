<?php
$apiUrl = isset($_GET['apiUrl']) ? $_GET['apiUrl'] : false;
if (!$apiUrl) {
    header("HTTP/1.0 400 Bad Request");
    echo "에러 : apiUrl 파라미터가 없습니다.";
    exit();
}

$url = urldecode($apiUrl);

// Open the Curl session
$session = curl_init($url);
// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$json = curl_exec($session);

// The web service returns XML
header("Content-Type:  application/json");

echo $json;
curl_close($session);

?>