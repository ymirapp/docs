# How to set up object caching in a Ymir project

[[toc]]

## When to use an object cache with Ymir?

By default, Ymir doesn't configure your WordPress site to use an [object cache][1]. This is an intentional decision since you'll often get excellent performance from your database server while DynamoDB adds additional costs. So when does it make sense to add object caching to your Ymir-powered WordPress site?

### Database query heavy sites

If your WordPress site does a lot of database queries or has slow performing queries, you'll want to use an object cache. The object cache will allow you to cache these queries which will improve the performance of your site. It'll also let you use a smaller database for longer.

### High-traffic websites

With Ymir, your WordPress site can scale to handle thousands of visits in an instant. This can put a lot of strain on your database server and degrade your site's performance. Object caching along with page caching (which Ymir configures with CloudFront) is one way you can improve the performance of high-traffic sites.

### WooCommerce sites

WooCommerce has significant caching challenges that limit the use of page caching. This means that your database will get more queries than the average WordPress site. These queries also tend to be slower and require more work out of your database server.

That's why WooCommerce sites more than any other type of site rely on object caching to help with performance.

## Object caching reduces your database costs

As you can see, the goal of object caching is to reduce the load on your database server. If you’re looking to scale your database server because it can’t handle your needs, look into adding an object cache first. You might also be able to downscale your database.

That’s because DynamoDB will cost less than a larger database server. DynamoDB can also scale indefinitely with no intervention on your part. You set it and forget it, which combines well with Lambda’s automatic scaling.

## Adding the object cache drop-in to your WordPress site

Activating object caching on your WordPress site only takes a few seconds. If you have WP-CLI installed locally, you can just use the `wp ymir install-object-cache` command. You might need to activate the Ymir plugin first. Otherwise, you can manually copy the `object-cache.php` file from the `/stubs` directory to the `/wp-content` directory.

::: warning Deployment needed
You cannot activate the Ymir object cache on Ymir directly. You have to install the object cache locally and then deploy your project using the `deploy` command.
:::

## Choosing an object cache types

The Ymir object cache has drivers for different persistent object caches.

### DynamoDB

DynamoDB offers a very low-cost object cache option since it doesn't require a network with a NAT gateway or a Redis cluster. Ymir will automatically create a DynamoDB table for all your projects. A DynamoDB table doesn't cost you anything until you turn on the DynamoDB object cache.

That said, [extensive testing showed that DynamoDB had a very mediocre performance as an object cache][2]. This makes it a poor choice for sites that require a high performance object cache. **In fact, at this time, you should only consider using the DynamoDB object cache to reduce the load on a database.**

### Redis

You can also attach a Redis [cache cluster][3] to your WordPress project. The Ymir plugin will automatically select it as your persistent object cache. Unlike DynamoDB, Redis is an extremely performant object caching option. Load tests have shown that a small `t3.micro` cluster can [handle over a thousand concurrent requests][4].

#### Other plugins

While Ymir comes with a Redis object cache, you're free to use any Redis object cache plugin you want. Below you'll find the configuration to use with popular Redis plugins.

##### Object Cache Pro

```php
define('WP_REDIS_CONFIG', [
    'host' => getenv('YMIR_REDIS_ENDPOINT'),
    'port' => 6379,
    'database' => 0,
    'prefix' => getenv('YMIR_CACHE_PREFIX'),
    'timeout' => 1.0,
    'read_timeout' => 1.0,
    'async_flush' => true,
    'compression' => 'zstd',
    'serializer' => 'igbinary',
    'split_alloptions' => true,
    'prefetch' => true,
    'debug' => false,
    'save_commands' => false,
]);
```

##### Redis Object Cache for WordPress

```php
define('WP_REDIS_HOST', getenv('YMIR_REDIS_ENDPOINT'));
define('WP_REDIS_PREFIX', getenv('YMIR_CACHE_PREFIX'));
```

::: warning Less performant
This plugin isn't ideal for sites that receive high amounts of traffic. You should use either the Ymir object cache or Object Cache Pro which support [`igbinary`][5] serialization and [`zstd`][6] compression as well as [`alloptions` race condition][7] prevention.
:::


[1]: https://developer.wordpress.org/reference/classes/wp_object_cache/
[2]: https://twitter.com/twigpress/status/1380264808486858752
[3]: ../team-resources/caches.html
[4]: https://twitter.com/twigpress/status/1395774378080604162
[5]: https://github.com/igbinary/igbinary
[6]: https://github.com/facebook/zstd
[7]: https://core.trac.wordpress.org/ticket/31245
