# How to set up Sage 10 in a Ymir project

[[toc]]

[Sage][1] is a popular starter theme by the [Roots team][2] that incorporates modern JS and PHP workflows. It's easy to configure your Ymir project to support Sage. This guide will cover the changes that you need to make to your project.

## Adding build steps to your project configuration

Whenever you deploy a Sage project, you need to [perform some build steps][3]. You'll need to configure these build steps in your `ymir.yml` project configuration file. Below is a sample configuration file with these build steps. You'll want to replace `path/to/themes/sage` with the path to your Sage theme.

You'll also need to add specific folders and directories to the build to ensure everything works correctly.

```yml
id: 42
name: ymir-sage
type: bedrock
environments:
  production:
    build:
      commands:
        - 'cd path/to/themes/sage; composer install --no-dev'
        - 'cd path/to/themes/sage; yarn && yarn build:production && rm -rf node_modules && rm -rf .github'
      include:
        - path/to/themes/sage/composer.json
        - path/to/themes/sage/vendor
  staging:
    cdn:
      caching: assets
    cron: false
    warmup: false
    build:
      commands:
        - 'cd path/to/themes/sage; composer install'
        - 'cd path/to/themes/sage; yarn && yarn build:production && rm -rf node_modules && rm -rf .github'
      include:
        - path/to/themes/sage/composer.json
        - path/to/themes/sage/vendor
```

## Configuring the `storage` directory on Lambda

To function, Sage needs the `/storage` directory inside the theme to be writeable. This isn't possible with AWS Lambda. Instead, we need to move the `/storage` directory to the `/tmp` directory which is the only writeable directory on Lambda.

To do this, you'll need to add code to your `bootstrap/app.php` file. This code below will create the `/tmp/storage` directory (if it doesn't exist) and make Sage use it.

::: warning Required before Sage boots
The code below must appear before the `\Roots\bootloader();` line.
:::

```php
<?php

add_filter("acorn/paths.storage", function (string $path) {
    if (!getenv('YMIR_ENVIRONMENT')) {
        return $path;
    }

    $directories = [
        '/framework/cache',
        '/framework/views',
    ];
    $path = '/tmp/storage';

    foreach ($directories as $directory) {
        $directory = $path.$directory;

        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
    }

    return $path;
});

\Roots\bootloader();
```

## Configuring external logs

By default, Sage keeps `daily` logs in `logs/application.log`. These logs won't be accessible on AWS Lambda. Instead, you want to use other log drivers that send logs to external services.

[1]: https://roots.io/sage/
[2]: https://roots.io
[3]: https://roots.io/docs/sage/9.x/deployment
