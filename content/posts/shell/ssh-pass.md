---
title: "一个简单的SSH Pass脚本"
date: 2020-03-10T00:00:00+08:00
categories: ["shell"]
---

* [sshpass]()
```sh
#!/usr/bin/env bash
# sshpass - use command line password with ssh
# inspire by https://github.com/huan/sshpass.sh
# ref to https://www.exratione.com/2014/08/bash-script-ssh-automation-without-a-password-prompt/
# the origin sshpass pass passphrase by pipe, but Symfony Process pipe need --enable-sigchild
# examples:
# sshpass <ssh or key passphrase> ssh <ssh options>
# sshpass <ssh or key passphrase> scp <scp options>
# sshpass <ssh or key passphrase> rsync <rsync options>
# sshpass <ssh or key passphrase> git <git options>
# sshpass <ssh or key passphrase> svn <svn options>

if [[ -n "${SSH_ASKPASS_PASSWORD}" ]];then
    cat <<< "${SSH_ASKPASS_PASSWORD}"
else
    export SSH_ASKPASS="$0"
    export SSH_ASKPASS_PASSWORD="$1"
    export DISPLAY=:0
    shift
    setsid "$@" </dev/null
fi
```

* [sshpass.cmd]()
```bat
@echo off
if "%SSH_ASKPASS_PASSWORD%" == "" ( 
    set SSH_ASKPASS=%~dp0%0
    set SSH_ASKPASS_PASSWORD=%1
    set DISPLAY=:0
    shift
    cmd /c "%2 %3 %4 %5 %6 %7 %8 %9"
) else (
    echo %SSH_ASKPASS_PASSWORD%
)
```

使用
```sh
sshpass your_passphrase ssh name@host "echo hello world"
```

适用于[SSH](http://www.openssh.com/)/[SCP](https://man.openbsd.org/scp.1)/[RSync](https://rsync.samba.org/)/[Git](https://git-scm.com/)/[SVN](https://subversion.apache.org/)等使用[SSH](http://www.openssh.com/)的命令  
