<?php

declare(strict_types=1);

namespace Tipoff\LaravelAgoraApi\Tests\Support\Providers;

use Tipoff\LaravelAgoraApi\Nova\Competitor;
use Tipoff\LaravelAgoraApi\Nova\Insight;
use Tipoff\LaravelAgoraApi\Nova\Review;
use Tipoff\LaravelAgoraApi\Nova\Snapshot;
use Tipoff\TestSupport\Providers\BaseNovaPackageServiceProvider;

class NovaTestbenchServiceProvider extends BaseNovaPackageServiceProvider
{
    public static array $packageResources = [
        Competitor::class,
        Insight::class,
        Review::class,
        Snapshot::class,
    ];
}
