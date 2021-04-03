<?php

namespace Tipoff\LaravelAgoraApi\Services;

use Exception;

class DisplayNameService
{
    public static function getDisplayName($user) {
        $pieces = [];

        foreach (config('agora.user_display_name.fields') as $field) {
            if (isset($user->{$field})) {
                $pieces[] = $user->{$field};
            } else {
                throw new Exception("Nonexistent object property: '{$field}' specified in username generation configuration.");
            }
        }

        return implode(
            config('agora.user_display_name.separator'),
            $pieces
        );
    }
}
