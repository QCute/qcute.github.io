---
title: "Erlang函数调用方式性能"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
---

老生常谈的, 包括[Myths](https://www.erlang.org/doc/efficiency_guide/retired_myths#myth--funs-are-slow), 下面测试下几种调用方式的性能差距。

```erl
test_apply() ->
    L = lists:seq(1, 10000000),
    LocalTime = os:timestamp(),
    [jp() || _ <- L],
    RemoteTime = os:timestamp(),
    [?MODULE:jp() || _ <- L],
    ApplyTime = os:timestamp(),
    [apply(?MODULE, jp, []) || _ <- L],
    ExecuteTime = os:timestamp(),
    Module = ?MODULE,
    Function = jp,
    [Module:Function() || _ <- L],
    ApplyFunctionTime = os:timestamp(),
    [apply(fun ?MODULE:jp/0, []) || _ <- L],
    ExecuteFunctionTime = os:timestamp(),
    F = fun ?MODULE:jp/0,
    [F() || _ <- L],
    LambdaFunctionTime = os:timestamp(),
    FF = fun() -> "にほんご" end,
    [apply(FF, []) || _ <- L],
    EndTime = os:timestamp(),
    io:format("Local:~p Remote:~p Apply(M,F,A):~p M:F(A):~p Apply(fun,A):~p F:(A):~p FF(A):~p~n", [timer:now_diff(RemoteTime, LocalTime), timer:now_diff(ApplyTime, RemoteTime), timer:now_diff(ExecuteTime, ApplyTime), timer:now_diff(ApplyFunctionTime, ExecuteTime), timer:now_diff(ExecuteFunctionTime, ApplyFunctionTime), timer:now_diff(LambdaFunctionTime, ExecuteFunctionTime), timer:now_diff(EndTime, LambdaFunctionTime)]),
    ok.

more_test() ->
    L = lists:seq(1, 1000),
    [test() || _ <- L],
    ok.
test() ->
    O = 10000000,
    L = lists:seq(1, O),
    Begin = os:timestamp(),
    %% first
    F = fun jp/0,
    [F() || _ <- L],
    %% [?MODULE:jp() || _ <- L],
    %% middle
    Middle = os:timestamp(),
    %% middle
    [apply(fun jp/0, []) || _ <- L],
    %% [apply(?MODULE, jp, []) || _ <- L],
    %% [?MODULE:jp() || _ <- L],
    %% second
    End = os:timestamp(),
    %% diff
    First = timer:now_diff(Middle, Begin) div 1000,
    Second = timer:now_diff(End, Middle) div 1000,
    io:format("First:~p   Second:~p~n", [First, Second]),
    ok.

%% にほんご
jp() ->
    "にほんご".
jps() ->
    <<"にほんご"/utf8>>.
```

### 时间如下, 测试环境为[OTP-24(JIT)]()
| Method       | Time  | Time  | Time  |
|--------------|-------|-------|-------|
| Local        | 36371 | 34962 | 35632 |
| Remote       | 38037 | 37300 | 37544 |
| apply(M,F,A) | 38141 | 38635 | 38756 |
| M:F(A)       | 36348 | 36603 | 35734 |
| apply(fun,A) | 36422 | 36082 | 35405 |
| F(A)         | 36588 | 36039 | 35686 |
| FF(A)        | 83646 | 78447 | 72395 |


### 结论
可见, 前几种调用方式差距不算很大, 只是最后apply lambda函数的情况下差距较大。在[OTP-24 with (JIT)]()之后, 想要抽象也不需要付出很大的性能代价, 放心尽情地使用吧。