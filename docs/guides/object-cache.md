# Setting up the Ymir object cache

[[toc]]

## When to use an object cache with Ymir?

By default, Ymir doesn't configure your WordPress site to use an object cache. This is an intentional decision since you'll often get excellent performance from your database server while DynamoDB adds additional costs. So when does it make sense to add object caching to your Ymir-powered WordPress site?

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
