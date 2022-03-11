---
title: "Erlang进程字典"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
---

[进程字典]()使用的是hash分片方式存放  
> [ProcDict](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_process_dict.h#L31-L31)  

[进程字典]()的[get]()是非复制(Copy)的  
> [pd_hash_get_with_hval](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_process_dict.c#L472-L496)  

[进程字典]()的[put]()也是非复制(Copy)的  
> [pd_hash_put](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_process_dict.c#L717-L741)  

存放单个时使用[tuple](), 多个(哈希冲突), 使用[list](), 然后线性查找。  
