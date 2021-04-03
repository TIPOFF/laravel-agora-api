<?php

namespace Tipoff\LaravelAgoraApi\Services;

use Exception;

class UsernameService
{
    public static function getUsername($user)
    {
        $pieces = [];

        foreach (config('agora.user_display_name.fields') as $field) {
            if (isset($user->{$field})) {
                $pieces[] = $user->{$field};
            } else {
                throw new Exception('Nonexistent object property specified in username generation configuration.');
            }
        }

        return implode(
            config('agora.user_display_name.separator'),
            $pieces
        );
    }
}
