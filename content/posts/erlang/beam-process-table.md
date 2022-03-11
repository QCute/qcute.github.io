---
title: "Erlang进程表"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
---

以前以为进程表是用B树之类的存储, 后来才发现是用索引表  

参考[Erlang](https://erlang.org/)[内部文档](https://www.erlang.org/doc/apps/erts/internal_docs.html)  
> [进程和端口表](https://www.erlang.org/doc/apps/erts/ptables)

代码  

> [ErtsPTab](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_ptab.h#L122-L147)

学习了  
