---
title: "一个简单的双向代理"
date: 2020-03-10T00:00:00+08:00
categories: ["shell"]
---

### 1. 使用fifo和nc
```sh
# client -> proxy:8974 -> server:8998
rm -f /tmp/fifo && mkfifo /tmp/fifo && nc -lkp 8974  < /tmp/fifo  | nc -lkp 8998 > /tmp/fifo
```

### 2. 使用socat
```sh
# client -> proxy:8974 -> server:8998
socat TCP4-LISTEN:8974,reuseaddr,fork TCP4:127.0.0.1:8998
```
