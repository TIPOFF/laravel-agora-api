<?php

namespace Tipoff\LaravelAgoraApi\Tests\Feature\Http;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use Mockery;
use Tipoff\Authorization\Models\User;
use Tipoff\LaravelAgoraApi\Events\AgoraCallAccepted;
use Tipoff\LaravelAgoraApi\Events\DispatchAgoraCall;
use Tipoff\LaravelAgoraApi\Events\RejectAgoraCall;
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

    public function testInvalidRequestsDoNotReturnAToken()
    {
        $response = $this->actingAs(User::factory()->create())
            ->postJson(route('agora.retrieve-token'));

        $response->assertStatus(422);
    }

    public function testInvalidRequestsDoNotReturnPlaceACall()
    {
        $response = $this->actingAs(User::factory()->create())
            ->postJson(route('agora.place-call'));

        $response->assertStatus(422);
    }

    public function testAuthorizedUsersCanRetrieveAToken()
    {
        $fakeTokenContents = 'an-Agora-token';

        Mockery::namedMock('Tipoff\LaravelAgoraApi\AgoraDynamicKey\RtcTokenBuilder', 'Tipoff\LaravelAgoraApi\Tests\Feature\Http\RtcTokenBuilderStub')
            ->shouldReceive('buildTokenWithUid')
            ->andReturn($fakeTokenContents);

        $user = User::factory()->create();
        $user->name = 'John Doe';

        $response = $this->actingAs($user)
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

        $user = User::factory()->create();
        $user->name = 'John Doe';

        $response = $this->actingAs($user)
            ->postJson(route('agora.place-call'), [
                'channel_name' => $this->faker->word,
                'recipient_id' => User::factory()->create()->id,
            ]);

        Event::assertDispatched(DispatchAgoraCall::class);

        $response->assertStatus(200);
    }

    public function testCallAcceptanceEventIsDispatchable() {
        Event::fake();

        $user = User::factory()->create();
        $user->name = 'John Doe';

        $response = $this->actingAs($user)
            ->postJson(route('agora.accept-call'), [
                'caller_id' => User::factory()->create()->id,
                'recipient_id' => $user->id,
            ]);

        Event::assertDispatched(AgoraCallAccepted::class);

        $response->assertStatus(200);
    }

    public function testCallAcceptanceEventIsNotDispatchedWhenMissingData() {
        Event::fake();

        $user = User::factory()->create();
        $user->name = 'John Doe';

        $response = $this->actingAs($user)
            ->postJson(route('agora.accept-call'), []);

        Event::assertNotDispatched(AgoraCallAccepted::class);

        $response->assertStatus(422);
    }

    public function testCallRejectionEventIsDispatchable() {
        Event::fake();

        $user = User::factory()->create();
        $user->name = 'John Doe';

        $response = $this->actingAs($user)
            ->postJson(route('agora.reject-call'), [
                'caller_id' => User::factory()->create()->id,
                'recipient_id' => $user->id,
            ]);

        Event::assertDispatched(RejectAgoraCall::class);

        $response->assertStatus(200);
    }

    public function testCallRejectionEventIsNotDispatchedWhenMissingData() {
        Event::fake();

        $user = User::factory()->create();
        $user->name = 'John Doe';

        $response = $this->actingAs($user)
            ->postJson(route('agora.reject-call'), []);

        Event::assertNotDispatched(RejectAgoraCall::class);

        $response->assertStatus(422);
    }
}

class RtcTokenBuilderStub
{
    const RoleAttendee = 0;
    const RolePublisher = 1;
    const RoleSubscriber = 2;
    const RoleAdmin = 101;
}
