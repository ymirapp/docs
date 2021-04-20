# Networks

## What are networks?

Some resources such as database servers cannot exist without a network. Whenever you create one such resource on a region without a network, Ymir will ask you to create one. For most, that will be the extent of their interaction with networks.

### Subnets

Ymir creates your network with a public and private [subnetwork][1] (also called subnet). A public subnet has access to the internet by default while a private one doesn't. If you want your private subnet to have access to the internet, you need to add a NAT gateway to the private subnet. This NAT gateway costs ~$32/month plus data transfer fees.

Because NAT gateways are so expensive, Ymir will try to use your public subnet by default. If you configure your project environment to use a private subnet resource such as a private database, Ymir will automatically add a NAT gateway to your network for you if there isn't one.

::: warning Not removed automatically
While Ymir will add a NAT gateway automatically, it won't remove it if you stop using a private subnet resource. You'll need to remove it using the `network:nat:remove` command. This is to prevent issues if you add custom private subnet resources that aren't managed by Ymir.
:::

## Managing networks

There are scenarios where you might want to create additional networks within the same region. You can use the `network:create` command to do so. You can also delete existing networks using the `network:delete` command.

### NAT gateway management

If you want to add custom private subnet resources such as ElasticSearch, you can add a NAT gateway to your network using the `network:nat:add` command. To delete that NAT gateway, you can just use the `network:nat:delete` command.

## Connect a network to an environment

For similar reasons, you might want to connect a network to your project environment so that you can access private resources. To do so, add the `network` option to your environment configuration in the `ymir.yml` file. This will tell Ymir to connect that network to your environment during deployment.

```yml
id: 1
name: project-name
type: wordpress
environments:
  environment-name:
    network: network-name
```

::: warning Can create a NAT gateway
If the configured `network` doesn't have a NAT gateway, a NAT gateway will be configured during deployment.
:::

[1]: https://en.wikipedia.org/wiki/Subnetwork
