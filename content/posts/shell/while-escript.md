---
title: "记一次bash的while循环中使用escript的问题"
date: 2020-03-10T00:00:00+08:00
categories: ["shell"]
--- 

### 问题
在一次写脚本时，偶然发现了当[Escript](https://www.erlang.org/doc/man/escript.html)在[Bash](https://github.com/gitGNU/gnu_bash)的while中使用时，循环里明明有很多次，但是[Escript](https://www.erlang.org/doc/man/escript.html)却只执行了一次的问题。

[Escript](https://www.erlang.org/doc/man/escript.html)执行脚本test.erl时，启动命令如下  

```shell
test.erl -B -- -root /usr/lib/erlang -progname erl -- -home /home/m -- -boot no_dot_erlang -noshell -run escript start -extra test.erl
```

命令里有[-noshell](https://www.erlang.org/doc/man/erl.html#-noshell)标识，此时erlang不会启动shell  

原因就是在[Escript](https://www.erlang.org/doc/man/escript.html)模式下，[Erlang](https://github.com/erlang/otp)不会启动shell，但是仍然会从stdin中读取输入，而while读取下一次内容时就会向stdin输入内容，而内容则被[Erlang](https://github.com/erlang/otp)读取了，循环也就“结束”了。  


解决办法就是在命令行加上 < /dev/null 使stdin重定向到null上，也就是禁用stdin  

```shell
escript test.erl < /dev/null
```

或者在脚本文件的shebang行上加上[-noinput](https://www.erlang.org/doc/man/erl.html#-noinput)标识，来禁用输入  

```erl
%%! -noinput
```

### 思考

此问题类似于在while循环中使用ssh、scp或者sshpass等会使用到stdin的命令的时候，需要加上 < /dev/null，不然循环只会执行一次。  

### 参考

* [-noshell](https://www.erlang.org/doc/man/erl.html#-noshell)标识  
> Ensures that the Erlang runtime system never tries to read any input. Implies -noshell.  

* [-noinput](https://www.erlang.org/doc/man/erl.html#-noinput)标识  
> Starts an Erlang runtime system with no shell. This flag makes it possible to have the Erlang runtime system as a component in a series of Unix pipes.
