# Project environments

## What is a project environment?

A project environment is a group of AWS resources used to run a WordPress site. The most important AWS resources that make up a project environment are:

 * An API gateway
 * A CloudFront distribution
 * Two Lambda functions (`console` and `website`)
 * Two S3 buckets (a public one for assets and a private one for deployment artifacts)

Each environment is self-contained and doesn't share resources with other environments. (With exception of team resources like database servers which are shared across a team.) Ymir creates some of these resources when it creates the environment. Meanwhile, it can only create some others, like the Lambda functions, when you deploy a project to the environment for the first time.

## Default environments

Whenever you initialize a project with the `init` command, Ymir will create two environments: `staging` and `production`. These two environments are just there as defaults. You're going to need a production environment and having a staging environment to preview changes for your client or for testing is always beneficial.

## Creating new environments

You can create a new environment using the `environment:create` command. You can either specify the name of the environment to create or you'll be prompted to give one. Once the command successful, you'll have a new node in the [`environments`][1] node of the `ymir.yml` configuration file. You can also deploy to your new environment straight away.

::: tip No limits
There is no limit to how many environments your project can have. And an environment won't cost you anything until you start deploying to it. So knock yourself out and create as many environments as you'd like!
:::

## Deleting an existing environment

Similarly to creating an environment, you can delete an enviroment using the `environment:delete` command. You can pass the name of the environment to delete or you'll can pick the environment from a list. he command will prompt you to ask if you want to delete all the environment's resources on AWS.

## Environment variables

Ymir relies on [environment variables][2] to pass configuration information to your environment's AWS Lambda functions. This is regardless of project type. So while a Bedrock project already uses environment variables, a regular WordPress project will also use them.

Converting a WordPress project to use environment variables happens during the [build process][3]. The process disables a lot of WordPress constants and injects a configuration file to load them using environment variables. But learning to use environment variables is an important aspect of Ymir and you should consider converting constants to environment variables whenever possible.

### Managing environment variables

You have multiple ways to update environment variables at your disposal. If you're looking to update a single environment variable, you can use the `environment:variables:change` command. If the environment variable doesn't exist, Ymir will create it instead.

If you're looking to modify a lot of environment variables at once, you can use the `environment:variables:download` command. The command will pull down all the environment variables for the given environment into a `.env` environment file. You can then use that `.env` file to edit them.

```
$ ymir environment:variable:pull environment-name
```

For example, the command above would create the `.env.environment-name` file. If you've never used a `.env` file, it's a simple key-value file that follows the `{KEY}={VALUE}` format. When you're done editing it, you can push your changes back to your project environment using the `environment:variables:upload` command.

::: warning Environment variables and deployments
Whenever you make environment variable changes, you must either `deploy` or `redeploy` your project again for them to take effect. Environment variables are also tied to a deployment. This means that rolling back an environment also rolls back its environment variables.
:::

### Reserved environment variables

You should also be aware that you can't add and edit any environment variable that you want. Some of them are reserved environment variables. These are environment variables that Ymir injects automatically or special AWS environment variables.

The reserved WordPress environment variables are:

 * `AUTH_KEY`
 * `SECURE_AUTH_KEY`
 * `LOGGED_IN_KEY`
 * `NONCE_KEY`
 * `AUTH_SALT`
 * `SECURE_AUTH_SALT`
 * `LOGGED_IN_SALT`
 * `NONCE_SALT`
 * `AUTOMATIC_UPDATER_DISABLED`
 * `DISABLE_WP_CRON`
 * `DISALLOW_FILE_EDIT`
 * `DISALLOW_FILE_MODS`
 * `DOMAIN_CURRENT_SITE`
 * `WP_HOME`
 * `WP_SITEURL`

The reserved Ymir environment variables are:

 * `YMIR_ASSETS_PATH`
 * `YMIR_ASSETS_URL`
 * `YMIR_CACHE_PREFIX`
 * `YMIR_CACHE_TABLE`
 * `YMIR_DISTRIBUTION_ID`
 * `YMIR_ENVIRONMENT`
 * `YMIR_PRIMARY_DOMAIN_NAME`
 * `YMIR_PROJECT_TYPE`
 * `YMIR_PUBLIC_STORE`
 * `YMIR_REDIS_ENDPOINT`
 * `YMIR_SECRETS_PATH`
 * `YMIR_UPLOAD_URL`

The reserved AWS environment variables are:

 * `_HANDLER`
 * `AWS_ACCESS_KEY_ID`
 * `AWS_EXECUTION_ENV`
 * `AWS_LAMBDA_FUNCTION_MEMORY_SIZE`
 * `AWS_LAMBDA_FUNCTION_NAME`
 * `AWS_LAMBDA_FUNCTION_VERSION`
 * `AWS_LAMBDA_LOG_GROUP_NAME`
 * `AWS_LAMBDA_LOG_STREAM_NAME`
 * `AWS_LAMBDA_RUNTIME_API`
 * `AWS_REGION`
 * `AWS_SECRET_ACCESS_KEY`
 * `AWS_SESSION_TOKEN`
 * `LAMBDA_RUNTIME_DIR`
 * `LAMBDA_TASK_ROOT`
 * `TZ`

## Secrets

Secrets are similar to environment variables with two notable differences. First, secrets are encrypted and only decrypted when your AWS Lambda function boots. This makes them ideal for storing sensitive information. For example, Ymir stores all the WordPress database constants (e.g. `DB_HOST`) as secrets.

Secrets are also useful for storing large environment variables. That's because AWS Lambda limits all your environments variables to a total size of 4kb. However, secrets don't share that limitation so you can use them to store these large environment variables.

### Managing secrets

The Ymir CLI has a few methods to help you manage your environment's secrets. First, you can view all the environment's secrets using the `environment:secret:list` command. For security reasons, you cannot view the value of a secret with this command. The only way to view secrets is to go to parameter store in the AWS system manager.

You can modify a secret value using the `environment:secret:change` command. If the secret didn't exist, Ymir will create it instead. And to delete a secret, you use the `environment:secret:delete` command.

::: warning Secrets and deployments
Whenever you make changes to your environment's secret, you must either `deploy` or `redeploy` your project again for them to take effect. Secret values are also tied to a deployment. This means that rolling back an environment also rolls back its secret values.
:::

## Environment domain names

### Vanity domain name

Whenever Ymir creates an environment, it'll give it a `ymirsites.com` vanity domain name. This allows you to access the environment even if you haven't assigned it a domain name yet. And even after assigning it a domain name, the environment will still be accessible using the vanity domain name.

::: tip Indexing disabled
To prevent issues with search engines, environments with only a vanity domain name will have the `blog_public` option set to `false` which will tell search engines not to index the WordPress site.
:::

::: warning Sending email
If you send emails with SES, you will not be able to send emails using the `ymirsites.com` vanity domain.
:::

### Additional domain names

While having a vanity domain name is handy, the odds are you'll also need to map your environment to at least one more domain name. You add these additional domain names by editing the `ymir.yml` configuration file and adding the [`domain`][4] configuration option to your environment node. Here's an example with `domain.co.uk` as the mapped domain:

```yml
id: 1
name: project-name
type: wordpress
environments:
  environment-name:
    domain: domain.co.uk
```

::: tip No www subdomain needed
If you only supply a registrable domain name (e.g. `domain.co.uk`), Ymir will automatically map the `www` subdomain to your environment. This also works in reverse. If you map your environment to `www.domain.co.uk`, Ymir will also map `domain.co.uk` to your environment.

**Note**: This only applies when mapping an environment to a *single* domain name.
:::

For the above domain mapping to work, Ymir must be able to assign a SSL certificate for the `domain.co.uk` domain name to your environment. If `domain.co.uk` is a domain in a DNS zone managed by Ymir, you don't need to do anything. Ymir will ensure that a certificate exists for your environment when you deploy it. Ymir will also take care of updating all the DNS records to point to your environment.

If Ymir doesn't manage the `domain.co.uk` domain, you can still map a domain to your environment. You'll need to request a certificate for the `domain.co.uk` using the `certificate:request` command before deploying your environment. Once the environment deployed, the Ymir CLI will display DNS records for your environment that you'll need to manually add to your DNS server.

::: tip Check out the guide
Looking for more detailed walkthrough on how to map a domain to your project environment, check out this [guide][5].
:::

[1]: ../reference/configuration.md#environments
[2]: https://en.wikipedia.org/wiki/Environment_variable
[3]: ./deploy.md#build-process
[4]: ../reference/configuration.md#domain
[5]: ../guides/domain-mapping.md
