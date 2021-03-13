<?php

return [
    'credentials' => [
        'api_key' => env('AGORA_API_KEY'),
    ],

    'routes' => [
        'prefix' => env('AGORA_ROUTE_PREFIX', 'agora'),
        'middleware' => [
            'auth'
        ],
    ],

    'channel_name' => env('AGORA_CHANNEL_NAME', 'agora-channel'),
];
