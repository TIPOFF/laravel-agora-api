# Laravel Package for wrapper of Agora API

[![Latest Version on Packagist](https://img.shields.io/packagist/v/tipoff/laravel-agora-api.svg?style=flat-square)](https://packagist.org/packages/tipoff/laravel-agora-api)
![Tests](https://github.com/tipoff/laravel-agora-api/workflows/Tests/badge.svg)
[![Total Downloads](https://img.shields.io/packagist/dt/tipoff/laravel-agora-api.svg?style=flat-square)](https://packagist.org/packages/tipoff/laravel-agora-api)

This is where your description should go.

## Installation

You can install the package via composer:

```bash
composer require tipoff/laravel-agora-api
```

You can publish the config file with:
```bash
php artisan vendor:publish --provider="Tipoff\LaravelAgoraApi\LaravelAgoraApiServiceProvider" --tag="laravel-agora-api-config"
```

Set up broadcasting in your Laravel app as per the docs.

This is the contents of the published config file:

```php
return [
];
```

## Testing

```bash
composer test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Tipoff](https://github.com/tipoff)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
