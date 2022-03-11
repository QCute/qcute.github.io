---
title: "LaravelAdmin在Laravel8以上页面消息出现两次的问题"
date: 2020-03-09T00:00:00+08:00
categories: ["php"]
---

解决[LaravelAdmin](https://laravel-admin.org)在[Laravel](https://laravel.com/) 8及以上, 使用[页面消息](https://laravel-admin.org/docs/zh/1.x/content-message)出现两次的问题  

把
```php
session()->flash($type, $message);
```

改成

```php
session()->now($type, $message);
```
即可

影响的函数
* [admin_success]()  
* [admin_error]()  
* [admin_warning]()  
* [admin_info]()  
* [admin_toastr]()  

但是, 在[数据表单](https://laravel-admin.org/docs/zh/1.x/data-form), handle函数里面使用, 以上函数会失效  
所以, 要么改, 然后在[数据表单](https://laravel-admin.org/docs/zh/1.x/data-form)里使用[session()->flash]()  
要么不改, 然后在正常表单里使用[session()->now]()  
