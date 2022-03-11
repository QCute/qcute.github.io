---
title: "Erlang ETS内部数据结构"
date: 2020-03-04T00:00:00+08:00
categories: ["erlang"]
--- 

### 1. set/bag/duplicate_bag使用的是哈希表  
> [IS_HASH_TABLE](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_db_util.h#L352-L353)

### 2. ordered_set使用的是AVL树

> [IS_TREE_TABLE](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_db_util.h#L354-L355)

为了提升并发写性能, 在OTP22之后引入了CAS(contention adapting search)树  

> [IS_CATREE_TABLE](https://github.com/erlang/otp/blob/maint-24/erts/emulator/beam/erl_db_util.h#L356-L357)


参考[Erlang](https://erlang.org/)[博客](https://www.erlang.org/blog/)

> [The New Scalable ETS ordered_set](https://www.erlang.org/blog/the-new-scalable-ets-ordered_set/)
