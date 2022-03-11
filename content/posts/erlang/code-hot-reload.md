---
title: "Erlang热更新的实现"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
---

## 从一个基本调用开始
```asm
{function, call, 0, 2}.
  {label,1}.
    {line,[{location,"src/examples/test/test.erl",9}]}.
    {func_info,{atom,test},{atom,call},0}.
  {label,2}.
    {move,{atom,c},{x,0}}.
    {line,[{location,"src/examples/test/test.erl",10}]}.
    {call_ext_only,1,{extfunc,a,b,1}}.
```

`call_ext_only`指令位于[beam_hot.h](erts/emulator/x86_64-pc-linux-gnu/opt/emu/beam_hot.h)文件，在编译时使用[ops.tab](erts/emulator/beam/emu/ops.tab)文件生成

接下来看下指令代码

```c
OpCase(i_call_ext_last_eQ):
{
  E = ADD_BYTE_OFFSET(E, I[2]);;
  do {
    BeamInstr dis_next;
    Export *ep;

    ep = (Export*)(I[1]);

    DTRACE_GLOBAL_CALL_FROM_EXPORT(c_p, ep);

    SET_I(ep->dispatch.addresses[erts_active_code_ix()]);
    CHECK_ARGS(I);
    dis_next = *I;

    if (ERTS_UNLIKELY(FCALLS <= 0)) {
      if (ERTS_PROC_GET_SAVED_CALLS_BUF(c_p) && FCALLS > neg_o_reds) {
        save_calls(c_p, ep);
      } else {
        goto context_switch;
      }
    }

    FCALLS--;
    Goto(dis_next);
  } while (0);ASSERT(!"Fell through 'i_call_ext_last' (-no_next)");
}
```

`Export`导出结构和`erts_active_code_ix`激活代码地址索引是我们想要了解的

## 两个代码相关的核心模块

## [erts_code_purger.erl](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erts_code_purger.erl)
* 硬清理 [erts_code_purger:purge/2](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erts_code_purger.erl#L117)
* 软清理 [erts_code_purger:soft_purge/2](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erts_code_purger.erl#L114)
* 清理接口[erts_internal_purge_module_2](erts/emulator/beam/beam_bif_load.c)

> 清理接口主要检测是否有进程正在占用当前代码

> 清理主要分两步，prepare和abort/complete

> 硬清理和软清理区别在于是否终止正在使用此代码的进程

## [code.erl](https://github.com/erlang/otp/blob/maint-24/lib/kernel/src/code.erl)
* 加载文件(模块) [code_server:load_file/3](https://github.com/erlang/otp/blob/maint-24/lib/kernel/src/code_server.erl#L1155)
* 加载模块服务管理 [code_server:try_load_module_2/6](https://github.com/erlang/otp/blob/maint-24/lib/kernel/src/code_server.erl#L1127-L1138)
* 加载模块接口 [erlang:load_module/2](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erlang.erl#L2514-L2529)


## 两个核心函数

### [erlang:prepare_loading/2](https://github.com/erlang/otp/blob/maint-24/lib/erlang/lib/erts/src/erlang.erl#L1689)

* 包装函数 [erts_internal_prepare_loading_2](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_bif_load.c#L246)
* 主函数 [erts_prepare_loading](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_load.c#L107)
* 读取(解码)字节码 [beamfile_read](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_file.c#L727)
* 加载字节码 [load_code](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_load.c#L362)

> 加载阶段主要就是检查字节码有效性并加载到内存中

### [erlang:finish_loading/1](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erlang.erl#L978)

* 检查权限/是否正在加载/是否被清理过等 [finish_loading_1](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_bif_load.c#L333)
* 加载模块 [finish_loading_1](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_load.c#L190)

> 代码[`beam_make_current_old`](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_load.c#L208)是把当前数据移动到旧数据

> 代码[`export_list`](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_load.c#L221)正是导出函数功能

> 代码[`trampoline`](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/beam_load.c#L235-l236)是切换暂存地址到激活地址

> 同一个模块有两份数据，一份正在(激活)使用，一份旧(副本)数据。如果旧数据正在被进程占用，[`soft_purge`](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erts_code_purger.erl#L114)不能清理旧代码，也就说无法进行热更新新的代码
