<?php

namespace Tipoff\LaravelAgoraApi\Tests\Feature\Http;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Config;
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

        Mockery::namedMock('Tipoff\LaravelAgoraApi\AgoraDynamicKey\RtcTokenBuilder', 'Tipoff\LaravelAgoraApi\Tests\Feature\Http\RtcTokenBuilderStub')
            ->shouldReceive('buildTokenWithUid')
            ->andReturn($fakeTokenContents);

        Mockery::getConfiguration()->setConstantsMap([
            'RtcTokenBuilder' => [
                'RoleAttendee' => 0,
                'RolePublisher' => 1,
                'RoleSubscriber' => 2,
                'RoleAdmin' => 101,
            ],
        ]);

        $user = self::createPermissionedUser('make video call', true);
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

    // public function testAuthorizedUsersCanPlaceACall()
    // {
    //     Config::set('user_display_name.fields', [
    //         'first_name',
    //         'last_name'
    //     ]);

    //     Event::fake();

    //     $response = $this->actingAs(self::createPermissionedUser('make video call', true))
    //         ->postJson(route('agora.place-call'), [
    //             'channel_name' => $this->faker->word,
    //             'recipient_id' => User::factory()->create()->id,
    //         ]);

    //     Event::assertDispatched(DispatchAgoraCall::class);

    //     $response->assertStatus(200);
    // }

    public function testNonexistentUsersCannotBeCalled()
    {
        Event::fake();

        $response = $this->actingAs(self::createPermissionedUser('make video call', true))
            ->postJson(route('agora.place-call'), [
                'channel_name' => $this->faker->word,
                'recipient_id' => 'not-a-real-user-id',
            ]);

        Event::assertNotDispatched(DispatchAgoraCall::class);

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
