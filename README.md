# Laravel Package for wrapper of Agora API

[![Latest Version on Packagist](https://img.shields.io/packagist/v/tipoff/laravel-agora-api.svg?style=flat-square)](https://packagist.org/packages/tipoff/laravel-agora-api)
![Tests](https://github.com/tipoff/laravel-agora-api/workflows/Tests/badge.svg)
[![Total Downloads](https://img.shields.io/packagist/dt/tipoff/laravel-agora-api.svg?style=flat-square)](https://packagist.org/packages/tipoff/laravel-agora-api)

This is where your description should go. (API wrapper + video conferencing Vue component)

## Installation

Install the package via composer:

```bash
composer require tipoff/laravel-agora-api
```

You may publish the config file with the following command:
```bash
php artisan vendor:publish --tag=agora-config
```

Obtain an app ID and certificate from Agora at: `https://www.agora.io/en/`.

Add the following variables to your `.env` file. (Additional config variables are specified in the `agora` config file, but these are the minimum required to use the package.)

```
AGORA_APP_ID={id-obtained-from-Agora}
AGORA_APP_CERTIFICATE={certificate-obtained-from-Agora}
```

## Installing Optional Frontend Vue Resources

Comes with a set of optional Vue components (Not required to use the server side functionality.)

### Publish the Javascript Assets:

You may publish the assets with the following command:
```bash
php artisan vendor:publish --tag=agora-js
```

 - Enable Laravel Echo
 - Register components
 - Register Vuex module (Note that using a module means that they can tap into the data in custom components as well.)
 - Enable Echo
 - Run Laravel Mix


### Install JS Dependencies via NPM

```
npm install vue vuex agora-rtc-sdk
```

### Register the Vue Components



### Register the Vuex Module



### Set Up Broadcasting and Laravel Echo

Set up broadcasting in your Laravel app as per the docs.

Uncomment Echo in `resources/js/bootstrap.js`

### Updating Package Resources

After updating to a newer package version, use `php artisan vendor:publish --tag=agora-js --force` to make sure that updates to package resources are republished to your application's `resources` directory.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Tipoff](https://github.com/tipoff)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
