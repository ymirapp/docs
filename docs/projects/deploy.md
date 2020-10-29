# Deploying a project

## Starting the deployment process

To begin a new deployment to a project environment, you use the `deploy` command.

```
$ ymir deploy
$ ymir deploy environment-name
```

By default, the `deploy` command will deploy your project to the `staging` environment. If you want to deploy it to another environment, you need to specify it as an argument as shown above.

## Build process

Deploying a project to an environment starts with the build process. This is where Ymir CLI creates a build artifact for AWS Lambda and also separates your project assets to upload them to S3 if needed. The whole process happens in the `.ymir` temporary directory where the Ymir CLI will create a copy of your project. You can also test the build process using the `build` command.

Ymir also lets you add your own build steps to the process. You do that by adding them to the `build` option of your project's `ymir.yml` configuration file. Below is an example where the Ymir CLI would run `yarn build` during the build process.

```yml
id: 1
name: project-name
type: wordpress
environments:
  environment-name:
    build:
      - 'yarn build'
```

::: warning Build runs locally
The build process runs on the machine that executed the `deploy` or `build` command. All the required tools to preform your build steps must be available for the build to work.
:::

## Redeploying a project

You can redeploy your project to an environment using the `redeploy` command. This will deploy the environment's last **successful** deployment. This is useful when you've made changes to [environment variables][1] or [secrets][2].

```
$ ymir redeploy
$ ymir redeploy environment-name
```

## Rolling back a deployment

It's also possible to rollback your project environment to a previous a deployment. You do this using the `rollback` command.

```
$ ymir rollback
$ ymir rollback environment-name
```

::: warning Environment variables and secrets
Rolling back an environment also rolls back its environment variables and secrets.
:::


If you want to select the deployment to rollback to, you want to use the `--select` option with the `rollback` command. If you don't use the `--select` option, the `rollback` command will rollback the environment to the last successful deployment.

```
$ ymir rollback --select
$ ymir rollback environment-name --select
```

[1]: ./environments.md#environment-variables
[2]: ./environments.md#secrets
