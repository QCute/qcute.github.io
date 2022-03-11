---
title: "JS简单随机密码"
date: 2020-03-06T00:00:00+08:00
categories: ["js"]
---

```js
function randomPassword(length) {
    const charArray = [
        // 数字
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
        // 大写字母
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 
        // 小写字母
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    ];
    return Array.from({length}, () => charArray[Math.trunc(Math.random() * charArray.length)]).join("");
}
```
