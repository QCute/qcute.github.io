---
title: "Erlang异常性能"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
---

因为erlang没有提前返回, 所以需要提前返回, 异常是一个不错的想法, 但又怕有性能问题, 下面来测试下。

```erl
ts_exception() ->

    {LoopOnly, _} = timer:tc(?MODULE, loop_only, [1000000, none, undefined, undefined]),

    {LoopInTryCatchOnly, _} = timer:tc(?MODULE, loop_in_try_catch_only, [1000000, none, undefined]),
    {LoopInTryCatchStacktraceOnly, _} = timer:tc(?MODULE, loop_in_try_catch_stacktrace_only, [1000000, none, undefined, undefined]),
    {LoopInCatchOnly, _} = timer:tc(?MODULE, loop_in_catch_only, [1000000, none]),

    {TryCatchThrow, _} = timer:tc(?MODULE, loop_try_catch, [1000000, throw, undefined]),
    {TryCatchError, _} = timer:tc(?MODULE, loop_try_catch, [1000000, error, undefined]),
    {TryCatchExit, _} = timer:tc(?MODULE, loop_try_catch, [1000000, exit, undefined]),

    {TryCatchStacktraceThrow, _} = timer:tc(?MODULE, loop_try_catch_stacktrace, [1000000, throw, undefined, undefined]),
    {TryCatchStacktraceError, _} = timer:tc(?MODULE, loop_try_catch_stacktrace, [1000000, error, undefined, undefined]),
    {TryCatchStacktraceExit, _} = timer:tc(?MODULE, loop_try_catch_stacktrace, [1000000, exit, undefined, undefined]),

    {CatchStacktraceThrow, _} = timer:tc(?MODULE, loop_catch, [1000000, throw]),
    {CatchStacktraceError, _} = timer:tc(?MODULE, loop_catch, [1000000, error]),
    {CatchStacktraceExit, _} = timer:tc(?MODULE, loop_catch, [1000000, exit]),


    io:format("LoopOnly:~tp~n", [LoopOnly]),
    io:format("LoopInTryCatchOnly:~tp~n", [LoopInTryCatchOnly]),
    io:format("LoopInTryCatchStacktraceOnly:~tp~n", [LoopInTryCatchStacktraceOnly]),
    io:format("LoopInCatchStacktraceOnly:~tp~n", [LoopInCatchOnly]),

    io:format("TryCatchThrow:~tp TryCatchError:~tp TryCatchExit:~tp~n", [TryCatchThrow, TryCatchError, TryCatchExit]),
    io:format("TryCatchStacktraceThrow:~tp TryCatchStacktraceError:~tp TryCatchStacktraceExit:~tp~n", [TryCatchStacktraceThrow, TryCatchStacktraceError, TryCatchStacktraceExit]),
    io:format("CatchStacktraceThrow:~tp CatchStacktraceError:~tp CatchStacktraceExit:~tp~n", [CatchStacktraceThrow, CatchStacktraceError, CatchStacktraceExit]).

loop_only(0, _, _, _) -> ok;
loop_only(Times, Class, R, S) ->
    make_an_exception(Class),
    loop_only(Times - 1, Class, R, S).

loop_in_try_catch_only(0, _, _) -> ok;
loop_in_try_catch_only(Times, Class, R) ->
    try
        make_an_exception(Class),
        loop_in_try_catch_only(Times - 1, Class, R)
    catch
        Class:Reason ->
            loop_in_try_catch_only(Times - 1, Class, Reason)
    end.

loop_in_try_catch_stacktrace_only(0, _, _, _) -> ok;
loop_in_try_catch_stacktrace_only(Times, Class, R, S) ->
    try
        make_an_exception(Class),
        loop_in_try_catch_stacktrace_only(Times - 1, Class, R, S)
    catch
        Class:Reason:Stacktrace ->
            loop_in_try_catch_stacktrace_only(Times - 1, Class, Reason, Stacktrace)
    end.

loop_in_catch_only(0, _) -> ok;
loop_in_catch_only(Times, Class) ->
    catch make_an_exception(Class),
    loop_in_catch_only(Times - 1, Class).

loop_try_catch(0, _, _) -> ok;
loop_try_catch(Times, Class, _) ->
    try
        make_an_exception(Class)
    catch
        Class:Reason ->
            loop_try_catch(Times - 1, Class, Reason)
    end.

loop_try_catch_stacktrace(0, _, _, _) -> ok;
loop_try_catch_stacktrace(Times, Class, _, _) ->
    try
        make_an_exception(Class)
    catch
        Class:Reason:Stacktrace ->
            loop_try_catch_stacktrace(Times - 1, Class, Reason, Stacktrace)
    end.

loop_catch(0, _) -> ok;
loop_catch(Times, Class) ->
    catch make_an_exception(Class),
    loop_catch(Times - 1, Class).

make_an_exception(Class) ->
    case Class of
        throw -> erlang:throw(ladies);
        error -> erlang:error(ladies);
        exit -> erlang:exit(ladies);
        _ -> nothing_wrong
    end.

```

### 时间  

## 不带stacktrace
| Loop               | Time   |
|--------------------|--------|
| None               | 6161   |
| TryCatch           | 130163 |
| TryCatchStacktrace | 31760  |
| CatchStacktrace    | 6142   |

## 携带stacktrace
| Exception          | Throw  | Error  | Exit   |
|--------------------|--------|--------|--------|
| TryCatch           | 76689  | 73875  | 73508  |
| TryCatchStacktrace | 555028 | 557794 | 547894 |
| CatchStacktrace    | 72909  | 73629  | 72771  |

### 结论
在不发生异常的情况下  
- 频繁进入try/catch性能很差。  
- 直接catch性能反而没什么损失。 

在发生异常的情况下  
- 异常比正常返回慢了十几倍。  
- 带stacktrace的try/catch性能是最差的, 比其他两种方法相差近8倍。  

所以, 异常能不用就不用, 哪怕在[JIT]()预热后还是挺慢的。
