# How to set up object caching in a Ymir project

[[toc]]

## When to use an object cache with Ymir?

By default, Ymir doesn't configure your WordPress site to use an [object cache][1]. This is an intentional decision since you'll often get excellent performance from your database server. So when does it make sense to add object caching to your Ymir-powered WordPress site?

### Database query heavy sites

If your WordPress site does a lot of database queries or has slow performing queries, you'll want to use an object cache. The object cache will allow you to cache these queries, which will improve the performance of your site. It'll also let you use a smaller database for longer.

::: tip Upgrade your WordPress indexes
If you have a WordPress site with a lot of database queries, you should first run [this plugin][2]. By making sure WordPress uses correct database indexes, you ensure that you're maximizing the power of your database server. Only if you still have database performance issues afterwards, should you consider adding object caching to your WordPress site.
:::

### High-traffic websites

With Ymir, your WordPress site can scale to handle thousands of visits in an instant. This can put a lot of strain on your database server and degrade your site's performance. Object caching along with page caching (which Ymir configures with CloudFront) is one way you can improve the performance of high-traffic sites.

### WooCommerce sites

WooCommerce has significant caching challenges that limit the use of page caching. This means that your database will get more queries than the average WordPress site. These queries also tend to be slower and require more work out of your database server.

That's why WooCommerce sites more than any other type of site rely on object caching to help with performance.

## Choosing an object cache plugin your WordPress site

At this time, Ymir only supports object caching using [Redis][3]. Redis is an extremely performant object caching option. Load tests have shown that the smallest Redis cluster available (`t3.micro`) can [handle over a thousand concurrent requests][4] with ease.

To use a Redis object cache, you'll need to attach a Redis cache cluster to your project. You can read more on Redis cache clusters and how to attach one to your project [here][5]. Once that's done, you'll be ready to install a Redis object cache plugin. 

There are multiple Redis object cache plugins. However, because Ymir uses the [Relay][6] PHP extension instead of the regular Redis PHP extension, you can only use one of the two Redis object caching plugins discussed below.

::: warning Deploy with object cache drop-in installed
Because a WordPress project deployed on AWS Lambda is read only, you must install the `object-cache.php` drop-in before deploying your project. The WordPress object cache plugin won't be able to create the drop-in if you try to do it once you deployed the project with Ymir.
:::

### Redis Object Cache (free)

[Redis Object Cache][7] is a free plugin with over 100,000 installations. It supports [`igbinary`][8] serialization.

To configure Redis Object Cache to work Ymir, add the following configuration to your WordPress configuration:

```php
define('WP_REDIS_CLIENT', 'relay');
define('WP_REDIS_HOST', getenv('YMIR_REDIS_ENDPOINT'));
define('WP_REDIS_PREFIX', getenv('YMIR_CACHE_PREFIX'));
define('WP_REDIS_SERIALIZER', 2);
```

### Object Cache Pro (paid)

[Object Cache Pro][9] is a paid highly optimized Redis object cache plugin with support for `igbinary` serialization and [`zstd`][10] compression as well as [`alloptions` race condition][11] prevention. It's the object cache used by some of the largest WordPress hosting companies.

To configure Object Cache Pro to work Ymir, add the following configuration to your WordPress configuration:

```php
define('WP_REDIS_CONFIG', [
    'client' => 'relay',
    'host' => getenv('YMIR_REDIS_ENDPOINT'),
    'port' => 6379,
    'database' => 0,
    'prefix' => getenv('YMIR_CACHE_PREFIX'),
    'timeout' => 1.0,
    'read_timeout' => 1.0,
    'async_flush' => true,
    'compression' => 'zstd',
    'serializer' => 'igbinary',
    'shared' => true,
    'split_alloptions' => true,
    'prefetch' => false,
    'debug' => false,
    'save_commands' => false,
]);
```

[1]: https://developer.wordpress.org/reference/classes/wp_object_cache/
[2]: https://wordpress.org/plugins/index-wp-mysql-for-speed/
[3]: https://redis.io
[4]: https://twitter.com/twigpress/status/1395774378080604162
[5]: ../team-resources/caches.html
[6]: https://relay.so/
[7]: https://wordpress.org/plugins/redis-cache
[8]: https://github.com/igbinary/igbinary
[9]: https://objectcache.pro/
[10]: https://github.com/facebook/zstd
[11]: https://core.trac.wordpress.org/ticket/31245
