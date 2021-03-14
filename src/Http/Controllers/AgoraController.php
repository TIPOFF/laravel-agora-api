<?php

namespace Tipoff\LaravelAgoraApi\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tipoff\LaravelAgoraApi\AgoraDynamicKey\RtcTokenBuilder;
use Tipoff\LaravelAgoraApi\Events\DispatchAgoraCall;

class AgoraController extends Controller
{
    public function retrieveToken(Request $request)
    {
        /** @psalm-suppress NoInterfaceProperties */
        return RtcTokenBuilder::buildTokenWithUserAccount(
            config('agora.credentials.app_id'),
            config('agora.credentials.certificate'),
            $request->channelName,
            Auth::user()->name,
            RtcTokenBuilder::RoleAttendee,
            now()->getTimestamp() + 3600
        );
    }

    public function placeCall(Request $request) {
        broadcast(new DispatchAgoraCall(
            $request->input('channel_name'),
            Auth::id(),
            $request->input('recipient_id')
        ))->toOthers();
    }
}
