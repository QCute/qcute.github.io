---
title: "Rust async/await初探"
date: 2020-03-09T00:00:00+08:00
categories: ["rust"]
---

## 1. async/await

异步函数
```rust
async fn f0() -> u32 {
    let f1 = f1().await;
    let f2 = f2().await;
    f1 + f2
}

async fn f1() -> u32 {
    1
}

async fn f2() -> u32 {
    2
}

```

生成的HIR
> [Playground](https://play.rust-lang.org/)左上角点HIR
```rust
async fn f0() -> /*impl Trait*/ 
    #[lang = "from_generator"](move |mut _task_context| {{
        let _t = {
            let f1 = match #[lang = "into_future"](f1()) {
                mut __awaitee =>
                    loop {
                        match unsafe { #[lang = "poll"](#[lang = "new_unchecked"](&mut __awaitee), #[lang = "get_context"](_task_context)) } {
                            #[lang = "Ready"] { 0: result } => break result,
                            #[lang = "Pending"] {} => { }
                        }
                        _task_context = (yield ());
                    },
            };
            let f2 = match #[lang = "into_future"](f2()) {
                mut __awaitee =>
                    loop {
                        match unsafe { #[lang = "poll"](#[lang = "new_unchecked"](&mut __awaitee), #[lang = "get_context"](_task_context)) } {
                            #[lang = "Ready"] { 0: result } => break result,
                            #[lang = "Pending"] {} => { }
                        }
                        _task_context = (yield ());
                    },
            };
            f1 + f2
        };
        _t
    }})

async fn f1() -> /*impl Trait*/
    #[lang = "from_generator"](move |mut _task_context| { 
        { let _t = { 1 }; _t } 
    })

async fn f2() -> /*impl Trait*/ 
    #[lang = "from_generator"](move |mut _task_context| { 
        { let _t = { 2 }; _t } 
    })

```

翻译一下

```rust
async fn f0() -> impl Future {
    std::future::from_generator(move |mut _task_context| {
        let f1 = match std::future::IntoFuture::into_future(f1()) {
            mut __awaitee => 
                loop {
                    match unsafe { std::future::Future::poll(std::pin::Pin::new_unchecked(&mut __awaitee), std::future::get_context(_task_context)) } {
                        std::task::Poll::Ready(result) => break result,
                        std::task::Poll::Pending => {}
                    }
                    _task_context = (yield ());
                }
        };
        let f2 = match std::future::IntoFuture::into_future(f2()) {
            mut __awaitee => 
                loop {
                    match unsafe { std::future::Future::poll(std::pin::Pin::new_unchecked(&mut __awaitee), std::future::get_context(_task_context)) } {
                        std::task::Poll::Ready(result) => break result,
                        std::task::Poll::Pending => {}
                    }
                    _task_context = (yield ());
                }
        }
        f1 + f2
    });
}

async fn f1() -> impl Future {
    std::future::from_generator(move |mut _task_context| {
        1
    });
}

async fn f2() -> impl Future {
    std::future::from_generator(move |mut _task_context| {
        2
    });
}

```

可见, async函数/lambda/代码块等生成拥有[Future](https://doc.rust-lang.org/stable/std/future/trait.Future.html)特性的对象, await则生成yield的循环  

## 2. yield  
yield关键字会把代码重写成[Generator](https://doc.rust-lang.org/stable/std/ops/trait.Generator.html)状态机

```rust
#![feature(generators, generator_trait)]
use std::ops::{Generator, GeneratorState};

fn main() {
    let a: i32 = 1;
    let mut generator = move || {
        println!("start");
        yield a + 2;
        println!("Hello");
        yield a * 2;
        println!("world!");
    };

    Pin::new(&mut generator).resume(());
    Pin::new(&mut generator).resume(());
}
```

上述代码会生成下面类似代码  

```rust
use std::ops::Generator;
use std::ops::GeneratorState;
use std::pin::Pin;

enum GeneratorStateMachine {
    Enter(i32),
    Yield1(i32),
    Yield2(i32),
    Exit,
}

impl Generator for GeneratorStateMachine {
    type Yield = i32;
    type Return = ();
    fn resume(&mut self) -> GeneratorState<Self::Yield, Self::Return> {
        // lets us get ownership over current state
        match std::mem::replace(self, GeneratorStateMachine::Exit) {
            GeneratorStateMachine::Enter(a) => {
                println!("start");
                /*---- code before yield 1 ----*/
                *self = GeneratorStateMachine::Yield1(a + 2);
                GeneratorState::Yield(a)
            }
            GeneratorStateMachine::Yield1(a) => {
                /*----- code after yield 1 -----*/
                println!("Hello");
                *self = GeneratorStateMachine::Yield2(a * 2);
                /*----- code before yield 2 -----*/
                GeneratorState::Yielded(a * 2)
            }
            GeneratorStateMachine::Yield2(_) => {
                /*----- code after yield 2 -----*/
                println!("world!");
                *self = GeneratorStateMachine::Exit;
                GeneratorState::Complete(())
            }
            GeneratorStateMachine::Exit => 
                panic!("Can't advance an exited generator!")
        }
    }
}

fn main() {
    let a: i32 = 1;
    let mut generator = move || {
        GeneratorStateMachine::Enter(a)
    };

    Pin::new(&mut generator).resume(()); // 1 + 2 = 3
    Pin::new(&mut generator).resume(()); // 3 * 2 = 6
}
```

这种实现方式的特点是, 状态对象捕获和储存变量到自身, 无需切换上下文(CPU状态保存和恢复的消耗), 无动态堆/栈分配, 完全契合rust零开销抽象的原则  

## 参考
> [generators](https://doc.rust-lang.org/beta/unstable-book/language-features/generators.html)
