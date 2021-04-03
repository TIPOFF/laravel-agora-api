<?php

declare(strict_types=1);

namespace Tipoff\LaravelAgoraApi;

use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Tipoff\LaravelAgoraApi\Http\Middleware\AuthorizeAgoraActions;
use Tipoff\Support\TipoffPackage;
use Tipoff\Support\TipoffServiceProvider;

class LaravelAgoraApiServiceProvider extends TipoffServiceProvider
{
    public function configureTipoffPackage(TipoffPackage $package): void
    {
        $package
            ->name('agora')
            ->hasConfigFile('agora')
            ->hasAssets();
    }

    public function boot()
    {
        Route::group($this->routeConfiguration(), function () {
            $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        });

        $this->loadRoutesFrom(__DIR__.'/../routes/channels.php');

        $router = $this->app->make(Router::class);
        $router->aliasMiddleware('has-agora-permission', AuthorizeAgoraActions::class);

        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        $this->publishes([
            __DIR__.'/../config/agora.php' => config_path('agora.php'),
        ], 'agora-config');

        $this->publishes([
            __DIR__.'/../resources/js' => resource_path('js/vendor/laravel-agora-api'),
        ], 'agora-js');

        Gate::define('access-agora', function ($user) {
            return Auth::check();
        });
    }

    protected function routeConfiguration()
    {
        return [
            'prefix' => config('agora.routes.prefix'),
            'middleware' => config('agora.routes.middleware'),
        ];
    }
}
