# Configuration reference

[[toc]]

## Sample configuration file

The sample configuration file shows all possible configuration options with their defaults for the `ymir.yml` file:

```yml
id: 1
name: project-name
type: wordpress
environments:
  environment-name:
    build:
      commands: []
      include: []
    cdn:
      caching: enabled
      cookies_whitelist: ['comment_*', 'wordpress_*', 'wp-settings-*']
      default_expiry: 300
      excluded_paths: ['/wp-admin/*', '/wp-login.php']
      invalidate_paths: []
    concurrency: 10
    cron: true
    database:
      server: database-server
      name: database-name
      user: database-user
    domain: []
    log_retention_period: 7
    network: network-name
    php: 7.4
    warmup: true
    website:
      memory: 256
      timeout: 30
    console:
      memory: 1028
      timeout: 60
```

## Project configuration

Project configuration options are global to a project and apply to all environments.

### id

**type**: `int` **required**

The ID of the project in Ymir.

### name

**type**: `string` **required**

The name of the project.

### type

**type**: `string` **required**

The project type.

The possible values are:

 * `bedrock` for [Bedrock][1] projects
 * `wordpress` for WordPress projects

### environments

**type**: `array` **required**

All the project environments. Configuration values for environments are covered in the next section.

## Environment configuration

Each key under the `environments` option is the name of the environment. Everything under that key is the configuration options for that environment.

### build

**type**: `array`

This is the array of values to configure the environment build. If the database value is a simple array, it'll be used as the `commands` value.

#### commands

**type**: `array`

This is an array of build commands that the Ymir CLI will run when building your project. These commands are executed on the computer performing the build and not on the Ymir platform. If your build commands generate files, they'll get packaged along with the rest of your project files during deployment.

#### include

**type**: `array`

This is an array of paths that you want to include in the environment build artifact. By default, Ymir will only add `.mo` and `.php` files to the build artifact to ensure a small build artifact. This lets you specify additional files or folders to add the build artifact besides the defaults.

### cdn

**type**: `array | string`

This is the array of values to configure the environment's CloudFront distribution. If the `cdn` value is a string, it'll be used as the `caching` value.

#### caching

**type**: `string` **default**: `enabled`

This option controls the CloudFront distribution.

The possible values are:

 * `enabled` enables CloudFront distribution caching
 * `assets` only caches assets
 * `disabled` disables CloudFront distribution caching

 ::: warning Provisioning delay
 Switching the `caching` value to `enabled` can cause your WordPress site to not load certain assets while the CloudFront distribution updates. This process can take as long as 40 minutes.
 :::

 ::: warning Full CloudFront caching disabled with REST API
If you have the `caching` set to `enabled` and the `gateway` option set to `rest`, the caching level will be downgraded to `assets` automatically. That's because REST APIs already have CloudFront page caching by default.
 :::

#### cookies_whitelist

**type**: `array` **default**: `['comment_*', 'wordpress_*', 'wp-settings-*']`

The list of cookies that are ignored by CloudFront and always forwarded to your WordPress site. Supports `*` wildcard character.

#### default_expiry

**type**: `int` **default**: `300`

The default time (in seconds) that CloudFront will keep something cached.

#### excluded_paths

**type**: `array` **default**: `['/wp-admin/*', '/wp-login.php']`

The list of paths that are ignored by CloudFront and always forwarded to your WordPress site. Supports `*` wildcard character.

::: tip Works with uploads directory
By default, CloudFront caches files in the `/uploads` directory for 24h. But some plugins use the `/uploads` directory to store dynamic files since it's the only writeable directory on a server. You can add these directories to have CloudFront exclude them from the cache.
:::

::: tip Tailored to all project types
The project `type` will change default paths for non-WordPress projects. So you don't need to edit this for `bedrock` projects.
:::

#### invalidate_paths

**type**: `array`

The list of paths that are cleared from the CloudFront distribution cache during the project deployment. Supports `*` wildcard character.

### concurrency

**type**: `int | false` **default**: `10`

This option controls the maximum number of `website` Lambda functions that can exist at the same time. (AWS calls this [reserved concurrency][2].) Setting this option to `false` removes the limit and allows unrestricted scaling.

::: warning Overwhelming your database server
If your `concurrency` value is too high or disabled, your database server could get overwhelmed when a traffic spike hits your WordPress site. If this happens, you'll want to increase the capacity of your database server.
:::

### cron

**type**: `int | false` **default**: `1`

The interval (in minutes) that [WP-Cron][3] gets called by CloudWatch. Also controls the `DISABLE_WP_CRON` constant. If set to `false`, it disables the CloudWatch rule and renables the standard WP-Cron behaviour.

### database

**type**: `array | string`

This is the array of values to configure the environment's database. If the `database` value is a string, it'll be used as the `server` value.

#### server

**type**: `string`

The database server used by the WordPress site. It can be the name of the database server if it's managed by Ymir or the host name of the database server otherwise.

#### name

**type**: `string` **default**: `wordpress`

The name of the database used by the WordPress site.

#### user

**type**: `string`

The user used by the WordPress site to connect to the database server.

### domain

**type**: `array`

The list of domain names mapped to the environment.

::: warning Domain name requirement
All domains names must either be managed by a DNS zone or have an issued certificate in the project region.
:::

### gateway

**type**: `string`

The gateway type used by the environment. Allowed values are `http` for HTTP APIs and `rest` for REST APIs.

::: danger DNS changes when switching gateway types
Whenever you switch gateway types, the DNS records pointing to your environment will change. If Ymir manages the DNS zone used by your environment, it'll update your DNS records automatically. Otherwise, you will have to do it yourself. That said, even with a managed DNS zone, your environment will be briefly unavailable while the DNS changes propagate.
:::

::: warning CloudFront page caching disabled with REST API.
When using a REST API, it isn't possible to use CloudFront for page caching. That's because the REST API already caches response using CloudFront. If your CloudFront caching is set to `enabled`, it'll get downgraded to `assets` automatically.
:::

### log_retention_period

**type**: `int` **default**: `7`

Controls the duration (in days) that the environment's logs are retained in CloudWatch. Allowed values are `1`, `3`, `5`, `7`, `14`, `30`, `60`, `90`, `120`, `150`, `180`, `365`, `400`, `545`, `731`, `1827` and `3653`.

### network

**type**: `string`

The network to use with your environment.

::: danger Overrides private database configuration
If your project environment uses a private database, Ymir will automatically connect your environment Lambda functions to the database's private network. However, setting the `network` option will override this. So if you're using a private database, it's important it be accessible from the configured `network`.
:::

::: warning Can create a NAT gateway
If the configured `network` doesn't have a NAT gateway, a NAT gateway will be configured during deployment. A NAT gateway costs about $32/month billed by the hour.
:::

### php

**type**: `string` **default**: `7.4`

The PHP version used by the environment. The supported versions are `7.2`, `7.3` and `7.4`.

### warmup

**type**: `int | false` **default**: `1`

The number of `website` functions that CloudWatch will keep warmed up. If set to `false`, it disables the warming up CloudWatch rule.

### console / website

**type**: `array`

This is the array of values to configure the environment's Lambda functions. There are two function nodes: `console` and `website`. `console` is the function used when running WP-CLI commands or any other background tasks. `website` is the function connected to the API gateway and that handles all the HTTP traffic.

#### memory

**type**: `int` **default**: `256` for `website` and `1024` for `console`

The amount of memory used by the Lambda function. The `website` function has lower memory needs by default because most memory heavy tasks are handled by the `console` function. Both default memory values are the lowest amount possible. If you lower them more, there might be issues during your function execution.

::: warning Low memory termination
If a function goes over the memory limit during its execution, it gets terminated automatically. So it's important to configure to give it enough memory to execute the worst case scenarios.
:::

::: warning Memory cost
Lambda charges based on the configured memory used. So more memory, means a higher Lambda bill. This isn't much of a concern for the `console` function since it won't get called a lot by default. But it's something to keep in mind when configuring the amount of memory that the `website` function has.
:::

#### timeout

**type**: `int` **default**: `30` for `website` and `60` for `console`

The maximum amount of time (in seconds) that the Lambda function can run before Lambda terminates it. The maximum allowed values depend on the function type. `website` cannot have a timeout larger than 30 seconds. `console` can have a maximum timeout of 900 seconds (15 minutes).

::: warning API gateway timeout
The 30 second timeout limit for the `website` function is due to a limit with AWS API gateways. An API gateway will terminate a connection after 30 seconds. This isn't modifiable.

This can be a significant technical hurdle if your WordPress site has long running operations that take more than 30 seconds to complete. In that scenario, these long operations need to be offloaded to a WP-CLI command or some external service.
:::

[1]: https://github.com/roots/bedrock
[2]: https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html#configuration-concurrency-reserved
[3]: https://developer.wordpress.org/plugins/cron/
