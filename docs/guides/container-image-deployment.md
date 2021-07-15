# How to deploy a project using a container image

[[toc]]

## Why deploy with a container image?

By default, AWS Lambda only allows your project to be 250MB uncompressed. (This excludes uploads which aren't stored on AWS Lambda.) For larger sites, this limit can prevent your project from being deployed with Ymir. However, if you deploy using a container image, that project limit goes up to 10GB.

Another reason to use a container image is so you can install other PHP extension and libraries which aren't available with the default Ymir runtime.

## Requirements

Container image deployment uses [Docker][1] to build and push your container image to your AWS infrastructure.

## Creating a new project with container image deployment

Creating a new project with container image deployment is a breeze. You simply have to create a project normally using the `ymir init` command. Towards the end of the project creation process, you'll get asked if you want to use container image deployment. That's it!

## Switching an existing environment to container image deployment

::: danger Cannot rollback after switching
Once you switch to using container image deployment, you won't be able to rollback to a deployment that used zip archive deployment. Prior deployments will still be visible so you can see your deployment history. But trying to rollback to them will cause an error.
:::

First, you'll need to create a `Dockerfile` to use for your project. You can create one using the [`docker:create`][2] command.

Next, you'll need to edit your `ymir.yml` configuration file. In it, you'll want to add the [`deployment`][3] option and set it to `image`. Below is an example of an `ymir.yml` file where the `staging` environment is configured to use container image deployment.

```yml
id: 42
name: container-project
type: wordpress
environments:
  production: ~
  staging:
    cdn:
      caching: assets
    cron: false
    deployment: image
    warmup: false
```

[1]: https://en.wikipedia.org/wiki/Docker_(software)
[2]: ../reference/ymir-cli.html#docker-create
[3]: ../reference/configuration.md#deployment
