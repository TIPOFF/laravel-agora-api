<?php

namespace Tests\Feature;

use Tipoff\LaravelAgoraApi\Tests\TestCase;

class AgoraTest extends TestCase
{
    public function testUnauthenticatedUsersCannotRetrieveAToken()
    {
        $response = $this->get('/retrieve-token');

        $response->assertStatus(404);
    }
}
