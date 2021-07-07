# How to set up WooCommerce in a Ymir project

[WooCommerce][1] is a popular open source e-commerce platform for WordPress. Ymir makes it easy to support WooCommerce in your serverless WordPress project. This guide will cover the changes that you need to make.

# Project configuration changes

Below is a sample environment configuration for WooCommerce. You need to replace the `environment` with the correct environment name.

```yml
environments:
  environment:
    cdn:
      cookies_whitelist:
        - woocommerce_cart_hash
        - woocommerce_items_in_cart
        - woocommerce_recently_viewed
        - wp_woocommerce_session
      excluded_paths:
        - /addons
        - /cart
        - /checkout
        - /my-account
```

[1]: https://woocommerce.com/
