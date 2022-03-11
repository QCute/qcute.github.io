---
title: "拦截类静态变量"
date: 2020-03-06T00:00:00+08:00
categories: ["js"]
---

```js
class DUMMY {
    static {
        Object.defineProperty(this, staticMember, {
            configurable: false,
            enumerable: false,
            get(): unknown {
                console.log(`[GET 拦截]: 尝试读取属性 "staticMember"`);
                return this.staticMember;
            },
            set(value: unknown) {
                console.log(`[SET 拦截]: 尝试写入属性 "staticMember"`, value);
                this.staticMember = value;
            },
        });
    }
    static staticMember = 0;
}
```
