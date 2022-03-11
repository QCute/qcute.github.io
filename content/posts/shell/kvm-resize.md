---
title: "KVM调整磁盘大小"
date: 2020-03-10T00:00:00+08:00
categories: ["shell"]
---

# 一、创建新空间并复制旧数据
* 1.创建一块大小100G的空硬盘
```sh
qemu-img create -f qcow2 new.qcow2 100G
```

* 2.使用virt-resize进行对要扩大的分区进行扩容
```sh
virt-resize --expand /dev/sda1 old.qcow2 new.qcow2
```
> virt-resize 在 guestfs-tools 或者 libguestfs-tools 上

# 二、直接扩大磁盘的大小

```sh
qemu-img resize old.qcow2 +10G
```

# 三、完成后使用 qemu-img 和 virt-df 查看镜像信息
```sh 
$ qemu-img info new.qcow2
image: new.qcow2
file format: qcow2
virtual size: 32 GiB (34359738368 bytes)
disk size: 16 GiB
cluster_size: 65536
Format specific information:
    compat: 1.1
    compression type: zlib
    lazy refcounts: true
    refcount bits: 16
    corrupt: false
    extended l2: false

$ virt-df new.qcow2
Filesystem                           1K-blocks       Used  Available  Use%
new.qcow2:/dev/sda1                    6054432    5122484     603452   85%
new.qcow2:/dev/sda5                   10264092     509272    9211844    5%
```
