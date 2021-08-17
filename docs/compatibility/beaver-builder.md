# How to set up Beaver Builder in a Ymir project

[Beaver Builder][1] is a popular WordPress page builder that you can use to build beautiful WordPress sites. Ymir makes it easy to support Beaver Builder in your serverless WordPress project. This guide will cover the changes that you need to make.

# Project configuration changes

Below is a sample environment configuration for Beaver Builder. You need to replace the `environment` with the correct environment name. You'll also need to replace the `path/to` placeholders with the paths to your Beaver builder plugin and theme.

```yml
environments:
  environment:
    build:
      include:
        - path/to/plugins/bb-plugin/fonts
        - path/to/plugins/bb-plugin/img
        - path/to/plugins/bb-plugin/js
        - path/to/plugins/bb-plugin/json
        - path/to/themes/bb-theme/css
        - path/to/themes/bb-theme/json
        - path/to/themes/bb-theme/less
    cdn:
      excluded_paths:
        - /uploads/bb-theme/*
        - /uploads/bb-plugin/*
```

[1]: https://www.wpbeaverbuilder.com/
