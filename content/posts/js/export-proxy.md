---
title: "拦截全局对象globalThis"
date: 2020-03-06T00:00:00+08:00
categories: ["js"]
---

## 浏览器不行，[NodeJs](https://nodejs.org)等运行时可以

```js
Object.setPrototypeOf(globalThis, new Proxy(Object.create(null), {

    get(target: object, property: string|symbol, receiver: object) {
        console.log(`[GET 拦截]: 尝试读取属性 "${String(property)}"`);

        return Reflect.get(target, property, receiver);
    },

    set(target: object, property: string|symbol, value: unknown, receiver: object): boolean {
        console.log(`[SET 拦截]: 尝试设置属性 "${String(property)}" =`, value);

        return Reflect.set(target, property, value, receiver);
    },

    has(target: object, property: string|symbol): boolean {
        console.log(`[HAS 拦截]: 检查属性 "${String(property)}" 是否存在`);

        return Reflect.has(target, property);
    }
}));
```
