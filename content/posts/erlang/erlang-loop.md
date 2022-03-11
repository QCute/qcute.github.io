---
title: "Erlang实现函数内的循环"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
---

[erlang](https://github.com/erlang/otp/)语义上绑定的变量是不可变的, 函数内也没有for/while/loop等循环  
但是, 函数式语言, 函数是第一等公民, 当然是可以通过[命名]()高阶函数实现循环  

```erl
-module(test).
main(_) ->
    Sum = fun
        Loop(10, Sum) ->
            Sum;
        Loop(N, Sum) ->
            Loop(N + 1, Sum + N)
    end(1, 0),
    io:format("loop: ~p~n", [Sum]). %% 45
```

有了这个, 在[-eval](https://www.erlang.org/doc/man/erl.html#-eval)上写脚本就方便了很多, 不用另外写在单独的脚本文件上  
