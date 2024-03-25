# How to use a logging service instead of CloudWatch

[[toc]]

## Why use a logging service?

[CloudWatch][1] is the default logging service for AWS. However, it is expensive and not that feature rich. This makes it not that useful to parse errors or other issues in your deployed WordPress site. 

There are other logging services that are both cheaper and offer a much wider set of features.

## Disable CloudWatch logging

Before we begin, you'll probably want to disable CloudWatch logging. This will prevent you from being charged for storing logs in both CloudWatch and the logging service you decide to use. To disable CloudWatch logging, you need to set the [`logging`][2] option to `disabled` as shown below.

```yml
id: 42
name: logging-project
type: wordpress
environments:
  production: ~
  staging:
    cdn:
      caching: assets
    cron: false
    logging: disabled
    warmup: false
```

## Logging services

Below you'll find how to configure different logging services with Ymir.

### Axiom

[Axiom][3] is powerful logging service with a good free tier. To use Axiom, you must install the Axiom Lambda extension into your project.

#### Requirements

To install the Axiom Lambda extension in your Ymir project, you'll need to:

 * Use [container image deployment][4]

#### Configuring your project to use Axiom

To begin, you'll need to go to [Axiom Lambda extension GitHub repository][5]. There, you'll want to find the ARN for the Lambda extension in your project region. As an example, here is the ARN for version 5 of the extension for the `arm64` [architecture][6] in the `us-east-1` region: `arn:aws:lambda:us-east-1:694952825951:layer:axiom-extension-arm64:5`

Once you have the ARN of the extension that you want to install, you'll need to download it using the [AWS CLI][7] using the command below. Please note that `<ARN>` is a placeholder. You should replace the placeholder with the ARN that you found earlier.

```sh
$ aws lambda get-layer-version-by-arn --arn <ARN> --query 'Content.Location' --output text
```

You'll then want to create an `axiom` directory at the root of your project. In it, you'll want to copy the extension file from the zipped archive that you downloaded with the AWS CLI. 

Once that's done, you'll want to edit your project's `Dockerfile` and add the following line:

```Dockerfile
COPY ./axiom /opt/
```

The last step will be to add the `AXIOM_DATASET` and `AXIOM_TOKEN` environment variables either as [regular environment variables][8] or as [secrets][9].

Once this step done, you should deploy your project and Axiom should be receiving your WordPress logs instead of CloudWatch.

[1]: https://aws.amazon.com/cloudwatch/
[2]: ../reference/configuration.md#logging
[3]: https://axiom.co/
[4]: ./container-image-deployment.md
[5]: https://github.com/axiomhq/axiom-lambda-extension
[6]: ./reference/configuration.md#architecture
[7]: https://aws.amazon.com/cli/
[8]: ../projects/environments.md#environment-variables
[9]: ../projects/environments.md#secrets
