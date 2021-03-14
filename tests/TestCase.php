<?php

declare(strict_types=1);

namespace Tipoff\LaravelAgoraApi\Tests;

use Spatie\Permission\PermissionServiceProvider;
use Tipoff\Authorization\AuthorizationServiceProvider;
use Tipoff\LaravelAgoraApi\LaravelAgoraApiServiceProvider;
use Tipoff\Support\SupportServiceProvider;
use Tipoff\TestSupport\BaseTestCase;

class TestCase extends BaseTestCase
{
    protected function getPackageProviders($app)
    {
        return [
            SupportServiceProvider::class,
            AuthorizationServiceProvider::class,
            PermissionServiceProvider::class,
            LaravelAgoraApiServiceProvider::class,
        ];
    }
}
