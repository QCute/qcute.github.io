---
title: "Erlang异步的实现"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
---

## 对于Bif
使用的是[BIF_TRAP](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/bif.h#L390-L432)宏

```c
#define ERTS_BIF_PREP_TRAP(Export, Proc, Arity)                               \
    do {                                                                      \
        (Proc)->i = (Export)->addresses[erts_active_code_ix()];               \
        (Proc)->arity = (Arity);                                              \
        (Proc)->freason = TRAP;                                               \
    } while(0);

#define BIF_TRAP1(Trap_, p, A0)                                               \
    do {                                                                      \
        Eterm* reg = erts_proc_sched_data((p))->registers->x_reg_array.d;     \
        ERTS_BIF_PREP_TRAP((Trap_), (p), 1);                                  \
        reg[0] = (A0);                                                        \
        return THE_NON_VALUE;                                                 \
    } while(0)
```

可见, 保存当前[PC](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_process.h#L1027), [寄存器数](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_process.h#L1020)和[失败原因](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_process.h#L1004)还有调用参数  

[beam_hot.h]()下call_bif指令  
```c
OpCase(call_light_bif_be):
{
  Export *export;
  ErtsBifFunc bf;

  Eterm result;
  ErlHeapFragment *live_hf_end;

  bf = (ErtsBifFunc) I[1];
  export = (Export*) I[2];

  if (!((FCALLS - 1) > 0 || (FCALLS-1) > neg_o_reds)) {
    /*
    * If we have run out of reductions, do a context
    * switch before calling the BIF.
    */
    c_p->arity = GET_EXPORT_ARITY(export);
    c_p->current = &export->info.mfa;
    goto context_switch3;
  }

  if (ERTS_UNLIKELY(export->is_bif_traced)) {
    ASSERT(VALID_INSTR(*(I+3)));
    *E = (BeamInstr) (I+3);;
    do {
      BeamInstr dis_next;
      Export *ep;

      ep = (Export*)(export);

      DTRACE_GLOBAL_CALL_FROM_EXPORT(c_p, ep);

      SET_I(ep->addresses[erts_active_code_ix()]);
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
    } while (0);
  }

  ERTS_MSACC_SET_BIF_STATE_CACHED_X(GET_EXPORT_MODULE(export), bf);

  PRE_BIF_SWAPOUT(c_p);
  ERTS_DBG_CHK_REDS(c_p, FCALLS);
  c_p->fcalls = FCALLS - 1;
  if (FCALLS <= 0) {
    save_calls(c_p, export);
  }
  ASSERT(!ERTS_PROC_IS_EXITING(c_p));
  ERTS_VERIFY_UNUSED_TEMP_ALLOC(c_p);
  live_hf_end = c_p->mbuf;
  ERTS_CHK_MBUF_SZ(c_p);

  result = (*bf)(c_p, reg, I);    // 调用

  /* Only heavy BIFs may GC. */
  ASSERT(E == c_p->stop);

  ERTS_CHK_MBUF_SZ(c_p);
  ASSERT(!ERTS_PROC_IS_EXITING(c_p) || is_non_value(result));
  ERTS_VERIFY_UNUSED_TEMP_ALLOC(c_p);
  ERTS_HOLE_CHECK(c_p);
  ERTS_REQ_PROC_MAIN_LOCK(c_p);
  if (ERTS_IS_GC_AFTER_BIF_DESIRED(c_p)) {
    Uint arity = GET_EXPORT_ARITY(export);
    result = erts_gc_after_bif_call_lhf(c_p, live_hf_end, result,
    reg, arity);
    E = c_p->stop;
  }
  HTOP = HEAP_TOP(c_p);
  FCALLS = c_p->fcalls;
  PROCESS_MAIN_CHK_LOCKS(c_p);
  ERTS_DBG_CHK_REDS(c_p, FCALLS);

  /*
  * We have to update the cache if we are enabled in order
  * to make sure no bookkeeping is done after we disabled
  * msacc. We don't always do this as it is quite expensive.
  */
  if (ERTS_MSACC_IS_ENABLED_CACHED_X()) {
    ERTS_MSACC_UPDATE_CACHE_X();
  }
  ERTS_MSACC_SET_STATE_CACHED_M_X(ERTS_MSACC_STATE_EMULATOR);
  if (ERTS_LIKELY(is_value(result))) {
    r(0) = result;
    CHECK_TERM(r(0));
    SET_I((BeamInstr *) I+3);
    Goto(*I);;
  } else if (c_p->freason == TRAP) {    // 失败原因是trap的情况
    /*
    * Set the continuation pointer to return to next
    * instruction after the trap (either by a return from
    * erlang code or by nif_bif.epilogue() when the BIF
    * is done).
    */
    ASSERT(VALID_INSTR(*(I+3)));
    *E = (BeamInstr) (I+3);;
    SET_I(c_p->i);
    do {
      BeamInstr dis_next;

      dis_next = *I;
      CHECK_ARGS(I);

      if (FCALLS > 0 || FCALLS > neg_o_reds) {    // 还有REDS, 继续
        FCALLS--;
        Goto(dis_next);
      } else {                                    // 没有则切换上下文
        goto context_switch;
      }
    } while (0);
  }

  /*
  * Error handling.  SWAPOUT is not needed because it was done above.
  */
  ASSERT(c_p->stop == E);
  I = handle_error(c_p, I, reg, &export->info.mfa);
  goto post_error_handling;
  ASSERT(!"Fell through 'call_light_bif' (-no_next)");
}

```

## 对于Nif
使用的是[YCF](https://github.com/erlang/otp/blob/maint-24/erts/lib_src/yielding_c_fun/README.md), YCF是一个源码转换工具, 使c语言支持yield功能, 相比其他有栈协程库, 它不需要保存调用栈  
