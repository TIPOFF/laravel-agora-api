<?php

declare(strict_types=1);

namespace Tipoff\LaravelAgoraApi;

use Illuminate\Support\Facades\Route;
use Tipoff\Support\TipoffPackage;
use Tipoff\Support\TipoffServiceProvider;

class LaravelAgoraApiServiceProvider extends TipoffServiceProvider
{
    public function configureTipoffPackage(TipoffPackage $package): void
    {
        $package
            ->name('agora')
            ->hasConfigFile();
    }

    public function boot()
    {
        Route::group($this->routeConfiguration(), function () {
            $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        });
    }

    protected function routeConfiguration()
    {
        return [
            'prefix' => config('agora.prefix'),
            'middleware' => config('agora.middleware'),
        ];
    }

    public function register()
    {
        parent::register();
    }
}
