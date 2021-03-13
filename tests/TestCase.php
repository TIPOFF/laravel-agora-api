<?php

declare(strict_types=1);

namespace Tipoff\LaravelAgoraApi\Tests;

use Tipoff\LaravelAgoraApi\LaravelAgoraApiServiceProvider;
use Tipoff\Support\SupportServiceProvider;
use Tipoff\TestSupport\BaseTestCase;

class TestCase extends BaseTestCase
{
    protected function getPackageProviders($app)
    {
        return [
            LaravelAgoraApiServiceProvider::class,
            SupportServiceProvider::class,
        ];
    }
}
