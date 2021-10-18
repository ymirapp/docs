# How to set up WooCommerce in a Ymir project

::: tip Automatic configuration
You can have Ymir configure your project automatically for you by using the [`configure`][2] command.
:::

[WooCommerce][1] is a popular open source e-commerce platform for WordPress. Ymir makes it easy to support WooCommerce in your serverless WordPress project. This guide will cover the changes that you need to make.

# Project configuration changes

Below is a sample environment configuration for WooCommerce. You need to replace the `environment` with the correct environment name. If you're using container image deployment, you can omit the `build` section.

```yml
environments:
  environment:
    build:
      include:
        - path/to/plugins/woocommerce
    cdn:
      cookies_whitelist:
        - woocommerce_cart_hash
        - woocommerce_items_in_cart
        - woocommerce_recently_viewed
        - wp_woocommerce_session_*
      excluded_paths:
        - /addons
        - /cart
        - /checkout
        - /my-account
```

[1]: https://woocommerce.com/
[2]: ../reference/ymir-cli.md#project-configure-configure
