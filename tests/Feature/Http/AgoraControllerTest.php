<?php

namespace Tipoff\LaravelAgoraApi\Tests\Feature\Http;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use Mockery;
use Tipoff\Authorization\Models\User;
use Tipoff\LaravelAgoraApi\Events\DispatchAgoraCall;
use Tipoff\LaravelAgoraApi\Tests\TestCase;

class AgoraControllerTest extends TestCase
{
    use DatabaseTransactions;
    use WithFaker;

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

    public function testAuthorizedUsersCanRetrieveAToken()
    {
        $fakeTokenContents = 'an-Agora-token';
        
        $mock = Mockery::mock('overload:Tipoff\LaravelAgoraApi\AgoraDynamicKey\RtcTokenBuilder')->makePartial();
        $mock->shouldReceive('buildTokenWithUserAccount')->once()->andReturn($fakeTokenContents);

        $response = $this->actingAs(self::createPermissionedUser('make video call', true))
            ->postJson(route('agora.retrieve-token'), [
                'channel_name' => $this->faker->word,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'token' => $fakeTokenContents,
            ]);

        Mockery::close();
    }

    public function testAuthorizedUsersCanPlaceACall()
    {
        Event::fake();

        $response = $this->actingAs(self::createPermissionedUser('make video call', true))
            ->postJson(route('agora.place-call'), [
                'channel_name' => $this->faker->word,
                'recipient_id' => User::factory()->create()->id,
            ]);

        Event::assertDispatched(DispatchAgoraCall::class);

        $response->assertStatus(200);
    }
}
