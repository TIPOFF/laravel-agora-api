<?php

namespace Tipoff\LaravelAgoraApi\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class AuthorizeAgoraActions
{
    public function handle($request, Closure $next)
    {
        /** @psalm-suppress UndefinedInterfaceMethod */
        if (Auth::user()->hasPermissionTo('make video call')) {
            return $next($request);
        } else {
            abort(403);
        }
    }
}
