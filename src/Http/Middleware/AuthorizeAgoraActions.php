<?php

namespace Tipoff\LaravelAgoraApi\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Gate;

class AuthorizeAgoraActions
{
    public function handle($request, Closure $next)
    {
        /** @psalm-suppress UndefinedInterfaceMethod */
        if (Gate::allows('access-agora')) {
            return $next($request);
        } else {
            abort(403);
        }
    }
}
