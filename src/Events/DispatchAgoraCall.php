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

    public $channel;
    public $senderId;
    public $recipientId;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($channel, $senderId, $recipientId)
    {
        $this->channel = $channel;
        $this->senderId = $senderId;
        $this->recipientId = $recipientId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PresenceChannel(config('agora.channel_name'));
    }
}
