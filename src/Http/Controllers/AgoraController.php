<?php

namespace Tipoff\LaravelAgoraApi\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tipoff\LaravelAgoraApi\AgoraDynamicKey\RtcTokenBuilder;
use Tipoff\LaravelAgoraApi\Events\DispatchAgoraCall;
use Tipoff\LaravelAgoraApi\Services\DisplayNameService;

class AgoraController extends Controller
{
    public function retrieveToken(Request $request)
    {
        $request->validate([
            'channel_name' => 'required|string',
        ]);

        /** @psalm-suppress NoInterfaceProperties */
        return response()->json([
            'token' => RtcTokenBuilder::buildTokenWithUserAccount(
                config('agora.credentials.app_id'),
                config('agora.credentials.certificate'),
                $request->input('channel_name'),
                DisplayNameService::getUsername(Auth::user()),
                0, // RtcTokenBuilder::RoleAttendee is throwing an `Undefined constant` error for some reason. Leaving this for now.
                now()->getTimestamp() + 3600
            ),
        ]);
    }

    public function placeCall(Request $request)
    {
        $request->validate([
            'channel_name' => 'required|string',
            'recipient_id' => 'required|exists:users,id',
        ]);

        broadcast(new DispatchAgoraCall(
            $request->input('channel_name'),
            Auth::id(),
            $request->input('recipient_id')
        ))->toOthers();
    }
}
