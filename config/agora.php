<?php

return [
    'credentials' => [
        'app_id' => env('AGORA_APP_ID'),
        'certificate' => env('AGORA_APP_CERTIFICATE'),
    ],

    'routes' => [
        'prefix' => env('AGORA_ROUTE_PREFIX', 'agora'),
        'middleware' => [
            'auth',
            'has-agora-permission'
        ],
    ],

    'channel_name' => env('AGORA_CHANNEL_NAME', 'agora-channel'),

    'user_display_name' => [
        'fields' => [
            'first_name',
            'last_name',
        ],
        'separator' => ' '
    ]
];
