<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel(config('agora.channel_name'), function ($user) {
    if (Auth::check() && $user->hasPermissionTo('make video call')) {
        return [
            'id' => $user->id,
            'name' => $user->name
        ];
    } else {
        return false;
    }
});
