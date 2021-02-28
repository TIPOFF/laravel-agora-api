<?php

declare(strict_types=1);

namespace Tipoff\LaravelAgoraApi;

use SerpApiSearch;
use Tipoff\Support\TipoffPackage;
use Tipoff\Support\TipoffServiceProvider;

class LaravelAgoraApiServiceProvider extends TipoffServiceProvider
{
    public function configureTipoffPackage(TipoffPackage $package): void
    {
        $package
            ->name('laravel-agora-api')
            ->hasViews()
            ->hasConfigFile();
    }

    public function register()
    {
        parent::register();

        $this->app->bind(SerpApiSearch::class, function () {
            $api_key = config('laravel-agora-api.api_key');
            $engine = config('laravel-agora-api.search_engine');

            return new SerpApiSearch($api_key, $engine);
        });
    }
}
