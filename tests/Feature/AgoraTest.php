<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tipoff\LaravelAgoraApi\Tests\TestCase;

class AgoraTest extends TestCase
{
    public function testUnauthenticatedUsersCannotRetrieveAToken()
    {
        $response = $this->get('/retrieve-token');

        $response->assertStatus(404);
    }
}
