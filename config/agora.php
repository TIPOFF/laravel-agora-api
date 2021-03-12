<?php

return [
    'api_key' => env('AGORA_API_KEY'),

    'driver' => env('AGORA_DRIVER', 'pusher'),

    'prefix' => 'agora',
    
    'middleware' => [
        'auth'
    ],
];
