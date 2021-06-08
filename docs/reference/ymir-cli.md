# Ymir CLI reference

This reference documents every command available in Ymir’s command-line interface.

[[toc]]

## Login

<pre class="language-bash">
$ <span class="token builtin">ymir</span> login
</pre>

Authenticate with Ymir by logging in using your email, password and 2FA code (if enabled). Creates an authentication token locally.

::: tip Authenticate using an environment variable
The Ymir CLI also lets you authenticate by storing an API token in the `YMIR_API_TOKEN` environment variable. You can create an API token on the [account management page][1].
:::

::: tip Configuration file
All the Ymir CLI configuration options (including authentication token) are stored in `~/.ymir/config.json`.
:::

## Cache

Commands to manage cache clusters with the Ymir platform.

### cache:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> cache:create [options] [&lt;name&gt;]</code>
</pre>

Create a new cache cluster.

#### Arguments

##### `name` (optional)

The name of the cache cluster.

#### Options

##### `--network=NETWORK`

The ID or name of the network on which the cache cluster will be created.

##### `--type=TYPE`

The cache cluster type to create on the cloud provider.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a new cache cluster with prompt for the name, network and type</span></code>
<code>$ <span class="token builtin">ymir</span> cache:create</code>

<code><span class="token comment"># Create a new cache cluster named "cluster" with prompt network and type</span></code>
<code>$ <span class="token builtin">ymir</span> cache:create cluster</code>
</pre>

### cache:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> cache:delete [&lt;cache&gt;]</code>
</pre>

Delete a cache cluster.

#### Arguments

##### `cache` (optional)

The ID or name of the cache cluster to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete the cache cluster with prompt for cache cluster</span></code>
<code>$ <span class="token builtin">ymir</span> cache:delete</code>

<code><span class="token comment"># Delete the cache cluster named "cluster"</span></code>
<code>$ <span class="token builtin">ymir</span> cache:delete cluster</code>

<code><span class="token comment"># Delete the cache cluster with ID 42</span></code>
<code>$ <span class="token builtin">ymir</span> cache:delete 42</code>
</pre>

### cache:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> cache:list</code>
</pre>

List all the cache clusters that the current team has access to.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List all cache clusters</span></code>
<code>$ <span class="token builtin">ymir</span> cache:list</code>
---- --------- ----------- ---------- -------------- ----------- ----------------
 Id   Name      Provider   Network        Region      Status      Type
---- --------- ----------- ---------- -------------- ----------- ----------------
 42   cluster   AWS        ymir        us-east-1      available   cache.t3.micro
---- --------- ----------- ---------- -------------- ----------- ----------------
</pre>

### cache:tunnel

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> cache:create [options] [&lt;cache&gt;]</code>
</pre>

Create a SSH tunnel to a cache cluster.

#### Arguments

##### `cache` (optional)

The ID or name of the cache cluster to create a SSH tunnel to.

#### Options

##### `--port=PORT` (default: 6378)

The local port to use to connect to the cache cluster.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a SSH tunnel to a cache cluster with prompt for the cache cluster</span></code>
<code>$ <span class="token builtin">ymir</span> cache:tunnel</code>

<code><span class="token comment"># Create a SSH tunnel to the cache cluster named "cluster"</span></code>
<code>$ <span class="token builtin">ymir</span> cache:tunnel cluster</code>

<code><span class="token comment"># Create a SSH tunnel to the cache cluster named "cluster" on port "1234"</span></code>
<code>$ <span class="token builtin">ymir</span> cache:tunnel --port=1234 cluster</code>
</pre>

## Certificate

Commands to manage SSL certificates with the Ymir platform.

### certificate:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> certificate:request &lt;certificate&gt;</code>
</pre>

Delete a SSL certificate.

#### Arguments

##### `certificate`

The ID of the SSL certificate to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete the SSL certificate with ID 42</span></code>
<code>$ <span class="token builtin">ymir</span> certificate:delete 42</code>
</pre>

### certificate:info

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> certificate:request &lt;certificate&gt;</code>
</pre>

Get information on an SSL certificate.

#### Arguments

##### `certificate`

The ID of the SSL certificate to fetch the information of.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Get information on the SSL certificate with ID 42</span></code>
<code>$ <span class="token builtin">ymir</span> certificate:info 42</code>
</pre>

### certificate:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> certificate:list</code>
</pre>

List the SSL certificates that belong to the currently active team.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List all SSL certificates</span></code>
<code>$ <span class="token builtin">ymir</span> list</code>
 ---- -------------- ----------- --------------------- -------- --------
  Id   Provider       Region      Domains               Status   In Use
 ---- -------------- ----------- --------------------- -------- --------
  42   Personal AWS   us-east-1   example.com           issued   yes
 ---- -------------- ----------- --------------------- -------- --------
</pre>

### certificate:request

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> certificate:request [options] [&lt;domain&gt;]</code>
</pre>

Request a new SSL certificate from the cloud provider.

#### Arguments

##### `domain` (optional)

The domain that the SSL certificate is for.

#### Options

##### `--provider=PROVIDER`

The cloud provider where the certificate will be created.

##### `--region=REGION`

The cloud provider region where the certificate will be located.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a SSL certificate with prompt for domain and region</span></code>
<code>$ <span class="token builtin">ymir</span> certificate:request</code>

<code><span class="token comment"># Create a SSL certificate for "example.com" with prompt for region</span></code>
<code>$ <span class="token builtin">ymir</span> certificate:request example.com</code>

<code><span class="token comment"># Create a SSL certificate for "example.com" in "us-east-1" region</span></code>
<code>$ <span class="token builtin">ymir</span> certificate:request example.com --region=us-east-1</code>
</pre>

## Database

Commands to manage your databases and database servers.

### database:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:create [&lt;database&gt; [&lt;name&gt;]]</code>
</pre>

Create a new database on a database server.

::: warning Only useable with public database servers
You can only use the `database:create` command to create a database on a publicly accessible database server.
:::

#### Arguments

##### `database` (optional)

The ID or name of the database server where the database will be created.

##### `name` (optional)

The name of the new database.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a database with prompt for database server and database name</span></code>
<code>$ <span class="token builtin">ymir</span> database:create</code>

<code><span class="token comment"># Create a database on the database server named "database-server" with prompt for the database name</span></code>
<code>$ <span class="token builtin">ymir</span> database:create database-server</code>

<code><span class="token comment"># Create a database named "database-name" on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:create database-server database-name</code>
</pre>

### database:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:delete [&lt;database&gt; [&lt;name&gt;]]</code>
</pre>

Delete a database on a database server.

::: warning Only useable with public database servers
You can only use the `database:delete` command to delete a database on a publicly accessible database server.
:::

#### Arguments

##### `database` (optional)

The ID or name of the database server where the database will be deleted.

##### `name` (optional)

The name of the database to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete a database with prompt for database server and database name</span></code>
<code>$ <span class="token builtin">ymir</span> database:delete</code>

<code><span class="token comment"># Delete a database on the database server named "database-server" with prompt for the database name</span></code>
<code>$ <span class="token builtin">ymir</span> database:delete database-server</code>

<code><span class="token comment"># Delete a database named "database-name" on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:delete database-server database-name</code>
</pre>

### database:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:list [&lt;database&gt;]</code>
</pre>

List all the databases on a public database server.

::: warning Only useable with public database servers
You can only use the `database:list` command to list databases on a publicly accessible database server.
:::

#### Arguments

##### `database` (optional)

The ID or name of the database server to list databases from.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List all databases on the database server with prompt for database server</span></code>
<code>$ <span class="token builtin">ymir</span> database:list</code>

<code><span class="token comment"># List all databases on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:list database-server</code>
</pre>

### database:server:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:create [options] [&lt;name&gt;]</code>
</pre>

Create a new database server.

#### Arguments

##### `name` (optional)

The name of the database server.

#### Options

##### `--dev`

Create a development database server. (Overrides all other options.)

##### `--network=NETWORK`

The ID or name of the network on which the database will be created.

##### `--storage=STORAGE`

The maximum amount of storage (in GB) allocated to the database server.

##### `--type=TYPE`

The database server type to create on the cloud provider.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a new database server with prompt for the name, network, storage and type</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:create</code>

<code><span class="token comment"># Create a development database server with a prompt for the name</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:create --dev</code>
</pre>

### database:server:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:delete [&lt;database&gt;]</code>
</pre>

Delete a database server.

#### Arguments

##### `database` (optional)

The ID or name of the database server to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete the database server with prompt for database server</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:delete</code>

<code><span class="token comment"># Delete the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:delete database-server</code>

<code><span class="token comment"># Delete the database server with ID 42</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:delete 42</code>
</pre>

### database:server:info

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:info [&lt;database&gt;]</code>
</pre>

Get information on a database server.

#### Arguments

##### `database` (optional)

The ID or name of the database server to fetch the information of.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Get information on a database server with prompt for database server</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:info</code>

<code><span class="token comment"># Get information on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:info database-server</code>

<code><span class="token comment"># Get information on the database server with ID 42</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:info 42</code>
</pre>

### database:server:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:list</code>
</pre>

List all the database servers that the current team has access to.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List all databases servers</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:list</code>
---- --------- ----------- ---------- -------------- ----------- ------------- ---------
 Id   Name      Provider   Network        Region      Status      Type          Storage
---- --------- ----------- ---------- -------------- ----------- ------------- ---------
 42   ymir-db   AWS        ymir        us-east-1      available   db.t3.micro   50GB
---- --------- ----------- ---------- -------------- ----------- ------------- ---------
</pre>

### database:server:modify

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:modify [options] [&lt;database&gt;]</code>
</pre>

Modify a database server.

#### Arguments

##### `database` (optional)

The ID or name of the database server to modify.

#### Options

##### `--storage=STORAGE`

The maximum amount of storage (in GB) allocated to the database server.

##### `--type=TYPE`

The database server type.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Modify a database server with prompt for database server</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:modify</code>

<code><span class="token comment"># Modify the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:modify database-server</code>
</pre>

### database:user:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:user:create [&lt;database&gt; [&lt;username&gt;]]</code>
</pre>

Create a new database on a database server.

::: warning Need to create user on private database
With a private database, the `database:user:create` command will only create the database user on the Ymir platform. You'll have to create the user on the database yourself using the credentials returned by the command.
:::

#### Arguments

##### `database` (optional)

The ID or name of the database server where the user will be created.

##### `username` (optional)

The username of the new database user.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a database user with prompt for database server and username</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:create</code>

<code><span class="token comment"># Create a database user on the database server named "database-server" with prompt for the username</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:create database-server</code>

<code><span class="token comment"># Create a database user named "database-user" on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:create database-server database-user</code>
</pre>

### database:user:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:delete [&lt;database&gt; [&lt;username&gt;]]</code>
</pre>

Delete a user on a database.

::: warning Need to delete user on private database
With a private database, the `database:user:delete` command will only delete the database user on the Ymir platform. You'll have to delete the user on the database yourself to remove the user completly.
:::

#### Arguments

##### `database` (optional)

The ID or name of the database server where the database user will be deleted.

##### `username` (optional)

The username of the database user to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete a database user with prompt for database server and username</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:delete</code>

<code><span class="token comment"># Delete a database on the database server named "database-server" with prompt for the username</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:delete database-server</code>

<code><span class="token comment"># Delete a database user named "database-user" on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:delete database-server database-user</code>
</pre>

### database:user:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:user:list [&lt;database&gt;]</code>
</pre>

List all the managed users on a database server.

#### Arguments

##### `database` (optional)

The ID or name of the database server to list users from.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List all the managed database users on the database server with prompt for database server</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:list</code>

<code><span class="token comment"># List all the managed database users on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:list database-server</code>
</pre>

## DNS

Commands to manage your DNS records and zones.

### dns:record:change

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> dns:record:change &lt;zone&gt; &lt;type&gt; &lt;name&gt; &lt;value&gt;</code>
</pre>

Change the value of a DNS record.

::: tip Use comma-separated values to create multiple DNS records
To create multiple DNS records for the name and type (for example with MX records), you want to use commas to separate each value to add as a record. Please check the usage section below for an example.
:::

::: warning Overwrites existing DNS record
The `dns:record:change` command will overwrite an existing DNS record if one already exists with the same name and type.
:::

#### Arguments

##### `zone`

The name of the DNS zone that the DNS record belongs to.

##### `type`

The DNS record type.

##### `name`

The name of the DNS record without the domain.

##### `value`

The value of the DNS record.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Change the A record of "example.com" to 192.168.1.1</span></code>
<code>$ <span class="token builtin">ymir</span> dns:record:change example.com a @ 192.168.1.1</code>

<code><span class="token comment"># Change the A record of "subdomain.example.com" to 192.168.1.1</span></code>
<code>$ <span class="token builtin">ymir</span> dns:record:change example.com a subdomain 192.168.1.1</code>

<code><span class="token comment"># Change the MX records of "example.com"</span></code>
<code>$ <span class="token builtin">ymir</span> dns:record:change example.com MX @ "10 mail.example.com,20 mail2.example.com"</code>
</pre>

### dns:record:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> dns:record:delete &lt;zone&gt; [&lt;record&gt;]</code>
</pre>

Delete DNS record(s) from a DNS zone.

#### Arguments

##### `zone`

The ID or name of the DNS zone that the DNS record belongs to.

##### `record` (optional)

The ID of the DNS record to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete a DNS record from the "example.com" DNS zone with prompt for the DNS record</span></code>
<code>$ <span class="token builtin">ymir</span> dns:record:delete example.com</code>

<code><span class="token comment"># Delete a DNS record with ID 42 from the "example.com" DNS zone</span></code>
<code>$ <span class="token builtin">ymir</span> dns:record:delete example.com 42</code>
</pre>

### dns:record:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> dns:record:list [&lt;zone&gt;]</code>
</pre>

List the DNS records belonging to a DNS zone.

#### Arguments

##### `zone` (optional)

The ID or name of the DNS zone to list DNS records from.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List DNS records from a DNS zone with prompt for the DNS zone</span></code>
<code>$ <span class="token builtin">ymir</span> dns:record:list</code>

<code><span class="token comment"># List DNS records from the "example.com" DNS zone</span></code>
<code>$ <span class="token builtin">ymir</span> dns:record:list example.com</code>
</pre>

### dns:zone:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> dns:zone:create [&lt;name&gt;]</code>
</pre>

Create a new DNS zone.

#### Arguments

##### `name` (optional)

The name of the domain managed by the created DNS zone.

#### Options

##### `--provider=PROVIDER`

The cloud provider region where the DNS zone will created.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a DNS zone with prompt for the domain name</span></code>
<code>$ <span class="token builtin">ymir</span> dns:zone:create</code>

<code><span class="token comment"># Create a DNS zone for the "example.com" domain name</span></code>
<code>$ <span class="token builtin">ymir</span> dns:zone:create example.com</code>
</pre>

### dns:zone:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> dns:zone:delete [&lt;zone&gt;]</code>
</pre>

Delete a DNS zone.

#### Arguments

##### `zone` (optional)

The ID or name of the DNS zone to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete a DNS zone with prompt to choose the DNS zone</span></code>
<code>$ <span class="token builtin">ymir</span> dns:zone:delete</code>

<code><span class="token comment"># Delete the DNS zone for the "example.com" domain name</span></code>
<code>$ <span class="token builtin">ymir</span> dns:zone:delete example.com</code>
</pre>

### dns:zone:import-records

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> dns:zone:import-records &lt;zone&gt; [&lt;subdomain&gt;...]</code>
</pre>

Import DNS records into a DNS zone.

::: warning Import DNS records first
If you wish to import DNS records, you must do so before updating your domain nameservers to the ones of your DNS zone.
:::

#### Arguments

##### `zone`

The name of the DNS zone that the DNS record belongs to.

##### `subdomain`

The subdomain(s) that we want to import.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Import the DNS records of the "example.com" root domain</span></code>
<code>$ <span class="token builtin">ymir</span> dns:zone:import-records example.com</code>

<code><span class="token comment"># Import the DNS records of the "example.com" root domain as well as the "subdomain.example.com" subdomain</span></code>
<code>$ <span class="token builtin">ymir</span> dns:zone:delete example.com subdomain</code>
</pre>

### dns:zone:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> dns:zone:list</code>
</pre>

List the DNS zones that belong to the currently active team.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List DNS zones</span></code>
<code>$ <span class="token builtin">ymir</span> dns:zone:list</code>
</pre>

## Email

Commands to manage email.

### email:identity:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> email:identity:create [&lt;name&gt;]</code>
</pre>

Create a new email identity.

::: warning Validation required
An email identity will only become active once you validate it. For an email address, AWS will send a validation email to that address. If you're creating an identity for a domain, you must add the validation DNS records. **If Ymir manages the domain, it'll create those DNS records for you automatically.**
:::

#### Arguments

##### `name` (optional)

The name of the email identity.

#### Options

##### `--provider=PROVIDER`

The cloud provider where the email identity will be created.

##### `--region=REGION`

The cloud provider region where the email identity will be located.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a email identity with a prompt for the identity name</span></code>
<code>$ <span class="token builtin">ymir</span> email:identity:create</code>

<code><span class="token comment"># Create a email identity for the "example.com" domain</span></code>
<code>$ <span class="token builtin">ymir</span> email:identity:create example.com</code>

<code><span class="token comment"># Create a email identity for the "person@example.com" email address</span></code>
<code>$ <span class="token builtin">ymir</span> email:identity:create person@example.com</code>
</pre>

### email:identity:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> email:identity:delete [&lt;identity&gt;]</code>
</pre>

Delete an email identity.

#### Arguments

##### `identity` (optional)

The ID or name of the email identity to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete an email identity with prompt to choose the identity</span></code>
<code>$ <span class="token builtin">ymir</span> email:identity:delete</code>

<code><span class="token comment"># Delete an email identity for the "example.com" domain</span></code>
<code>$ <span class="token builtin">ymir</span> email:identity:delete example.com</code>
</pre>

### email:identity:info

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> email:identity:info [&lt;identity&gt;]</code>
</pre>

Delete an email identity.

#### Arguments

##### `identity` (optional)

The ID or name of the email identity to fetch the information of.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Get information on an email identity with prompt to choose the identity</span></code>
<code>$ <span class="token builtin">ymir</span> email:identity:info</code>

<code><span class="token comment"># Get information on the "example.com" domain email identity</span></code>
<code>$ <span class="token builtin">ymir</span> email:identity:info example.com</code>
</pre>

### email:identity:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> email:identity:list</code>
</pre>

List the email identities that belong to the currently active team.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List email identities</span></code>
<code>$ <span class="token builtin">ymir</span> email:identity:list</code>
</pre>

## Environment

### environment:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:create [&lt;environment&gt;]</code>
</pre>

Create a new environment.

#### Arguments

##### `environment` (optional)

The name of the environment to create.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a new environment with prompt to choose the name</span></code>
<code>$ <span class="token builtin">ymir</span> environment:create</code>

<code><span class="token comment"># Create the "testing" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:create testing</code>
</pre>

### environment:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:delete [&lt;environment&gt;]</code>
</pre>

Delete an environment.

#### Arguments

##### `environment` (optional)

The name of the environment to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete an environment with prompt to choose the environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:delete</code>

<code><span class="token comment"># Delete the "testing" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:delete testing</code>
</pre>

### environment:info

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:info [&lt;environment&gt;]</code>
</pre>

Get information on the project environment(s).

#### Arguments

##### `environment` (optional)

The name of the environment to get information on.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Get information on all environments found in ymir.yml file</span></code>
<code>$ <span class="token builtin">ymir</span> environment:info</code>

<code><span class="token comment"># Get information on the "testing" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:info testing</code>
</pre>

### environment:invalidate-cache

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:invalidate-cache [&lt;environment&gt;]</code>
</pre>

Invalidate the environment's content delivery network cache.

#### Arguments

##### `environment` (default: staging)

The name of the environment to invalidate the cache of.

#### Options

##### `--path=PATH` (default: *)

The path(s) to invalidate on the content delivery network.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Invalidate the "staging" environment's content delivery network cache</span></code>
<code>$ <span class="token builtin">ymir</span> environment:invalidate-cache</code>

<code><span class="token comment"># Invalidate the "testing" environment's content delivery network cache</span></code>
<code>$ <span class="token builtin">ymir</span> environment:invalidate-cache testing</code>

<code><span class="token comment"># Invalidate everything under "/uploads" on the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:invalidate-cache --path="/uploads"</code>
</pre>

### environment:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:list</code>
</pre>

List the project's environments.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List environments</span></code>
<code>$ <span class="token builtin">ymir</span> environment:list</code>
</pre>

### environment:url

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:url [&lt;environment&gt;]</code>
</pre>

Get the environment URL and copy it to the clipboard.

#### Arguments

##### `environment` (default: staging)

The name of the environment to get the URL of.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Get the URL to the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:url</code>

<code><span class="token comment"># Get the URL to the "testing" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:url testing</code>
</pre>

### environment:variables:change

Change an environment variable.

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:variables:change [&lt;environment&gt; [&lt;name&gt; [&lt;value&gt;]]]</code>
</pre>

::: tip Upsert command
The `environment:variables:change` command behaves like an [upsert][2]. It'll create environment variable if it doesn't exist. Otherwise, it'll replace the existing environment variable with the given `name` with the given `value`.
:::

#### Arguments

##### `environment` (default: staging)

The name of the environment where the environment variable is.

##### `name` (optional)

The name of the environment variable.

##### `value` (optional)

The value of the environment variable.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Change an environment variable on the "staging" environment with a prompt for the name and value of the environment variable</span></code>
<code>$ <span class="token builtin">ymir</span> environment:variables:change</code>

<code><span class="token comment"># Change an environment variable on the "testing" environment with a prompt for the name and value of the environment variable</span></code>
<code>$ <span class="token builtin">ymir</span> environment:variables:change testing</code>

<code><span class="token comment"># Change the "variable" environment variable on the "testing" environment with a prompt for the value</span></code>
<code>$ <span class="token builtin">ymir</span> environment:variables:change testing variable</code>

<code><span class="token comment"># Change the value of "variable" environment variable to "value" on the "testing" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:variables:change testing variable value</code>
</pre>

### environment:variables:download

Download an environment's environment variables into a `.env` environment file.

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:variables:download [&lt;environment&gt;]</code>
</pre>

#### Arguments

##### `environment` (default: staging)

The name of the environment to download environment variables from.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Download environment variables from the "staging" environment to the ".env.staging" file</span></code>
<code>$ <span class="token builtin">ymir</span> environment:variables:download</code>

<code><span class="token comment"># Download environment variables from the "testing" environment to the ".env.testing" file</span></code>
<code>$ <span class="token builtin">ymir</span> environment:variables:download testing</code>
</pre>

### environment:variables:upload

Upload the environment variables in a `.env` environment file to an environment.

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:variables:upload [&lt;environment&gt;]</code>
</pre>

::: warning Replaces all environment variables
The `environment:variables:upload` command will replace all environment variables in an environment. If you remove environment variables from the `.env` file, they'll be deleted from the environment.
:::

#### Arguments

##### `environment` (default: staging)

The name of the environment to upload environment variables to.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Upload the environment variables in the ".env.staging" file to the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:variables:upload</code>

<code><span class="token comment"># Upload the environment variables in the ".env.testing" file to the "testing" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:variables:upload testing</code>
</pre>


[1]: https://ymirapp.com/account/manage
[2]: https://en.wikipedia.org/wiki/Merge_(SQL)#upsert
