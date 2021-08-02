# How to configure a firewall for your project environment

[[toc]]

## Why use a firewall?

AWS comes with come some default [denial-of-service attack][1] (DoS) protection through [AWS Shield Standard][2]. That said, to protect yourself against more sophisticated attacks or just having peace of mind, you can have Ymir configure a firewall for you. This firewall uses [AWS WAF][3] to protect your Ymir-managed project environment.

## Cost

Enabling a firewall on your project environment will incur some additional costs. There's a fixed cost per month as well as a charge of $0.60 per 1 million requests. If you enable bot protection, this costs an additional $10/month as well as $1.00 per 1 million requests.

You can read more about costs on the [AWS WAF pricing page][6].

## Caching required

To use a firewall, your project environment must have the [`caching`][4] option set to `enabled`. If it isn't set to `enabled`, your firewall will get configured (and you'll pay for it), but it won't protect your project environment.

## Basic environment firewall configuration

To have Ymir configure a basic firewall for your project environment, you need to have a project configuration similar to the one below.

```yml
id: 42
name: firewall-project
type: wordpress
environments:
  production: ~
  staging:
    cdn:
      caching: enabled
    firewall: true
```

The `caching` option is set to `enabled` and `firewall` is set to `true`. This will configure the firewall for the `staging` environment with some basic managed rules. These rules are described below, but you can also read about them [here][5].

| Managed Rule | Description |
| --- | --- |
| AWSManagedRulesAmazonIpReputationList | Amazon IP reputation list rule group contains rules that are based on Amazon internal threat intelligence |
| AWSManagedRulesKnownBadInputsRuleSet | Known bad inputs rule group contains rules to block request patterns that are known to be invalid and are associated with exploitation or discovery of vulnerabilities |
| AWSManagedRulesPHPRuleSet | PHP application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to the use of the PHP programming language, including injection of unsafe PHP functions |
| AWSManagedRulesSQLiRuleSet | SQL database rule group contains rules to block request patterns associated with exploitation of SQL databases, like SQL injection attacks |
| AWSManagedRulesWordPressRuleSet | WordPress application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to WordPress sites |

## Advanced firewall configuration

Ymir also offers advanced firewall configuration options if you want to protect yourself against more specific threats.

### Bot protection

With the `bots` option, you can turn on bot protection on your firewall. This comes at an additional cost (as discussed earlier) on top of your regular firwall cost. Here's an example configuration where we protect the staging environment against web scrapping frameworks.

```yml
id: 42
name: firewall-project
type: wordpress
environments:
  production: ~
  staging:
    cdn:
      caching: enabled
    firewall:
      bots:
        - CategoryScrapingFramework
```

Below is a list of all bot categories you can block using bot protection. If you want to turn on all bot categories, you can set `bots` to `true` instead of listing them all.

| Category | Description |
| --- | --- |
| CategoryAdvertising | Bots used for advertising purposes |
| CategoryArchiver | Bots used for archiving purposes |
| CategoryContentFetcher | Bots fetching content on behalf of an end-user |
| CategoryHttpLibrary | HTTP libraries often used by bots |
| CategoryLinkChecker | Bots that check for broken links |
| CategoryMiscellaneous | Miscellaneous bots |
| CategoryMonitoring | Bots used for monitoring purposes |
| CategoryScrapingFramework | Web scraping frameworks |
| CategorySecurity | Security\-related bots |
| CategorySeo | Bots used for search engine optimization |
| CategorySocialMedia | Bots used by social media platforms to provide content summaries (Verified social media bots are not blocked) |
| CategorySearchEngine | Search engine bots (Verified search engines are not blocked) |
| SignalAutomatedBrowser | Automated web browser |
| SignalKnownBotDataCenter | Data centers typically used by bots |
| SignalNonBrowserUserAgent | User-agent strings that don't seem to be from a web browser |

### Rate limit

Ymir can also configure a rate limit rule for your firewall. This is a useful tool to prevent serious [application layer][7] (layer 7) DDoS attacks. For example, here's a configuration enabling a rate limit rule of 100 requests per IP in a 5 minute time span.

```yml
id: 42
name: firewall-project
type: wordpress
environments:
  production: ~
  staging:
    cdn:
      caching: enabled
    firewall:
      rate_limit: 100
```

The range of allowed values for `rate_limit` is between 100 and 20,000,000. It's always for 5 minute intervals. For most use cases, you should set `rate_limit` to `100` since 100 requests in 5 minutes time span is a lot already.

[1]: https://en.wikipedia.org/wiki/Denial-of-service_attack
[2]: https://aws.amazon.com/shield/features/
[3]: https://aws.amazon.com/waf/
[4]: ../reference/configuration.md#caching
[5]: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html
[6]: https://aws.amazon.com/waf/pricing/
[7]: https://en.wikipedia.org/wiki/Application_layer
