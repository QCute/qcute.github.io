---
title: "acme.sh手动安装"
date: 2020-03-07T00:00:00+08:00
categories: ["misc"]
---

官方自动安装脚本是使用[--install-online](https://github.com/acmesh-official/get.acme.sh/blob/master/index.html#L49)模式，在网络通畅的情况下是很不错的，但是国内嘛...

# 1. 克隆仓库(或直接下载解压)
```sh
git clone --depth=1 https://github.com/acmesh-official/acme.sh && cd acme.sh
# 国内使用Gitee镜像
git clone --depth=1 https://gitee.com/neilpang/acme.sh && cd acme.sh
```

# 2. 安装依赖
```sh
# Debian/Ubuntu
apt install curl wget openssl socat crontab -y
# ReHat/CentOS 8.x以下
yum install curl wget openssl socat crontab -y
# ReHat/CentOS 8.x以上
dnf install curl wget openssl socat crontab -y
```

# 3. 安装
```sh
# 安装
./acme.sh --install
# 注册账号
acme.sh --register-account -m my@example.com
# 删除仓库
cd ../ && rm -rf ./acme.sh
```

或者指定邮箱，直接注册

```sh
./acme.sh --install my@example.com
# 删除仓库
cd ../ && rm -rf ./acme.sh
```

# 4. 更换[ACME]()服务器
acme.sh默认向[zerossl](https://zerossl.com/)申请证书，但是最近申请证书时总是超时(Timeout)  
例如选择[Let's Encrypt](https://letsencrypt.org/), 需要重新向注册账号  
```sh
acme.sh --server letsencrypt --register-account -m my@example.com
```

申请证书时, 指定服务器  
```sh
acme.sh --server letsencrypt --issue -d example.com --standalone
```

或者设置默认[CA]()服务器  
```sh
acme.sh --set-default-ca --server letsencrypt
```

# 参考
> [acme.sh wiki](https://github.com/acmesh-official/acme.sh/wiki)  
> [Supported CA](https://github.com/acmesh-official/acme.sh#supported-ca)  


如果只有sudoers权限, 没有root权限或者不想安装到root目录下的情况下, 可以修改[crontab](), 使用从stdin读取密码的[sudo]()命令, 然后在脚本上增加[--force]()选项  
```sh
37 0 * * * /bin/echo "你的用户密码" | /bin/sudo -S  "/home/m/.acme.sh"/acme.sh --force --cron --home "/home/m/.acme.sh" > /dev/null  
```

# 参考
> [sudo](https://github.com/acmesh-official/acme.sh/wiki/sudo)  
