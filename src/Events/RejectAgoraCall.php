<?php

namespace Tipoff\LaravelAgoraApi\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RejectAgoraCall implements ShouldBroadcast
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public $callerId;
    public $recipientId;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($callerId, $recipientId)
    {
        $this->callerId = $callerId;
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
