---
title: "RockyLinux调整分区大小"
date: 2020-03-10T00:00:00+08:00
categories: ["shell"]
---

1. 先备份整个[home]()目录

2. 卸载[home]()目录
```sh
umount /home
```

3. 移除[home]()卷
```sh
lvremove /dev/mapper/rl-home
```

4. 调整[home]()卷大小
```sh
lvresize -L -10G /dev/mapper/rl-home
```

5. 调整[root]()卷大小
```sh
lvextend -L +10G /dev/mapper/rl-root
```

6. 同步[root]()卷大小
```sh
xfs_growfs /dev/mapper/rl-root
```

7. 使用[pvs]()查看卷
```sh
  PV         VG Fmt  Attr PSize    PFree
  /dev/sda3  rl lvm2 a--  <120.00g    0
```

8. 将剩余空间分配给[home]()卷
```sh
lvcreate -l +100%Free -n home rl
```

9. 写入分区
```sh
mkfs.xfs /dev/mapper/rl-home
```

10. 挂载[home]()卷
```sh
mount /dev/mapper/rl-home /home
```
