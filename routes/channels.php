<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Gate;
use Tipoff\LaravelAgoraApi\Services\DisplayNameService;

Broadcast::channel(config('agora.channel_name'), function ($user) {
    dd(Auth::check(), $user->hasPermissionTo('make video call'), );
    if (Auth::check() && $user->hasPermissionTo('make video call')) {
        return [
            'id' => Auth::id(),
            'name' => DisplayNameService::getDisplayName(Auth::user())
        ];
    } else {
        return false;
    }
});
