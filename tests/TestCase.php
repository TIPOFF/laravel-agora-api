<?php

declare(strict_types=1);

namespace Tipoff\LaravelAgoraApi\Tests;

use Laravel\Nova\NovaCoreServiceProvider;
use Tipoff\LaravelAgoraApi\LaravelAgoraApiServiceProvider;
use Tipoff\LaravelAgoraApi\Tests\Support\Providers\NovaTestbenchServiceProvider;
use Tipoff\Locations\LocationsServiceProvider;
use Tipoff\Support\SupportServiceProvider;
use Tipoff\TestSupport\BaseTestCase;

class TestCase extends BaseTestCase
{
    protected function getPackageProviders($app)
    {
        return [
            NovaCoreServiceProvider::class,
            NovaTestbenchServiceProvider::class,
            LaravelAgoraApiServiceProvider::class,
            SupportServiceProvider::class,
            LocationsServiceProvider::class,
        ];
    }
}
