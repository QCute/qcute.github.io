---
title: "Git/SVN禁止SSH登录shell并输出提示"
date: 2020-03-07T00:00:00+08:00
categories: ["misc"]
---

1. 新建[git-shell-commands/svn-shell-commands]()目录  
```sh
# git
mkdir -p git-shell-commands

# svn
mkdir -p svn-shell-commands
```

2. 创建[no-interactive-login]()文件  
```sh
# git
cat > git-shell-commands/no-interactive-login << EOF
#!/bin/sh
printf '%s\n' "Hi $USER! You've successfully authenticated, but I does not provide interactive shell access."
exit 128
EOF
chmod +x git-shell-commands/no-interactive-login

# svn
cat > svn-shell-commands/no-interactive-login << EOF
#!/bin/sh
printf '%s\n' "Hi $USER! You've successfully authenticated, but I does not provide interactive shell access."
exit 128
EOF
chmod +x svn-shell-commands/no-interactive-login
```

3. 配置[sshd_config]()  
```sshd_config
# git
Match User git
    X11Forwarding no
    AllowTcpForwarding no
    PermitTTY no
    AuthenticationMethods publickey
    ForceCommand /bin/bash -c "if [[ -n \"$SSH_ORIGINAL_COMMAND\" ]];then /bin/git-shell -c \"$SSH_ORIGINAL_COMMAND\"; else /bin/git-shell; fi"

# svn
Match User svn
    X11Forwarding no
    AllowTcpForwarding no
    PermitTTY no
    AuthenticationMethods publickey
    ForceCommand /bin/bash -c "if [[ -n \"$SSH_ORIGINAL_COMMAND\" ]];then /bin/svn-shell -c \"$SSH_ORIGINAL_COMMAND\"; else /bin/svn-shell; fi"

```

4. [SSH](http://www.openssh.com/)登录时显示
> Hi git! You've successfully authenticated, but I does not provide shell access.

> Hi svn! You've successfully authenticated, but I does not provide shell access.