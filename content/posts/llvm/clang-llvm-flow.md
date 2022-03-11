---
title: "Clang/LLVM编译流程"
date: 2020-03-06T00:00:00+08:00
categories: ["llvm"]
---

# 1 [.c]()(源文件) -> [.i]()(预处理文件)
```sh
clang -E -c test.c -o test.i
```

* ### 1.1 [.c]()(源文件) -> [.bc]()(LLVM IR文件(二进制形式))
```sh
clang -emit-llvm test.c -c -o test.bc
```

* ### 1.2 [.c]()(源文件) -> [.ll]()(LLVM IR文件(文本形式))
```sh
clang -emit-llvm test.c -S -o test.ll
```

# 2 [.i]()(预处理文件) -> [.bc]()(LLVM IR文件(二进制形式))
```sh
clang -emit-llvm test.i -c -o test.bc
```

* ### 2.1 [.i]()(预处理文件) -> [.ll]()(LLVM IR文件(文本形式))
```sh
clang -emit-llvm test.i -S -o test.ll
```

* ### 2.2 [.bc]()(LLVM IR文件(二进制形式)) -> [.ll]()(LLVM IR文件(文本形式))
```sh
llvm-dis test.bc -o test.ll
```

* ### 2.3 [.ll]()(LLVM IR文件(文本形式)) -> [.bc]()(LLVM IR文件(二进制形式))
```sh
llvm-as test.ll -o test.bc
```

* ### 2.4 把多个 [.bc]() 合并为一个 [.bc]()
```sh
llvm-link test1.bc test2.bc -o test.bc
```

# 3 [.bc]()(LLVM IR文件(二进制形式)) -> [.s]()(汇编文件)
```sh
llc --march=x86-64 test.bc
```

# 4 [.s]()(汇编文件) -> [.o]()(可重定位的对象文件)
```sh
clang -c test.s -o test.o
```

# 5 [.o]()(可重定位的对象文件) -> [elf]()(可执行文件)
```sh
ld.lld -e main -o test test.o
```

* ### 5.1 不链接C库需要手动退出，在[main]()函数返回前进行系统调用
```c
// x86-linux
asm(
    "movq $0, %rdi \n\t"
    "movq $1, %rax \n\t"
    "syscall \n\t"
);
```

```c
// x64-linux
asm(
    "movq $0, %rdi \n\t"
    "movq $60, %rax \n\t"
    "syscall \n\t"
);
```

* ### 5.2 如果使用了C API则需要链接C库

```
# Debian/Ubuntu
ld.lld -dynamic-linker /lib64/ld-linux-x86-64.so.2 -o test test.o /lib/x86_64-linux-gnu/crt1.o /lib/x86_64-linux-gnu/crti.o /lib/x86_64-linux-gnu/crtn.o /lib/x86_64-linux-gnu/libc.so

# RedHat/CentOS/RockyLinux
ld.lld -dynamic-linker /lib64/ld-linux-x86-64.so.2 -o test test.o /lib64/crt1.o /lib64/crti.o /lib64/crtn.o /lib64/libc.so
```

# [ll]()文件语法参考
> [LangRef](https://llvm.org/docs/LangRef.html#module-structure)
