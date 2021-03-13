<?php

namespace Tests\Feature;

use Tipoff\LaravelAgoraApi\Tests\TestCase;

class AgoraTest extends TestCase
{
    public function testUnauthenticatedUsersCannotRetrieveAToken()
    {
        $response = $this->postJson('/'.config('agora.routes.prefix').'/retrieve-token');

        $response->assertStatus(401);
    }
}
