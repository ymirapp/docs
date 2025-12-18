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
    architecture: x86_64
    build:
      commands: []
      include: []
    cache: cache-name
    cdn:
      cache_policy_assets: ymir-assets-policy
      cache_policy_content: false
      caching: enabled
      cookies_whitelist: ['comment_*', 'wp-postpass_*', 'wordpress_*', 'wp-settings-*']
      default_expiry: 300
      excluded_paths: ['/wp-admin/*', '/wp-cron.php', '/wp-login.php']
      forwarded_headers: ['origin']
      functions_assets:
        - name: function-name
          type: viewer-request
      functions_content:
        - name: function-name
          type: viewer-request
      invalidate_paths: []
      image_processing_memory: 256
      origin_shield: disabled
      process_images: disabled
    concurrency: 10
    cron: 1
    database:
      server: database-server
      name: database-name
      user: database-user
    deployment: zip
    domain: []
    firewall: disabled
    gateway: http
    logging: enabled
    log_retention_period: 7
    network: network-name
    php: 7.4
    tags: []
    warmup: 1
    website:
      concurrency: 10
      memory: 512
      timeout: 30
    console:
      memory: 1024
      timeout: 60
    queues:
      default:
        concurrency: 10
        memory: 1024
        timeout: 600
        type: standard
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
 * `radicle` for [Radicle][18] projects
 * `wordpress` for standard WordPress projects

### environments

**type**: `array` **required**

All the project environments. Configuration values for environments are covered in the next section.

## Environment configuration

Each key under the `environments` option is the name of the environment. Everything under that key is the configuration options for that environment.

### architecture

**type**: `string` **default**: `x86_64`

The CPU architecture used by the Lambda function. Allowed values are `arm64` or `x86_64`.

::: tip Faster and cheaper with Arm64
Using the `arm64` CPU architecture can make your Lambda function **up to 20% faster** at **20% lower cost**. For backwards compatibility reasons, Ymir defaults to `x86_64`, but there are no downsides to using `arm64` architecture.
:::

### build

**type**: `array`

This is the array of values to configure the environment build. If the database value is a simple array, it'll be used as the `commands` value.

#### commands

**type**: `array`

This is an array of build commands that the Ymir CLI will run when building your project. These commands are executed on the computer performing the build and not on the Ymir platform. If your build commands generate files, they'll get packaged along with the rest of your project files during deployment.

#### include

**type**: `array`

This is an array of paths that you want to include in the environment build artifact. By default, Ymir will only add `.mo` and `.php` files to the build artifact to ensure a small build artifact. This lets you specify additional files or folders to add the build artifact besides the defaults.

### cache

**type**: `string`

The [cache][4] to use with your environment.

### cdn

**type**: `array | string`

This is the array of values to configure the environment's CloudFront distribution. If the `cdn` value is a string, it'll be used as the `caching` value.

#### cache_policy_assets

**type**: `string | false` **default**: `ymir-assets-policy`

The custom CloudFront cache policy used for assets and uploads. Setting this option to `false` removes the cache policy and reverts back to use the legacy CloudFront cache configuration.

#### cache_policy_content

**type**: `string | false`

The custom CloudFront cache policy used for the PHP application content. Setting this option to `false` removes the cache policy and reverts back to use the legacy CloudFront cache configuration.

::: warning Overrides CDN options
If you decide to use a custom CloudFront cache policy for your PHP application content, the following `cdn` options won't apply anymore: `cookies_whitelist`, `default_expiry` and `forwarded_headers`.
:::

#### caching

**type**: `string` **default**: `enabled`

This option controls the CloudFront distribution.

The possible values are:

 * `enabled` enables CloudFront distribution caching
 * `assets` only caches assets
 * `disabled` disables CloudFront distribution caching

::: warning Provisioning delay
Switching the `caching` value to `enabled` can cause your PHP application to not load certain assets while the CloudFront distribution updates. This process can take as long as 40 minutes.
:::

::: warning Full CloudFront caching disabled with REST API
If you have the `caching` set to `enabled` and the `gateway` option set to `rest`, the caching level will be downgraded to `assets` automatically. That's because REST APIs already have CloudFront page caching by default.
:::

#### cookies_whitelist

**type**: `array` **default**: `['comment_*', 'wp-postpass_*', 'wordpress_*', 'wp-settings-*']`

The list of cookies ignored by CloudFront and always forwarded to your PHP application. Supports `*` wildcard character.

::: tip Default cookies always added
The default cookies to whitelist will always be added to your project configuration during deployment. So if you need to customize the `cookies_whitelist` option, you can omit them.
:::

#### default_expiry

**type**: `int` **default**: `300`

The default time (in seconds) that CloudFront will keep something cached.

#### excluded_paths

**type**: `array` **default**: `['/wp-admin/*', '/wp-cron.php', '/wp-login.php']`

The list of paths ignored by CloudFront and always forwarded to your PHP application. Supports `*` wildcard character.

::: tip Default paths always added
The default paths to exclude will always be added to your project configuration during deployment. So if you need to customize the `excluded_paths` option, you can omit them.
:::

::: tip Works with uploads directory
By default, CloudFront caches files in the `/uploads` directory for 24h. But some plugins use the `/uploads` directory to store dynamic files since it's the only writeable directory on a server. You can add these directories to have CloudFront exclude them from the cache.
:::

::: tip Tailored to all project types
The project `type` will change default paths for other project types. So you don't need to edit this for `bedrock` or `radicle` projects.
:::

#### forwarded_headers

**type**: `array` **default**: `['origin']`

The list of headers that the CloudFront distribution will forward to your PHP application.

::: warning 10 header limit
CloudFront can only forward 10 headers to your PHP application.
:::

#### functions_assets

**type**: `array`

The list of CloudFront functions to associate with CloudFront origin used for assets and uploads. Each array entry must have a `name` and a `type`. The `name` is the name of the CloudFront function on AWS. Meanwhile, `type` can be either `viewer-request` or `viewer-response`.

#### functions_content

**type**: `array`

The list of CloudFront functions to associate with CloudFront origin used for the PHP application content. Each array entry must have a `name` and a `type`. The `name` is the name of the CloudFront function on AWS. Meanwhile, `type` can be either `viewer-request` or `viewer-response`.

#### invalidate_paths

**type**: `array`

The list of paths cleared from the CloudFront distribution cache during the project deployment. Supports `*` wildcard character.

#### image_processing_memory

**type**: `int` **default**: `256` **max**: `3008`

The amount of memory (in MB) used by the Lambda@Edge image processing function. Must be between 128 MB and 3,008 MB in 64 MB increments.

#### origin_shield

**type**: `bool | enabled | disabled` **default**: `disabled`

Flag whether the CloudFront distribution will be configured with [Origin Shield][15].

::: warning Additional cost
Origin Shield isn't free. There's an additional cost for every 10,000 request that hits an origin. You can read more on the [CloudFront pricing page][16].
:::

#### process_images

**type**: `bool | enabled | disabled` **default**: `disabled`

Flag whether the CloudFront distribution will be configured with the Lambda@Edge image processing function.

### concurrency

**type**: `int | false` **default**: `10`

The environment-level default concurrency value that is inherited by `website` and `queue` functions. This option controls the maximum number of Lambda functions that can exist at the same time for each function type. (AWS calls this [reserved concurrency][2].) Setting this option to `false` removes the limit and allows unrestricted scaling.

Individual function types can override this default by specifying their own `concurrency` value:

 * `website` functions inherit this value by default
 * `queue` functions inherit this value by default

::: tip Check out the guide
Looking for more information on how to configure your environment for high `concurrency` values? Check out this [guide][10].
:::

::: warning Overwhelming your database server
If your `concurrency` values are too high or disabled, your database server could get overwhelmed when spikes hit your PHP application. If this happens, you'll want to increase the capacity of your database server.
:::

### cron

**type**: `int | false` **default**: `1`

The interval (in minutes) that [WP-Cron][3] gets called by CloudWatch. Also controls the `DISABLE_WP_CRON` constant. If set to `false`, it disables the CloudWatch rule and renables the standard WP-Cron behaviour.

### database

**type**: `array | string`

This is the array of values to configure the environment's database. If the `database` value is a string, it'll be used as the `server` value.

#### name

**type**: `string` **default**: `ymir`

The name of the database used by the PHP application.

::: warning Overwrites <code>DB_NAME</code> environment variable
If you configured the `DB_NAME` environment variable, be aware that Ymir will overwrite it with the `name` value.
:::

#### server

**type**: `string`

The database server used by the PHP application. It can be the name of the database server if it's managed by Ymir or the host name of the database server otherwise.

::: warning Overwrites <code>DB_HOST</code> environment variable
If you configured the `DB_HOST` environment variable, be aware that Ymir will overwrite it with the `server` value.
:::

#### user

**type**: `string`

The user used by the PHP application to connect to the database server.

::: warning Overwrites <code>DB_USER</code> environment variable
If you configured the `DB_USER` environment variable, be aware that Ymir will overwrite it with the `user` value.
:::

### deployment

**type**: `string` **default**: `zip`

The deployment method to use for the project environment. Allowed values are `image` or `zip`.

::: danger Cannot rollback after changing deployment method
Once you deploy a project environment with a new deployment method, you won't be able to rollback to a deployment prior to the change in deployment method. Prior deployments will still be visible so you can see your deployment history. But trying to rollback to them will cause an error.
:::

::: tip Check out the guide
Looking for more information on how to deploy using container images? Check out this [guide][5].
:::

### domain

**type**: `array`

The list of domain names mapped to the environment. You cannot have more than 99 domain names mapped per environment.

::: warning Domain name requirement
All domains names must either be managed by a DNS zone or have an issued certificate in the project region.
:::

::: warning AWS quota limit
By default, you can only have 10 domain names per environment. This means that you can only have 9 domains mapped per environment. You can request a quota increase [here][11]. That said, the maximum limit of domain name per certificate is 100.
:::

### firewall

**type**: `array | string | bool`

This is the array of values to configure the environment's firewall. If the `firewall` value is a string, it'll be used as the `acl` value. If the `firewall` value is a boolean or `disabled` or `enabled`), it'll be used as the `managed_rules` value.

::: tip Check out the guide
Looking for more information on how to configure a firewall? Check out this [guide][9].
:::

::: warning Requires CloudFront caching
To protect your environment with a firewall, you must have CloudFront caching set to `enabled`.
:::

::: warning Additional cost
Enabling a firewall on your environment isn't free. There's a fixed cost per month as well as a charge of $0.60 per 1 million requests. You can read more on the [AWS WAF pricing page][7]. To save money, you should consider reusing your web ACL using the `acl` option.
:::

#### acl

**type**: `string`

The [ARN][17] of the custom web ACL used as the environment's firewall.

::: warning Overrides firewall options
If you decide to use a custom web ACL as your environment's firewall, Ymir will ignore all other `firewall` options.
:::

#### bots

**type**: `array | bool`

The list of bot categories that you want the firewall to protect against. Below is the list of available categories you may use. If you want to enable all bot categories, you may use `true` instead of listing all categories.

| Category                  | Description                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| CategoryAdvertising       | Bots used for advertising purposes                                                                            |
| CategoryArchiver          | Bots used for archiving purposes                                                                              |
| CategoryContentFetcher    | Bots fetching content on behalf of an end-user                                                                |
| CategoryHttpLibrary       | HTTP libraries often used by bots                                                                             |
| CategoryLinkChecker       | Bots that check for broken links                                                                              |
| CategoryMiscellaneous     | Miscellaneous bots                                                                                            |
| CategoryMonitoring        | Bots used for monitoring purposes                                                                             |
| CategoryScrapingFramework | Web scraping frameworks                                                                                       |
| CategorySecurity          | Security\-related bots                                                                                        |
| CategorySeo               | Bots used for search engine optimization                                                                      |
| CategorySocialMedia       | Bots used by social media platforms to provide content summaries (Verified social media bots are not blocked) |
| CategorySearchEngine      | Search engine bots (Verified search engines are not blocked)                                                  |
| SignalAutomatedBrowser    | Automated web browser                                                                                         |
| SignalKnownBotDataCenter  | Data centers typically used by bots                                                                           |
| SignalNonBrowserUserAgent | User-agent strings that don't seem to be from a web browser                                                   |

::: warning Additional cost
AWS WAF bot protection is an additional cost on top of your existing AWS WAF bill. It costs $10/month and $1.00 per 1 million requests. You can read more on the [AWS WAF pricing page][7].
:::

#### managed_rules

**type**: `bool | enabled | disabled`

Flag that determines whether the firewall will be configured with some default AWS managed firewall rules. Below, you'll find the list of managed rules that Ymir will configure if you set this to `true`. If set to `false`, no managed rules will get configured and you can configure some yourself. You can read more about them [here][8].

| Managed Rule                          | Description                                                                                                                                                                                                                |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AWSManagedRulesAmazonIpReputationList | Amazon IP reputation list rule group contains rules that are based on Amazon internal threat intelligence                                                                                                                  |
| AWSManagedRulesKnownBadInputsRuleSet  | Known bad inputs rule group contains rules to block request patterns that are known to be invalid and are associated with exploitation or discovery of vulnerabilities                                                     |
| AWSManagedRulesPHPRuleSet             | PHP application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to the use of the PHP programming language, including injection of unsafe PHP functions |
| AWSManagedRulesSQLiRuleSet            | SQL database rule group contains rules to block request patterns associated with exploitation of SQL databases, like SQL injection attacks                                                                                 |
| AWSManagedRulesWordPressRuleSet       | WordPress application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to WordPress sites                                                                |

#### rate_limit

**type**: `int`

Enables a rate limit rule that blocks requests from IPs that have made more than the configured amount of requests in a 5 minute time span. You may set a value between 100 and 20,000,000.

### gateway

**type**: `string | false` **default**: `http`

The gateway type used by the environment. Allowed values are `http` for HTTP APIs, `rest` for REST APIs or `false` to use [Lambda function URLs][12] instead of a gateway.

::: danger DNS changes when switching gateway types
Whenever you switch gateway types, the DNS records pointing to your environment will change. If Ymir manages the DNS zone used by your environment, it'll update your DNS records automatically. Otherwise, you will have to do it yourself. That said, even with a managed DNS zone, your environment will be briefly unavailable while the DNS changes propagate.
:::

::: warning CloudFront mandatory when using Lambda function URLs
If your environment doesn't use a gateway (set `gateway` option to `false`), you must enable CloudFront to do all caching for it. This means that any `caching` option other than `enabled` (this is the default value) will cause your project validation to fail.
:::

::: warning CloudFront page caching disabled with REST API
When using a REST API, it isn't possible to use CloudFront for page caching. That's because the REST API already caches response using CloudFront. If your CloudFront caching is set to `enabled`, it'll get downgraded to `assets` automatically.
:::

### layers

**type**: `array`

List of [Lambda layers][6] [ARN][17] to use for your Lambda function. You cannot use more than 5 layers per Lambda function.

::: warning Ignored with container image deployment
Ymir will ignore this configuration option if `deployment` is set to `image`.
:::

### logging

**type**: `bool | enabled | disabled`

Flag whether the environment's Lambda functions are allowed to write logs to CloudWatch.

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
If the configured `network` doesn't have a NAT gateway, a NAT gateway will be configured during deployment. A NAT gateway costs about $32/month billed by the hour and also has data transfer fees.
:::

::: warning Slow deployment
Whenever you connect or disconnect a `network`, the next deployment will take between 5 and 10 minutes to modify your Lambda functions configuration.
:::

### php

**type**: `string` **default**: `7.4`

The PHP version used by the environment. The supported versions are `7.2`, `7.3`, `7.4`, `8.0`, `8.1`, `8.2`, `8.3` and `8.4`.

::: warning Ignored with container image deployment
Ymir will ignore this configuration option if `deployment` is set to `image`. Instead, you should specifiy the PHP version to use in your project environment's `Dockerfile`.
:::

### tags

**type**: `array`

Associative array of up to 10 custom [tags][13] that will be added to your environment resources on top of the automatic tags added by Ymir.

::: danger Not available with personal subscription
Tagging environment resources isn't available with personal subscriptions. You must upgrade to an agency or enterprise subscription to unlock this feature. Please refer to the [pricing page][14] for details.
:::

### warmup

**type**: `int | false` **default**: `1`

The number of `website` functions that CloudWatch will keep warmed up. If set to `false`, it disables the warming up CloudWatch rule.

### website

**type**: `array`

Configuration for the Lambda function that handles HTTP traffic from your PHP application. This function is connected to the API gateway and processes all web requests.

#### concurrency

**type**: `int | false` **default**: inherits from environment-level `concurrency`

The maximum number of `website` Lambda functions that can exist at the same time. (AWS calls this [reserved concurrency][2].) By default, this inherits the value from the environment-level `concurrency` setting. Setting this option to `false` removes the limit and allows unrestricted scaling.

::: tip Check out the guide
Looking for more information on how to configure your environment for high `concurrency` values? Check out this [guide][10].
:::

::: warning Overwhelming your database server
If your `concurrency` value is too high or disabled, your database server could get overwhelmed when a traffic spike hits your application. If this happens, you'll want to increase the capacity of your database server.
:::

#### memory

**type**: `int` **default**: `512`

The amount of memory (in MB) used by the `website` Lambda function. Must be between 128 MB and 10,240 MB in 64 MB increments. The `website` function has lower memory needs by default because most memory-heavy tasks are handled by the `console` function.

::: warning Low memory termination
If a function goes over the memory limit during its execution, it gets terminated automatically. So it's important to configure enough memory for worst-case scenarios.
:::

::: warning Memory cost
Lambda charges based on configured memory. More memory means a higher Lambda bill. This is especially important for the `website` function since it handles all HTTP traffic.
:::

#### timeout

**type**: `int` **default**: `30`

The maximum amount of time (in seconds) that the `website` Lambda function can run before Lambda terminates it. The maximum allowed timeout depends on your gateway configuration:

 * **With API Gateway** (`gateway: http` or `gateway: rest`): Maximum 30 seconds
 * **Without API Gateway** (`gateway: false`): Maximum 900 seconds (15 minutes)

::: warning API gateway timeout
The 30 second timeout limit when using an API gateway is due to AWS API Gateway limits. This cannot be modified.

This can be a significant technical hurdle if your PHP application has long-running operations that take more than 30 seconds to complete. In that scenario, these operations should be offloaded to a WP-CLI command (using the `console` function) or an external service.
:::

### console

**type**: `array`

Configuration for the Lambda function used for running WP-CLI commands and other background tasks. This function is not connected to web traffic and is optimized for longer-running console commands and background tasks.

#### memory

**type**: `int` **default**: `1024`

The amount of memory (in MB) used by the `console` Lambda function. Must be between 128 MB and 10,240 MB in 64 MB increments. The `console` function has higher memory by default since it typically handles memory-intensive operations like WP-CLI commands.

::: warning Low memory termination
If a function goes over the memory limit during its execution, it gets terminated automatically. So it's important to configure enough memory for worst-case scenarios.
:::

::: tip Lower cost impact
Memory cost is less of a concern for the `console` function since it's not called frequently compared to the `website` function.
:::

#### timeout

**type**: `int` **default**: `60`

The maximum amount of time (in seconds) that the `console` Lambda function can run before Lambda terminates it. The `console` function can have a maximum timeout of 900 seconds (15 minutes), making it suitable for longer-running console commands and background tasks.

### queues

**type**: `array`

Configuration for SQS queue-based Lambda functions used for background job processing. Queues allow you to offload time-consuming tasks from your website function to dedicated background processors.

#### Queue Configuration Formats

The `queues` option supports multiple configuration formats for flexibility:

```yaml
# Boolean format - creates "default" queue
queues: true

# Single queue format - creates "default" queue with specific settings
queues:
  concurrency: 5
  memory: 2048
  type: standard

# Multiple named queues format
queues:
  email:
    concurrency: 10
    memory: 1024
    timeout: 300
    type: standard
  background-jobs:
    concurrency: 5
    memory: 2048
    timeout: 900
    type: fifo
```

#### concurrency

**type**: `int | false` **default**: inherits from environment-level `concurrency`

The maximum number of Lambda functions that can process this queue simultaneously. By default, this inherits the value from the environment-level `concurrency` setting. Setting this option to `false` removes the limit and allows unrestricted scaling.

::: tip Check out the guide
Looking for more information on how to configure your environment for high `concurrency` values? Check out this [guide][10].
:::

::: warning Queue processing capacity
Higher concurrency means more messages can be processed simultaneously, but also increases the load on your database and other resources.
:::

#### memory

**type**: `int` **default**: `1024`

The amount of memory (in MB) used by the queue Lambda function. Must be between 128 MB and 10,240 MB in 64 MB increments. Queue functions typically need more memory than website functions since they often handle batch processing or complex background tasks.

::: warning Low memory termination
If a function goes over the memory limit during its execution, it gets terminated automatically. So it's important to configure enough memory for your queue processing needs.
:::

#### timeout

**type**: `int` **default**: `600`

The maximum amount of time (in seconds) that the queue Lambda function can run before Lambda terminates it. Queue functions can have a maximum timeout of 900 seconds (15 minutes), making them suitable for longer-running background tasks.

::: tip Longer processing time
Queue functions have much longer timeout capabilities than website functions, making them ideal for tasks like image processing, data imports, or sending bulk emails.
:::

#### type

**type**: `string` **default**: `standard`

The type of SQS queue to use for this queue function. The possible values are:

 * `standard` - Standard SQS queue with high throughput and at-least-once delivery
 * `fifo` - First-In-First-Out queue with exactly-once processing and message ordering

::: tip FIFO vs Standard queues
FIFO queues guarantee message ordering and exactly-once delivery but have lower throughput. Standard queues offer higher throughput but may deliver messages more than once and in different orders.
:::

[1]: https://github.com/roots/bedrock
[2]: https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html#configuration-concurrency-reserved
[3]: https://developer.wordpress.org/plugins/cron/
[4]: ../team-resources/caches.md
[5]: ../guides/container-image-deployment.md
[6]: https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html
[7]: https://aws.amazon.com/waf/pricing/
[8]: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html
[9]: ../guides/firewall.md
[10]: ../guides/scaling.md
[11]: https://console.aws.amazon.com/servicequotas/home/services/acm/quotas/L-FB94F0B0
[12]: https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html
[13]: https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html
[14]: https://ymirapp.com/pricing
[15]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html
[16]: https://aws.amazon.com/cloudfront/pricing/
[17]: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html
[18]: https://roots.io/radicle/
