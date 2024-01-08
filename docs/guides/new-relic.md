# How to set up New Relic in a Ymir project

[[toc]]

## Why use New Relic?

Tracking the performance of your WordPress application is important whether you use serverless or not. With servers, it lets your server handle more traffic. With serverless, the faster an application runs, the less it costs since AWS Lambda charges by the millisecond.

One of the most popular performance monitoring products is [New Relic][1]. It has a suite of tools that lets you track the performance problems of different parts of a web application. It’s popular in the WordPress space because of its WordPress support and generous free tier.

## Performance impact

Before we look at how to set up New Relic with your Ymir project, it's important to discuss the performance impact of New Relic. Because serverless only runs your code on demand, New Relic cannot send application performance data in the background. This means that using New Relic (or any other [APM][2] product) can have a significant impact on the performance of your WordPress site.

For this reason, it's not a good idea to leave New Relic on all the time in a production environment. You should only use New Relic as a diagnostic tool and turn it off when you don't need it. This isn't ideal, but it's a current limitation with serverless and APM tools.

## Configuring your Ymir project to use New Relic

With this out of the way, we can look at how to configure your Ymir project to send application performance data to New Relic. First, you'll need to switch your project to use container image deployment. If you haven't done so already, you can refer to [this guide][3].

Once that's done, you'll to edit your project's `Dockerfile` and replace it with the content below:

```docker
FROM --platform=linux/x86_64 ymirapp/php-runtime:php-<PHP_VERSION>

# Download and install New Relic agent
RUN rpm -Uvh http://yum.newrelic.com/pub/newrelic/el5/x86_64/newrelic-repo-5-3.noarch.rpm && \
    LD_LIBRARY_PATH= yum install -y newrelic-php5 && \
    NR_INSTALL_USE_CP_NOT_LN=1 NR_INSTALL_SILENT=1 newrelic-install install

# Create New Relic INI file
RUN echo $'extension = "newrelic.so" \n\
    newrelic.logfile = "/dev/null" \n\
    newrelic.loglevel = "error" \n\
    newrelic.framework = "wordpress" \n\
    newrelic.appname = "<APP_NAME>" \n\ 
    newrelic.license = "<LICENSE>"' >> /opt/ymir/etc/php/conf.d/newrelic.ini

# Configure New Relic daemon
RUN mkdir -p /usr/local/etc/newrelic && \
    echo "loglevel=error" > /usr/local/etc/newrelic/newrelic.cfg && \
    echo "logfile=/dev/null" >> /usr/local/etc/newrelic/newrelic.cfg

COPY . /var/task

USER root

RUN chmod +x /var/task/entrypoint.sh

ENTRYPOINT ["/var/task/entrypoint.sh"]
```

::: warning x86 architecture only
Currently, you can only use New Relic with the default `x86_64` architecture.
:::

You'll then want to replace the following placeholder values:

 * `<PHP_VERSION>` should be the PHP version you want to use.
 * `<APP_NAME>` is the name of your Ymir project or WordPress site.
 * `<LICENSE>` is the New Relic license from the New Relic dashboard.

Finally, you'll want to create a file named `entrypoint.sh` at the root of your project with the code below:

```sh
#! /bin/sh

# Start Newrelic daemon
newrelic-daemon -c /usr/local/etc/newrelic/newrelic.cfg

# Start PHP
/opt/bootstrap

newrelic_background_job(false);
```

Once that's done, you can deploy your project with the [`ymir deploy`][4] command and you should start receiving performance data from New Relic!

[1]: https://newrelic.com/
[2]: https://en.wikipedia.org/wiki/Application_performance_management
[3]: ./container-image-deployment.md
[4]: ../reference/ymir-cli.md#project-deploy-deploy
