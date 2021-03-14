<?php

namespace Tipoff\LaravelAgoraApi\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tipoff\LaravelAgoraApi\AgoraDynamicKey\RtcTokenBuilder;

class AgoraController extends Controller
{
    public function retrieveToken(Request $request)
    {
        return RtcTokenBuilder::buildTokenWithUserAccount(
            config('agora.credentials.app_id'),
            config('agora.credentials.certificate'),
            $request->channelName,
            Auth::user()->name,
            RtcTokenBuilder::RoleAttendee,
            now()->getTimestamp() + 3600
        );
    }
}
