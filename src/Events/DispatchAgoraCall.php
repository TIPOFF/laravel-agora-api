<?php

namespace Tipoff\LaravelAgoraApi;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DispatchAgoraCall implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $agoraChannel;
    public $senderId;
    public $recipientId;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($agoraChannel, $senderId, $recipientId)
    {
        $this->agoraChannel = $agoraChannel;
        $this->senderId = $senderId;
        $this->recipientId = $recipientId;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new PresenceChannel(config('agora.channel_name'));
    }
}