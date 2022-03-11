---
title: "Service Unit User问题"
date: 2020-03-10T00:00:00+08:00
categories: ["shell"]
---

今天发现php的[getenv](https://www.php.net/manual/zh/function.getenv.php)函数返回false  

```php
getenv('HOME')
```

由于是系统是运行在system daemon下的, 查看了service unit, 里面并无指定具体的user  

所以, 在Service里面添加User  

```sh
[Service]
# specific user
User=root
```

函数就可以正确获取到数据了  
