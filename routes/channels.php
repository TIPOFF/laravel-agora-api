<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel(config('agora.channel_name'), function ($user) {
    return [
        'id' => $user->id,
        'name' => $user->name
    ];
});
