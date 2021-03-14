<?php

namespace Tipoff\LaravelAgoraApi\Tests\Feature\Http;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tipoff\LaravelAgoraApi\Tests\TestCase;

class AgoraControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testUnauthenticatedUsersCannotRetrieveAToken()
    {
        $response = $this->postJson('/'.config('agora.routes.prefix').'/retrieve-token');

        $response->assertStatus(401);
    }

    public function testUnauthenticatedUsersCannotPlaceACall()
    {
        $response = $this->postJson(route('agora.place-call'));

        $response->assertStatus(401);
    }
}
