# How to configure your environment for Lambda scaling

[[toc]]

## When do you need to worry about Lambda scaling?

First, not every situation requires that you worry about Lambda scaling. That's because Ymir uses CloudFront to do page caching. This is the default setting for production environments unless you changed the [`caching`][1] option.

CloudFront can handle hundreds of thousands of request per minute. These requests never reach Lambda which means you don’t need to worry about Lambda scaling. That's why, if your WordPress site only needs page caching, you should be fine with using CloudFront with Ymir's default settings.

That said, we can't solve every scaling situation with page caching. For example, [WooCommerce][2] has carts you can’t cache using page caching. This means that all requests to a cart or anyone with a non-empty cart won't have their requests cached and they'll hit Lambda. So to handle thousands of customers shopping on a WooCommerce site, you need your environment to scale to thousands of concurrent Lambdas.

It's in a situation such as this that you have to worry about Lambda scaling.

## Choosing the right region

The first thing that can affect your Lambda scaling is the region that your project is in. Lambda has a burst concurrency quota that determines how many Lambdas can get created instantly. Once the burst quota reached, your capacity will grow at 500 per minute. (Please refer to the [AWS documentation][3] for more detail.)

Most regions have Lambda burst concurrency quota of 500. This means they can scale from 0 to 500 concurrent Lambdas instantly. Three regions have a quota of 1,000. And three other regions have a burst concurrency quota of 3,000. These are the regions you should use for a project that require significant Lambda scaling.

The three regions with a burst concurrency quota of 3,000 are:

 * `eu-west-1` —  EU (Ireland)
 * `us-east-1` —  US East (N. Virginia)
 * `us-west-2` —  US West (Oregon)

 If you already created a project in another region, consider creating a new project and moving the existing project to one of those three regions.

## Changes to your AWS account

Next, you'll need to make some changes to your AWS account to support a high level of Lambda scaling. It's important to note that **these changes need to be done in each region where you want to use a high level of Lambda scaling**. So, if you have one project in `eu-west-1` and another in `us-east-1`, you need to apply these changes to both regions.

### Raise your Lambda concurrency quota

Even if you create a project in one of the three regions with a burst concurrency quota of 3000, AWS still limits you to 1000 concurrent Lambda functions by default. If you know you’ll need more than that, you need to request a quota increase which you can do [here][4].

![Concurrent executions quota request page](../../images/concurrent-executions-quota.png)

The request might take a few days, and AWS support might ask you a few questions. If you're not sure how to answer any of them, you can [contact Ymir support][5] and we'll help you.

### Increase your parameter store throughput

Another change that you'll need to do is increase the throughput of the parameter store. The parameter store is where Ymir stores the [secrets][6] used by your project. These secrets get loaded into your Lambda function during the cold start.

Whenever Lambda spins up hundreds of functions in a small amount of time (less than a minute), the parameter store will start throwing rate limit errors. These will slow down the rate that Lambda can spin up new functions. Increasing the throughput will significantly increase how fast Lambda can spin up new functions.

![AWS System Manager settings page](../../images/ssm-parameter-throughput.png)

To increase the throughput limit, you want to go to the parameter store [settings page][7]. You want to click on **Set limit**. This will bring up a modal where you have to agree that turning on the setting will incur additional charges.

## Set the concurrency limit in your project configuration

Once your AWS account configured, you'll want to update your `ymir.yml` configuration file with your desired concurrency limit. By default, Ymir sets the limit to 10 concurrent Lambdas.

To change it, you need to change the [`concurrency`][8] option. You can set it to `false` to disable the concurrency limit. That said, this isn't recommended. You should instead set it to a value even if it's quite large.

## Configuring your database server

::: tip Aurora Serverless
If you'd rather not have to have to think about database server connections or database server scaling, you should consider using an [Aurora serverless][10] database cluster. You can create one easily with the [`database:server:create`][11] command.
:::

The reason you don't want to disable the concurrency limit is because of your database server. A database server can only have a certain number of active database connection if you reach that limit, you will start seeing database connection errors. To prevent this, you want to keep your `concurrency` value below the number of maximum connections allowed by your database server.

The number of database connections that a database server can have depends on the type. Ymir supports a lot of different database types. Below is a list of all `t3` instance types with their maximum number of connections.

|Type|Maximum connections|
---|:---:
db.t3.micro|85
db.t3.small|170
db.t3.medium|341
db.t3.large|682
db.t3.xlarge|1365
db.t3.2xlarge|2730

`t3` databases are ideal for most situations. But if you'd like to use another category of database servers, you can refer to [this article][9] to see all maximum connection numbers for all database server types.

[1]: ../reference/configuration.md#caching
[2]: https://woocommerce.com/
[3]: https://docs.aws.amazon.com/lambda/latest/dg/invocation-scaling.html
[4]: https://console.aws.amazon.com/servicequotas/home/services/lambda/quotas/L-B99A9384
[5]: mailto:support@ymirapp.com
[6]: ../projects/environments.md#secrets
[7]: https://console.aws.amazon.com/systems-manager/parameters/?tab=Settings
[8]: ../reference/configuration.md#concurrency
[9]: https://sysadminxpert.com/aws-rds-max-connections-limit/
[10]: https://aws.amazon.com/rds/aurora/serverless/
[11]: ../reference/ymir-cli.html#database-server-create
