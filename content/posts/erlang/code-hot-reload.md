---
title: "Erlang热更新的实现"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
---

## [erts_code_purger.erl](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erts_code_purger.erl)
* 硬清除 [erts_code_purger:purge/2](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erts_code_purger.erl#L117)
* 软清除 [erts_code_purger:soft_purge/2](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erts_code_purger.erl#L114)


## [code.erl](https://github.com/erlang/otp/blob/maint-24/lib/kernel/src/code.erl)
* 加载文件(模块) [code_server:load_file/3](https://github.com/erlang/otp/blob/maint-24/lib/kernel/src/code_server.erl#L1155)
* 加载模块 [code_server:try_load_module_2/6](https://github.com/erlang/otp/blob/maint-24/lib/kernel/src/code_server.erl#L1127-L1138)

## 两个核心函数
### [erlang:prepare_loading/2](https://github.com/erlang/otp/blob/maint-24/lib/erlang/lib/erts/src/erlang.erl#L1689)

* 包装函数 [erts_internal_prepare_loading_2](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_bif_load.c#L246)
* 主函数 [erts_prepare_loading](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_load.c#L107)
* 读取(解码)字节码 [beamfile_read](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_file.c#L727)
* 加载字节码 [load_code](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_load.c#L362)


### [erlang:finish_loading/1](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erlang.erl#L978)

* 主函数 [finish_loading_1](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_bif_load.c#L333)
