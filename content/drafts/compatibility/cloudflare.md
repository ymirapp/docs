# How to set up Cloudflare in a Ymir project

::: tip Automatic configuration
You can have Ymir configure your project automatically for you by using the [`configure`][1] command.
:::

::: warning Check out the guide
Looking for more detailed walkthrough on how to map a domain to your project environment, check out this [guide][2].
:::

[Cloudflare][1] is a popular content delivery network that . Ymir makes it easy to support Beaver Builder in your serverless WordPress project. This guide will cover the changes that you need to make.

# Project configuration changes

Below is a sample environment configuration for Cloudflare. You need to replace the `environment` with the correct environment name. You'll also need to replace the `path/to` placeholders with the paths to your Cloudflare plugin.

```yml
environments:
  environment:
    build:
      include:
        - path/to/plugins/cloudflare/config.json
```

[1]: ../reference/ymir-cli.md#project-configure-configure
[2]: ../guides/cloudflare.md
[2]: https://www.cloudflare.com/
[3]: https://wordpress.org/plugins/cloudflare/
