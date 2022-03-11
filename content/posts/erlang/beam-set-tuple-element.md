---
title: "Erlang更新Record的优化"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
--- 

Record的更新使用的是[erlang:setelement/3](https://github.com/erlang/otp/blob/maint-24/erts/preloaded/src/erlang.erl#L2589), 在更新多个字段的时候很浪费性能以及内存  
后来引入了一个破坏性的优化指令: set_tuple_element  

```erl
-record(record, {a, b, c, d, e, f}).

update(R) ->
    R#record{a = 1, b = 2}.

```


```beam
{function, update, 1, 8}.
  {label,7}.
    {line,[{location,"test.erl",3}]}.
    {func_info,{atom,user_default},{atom,update},1}.
  {label,8}.
    {test,is_tagged_tuple,{f,9},[{x,0},7,{atom,record}]}.
    {allocate,0,1}.
    {move,{x,0},{x,1}}.
    {move,{integer,2},{x,2}}.
    {move,{integer,3},{x,0}}.
    {line,[{location,"test.erl",4}]}.
    {call_ext,3,{extfunc,erlang,setelement,3}}.
    {set_tuple_element,{integer,1},{x,0},1}.
    {deallocate,0}.
    return.
  {label,9}.
    {move,{literal,{badrecord,record}},{x,0}}.
    {call_ext_only,1,{extfunc,erlang,error,1}}.
```

参考Github [Issues](https://github.com/erlang/otp/issues)  

> [Do the destructive setelement optimization in SSA](https://github.com/erlang/otp/pull/2146)

[miff](https://github.com/QCute/miff)就是利用其set_tuple_element指令, 在库内部使用可编写高性能可变的数据结构
