<?php
require __DIR__ . '/vendor/autoload.php';
use WebSocket\Client;

$config = require __DIR__ . '/config.php';

$auth = new \GuzzleHttp\Client();
$res = $auth->request('POST', $config['auth'], [
    'headers' => [
        'User-Agent' => 'api',
    ],
    'form_params' => [
        'email' => $config['email'],
        'password' => $config['password'],
    ]
]);

$uid = null;
$token = null;
$session_token = null;

try {
    $body = json_decode((string) $res->getBody());
    $uid = $body->data->user_id;
    $session_token = $body->data->session_token;
    $token = $body->data->token;

} catch (\Exception $e) {
    echo "Auth error\n";
    exit;
}

$client = new Client($config['wss'] . '/?session_token=' . $session_token, [
    'timeout' => $config['connection_timeout'],
    'headers' => [
        'user-agent' => 'api'
    ]
]);

try {
    // Authenticate user
    $client->send(json_encode([
        'm' => 0,
        'i' => 0,
        'n' => "WebAuthenticateUser",
        'o' => json_encode([
            "OMSId" => 1,
            "SessionToken" => $token
        ])
    ]));
    $response = $client->receive();
    echo "Got auth info: $response\n\n";

    // Get user info
    $client->send(json_encode([
        'm' => 0,
        'i' => 0,
        'n' => "GetUserInfo",
        'o' => json_encode([
            "OMSId" => 1,
            "UserId" => $uid
        ])
    ]));
    $response = $client->receive();
    echo "Got user info: $response\n\n";

} catch (\Exception $e) {
    echo "Request failed: " . $e->getMessage() . "\n\n";
}

$client->close();
