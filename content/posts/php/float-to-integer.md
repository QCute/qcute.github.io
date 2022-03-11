---
title: "PHP 浮点数转整形问题"
date: 2020-03-09T00:00:00+08:00
categories: ["php"]
---

PHP使用[int]()或[intval]()转换浮点数会导致精度丢失问题

```php
var_dump(19.90 * 100);
## float(1990)

var_dump(intval(19.90 * 100));
## int(1989)
```

实际开发要用下面代码的来进行转换

```php
var_dump(floatval(19.90) * 100);
## float(1990)

intval(round(floatval(19.90) * 100));
## int(1990)
```
