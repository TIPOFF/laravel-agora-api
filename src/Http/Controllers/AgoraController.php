<?php

namespace Tipoff\LaravelAgoraApi\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tipoff\LaravelAgoraApi\AgoraDynamicKey\RtcTokenBuilder;
use Tipoff\LaravelAgoraApi\Events\DispatchAgoraCall;
use Tipoff\LaravelAgoraApi\Events\RejectAgoraCall;
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
            'token' => RtcTokenBuilder::buildTokenWithUid(
                config('agora.credentials.app_id'),
                config('agora.credentials.certificate'),
                $request->input('channel_name'),
                Auth::id(),
                RtcTokenBuilder::RoleAttendee,
                now()->getTimestamp() + 3600
            ),
        ]);
    }

    public function placeCall(Request $request)
    {
        $request->validate([
            'channel_name' => 'required|alpha_num',
            'recipient_id' => 'required|alpha_num',
        ]);

        broadcast(new DispatchAgoraCall(
            $request->input('channel_name'),
            Auth::id(),
            DisplayNameService::getDisplayName(Auth::user()),
            $request->input('recipient_id')
        ))->toOthers();
    }

    public function rejectCall(Request $request)
    {
        $request->validate([
            'caller_id' => 'required|alpha_num',
            'recipient_id' => 'required|alpha_num',
        ]);

        broadcast(new RejectAgoraCall(
            $request->input('caller_id'),
            $request->input('recipient_id')
        ))->toOthers();
    }
}
