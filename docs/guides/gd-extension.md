# How to install the GD PHP extension

[[toc]]

## Why use the GD PHP extension?

By default, the Ymir runtime comes with the [Imagick PHP extension][1] for image processing. In contrast to the [GD extension][2], the Imagick extension has more features and capabilities. This is why Ymir uses it as its image processing extension.

However, there are some plugins that only support the GD extension. For that reason, you'll need to install the GD extension in your project.

## Requirements

To install the GD extension in your Ymir project, you'll need to:

 * Use [container image deployment][3]
 * Use `x86_64` as your [`architecture`][4]

## Configuring your Ymir project to install the GD extension

Once your project satisfies the above requirements, you'll need to replace your project's `Dockerfile` with the one below. Please note that `<PHP_VERSION>` is a placeholder. You should replace it with your desired PHP version. (e.g. `81` for PHP 8.1)

```docker
FROM --platform=linux/x86_64 ymirapp/php-runtime:php-<PHP_VERSION>

ENTRYPOINT []

CMD ["/bin/sh", "-c", "/opt/bootstrap"]

RUN LD_LIBRARY_PATH= yum install -y https://archives.fedoraproject.org/pub/archive/epel/7/x86_64/Packages/e/epel-release-7-14.noarch.rpm
RUN LD_LIBRARY_PATH= yum install -y https://rpms.remirepo.net/enterprise/remi-release-7.rpm
RUN LD_LIBRARY_PATH= yum install -y yum-utils
RUN LD_LIBRARY_PATH= yum-config-manager --enable remi-php<PHP_VERSION>
RUN LD_LIBRARY_PATH= yum install -y php<PHP_VERSION>-php-gd

RUN echo "extension=/opt/remi/php<PHP_VERSION>/root/usr/lib64/php/modules/gd.so" >> /opt/ymir/etc/php/conf.d/php.ini

COPY runtime/src /opt/src

COPY . /var/task
```

[1]: https://www.php.net/manual/en/book.imagick.php
[2]: https://www.php.net/manual/en/book.image.php
[3]: ./container-image-deployment.md
[4]: ../reference/configuration.md#architecture