<?php

declare(strict_types=1);

namespace Tipoff\LaravelAgoraApi;

use Tipoff\Support\TipoffPackage;
use Tipoff\Support\TipoffServiceProvider;

class LaravelAgoraApiServiceProvider extends TipoffServiceProvider
{
    public function configureTipoffPackage(TipoffPackage $package): void
    {
        $package
            ->name('agora')
            ->hasViews()
            ->hasConfigFile()
            ->hasRoute('routes/web.php');
    }

    public function register()
    {
        parent::register();
    }
}
