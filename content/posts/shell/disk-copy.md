---
title: "记录一次RockyLinux UEFI磁盘迁移(扩展)"
date: 2020-03-10T00:00:00+08:00
categories: ["shell"]
---

1. 使用任意软件, 例如[傲梅](https://www.disktool.cn/), 进行磁盘一比一直接克隆

2. 从新硬盘启动系统, 出现卡住的情况, 一般是复制的时候EFI分区UUID更改了(生成新的)
```sh
A stop job is running for dev-disk-by\x2duuid-6C02\x2dB99B.device
```

3. 等待一会后, 键入root密码, 进入紧急模式

- 使用[blkid]()查看块UUID, [/dev/sda1]()正是EFI分区
```sh
/dev/sda1: SEC_TYPE="msdos" UUID="0000-4823" BLOCK_SIZE="512" TYPE="vfat" PARTLABEL="EFI system partition" PARTUUID="182ddd5c-fc1b-11ee-bc5d-c3b5b8bd8720"
/dev/sda2: UUID="fa5133df-3efe-40d8-8386-2599e0bc6417" BLOCK_SIZE="512" TYPE="xfs" PARTUUID="182ddd60-fc1b-11ee-bc5d-c3b5b8bd8720"
/dev/sda3: UUID="LCzkNd-2bJU-hk6q-YIeS-RBnM-XY0f-u91TAG" TYPE="LVM2_member" PARTUUID="182ddd64-fc1b-11ee-bc5d-c3b5b8bd8720"
/dev/mapper/rl-root: UUID="0e5e4a9c-cbb1-40b4-ac83-7a5021b10e31" BLOCK_SIZE="512" TYPE="xfs"
/dev/mapper/rl-swap: UUID="717d74bc-390f-47b5-83ed-e9322bbcbbe3" TYPE="swap"
/dev/mapper/rl-home: UUID="013f7c16-aaa4-4346-b9c8-4bb02cc456cd" BLOCK_SIZE="512" TYPE="xfs"
```

- 修改[/etc/fstab]()上[/boot/efi]()的UUID, 重启即可
```sh
#
# /etc/fstab
# Created by anaconda on Thu Apr  7 07:46:10 2022
#
# Accessible filesystems, by reference, are maintained under '/dev/disk/'.
# See man pages fstab(5), findfs(8), mount(8) and/or blkid(8) for more info.
#
# After editing this file, run 'systemctl daemon-reload' to update systemd
# units generated from this file.
#
/dev/mapper/rl-root     /                       xfs     defaults        0 0
UUID=fa5133df-3efe-40d8-8386-2599e0bc6417 /boot                   xfs     defaults        0 0
UUID=0000-4823          /boot/efi               vfat    umask=0077,shortname=winnt 0 2
/dev/mapper/rl-home     /home                   xfs     defaults        0 0
/dev/mapper/rl-swap     none                    swap    defaults        0 0
```

4. 调整磁盘大小
```sh
parted /dev/sda
```

5. 对LVM分区进行扩容
```sh
resizepart 3 100%
```

6. 对分区物理卷进行扩容
```sh
pvresize /dev/sda3
```

5. 使用[pvs]()查看卷
```sh
  PV         VG Fmt  Attr PSize   PFree
  /dev/sda3  rl lvm2 a--  929.92g    0
```

6. 使用[vgdisplay]()查看卷组情况
```sh
  --- Volume group ---
  VG Name               rl
  System ID
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  7
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                3
  Open LV               3
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               929.92 GiB
  PE Size               4.00 MiB
  Total PE              238060
  Alloc PE / Size       28211 / <110.20 GiB
  Free  PE / Size       209849 / 819.72 GiB
  VG UUID               rFnljf-9GxD-tS5t-8b6e-esEc-E2Jc-Lg2tpC
```

7. 扩展[root]()卷大小
```sh
lvextend -l +100%FREE /dev/mapper/rl-root
```

8. 同步[root]()卷文件系统
```sh
xfs_growfs /dev/mapper/rl-root
```

9. 使用[df -h]()查看磁盘情况
```sh
Filesystem           Size  Used Avail Use% Mounted on
devtmpfs              16G     0   16G   0% /dev
tmpfs                 16G   13M   16G   1% /dev/shm
tmpfs                 16G   26M   16G   1% /run
tmpfs                 16G     0   16G   0% /sys/fs/cgroup
/dev/mapper/rl-root  913G   64G  849G   7% /
/dev/sda2           1014M  251M  764M  25% /boot
/dev/sda1            600M  6.0M  594M   1% /boot/efi
/dev/mapper/rl-home  9.6G  746M  8.9G   8% /home
tmpfs                3.2G   32K  3.2G   1% /run/user/1000
```
