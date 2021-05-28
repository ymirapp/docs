# Caches

## Why do you need a cache?

To have a high performance WordPress site, you often need a persistent [object cache][1]. A persistent object cache stores MySQL query results in a high performance cache. (Usually Memcached or Redis.) Whenever WordPress needs to perform a MySQL query, it'll check the high performance cache before performing the query.

Ymir lets you create and manage Redis cache cluster. You can then use that cluster to power the object cache of multiple WordPress site. For example, a small `t3.micro` cluster can handle hundreds of concurrent requests.

## Managing cache clusters

You can create a cache cluster using the `cache:create` command. The command will prompt you to fill in some details about the cache cluster that you're creating.

::: warning Needs a NAT gateway
Ymir will create a NAT gateway if you create a cache and the network used by the cache doesn't have a NAT gateway already. A NAT gateway costs ~$32/month plus data transfer fees.
:::

![Create a cache](../../images/create-cache-cli.png)

If you don't need a cache cluster anymore, you can delete it with the `cache:delete` command.

## Using a cache cluster in a project

Since you can use a cache cluster on multiple projects, you need to configure your project to use one. To do that, you need to update your `ymir.yml` configuration file with the `cache` option. Ymir will then inject the necessary environment variables so that your WordPress site can use the cache cluster.

```yml
id: 1
name: project-name
type: wordpress
environments:
  staging:
    cache: my-cache-cluster
  production:
    cache: my-cache-cluster
```

You'll also need to install an object cache in your WordPress project. You can learn how to do that with [this guide][2].

[1]: https://developer.wordpress.org/reference/classes/wp_object_cache/
[2]: ../guides/object-cache.md
