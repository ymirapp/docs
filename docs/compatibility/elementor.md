# How to set up Elementor in a Ymir project

::: tip Automatic configuration
You can have Ymir configure your project automatically for you by using the [`configure`][2] command.
:::

[Elementor][1] is a popular free WordPress page builder that you can use to build beautiful WordPress sites. Ymir makes it easy to support Elementor in your serverless WordPress project. This guide will cover the changes that you need to make.

# Project configuration changes

Below is a sample environment configuration for Elementor. You need to replace the `environment` with the correct environment name.

```yml
environments:
  environment:
    cdn:
      excluded_paths:
        - /uploads/elementor/*
```

[1]: https://elementor.com/
[2]: ../reference/ymir-cli.md#project-configure-configure
