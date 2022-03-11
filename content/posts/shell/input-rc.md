---
title: "软链接路径tab补全斜杠号"
date: 2020-03-10T00:00:00+08:00
categories: ["shell"]
---

修改 [/etc/inputrc]() 
```sh
# Completed names which are symbolic links to
# directories have a slash appended.
set mark-symlinked-directories on
```
这样, 软链接就可以像普通目录一样补全斜杠[/]()号了  
不过, 删除的时候就要小心了, 不要带上后面的斜杠[/]()号, 不然就会把源目录一起删掉  
