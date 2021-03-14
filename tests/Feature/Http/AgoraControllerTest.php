<?php

namespace Tipoff\LaravelAgoraApi\Tests\Feature\Http;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Event;
use Tipoff\Authorization\Models\User;
use Tipoff\LaravelAgoraApi\Events\DispatchAgoraCall;
use Tipoff\LaravelAgoraApi\Tests\TestCase;

class AgoraControllerTest extends TestCase
{
    use DatabaseTransactions;

    public function testUnauthenticatedUsersCannotRetrieveAToken()
    {
        $response = $this->postJson(route('agora.retrieve-token'));

        $response->assertStatus(401);
    }

    public function testUnauthenticatedUsersCannotPlaceACall()
    {
        $response = $this->postJson(route('agora.place-call'));

        $response->assertStatus(401);
    }

    public function testUnauthorizedUsersCannotRetrieveAToken()
    {
        $response = $this->actingAs(User::factory()->create())
            ->postJson(route('agora.retrieve-token'));

        $response->assertStatus(403);
    }

    public function testUnauthorizedUsersCannotPlaceACall()
    {
        $response = $this->actingAs(User::factory()->create())
            ->postJson(route('agora.place-call'));

        $response->assertStatus(403);
    }

    public function testInvalidRequestsDoNotReturnAToken()
    {
        $response = $this->actingAs(self::createPermissionedUser('make video call', true))
            ->postJson(route('agora.retrieve-token'));

        $response->assertStatus(422);
    }

    public function testInvalidRequestsDoNotReturnPlaceACall()
    {
        $response = $this->actingAs(self::createPermissionedUser('make video call', true))
            ->postJson(route('agora.place-call'));

        $response->assertStatus(422);
    }
}
