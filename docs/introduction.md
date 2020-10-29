# Introduction

## What is Ymir?

Ymir is a WordPress serverless DevOps platform for AWS. While the description sounds like something you'd hear playing [buzzword bingo][1], that's actually a really good description of what Ymir does for you! So let's expand on all these terms and explain how they tie to Ymir.

First, Ymir is a [DevOps][2] platform because it handles a lot of the tasks that fall under the DevOps umbrella. With Ymir, you get platform that:

 * Manages all your AWS infrastructure
 * Creates and configures environments with dedicated resources for all your projects
 * Packages and deploys your WordPress projects to these environments
 * Monitors the performance of your WordPress sites and AWS infrastructure
 * Ensures your WordPress site can scale to handle any traffic sent at it

This last point is where the [serverless][3] element of Ymir comes into play. While serverless makes it sound like there are no servers, that isn't the case. There are still servers that have to execute your WordPress code. It's just that there are no more servers to _manage_.

With serverless, you upload your code to AWS Lambda and that's it! There are no more system updates to worry about. You don't have to worry about your server going down when you get thousands of requests hitting your server. AWS Lambda will scale on demand to handle any traffic situation without you having to do anything.

## What does Ymir do for you?

Going more into the specifics, here are some of the things that Ymir will handle for you:

 * Auto-scaling WordPress infrastructure that handles any amount of traffic
 * Database server management including backups
 * Zero-downtime deployments and rollbacks
 * All your assets stored on S3 and served using CloudFront CDN
 * Unlimited projects environments with their own unique URLs
 * DNS management including custom domain support
 * SSL certificate management
 * Emails sent using SES for better deliverability

## Why is all this important?

As a WordPress professional, you know how important hosting is. It's a critical part of your client's experience with your service. They'll call you if their site is slow, down or even hacked. They'll question the quality of your work because of it.

You want to offer the best hosting experience to your client, but that comes with a price tag. You either have to pay a professional to manage servers for you or pay a premium hosting company. And it can be hard for your clients to justify the price.

With Ymir, you get to run your WordPress infrastructure on AWS. No one knows their stuff better than the people who work there. This lets you not have to worry about server security, performance, updates, etc.

Instead, you can focus on building the best possible WordPress solution for your clients.

[1]: https://www.urbandictionary.com/define.php?term=buzzword%20bingo
[2]: https://en.wikipedia.org/wiki/DevOps
[3]: https://en.wikipedia.org/wiki/Serverless_computing
