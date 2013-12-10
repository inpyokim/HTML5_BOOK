<?php
session_start();
require_once("twitteroauth/twitteroauth.php"); //Path to twitteroauth library

$twitteruser = "izie";
$consumerkey = "drVCuvffOjh1VpUUsSdeg";
$consumersecret = "XxhYD8c8jHTOMr69TbFOt4pLXxEz6y79dWPxL7aijw";
$accesstoken = "18710632-39ib3ouD1szUuwfSQrTVlr5dNQwJSL8it1IVaQLlT";
$accesstokensecret = "aohE1M9w3KcitgGmXYeHfE6HyOpe9RtiHGxEskeR8kLAU";
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}

 
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$apiUrl = isset($_GET['apiUrl']) ? $_GET['apiUrl'] : false;
if (!$apiUrl) {
    header("HTTP/1.0 400 Bad Request");
    echo "에러 : apiUrl 파라미터가 없습니다.";
    exit();
}
$url = urldecode($apiUrl);
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("".$url);
 
echo json_encode($tweets);

?>