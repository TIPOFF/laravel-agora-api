<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Gate;
use Tipoff\LaravelAgoraApi\Services\DisplayNameService;

Broadcast::channel(config('agora.channel_name'), function ($user) {
    if (Gate::allows('access-agora')) {
        return [
            'id' => $user->id,
            'name' => DisplayNameService::getDisplayName($user)
        ];
    } else {
        return false;
    }
});
