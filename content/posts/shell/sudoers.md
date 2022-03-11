---
title: "sudoers免密码"
date: 2020-03-10T00:00:00+08:00
categories: ["shell"]
---

修改 [/etc/sudoers]() 

1. [Debian](https://www.debian.org/)/[Ubuntu](https://ubuntu.com/)
```sh
# User privilege specification
root    ALL=(ALL:ALL) ALL

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL

# See sudoers(5) for more information on "@include" directives:
user    ALL=(ALL) NOPASSWD:ALL
```

2. [RedHat](https://www.redhat.com/)/[CentOS](https://www.centos.org/)/[RockyLinux](https://rockylinux.org/)
```
## Allow root to run any commands anywhere
root    ALL=(ALL)       ALL
user    ALL=(ALL)       NOPASSWD:ALL
## Allows members of the 'sys' group to run networking, software,
## service management apps and more.
# %sys ALL = NETWORKING, SOFTWARE, SERVICES, STORAGE, DELEGATING, PROCESSES, LOCATE, DRIVERS

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL

## Same thing without a password
%wheel  ALL=(ALL)       NOPASSWD: ALL

```