# How to set up Oxygen in a Ymir project

::: tip Automatic configuration
You can have Ymir configure your project automatically for you by using the [`configure`][2] command.
:::

[Oxygen][1] is a popular WordPress page builder that you can use to build beautiful WordPress sites. Ymir makes it easy to support Oxygen in your serverless WordPress project. This guide will cover the changes that you need to make.

# Project configuration changes

Below is a sample environment configuration for Oxygen. You need to replace the `environment` with the correct environment name. You'll also need to replace the `path/to` placeholders with the paths to your Oxygen plugin.

```yml
environments:
  environment:
    build:
      include:
        - path/to/plugins/oxygen
    cdn:
      excluded_paths:
        - /uploads/oxygen/*
```

[1]: https://oxygenbuilder.com/
[2]: ../reference/ymir-cli.md#project-configure-configure
