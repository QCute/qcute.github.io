---
title: "SVN使用SSH"
date: 2020-03-07T00:00:00+08:00
categories: ["misc"]
---
 
[SSH](http://www.openssh.com/)配置方面和通常用[Git](https://git-scm.com/)一样，密码或者Key。  
当[SVN](https://subversion.apache.org/)使用[SSH]()时，[SVN](https://subversion.apache.org/)用户名用的就是[SSH](http://www.openssh.com/)登录的用户名，所以配置就很简单明了。  

仓库认证配置 [conf/authz]()
```ini
[/]
...
# 本机用户名 = 权限
username = rw
...
```

仓库密码配置 [conf/passwd]()
```ini
[users]
...
# 为了方便使用，无密码
# 本机用户名 = 
username = 
...
```

当[SSH](http://www.openssh.com/)端口不是22的时候  

配置 [~/.subversion/config]()
```ini
[tunnels]
...
ssh = ssh -p 22222
...
```

然后  
```sh
# 使用绝对SVN目录路径
svn checkout svn+ssh://USERNAME@SSH_HOST/path/to/the-svn-repo
```

要想禁止[SSH](http://www.openssh.com/) Key登录shell, 需要在[.ssh/authorized_keys]()上设置  
```
# --tunnel-user 不设置默认就是SSH用户名
command="svnserve --root=<ReposRootPath> --tunnel --tunnel-user=<RepoAuthUsername>",no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-pty ssh-rsa <YourPublicKey> <Comment>
```

然后  
```sh
# 使用相对SVN根目录路径
svn checkout svn+ssh://USERNAME@SSH_HOST/the-svn-repo
```

想要像[git-shelll](https://git-scm.com/docs/git-shell)一样, 可使用[svn-shell](https://github.com/QCute/svn-shell), 这样就可以在正常服务的同时禁止[SSH](http://www.openssh.com/) Key登录并显示友好信息  

[Widdows](https://www.microsoft.com/windows)客户端使用参考  
> [Securing Svnserve using SSH](https://tortoisesvn.net/ssh_howto.html)

用户以及用户组等和平常运维时一样  

```
Match User git
    X11Forwarding no
    AllowTcpForwarding no
    PermitTTY no
    AuthenticationMethods publickey
    ForceCommand /bin/bash -c "if [[ -n \"$SSH_ORIGINAL_COMMAND\" ]];then /bin/git-shell -c \"$SSH_ORIGINAL_COMMAND\"; else /bin/git-shell; fi"

Match User svn
    X11Forwarding no
    AllowTcpForwarding no
    PermitTTY no
    AuthenticationMethods publickey
    ForceCommand /bin/bash -c "if [[ -n \"$SSH_ORIGINAL_COMMAND\" ]];then /bin/svn-shell -c \"$SSH_ORIGINAL_COMMAND\"; else /bin/svn-shell; fi"


```