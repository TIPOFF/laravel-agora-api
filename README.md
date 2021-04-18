# Laravel Agora Videoconferencing

[![Latest Version on Packagist](https://img.shields.io/packagist/v/tipoff/laravel-agora-api.svg?style=flat-square)](https://packagist.org/packages/tipoff/laravel-agora-api)
![Tests](https://github.com/tipoff/laravel-agora-api/workflows/Tests/badge.svg)
[![Total Downloads](https://img.shields.io/packagist/dt/tipoff/laravel-agora-api.svg?style=flat-square)](https://packagist.org/packages/tipoff/laravel-agora-api)

This package provides an easy-to-use wrapper for placing video calls via the Agora API in the Laravel framework. The server-side implementation can be used with any Javascript framework (or none at all!), but this package also contains a set of ready-to-use Vue components that can be used for the client-side implementation.

## Installation

Install the package via composer:

```bash
composer require tipoff/laravel-agora-api
```

You may publish all of the packages resources (including the frontend assets) with the following command:
```bash
php artisan vendor:publish --provider="Tipoff\LaravelAgoraApi\LaravelAgoraApiServiceProvider"
```

You may publish just the config file with the following command:
```bash
php artisan vendor:publish --tag=agora-config
```

Obtain an app ID and certificate from Agora at: `https://www.agora.io/en/`.

Add the following variables to your `.env` file. (Additional config variables are specified in the `agora` config file, but these are the minimum required to use the package.)

```
AGORA_APP_ID={id-obtained-from-Agora}
AGORA_APP_CERTIFICATE={certificate-obtained-from-Agora}
```

If necessary, publish the configuration file and customize the fields used to generate a user's display name by changing the `user_display_name.fields` and `user_display_name.separator` fields.

## Server-side Usage

Retrieving an Agora token: 

```
/agora/retrieve-token
```

Placing a call (dispatches an event to start the call):

```
/agora/place-call
```

## Installing Optional Frontend Vue Resources

This package comes with a set of Vue components that you may use alongside the server-side functionality. **You do not have to use these components to use the server-side calls.** However, if you wish to use them, follow these steps to install and configure them in your application:

### Publish the Javascript Assets:

You may publish the assets with the following command:
```bash
php artisan vendor:publish --tag=agora-js
```

### Install JS Dependencies via NPM

```
npm install vue vuex agora-rtc-sdk-ng laravel-echo
```

### Import and Initialize Vue and Vuex

Inside your `resources/js/app.js` file, add the code from the following sections:

```
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const app = new Vue({
    el: '#app'
});
```

### Register the Vue Components
```
import AgoraVideoDisplay from './vendor/laravel-agora-api/components/AgoraVideoDisplay.vue';
import AgoraUserList from './vendor/laravel-agora-api/components/AgoraUserList.vue';
import AgoraIncomingCallAlert from './vendor/laravel-agora-api/components/AgoraIncomingCallAlert.vue';
...
Vue.component('agora-video-display', AgoraVideoDisplay);
Vue.component('agora-user-list', AgoraUserList);
Vue.component('agora-incoming-call-alert', AgoraIncomingCallAlert);
```

### Register the Vuex Module

This package uses a Vuex module to store and mutate state related to its functionality. This gives you access to the state in any other components you may register if necessary (for instance, to open a modal when a call is incoming).

```
import LaravelAgoraModule from './vendor/laravel-agora-api/modules/LaravelAgoraModule';
...
const store = new Vuex.Store({
    modules: {
        agora: LaravelAgoraModule
    }
})
```

Add the Vuex store to the `Vue` instance like so:

```
const app = new Vue({
    el: '#app',
    store: store
});
```

### Finishing Up Asset Registration

When you are finished adjusting your `app.js` file, it should look similar to this:

```
import Vue from 'vue';
import Vuex from 'vuex';
import LaravelAgoraModule from './vendor/laravel-agora-api/modules/LaravelAgoraModule';
import AgoraVideoDisplay from './vendor/laravel-agora-api/components/AgoraVideoDisplay.vue';
import AgoraUserList from './vendor/laravel-agora-api/components/AgoraUserList.vue';
import AgoraIncomingCallAlert from './vendor/laravel-agora-api/components/AgoraIncomingCallAlert.vue';
import AgoraCallOutgoingAlert from './vendor/laravel-agora-api/components/AgoraCallOutgoingAlert.vue';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        agora: LaravelAgoraModule
    }
})

Vue.component('agora-video-display', AgoraVideoDisplay);
Vue.component('agora-user-list', AgoraUserList);
Vue.component('agora-incoming-call-alert', AgoraIncomingCallAlert);
Vue.component('agora-outgoing-call-alert', AgoraCallOutgoingAlert);

const app = new Vue({
    el: '#app',
    store: store
});
```

### Set Up Broadcasting and Laravel Echo

Set up broadcasting for your application as detailed in the Laravel documentation at: `https://laravel.com/docs/broadcasting`.

**Note: Don't forget to uncomment `App\Providers\BroadcastServiceProvider::class` in your `app.php` configuration file.**

### Transpile and Place Assets

Run `npm run dev` to transpile the assets. You may now use the Vue components within your app like so:

```
<agora-video-display
    current-user-id="{{ Auth::id() }}"
    current-user-name="{{ \Tipoff\LaravelAgoraApi\Services\DisplayNameService::getDisplayName(Auth::user()) }}"
    echo-channel-name="{{ config('agora.channel_name') }}"
    agora-route-prefix="{{ config('agora.routes.prefix') }}"
    agora-app-id="{{ config('agora.credentials.app_id') }}"
></agora-video-display>

<agora-user-list></agora-user-list>

<agora-outgoing-call-alert></agora-outgoing-call-alert>

<agora-incoming-call-alert></agora-incoming-call-alert>
```

### Updating Package Resources

After updating to a newer package version, use `php artisan vendor:publish --tag=agora-js --force` to make sure that updates to package resources are republished to your application's `resources` directory.

## Styling Components

The Vue components available with this package have a variety of CSS classes attached to their HTML elements. This allows you to "hook" into the components and style them without having to modify them directly. You may view the various CSS classes available on the individual Vue components.

A starter file written in TailwindCSS can be published by running `php artisan vendor:publish --tag=agora-css`. After it is published, include it in your `resources/css/app.css` file (`@import 'vendor/agora-component-styles.css';`) and Laravel Mix will transpile it into your application for you (if using the default Mix setup).

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Tipoff](https://github.com/tipoff)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
