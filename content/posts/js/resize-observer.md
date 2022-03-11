---
title: "使用ResizeObserver监听元素大小变化"
date: 2020-03-06T00:00:00+08:00
categories: ["js"]
---

在前端页面中，由于div元素没有相应onresize事件，当[ECharts](https://echarts.apache.org/)图形在容器div发生变化时，没有像浏览器窗口发生变化的时候能够自适应调整大小。

在窗口变化时，有效
```js
// 正常
window.onresize = () => chart.resize();
```

在div容器变化时，无效
```js
// 无效
document.querySelector('#chart').onresize = () => chart.resize();
```

其他[JQuery](https://github.com/jquery/jquery)的解决方案都太麻烦了，最简单的就是使用[ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) API监听div容器的变化  
```js
(new ResizeObserver(() => chart.resize())).observe(document.querySelector('#chart'));
```

记得注意下[浏览器兼容性](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#browser_compatibility)  
