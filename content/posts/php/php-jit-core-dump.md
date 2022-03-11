---
title: "PHP JIT Core Dump问题"
date: 2020-03-09T00:00:00+08:00
categories: ["php"]
---

记一次[Laravel](https://github.com/laravel/framework) [Octane](https://github.com/laravel/octane)([Swoole](https://github.com/swoole/swoole-src))在[PHP](https://github.com/php/php-src)8开启jit造成的core dump的问题  

原jit配置   
```ini
opcache.jit=1255
```

改成  
```ini
opcache.jit=1205  
```
即可  
