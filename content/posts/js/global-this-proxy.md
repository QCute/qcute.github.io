---
title: "拦截ES6模块导出变量"
date: 2020-03-06T00:00:00+08:00
categories: ["js"]
---

```js

const handler = {
    get(target, prop, receiver) {
        console.log(`[Intercept Read] 属性 '${String(prop)}' 被读取了。`);

        return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
        console.log(`[Intercept Write] 属性 '${String(prop)}' 试图被修改为: ${value}`);

        return Reflect.set(target, prop, value, receiver);
    }
};

const internalState = {
    x: 1,
};

const exportProxy = new Proxy(internalState, handler);

export const x = exportProxy.x;

export default exportProxy;

```
