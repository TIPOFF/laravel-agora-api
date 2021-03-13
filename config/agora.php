<?php

return [
    'api_key' => env('AGORA_API_KEY'),

    'driver' => env('AGORA_DRIVER', 'pusher'),

    'prefix' => env('AGORA_ROUTE_PREFIX', 'agora'),

    'channel_name' => env('AGORA_CHANNEL_NAME', 'agora-channel'),
    
    'middleware' => [
        'auth'
    ],
];
