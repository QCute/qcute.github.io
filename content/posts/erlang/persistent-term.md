---
title: "Erlang持久对象(Persistent Term)"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
---

持久对象(Persistent Term)是[OTP-21.3](https://github.com/erlang.otp)之后引入的, 它的[get]()是非复制(Copy)的
> [persistent_term_get_1](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_bif_persistent.c#L477-L491)
> [lookup](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_bif_persistent.c#L962-L980)
> [get_bucket](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_bif_persistent.c#L66-L69)

而[ETS]()的[get]()是复制(Copy)的  
> [ets_lookup_2](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_db.c#L2496-L2519)
> [db_get_hash](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_db_hash.c#L1207-L1207)
> [build_term_list](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_db_hash.c#L1185-L1185)

在游戏服务器里面, 配置表通常会用[ETS]()或者[beam]()进行热更新, [ETS]()每一次[get]()都会复制, [beam]()每一次调用, 也是要重新构造一份数据的。如果你使用[OTP-21.3](https://github.com/erlang.otp)之后的版本, 可以结合持久对象(Persistent Term)做成[OOP]()那样的单例模式, 进一步提升计算性能和降低内存消耗。

参考[Erlang](https://erlang.org/)[博客](https://www.erlang.org/blog/)

> [Clever use of persistent_term](https://www.erlang.org/blog/persistent_term/)
