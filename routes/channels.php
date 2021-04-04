<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;
use Tipoff\LaravelAgoraApi\Services\DisplayNameService;

Broadcast::channel(config('agora.channel_name'), function ($user) {
    if (Auth::check()) {
        return [
            'id' => Auth::id(),
            'name' => DisplayNameService::getDisplayName(Auth::user())
        ];
    } else {
        return false;
    }
});
