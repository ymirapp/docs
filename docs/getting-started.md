# Getting Started

## Requirements

Ymir has the following requirements:

* [PHP 7.2 or higher][1]
* [Composer][2]

While WordPress still supports older versions of PHP, Ymir is a platform for modern PHP. The composer requirement is only for installing the Ymir CLI tool. Your WordPress project doesn't need to use composer for Ymir to deploy it.

## Installing the Ymir CLI

Most of your interactions with Ymir will be through the [Ymir CLI][3] tool. You cannot deploy your WordPress projects without it. You can install it globally (preferred) or in each project that you want to deploy using Ymir.

```
$ composer global require ymirapp/cli
$ composer require ymirapp/cli
```

## Creating an account

Before you begin to use Ymir, you're going to need an account on the platform. If you're just working on someone else's team, you don't need to have a paid Ymir subscription. It's only required for creating projects and managing resources on your own teams.

Speaking of teams, whenever someone creates an account on Ymir, a **Personal** team also gets created. You cannot delete this team, but you can rename it. That's because teams are central to Ymir. All your projects and resources are tied to a team.

## Connecting a team to AWS

In order to create resources and deploy projects, a team must be connected to at least one AWS account. You can do this with the `provider:connect` command or through the [team management][4] page. But before doing that, you'll need an AWS account to connect to.

### Creating an AWS account

If you don't already have an AWS account, you'll want to create one first. You can do this from the account creation page [here][5].

::: warning AWS costs not included
Your Ymir subscription doesn't include your AWS costs. So please ensure that you enter billing information when creating your AWS account.
:::

### Adding an IAM user

Connecting to an AWS account requires that you have an IAM user with programmatic access. It is preferable to create one especially for Ymir. You can do this through the [IAM console][6] or with the AWS CLI.

![IAM Console](../images/iam-console.png)

Using the AWS dashboard, you want to navigate to the IAM console. There, you'll want to click on **Users** on the left sidebar and then click on **Add user**. This will bring up the user creation wizard.

![IAM Add user](../images/iam-add-user.png)

The first step of the wizard has you choose a username. Once that's done, you want to check **Programmatic access** checkbox in access type section below. Once you click **Next**, you'll be on the permissions screen.

![IAM User permissions](../images/iam-user-permissions.png)

There, you'll want to give administrator access to the user that you're creating. You do that by switching to the **Attach existing policies directly** tab. And from the list of policies that gets displayed, you select the **AdministratorAccess** policy.

![IAM User create](../images/iam-user-created.png)

After attaching the policy, you can skip to the end and create the user. You'll then be on the success screen where the the new user's credentials will be displayed. The **Access key ID** and **Secret access key** are the credentials you have to give to Ymir when connecting your AWS account.

[1]: https://php.net/releases/
[2]: https://getcomposer.org
[3]: https://github.com/ymirapp/cli
[4]: https://ymirapp.com/team/manage
[5]: https://portal.aws.amazon.com/billing/signup#/start
[6]: https://console.aws.amazon.com/iam/home
