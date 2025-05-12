# Ymir CLI reference

This reference documents every command available in [Ymir’s command-line tool][6].

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

##### `--engine=ENGINE` (default: valkey)

The engine used by the cache cluster.

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

### cache:modify

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> cache:modify [&lt;cache&gt;]</code>
</pre>

Modify a cache cluster.

#### Arguments

##### `cache` (optional)

The ID or name of the cache cluster to modify.

#### Options

##### `--type=TYPE`

The cache cluster type.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Modify a cache cluster with prompt for cache cluster</span></code>
<code>$ <span class="token builtin">ymir</span> cache:modify</code>

<code><span class="token comment"># Modify the cache cluster named "cluster"</span></code>
<code>$ <span class="token builtin">ymir</span> cache:modify cluster</code>
</pre>

### cache:tunnel

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> cache:create [options] [&lt;cache&gt;]</code>
</pre>

Create a SSH tunnel to a cache cluster.

::: warning Requires a bastion host
To create a SSH tunnel to a cache cluster, the network that cache cluster is on must have a [bastion host][3].
:::

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
<code>$ <span class="token builtin">ymir</span> certificate:delete &lt;certificate&gt;</code>
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
<code>$ <span class="token builtin">ymir</span> certificate:list</code>
 ---- -------------- ----------- --------------------- -------- --------
  Id   Provider       Region      Domains               Status   In Use
 ---- -------------- ----------- --------------------- -------- --------
  42   Personal AWS   us-east-1   example.com           issued   yes
 ---- -------------- ----------- --------------------- -------- --------
</pre>

### certificate:request

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> certificate:request [options] [&lt;domains&gt;...]</code>
</pre>

Request a new SSL certificate from the cloud provider.

::: warning One hour to add DNS records
You have one hour to add all necessary DNS records when requesting a new certificate for a domain that isn't managed by Ymir.
:::

#### Arguments

##### `domains` (optional)

Space-separated list of domains that the SSL certificate is for.

#### Options

##### `--provider=PROVIDER`

The cloud provider where the certificate will be created.

##### `--region=REGION`

The cloud provider region where the certificate will be located.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a SSL certificate with prompt for domain and region</span></code>
<code>$ <span class="token builtin">ymir</span> certificate:request</code>

<code><span class="token comment"># Create a SSL certificate for "example.com"</span></code>
<code>$ <span class="token builtin">ymir</span> certificate:request example.com</code>

<code><span class="token comment"># Create a SSL certificate for "example.com" and "*.example.com"</span></code>
<code>$ <span class="token builtin">ymir</span> certificate:request example.com '*.example.com'</code>

<code><span class="token comment"># Create a SSL certificate for "example.com" in "us-east-1" region</span></code>
<code>$ <span class="token builtin">ymir</span> certificate:request example.com --region=us-east-1</code>
</pre>

## Database

Commands to manage your databases and database servers.

### database:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:create [&lt;name&gt;]</code>
</pre>

Create a new database on a database server.

::: warning Only useable with public database servers
You can only use the `database:create` command to create a database on a publicly accessible database server.
:::

#### Arguments

##### `name` (optional)

The name of the new database.

#### Options

##### `--server=SERVER`

The ID or name of the database server where the database will be created.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a database with prompt for database server and database name</span></code>
<code>$ <span class="token builtin">ymir</span> database:create</code>

<code><span class="token comment"># Create a database on the database server named "database-server" with prompt for the database name</span></code>
<code>$ <span class="token builtin">ymir</span> database:create --server=database-server</code>

<code><span class="token comment"># Create a database named "database-name" on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:create database-name --server=database-server</code>
</pre>

### database:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:delete [&lt;name&gt;]</code>
</pre>

Delete a database on a database server.

::: warning Only useable with public database servers
You can only use the `database:delete` command to delete a database on a publicly accessible database server.
:::

#### Arguments

##### `name` (optional)

The name of the database to delete.

#### Options

##### `--server=SERVER`

The ID or name of the database server where the database will be deleted.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete a database with prompt for database server and database name</span></code>
<code>$ <span class="token builtin">ymir</span> database:delete</code>

<code><span class="token comment"># Delete a database on the database server named "database-server" with prompt for the database name</span></code>
<code>$ <span class="token builtin">ymir</span> database:delete --server=database-server</code>

<code><span class="token comment"># Delete a database named "database-name" on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:delete database-name --server=database-server</code>
</pre>

### database:export

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:export [&lt;name&gt;]</code>
</pre>

Export a database to a local .sql.gz file.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=H92ewqQcU_M).
:::

::: warning Database name required for private database servers
If you want to use the `database:export` command to export a database from a private database server, you must specify the `name` argument.
:::

#### Arguments

##### `name` (optional)

The name of the database to export.

#### Options

##### `--server=SERVER`

The ID or name of the database server to export a database from.

##### `--user=USER`

The user used to connect to the database server.

##### `--password=PASSWORD`

The password of the user connecting to the database server.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Export a database with prompt for database server, database name, database user and password</span></code>
<code>$ <span class="token builtin">ymir</span> database:export</code>

<code><span class="token comment"># Export a database named "database-name" on the database server named "database-server" with a prompt for database user and password</span></code>
<code>$ <span class="token builtin">ymir</span> database:export database-name --server=database-server</code>

<code><span class="token comment"># Export a database named "database-name" on the database server named "database-server" with a prompt using the "database-user" database user and "database-user-password" password</span></code>
<code>$ <span class="token builtin">ymir</span> database:export database-name --server=database-server --user=database-user --password=database-user-password</code>
</pre>

### database:import

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:import [&lt;name&gt;]</code>
</pre>

Import a local .sql or .sql.gz file to a database.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=H92ewqQcU_M).
:::

::: warning Database name required for private database servers
If you want to use the `database:import` command to import a database to a private database server, you must specify the `name` argument.
:::

#### Arguments

##### `file`

The path to the local .sql or .sql.gz file.

##### `name` (optional)

The name of the database to import.

#### Options

##### `--server=SERVER`

The ID or name of the database server to import a database to.

##### `--user=USER`

The user used to connect to the database server.

##### `--password=PASSWORD`

The password of the user connecting to the database server.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Import a database with prompt for database server, database name, database user and password</span></code>
<code>$ <span class="token builtin">ymir</span> database:import backup.sql.gz</code>

<code><span class="token comment"># Import a database named "database-name" on the database server named "database-server" with a prompt for database user and password</span></code>
<code>$ <span class="token builtin">ymir</span> database:import backup.sql.gz database-name --server=database-server</code>

<code><span class="token comment"># Import a database named "database-name" on the database server named "database-server" with a prompt using the "database-user" database user and "database-user-password" password</span></code>
<code>$ <span class="token builtin">ymir</span> database:import backup.sql.gz database-name --server=database-server --user=database-user --password=database-user-password</code>
</pre>

### database:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:list [&lt;server&gt;]</code>
</pre>

List all the databases on a public database server.

::: warning Only useable with public database servers
You can only use the `database:list` command to list databases on a publicly accessible database server.
:::

#### Arguments

##### `server` (optional)

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

##### `--network=NETWORK`

The ID or name of the network on which the database will be created.

##### `--private`

The created database server won't be publicly accessible.

##### `--public`

The created database server will be publicly accessible.

##### `--serverless`

Create an Aurora serverless database cluster. (Overrides all other options.)

##### `--storage=STORAGE`

The maximum amount of storage (in GB) allocated to the database server.

##### `--type=TYPE`

The database server type to create on the cloud provider.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a new database server with prompt for the name, network, storage and type</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:create</code>

<code><span class="token comment"># Create an Aurora serverless database cluster with a prompt for the name</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:create --serverless</code>
</pre>

### database:server:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:delete [&lt;server&gt;]</code>
</pre>

Delete a database server.

#### Arguments

##### `server` (optional)

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
<code>$ <span class="token builtin">ymir</span> database:server:info [&lt;server&gt;]</code>
</pre>

Get information on a database server.

#### Arguments

##### `server` (optional)

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

### database:server:lock

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:lock [&lt;server&gt;]</code>
</pre>

Lock the database server which prevents it from being deleted.

#### Arguments

##### `server` (optional)

The ID or name of the database server to lock.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Lock a database server with prompt for database server</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:lock</code>

<code><span class="token comment"># Lock a database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:lock database-server</code>

<code><span class="token comment"># Lock a database server with ID 42</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:lock 42</code>
</pre>

### database:server:modify

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:modify [options] [&lt;server&gt;]</code>
</pre>

Modify a database server.

#### Arguments

##### `server` (optional)

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

### database:server:rotate-password

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:rotate-password [&lt;server&gt;]</code>
</pre>

Rotate the password of the database server's `ymir` user.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=LgQG8Sb96IY).
:::

::: warning Redeployment needed
All projects that use the database server with the default `ymir` user will be unable to connect to the database once the password rotated. You'll have have to redeploy each project using either the [`deploy`][4] or [`redeploy`][5] commands to restore the connection to the database server.
:::

#### Arguments

##### `server` (optional)

The ID or name of the database server to rotate the password of.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Rotate the password of a database server with prompt for the database server</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:rotate-password</code>

<code><span class="token comment"># Rotate the password of the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:rotate-password database-server</code>
</pre>

### database:server:tunnel

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:tunnel [options] [&lt;server&gt;]</code>
</pre>

Create a SSH tunnel to a database server.

::: warning Requires a bastion host
To create a SSH tunnel to a database server, the network that database server is on must have a [bastion host][3].
:::

#### Arguments

##### `server` (optional)

The ID or name of the database server to create a SSH tunnel to.

#### Options

##### `--port=PORT` (default: 3305)

The local port to use to connect to the database server.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a SSH tunnel to a database server with prompt for the database server</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:tunnel</code>

<code><span class="token comment"># Create a SSH tunnel to the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:tunnel database-server</code>

<code><span class="token comment"># Create a SSH tunnel to the database server named "database-server" on port "1234"</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:tunnel --port=1234 database-server</code>
</pre>

### database:server:unlock

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:server:lock [&lt;server&gt;]</code>
</pre>

Unlock the database server which allows it to be deleted.

#### Arguments

##### `server` (optional)

The ID or name of the database server to unlock.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Unlock a database server with prompt for database server</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:unlock</code>

<code><span class="token comment"># Unlock a database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:unlock database-server</code>

<code><span class="token comment"># Unlock a database server with ID 42</span></code>
<code>$ <span class="token builtin">ymir</span> database:server:unlock 42</code>
</pre>

### database:user:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:user:create [&lt;username&gt;]</code>
</pre>

Create a new database on a database server.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=LgQG8Sb96IY).
:::

::: warning Need to create user on private database
With a private database server, the `database:user:create` command will only create the database user on the Ymir platform. You'll have to create the user on the database server yourself using the credentials returned by the command.
:::

#### Arguments

##### `username` (optional)

The username of the new database user.

#### Options

##### `--server=SERVER`

The ID or name of the database server where the user will be created.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a database user with prompt for database server and username</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:create</code>

<code><span class="token comment"># Create a database user on the database server named "database-server" with prompt for the username</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:create --server=database-server</code>

<code><span class="token comment"># Create a database user named "database-user" on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:create database-user --server=database-server</code>
</pre>

### database:user:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:delete [&lt;username&gt;]</code>
</pre>

Delete a user on a database.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=LgQG8Sb96IY).
:::

::: warning Need to delete user on private database
With a private database server, the `database:user:delete` command will only delete the database user on the Ymir platform. You'll have to delete the user on the database yourself to remove the user completly.
:::

#### Arguments

##### `username` (optional)

The username of the database user to delete.

#### Options

##### `--server=SERVER`

The ID or name of the database server where the database user will be deleted.

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
<code>$ <span class="token builtin">ymir</span> database:user:list [&lt;server&gt;]</code>
</pre>

List all the managed users on a database server.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=LgQG8Sb96IY).
:::

#### Arguments

##### `server` (optional)

The ID or name of the database server to list users from.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List all the managed database users on the database server with prompt for database server</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:list</code>

<code><span class="token comment"># List all the managed database users on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:list database-server</code>
</pre>

### database:user:rotate-password

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> database:user:rotate-password [&lt;username&gt;]</code>
</pre>

Rotate the password of a user on a database server.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=LgQG8Sb96IY).
:::

::: warning Need to change user's password on private database
With a private database server, the `database:user:rotate-password` command will only rotate the database user password on the Ymir platform. You'll have to change the user's password on the database server yourself using the credentials returned by the command.
:::

#### Arguments

##### `username` (optional)

The username of the database user to rotate the password of.

#### Options

##### `--server=SERVER`

The ID or name of the database server where the database user is located.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Rotate a database user's password with prompt for database server and username</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:rotate-password</code>

<code><span class="token comment"># Rotate a database user's password on the database server named "database-server" with prompt for the username</span></code>
<code>$ <span class="token builtin">ymir</span> database:user:rotate-password --server=database-server</code>

<code><span class="token comment"># Rotate the password of the database user named "database-user" on the database server named "database-server"</span></code>
<code>$ <span class="token builtin">ymir</span> database:rotate-password database-user --server=database-server</code>
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
<code>$ <span class="token builtin">ymir</span> dns:zone:create [options] [&lt;name&gt;]</code>
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

## Docker

Commands to manage your project's Docker configuration.

### docker:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> docker:create [options] [&lt;environment&gt;]</code>
</pre>

Create a new Dockerfile.

#### Arguments

##### `environment` (optional)

The name of the environment to create the Dockerfile for.

#### Options

##### `--configure-project`

Configure project's ymir.yml file.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a project-wide Dockerfile</span></code>
<code>$ <span class="token builtin">ymir</span> docker:create</code>

<code><span class="token comment"># Create a Dockerfile for the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> docker:create staging</code>

<code><span class="token comment"># Create a Dockerfile for the "staging" environment and add configuration to ymir.yml file</span></code>
<code>$ <span class="token builtin">ymir</span> docker:create --configure-project staging</code>
</pre>

### docker:delete-images

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> docker:delete-images [options]</code>
</pre>

Delete a project's deployment docker images.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=wDrJbpEgyN8).
:::

#### Options

##### `--all`

Delete deployment docker images for all projects.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete all deployment images of a project</span></code>
<code>$ <span class="token builtin">ymir</span> docker:delete-images</code>

<code><span class="token comment"># Delete deployment docker images for all projects</span></code>
<code>$ <span class="token builtin">ymir</span> docker:delete-images --all</code>
</pre>

## Email

Commands to manage email.

### email:identity:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> email:identity:create [options] [&lt;name&gt;]</code>
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

Commands to manage your project environments.

### environment:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:create [&lt;name&gt;]</code>
</pre>

Create a new environment.

#### Arguments

##### `name` (optional)

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

### environment:domain:change

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:domain:change [&lt;environment&gt; [&lt;domain&gt;]]</code>
</pre>

Change an environment's domain.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=_cMBIwJcbB8).
:::

#### Arguments

##### `environment` (default: staging)

The name of the environment to change the domain of.

##### `domain` (optional)

The current environment domain to replace.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Change the "staging" environment's domain with prompt for the old and new domain</span></code>
<code>$ <span class="token builtin">ymir</span> environment:domain:change</code>

<code><span class="token comment"># Change the "testing" environment's domain with prompt for the old and new domain</span></code>
<code>$ <span class="token builtin">ymir</span> environment:domain:change testing</code>
</pre>

### environment:info

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:info [&lt;environment&gt;]</code>
</pre>

Get information on the environment(s).

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
<code>$ <span class="token builtin">ymir</span> environment:invalidate-cache [options] [&lt;environment&gt;]</code>
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

### environment:logs:query

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:logs:query [options] [&lt;environment&gt; [&lt;function&gt;]]</code>
</pre>

Retrieve logs for an environment function.

#### Arguments

##### `environment` (default: staging)

The name of the environment to get the logs of.

##### `environment` (default: website)

The environment function to get the logs of.

#### Options

##### `--lines=LINES` (default: 10)

The number of log lines to display.

##### `--order=ORDER` (default: asc)

The order to display the logs in.

##### `--period=PERIOD` (default: 1h)

The period of time to get the logs for.

##### `--timezone=TIMEZONE`

The timezone to display the log times in.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Retrive the last 10 logged events from the "website" function of the "staging" environment over the last hour</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:query</code>

<code><span class="token comment"># Retrive the last 10 logged events from the "website" function of the "production" environment over the last hour</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:query production</code>

<code><span class="token comment"># Retrive the last 10 logged events from the "console" function of the "production" environment over the last hour</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:query production console</code>

<code><span class="token comment"># Retrive the last 10 logged events from the "website" function of the "staging" environment over the last minute</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:query --period=1m</code>

<code><span class="token comment"># Retrive the last 20 logged events from the "website" function of the "staging" environment over the last hour</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:query --lines</code>

<code><span class="token comment"># Retrive the last 10 logged events from the "website" function of the "staging" environment over the last hour with the times displayed in the New York timezone</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:query --timezone=America/New_York</code>
</pre>

### environment:logs:watch

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:logs:watch [options] [&lt;environment&gt; [&lt;function&gt;]]</code>
</pre>

Continuously monitor and display the most recent logs for an environment function.

#### Arguments

##### `environment` (default: staging)

The name of the environment to get the logs of.

##### `environment` (default: website)

The environment function to get the logs of.

#### Options

##### `--interval=INTERVAL` (default: 30)

Interval (in seconds) to poll for new logs.

##### `--timezone=TIMEZONE`

The timezone to display the log times in.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Continuously monitor and display the most recent logs from the "website" function of the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:watch</code>

<code><span class="token comment"># Continuously monitor and display the most recent logs from the "website" function of the "production" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:watch production</code>

<code><span class="token comment"># Continuously monitor and display the most recent logs from the "console" function of the "production" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:watch console</code>

<code><span class="token comment"># Continuously monitor and display the most recent logs from the "website" function of the "staging" environment while polling every minute</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:watch --interval=60</code>

<code><span class="token comment"># Continuously monitor and display the most recent logs from the "website" function of the "staging" environment displayed in the New York timezone</span></code>
<code>$ <span class="token builtin">ymir</span> environment:logs:watch --timezone=America/New_York</code>
</pre>

### environment:metrics

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:metrics [options] [&lt;environment&gt;]</code>
</pre>

Get cost and usage metrics of the environment.

#### Arguments

##### `environment` (default: staging)

The name of the environment to get the metrics of.

#### Options

##### `--period=PERIOD` (default: 1d)

The period to gather metrics for. (1m, 5m, 30m, 1h, 8h, 1d, 3d, 7d, 1mo)

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Get cost and usage metrics for the "staging" environment over the last 24h</span></code>
<code>$ <span class="token builtin">ymir</span> environment:metrics</code>

<code><span class="token comment"># Get cost and usage metrics for the "staging" environment over the last month</span></code>
<code>$ <span class="token builtin">ymir</span> environment:metrics --period=1mo</code>

<code><span class="token comment"># Get cost and usage metrics for the "production" environment over the last week</span></code>
<code>$ <span class="token builtin">ymir</span> environment:metrics production --period=7d</code>
</pre>

### environment:secret:change

Change an environment's secret.

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:secret:change [&lt;environment&gt; [&lt;name&gt; [&lt;value&gt;]]]</code>
</pre>

::: tip Upsert command
The `environment:secret:change` command behaves like an [upsert][2]. It'll create a secret if it doesn't exist. Otherwise, it'll replace the existing secret with the given `name` with the given `value`.
:::

#### Arguments

##### `environment` (default: staging)

The name of the environment where the secret is.

##### `name` (optional)

The name of the secret.

##### `value` (optional)

The value of the secret.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Change a secret on the "staging" environment with a prompt for the name and value of the environment variable</span></code>
<code>$ <span class="token builtin">ymir</span> environment:secret:change</code>

<code><span class="token comment"># Change a secret on the "testing" environment with a prompt for the name and value of the environment variable</span></code>
<code>$ <span class="token builtin">ymir</span> environment:secret:change testing</code>

<code><span class="token comment"># Change the "secret" secret on the "testing" environment with a prompt for the value</span></code>
<code>$ <span class="token builtin">ymir</span> environment:secret:change testing secret</code>

<code><span class="token comment"># Change the value of "secret" secret to "value" on the "testing" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:secret:change testing secret value</code>
</pre>

### environment:secret:delete

Delete an environment's secret.

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:secret:delete [&lt;environment&gt; [&lt;secret&gt;]]</code>
</pre>

#### Arguments

##### `environment` (default: staging)

The name of the environment where the secret is.

##### `secret` (optional)

The ID or name of the secret.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete a secret on the "staging" environment with prompt for the secret</span></code>
<code>$ <span class="token builtin">ymir</span> environment:secret:delete</code>

<code><span class="token comment"># Delete a secret on the "production" environment with prompt for the secret</span></code>
<code>$ <span class="token builtin">ymir</span> environment:secret:delete production</code>

<code><span class="token comment"># Delete a secret on the "production" environment with the name "secret"</span></code>
<code>$ <span class="token builtin">ymir</span> environment:secret:delete production secret</code>

<code><span class="token comment"># Delete a secret on the "production" environment with the ID "42"</span></code>
<code>$ <span class="token builtin">ymir</span> environment:secret:delete production 42</code>
</pre>

### environment:secret:list

List an environment's secrets.

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> environment:secret:list [&lt;environment&gt;]</code>
</pre>

#### Arguments

##### `environment` (default: staging)

The name of the environment to list secrets of.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List the secrets used by the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:secret:list</code>

<code><span class="token comment"># List the secrets used by the "production" environment</span></code>
<code>$ <span class="token builtin">ymir</span> environment:secret:list production</code>
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

## Network

Commands to manage team networks.

### network:bastion:add

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> network:bastion:add [&lt;network&gt;]</code>
</pre>

Add a bastion host to the network.

#### Arguments

##### `network` (optional)

The ID or name of the network to add a bastion host to.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Add a bastion host to a network with prompt for the network</span></code>
<code>$ <span class="token builtin">ymir</span> network:bastion:add</code>

<code><span class="token comment"># Add a bastion host to the "my-network" network</span></code>
<code>$ <span class="token builtin">ymir</span> network:bastion:add my-network</code>
</pre>

### network:bastion:remove

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> network:bastion:remove [&lt;network&gt;]</code>
</pre>

Remove bastion host from a network.

#### Arguments

##### `network` (optional)

The ID or name of the network to add a bastion host to.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Remove a bastion host from a network with prompt for the network</span></code>
<code>$ <span class="token builtin">ymir</span> network:bastion:remove</code>

<code><span class="token comment"># Remove the bastion host from the "my-network" network</span></code>
<code>$ <span class="token builtin">ymir</span> network:bastion:remove my-network</code>
</pre>

### network:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> network:create [options] [&lt;name&gt;]</code>
</pre>

Create a new network.

#### Arguments

##### `name` (optional)

The name of the network.

#### Options

##### `--provider=PROVIDER`

The cloud provider region where the network will created.

##### `--region=REGION`

The cloud provider region where the network will be located.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a network with a prompt for the network name</span></code>
<code>$ <span class="token builtin">ymir</span> network:create</code>

<code><span class="token comment"># Create a network with the name "my-network"</span></code>
<code>$ <span class="token builtin">ymir</span> network:create my-network</code>
</pre>

### network:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> network:delete [&lt;network&gt;]</code>
</pre>

Delete a network.

#### Arguments

##### `network` (optional)

The ID or name of the network to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete a network with a prompt for the network</span></code>
<code>$ <span class="token builtin">ymir</span> network:delete</code>

<code><span class="token comment"># Delete the network with the name "my-network"</span></code>
<code>$ <span class="token builtin">ymir</span> network:delete my-network</code>

<code><span class="token comment"># Delete network with the ID "42"</span></code>
<code>$ <span class="token builtin">ymir</span> network:delete 42</code>
</pre>

### network:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> network:list</code>
</pre>

List the networks that belong to the currently active team.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List all networks</span></code>
<code>$ <span class="token builtin">ymir</span> network:list</code>
---- ------ -------------- ----------- ----------- -------------
 Id   Name   Provider       Region      Status      NAT Gateway
---- ------ -------------- ----------- ----------- -------------
 42   ymir   Personal AWS   us-east-1   available   no
---- ------ -------------- ----------- ----------- -------------
</pre>

### network:nat:add

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> network:nat:add [&lt;network&gt;]</code>
</pre>

Add a NAT gateway to a network's private subnet.

#### Arguments

##### `network` (optional)

The ID or name of the network to add a NAT gateway to.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Add a NAT gateway to a network with prompt for the network</span></code>
<code>$ <span class="token builtin">ymir</span> network:nat:add</code>

<code><span class="token comment"># Add a NAT gateway to the "my-network" network</span></code>
<code>$ <span class="token builtin">ymir</span> network:nat:addmy-network</code>
</pre>

### network:nat:remove

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> network:nat:remove [&lt;network&gt;]</code>
</pre>

Remove a NAT gateway from a network's private subnet.

#### Arguments

##### `network` (optional)

The ID or name of the network to remove the NAT gateway from.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Remove a NAT gateway from a network with prompt for the network</span></code>
<code>$ <span class="token builtin">ymir</span> network:nat:remove</code>

<code><span class="token comment"># Remove the NAT gateway from the "my-network" network</span></code>
<code>$ <span class="token builtin">ymir</span> network:nat:remove my-network</code>
</pre>

## PHP

Commands to get information about PHP.

### php:info

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> php:info [&lt;environment&gt;]</code>
</pre>

Get information about PHP on the cloud provider.

#### Arguments

##### `environment` (default: staging)

The name of the environment to get PHP information about.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Get PHP information about the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> php:info</code>

<code><span class="token comment"># Get PHP information about the "production" environment</span></code>
<code>$ <span class="token builtin">ymir</span> php:info production</code>
</pre>

### php:version

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> php:version [&lt;environment&gt;]</code>
</pre>

Get the PHP version information on the cloud provider.

#### Arguments

##### `environment` (default: staging)

The name of the environment to get the PHP version of.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Get the PHP version on the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> php:version</code>

<code><span class="token comment"># Get the PHP version on the "production" environment</span></code>
<code>$ <span class="token builtin">ymir</span> php:version production</code>
</pre>

## Project

Commands to manage a team's projects.

::: tip Aliases
All project commands have an alias without their `project:` prefix.
:::

### project:build [build]

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> project:build [options] [&lt;environment&gt;]</code>
<code>$ <span class="token builtin">ymir</span> build [options] [&lt;environment&gt;]</code>
</pre>

Build the project for deployment.

#### Arguments

##### `environment` (default: staging)

The name of the environment to build.

#### Options

##### `--debug`

Run the build in debug mode.

##### `--with-uploads`

Copy the "uploads" directory during the build.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Build project for deployment to the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> build</code>

<code><span class="token comment"># Build project for deployment to the "production" environment</span></code>
<code>$ <span class="token builtin">ymir</span> build production</code>
</pre>

### project:configure [configure]

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> project:configure [&lt;environment&gt;]</code>
<code>$ <span class="token builtin">ymir</span> configure [&lt;environment&gt;]</code>
</pre>

Configure the project by scanning your plugins and themes.

::: warning WP-CLI required
The `project:configure` command requires you to have [WP-CLI][7] installed and globally available. This is necessary for the command to scan your project's plugins and themes. You can refer to the [WP-CLI installation instructions][8] to see how to install WP-CLI and make it globally available.
:::

#### Arguments

##### `environment` (optional)

The name of the environment to configure.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Scan the project's plugins and themes and configure all environments</span></code>
<code>$ <span class="token builtin">ymir</span> configure</code>

<code><span class="token comment"># Scan the project's plugins and themes and configure the "production" environment</span></code>
<code>$ <span class="token builtin">ymir</span> configure production</code>
</pre>

### project:delete [delete]

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> project:delete [&lt;project&gt;]</code>
<code>$ <span class="token builtin">ymir</span> delete [&lt;project&gt;]</code>
</pre>

Delete a project.

#### Arguments

##### `project`

The ID or name of the project to delete.

::: warning Only usable outside project directories
The `project` argument only works when calling the `project:delete` command outside of a Ymir project directory.
:::

#### Usage

<pre class="language-bash">
<code><span class="token property">[Inside a Ymir project directory]</span></code>
<code><span class="token comment"># Delete the project</span></code>
<code>$ <span class="token builtin">ymir</span> delete</code>

<code><span class="token property">[Outside a Ymir project directory]</span></code>
<code><span class="token comment"># Delete a project with a prompt to select the project</span></code>
<code>$ <span class="token builtin">ymir</span> delete</code>

<code><span class="token comment"># Delete a project with the name "ymir-project"</span></code>
<code>$ <span class="token builtin">ymir</span> delete ymir-project</code>

<code><span class="token comment"># Delete a project with the ID 42</span></code>
<code>$ <span class="token builtin">ymir</span> delete 42</code>
</pre>

### project:deploy [deploy]

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> project:deploy [options] [&lt;environment&gt;]</code>
<code>$ <span class="token builtin">ymir</span> deploy [options] [&lt;environment&gt;]</code>
</pre>

Deploy project to an environment.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=3C1SOCP5HRc).
:::

#### Arguments

##### `environment` (default: staging)

The name of the environment to deploy to.

#### Options

##### `--debug-build`

Run the deployment build in debug mode.

##### `--with-uploads`

Import the "uploads" directory during the deployment.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Deploy project to the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> deploy</code>

<code><span class="token comment"># Deploy project to the "staging" environment and import the "uploads" directory at the same time</span></code>
<code>$ <span class="token builtin">ymir</span> deploy --with-uploads</code>

<code><span class="token comment"># Deploy project to the "production" environment</span></code>
<code>$ <span class="token builtin">ymir</span> deploy production</code>
</pre>

### project:info [info]

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> project:info</code>
<code>$ <span class="token builtin">ymir</span> info</code>
</pre>

Get information on the project.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Get information on the project</span></code>
<code>$ <span class="token builtin">ymir</span> info</code>
</pre>

### project:init [init]

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> project:init</code>
<code>$ <span class="token builtin">ymir</span> init</code>
</pre>

Initialize a new project.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Initialize a new project</span></code>
<code>$ <span class="token builtin">ymir</span> init</code>
</pre>

### project:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> project:list</code>
</pre>

List the projects that belong to the currently active team.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List all projects</span></code>
<code>$ <span class="token builtin">ymir</span> project:list</code>
---- ------ -------------- -----------
 Id   Name   Provider       Region
---- ------ -------------- -----------
 42   ymir   Personal AWS   us-east-1
---- ------ -------------- -----------
</pre>

### project:redeploy [redeploy]

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> project:redeploy [&lt;environment&gt;]</code>
<code>$ <span class="token builtin">ymir</span> redeploy [&lt;environment&gt;]</code>
</pre>

Redeploy project to an environment.

::: tip See it in action
Check out the [video](https://www.youtube.com/watch?v=3C1SOCP5HRc).
:::

#### Arguments

##### `environment` (default: staging)

The name of the environment to redeploy.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Redeploy the "staging" environment</span></code>
<code>$ <span class="token builtin">ymir</span> redeploy</code>

<code><span class="token comment"># Redeploy the "production" environment</span></code>
<code>$ <span class="token builtin">ymir</span> redeploy production</code>
</pre>

### project:rollback [rollback]

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> project:rollback [options] [&lt;environment&gt;]</code>
<code>$ <span class="token builtin">ymir</span> rollback [options] [&lt;environment&gt;]</code>
</pre>

Rollback environment to a previous deployment.

#### Arguments

##### `environment` (default: staging)

The name of the environment to rollback.

#### Options

##### `--select`

Select the deployment to rollback to.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Rollback the "staging" environment to the last successful deployment</span></code>
<code>$ <span class="token builtin">ymir</span> rollback</code>

<code><span class="token comment"># Rollback the "staging" environment with a prompt to select the deployment to rollback to</span></code>
<code>$ <span class="token builtin">ymir</span> rollback --select</code>

<code><span class="token comment"># Rollback the "production" environment to the last successful deployment</span></code>
<code>$ <span class="token builtin">ymir</span> rollback production</code>
</pre>

### project:validate [validate]

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> project:validate [&lt;environments&gt;]</code>
<code>$ <span class="token builtin">ymir</span> validate [&lt;environments&gt;]</code>
</pre>

Validates the project's ymir.yml file.

#### Arguments

##### `environments`

The names of the environments to validate.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Validates the project's ymir.yml file</span></code>
<code>$ <span class="token builtin">ymir</span> validate</code>
</pre>

## Provider

Commands to manage cloud providers.

### provider:connect

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> provider:connect</code>
</pre>

Connect a cloud provider to the currently active team.

::: tip Imports AWS credentials file
The `provider:connect` command can also import AWS credentials from the AWS credentials file found in `~/.aws/credentials`.
:::

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Connect a cloud provider</span></code>
<code>$ <span class="token builtin">ymir</span> provider:connect</code>
</pre>

### provider:delete

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> provider:delete &lt;provider&gt;</code>
</pre>

Delete a cloud provider.

#### Arguments

##### `provider`

The ID of the cloud provider to delete.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Delete cloud provider with ID 42</span></code>
<code>$ <span class="token builtin">ymir</span> provider:delete 42</code>
</pre>

### provider:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> provider:list</code>
</pre>

List the cloud provider accounts connected to the currently active team.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List all cloud providers</span></code>
<code>$ <span class="token builtin">ymir</span> provider:list</code>
 ---- ------
  Id   Name
 ---- ------
  42   ymir
 ---- ------
</pre>

### provider:update

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> provider:update &lt;provider&gt;</code>
</pre>

Update a cloud provider.

::: tip Imports AWS credentials file
The `provider:update` command can also import AWS credentials from the AWS credentials file found in `~/.aws/credentials`.
:::

#### Arguments

##### `provider`

The ID of the cloud provider to update.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Update cloud provider with ID 42</span></code>
<code>$ <span class="token builtin">ymir</span> provider:update 42</code>
</pre>

## Team

Commands to manage teams.

### team:create

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> team:create [&lt;name&gt;]</code>
</pre>

Create a new team.

#### Arguments

##### `name`

The name of the team.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Create a new team with a prompt for the name</span></code>
<code>$ <span class="token builtin">ymir</span> team:create</code>

<code><span class="token comment"># Create a new team with the name "ymir"</span></code>
<code>$ <span class="token builtin">ymir</span> team:create ymir</code>
</pre>

### team:current

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> team:current</code>
</pre>

Get the details on your currently active team.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Get the details on your currently active team</span></code>
<code>$ <span class="token builtin">ymir</span> team:current</code>
Your currently active team is:
 ------- ----------
  Id      42
  Name    Personal
  Owner   You
 ------- ----------
</pre>

### team:list

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> team:list</code>
</pre>

List all the teams that you're on.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># List all the teams that you're on</span></code>
<code>$ <span class="token builtin">ymir</span> team:list</code>
You are on the following teams:
 ---- ---------- -------
  Id   Name       Owner
 ---- ---------- -------
  42   Personal   You
 ---- ---------- -------
</pre>

### team:select

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> team:select [&lt;team&gt;]</code>
</pre>

Select a new currently active team.

#### Arguments

##### `team`

The ID of the team to make your currently active team.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Select a new currently active team with prompt for the team</span></code>
<code>$ <span class="token builtin">ymir</span> team:select</code>

<code><span class="token comment"># Select team with ID 42 as the new currently active team</span></code>
<code>$ <span class="token builtin">ymir</span> team:select 42</code>
</pre>

## Uploads

Commands to interact with the WordPress uploads directory.

### uploads:import

<pre class="language-bash">
<code>$ <span class="token builtin">ymir</span> uploads:import [options] &lt;path&gt;</code>
</pre>

Import files to the environment uploads directory.

#### Arguments

##### `path` (default: `wp-content/uploads` for WordPress projects, `web/app/uploads` for Bedrock projects and `public/content/uploads` for Radicle projects)

The path to the files to import.

#### Options

##### `--environment=ENVIRONMENT` (default: staging)

The environment to upload files to.

##### `--size=SIZE` (default: 1000)

The number of files to process at a time.

#### Usage

<pre class="language-bash">
<code><span class="token comment"># Import files to "staging" environment using a file path</span></code>
<code>$ <span class="token builtin">ymir</span> uploads:import /path/to/uploads</code>

<code><span class="token comment"># Import files to "production" environment using a SFTP URL</span></code>
<code>$ <span class="token builtin">ymir</span> uploads:import --environment=production sftp://myserver.com/path/to/uploads</code>
</pre>

[1]: https://ymirapp.com/account/manage
[2]: https://en.wikipedia.org/wiki/Merge_(SQL)#upsert
[3]: ../team-resources/networks.html#bastion-host
[4]: #project-deploy-deploy
[5]: #project-redeploy-redeploy
[6]: https://github.com/ymirapp/cli
[7]: https://wp-cli.org/
[8]: https://wp-cli.org/#installing
