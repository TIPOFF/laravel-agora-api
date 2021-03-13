<?php

namespace Tests\Feature\Http;

use Tipoff\LaravelAgoraApi\Tests\TestCase;

class AgoraControllerTest extends TestCase
{
    public function testUnauthenticatedUsersCannotRetrieveAToken()
    {
        $response = $this->postJson('/'.config('agora.routes.prefix').'/retrieve-token');

        $response->assertStatus(401);
    }
}
