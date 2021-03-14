<?php

namespace Tipoff\LaravelAgoraApi\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Google_Search
 */
class AgoraApiFacade extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'agora-api';
    }
}
