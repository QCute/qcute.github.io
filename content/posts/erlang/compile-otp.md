---
title: "编译Erlang虚拟机"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
---

> 环境为RHEL/CentOS/RockyLinux 8

### 1. 安装编译依赖
```sh
# 基础curses/ssl
dnf install gcc make ncurses-devel openssl-devel -y
# 可选hipe依赖
dnf install llvm autoconf m4 -y
# 启用epel仓库
dnf install epel-release -y
# 可选jdk/odbc/wxWidgets
dnf install java-11-openjdk-devel unixODBC-devel libxslt-devel wxGTK3-devel gcc-c++ -y
# 可选apache fop
version=$(curl -s http://archive.apache.org/dist/xmlgraphics/fop/binaries/ | grep -Po "(?<=fop-).*?(?=-bin\.zip)" | sort -n | tail -n 1)
dnf install wget -y
wget http://archive.apache.org/dist/xmlgraphics/fop/binaries/fop-"${version}"-bin.tar.gz
tar -xf fop-"${version}"-bin.tar.gz -C /usr/local/
rm fop-"${version}"-bin.tar.gz
ln -s /usr/local/fop-"${version}"/fop/fop /usr/local/bin/fop
```

### 2. 配置
OTP 24之前 (开启HIPE)  

```sh
./configure --enable-kernel-poll --enable-fips --enable-m64-build --enable-native-libs --enable-hipe
```

OTP 24之后 (开启JIT)  

```sh
./configure --enable-kernel-poll --enable-fips --enable-m64-build --enable-jit
```

### 3. 编译

```sh
make -j "$(grep -c "processor" /proc/cpuinfo)"
```

```sh
# 可选strip, 减少二进制体积
find ./bin/ -type f -exec file {} \; | grep "not stripped" | awk -F ":" '{print $1}' | xargs -n 1 strip
```

```sh
# 可选替换软链接绝对路径为相对路径
sed -i "s/\"s;%FINAL_ROOTDIR%;\$TARGET_ERL_ROOT;\"/\"s;%FINAL_ROOTDIR%;\\\\\$(dirname \\\\\$(dirname \\\\\$(readlink -f \\\\\$0)));\"/" ./erts/etc/common/Install
```

### 4. 安装

```sh
make install
```
